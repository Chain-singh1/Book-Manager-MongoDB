const {UserModel, BookModel} = require("../modals/index");
const issuedBook = require("../dto/book-dto.js");

exports.getAllBooks = async(req, res) => {
    const books = await BookModel.find();

    if(books.length === 0){
        return res.status(404).json({
            success: false,
            message: "No Book found",
        });
    }
    return res.status(200).json({
        success: true,
        data: books,
    });
};

exports.getSingleBookById = async(req, res) => {
    const {id} = req.params;
    const book = await BookModel.findById(id);

    if(!book){
        return res.status(400).json({
            success: false,
            message: "Book not found",
        });
    }
    return res.status(200).json({
        success: true,
        data: book,
    });
};

exports.getAllIssuedBooks = async(req, res) => {
    const users = await UserModel.find({
        issuedBook: {$exists: true},
    }).populate("issuedBook");

    const issuedBooks = users.map((each) => new IssuedBook(each));
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
}

exports.addNewBook = async(req, res) => {
    const { data } = req.body;
    if(!data){
        return res.status(400).json({
            success: false,
            message: "Please provide all the required data",
        });
    }
    await BookModel.create(data);
    const allBooks = await BookModel.find();

    return res.status(201).json({
        success: true,
        message: "Book added successfully",
        data : allBooks,
    });
}


exports.updateBookById = async(req, res) => {
   const {id} = req.params;
   const {data} = req.body;
   
   const updatedBook = await BookModel.findOneAndUpdate({
    _id : id,
   }, data, {
    new: true,
   });

   return res.status(200).json({
    success: true,
    message: "Updated Book By Id",
    data: updatedBook,
   });
}


// module.exports = {getAllBooks, getSingleBookById};