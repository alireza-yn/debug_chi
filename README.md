# DeepSeek Chat Integration with Django

This project integrates DeepSeek's chat model with a Django application using FastAPI as a microservice. The integration allows for seamless communication between Django and the DeepSeek AI model while maintaining a clean architecture.

## Project Structure

```
backend/
├── ai_app/                    # Django application
│   ├── views.py              # Contains DeepSeekChatView
│   └── urls.py               # URL routing for chat endpoints
├── deepseek_chat/            # FastAPI microservice
│   ├── app.py                # FastAPI application
│   ├── requirements.txt      # Dependencies
│   └── .env                  # Environment variables
├── run_services.py           # Python script to run both services
├── run_services.bat          # Windows batch script
└── run_services.sh           # Linux/Ubuntu bash script
```

## Features

- **Django Integration**: Seamless integration with existing Django application
- **FastAPI Microservice**: Separate service for DeepSeek chat functionality
- **Cross-Platform Support**: Works on both Windows and Linux/Ubuntu servers
- **Unified Service Management**: Run both services with a single command
- **Error Handling**: Robust error handling and logging
- **CORS Support**: Secure cross-origin resource sharing
- **Environment Configuration**: Flexible configuration through .env files

## Setup

### Prerequisites

- Python 3.8+
- Django
- FastAPI
- DeepSeek API key

### Installation

1. **Clone the repository**

2. **Set up virtual environment**:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Ubuntu
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   # Install Django dependencies
   pip install -r requirements.txt

   # Install FastAPI dependencies
   cd deepseek_chat
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   Create `.env` file in `deepseek_chat` directory:
   ```
   DEEPSEEK_API_KEY=your_api_key_here
   API_HOST=0.0.0.0
   API_PORT=8001
   ```

## Running the Services

### Windows

1. **Using batch script**:
   - Double-click `run_services.bat`
   - Or run in terminal:
     ```bash
     .\run_services.bat
     ```

2. **Using Python script**:
   ```bash
   python run_services.py
   ```

### Linux/Ubuntu

1. **Make scripts executable**:
   ```bash
   chmod +x run_services.sh
   chmod +x run_services.py
   ```

2. **Run using bash script**:
   ```bash
   ./run_services.sh
   ```

3. **Or using Python script**:
   ```bash
   python3 run_services.py
   ```

## API Endpoints

### Django Endpoints
- `POST /api/deepseek-chat/`: Main chat endpoint
  ```json
  {
      "message": "Your message here",
      "conversation_history": [
          {"role": "user", "content": "Previous message"},
          {"role": "assistant", "content": "Previous response"}
      ]
  }
  ```

### FastAPI Endpoints
- `GET /`: Health check
- `POST /api/chat`: Chat endpoint
- `GET /docs`: Swagger documentation
- `GET /redoc`: ReDoc documentation

## Server Deployment

### Ubuntu/Linux Server Setup

1. **Install dependencies**:
   ```bash
   sudo apt update
   sudo apt install python3-venv python3-pip
   ```

2. **Configure firewall**:
   ```bash
   sudo ufw allow 8000
   sudo ufw allow 8001
   ```

3. **Run services**:
   ```bash
   ./run_services.sh
   ```

### Nginx Configuration (Optional)

```nginx
# Django
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# FastAPI
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Error Handling

The application includes comprehensive error handling:
- API connection errors
- Invalid requests
- Server errors
- Environment configuration errors

## Security Considerations

1. **API Key Protection**:
   - Store API keys in environment variables
   - Never commit .env files to version control

2. **CORS Configuration**:
   - Configured to allow specific origins
   - Can be customized for production

3. **Server Security**:
   - Use HTTPS in production
   - Configure proper firewall rules
   - Implement rate limiting if needed

## Troubleshooting

1. **Service won't start**:
   - Check if ports 8000 and 8001 are available
   - Verify environment variables
   - Check Python version compatibility

2. **API connection issues**:
   - Verify DeepSeek API key
   - Check network connectivity
   - Review CORS settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 