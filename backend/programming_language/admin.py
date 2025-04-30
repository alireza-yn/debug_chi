from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(ProgrammerSkill)
admin.site.register(ProgrammerExpertise)
admin.site.register(ProgrammingLanguage)
