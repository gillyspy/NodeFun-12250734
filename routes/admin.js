const express = require('express')

const router = express.Router();

router.get('/add-product', (req, res, next)=>{
    console.log('add-product');
    res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">add product</button></form>');
});
router.post('/add-product', (req, res, next)=>{
    console.log('perhaps adding product in the database?', req.body);    
    res.redirect('/')
});



module.exports = router;