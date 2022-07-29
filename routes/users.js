const db = require('../config/connection')
const bcrypt = require('bcrypt')
const session = require('express-session')
const passport = require('passport')
const router = require('express').Router()
const flash = require('express-flash')
const {isAuth,isNotAuth}=require('../middleware/middleware')
require('../config/passport')(passport)


router.get('/',isAuth, (req, res) => {
   
        let username = req.session.passport.user.name
        res.render('main',{username})
})

 router.get('/register',isNotAuth,  (req, res) => {
  
     res.render('register')
 })

 router.post('/register',isNotAuth,   async (req, res) => {
     const { name, email, password, confirmpassword } = req.body
     if (!name || !email || !password || !confirmpassword) {
         req.flash('errMsg','please fill all content in form')
         res.redirect('/register')
     }
     else if (password != confirmpassword) {
         req.flash('messages','password is incorrect')
         res.redirect('/register')
     }
     else {
        let userExist = await db.get().collection('users').findOne({ email: email })
        if (userExist) {
         req.flash('messages','user already exists')
         res.redirect('/register')
        } else {
         let hashedPassword = await bcrypt.hash(password,10)
         let hashedConfirmPassword = await bcrypt.hash(confirmpassword, 10)
         let userDetails = {
             name,
             email,
             password:hashedPassword,
             confirmpassword:hashedConfirmPassword
         }
         let insertUser = await db.get().collection('users').insertOne(userDetails)
            if (insertUser) {
             req.flash('messages','Successfully registered Login to continue')
             res.redirect('/')
         } 
     } 
     }
     
 })


router.get('/login',isNotAuth, (req, res,next) => {
   
        res.render('login')
    
 })


 router.post('/login', passport.authenticate('local',{successRedirect:'/',failureRedirect:'/login',failureFlash:true}) )

 router.get('/logout', (req, res) => {
     req.logOut((err) => {
         if(!err) res.redirect('/login')
     })
    
 })

module.exports = router