# import requests
# import json

# headers = {
#     'Authorization': 'Bearer sk-7c5371ca2a70048898931c4c448017ad'
# }

# data = {
#     'text': 'کمکی که نیاز دارید در چه حوزه های است',
#     'server': 'farsi',
#     'sound': '1'
# }
# url = 'https://api.talkbot.ir/v1/media/text-to-speech/REQ'

# response = requests.post(url, headers=headers, data=data)

# if response.status_code == 200:
#     data = response.json()
#     data["response"]['download']
#     print(data["response"]['download'])
    
    
# else:
#     print(f'Error: {response.status_code} - {response.text}')
    
    
import uuid

print(uuid.uuid4())
