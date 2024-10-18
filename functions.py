import eel
import json
import os
from dotenv import load_dotenv
import re  # Ajouté pour la validation des URLs
import webbrowser

load_dotenv()

def is_valid_url(url):
    # Fonction pour valider les URLs
    regex = re.compile(
        r'^(?:http|ftp)s?://'  # Protocole
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'  # Domaine
        r'localhost|'  # Localhost
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|'  # Adresse IP
        r'\[?[A-F0-9]*:[A-F0-9:]+\]?)'  # Adresse IPv6
        r'(?::\d+)?'  # Port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    return re.match(regex, url) is not None

@eel.expose
def save_urls(urls):
    # Ouvrir une fenêtre de dialogue pour choisir le répertoire
    # Cacher la fenêtre principale

    # Validation des URLs
    invalid_urls = [url for url in urls if not is_valid_url(url)]
    if invalid_urls:
        print(f"Erreur: Les URLs suivantes ne sont pas valides: {invalid_urls}")
        return  # Ne pas sauvegarder si des URLs sont invalides

    default_directory = os.path.join(os.getcwd(), os.getenv("SAVES_PATH"))  # 'saved_files' est le dossier où vous voulez sauvegarder
    os.makedirs(default_directory, exist_ok=True)
    file_path = os.path.join(default_directory, os.getenv("URLS_FILES"))  # S
    if file_path:  # Vérifier si un chemin a été sélectionné
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(urls, f, ensure_ascii=False, indent=4)  # Écrire le JSON avec indentation
        print("Fichier sauvegardé avec succès à:", file_path)
    else:
        print("Sauvegarde annulée.")

@eel.expose
def load_urls():
    urls = []
    try:
        default_directory = os.path.join(os.getcwd(), os.getenv("SAVES_PATH"))
        file_path = os.path.join(default_directory, os.getenv("URLS_FILES"))
        
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Le fichier {file_path} n'existe pas.")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()  # Lire le contenu du fichier
            try:
                urls = json.loads(content)  # Charger le contenu du fichier JSON
                print('URLs chargées avec succès!')
            except json.JSONDecodeError:
                print(f'Erreur: Le fichier {file_path} n\'est pas un JSON valide.')
                return []  # Retourner une liste vide si le JSON est invalide
    except FileNotFoundError as fnf_error:
        print(f'Erreur: {fnf_error}')
    except Exception as error:
        print(f'Erreur lors du chargement du fichier JSON: {error}')
    
    return urls

# Exemple d'utilisation


# Assurez-vous que filter_urls et current_category sont définis dans votre code
@eel.expose
def openUrl(url):
    webbrowser.open(url)