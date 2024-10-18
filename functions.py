import eel
import json
import os
from dotenv import load_dotenv
load_dotenv()
@eel.expose
def save_urls(urls):
    # Ouvrir une fenêtre de dialogue pour choisir le répertoire
    # Cacher la fenêtre principale

    """  file_path = filedialog.asksaveasfilename(
        defaultextension=".json",
        filetypes=[("JSON files", "*.json")],
        title="Save as"
    """
    default_directory = os.path.join(os.getcwd(), os.getenv("SAVES_PATH"))  # 'saved_files' est le dossier où vous voulez sauvegarder
    os.makedirs(default_directory, exist_ok=True)
    file_path = os.path.join(default_directory,os.getenv("URLS_FILES"))  # S
    if file_path:  # Vérifier si un chemin a été sélectionné
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(urls, f, ensure_ascii=False, indent=4)  # Écrire le JSON avec indentation
        print("Fichier sauvegardé avec succès à:", file_path)
    else:
        print("Sauvegarde annulée.")

import json
@eel.expose
def load_urls():
    try:
        default_directory = os.path.join(os.getcwd(), os.getenv("SAVES_PATH"))
        file_path = os.path.join(default_directory, os.getenv("URLS_FILES"))
        with open(file_path, 'r', encoding='utf-8') as f:
            urls = json.load(f)  # Charger le contenu du fichier JSON
            #filter_urls(current_category)  # Appeler la fonction pour filtrer les URLs
            print('URLs chargées avec succès!')
    except Exception as error:
        print('Erreur lors du chargement du fichier JSON:', error)
    return urls
# Exemple d'utilisation


# Assurez-vous que filter_urls et current_category sont définis dans votre code
