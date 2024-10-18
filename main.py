import eel
import sys
from pathlib import Path

# Add the parent directory of the current file to the Python path
sys.path.append(str(Path(__file__).parent))
import  functions 

eel.init("web")  # EEL initialization

eel.start("main.html", size=(1000, 800))  # Starting the App 
