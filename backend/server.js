require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Mock attractions data
const attractionsData = {
    'paris': [
        { name: 'Eiffel Tower', description: 'Iconic iron lattice tower on the Champ de Mars, symbol of France.', image: 'https://cdn.pixabay.com/photo/2018/04/25/16/23/eiffel-tower-3349815_640.jpg', kind: 'landmark' },
        { name: 'Louvre Museum', description: 'World-famous art museum housing the Mona Lisa and Venus de Milo.', image: 'https://cdn.pixabay.com/photo/2014/10/20/08/48/louvre-494773_640.jpg', kind: 'museum' },
        { name: 'Notre-Dame Cathedral', description: 'Gothic Catholic cathedral with stunning rose windows.', image: 'https://cdn.pixabay.com/photo/2018/05/27/17/07/notre-dame-3433685_640.jpg', kind: 'church' }
    ],
    'london': [
        { name: 'Big Ben', description: 'Iconic clock tower at the Houses of Parliament.', image: 'https://cdn.pixabay.com/photo/2014/10/10/19/43/big-ben-483600_640.jpg', kind: 'landmark' },
        { name: 'London Eye', description: 'Giant observation wheel on the South Bank.', image: 'https://cdn.pixabay.com/photo/2018/01/25/18/21/london-eye-3106463_640.jpg', kind: 'attraction' },
        { name: 'British Museum', description: 'World-renowned museum of history and culture.', image: 'https://cdn.pixabay.com/photo/2014/08/13/13/10/british-museum-417067_640.jpg', kind: 'museum' }
    ],
    'tokyo': [
        { name: 'Tokyo Tower', description: 'Orange and white Eiffel Tower-inspired landmark.', image: 'https://cdn.pixabay.com/photo/2017/03/19/15/58/tokyo-tower-2153965_640.jpg', kind: 'landmark' },
        { name: 'Senso-ji Temple', description: 'Ancient Buddhist temple in Asakusa.', image: 'https://cdn.pixabay.com/photo/2016/11/02/11/13/architecture-1790958_640.jpg', kind: 'temple' },
        { name: 'Shibuya Crossing', description: 'Famous busy pedestrian scramble crossing.', image: 'https://cdn.pixabay.com/photo/2017/03/16/14/42/shinjuku-2149259_640.jpg', kind: 'attraction' }
    ],
    'rome': [
        { name: 'Colosseum', description: 'Ancient amphitheater, icon of Rome.', image: 'https://cdn.pixabay.com/photo/2016/11/18/14/18/colosseum-1837304_640.jpg', kind: 'landmark' },
        { name: 'Trevi Fountain', description: 'Baroque fountain where visitors toss coins.', image: 'https://cdn.pixabay.com/photo/2017/03/23/00/09/trevi-fountain-2166968_640.jpg', kind: 'fountain' },
        { name: 'Vatican City', description: 'Independent city-state, home of the Pope.', image: 'https://cdn.pixabay.com/photo/2015/08/04/19/44/st-peters-874512_640.jpg', kind: 'religious' }
    ]
};

app.get('/api/places', (req, res) => {
    const city = req.query.city;
    
    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }
    
    const cityLower = city.toLowerCase();
    const attractions = attractionsData[cityLower];
    
    if (!attractions) {
        return res.json([]);
    }
    
    res.json(attractions);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
