module.exports = {
  ensureAuthenticated: (req,res,next) => {
    if(req.isAuthenticated()){
      return next();
    }
    req.flash('error_msg', 'You are not authorized to view this page!');
    res.redirect('/users/login');
  }
}
