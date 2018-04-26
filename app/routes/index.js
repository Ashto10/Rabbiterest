'use strict';

const path = process.cwd();
var ServerFunctions = require(path + '/app/controllers/serverFunctions.js');

module.exports = function(app, passport) {  
  var sf = new ServerFunctions();
  
  app.route('/')
    .get(sf.getLatest, sf.populateTemp, (req, res) => {
      res.render('index', res.locals);
    });
  
  app.route('/logout')
    .get(function (req, res) {
      req.logout();
      res.redirect('/');
    });

  app.route('/auth/twitter')
    .get((req,res, next) => {
      req.session.returnTo = req.headers.referer;
      next();
    }, passport.authenticate('twitter'));
  
  app.route('/auth/twitter/callback')
    .get(passport.authenticate('twitter'), (req, res) => {
      res.redirect(req.session.returnTo || '/');
      delete req.session.returnTo;
    });
  
  app.route('/profile')
    .get(sf.isLoggedIn, sf.populateTemp, sf.fetchUserProfile);
  
  app.route('/browse/:user_id')
    .get(sf.populateTemp, sf.fetchUserProfile);
  
  app.route('/links/add')
    .post(sf.isLoggedIn, sf.addLink);
  
  app.route('/links/remove/:link_id')
    .get(sf.isLoggedIn, sf.removeLink);
}