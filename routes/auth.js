
const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', (req,res, next)=>{
    console.log('login');
    res.redirect('/');
});

exports.routes = router;
