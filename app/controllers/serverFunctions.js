'use strict';

const mongoose = require('mongoose');
const request = require('request');
const User = require('../models/users.js');

function ServerFunctions() {
  
  this.isLoggedIn = (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		} else {
      res.locals.error = 'You need to be logged in to view that page!';
			res.render('index', res.locals);
		}
  }
  
  this.getLatest = (req, res, next) => {
    let collections = [];
    
    User.find({links: { $exists: true, $ne: []}}).limit(10).exec((err, users) => {
      if (err) { throw err };
      
      users.forEach(user => {
        let collection = {};
        collection.name = user.twitter.displayName;
        collection.id = user._id;
        collection.icon = user.twitter.iconURL
        collection.links = user.links.reverse().slice(0, 5);
        collections.push(collection);
      })
      
      res.locals.collections = collections;
      next();
    });
  }
  
  this.populateTemp = (req, res, next) => {
    let id = null;
    if (req.isAuthenticated()) {
      id = req.user._id;
    }
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.user_id = id;
    next();
  }
  
  this.fetchUserProfile = (req, res, next) => {
    let user_id = req.params.user_id;
    if (user_id === undefined) {
      res.locals.profileLinks = req.user.links;
      res.locals.profile_id = req.user._id;
      return res.render('profile', res.locals);
    } else {
      User.findById(user_id, (err, user) => {
        if (err) { throw err; }
        res.locals.profileLinks = user.links;
        res.locals.profile_id = user_id;
        return res.render('profile', res.locals);
      });
    }
  }
  
  this.addLink = (req, res) => {
    let uri = req.body.link;
    
    if (!uri.match(/^http(s)*:\/\//)) {
      uri = 'https://' + uri;
    }
    
    let linkToAdd = {
      imageURI: uri,
      likes: 0
    };
    
    User.findOneAndUpdate({_id: req.user._id}, {$push:{links: linkToAdd}}, (err) => {
      if (err) {throw err; }
      return res.redirect('/profile');
    });
  }
  
  this.removeLink = (req, res) => {
    let linkToRemove = req.params.link_id;
    User.findOneAndUpdate({_id: req.user._id}, {$pull:{links: {_id: linkToRemove}}}, (err) => {
      if (err) {throw err; }
      return res.json({});
    });
  }
  
}

module.exports = ServerFunctions;