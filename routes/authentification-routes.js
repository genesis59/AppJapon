const router = require('express').Router();
const bcrypt = require('bcrypt');
const kanjiDAO = require('../models/kanji-model');
const lectureDAO = require('../models/lecture-model');
const vocabDAO = require('../models/vocab-model');
const userDAO = require('../models/users-model');
const listDAO = require('../models/list-model');


// ROUTE DECONNEXION GET
router.get('/logout', (req, res) => {
    req.session.regenerate(() => {
        req.session.destroy(() => {
            res.clearCookie('AppSession');
            res.redirect('/home?logout=true');
        });
    });
});

// ROUTE CONNEXION GET
router.get('/connexion', (req, res) => {
    res.render('connexion');
});

// ROUTE LOGIN POST
router.post('/connexion', async (req, res) => {
    let passCheck = false;
    const user = await userDAO.findUserByEmail(req.body.email);
    if (user && 'pass' in user) {
        passCheck = await bcrypt.compare(req.body.pass, user.pass);
    }

    if (passCheck) {
        req.session.regenerate(() => {
            delete user.pass;
            req.flash('infos', 'Connexion réussie');
            req.session.user = user;
            res.redirect('/home');
        });
    } else {
        req.session.regenerate(() => {
            req.flash('errors', 'Veuillez réessayer email ou mot de passe erronés.');
            res.redirect('/connexion');
        });
    }
});

// ROUTE INSCRIPTION GET
router.get('/inscription', (req, res) => {
    res.render('inscription');
});

// ROUTE INSCRIPTION POST
router.post('/inscription', async (req, res) => {
    // permet d'afficher ou non l' input email en rouge
    let testemail = false;
    // Récupération et traitements des données de l'utilisateur
    const time = new Date();
    // test regex email
    const test = req.body.email.match(/^[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+$/i);
    // test regex password
    const test2 = req.body.pass.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-!"§$%&/()=?+*~#'_:.,;]).{8,}$/);
    // Test si l'adresse n'existe pas dans la BD
    const checkEmail = await userDAO.checkEmail(req.body.email);
    if (test && test2 && checkEmail == undefined) {

            const hash = await bcrypt.hash(req.body.pass, 2);
            const user = {
                lastname: req.body.lastname,
                firstname: req.body.firstname,
                pseudo: req.body.pseudo,
                email: req.body.email,
                pass: hash,
                date_inscription: time
            };
            console.log(checkEmail);
            const result = await userDAO.insertUser(user);
            // Création d'une session user si tout est ok
            req.session.regenerate(() => {
                user.id = user.insertId;
                delete user.pass;
                req.session.user = user;
                req.flash('infos', 'Inscription réussie.');
                res.redirect('/home');
            });
        
    } else {
        // Si non ok Récup des saisies et on lance des messages d'erreurs
        // on a ffiche pas les champs email en rouge
        if (test && checkEmail == undefined){
            testemail = true;
        }
        const inscription = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            pseudo: req.body.pseudo,
            email: req.body.email,
            testemail: testemail,

        }
        req.session.regenerate(() => {
            if (!test || checkEmail) {
                req.flash('errors', 'Désolé,cette adresse email existe déjà ou est érronée !');
            }
            if (!test2) {
                req.flash('errors', `Le mot de passe doit contenir 
                                     8 caractères contenant au moins 1 Majuscule,
                                     1 minuscule, 1 chiffre, 1 caractère spécial !`);       
            }
            res.render('inscription', inscription);
        });
    }
});

module.exports = router;