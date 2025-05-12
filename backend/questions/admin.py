from django.contrib import admin
from .models import Category, Question, Answer,AiCategoryQuestion,AiQuestion,AiQuestionAnswer

# نمایش پاسخ‌ها در صفحه سوال
class AnswerInline(admin.TabularInline):  
    model = Answer
    extra = 2  # تعداد فیلدهای خالی اضافی برای وارد کردن پاسخ‌های جدید

# نمایش سوالات در صفحه دسته‌بندی
class QuestionInline(admin.TabularInline):  
    model = Question
    extra = 1  # امکان اضافه کردن سوالات جدید

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'text', 'sound')  # نمایش این فیلدها در لیست سوالات
    search_fields = ('text',)  # امکان جستجو در متن سوال
    inlines = [AnswerInline]  # نمایش پاسخ‌ها در صفحه سوال

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')  # نمایش این فیلدها در لیست دسته‌بندی‌ها
    search_fields = ('name',)  # امکان جستجو در نام دسته‌بندی

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('id', 'text', 'description')  # نمایش این فیلدها در لیست پاسخ‌ها
    search_fields = ('text',)  # امکان جستجو در پاسخ‌ها


admin.site.register(AiQuestionAnswer)
admin.site.register(AiCategoryQuestion)
admin.site.register(AiQuestion)



