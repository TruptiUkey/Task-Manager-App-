require('dotenv').config();   

const express = require('express');
const app = express();
const db = require('./db');     

const bodyParser = require('body-parser');      
app.use(bodyParser.json());                     
const PORT = process.env.PORT || 3000;          

app.get('/',function(req,res){   
    res.send('Welcome to the Task Manager');
})

//const {jwtAuthMiddleware} = require('./jwt');

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/user',userRoutes);
app.use('/task',taskRoutes);

app.listen(PORT,()=>{
    console.log('Listening on port 3000');
})
