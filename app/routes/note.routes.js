module.exports = (app) => {
    const notes = require('../controllers/note.controller.js');
    const middleware = require('../middleware/note.midlleware')
    // Registering new user route
    app.post('/register', middleware.validate('register') , notes.create);

    // Login route
    app.post('/login', middleware.validate('login') , notes.login);

    //logout route
    app.get('/logout', notes.logout)
    
    app.get('/wallet', middleware.autheticate, notes.wallet)

    app.post('/addvalue', middleware.autheticate, notes.addvalue)

    app.post('/buystock', middleware.autheticate, notes.buy)

    app.get('/userprofile', middleware.autheticate, notes.profile)
}