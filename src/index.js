const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const multer = require('multer');
const bodyParser = require('body-parser');
//inicializaciones
const app = express();
require('./database');
require('./config/passport');
//settings
app.set('port',3000);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs',exphbs.engine({
    defaultLayout: 'main' ,
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs'
}));
app.set('view engine','.hbs');
//middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//variables globales
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
//routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));
app.use(require('./routes/misPrestamos'));
app.use(require('./routes/items'));
app.use(require('./routes/laboratorios'));
app.use(require('./routes/administrar'));
app.use(require('./routes/recoger'));
//estaticos
app.use(express.static(path.join(__dirname,'public')));
//inicializar servidor
app.listen(app.get('port'), () => {
    console.log('Server on port',app.get('port'))
});
