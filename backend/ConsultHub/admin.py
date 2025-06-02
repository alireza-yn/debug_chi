from django.contrib import admin
from programming_language.models import ProgrammingLanguage, ProgrammerSkill, ProgrammerExpertise
from user_resume.models import UserLanguage, UserSkill, UserSocialMediaLinks, UserExpertise, UserPortfolio
from questions.models import Category, Answer, AiCategoryQuestion, AiQuestion, AiQuestionAnswer
from auths.models import OTP, Role
from projects.models import EducationProject, Bid
from post.models import PostGroup
from management.models import Project
from .models import DebugSession, ConsultSession

@admin.register(DebugSession)
class DebugSessionAdmin(admin.ModelAdmin):
    list_display = ('title', 'session_id', 'debuger', 'debuger_applicator', 'status', 'price', 'created_at')
    list_filter = ('status', 'mode', 'is_realtime', 'is_locked', 'is_payed', 'is_rejected')
    search_fields = ('title', 'description', 'session_id')
    readonly_fields = ('session_id', 'created_at', 'updated_at')
    fieldsets = (
        ('اطلاعات اصلی', {
            'fields': ('title', 'session_id', 'description', 'file')
        }),
        ('اطلاعات کاربران', {
            'fields': ('debuger', 'debuger_applicator', 'rejected_by')
        }),
        ('وضعیت و زمان', {
            'fields': ('status', 'start_at', 'close_at', 'time')
        }),
        ('تنظیمات', {
            'fields': ('mode', 'price', 'discount', 'is_realtime', 'is_locked', 'is_payed', 'is_rejected')
        }),
    )

@admin.register(ConsultSession)
class ConsultSessionAdmin(admin.ModelAdmin):
    list_display = ('title', 'session_id', 'consult', 'consult_applicator', 'status', 'price', 'created_at')
    list_filter = ('status', 'mode', 'is_realtime', 'is_locked', 'is_payed', 'is_rejected')
    search_fields = ('title', 'description', 'session_id', 'language')
    readonly_fields = ('session_id', 'created_at', 'updated_at')
    fieldsets = (
        ('اطلاعات اصلی', {
            'fields': ('title', 'session_id', 'description')
        }),
        ('اطلاعات کاربران', {
            'fields': ('consult', 'consult_applicator', 'rejected_by')
        }),
        ('وضعیت و زمان', {
            'fields': ('status', 'start_at', 'close_at')
        }),
        ('تنظیمات', {
            'fields': ('mode', 'price', 'discount', 'language', 'is_realtime', 'is_locked', 'is_payed', 'is_rejected')
        }),
    )
