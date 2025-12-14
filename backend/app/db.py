import psycopg2
from app.config import DATABASE_URL

def get_connection():
    """Establish a database connection using the DATABASE_URL from config."""
    conn = psycopg2.connect(DATABASE_URL)
    return conn