const express = require("express");
const { users } = require("../data/users.json");

const {UserModel, BookModel} = require("../modals/index");
const router = express.Router();

/**
 * Route : /
 * Method : GET
 * Description : Get all users
 * Access : Public
 * Parameters : None
 */

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
});

/**
 * Route : /:id
 * Method : GET
 * Description : Get users by their ID
 * Access : Public
 * Parameters : ID
 */

router.get("/:id", (req, res) => {
  const { id } = req.params; // or const id = req.params.id;
  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user dosen't exist",
    });
  }
  res.status(200).json({
    success: true,
    message: "User found",
    data: user,
  });
});

/**
 * Route : /
 * Method : POST
 * Description : Creating new user
 * Access : Public
 * Parameters : None
 */

router.post("/", (req, res) => {
  const { id, name, surname, email, subscriptionType, subscriptionDate } =
    req.body;
  const user = users.find((each) => each.id === id);

  if (user) {
    res.status(404).json({
      success: false,
      message: "User with this ID exists",
    });
  } else {
    users.push({
      id,
      name,
      surname,
      email,
      subscriptionType,
      subscriptionDate,
    });
  }

  return res.status(201).json({
    success: true,
    message: "User added successfully",
    data: users,
  });
});

/**
 * Route : /:id
 * Method : PUT
 * Description : Updating user by their ID
 * Access : Public
 * Parameters : ID
 */

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User does not exist",
    });
  }
  const updateUserDetail = users.map((each) => {
    if (each.id === id) {
      return {
        ...each,
        ...data,
      };
    }
    return each;
  });
  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: updateUserDetail,
  });
});

/**
 * Route : /:id
 * Method : DELETE
 * Description : Deleting user by their ID
 * Access : Public
 * Parameters : ID
 */

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User does not exist",
    });
  }
  const index = users.indexOf(user);
  users.splice(index, 1);

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: users,
  });
});

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
