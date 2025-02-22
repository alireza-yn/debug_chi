import requests
import json
from rest_framework.permissions import BasePermission

def send_request(url:str,data):
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    
    response = requests.post(url,json=data,headers=headers)
    print(response.json())
    result = response.json()
    if result['success'] == True :
        return True
    else:
        return False



class IsStaffPermission(BasePermission):
    """
    Allows access only to users with is_staff=True.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_staff