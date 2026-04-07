const express = require("express");
const {getAllBooks, getSingleBookById, getAllIssuedBooks, addNewBook, updateBookById} = require("../controllers/book-controller.js");

const {UserModel, BookModel} = require("../modals/index");
const router = express.Router();

/**
 * Route : /books
 * Method : GET
 * Description : Get all books
 * Access : Public
 * Parameters : None
 */

router.get("/", getAllBooks);

/**
 * Route : /books/issued
 * Method : GET
 * Description : Get all issued books
 * Access : Public
 * Parameters : ID
 */

router.get("/issued/by-user", getAllIssuedBooks);


/**
 * Route : /books/:id
 * Method : GET
 * Description : Get books by ID
 * Access : Public
 * Parameters : ID
 */
router.get("/:id", getSingleBookById);


/**
 * Route : /b
 * Method : POST
 * Description : Adding a new book
 * Access : Public
 * Parameters : None
 */

router.post("/", addNewBook);


/**
 * Route : /updatebook/:id
 * Method : PUT
 * Description : Updating a book by ID
 * Access : Public
 * Parameters : ID
 */
router.put("/updatebook/:id", updateBookById);


module.exports = router;