import requests
import logging
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
    



def send_verification_code(mobile, code):
    url = 'https://api.sms.ir/v1/send/verify'
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'x-api-key': 'rX4ZsdADrnaDjrdpr8eG4rBW25lElddcvmMGjbIZvbOj2YJQqeSeODq78twjpT2e',
    }
    post_data = {
        'mobile': mobile,
        'templateId': '300543',
        'parameters': [
            {
                'name': 'code',
                'value': code
            }
        ]
    }
    
    try:
        response = requests.post(url, json=post_data, headers=headers)
        print(response.status_code)
        response.raise_for_status()
        response_body = response.text
        logging.info(f'SMS sent successfully: {response_body}')
        return response_body
    except requests.exceptions.RequestException as e:
        logging.error(f'Failed to send SMS: {e}')
        return False