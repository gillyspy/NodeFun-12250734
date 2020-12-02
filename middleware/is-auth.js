module.exports = (req, res, next)=>{
  if( !req.session.isLoggedIn){
    res.locals.sessionData.sessionfooter = req.appData.sessionDefaults;
    return res.redirect('/auth/login');
  } else {
    //if logged in include data with key login info
    res.locals.sessionData.sessionfooter = {
      username : req.session.user.username,
      email : req.session.user.email
    }
  }
  next();
}

