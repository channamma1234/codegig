const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

//database
const db= require('./config/database');

//test db
db.authenticate()
.then(()=>console.log('database connected'))
.catch(err=>console.log('error'+err))
const app = express();

//handlebars
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

// body psreser midllrware
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req,res)=>res.render('index', { layout: 'landing'}));

app.use('/gigs',require('./routes/gigs'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server has started at ${PORT}`));