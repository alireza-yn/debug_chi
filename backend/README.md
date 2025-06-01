#  DEBUCHI Backend Documentation

## Overview
This backend project is a comprehensive Django-based application that integrates multiple AI services and features. It includes a main Django application with various modules and a FastAPI microservice for AI chat functionality.

## Project Structure
```
backend/
├── ai_app/                    # AI Integration Module
│   ├── views.py              # AI service views (Gemini, DeepSeek)
│   └── urls.py               # AI endpoints routing
├── deepseek_chat/            # FastAPI Microservice
│   ├── app.py                # FastAPI application
│   ├── requirements.txt      # FastAPI dependencies
│   └── .env                  # Environment configuration
├── chat/                     # Chat Module
├── core/                     # Core Application Module
├── followers/                # User Followers Module
├── home/                     # Home Module
├── payments/                 # Payment Processing Module
├── post/                     # Post Management Module
├── programming_language/     # Programming Language Module
├── questions/                # Questions Module
├── report/                   # Reporting Module
├── tasks/                    # Background Tasks Module
├── tender/                   # Tender Management Module
├── user_resume/             # User Resume Module
├── manage.py                # Django Management Script
├── requirements.txt         # Main Project Dependencies
├── run_services.py          # Service Management Script
├── run_services.bat         # Windows Service Script
└── run_services.sh          # Linux Service Script
```

## Key Features

### 1. AI Integration
- **Gemini AI Integration**
  - Text generation and analysis
  - Custom model configuration
  - Error handling and response formatting

- **DeepSeek Chat Integration**
  - Real-time chat functionality
  - Conversation history management
  - Asynchronous processing

### 2. User Management
- User authentication and authorization
- Profile management
- Follower system
- Resume management

### 3. Content Management
- Post creation and management
- Programming language categorization
- Question and answer system
- Tender management

### 4. Payment Processing
- Secure payment integration
- Transaction management
- Payment history

### 5. Reporting System
- Custom report generation
- Data analytics
- Export functionality

## Technical Stack

### Core Technologies
- **Django**: Main web framework
- **FastAPI**: AI & Chat or any async feat microservice
- **PostgreSQL**: Primary database
- **Redis**: Caching and session management
- **Celery**: Background task processing

### AI Services
- Google Gemini AI
- DeepSeek AI
- Custom AI integrations

### Additional Services
- AWS S3: File storage
- Payment gateways
- Email services

## Setup and Installation

### Prerequisites
- Python 3.8+
- PostgreSQL
- Redis
- Virtual environment

### Installation Steps

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
   pip install -r requirements.txt
   cd deepseek_chat
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   Create necessary `.env` files with required configurations:
   ```
   # Main .env
   DEBUG=True
   SECRET_KEY=your_secret_key
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   REDIS_URL=redis://localhost:6379/0
   
   # DeepSeek .env
   DEEPSEEK_API_KEY=your_api_key
   API_HOST=0.0.0.0
   API_PORT=8001
   ```

5. **Database setup**:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

## Running the Application

### Development Environment

1. **Start all services**:
   ```bash
   # Windows
   .\run_services.bat
   
   # Linux/Ubuntu
   ./run_services.sh
   ```

2. **Access points**:
   - Django Admin: `http://localhost:8000/admin`
   - API Documentation: `http://localhost:8000/api/docs`
   - FastAPI Documentation: `http://localhost:8001/docs`

### Production Deployment

1. **Server requirements**:
   - Ubuntu 20.04+
   - Nginx
   - Gunicorn
   - Supervisor

2. **Deployment steps**:
   ```bash
   # Install system dependencies
   sudo apt update
   sudo apt install python3-venv python3-pip nginx supervisor

   # Configure firewall
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw allow 8000
   sudo ufw allow 8001
   ```

## API Documentation

### Main Endpoints

1. **AI Services**:
   - `POST /api/ask/`: Gemini AI endpoint
   - `POST /api/deepseek-chat/`: DeepSeek chat endpoint

2. **User Management**:
   - `POST /api/users/`: User registration
   - `GET /api/users/{id}/`: User profile
   - `POST /api/followers/`: Follow user

3. **Content Management**:
   - `POST /api/posts/`: Create post
   - `GET /api/posts/`: List posts
   - `POST /api/questions/`: Create question

4. **Payment Processing**:
   - `POST /api/payments/`: Process payment
   - `GET /api/payments/history/`: Payment history

## Security Considerations

1. **Authentication**:
   - JWT token-based authentication
   - Session management
   - Password hashing

2. **API Security**:
   - Rate limiting
   - CORS configuration
   - Input validation

3. **Data Protection**:
   - Environment variable management
   - Secure file storage
   - Database encryption

## Monitoring and Maintenance

1. **Logging**:
   - Application logs
   - Error tracking
   - Performance monitoring

2. **Backup**:
   - Database backups
   - File system backups
   - Configuration backups

3. **Updates**:
   - Dependency updates
   - Security patches
   - Feature updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

EVERY THING BELONGS TO M.MODHEJ ⭐😅