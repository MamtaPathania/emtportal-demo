const jwt = require('jsonwebtoken')

const db = require('../../db')

module.exports = {
 userlogindetails:(req,callback)=>{
    const {username,password}=req.body;

    const get_login_data=process.env.SELECT_LOGIN_QUERY
    .replace('<USERNAME>',username)
    .replace('<PASSWORD>',password)
    console.log("=====login",get_login_data)
    db.query(get_login_data,[],(err,result)=>{
        if(err){return callback(err)}
        // return callback("",result)
        if(result.length===0)
        {
            return callback("notfound")
            
        }
        const user = {
            username: result[0].username,
            password: result[0].password,
        }
        const secretKey = 'your_secret_key';
        const expirationTime = '1h'; 
        const token = jwt.sign(user, secretKey, { expiresIn: expirationTime });

        const response = {
            message: "Login successfully",
            token: token,
        };
        return callback("",response)
    })
 },
 infodetailsdata:(req,callback)=>{
 const{product}=req.query
 const getinfodetails=process.env.SELECT_INFO
 .replace('<PRODUCT>%',product)
 console.log(getinfodetails)
 db.query(getinfodetails,[],(err,result)=>{
    if (err) {
        console.log(err);
        
        return callback(err, null);
    }
    console.log(result)
    return callback(null, result);
 })
 },
 monthdetailsdata:(req,callback)=>{
    console.log(req.body)

    const getmonthdetails=process.env.SELECT_MONTH
    db.query(getmonthdetails,[],(err,result)=>{
        if (err) {
            console.log(err);
            
            return callback(err, null);
        }
        console.log(result)
        return callback(null, result);
    })
 },

 maildetailsdata:(req,callback)=>{

 },
    alertdetailsdata: (req, callback) => {
        const { DATE, msisdn, pisisid } = req.query;
        
        const get_alert_details = process.env.SELECT_ALERTDETAILS
            .replace('<DATE>', DATE)
            .replace('<msisdn>', msisdn)
            .replace('<pisisid>', pisisid);
        console.log(get_alert_details);
        db.query(get_alert_details, [DATE,msisdn,pisisid], (err, result) => {
            if (err) {
                console.log(err);
                
                return callback(err, null);
            }
            console.log(result)
            return callback(null, result);
        });
    },
    
     datedetaildata:(req,callback)=>{
        const{START_DATE,END_DATE,service}=req.query
        const get_sub_details=process.env.SELECT_ALL
        .replace('<SERVICE>%',service)
        .replace('<START_DATE>',START_DATE)
        .replace('<END_DATE>',END_DATE)
        console.log(get_sub_details)
        db.query(get_sub_details,[],(err,result)=>{
            if (err) {
                console.log(err);
                
                return callback(err, null);
            }
            console.log(result)
            return callback(null, result);
        })
      
    },
    userlogsdetails:(req,callback)=>{
        const{DATE}=req.query
        getlogsQuery=process.env.SELECT_LOGS
        .replace('<DATE>',DATE)
        getinstantQuery=process.env.SELECT_INSTANT_LOGS
        .replace('<DATE>',DATE)
        getvideoQuery=process.env.SELECT_VIDEO_LOGS
        .replace('<DATE>',DATE)
        getgoalQuery=process.env.SELECT_GOAL_LOGS
        .replace('<DATE>',DATE)
        getnpflQuery= process.env.SELECT_NPFL_LOGS
        .replace('<DATE>',DATE)
        getgameQuery=process.env.SELECT_GAME_LOGS
        .replace('<DATE>',DATE)
        // getallLogs=process.env.SELECT_ALLLOGS
        // .replace('<DATE>',DATE)

         db.query(getlogsQuery, [], (logsErr,logsResult) => {
            if (logsErr) {
                console.log(logsErr);
                return callback(logsErr, null);
            } 
             
            db.query(getinstantQuery, [], (instantErr, instantResult) => {
                if (instantErr) {
                    console.log(instantErr);
                    return callback(instantErr, null);
                }
                db.query(getvideoQuery, [], (videoErr,videoResult) => {
                    if (videoErr) {
                        console.log(videoErr);
                        return callback(videoErr, null);
                    }

                    
                   
                    db.query(getgoalQuery, [], (goalErr,goalResult) => {
                        if (goalErr) {
                            console.log(goalErr);
                            return callback(goalErr, null);
                        }
                        db.query(getnpflQuery, [], (npflErr,npflResult) => {
                            if (npflErr) {
                                console.log(npflErr);
                                return callback(npflErr, null);
                            } 
                            db.query(getgameQuery,[],(gameErr,gameResult)=>{
                                if(gameErr){
                                    console.log(gameErr)
                                    return callback(gameErr,null)
                                }
                           
                             
                const combinedResult = {
                    LOGS: logsResult,
                    INSTANT_LOGS:instantResult,
                    VIDEO_LOGS:videoResult,
                    // ALL_LOGS:allResult,
                    GOAL_LOGS:goalResult,
                    NPFL_LOGS:npflResult,
                    GAME_LOGS:gameResult,
                    
                };
                console.log(combinedResult);
                return callback(null, combinedResult);
            })
        })
        })    
    })
})
         })
    }
}