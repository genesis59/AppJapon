// import des libs
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const fileStorage = require('session-file-store')(session);
const flash = require('express-flash-messages');


// utilisation de body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// utilisation de pug
app.set('views', './views');
app.set('view engine', 'pug');


// element de création de session
app.use(session({
    secret: 'hippocampelephantocamelos',
    name: 'AppSession',
    store: new fileStorage,
    resave: true,
    saveUninitialized: true
}));

// module message flash
app.use(flash());

// Liaison des variables de session et pug
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// middleware pour affichage d'une requête flash après déconnexion
app.use((req,res,next) => {
    if (req.query.logout == 'true' && req.path == '/home' ) {
        req.flash('infos','Vous êtes déconnecté');
    }
    next();
});

// raccourci static
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use('/images',express.static('images'));

// liaison des routes
app.use(require('./routes/public-routes'));
app.use(require('./routes/authentification-routes'));

// Ecoute du serveur
app.listen(3000,() => {
    console.log('server started');
});