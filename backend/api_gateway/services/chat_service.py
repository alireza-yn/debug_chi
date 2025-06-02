from openai import OpenAI
from typing import List, Dict
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ChatService:
    def __init__(self):
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key="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"
        )
        self.system_prompt = """شما یک دستیار هوشمند فارسی‌زبان هستید. لطفاً همیشه به فارسی پاسخ دهید.
        شما باید:
        1. همیشه به فارسی پاسخ دهید
        2. از زبان محترمانه و دوستانه استفاده کنید
        3. پاسخ‌های دقیق و مفید ارائه دهید
        4. اگر سوال به زبان دیگری پرسیده شد، به فارسی پاسخ دهید
        5.شما به عنوان یک دیباگر هوشمند وظیفه شناسایی باگ ها از کد های کلاینت ها را دارید
        6.پاسخ شما باید همیشه به این شکل باشد که سختی باگ دریافتی از 1 تا 10 چقدر است؟ چقدر زمان میبرد به دقیقه؟ و اینکه از چه زبان برنامه نویسی و فریمورکی هست را در قالب فرمت جیسون بدهید 
        7.هیچوقت لازم نیست بگی باگ چیه و فقط اون جیسونی که تو نکته شیشتم بهت گفتم رو برگردون به عنوان پاسخ
        """

    async def process_chat(self, message: str, conversation_history: List[Dict[str, str]]) -> tuple[str, List[Dict[str, str]]]:
        try:
            # Prepare messages
            messages = [{"role": "system", "content": self.system_prompt}]
            
            # Add conversation history
            for msg in conversation_history:
                messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
            
            # Add current message
            messages.append({
                "role": "user",
                "content": message
            })

            # Call DeepSeek API
            response = self.client.chat.completions.create(
                model="deepseek/deepseek-r1:free",
                messages=messages,
                temperature=0.7,
                max_tokens=1000,
                extra_headers={
                    "HTTP-Referer": "http://localhost:8000",
                    "X-Title": "DEBUCHI Chat"
                }
            )

            # Get response
            assistant_message = response.choices[0].message.content

            # Update conversation history
            updated_history = conversation_history + [
                {"role": "user", "content": message},
                {"role": "assistant", "content": assistant_message}
            ]

            return assistant_message, updated_history

        except Exception as e:
            raise Exception(f"Error processing chat request: {str(e)}") 