var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET home page. */


router.get('/josselynStore', function(req, res, next) {
  res.render('fragmentos/frm_areacenter', { title: 'Josselyn`s Store' });
});
router.get('/josselynStore/inicio', function(req, res, next) {
  res.render('fragmentos/frm_inicio', { title: 'Josselyn`s Store', rol : req.user.nombre });
});
router.get('/josselynStore/registro', function(req, res, next) {
  res.render('fragmentos/registro', { title: 'Josselyn`s Store' });
});
router.get('/josselynStore/login', function(req, res, next) {
  res.render('fragmentos/login', { title: 'Josselyn`s Store' , error: req.flash('err_cred')});
});

router.get('/josselynStore/registro', function(req, res, next) {
  res.render('registro', { title: 'Josselyn`s ' });
});

router.post('/iniciar_sesion',
        passport.authenticate('local-signin',
                {successRedirect: '/josselynStore/inicio',
                    failureRedirect: '/josselynStore/login',
                    failureFlash: true}
        ));

router.post('/josselynStore/registro/guardar',
        passport.authenticate('local-signup', {successRedirect: '/josselynStore/login',
            failureRedirect: '/josselynStore/registro', failureFlash: true}
        ));
module.exports = router;


