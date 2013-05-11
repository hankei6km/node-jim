
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'node-jim' });
};
exports.demo_keyboard = function(req, res){
  res.render('demo_keyboard', { title: 'Japanese Input Method(Keyboard)' });
};
