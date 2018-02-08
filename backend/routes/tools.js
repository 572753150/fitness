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
        secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
        auth: {
            user: '572753150@qq.com',
            pass: 'ljgunjhqnycwbdge'
        },
    });

    var options = {
        from: '572753150@qq.com',
        to: destination,
        // cc          : ''    //抄送
        // bcc         : ''    //密送
        subject: 'Welcome to fitness',
        text: '',
        html: 'Click <a href="' + link + '"><button>Active</button></a> to active your account。',
        // attachments    :
        //     [
        //         {
        //             filename: 'img1.png',            // 改成你的附件名
        //             path: 'public/images/img1.png',  // 改成你的附件路径
        //             cid : '00000001'                 // cid可被邮件使用
        //         },
        //         {
        //             filename: 'img2.png',            // 改成你的附件名
        //             path: 'public/images/img2.png',  // 改成你的附件路径
        //             cid : '00000002'                 // cid可被邮件使用
        //         },
        //     ]
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