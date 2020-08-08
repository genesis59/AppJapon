const router = require('express').Router();
const bcrypt = require('bcrypt');
const kanjiDAO = require('../models/kanji-model');
const lectureDAO = require('../models/lecture-model');
const vocabDAO = require('../models/vocab-model');
const userDAO = require('../models/users-model');
const listDAO = require('../models/list-model');


// ---------------------    route get ----------------------

// ROUTE HOME
router.get('/home', (req, res) => {
    res.render('home');

});

// ROUTE ACCUEIL PAGE KANJI
router.get('/kanji', async (req, res) => {
    const data = await kanjiDAO.allKanji();
    // Affichage aléatoire d'un Kanji de la BD en arrivant sur la page
    let aleaKanji = Math.floor(Math.random() * (data.length));
    const result2 = await vocabDAO.findVocabularyById(aleaKanji + 1);
    // Création d' une variable pour permettre l'affichage multiples 
    // d'une recherche sur la route router.post('/kanji', async (req, res))
    let resultJson = [];
    resultJson.push(JSON.parse(JSON.stringify(result2[0])));
    // Transformation des chaines de caratere des champs de la BD en tableau
    for (let file of resultJson) {
        file.kanji_japonais = file.kanji_japonais.split(',');
        file.prononciation = file.prononciation.split(',');
        file.trad_fr = file.trad_fr.split(',');
    }
    res.render('kanji', {
        kanji: [data[aleaKanji]],
        vocab: resultJson
    });
});

// ROUTE RECHERCHE KANJI
router.post('/kanji', async (req, res) => {

    // Vérification que le champ recherche n'est pas vide
    if (req.body.search) {
        let result = [];
        if (req.body.typeSearch != 'Choisissez un type de recherche') {
            // recupération de la saisie et du type de recherche
            result = await kanjiDAO.findKanjiBySearchField(req.body.typeSearch, req.body.search);
        } else {
            // Si type non renseigné donc recherche basique
            result = await kanjiDAO.findKanjiBySearch(req.body.search);
        }
        // Vérification si un résultat a été trouvé
        if (result[0] !== undefined) {
            result = JSON.parse(JSON.stringify(result));
            // Boucle si plusieurs résultat
            let resultJson = [];
            for (let file of result) {
                if (file.id) {
                    const result2 = await vocabDAO.findVocabularyById(file.id);
                    resultJson.push(JSON.parse(JSON.stringify(result2[0])));
                }
            }
            // Transformation des chaines de caratere des champs de la BD en tableau
            for (let file of resultJson) {
                file.kanji_japonais = file.kanji_japonais.split(',');
                file.prononciation = file.prononciation.split(',');
                file.trad_fr = file.trad_fr.split(',');
            }
            res.render('kanji', {
                kanji: result,
                vocab: resultJson
            });
        } else {
            res.render('kanji', {
                kanji: result,
                vocab: '',
                error: 'Désolé,cette recherche n\'as retourné aucun résultat !'
            });
        }
    } else {
        res.render('kanji', {
            kanji: '',
            vocab: '',
            error: 'Veuillez renseigner une recherche !'
        });
    }

});

module.exports = router;