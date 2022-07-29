const express = require('express')
const session = require('express-session')
const db = require('./config/connection')
const exphbs = require('express-handlebars')
const flash = require('express-flash')
const passport = require('passport')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())



app.set('view engine','hbs')
app.engine('hbs', exphbs.engine({extname:'hbs', defaultLayout:'layout.hbs'}));
app.use(session({
    secret: "this is a secret key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge:1000*60*60
    },
    store:db.store
    
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next)=> {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

db.connect((err)=>{
  if(err) console.log("Database Connection Error"+err);
  else console.log("database Connected Successfully");
})

app.use('/',require('./routes/users'))


app.listen(port,()=>console.log('server is running....'))