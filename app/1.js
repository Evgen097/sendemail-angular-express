var emailsRegex = require('emails-regex');
var async = require('async');
var needle = require('needle');


var text = '<a href="mailto:ukrzem.ua@gmail.com">ukrzem.ua@gmail.com</a>'

// var emails = text.match(emailsRegex());


var url = 'https://ukrzem.kh.ua/kontakty/';

    needle.get(url, function(err, res){
        try {
            console.log(res.body)
            var emails = res.body.match(emailsRegex());
            console.log(emails)

        }catch (e) {console.log('error in url: ' + url);}

    });
