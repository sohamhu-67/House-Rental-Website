const mysql=require('mysql');
const conn=mysql.createConnection({
    host:"localhost",
    port:3309,
    user:"root",
    password:"",
    database:"houseDB"
});
conn.connect(function(error){
    if(error) throw error;
     console.log("connect!!");
});
module.exports=conn;