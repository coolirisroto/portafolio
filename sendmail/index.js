let ejs = require('ejs');
var path = require("path");
const sendEmail = require('./send');
console.log('starting function');
const TO_ADMIN = process.env.TO_ADMIN;
const SUBJECT_ADMIN = process.env.SUBJECT_ADMIN;

exports.handle = function(e, ctx, cb) {
  console.log('processing event: %j', e)
  if (e.email) {
    let url_html_admin ='./mailings/admin.html';
    //Administración
    let subject_admin = SUBJECT_ADMIN + ' ' + e.name;
    const dataTemplate= {
      name: e.name,
      email: e.email,
      subject: e.subject,
      message: e.message
    }
    ejs.renderFile(url_html_admin, dataTemplate, function(err, str){
      sendEmail(subject_admin, str, TO_ADMIN).then((result) => {
        cb(null, result);
      }, cb);        
    });    
  } else {
    cb(new Error('Invalid payload: ' + JSON.stringify(e)))
  }
}