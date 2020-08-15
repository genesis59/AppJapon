const router = require('express').Router();
const listDAO = require('../models/list-model');
const contentListDAO = require('../models/content-list');
const vocabDAO = require('../models/vocab-model');

router.use((req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/connexion?liste=true');
    }
});

// Route mes listes
router.get('/listes', async (req, res) => {
    const result = await listDAO.findListByIdUser(req.session.user.id);
    res.render('liste-kanji', { result: result });
});

// Ajouter une liste
router.post('/listes', async (req, res) => {
    try {
        const data = { id_user: req.session.user.id, list_name: req.body.addList };
        await listDAO.insertOne(data);
        const result = await listDAO.findListByIdUser(req.session.user.id);
        req.session.list = result;
        res.redirect('/listes');
    } catch (err) {
        console.log(err);
    } finally {
        req.flash('errors', 'Désolé cette liste existe déjà');
        const result = await listDAO.findListByIdUser(req.session.user.id);
        res.render('liste-kanji', { result: result });
    }

});

// Supprimer une liste

router.get('/delete/:id', async (req, res) => {
    const result = await listDAO.deleteOneById(req.params.id);
    res.redirect('/listes');
});

// Modifier une liste
// Formulaire

router.get('/update/:id', async (req, res) => {
    const result = await listDAO.findListByIdUserAndIdList(req.session.user.id, req.params.id);
    res.render('updateNameList', { result: result });
});

// update du nom de la liste
router.post('/update/:id', async (req, res) => {
    const data = { list_name: req.body.putList };
    try {
        // Mise à jour du nom et test si le nom n'existe pas
        await listDAO.updateOne(data, req.params.id);
        // Rechargement de la liste
        await listDAO.findListByIdUser(req.session.user.id);
        res.redirect('/listes');
    } catch (err) {
        console.log(err);
    } finally {
        req.flash('errors', 'Désolé cette liste existe déjà');
        const result = await listDAO.findListByIdUserAndIdList(req.session.user.id, req.params.id);
        res.render('updateNameList', { result: result });
    }
});

// Ajout d'un kanji dans une liste

router.post('/post', async (req, res) => {
    if (req.body.id_list !== 'Choisissez une liste') {
        const verif = await contentListDAO.findOneKanjiByIdAndList(req.query.id,req.body.id_list);
        if (!verif) {
            const data = { id_kanji: req.query.id, id_list: req.body.id_list }
            await contentListDAO.insertOne(data)
            req.flash('infos', 'Enregistré.');
            res.redirect('/kanji/' + req.session.page);
        } else {
            req.flash('errors', 'Ce kanji existe déjà dans cette liste.');
            res.redirect('/kanji/' + req.session.page);
        }

    } else {
        req.flash('errors', 'Vous devez choisir une liste pour effectuer cette opération');
        res.redirect('/kanji/' + req.session.page);
    }

});

// Obtenir le détail d'une liste

router.get('/details-list/:id', async (req, res) => {
    let resultJson = [];
    const result = await contentListDAO.findAllById(req.params.id);
    for (item of result) {
        const vocab = await vocabDAO.findVocabularyById(item.id_kanji);
        resultJson.push(JSON.parse(JSON.stringify(vocab[0])));
    }
    for (let file of resultJson) {
        file.kanji_japonais = file.kanji_japonais.split(',');
        file.prononciation = file.prononciation.split(',');
        file.trad_fr = file.trad_fr.split(',');
    }
    res.render('details-list', {
        result: result,
        vocab: resultJson
    });
});

// Supprimer un kanji de la liste

router.get('/delete2/:id/:list', async (req, res) => {
    // suppression du kanji
    await contentListDAO.deleteOneById(req.params.id);
    res.redirect('/details-list/' + req.params.list);
});


module.exports = router;