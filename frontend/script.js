// DOM Elements - MATCHING YOUR HTML IDS
const searchInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('results');
const favouritesContainer = document.getElementById('favoritesList');
const loadingIndicator = document.getElementById('loading');

// Load favourites from localStorage
let favourites = JSON.parse(localStorage.getItem('favourites')) || [];

// Display favourites on page load
displayFavourites();

// Event listeners
searchBtn.addEventListener('click', () => searchCity());
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchCity();
});

// Show/hide loading function
function showLoading(show) {
    if (loadingIndicator) {
        loadingIndicator.classList.toggle('hidden', !show);
    }
}

// Search function
async function searchCity() {
    const city = searchInput.value.trim();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`/api/places?city=${encodeURIComponent(city)}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch attractions');
        }
        
        const attractions = await response.json();
        
        if (attractions.length === 0) {
            resultsContainer.innerHTML = `<div class="no-results">No attractions found for "${city}". Try another city.</div>`;
        } else {
            displayAttractions(attractions);
        }
    } catch (error) {
        console.error('Error:', error);
        resultsContainer.innerHTML = `<div class="error">${error.message}. Please try again.</div>`;
    } finally {
        showLoading(false);
    }
}

// Display attractions
function displayAttractions(attractions) {
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    attractions.forEach(attraction => {
        const card = document.createElement('div');
        card.className = 'attraction-card';
        
        const isFavourite = favourites.some(fav => fav.name === attraction.name);
        
        card.innerHTML = `
            <img src="${attraction.image}" alt="${attraction.name}" class="attraction-image" onerror="this.src='https://via.placeholder.com/400x250?text=No+Image'">
            <div class="attraction-info">
                <h3>${escapeHtml(attraction.name)}</h3>
                <p>${escapeHtml(attraction.description.substring(0, 120))}${attraction.description.length > 120 ? '...' : ''}</p>
                <span class="attraction-type">${escapeHtml(attraction.kind || 'Attraction')}</span>
                <button class="save-btn ${isFavourite ? 'saved' : ''}" data-name="${escapeHtml(attraction.name)}" data-description="${escapeHtml(attraction.description)}" data-image="${attraction.image}">
                    ${isFavourite ? '❤️ Saved' : '🤍 Save to Favourites'}
                </button>
            </div>
        `;
        
        resultsContainer.appendChild(card);
    });
    
    // Add event listeners to save buttons
    document.querySelectorAll('.save-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const name = btn.getAttribute('data-name');
            const description = btn.getAttribute('data-description');
            const image = btn.getAttribute('data-image');
            saveToFavourites({ name, description, image });
        });
    });
}

// Helper function to prevent XSS attacks
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Save attraction to favourites
function saveToFavourites(attraction) {
    if (favourites.some(fav => fav.name === attraction.name)) {
        alert('Already in your favourites!');
        return;
    }
    
    favourites.push(attraction);
    localStorage.setItem('favourites', JSON.stringify(favourites));
    displayFavourites();
    
    const buttons = document.querySelectorAll('.save-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-name') === attraction.name) {
            btn.innerHTML = '❤️ Saved';
            btn.classList.add('saved');
        }
    });
    
    alert('Added to favourites!');
}

// Display favourites list
function displayFavourites() {
    if (!favouritesContainer) return;
    
    if (favourites.length === 0) {
        favouritesContainer.innerHTML = '<p class="empty-favourites">No favourites yet. Search for attractions and save them here.</p>';
        return;
    }
    
    favouritesContainer.innerHTML = '';
    
    favourites.forEach((favourite, index) => {
        const favItem = document.createElement('div');
        favItem.className = 'favourite-item';
        favItem.innerHTML = `
            <img src="${favourite.image}" alt="${escapeHtml(favourite.name)}" class="favourite-image" onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'">
            <div class="favourite-info">
                <h4>${escapeHtml(favourite.name)}</h4>
                <p>${escapeHtml(favourite.description.substring(0, 60))}...</p>
            </div>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        favouritesContainer.appendChild(favItem);
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.getAttribute('data-index'));
            removeFromFavourites(index);
        });
    });
}

// Remove from favourites
function removeFromFavourites(index) {
    const removed = favourites.splice(index, 1);
    localStorage.setItem('favourites', JSON.stringify(favourites));
    displayFavourites();
    
    const buttons = document.querySelectorAll('.save-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-name') === removed[0].name) {
            btn.innerHTML = '🤍 Save to Favourites';
            btn.classList.remove('saved');
        }
    });
    
    alert('Removed from favourites');
}
