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
app.post('/livres', async (req, res) => {
  try {
    const { titre, auteur, date_publication, genre, disponible } = req.body;
    
    // Validation des champs requis
    if (!titre || !auteur) {
      return res.status(400).json({ message: 'Le titre et l\'auteur sont obligatoires' });
    }
    
    const livre = new Livre({ titre, auteur, date_publication, genre, disponible });
    await livre.save();
    res.status(201).json({ message: 'Livre ajouté avec succès', livre });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du livre', error: err.message });
  }
});

// Route pour récupérer tous les livres
app.get('/livres', async (req, res) => {
  try {
    const livres = await Livre.find();
    res.status(200).json(livres);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des livres', error: err.message });
  }
});

// Route pour mettre à jour un livre
app.put('/livres/:id', async (req, res) => {
  try {
    const { titre, auteur, date_publication, genre, disponible } = req.body;
    
    // Validation de l'ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }
    
    const livre = await Livre.findByIdAndUpdate(
      req.params.id, 
      {
        titre,
        auteur,
        date_publication,
        genre,
        disponible,
      }, 
      { new: true, runValidators: true }
    );
    
    if (!livre) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    res.status(200).json({ message: 'Livre mis à jour', livre });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du livre', error: err.message });
  }
});

// Route pour supprimer un livre
app.delete('/livres/:id', async (req, res) => {
  try {
    // Validation de l'ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }
    
    const livre = await Livre.findByIdAndDelete(req.params.id);
    if (!livre) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.status(200).json({ message: 'Livre supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression du livre', error: err.message });
  }
});

// Route pour récupérer un livre par ID
app.get('/livres/:id', async (req, res) => {
  try {
    // Validation de l'ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }
    
    const livre = await Livre.findById(req.params.id);
    if (!livre) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.status(200).json(livre);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du livre', error: err.message });
  }
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur interne du serveur', error: err.message });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});