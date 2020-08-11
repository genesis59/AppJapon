const router = require('express').Router();
const listDAO = require('../models/list-model');

router.use((req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/connexion?liste=true');
    }
});

router.get('/listes', async (req, res) => {
    const result = await listDAO.findListByIdUser(req.session.user.id);
    console.log(result);
    res.render('liste-kanji',{result: result});
})

module.exports = router;