let ejs = require('ejs');
var path = require("path");
const axios = require("axios");
const querystring = require('querystring');
const sendEmail = require('./send');
console.log('starting function');
const TO_ADMIN = process.env.TO_ADMIN;
const SUBJECT_ADMIN = process.env.SUBJECT_ADMIN;
const RECAPTCHA_V3_SECRET_KEY = process.env.RECAPTCHA_V3_SECRET_KEY;

exports.handle = async(e, ctx, cb) => {
  console.log('processing event: %j', e)
  if (e.email && e.token) {
    const params = {
      secret: RECAPTCHA_V3_SECRET_KEY,
      response: e.token
    }
    const response = await axios.post("https://www.google.com/recaptcha/api/siteverify",querystring.stringify(params));
    console.log(response);
    if(response.data && response.data.success && response.data.action == e.action && response.data.score>0.5){
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
    }
    else{
      cb(new Error('Invalid payload: Robot detected'))
    }
  } else {
    cb(new Error('Invalid payload: ' + JSON.stringify(e)))
  }
}