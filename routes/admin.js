const path = require('path');
const express = require('express')

const rootDir = require('../util/path.js');

const router = express.Router();

router.get('/add-product', (req, res, next)=>{
    console.log('add-product');
    res.sendFile( path.join(rootDir,'views','add-product.html'));
});
router.post('/add-product', (req, res, next)=>{
    console.log('perhaps adding product in the database?', req.body);    
    res.redirect('/')
});

module.exports = router;