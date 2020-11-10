const express = require('express');

const app = express();

app.use('/', (req,res,next)=>{
    console.log('this always runs');
    next()
});
app.use('/add-product', (req, res, next)=>{
    console.log('perhaps adding product in the database?');
    res.send('in product');
});
app.use( '/',(req, res, next)=>{
    console.log('in another middleware!');
    res.send('<h1>Hello from Express</h1>');
});



app.listen(3000);