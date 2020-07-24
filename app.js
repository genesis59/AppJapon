const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const fileStorage = require('session-file-store')(session);



app.set('views', './views');
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: 'hippocampelephantocamelos',
    name: 'AppSession',
    store: new fileStorage,
    resave: true,
    saveUninitialized: true
}));


app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use('/images',express.static('images'));


app.use(require('./routes/public-routes'));

app.listen(3000,() => {
    console.log('server started');
});