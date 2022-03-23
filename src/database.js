const mysql = require("mysql");
const {promisify} = require("util");
const {database} = require("./keys")


const pool = mysql.createPool(database);


pool.getConnection((err,conn) => {
    if(err){
        console.log(err)
    }
    else{} conn.release();
console.log("db is connected")});
      
    
pool.query = promisify(pool.query)
module.exports = pool