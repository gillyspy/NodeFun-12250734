const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

app.use(bodyParser.urlencoded({extended : false}));

app.use('/admin', adminRoutes);
app.use(shopRoutes)

app.use((req,res,next)=>{
   console.log('404?');
   res.status(404).send('<h1>404 dude</h1>');
});

app.listen(3000);