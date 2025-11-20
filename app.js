const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Livre = require('./models/livre');
require('./database'); // Importer la connexion MongoDB
const app = express();
const port = 3000;

// Middleware pour analyser le corps des requêtes en JSON
app.use(bodyParser.json());

// Route pour ajouter un livre
app.post('/livres', (req, res) => {
try {
    const { titre, auteur, date_publication, genre, disponible } = req.body;
const livre = new Livre({ titre, auteur, date_publication, genre, disponible });
livre.save();
res.status(201).json({ message: 'Livre ajouté avec succès', livre });
} catch (err) {
res.status(500).json({ message: 'Erreur lors de l\'ajout du livre', error: err });
}
});

app.get('/livres', (req, res) => {
try {
const livres = Livre.find();
res.status(200).json(livres);
} catch (err) {
res.status(500).json({ message: 'Erreur lors de la récupération des livres', error: err });
}
});

app.put('/livres/:id', (req, res) => {
try {
const { titre, auteur, date_publication, genre, disponible } = req.body;
const livre = Livre.findByIdAndUpdate(req.params.id, {
titre,
auteur,
date_publication,
genre,
disponible,
}, { new: true });
if (!livre) {
return res.status(404).json({ message: 'Livre non trouvé' });
}

res.status(200).json({ message: 'Livre mis à jour', livre });
} catch (err) {
res.status(500).json({ message: 'Erreur lors de la mise à jour du livre', error: err });
}
});
// Route pour supprimer un livre
app.delete('/livres/:id', (req, res) => {
try {
const livre = Livre.findByIdAndDelete(req.params.id);
if (!livre) {
return res.status(404).json({ message: 'Livre non trouvé' });
}
res.status(200).json({ message: 'Livre supprimé' });
} catch (err) {
res.status(500).json({ message: 'Erreur lors de la suppression du livre', error: err });
}
});
app.listen(port, () => {
console.log(`Serveur démarré sur http://localhost:${port}`);
});