const API_URL = 'http://localhost:3000/api/attractions';

let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

function displayFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p style="color: #666;">No favorites yet. Click the star button on attractions you like!</p>';
        return;
    }
    
    favoritesList.innerHTML = favorites.map(fav => `
        <div class="favorite-item">
            <span>⭐ ${fav.name}</span>
            <button class="remove-fav" data-name="${fav.name}">Remove</button>
        </div>
    `).join('');
    
    document.querySelectorAll('.remove-fav').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            favorites = favorites.filter(f => f.name !== name);
            saveFavorites();
        });
    });
}

async function searchAttractions() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    
    const loading = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');
    
    loading.classList.remove('hidden');
    resultsDiv.innerHTML = '';
    
    try {
        const response = await fetch(`${API_URL}?city=${encodeURIComponent(city)}`);
        const data = await response.json();
        
        if (data.error) {
            resultsDiv.innerHTML = `<p style="color: red; text-align: center;">${data.error}</p>`;
        } else if (!data.attractions || data.attractions.length === 0) {
            resultsDiv.innerHTML = '<p style="text-align: center;">No attractions found for this city. Try another city!</p>';
        } else {
            resultsDiv.innerHTML = `
                <h2 style="grid-column: 1/-1;">📍 Top Attractions in ${data.city}</h2>
                ${data.attractions.map(attr => `
                    <div class="attraction-card">
                        <h3>${attr.name}</h3>
                        <span class="kind">${attr.kind || 'Attraction'}</span>
                        ${attr.distance ? `<div>📍 ${Math.round(attr.distance)}m from center</div>` : ''}
                        <button class="favorite-btn" data-name="${attr.name}">⭐ Save to Favorites</button>
                    </div>
                `).join('')}
            `;
            
            document.querySelectorAll('.favorite-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const name = btn.getAttribute('data-name');
                    if (!favorites.some(f => f.name === name)) {
                        favorites.push({ name });
                        saveFavorites();
                        alert(`${name} saved to favorites!`);
                    } else {
                        alert(`${name} is already in your favorites!`);
                    }
                });
            });
        }
    } catch (error) {
        console.error('Error:', error);
        resultsDiv.innerHTML = '<p style="color: red; text-align: center;">Failed to load attractions. Make sure the backend server is running on port 3000.</p>';
    } finally {
        loading.classList.add('hidden');
    }
}

document.getElementById('searchBtn').addEventListener('click', searchAttractions);
document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchAttractions();
});

displayFavorites();
