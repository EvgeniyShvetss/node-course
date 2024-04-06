const keys = require('../keys')

module.exports = function(to, name, sendSmtpEmail, token) {
  
    sendSmtpEmail.subject = "Reset password";
    sendSmtpEmail.htmlContent = `<html><body><h1>You forgot password</h1></br><p><a href=${keys.BASE_URL}/auth/password/${token}>Select link</a></p></body></html>`;
    sendSmtpEmail.sender = {"name":"Course Shop","email":"course@example.com"};
    sendSmtpEmail.to = [{"email":to,"name":name}];
    sendSmtpEmail.headers = {"Some-Custom-Name":"unique-id-1234"};
    sendSmtpEmail.params = {"parameter":"My param value","subject":"New Subject"};

    return sendSmtpEmail
}