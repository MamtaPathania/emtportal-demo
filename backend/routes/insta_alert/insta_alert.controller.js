const nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const cron = require('node-cron');
const db = require('../../db')


const { alertdetailsdata , datedetaildata, userlogindetails, userlogsdetails, infodetailsdata, monthdetailsdata } = require("./insta_alert.services")
// const { selectAllData }=require('./insta_alert.services')
const alertdetails=(req,res)=>{
   alertdetailsdata(req,(err,result)=>{
    if(err){
        console.log(err)
        res.status(400).json({error:err})
    }else{
        console.log(result);
        res.json({message:result});
    }
   })
}

const SELECT_ALL = "SELECT * FROM tbl_mis_report WHERE service LIKE '<SERVICE>%' AND mis_date BETWEEN '<START_DATE>' AND '<END_DATE>' ORDER BY mis_date DESC";
const maildetails = async (serviceTypes, recipientEmail) => {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date

    try {
        const attachments = [];
        
        // Loop through each service type
        for (const serviceType of serviceTypes) {
            // Fetch data from the database for the current date and the specific service type
            const query = SELECT_ALL
                .replace('<SERVICE>%', serviceType)
                .replace('<START_DATE>', currentDate)
                .replace('<END_DATE>', currentDate);

            const result = await new Promise((resolve, reject) => {
                db.query(query, [], (err, result) => {
                    if (err) {
                        console.error("Error executing database query:", err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });

            if (result.length > 0) {
                // Include data as an attachment
                attachments.push({
                    filename: `mis_report_${serviceType}_${currentDate}.csv`,
                    content: [
                        Object.keys(result[0]).join(','), // Column headings
                        ...result.map(row => Object.values(row).join(',')), // Data rows
                    ].join('\n'),
                });
            } else {
                console.log(`No data for service type '${serviceType}' on the current date.`);
            }
        }

        if (attachments.length === 0) {
            console.log('No data available for any service type on the current date.');
            return;
        }

        // Create a transport object for sending emails
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.user_gmail, // Ideally, use environment variables
                pass: process.env.user_password, // 
            },
        });

        // Create an email message
        const mailOptions = {
            from: process.env.user_gmail,
            to: recipientEmail,
            subject: 'MIS Report',
            text: ` MIS Reports for the current date (${currentDate}).`,
            attachments,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        
        console.log('Email sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Example usage with multiple service types
const serviceTypes = ['football', 'instant', 'game box', 'npfl', 'goal', 'video'];
const recipientEmail = ['info@emtnetworks.ng','finance@emtnetworks.ng','abhix9o11@gmail.com','mamta.pathania@visiontrek.in','nitin.jha@visiontrek.in'];

// maildetails(serviceTypes, recipientEmail);

   const job = cron.schedule('25 8 * * *', async () => {
    console.log("mmmmm")
        try {
            await maildetails(serviceTypes,recipientEmail);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
        console.log("eeeee")
    });
    job.start()


const getdatedetails=(req,res)=>{
datedetaildata(req,(err,result)=>{
    if(err){
        console.log(err)
        res.status(400).json({error:err})
    }else{
        console.log(result,"mmm");
        res.json({message:result})
    }
})
}
const getlogsdetails=(req,res)=>{

userlogsdetails(req, (err, result)=>{
    if(err){
        res.status(400).json(err)
        console.log("error",err)
    }else{
        console.log(result)
        res.json({message:result})
        
    }
})
}
const getinfodetails=(req,res)=>{
infodetailsdata(req,(err,result)=>{
    if(err){
        res.status(400).json(err)
        console.log("error",err)
    }else{
        res.json({message:result})
        console.log(result)
    }
})
}
const getmonthdetails=(req,res)=>{
monthdetailsdata(req,(err,result)=>{
    if(err){
        res.status(400).json(err)
        console.log("error",err)
    }else{
        console.log(result)

        res.json({message:result})
    }
})
}
const getlogindetails = (req, res) => {
    userlogindetails(req, (err, result) => {
        if(err){
            res.status(400).json(err)
            console.log(err)
        }else{
            res.json({message:result})
            console.log(result)
        }
    });
};

module.exports={alertdetails,getdatedetails,getlogindetails,getlogsdetails,getinfodetails,getmonthdetails,maildetails}