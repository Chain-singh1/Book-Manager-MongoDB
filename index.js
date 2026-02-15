const express = require('express');

const userRouter = require("./Routes/users.js");
const bookRouter = require("./Routes/books.js");

const app = express();
const port = 7000;

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message : "server is running",});
});

app.use("/users", userRouter);
app.use("/books", bookRouter);



app.use((req, res) => {
    res.status(404).json({ message: "Route doesn't exist" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});