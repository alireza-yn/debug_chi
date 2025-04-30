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


mobiles_list = {
    "samsung": [{"name": "A20", "price": 2000}, {"name": "s24 ultra", "price": 20000}],
    "apple": [
        {"name": "iphone 16 Pro", "price": 21000},
        {"name": "iphone 16", "price": 18000},
    ],
}


total_buy = 0


# print(mobiles_list["apple"])


def brand_exist(brand):

    try:
        is_brand_exist = mobiles_list[brand]
        print(is_brand_exist)

    except:
        print("وجود ندارد")


brand_exist("samsung")


