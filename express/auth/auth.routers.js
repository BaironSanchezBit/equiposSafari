const Users = require('./auth.controller');

module.exports = (router) => {
    //router.post('/register', Users.createUser);
    router.post('/login', Users.loginUser);
    router.post('/adminLogin/login', Users.loginUserName);
    router.post('/adminLogin/logout', Users.logoutUser);
    // Ruta protegida
    router.get('/protected', Users.authenticateToken, (req, res) => {
        res.json({ success: true, message: 'This route is protected!' });
    });
    //router.get('/user/:id', Users.getUserById);
    //router.put('/users/:id', Users.updateUser);
    router.post('/comparePassword', Users.comparePassword);
}