from django.apps import AppConfig
from django.db.models.signals import post_migrate
from django.conf import settings
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

class SkywalkerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'skywalker'

    def ready(self):
        post_migrate.connect(self.create_database_if_not_exists, sender=self)

    def create_database_if_not_exists(self, sender, **kwargs):
        try:
            # اتصال به دیتابیس postgres پیش‌فرض
            conn = psycopg2.connect(
                user=settings.DATABASES['default']['USER'],
                password=settings.DATABASES['default']['PASSWORD'],
                host=settings.DATABASES['default']['HOST'],
                port=settings.DATABASES['default']['PORT']
            )
            conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
            cursor = conn.cursor()
            
            # بررسی وجود دیتابیس
            cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", 
                          (settings.DATABASES['default']['NAME'],))
            exists = cursor.fetchone()
            
            if not exists:
                # ایجاد دیتابیس
                cursor.execute(f"CREATE DATABASE {settings.DATABASES['default']['NAME']}")
                print(f"Database {settings.DATABASES['default']['NAME']} created successfully!")
            
            cursor.close()
            conn.close()
            
        except Exception as e:
            print(f"Error creating database: {e}")