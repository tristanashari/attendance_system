const db = require("../../models")
const transporter = require("../helpers/transporter")
const handlebars = require("handlebars")
const fs = require("fs")
const crypto = require("crypto")


const employeeRegistration = async(req,res) => {
    const t = await db.sequelize.transaction()
    try{
    const {email, salary} = req.body
    const isEmailExist = await db.User.findOne({where: {email}})

    if(isEmailExist) {
        await t.rollback()
        return res.status(400).send({
            message: "email already used"
        })
    }

    const setPasswordToken = crypto.randomBytes(16).toString("hex")

    const newUser = await db.User.create({
        roleId: 2,
        email: email,
        setPasswordToken
    }, {
        transaction: t
    })

    const data = await db.User.findOne({
        where: { email: email },
    });
  
    if (data) {
        await t.rollback();
        return res.status(400).send({
          message: "account already exist",
        });
    }

    await db.Salary.create({
        userId: newUser.id,
        salary: salary
    }, {
        transaction: t
    })

    await t.commit()

    const link = `${process.env.BASEPATH_FE}/set-password/${setPasswordToken}`
    const template = fs.readFileSync("./src/template/setpassword.html", "utf-8")
    const templateCompile = handlebars.compile(template)
    const registerEmail = templateCompile({link})

    await transporter.sendMail({
        from: "Attendee",
        to: email,
        subject: "Set Your Attendee Account Password",
        html: registerEmail
    })

    res.status(200).send({
        message: "New Employee Registered"
    })
    }catch(error){
        res.status(500).send({
            message: "server error",
            error: error.message
        })
    }
}


module.exports = {
    employeeRegistration
}