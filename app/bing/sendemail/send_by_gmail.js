
let lowdb = require('../db/lowdb');
let nodemailer = require ('nodemailer');


function send_by_gmail(gmail, data, id) {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmail.user,
                pass: gmail.password
            }
        });
        const mailOptions = {
            from: gmail.user,
            to: data.email, // list of receivers
            subject: data.subject, // Subject line
            html: data.html// plain text body
        };

        // console.log(emaildata.email)

        function updateLowdb(email){
            lowdb.updateQuerieSentMessages(id);
            lowdb.updateAllSentEmails(email);
        }

        transporter.sendMail(mailOptions, function (err, info) {
            if(err) {
                console.error(err);
                console.log(mailOptions.to);
                updateLowdb(mailOptions.to)
            }
            else {
                updateLowdb(mailOptions.to);
                lowdb.updateSuccessEmails(id, mailOptions.to)

                let sentletters = lowdb.getDbMeta('sentletters') + 1;
                lowdb.updateDbMeta('sentletters', sentletters)

                console.log("Письмо успешно отправлено ", mailOptions.to);
            }
        });
    }catch (e) {
        console.error("Error in send by gmail");
        console.error(e);
    }

};

module.exports = send_by_gmail;
















