const express = require("express");
const {getAllUsers, getUserById, deleteUser, updateUserData, createNewUser, getSubscriptionDetails} = require("../controllers/user-controller");

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

  router.get("/subscription-details/:id", getSubscriptionDetails);

module.exports = router;
