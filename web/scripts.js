window.urls = [];
let currentCategory = 'Tous';
const categories = ['Portail', 'Notion', 'Outils', 'Profiles', 'Autre'];

function addURL() {
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const email = document.getElementById('email').value;
    const category = document.getElementById('category').value;

    // Initialisation de window.urls si ce n'est pas déjà fait
    if (!window.urls) {
        window.urls = [];  // Initialisation de l'array
    }
    
    // Vérification des valeurs pour éviter les valeurs nulles
    if (title && url && category) {
        if (isValidURL(url) && (email === '' || isValidEmail(email))) {
            window.urls.push({ title, url, email, category });
            filterURLs(currentCategory);
            clearForm();
            saveURLs();
        } else {
            alert("Veuillez entrer une URL valide et un email valide (si fourni)!");
        }
    } else {
        alert("Veuillez remplir au moins le titre, l'URL et la catégorie!");
    }
}

function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;  
    }
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('url').value = '';
    document.getElementById('email').value = '';
    document.getElementById('category').value = 'Blog';
}

function filterURLs(category) {
    currentCategory = category;
    const filteredURLs = category === 'Tous' 
        ? urls 
        : window.urls.filter(item => item.category === category);
    
    updateURLList(filteredURLs);
    updateTabs(category);
}

function updateURLList(urlsToShow) {
    const urlList = document.getElementById('urlList');
    urlList.innerHTML = '';
    
    urlsToShow.forEach((item, index) => {
        const urlItem = document.createElement('div');
        urlItem.className = 'url-item';
        // Définir la couleur de fond en fonction de la catégorie
        switch (item.category) {
            case 'Portail':
                urlItem.style.backgroundColor = 'lightblue'; // Couleur pour Portail
                break;
            case 'Notion':
                urlItem.style.backgroundColor = 'lightcoral'; // Couleur pour Tables
                break;
            case 'Outils':
                urlItem.style.backgroundColor = 'lightyellow'; // Couleur pour Outils
                break;
            case 'Profiles':
                urlItem.style.backgroundColor = 'lightgreen'; // Couleur pour Profiles
                break;
            case 'Autre':
                urlItem.style.backgroundColor = 'lightgray'; // Couleur pour Autre
                break;
            default:
                urlItem.style.backgroundColor = ''; // Couleur par défaut
        }
        urlItem.innerHTML = createUrlItem(item, index);
        
        // Add click event to fill the creation fields
        urlItem.onclick = () => {
            // Réinitialiser la couleur de fond de tous les éléments
            const allUrlItems = document.querySelectorAll('.url-item');
            allUrlItems.forEach(item => {
                item.style.backgroundColor = ''; // Réinitialise la couleur de fond
            });

            // Mettre à jour les champs de saisie
            document.getElementById('title').value = item.title;
            document.getElementById('url').value = item.url;
            document.getElementById('email').value = item.email;
            document.getElementById('category').value = item.category;

            // Changer la couleur de fond de l'élément cliqué
            urlItem.style.backgroundColor = 'lightgreen'; // Ajout de la couleur de fond
        };

        urlList.appendChild(urlItem);
    });
}

function createUrlItem(item, index) {
    return `
        <div style="position: relative;">
            <button class="delete-url" onclick="deleteURL(${index})" style="position: absolute; top: -10; right: -10; background: none; border: none; color: red; font-size: 16px;">✖</button>
            <input type="text" value="${item.title}" onchange="updateTitle(${index}, this.value)" />
            <p class="url-link"><a href="#" onclick="openUrl('${item.title}'); return false;">${truncateURL(item.url, 20)}</a></p>
            <p>${truncateEmail(item.email, 15)}</p>
            <p>${item.category}</p>
            <select class="category-select" onchange="editCategory(${index}, this.value)">
                ${categories.map(cat => `<option value="${cat}" ${cat === item.category ? 'selected' : ''}>${cat}</option>`).join('')}
            </select>
            <img src="path/to/disk-icon.png" alt="Modifier" class="edit-category" onclick="updateCategory(${index})" style="cursor: pointer;" />
        </div>
    `;
}

// ouverture de du navigateur avec l'url
// cyril sauret correcton on ouvre pas avec l'index qui corresponde à l'élément dans le tableau filtré 
// mais avec le bon item Urs en le trouvant avec son title 
function openUrl(title){
    console.log(title);
      if (window.urls) {
        const urlItem = window.urls.find(item => item.title === title);
        if (urlItem) {
            eel.openUrl(urlItem.url);
        } else {
            console.log('URL non trouvée pour le titre : ' + title);
        }
    } else {
        console.log('window.urls n\'existe pas.');
    } 
}

//racourci de l'url
function truncateURL(url, maxLength) {
    if (url.length <= maxLength) return url;
    return url.substr(0, maxLength - 3) + '...';
}

//raccourci de l'email
function truncateEmail(email, maxLength) {
    if (!email) return 'Non fourni';
    if (email.length <= maxLength) return email;
    const [username, domain] = email.split('@');
    const truncatedUsername = username.substr(0, maxLength - domain.length - 4) + '...';
    return `${truncatedUsername}@${domain}`;
}

function updateTabs(activeCategory) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        if (tab.textContent === activeCategory) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

function sortURLs() {
    const sortBy = document.getElementById('sortBy').value;
    window.urls.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    filterURLs(currentCategory);
}

function editCategory(index, newCategory) {
    window.urls[index].category = newCategory;
    saveURLs();
}

function updateCategory(index) {
    filterURLs(currentCategory);
}

function updateTitle(index, newTitle) {
    window.urls[index].title = newTitle;
    saveURLs();
}

function updateURL() {
    const urlList = document.getElementById('urlList');
    const urlToUpdate = document.getElementById('url').value; // L'URL à mettre à jour
    const titleToUpdate = document.getElementById('title').value; // Le titre associé à l'URL

    // Vérifiez si l'URL existe déjà dans la liste
    const existingURL = Array.from(urlList.children).find(item => item.dataset.url === urlToUpdate);

    if (existingURL) {
        // Mettez à jour le titre ou d'autres informations si nécessaire
        existingURL.querySelector('.url-title').textContent = titleToUpdate; // Supposons que le titre est dans un élément avec la classe 'url-title'
        alert('URL mise à jour avec succès!');
    } else {
        alert('L\'URL n\'existe pas.');
    }
    
    saveURLs(); // Sauvegarde les modifications
}

// function de fin de  chargement de la page Urls puis chargement du fichier 
// des Urls
window.addEventListener('load', function() {
    const creationSection = document.querySelector('.creation-section');
    const displaySection = document.querySelector('.display-section');
    
    if (creationSection.classList.contains('hidden')) {
        displaySection.classList.add('full-width');
    }
    
    //Convertir le JSON en tableau
    
    eel.load_urls()(jurls => { 
        try {
            urls = jurls //JSON.parse(jurls);
            filterURLs('Tous');
        } catch (error) {
            console.log('Erreur lors du chargement des URLs : ' + error.message);
        }
    }) // Appel de la fonction Python pour charger les URLs après le chargement du DOM
    
});

//function de sauvegarde du fichier des url
function saveURLs() {
    eel.save_urls(window.urls);
}

function deleteURL(index) {
    window.urls.splice(index, 1); // Supprime l'URL de l'array
    filterURLs(currentCategory); // Met à jour l'affichage
    saveURLs(); // Sauvegarde les modifications
}
