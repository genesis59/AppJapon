const router = require('express').Router();
const listDAO = require('../models/list-model');

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

module.exports = router;