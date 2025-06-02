import subprocess
import sys
import threading
import time
import os
import platform

def run_django():
    try:
        # Get the current directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Use python3 on Linux/Ubuntu, sys.executable on Windows
        python_cmd = 'python3' if platform.system() != 'Windows' else sys.executable
        
        # Run Django server with explicit settings module
        django_process = subprocess.Popen(
            [python_cmd, 'manage.py', 'runserver', '0.0.0.0:8000', '--noreload'],
            cwd=current_dir,
            env=dict(os.environ, DJANGO_SETTINGS_MODULE='skywalker.settings')
        )
        django_process.wait()
    except Exception as e:
        print(f"Error running Django: {str(e)}")
        sys.exit(1)

def run_fastapi():
    try:
        # Get the current directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Use python3 on Linux/Ubuntu, sys.executable on Windows
        python_cmd = 'python3' if platform.system() != 'Windows' else sys.executable
        
        # Run FastAPI server using uvicorn
        fastapi_process = subprocess.Popen(
            [python_cmd, '-m', 'uvicorn', 'api_gateway.app:app', '--host', '0.0.0.0', '--port', '8001', '--reload'],
            cwd=current_dir
        )
        fastapi_process.wait()
    except Exception as e:
        print(f"Error running FastAPI: {str(e)}")
        sys.exit(1)

def main():
    print("Starting services...")
    print("Django will run on http://0.0.0.0:8000")
    print("FastAPI will run on http://0.0.0.0:8001")
    
    # Create threads for each service
    django_thread = threading.Thread(target=run_django)
    fastapi_thread = threading.Thread(target=run_fastapi)
    
    # Start both services
    django_thread.start()
    time.sleep(2)  # Give Django a head start
    fastapi_thread.start()
    
    try:
        # Keep the main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down services...")
        sys.exit(0)

if __name__ == "__main__":
    main() 