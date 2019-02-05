var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Principal', { title: 'Josselyn`s Store' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Josselyn`s Store' });
});

router.get('/registro', function(req, res, next) {
  res.render('registro', { title: 'Josselyn`s ' });
});

module.exports = router;


