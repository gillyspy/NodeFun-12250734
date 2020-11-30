exports.getLogin = (req, res, next) => {
   // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
console.log(req.session, req.session.isLoggedIn);
const isLoggedIn = req.session.isLoggedIn;
    if( isLoggedIn){
        res.redirect('/');
    } else {
        res.render('auth/login', {
            pageTitle      : 'Login',
            path           : '/login',
            isAuthenticated: false,
            CSS            : {
                formsCSS: true,
                authCSS : true
            }
        });
    }
}

exports.postLogin = (req, res, next) =>{
    res.setHeader('Set-Cookie','loggedIn=true; HttpOnly');
    req.session.isLoggedIn = true;
    //assume all users can login for now
    res.redirect('/');
}