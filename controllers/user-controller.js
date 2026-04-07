const {UserModel, BookModel} = require("../modals/index");


exports.getAllUsers = async(req, res) => {
    const users = await UserModel.find();

    if(users.length === 0){
        return res.status(404).json({
            success: false,
            message: "No user found",
        });
    }
    return res.status(200).json({
        success: true,
        message: "These are all the users found",
        data: users,
    });
}

exports.getUserById = async(req, res) => {
    const {id} = req.params;
    const user = await UserModel.findById({_id:id});

    if(!user){
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    return res.status(200).json({
        success: true,
        message: "User found",
        data: user,
    });
}

exports.createNewUser = async (req, res) => {
  try {
    const { id, name, surname, email, subscriptionType, subscriptionDate } = req.body;
    const existingUser = await UserModel.findOne({ id });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this ID already exists",
      });
    }

    const newUser = await UserModel.create({
      _id: id,
      name,
      surname,
      email,
      subscriptionType,
      subscriptionDate,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.updateUserData = async(req, res) => {
    const {id} = req.params;
    const {data} = req.body;
    const updatedUserData = await UserModel.findOneAndUpdate(
        {_id:id},
        {$set: {
            ...data,
        }},
        {new:true});
    
    return res.status(200).json({
        success: true,
        message: "User data updated successfully",
        data: updatedUserData,
    });
}

exports.deleteUser = async(req, res) => {
    const {id} = req.params;
    const user = await UserModel.deleteOne({_id:id});

    if(!user){
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    return res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: user,
    });
}


exports.getSubscriptionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findOne({ _id:id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with ID not found",
      });
    }

    const getDateInDays = (data = "") => {
      let date = data ? new Date(data) : new Date();
      return Math.floor(date / (1000 * 60 * 60 * 24));
    };

    const subscriptionType = (date) => {
      if (user.subscriptionType === "Basic") {
        return date + 90;
      } else if (user.subscriptionType === "Standard") {
        return date + 180;
      } else if (user.subscriptionType === "Premium") {
        return date + 365;
      }
      return date;
    };

    const returnDate = getDateInDays(user.returnDate);
    const currentDate = getDateInDays();
    const subscriptionDate = getDateInDays(user.subscriptionDate);
    const subscriptionEndDate = subscriptionType(subscriptionDate);

    const data = {
      ...user._doc, // important for mongoose and another way to get data is user.toObject()
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
      message: "Subscription details of the user",
      data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};