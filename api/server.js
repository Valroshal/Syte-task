require('dotenv').config();
const express = require("express")
const http = require("http")
const app = express()
const cors = require("cors")
const server = http.createServer(app);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const crypted = require('crypto');
const { MONGO_URI } = process.env;


const mongoose = require('mongoose').default;
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// Use body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// importing user context
const User = require("./model/user.js");
const Catalog = require("./model/catalog.js");

app.use(cors())



async function connectToDatabase() {
    try {
        await mongoose.connect(MONGO_URI,  {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => console.log("Database connected!"))
            .catch(err => console.log(err));
        console.log('Connected to the database');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}
connectToDatabase().then()

// server listening
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Register
app.post("/register", async (req, res) => {

    // Our register logic starts here
    let encryptedPassword;
    try {
        // Get user input
        const {email, password} = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({email});

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Generate a random string with a length of 32 characters
        const randomString = crypted.randomBytes(16).toString('hex');
        // Create token
        const token = jwt.sign(
            {user_id: user._id, email},
            randomString,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

// Login
app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        console.log('user._doc.password', user._doc.password)
        if (user && (await bcrypt.compare(password, user._doc.password))) {

            // Generate a random string with a length of 32 characters
            const randomString = crypted.randomBytes(16).toString('hex');
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                randomString,
                {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;

            // user
            res.status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
});

//get catalogs
app.get("/get_catalogs", async (req, res) => {
    try {
        const catalogs = await Catalog.find().exec();
        res.send({
            success: true,
            data: catalogs
        });
    } catch (err) {
        console.log(err);
        res.send({
            success: false
        });
    }
});

//add catalog TODO need to check if primary of this type exists before creating
app.post("/add_catalog", async (req, res) => {
    try {
        const { name, vertical, is_primary } = req.body;

        // Validate if catalog exist in our database
        const existing_catalog = await Catalog.findOne({ name });
        if (existing_catalog) {
            throw new Error('Catalog already exists');
        }

        // Check if the primary catalog for this vertical already exists
        const catalogs = await Catalog.find().exec();

        const primaryCatalogExists = catalogs.some(cat => cat.vertical === vertical && cat.is_primary === true && is_primary === true);
        if (primaryCatalogExists) {
            throw new Error('The primary catalog for this vertical already exists');
        }

        // Create catalog in our database
        const catalog = await Catalog.create({
            name: name,
            vertical: vertical,
            is_primary: is_primary,
        });

        // return new catalog
        res.status(201).json(catalog);

    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
});

//update catalog
app.put("/update_catalog", async (req, res) => {
    try {
        //const { id } = req.params; // Get the catalog ID from the URL parameter
        const { name, is_primary } = req.body; // Get the updated catalog data from the request body

        // Find the catalog by ID and update its properties
        const updatedCatalog = await Catalog.findOneAndUpdate(
            { name }, // Find the document with a specific name
            { is_primary: is_primary }, // Update the is_primary field
            { new: true } // Return the updated document after the update is applied
        );

        // Check if the catalog was found and updated
        if (!updatedCatalog) {
            return res.status(404).json({ error: "Catalog not found" });
        }

        // Return the updated catalog
        res.json(updatedCatalog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

//delete catalog
app.delete("/delete_catalog/:id", async (req, res) => {
    try {
        const { id } = req.params; // Get the catalog ID from the URL parameter

        // Find the catalog by ID and delete it
        const deletedCatalog = await Catalog.findByIdAndDelete(id);

        // Check if the catalog was found and deleted
        if (!deletedCatalog) {
            return res.status(404).json({ error: "Catalog not found" });
        }

        res.json({ success: true, message: "Catalog deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

//delete bulk of catalogs
app.delete("/bulk_delete_catalogs", async (req, res) => {
    try {
        const { catalogIds } = req.body; // Assuming the request body contains an array of catalog IDs

        // Delete multiple catalogs by IDs
        const deletedCatalogs = await Catalog.deleteMany({ _id: { $in: catalogIds } });

        // Check if any catalogs were deleted
        if (deletedCatalogs.deletedCount === 0) {
            return res.status(404).json({ error: "No catalogs found" });
        }

        res.json({ success: true, message: "Catalogs deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});
