import eel
import sys
from pathlib import Path

# Add the parent directory of the current file to the Python path
sys.path.append(str(Path(__file__).parent))
import functions 

# Initialize Eel with the web directory
eel.init("web")  # EEL initialization

# Start the application on port 8080
eel.start("main.html", size=(1000, 1000), port=8081)  # Starting the App
