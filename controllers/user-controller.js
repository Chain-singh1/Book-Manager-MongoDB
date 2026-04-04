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

exports.createNewUser = async(req, res) => {
    const {id, name, surname, email, subscriptionType, subscriptionDate} = req.body;
    
    const newUser = await UserModel.create({
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
}




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