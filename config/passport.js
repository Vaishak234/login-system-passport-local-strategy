const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { Passport } = require('passport')
const db = require('./connection')

module.exports = function (passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (async(email, password, done) => {
        const user = await db.get().collection('users').findOne({ email: email })
        if (!user) {
            return done(null,false,{message:'no user found'})
        } else {
            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch) {
                
                return done(null,user)
            } else {
                return done(null,false,{message:'incorrect password'})
            }
        }
    })
    )),
   
    
    passport.serializeUser((user, done) => {
        done(null,user)
     }),

        passport.deserializeUser((user, done) => {
       
            db.get().collection('users').findOne({ _id: user._id }).then((user) => {
            
            return done(null,user)
        })  
    })
  
    
}


