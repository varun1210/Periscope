from typing import Optional
from supabase import acreate_client, AsyncClient
from .config import settings

class SupabaseConnection():
    def __init__(self):
        # create_client returns a coroutine, not the client
        # self.supabase_client: AsyncClient = acreate_client(settings.supabase_url, settings.supabase_key)
        self.supabase_client: Optional[AsyncClient] = None
        self.bucket: str = settings.supabase_bucket_name
    
    async def initialize(self):
        """Async initialization method"""
        self.supabase_client = await acreate_client(settings.supabase_url, settings.supabase_key)

supabase_connection: Optional[SupabaseConnection] = None

def get_supabase_connection() -> SupabaseConnection:
    if supabase_connection is None:
        raise RuntimeError("Supabase client has not been initialized.")
    return supabase_connection

async def init_supabase_connection():
    global supabase_connection
    print("Initializing Supabase connection...")
    supabase_connection = SupabaseConnection()
    await supabase_connection.initialize() 
    print("Supabase connection initialized!")