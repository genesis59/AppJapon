const router = require('express').Router();
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
    let result3 = [];
    result3.push(result2);
    res.render('kanji', {
        kanji: [data[aleaKanji]],
        vocab: result3
    });
});

// ROUTE INSCRIPTION

router.get('/inscription', (req,res) => {
    res.render('inscription');
});

// ROUTE CONNEXION

router.get('/connexion', (req,res) => {
    res.render('connexion');
});

// --------------------------  route post ----------------------


// ROUTE RECHERCHE KANJI
router.post('/kanji', async (req, res) => {

    // Vérification que le champ n'est pas vide
    if (req.body.search) {
        let result = [];
        if (req.body.typeSearch != 'Choisissez un type de recherche') {
            // recupération de la saisie et du type et recherche de résultat dans la BD
            result = await kanjiDAO.findKanjiBySearchField(req.body.typeSearch, req.body.search);
        } else {
            // Type non renseigné donc recherche basique
            result = await kanjiDAO.findKanjiBySearch(req.body.search);
        }

        // Vérification si un résultat a été trouvé
        if (result[0] !== undefined) {
            let result3 = [];
            // Boucle si plusieurs résultat
            for (let file of result) {
                if (file.id) {
                    console.log(file);
                    const result2 = await vocabDAO.findVocabularyById(file.id);
                    result3.push(result2);
                }
            }
            res.render('kanji', {
                kanji: result,
                vocab: result3
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
// ROUTE INSCRIPTION
router.post('/inscription', async (req,res) =>{
    const time = new Date();
    const data = {
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        pseudo: req.body.pseudo,
        email: req.body.email,
        pass: req.body.pass,
        date_inscription: time
    };
    const result = await userDAO.insertUser(data);
    res.redirect('/home');
});


module.exports = router;