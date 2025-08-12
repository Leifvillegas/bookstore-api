'use strict';

// ############################################# //
// ##### Server Setup for Bookstore Management API #####
// ############################################# //

// Importing packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
// Define the port for the server to listen on
const port = process.env.PORT || 3000; // Default port set to 3000

// Middleware setup
// Enable CORS (Cross-Origin Resource Sharing) for all routes
app.use(cors());
// Enable Express to parse JSON formatted request bodies
app.use(express.json());

// MongoDB connection string.
// This string is generated from the inputs provided in the UI.
mongoose.connect('mongodb+srv://userj:1234@cluster0.yqdlclo.mongodb.net/Book', {
    useNewUrlParser: true, // Use the new URL parser instead of the deprecated one
    useUnifiedTopology: true // Use the new server discovery and monitoring engine
})
.then(() => {
    console.log('Connected to MongoDB');
    // Start the Express server only after successfully connecting to MongoDB
    app.listen(port, () => {
        console.log('Bookstore API Server is running on port ' + port);
    });
})
.catch((error) => {
    // Log any errors that occur during the MongoDB connection
    console.error('Error connecting to MongoDB:', error);
});


// ############################################# //
// ##### Bookstore Model Setup #####
// ############################################# //

// Define Mongoose Schema Class
const Schema = mongoose.Schema;

// Create a Schema object for the Bookstore model
// This schema defines the structure of bookstore documents in the MongoDB collection.
const bookstoreSchema = new Schema({
    Author: { type: String, required: true  },
    Title: { type: String, required: true  },
    Pages: { type: Number, required: true  }
});

// Create a Mongoose model from the bookstoreSchema.
// This model provides an interface to interact with the 'bookstores' collection in MongoDB.
// Mongoose automatically pluralizes "Bookstore" to "bookstores" for the collection name.
const Bookstore = mongoose.model("Bookstore", bookstoreSchema);


// ############################################# //
// ##### Bookstore API Routes Setup #####
// ############################################# //

// Create an Express Router instance to handle bookstore-related routes.
const router = express.Router();

// Mount the router middleware at the '/api/bookstores' path.
// All routes defined on this router will be prefixed with '/api/bookstores'.
app.use('/api/bookstore', router);

// Route to get all bookstores from the database.
// Handles GET requests to '/api/bookstores/'.
router.route("/")
    .get(async (req, res) => { // Added async
        try {
            const bookstore = await Bookstore.find(); // Added await
            res.json(bookstore);
        } catch (err) {
            res.status(400).json("Error: " + err);
        }
    });

// Route to get a specific bookstore by its ID.
// Handles GET requests to '/api/bookstores/:id'.
router.route("/:id")
    .get(async (req, res) => { // Added async
        try {
            const bookstore = await Bookstore.findById(req.params.id); // Added await
            res.json(bookstore);
        } catch (err) {
            res.status(400).json("Error: " + err);
        }
    });

// Route to add a new bookstore to the database.
// Handles POST requests to '/api/bookstores/add'.
router.route("/add")
    .post(async (req, res) => { // Added async
        // Extract attributes from the request body.
        const Author = req.body.Author;
        const Title = req.body.Title;
        const Pages = req.body.Pages;

        // Create a new Bookstore object using the extracted data.
        const newBookstore = new Bookstore({
            Author,
            Title,
            Pages
        });

        try {
            await newBookstore.save(); // Added await
            res.json("Bookstore added!");
        } catch (err) {
            res.status(400).json("Error: " + err);
        }
    });

// Route to update an existing bookstore by its ID.
// Handles PUT requests to '/api/bookstores/update/:id'.
router.route("/update/:id")
    .put(async (req, res) => { // Added async
        try {
            const bookstore = await Bookstore.findById(req.params.id); // Added await
            if (!bookstore) {
                return res.status(404).json("Error: Bookstore not found");
            }

            // Update the bookstore's attributes with data from the request body.
            bookstore.Author = req.body.Author;
                bookstore.Title = req.body.Title;
                bookstore.Pages = req.body.Pages;

            await bookstore.save(); // Added await
            res.json("Bookstore updated!");
        } catch (err) {
            res.status(400).json("Error: " + err);
        }
    });

// Route to delete a bookstore by its ID.
// Handles DELETE requests to '/api/bookstores/delete/:id'.
router.route("/delete/:id")
    .delete(async (req, res) => { // Added async
        try {
            const deletedBookstore = await Bookstore.findByIdAndDelete(req.params.id); // Added await
            if (!deletedBookstore) {
                return res.status(404).json("Error: Bookstore not found");
            }
            res.json("Bookstore deleted.");
        } catch (err) {
            res.status(400).json("Error: " + err);
        }
    });

//GET ALL BOOKS
//Method: GET
//URL: http://localhost:3000/api/bookstore
//Result: Returns an array of all books in the bookstore collection.

//ADD NEW BOOK
//Method: POST
//URL: http://localhost:3000/api/bookstore/add
//Headers: Content-Type: application/json
//Body (raw JSON):
// {
//    "Title": "Dune",
//    "Author": "Frank Herbert",
//   "Pages": 412
// }
//Result: "Bookstore added!"

//GET A BOOK BY ID
//Method: GET
//URL: http://localhost:3000/api/bookstore/<_id>
//(Replace <_id> with the MongoDB document’s _id from the GET all request)
//Result: Returns that single book document.

//UPDATE a book by ID 
//Method: PUT
//URL: http://localhost:3000/api/bookstore/update/<_id>
//Headers: Content-Type: application/json
//Body (raw JSON):
// {
// "Title": "Dune Messiah",
//"Author": "Frank Herbert",
//"Pages": 320
// }
//Result: "Bookstore updated!"

//DELETE A BOOK BY ID
//Method: DELETE
//URL: http://localhost:3000/api/bookstore/delete/<_id>
//Result: "Bookstore deleted."
  