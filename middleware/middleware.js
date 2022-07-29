module.exports = {
    isAuth: (req,res,next) => {
        if (req.isAuthenticated()) {
           next()
        } else {
            res.redirect('/login')
        }
    },
    isNotAuth: (req,res,next) => {
        if (req.isAuthenticated()) {
               res.redirect('/')
        } else {
           next()
        }
    }
}