import subprocess
import sys
import os
import signal
import time
from threading import Thread
import platform

def run_django():
    try:
        os.chdir('backend')
        # Use python3 explicitly on Linux/Ubuntu
        python_cmd = 'python3' if platform.system() != 'Windows' else sys.executable
        subprocess.run([python_cmd, 'manage.py', 'runserver', '0.0.0.0:8000'])
    except Exception as e:
        print(f"Error running Django: {str(e)}")
        sys.exit(1)

def run_fastapi():
    try:
        os.chdir('backend/deepseek_chat')
        # Use python3 explicitly on Linux/Ubuntu
        python_cmd = 'python3' if platform.system() != 'Windows' else sys.executable
        subprocess.run([python_cmd, 'app.py'])
    except Exception as e:
        print(f"Error running FastAPI: {str(e)}")
        sys.exit(1)

def main():
    # Store the original directory
    original_dir = os.getcwd()
    
    try:
        print("Starting services...")
        print("Django will run on http://0.0.0.0:8000")
        print("FastAPI will run on http://0.0.0.0:8001")
        
        # Start Django in a separate thread
        django_thread = Thread(target=run_django)
        django_thread.daemon = True
        django_thread.start()
        
        # Wait a bit for Django to start
        time.sleep(2)
        
        # Change back to original directory
        os.chdir(original_dir)
        
        # Start FastAPI
        run_fastapi()
        
    except KeyboardInterrupt:
        print("\nShutting down services...")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main() 