const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Search attractions endpoint with mock data (for testing)
app.get('/api/attractions', (req, res) => {
    const city = req.query.city;
    
    if (!city) {
        return res.status(400).json({ error: 'Please provide a city name' });
    }
    
    console.log(`Searching for attractions in: ${city}`);
    
    // Mock attraction data for different cities
    const mockAttractions = {
        'paris': [
            { name: 'Eiffel Tower', kind: 'landmark', distance: 500 },
            { name: 'Louvre Museum', kind: 'museum', distance: 1200 },
            { name: 'Notre-Dame Cathedral', kind: 'church', distance: 1800 },
            { name: 'Sacré-Cœur Basilica', kind: 'church', distance: 2500 },
            { name: 'Arc de Triomphe', kind: 'landmark', distance: 2200 }
        ],
        'london': [
            { name: 'Big Ben', kind: 'landmark', distance: 300 },
            { name: 'London Eye', kind: 'attraction', distance: 600 },
            { name: 'British Museum', kind: 'museum', distance: 1500 },
            { name: 'Tower of London', kind: 'castle', distance: 2000 },
            { name: 'Buckingham Palace', kind: 'palace', distance: 1800 }
        ],
        'tokyo': [
            { name: 'Tokyo Tower', kind: 'landmark', distance: 400 },
            { name: 'Senso-ji Temple', kind: 'temple', distance: 2500 },
            { name: 'Shibuya Crossing', kind: 'attraction', distance: 800 },
            { name: 'Meiji Shrine', kind: 'shrine', distance: 1500 },
            { name: 'Shinjuku Gyoen', kind: 'park', distance: 2000 }
        ],
        'berlin': [
            { name: 'Brandenburg Gate', kind: 'landmark', distance: 200 },
            { name: 'Reichstag Building', kind: 'government', distance: 400 },
            { name: 'Berlin Wall Memorial', kind: 'memorial', distance: 1500 },
            { name: 'Museum Island', kind: 'museum', distance: 1000 },
            { name: 'Checkpoint Charlie', kind: 'museum', distance: 1200 }
        ],
        'rome': [
            { name: 'Colosseum', kind: 'landmark', distance: 300 },
            { name: 'Vatican City', kind: 'religious', distance: 2000 },
            { name: 'Trevi Fountain', kind: 'fountain', distance: 800 },
            { name: 'Pantheon', kind: 'temple', distance: 600 },
            { name: 'Spanish Steps', kind: 'landmark', distance: 1000 }
        ]
    };
    
    const cityLower = city.toLowerCase();
    
    // Check if we have data for this city
    if (mockAttractions[cityLower]) {
        res.json({
            city: city,
            attractions: mockAttractions[cityLower]
        });
    } else {
        // For cities not in our mock data, return a default message
        res.json({
            city: city,
            attractions: [
                { name: `Popular attraction in ${city}`, kind: 'landmark', distance: 500 },
                { name: `Historic site in ${city}`, kind: 'historical', distance: 1200 },
                { name: `Cultural center in ${city}`, kind: 'culture', distance: 1800 },
                { name: `${city} City Park`, kind: 'park', distance: 800 },
                { name: `${city} Museum`, kind: 'museum', distance: 1500 }
            ]
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});