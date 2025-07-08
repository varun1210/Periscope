from fastapi import HTTPException

class StandardHTTPException(HTTPException):
    def __init__(self, status_code: int, message: str, code: str):
        self.status_code = status_code
        self.message = message 
        self.code = code
        super().__init__(status_code=status_code, detail={"error": message, "code": code})