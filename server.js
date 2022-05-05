require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.port || 3000;
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const errorHandler = require('./middleware/errorHandler');
const statesController = require('./controllers/statesController');


//connect to mongodb
connectDB();

app.use(cors(corsOptions));
//built in middleware for url
app.use(express.urlencoded({extended:false}));
//json data
app.use(express.json());

app.use('/', express.static(path.join(__dirname, '/public')));


//route handlers
app.use('/states', require('./routes/statesRoutes'));

//send an index file for a get request to the root
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})

//return 404 to anything not going to .../states/...
app.get('/*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if (req.accepts('json')) {
        res.json({"error": "404 Not Found"});
    }
    else {
        res.type('txt').send("404 Not Found");
    }
});



app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})


