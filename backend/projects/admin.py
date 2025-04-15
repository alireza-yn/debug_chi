from django.contrib import admin

# Register your models here.
from .models import Bid,EducationProject


admin.site.register(Bid)
admin.site.register(EducationProject)