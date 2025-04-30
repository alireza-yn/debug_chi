from rest_framework.permissions import BasePermission
from auths.models import Role
class HasRolePermission(BasePermission):
    """
    Allows access only to users with a specific role.
    """

    def __init__(self, required_role):
        self.required_role = required_role  # نقش مورد نیاز را هنگام مقداردهی مشخص می‌کنیم.

    def has_permission(self, request, view):
        # ابتدا بررسی می‌کنیم که کاربر احراز هویت شده است
        if not request.user or not request.user.is_authenticated:
            return False
        print(self.required_role)
        # بررسی اینکه آیا کاربر نقش مورد نظر را دارد
        
        return request.user.user_roles.filter(name=self.required_role).exists()

class IsDebugger(BasePermission):
    """
    اجازه دسترسی فقط به کاربرانی داده می‌شود که نقش 'Debugger' را داشته باشند.
    """

    def has_permission(self, request, view):
        # بررسی احراز هویت کاربر
        if not request.user or not request.user.is_authenticated:
            return False
        
        # بررسی اینکه آیا کاربر نقش "Debugger" را دارد
        return request.user.user_roles.filter(name="debugger").exists()
    
class RoleMixin:
    def has_role(self, user, role_name: str) -> bool:
        return user.user_roles.filter(name=role_name).exists()