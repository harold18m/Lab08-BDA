const { Router } = require('express');
const router = Router();

const jwt = require('jsonwebtoken');
const config = require('../config');
const verifyToken = require('./verifyToken');

const User = require('../models/User');

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });

    user.password = await user.encryptPassword(user.password);
    await user.save();

    const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 60 * 60 * 24 });
    return res.send(`User registered. Token: ${token}`);
});

router.get('/me', verifyToken, async (req, res) => {
    const user = await User.findById(req.userId, { password: 0 });
    if (!user) return res.status(404).send('No user found.');

    res.json(user);
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).send("User doesn't exist.");

    const validPassword = await user.validatePassword(password);
    //if (!validPassword) return res.status(401).json({ auth: false, token: null });
    if (!validPassword) return res.status(401).send("Wrong password or email.");

    const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 60 * 60 * 24 });
    //utilizamos el metodo render para mostrar la pagina dashboard
    return res.render('dashboard', { token }); 
});

router.get('/dashboard', verifyToken, (req, res) => {
    res.json('dashboard'); 
});

module.exports = router;
