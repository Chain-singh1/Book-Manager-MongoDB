const express = require("express");
const { users } = require("../data/users.json");
const {getAllUsers, getUserById, deleteUser, updateUserData, createNewUser} = require("../controllers/user-controller");

const {UserModel, BookModel} = require("../modals/index");
const router = express.Router();

/**
 * Route : /
 * Method : GET
 * Description : Get all users
 * Access : Public
 * Parameters : None
 */

router.get("/", getAllUsers);

/**
 * Route : /:id
 * Method : GET
 * Description : Get users by their ID
 * Access : Public
 * Parameters : ID
 */

router.get("/:id", getUserById);

/**
 * Route : /
 * Method : POST
 * Description : Creating new user
 * Access : Public
 * Parameters : None
 */

router.post("/", createNewUser);

/**
 * Route : /:id
 * Method : PUT
 * Description : Updating user by their ID
 * Access : Public
 * Parameters : ID
 */

router.put("/:id", updateUserData);

/**
 * Route : /:id
 * Method : DELETE
 * Description : Deleting user by their ID
 * Access : Public
 * Parameters : ID
 */

router.delete("/:id", deleteUser);

/**
 * Route : /users/subscription-details/:id
 * Method : GET
 * Description : Get subscription details of a user by their ID
 * Access : Public
 * Parameters : ID
 */

router.get("/subscription-details/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user with ID not found",
    });
  }

  const getDateInDays = (data = "") => {
    let date;
    if (data === "") {
      date = new Date();
    } else {
      date = new Date(data);
    }
    let days = Math.floor(date / (1000 * 60 * 60 * 24));
    return days;
  };

  const subscriptionType = (date) => {
    if (user.subscriptionType == "Basic") {
      date = date + 90;
    } else if (user.subscriptionType == "Standard") {
      date = date + 180;
    } else if (user.subscriptionType == "Premium") {
      date = date + 365;
    }
    return date;
  };

  let returnDate = getDateInDays(user.returnDate);
  let currentDate = getDateInDays();
  let subscriptionDate = getDateInDays(user.subscriptionDate);
  let subscriptionEndDate = subscriptionType(subscriptionDate);

  const data = {
    ...user,
    subscriptionExpired: subscriptionEndDate < currentDate,
    daysLeftForExpiration:
      subscriptionEndDate <= currentDate
        ? 0
        : subscriptionEndDate - currentDate,
    fine:
      returnDate < currentDate
        ? subscriptionEndDate <= currentDate
          ? 100
          : 50
        : 0,
  };
  return res.status(200).json({
    success: true,
    message: "Subscription details of the user : ",
    data,
  });
});

module.exports = router;
