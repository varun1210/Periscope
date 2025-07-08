from typing import List, Optional
from fastapi import UploadFile
from sqlalchemy.orm import Session

from ..models import User
from ..utils import validate_file_upload
from ..supabase import SupabaseConnection
from ..utils import StandardHTTPException


class FileService:
    
    def __init__(self, db: Session, supabase_connection: SupabaseConnection):
        self.db = db
        self.supabase_connection = supabase_connection
    
    async def save_resume(self, user: User, file: UploadFile) -> str:
        """Save uploaded resume file and return file path"""
        
        validate_file_upload(file)
        
        try:
            user_github_id = user.github_id
            supabase_client = self.supabase_connection.supabase_client
            bucket_name = self.supabase_connection.bucket
            file_content = await file.read()
            resume_to_update = "primary" if user.resume_paths[0] != "" else "secondary"
            file_path = f"test-resumes/{user_github_id}/{resume_to_update}/{file.filename}"
            
            response = await supabase_client.storage.from_(bucket_name).upload(
                file=file_content, 
                path=file_path,
                file_options={"content-type": file.content_type, "upsert" : "true"}
            )

            print(response)
            
            # if response.get('error'):
            #     raise StandardHTTPException(500, "Supabase server error. Could not upload file.", "SUPABASE_ERROR")
            
            return file_path
            
        except StandardHTTPException:
            raise
            
        except Exception as e:
            print(f"Unexpected error in File Upload: {str(e)}")
            raise StandardHTTPException(
                status_code=500,
                message="Internal server error during file upload",
                code="INTERNAL_SERVER_ERROR"
            )
    
    async def delete_file(self, file_path: str) -> bool:
        """Delete a single file from Supabase storage"""
        try:
            bucket_name = self.supabase_connection.bucket
            response = await self.supabase_connection.supabase_client.storage.from_(bucket_name).remove([file_path])
            
            if response.get('error'):
                print(f"Error deleting file {file_path}: {response['error']}")
                return False
            
            return True
            
        except Exception as e:
            print(f"Unexpected error deleting file {file_path}: {str(e)}")
            return False
    
    async def delete_multiple_files(self, file_paths: List[str]) -> bool:
        """Delete multiple files from Supabase storage"""
        if not file_paths:
            return True
        
        # Filter out empty paths
        valid_paths = [path for path in file_paths if path and path.strip()]
        
        if not valid_paths:
            return True
        
        try:
            bucket_name = self.supabase_connection.bucket
            response = await self.supabase_connection.supabase_client.storage.from_(bucket_name).remove(valid_paths)
            
            if response.get('error'):
                print(f"Error deleting files: {response['error']}")
                return False
            
            return True
            
        except Exception as e:
            print(f"Unexpected error deleting files: {str(e)}")
            return False
    
    async def cleanup_uploaded_file(self, file_path: str) -> None:
        """
        Cleanup a single uploaded file (used for transaction rollback).
        This method suppresses errors since cleanup failures shouldn't break the main error flow.
        """
        try:
            await self.delete_file(file_path)
        except Exception as cleanup_error:
            print(f"Warning: Failed to cleanup uploaded file {file_path}: {cleanup_error}")
    
    async def delete_user_files(self, user: User) -> bool:
        """Delete all resume files for a user"""
        if not user.resume_paths:
            return True
        
        return await self.delete_multiple_files(user.resume_paths)