const router = require('express').Router();
const kanjiDAO = require('../models/kanji-model');
const vocabDAO = require('../models/vocab-model');


// ---------------------    route get ----------------------

// ROUTE HOME
router.get('/home', (req, res) => {
    res.render('home');

});

// ROUTE ACCUEIL PAGE KANJI
router.get('/kanji/:page([1-9]+)', async (req, res) => {
    const params = req.params.page;
    // affichage initial (pas de recherche en session)
    if (!req.session.recherche) {
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
            vocab: resultJson,
            params: params,
            list: req.session.list
        });
    } else {
        // si critères de recherche déjà présent dans la session
        let reqPage = (params - 1) * 5;
        result = await kanjiDAO.findKanjiBySearchFieldWithLimit(req.session.typeRecherche, req.session.recherche, reqPage);
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
            page: req.session.page,
            nbPages: req.session.nbPages,
            kanji: result,
            vocab: resultJson,
            params: params,
            nbResult: req.session.nbResult,
            list: req.session.list
        });
    }
});

// ROUTE RECHERCHE KANJI
router.post('/kanji/:page([1-9]+)', async (req, res) => {
    // Initialisation des variables pour la pagination
    const params = req.params.page
    let nbPages;
    let nbResult;
    let reqPage = (params - 1) * 5;
    req.session.page = 1;
    req.session.recherche = req.body.search;
    req.session.typeRecherche = req.body.typeSearch;
    // Vérification que le champ recherche n'est pas vide
    if (req.body.search) {
        let result = [];
        if (req.body.typeSearch != 'Choisissez un type de recherche') {
            // recupération de la saisie et du type de recherche
            result = await kanjiDAO.findKanjiBySearchFieldWithLimit(req.body.typeSearch, req.body.search, reqPage);
            // Calcul nombre de pages nécéssaires à la pagination
            nbResult = await kanjiDAO.findPagesSearch(req.body.typeSearch, req.body.search);
            req.session.nbResult = nbResult;
            nbPages = Math.ceil(nbResult / 5);
            req.session.nbPages = nbPages;
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
                page: 1,
                nbPages: nbPages,
                kanji: result,
                vocab: resultJson,
                params: params,
                nbResult: req.session.nbResult,
                list: req.session.list
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

// Suppresion des valeurs de session de recherche et affichage 
router.get('/post', (req, res) => {
    req.session.recherche = undefined;
    req.session.typeRecherche = undefined;
    req.session.nbPages = undefined;
    req.session.page = 1;
    res.redirect('/kanji/1')
})

// page suivante
router.get('/next', (req, res) => {
    let page = req.session.page;
    page++;
    req.session.page = page
    res.redirect('/kanji/' + page);
});

// page précédente
router.get('/previous', (req, res) => {
    let page = req.session.page;
    page--;
    req.session.page = page
    res.redirect('/kanji/' + page);
});

module.exports = router;