const Pokedex = require('../models/Pokedex');
const cpanelPokedexApi = require('../../util/cpanelPokedexApi');

// Creates new pokemon entry with image upload and user attribution
exports.addPokemon = (req, res, next) => {
    if (!req.file) {
        return res.status(400).send('Pokemon image is required');
    }

    console.log('📸 File info:', {
        originalname: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
    });

    if (!req.session || !req.session.username) {
        return res.status(401).send('You must be logged in to add Pokemon');
    }

    if (cpanelPokedexApi.isConfigured()) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).send('cPanel accepts only JPG, PNG, or GIF images for Pokemon upload');
        }
    }

    const addedByUser = req.session.username;

    const newPokemon = new Pokedex(
        req.body.pokemon_name,
        req.body.pokemon_type_1,
        req.body.pokemon_type_2 || null,
        req.body.hp,
        req.body.attack,
        req.body.defense,
        req.body.sp_atk,
        req.body.sp_def,
        req.file.originalname,
        addedByUser,
        req.file.path
    );

    newPokemon.save()
        .then(() => {
            res.redirect('/Pokedex');
        })
        .catch((err) => {
            console.error('DB Error:', err.message);
            console.error('Full Error:', err);
            res.status(500).json({ success: false, error: err.message });
        });
};

exports.getPokemonList = (req, res, next) => {
    Pokedex.getAll()
        .then(([rows]) => {
            res.render('pokemon_list', { p_name: rows });
        })
        .catch((err) => {
            console.log(err);
            res.render('pokemon_list', { p_name: [] });
        });
};

exports.getPokemonListJson = (req, res, next) => {
    Pokedex.getAll()
        .then(([rows]) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Failed to load pokemon list' });
        });
};

exports.getPokedexSourceStatus = (req, res, next) => {
    const status = cpanelPokedexApi.getStatus();

    res.status(200).json({
        source: status.isConfigured ? 'cpanel' : 'local-mysql',
        cpanel: status
    });
};

exports.getImageProxy = (req, res, next) => {
    const filename = req.params.filename;
    
    if (!filename || filename.includes('/') || filename.includes('\\')) {
        return res.status(400).send('Invalid filename');
    }

    if (cpanelPokedexApi.isConfigured()) {
        const cpanelImageUrl = `https://liadka2.mtacloud.co.il/images/${filename}`;
        
        const https = require('https');
        const agent = new (require('undici').Agent)({ connect: { rejectUnauthorized: false } });
        
        https.get(cpanelImageUrl, { rejectUnauthorized: false }, (cpanelRes) => {
            res.setHeader('Content-Type', cpanelRes.headers['content-type'] || 'image/png');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            cpanelRes.pipe(res);
        }).on('error', (err) => {
            console.error('Image proxy error:', err.message);
            res.status(404).send('Image not found');
        });
    } else {
        res.status(400).send('cPanel not configured');
    }
};