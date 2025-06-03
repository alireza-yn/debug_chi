from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Role, OTP, UserBankCards, RequestPassowordReset, DebuggerExam, DebuggerExamScore

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    filter_horizontal = ('users',)

admin.site.register(CustomUser)
