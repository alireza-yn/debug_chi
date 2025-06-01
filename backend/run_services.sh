#!/bin/bash

# Make the script executable
chmod +x run_services.py

# Activate virtual environment if it exists
if [ -d "env" ]; then
    source env/bin/activate
fi

# Run the services
echo "Starting Django and FastAPI services..."
python3 run_services.py

# Keep the terminal open
read -p "Press Enter to exit..." 