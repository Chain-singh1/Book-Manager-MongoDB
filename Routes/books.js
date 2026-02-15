const express = require("express");
const {books} = require("../data/books.json");
const {users} = require("../data/users.json");
const router = express.Router();

/**
 * Route : /books
 * Method : GET
 * Description : Get all books
 * Access : Public
 * Parameters : None
 */

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        data: books,
    });
});


/**
 * Route : /books/issued
 * Method : GET
 * Description : Get all issued books
 * Access : Public
 * Parameters : ID
 */

router.get("/issued", (req, res) => {
    const userWithIssuedBooks = users.filter((each) => {
        if(each.issuedbook) return each;
    });
    const issuedBooks = [];
    userWithIssuedBooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedbook);
        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;
        issuedBooks.push(book);
    });
    if(issuedBooks.length === 0){
        return res.status(404).json({
            success: false,
            message: "No books issued yet",
        });
    }
    return res.status(200).json({
        success: true,
        message: "users with issued books : ",
        data: issuedBooks,
    });
});


/**
 * Route : /books/:id
 * Method : GET
 * Description : Get books by ID
 * Access : Public
 * Parameters : ID
 */
router.get("/:id", (req, res) => {
    const {id} = req.params;
    const book = books.find((each) => each.id === id);
    if(!book){
        return res.status(404).json({
            success: false,
            message: "Book not found",
        });
    }
    return res.status(200).json({
        success: true,
        data: book,
    });
});


/**
 * Route : /b
 * Method : POST
 * Description : Adding a new book
 * Access : Public
 * Parameters : None
 */

router.post("/", (req, res) => {
    const {data} = req.body;

    if(!data){
        return res.status(400).json({
            success: false,
            message: "No data to add a book",
        });
    }

    const book = books.find((each) => each.id === data.id);
    if(book){
        return res.status(409).json({
            success: false,
            message: "ID already exists",
        });
    }
    const allBooks = { ...books, data}; 
    return res.status(201).json({
        success: true,
        message: "Book added successfully",
        data: allBooks,
    });
});


/**
 * Route : /updatebook/:id
 * Method : PUT
 * Description : Updating a book by ID
 * Access : Public
 * Parameters : ID
 */
router.put("/updatebook/:id", (req, res) => {
    const id = req.params.id;
    const {data} = req.body;
    
    const book = books.find((each) => each.id === id);
    if(!book){
        return res.status(400).json({
            success: false,
            message: "Book not found",
        });
    }
    const updateData = books.map((each) => {
        if(each.id === id){
            return {
                ...each,
                ...data,
            }
        }
        return each;
    });
    return res.status(200).json({
        success: true,
        message: "Book data updated successfully",
        data: updateData,
    });
});


module.exports = router;