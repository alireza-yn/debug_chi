# DeepSeek Chat API DEBUG CHI

A FastAPI application that integrates with DeepSeek's chat model for conversational AI.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with your configuration:
```
DEEPSEEK_API_KEY=your_api_key_here
API_HOST=0.0.0.0
API_PORT=8000
```

## Running the API

Start the server:
```bash
python app.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /`: Health check endpoint
- `POST /api/chat`: Chat endpoint
  - Request body:
    ```json
    {
        "message": "Your message here",
        "conversation_history": [
            {"role": "user", "content": "Previous message"},
            {"role": "assistant", "content": "Previous response"}
        ]
    }
    ```

## Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc` 