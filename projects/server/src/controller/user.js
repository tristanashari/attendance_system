const db = require("../../models")

const getAllUsers = async(req,res) => {
    try{
        const allUsers = await db.User.findAll()

        return res.status(200).send({
            message:"All Users",
            data: allUsers
        })
    }catch(error){
        return res.status(500).send({
            message: "server error",
            error: error.message
        })
    }
}

module.exports = {
    getAllUsers
}