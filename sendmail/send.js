const AWS = require('aws-sdk');
const SES_REGION =  'us-east-1';
const FROM_NO_REPLY_NAME = process.env.FROM_NO_REPLY_NAME;
const FROM_NO_REPLY_EMAIL = process.env.FROM_NO_REPLY_EMAIL;

AWS.config.update({
  region: SES_REGION
})
const ses = new AWS.SES({ apiVersion: '2010-12-01' })

/**
 * Send an e-mail
 *
 * @param {string}       subject  The mail title in UTF-8 encoding
 * @param {string}       body     The mail body in UTF-8 encoding
 * @return {Promise}     The promise, or null if callback is specified
 */
module.exports = function sendEmail (subject, body, to) {
  return new Promise((resolve, reject) => {
    // this must relate to a verified SES account
    const from = FROM_NO_REPLY_NAME + ' <' + FROM_NO_REPLY_EMAIL + '>';
    const params = {
      Source: from,
      Destination: { ToAddresses: [ to ] },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: body,
            Charset: 'UTF-8'
          },

        }
      }
    }

    ses.sendEmail(params, (err, data) => {
      if (err) {
        console.error('Failed to send the email:', err.stack || err)
        reject(err)
      } else {
        console.log('e-mail sent:', data)
        resolve(data)
      }
    })
  })
}
