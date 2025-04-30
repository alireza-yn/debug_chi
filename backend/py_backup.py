import os
import django
from django.core.management import call_command

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'skywalker.settings')
    django.setup()

    with open('backup.json', 'w', encoding='utf-8') as f:
        call_command(
            'dumpdata',
            exclude=['contenttypes', 'auth.permission', 'sessions.session'],
            indent=2,
            stdout=f  # 👈 مستقیم خروجی بریز تو فایل
        )
