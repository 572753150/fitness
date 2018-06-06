var nodemailer = require('nodemailer');


function transferDateToString(date) {

        var dateString = date.getFullYear() +"";


        if (date.getMonth() + 1 < 10) {
            dateString = dateString + "0" + (date.getMonth() + 1);
        }else{
            dateString = dateString+(date.getMonth()+1);
        }
        if (date.getDate() < 10) {
            dateString = dateString + "0" + (date.getDate());//
        } else {
            dateString = dateString + date.getDate();
        }
        return dateString;
}

module.exports.transferDateToString = transferDateToString;

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}


module.exports.guid = guid;


function sendMail(destination, content) {
    var link = 'http://localhost:3000/auth/confirm/' + content;
    var mailTransport = nodemailer.createTransport({
        host: 'smtp.qq.com',
        secureConnection: true,
        auth: {
            user: '572753150@qq.com',
            pass: 'ljgunjhqnycwbdge'
        },
    });
    var options = {
        from: '572753150@qq.com',
        to: destination,
        subject: 'Welcome to fitness',
        text: '',
        html: 'Click <a href="' + link + '"><button>Active</button></a> to active your account。',
    };

    mailTransport.sendMail(options, function (err, msg) {
        if (err) {
            console.log("发送失败");
            console.log(err);
        }
        else {
            console.log("Send email successfully!");
        }
    });

}

module.exports.sendMail = sendMail;