const sms = require("sms-service");

 
 


 const sendSms=async(options)=>{
    const smsService = new sms.SMSService();
    smsService.sendSMS('+91–7306776522','hello from sms-service!')
    // const  mailTransporter = nodeMailer.createTransport({
    //     host: 'smtp.gmail.com',
    //     port: 465,
    //     secure: true,
    //     auth: {
    //       user: process.env.SMPT_MAIL, 
    //       pass:process.env.SMPT_PASSWORD, // generated ethereal password
    //     },
      
    //   });
    //   const mailOptions=({
    //   from:"abc",
    //   to:options.email,
    //   subject:options.subject,
    //   text:options.message


    //   });
    //   mailTransporter.sendMail(mailOptions);

}
module.exports=sendSms