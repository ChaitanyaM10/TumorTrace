import mysql.connector
import os
from dotenv import load_dotenv
import db_config

# Load environment variables from .env file
load_dotenv()

def init_db():
    # Connect without database first to create it
    try:
        conn = mysql.connector.connect(
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', ''),
            host=os.getenv('DB_HOST', 'localhost')
        )
        cursor = conn.cursor()
        
        with open('backend/schema.sql', 'r') as f:
            schema = f.read()
            
        # Execute each statement
        for statement in schema.split(';'):
            if statement.strip():
                cursor.execute(statement)
        
        conn.commit()
        print("Database initialized successfully.")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error initializing database: {e}")

if __name__ == '__main__':
    init_db()
