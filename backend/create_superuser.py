import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'skywalker.settings')
django.setup()

from auths.models import CustomUser

def create_superuser():
    try:
        if not CustomUser.objects.filter(is_superuser=True).exists():
            CustomUser.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123456'
            )
            print('Superuser created successfully!')
        else:
            print('Superuser already exists!')
    except Exception as e:
        print(f'Error creating superuser: {e}')

if __name__ == '__main__':
    create_superuser() 