exports.get404 = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: '404',
    path : '/404',
    isAuthenticated : req.session ? !!req.session.isAuthenticated : false ,
    CSS: {
      formsCSS : true
    },
    path: '',
  });
};

exports.get500 = (req, res, next)=>{
  res.status(500).render('500', {
    pageTitle : 'Sever Error',
    path: '/500',
    isAuthenticated : req.session ? !!req.session.isAuthenticated : false ,
    CSS : {
      formsCSS :true
    }
  })
}
