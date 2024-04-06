module.exports = function(to, name, sendSmtpEmail) {
  
    sendSmtpEmail.subject = "Course Shop";
    sendSmtpEmail.htmlContent = "<html><body><h1>Welcome you creeated acount</h1></body></html>";
    sendSmtpEmail.sender = {"name":"Course Shop","email":"course@example.com"};
    sendSmtpEmail.to = [{"email":to,"name":name}];
    sendSmtpEmail.headers = {"Some-Custom-Name":"unique-id-1234"};
    sendSmtpEmail.params = {"parameter":"My param value","subject":"New Subject"};

    return sendSmtpEmail
}