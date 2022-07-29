const mongoClient = require('mongodb').MongoClient
const session =  require('express-session')
const mongoDbStore = require('connect-mongodb-session')(session)
const state = {
    db:null
}
    const url = 'mongodb://localhost:27017'
    const dbname = 'passportLogin'
module.exports.connect = function(done){
    

    mongoClient.connect(url,{ useUnifiedTopology: true },(err,data)=>{
        if(err) return done(err)

        state.db = data.db(dbname)
        done()
    })
}

module.exports.get = function(){
    return state.db
}

module.exports.store = new mongoDbStore({
    uri: url,
    databaseName: dbname,
    collection:'sessionStore'
    

})