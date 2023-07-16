const db = require("../../models")

const getSalary = async(req,res) => {
    const userId = req.user.id

    try{
        const userSalary = await db.Salary.findOne({where: {
            userId:userId,
        }})

        if(!userSalary){
            return res.status(400).send({
                message:"User Not Found"
            })
        }

        res.status(200).send({
            message:"success get salary",
            data: userSalary
        })

    }catch(error){
        res.status(500).send({
            message:"server error",
            error: error.message
        })
    }
}

module.exports = { getSalary }