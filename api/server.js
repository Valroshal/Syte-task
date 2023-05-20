require('dotenv').config();
const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require('body-parser');

// const mongoose = require('mongoose').default;
//env imports
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// Use body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// importing user context
const catalogController = require("./services/catalogController");
const userController = require("./services/userController");
const { connectToDatabase } = require('./services/database');

app.use(cors())

// server listening
// Connect to the database
connectToDatabase().then(() => {
    // Start the server
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});

// Routes

// Register
app.post('/register', userController.register);

// Login
app.post('/login', userController.login);

// validate token
app.get('/validate_token', userController.validateToken, (req, res) => {
    res.json({ message: 'Access granted' });
});

//get catalogs
app.get('/get_catalogs', catalogController.getCatalogs);

//add catalog
app.post('/add_catalog', catalogController.addCatalog);

//update catalog
app.put('/update_catalog', catalogController.updateCatalog);
//delete catalog
app.delete('/delete_catalog/:id', catalogController.deleteCatalog);

//delete bulk of catalogs
app.delete('/bulk_delete_catalogs', catalogController.bulkDeleteCatalogs);
