const {ObjectId} = require('bson');
const snsHandler = require(".");
/* Intializing Log Service */
const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, "../../.env") }); // For Server
require('dotenv').config({ path: path.join(__dirname, './../.env') }); // For localhost

/* Intializing Global Variable for saving company data. */
// global._companyDBStructure = { mdb: {} }
/* Starting database listner service. */
// require("./services/listener/databaselistener");

const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
// app.use(cookieParser());

// app.use('/emailtracker', require('./routes.js'));

app.get('/', (req, res) => {
    res.send("Project Running");
})

app.get('/getnotification', (req, res) => {
    // console.log(res.json());
    // snsHandler.HandleSNSNotification();
    res.send("Project Running");
})

app.listen(4009, () => {
    console.log("Successfully running on port 4009 !!! ");
});