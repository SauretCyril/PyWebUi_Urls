window.urls = [];
let currentCategory = 'Tous';
const categories = ['Blog', 'Actualités', 'Technologie', 'Éducation', 'Autre'];

function addURL() {
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const email = document.getElementById('email').value;
    const category = document.getElementById('category').value;
    
    // Vérification des valeurs pour éviter les valeurs nulles
    if (title && url && category) {
        if (isValidURL(url) && (email === '' || isValidEmail(email))) {
            window.urls.push({ title, url, email, category });
            filterURLs(currentCategory);
            clearForm();
            //eel.save_urls(urls)
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
        urlItem.innerHTML = `
            <h3>${item.title}</h3>
            <p class="url-link"><a href="#" onclick="openUrl(${index}); return false;">${truncateURL(item.url, 20)}</a></p>
            <p>${truncateEmail(item.email, 15)}</p>
            <p>${item.category}</p>
            <select class="category-select" onchange="editCategory(${index}, this.value)">
                ${categories.map(cat => `<option value="${cat}" ${cat === item.category ? 'selected' : ''}>${cat}</option>`).join('')}
            </select>
            <button class="edit-category" onclick="updateCategory(${index})">Modifier</button>
        `;
        urlList.appendChild(urlItem);
        
    });
}
function openUrl(index){
    eel.openUrl(window.urls[index].url);
}

function truncateURL(url, maxLength) {
    if (url.length <= maxLength) return url;
    return url.substr(0, maxLength - 3) + '...';
}

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
}

function updateCategory(index) {
    filterURLs(currentCategory);
}



function loadURLs() {
    /* const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                urls = JSON.parse(e.target.result);
                filterURLs(currentCategory);
                alert('URLs chargées avec succès!');
            } catch (error) {
                alert('Erreur lors du chargement du fichier JSON.');
            }
        };
        reader.readAsText(file);
    };
    input.click(); */
}

function toggleCreationSection() {
    const creationSection = document.querySelector('.creation-section');
    const displaySection = document.querySelector('.display-section');
    const toggleIcon = document.querySelector('.toggle-icon');
    
    creationSection.classList.toggle('hidden');
    displaySection.classList.toggle('full-width');
    toggleIcon.classList.toggle('rotated');
}

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
            alert('Erreur lors du chargement des URLs : ' + error.message);
        }
    }) // Appel de la fonction Python pour charger les URLs après le chargement du DOM
    
});
function saveURLs() {
eel.save_urls(window.urls);
}
