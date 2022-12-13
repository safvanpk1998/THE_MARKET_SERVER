const nodeMailer=require("nodemailer");
const sendEmail=async(options)=>{
    const  mailTransporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMPT_MAIL, 
          pass:process.env.SMPT_PASSWORD, // generated ethereal password
        },
      
      });
      const mailOptions=({
      from:"abc",
      to:options.email,
      subject:options.subject,
      text:options.message


      });
      mailTransporter.sendMail(mailOptions);

}
module.exports=sendEmail