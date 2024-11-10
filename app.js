const conn=require('./route/connection');
const express=require('express');
const path=require('path');
const bodyparser=require('body-parser');
const PORT=process.env.PORT || 3000;
const app=express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.get("/",function(req,res){
    res.render('main',{TittleWB:'Hsy'});
});

app.get("/listProp",function(req,res){
    res.render('listpr',{TittleWB:'List-Your-Property'})
});
app.get('/success', (req, res) => {
    res.render('success', { message: 'Property listed successfully!' });
});
app.get('/agentlist',function(req,res){
    res.render('agentlist',{TittleWB:'Choose your agent'});
});
app.post('/agentlist', (req, res) => {
    const loc = req.body.Location;
    let sql;
    let queryParams = [];

    // Adjust the SQL based on location
    if (loc === 'All') {
        sql = `SELECT * FROM agent_list`;
    } else {
        sql = `SELECT * FROM agent_list WHERE location = ?`;
        queryParams.push(loc);
    }

    console.log(`Executing SQL: ${sql}`, queryParams); // Log the SQL query

    conn.query(sql, queryParams, function (error, result) {
        if (error) {
            console.error(`Database Query Error: ${error.message}`);
            return res.status(500).send('Internal Server Error');
        }
        if (!result || !Array.isArray(result)) {
            console.log('No agent data found or result is not an array.');
            return res.render('agentfinal', { agentdata: [], TittleWB: 'Agent List' });
        }
        res.render('agentfinal', { agentdata: result, TittleWB: 'Agent List' });
    });
});
app.get('/properties', (req, res) => {
    const query = 'SELECT * FROM homedb';  // Query to fetch all properties

    conn.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error fetching properties');
        }

        res.render('propert', {
            TittleWB: 'See Properties',
            properties: results
        });
    });
});

app.post("/listprop",function(req,res){
    console.log(req.body);  
    const { fullName, mobileNumber, city, pin, location, carpetArea, email } = req.body;
    const sql = `INSERT INTO listmyprop (name, mno, city, pin, location, area, email) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    conn.query(sql,[fullName, mobileNumber, city, pin, location, carpetArea, email],(err,result)=>{
        if(err){
            console.error('Error inserting data into the database:', err);
            return res.status(500).send('Server error');
        }
        res.redirect('/success');  
    });
});
app.listen(PORT,function(res,req){
    console.log(`server is on`);
});

