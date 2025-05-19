from django.contrib import admin

# Register your models here.
from .models import Bid,EducationProject,TenderProject


admin.site.register(Bid)
admin.site.register(EducationProject)
admin.site.register(TenderProject)