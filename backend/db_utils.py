import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from django.conf import settings

def create_database_if_not_exists():
    try:
        # Connect to default postgres database
        conn = psycopg2.connect(
            user=settings.DATABASES['default']['USER'],
            password=settings.DATABASES['default']['PASSWORD'],
            host=settings.DATABASES['default']['HOST'],
            port=settings.DATABASES['default']['PORT']
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", 
                      (settings.DATABASES['default']['NAME'],))
        exists = cursor.fetchone()
        
        if not exists:
            # Create database
            cursor.execute(f"CREATE DATABASE {settings.DATABASES['default']['NAME']}")
            print(f"Database {settings.DATABASES['default']['NAME']} created successfully!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error creating database: {e}") 