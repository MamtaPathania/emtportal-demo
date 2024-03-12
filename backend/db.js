const mysql2 = require('mysql2')
const dotenv = require('dotenv')
dotenv.config()

const db = mysql2.createPool({
    host:process.env.alert_DB_HOST,
    user:process.env.alert_DB_USER,
    password:process.env.alert_DB_PASS,
    database:process.env.alert_MYSQL_DB,
    port:process.env.alert_DB_PORT,
    timezone: 'utc'

})
 console.log("database connected")
module.exports = db;