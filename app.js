const express = require('express');

const bodyParser = require('body-parser');

const app = express();



app.set('views', './views');
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use('/images',express.static('images'));


app.use(require('./routes/public-routes'));

app.listen(3000,() => {
    console.log('server started');
});