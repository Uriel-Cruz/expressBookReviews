const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {

  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
  

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    
    if (books) {
      resolve(books);  
    } else {
      reject(new Error("miising books")); 
    }
  })
  .then((data) => {
    
    res.status(300).send(JSON.stringify(books, null, 4));
  })
  .catch((error) => {
    res.status(500).send("Error");
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn; 
  
    new Promise((resolve, reject) => {
      const book = books[isbn]; 
      if (book) {
        resolve(book); 
      } else {
        reject(new Error("missing book"));
      }
    })
    .then((book) => {
      return res.status(300).send(book);
    })
    .catch((error) => {
      return res.status(404).send("error");
    });
  });
  
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author; 
  new Promise((resolve, reject) => {
    let foundBook = null;
    for (const id in books) {
      if (books[id].author === author) {
        foundBook = books[id]; 
        break; 
      }
    }

    if (foundBook) {
      resolve(foundBook); 
    } else {
      reject(new Error("missing"));
    }
  })
  .then((book) => {
    return res.status(300).send(book);
  })
  .catch((error) => {
    return res.status(404).send("error");
  });

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title; 

  // Creamos una nueva promesa
  new Promise((resolve, reject) => {
    let foundBook = null;

    for (const id in books) {
      if (books[id].title === title) {
        foundBook = books[id]; 
        break; 
      }
    }

    if (foundBook) {
      resolve(foundBook);
    } else {
      reject(new Error("No se encontró el libro")); 
    }
  })
  .then((book) => {
    return res.status(300).send(book);
  })
  .catch((error) => {
    return res.status(404).send("error");
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(300).send(books[isbn].reviews);
});

module.exports.general = public_users;
