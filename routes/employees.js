const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const { validateEmployee, User } = require("../models/User");
const { USER_TYPES } = require("../constants");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:'outlook',
    auth:{
        user:'udulacode@outlook.com',
        pass:'r#zor2003@#'
    }
});

//create employee
router.post("/", async (req, res) => {
    const { error } = validateEmployee(req.body);
    const { email, userRole, name, phone, address } = req.body;
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }
    try {
        const doesUserAlreadyExist = await User.findOne({ email });

        if (doesUserAlreadyExist) {
            return res.status(400).json({ error: `A User with that email [${email}] already exists` })
        }
        const hashedPassword = await bcrypt.hash("abcd1234", 12);
        const newUser = new User({ name, email, password: hashedPassword, userRole, phone, address, createdAt: Date.now() });
        //save the user
        const result = await newUser.save();

        const mailOptions = {
            from:'udulacode@outlook.com',
            to:email,
            subject:'Account Created Successfully',
            text:`Dear ${name},\n\nYour account has been created Successfully.\n\nEmail:${email}\nPassword:abcd1234\n\nRegards,\nMandri Life`
        };

        transporter.sendMail(mailOptions, (error, info)=>{
            if(error){
                console.error('Error sending email:',error);
            }else{
                console.log('Email Sent:',info.response);
            }
        });

        delete result._doc.password;

        return res.status(201).json({ ...result._doc });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
})

//fetch employee
router.get("/", auth, async (req, res) => {

    try {
        const employees = await User.find({$or:[{ userRole: USER_TYPES.EMPLOYEE },
            { userRole: USER_TYPES.EMPLOYEE_MANAGER },
            { userRole: USER_TYPES.INVENTORY_MANAGER },
            { userRole: USER_TYPES.SUPPLIER_MANAGER },
            { userRole: USER_TYPES.PAYMENT_MANAGER },
            { userRole: USER_TYPES.PRODUCT_MANAGER },
            { userRole: USER_TYPES.TRANSPORT_MANAGER },
        ]}).select('-password').sort({ createdAt: 'desc' });

        return res.status(200).json({ employees })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

//update employee


router.put("/", auth, async (req, res) => {
    const { id } = req.body;

    if (!id) return res.status(400).json({ error: "no id specified." });
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ error: "Please enter a valid id" });

    try {
        const employee = await User.findOne({ _id: id });

        const updatedData = { ...req.body }
        const result = await User.findByIdAndUpdate(id, updatedData, { new: true });

        return res.status(200).json({ ...result._doc })
    } catch (err) {
        console.log(err);
    }
})

//delete employee

router.delete("/:id", auth, async (req, res) => {

    const { id } = req.params;

    if (!id) { return res.status(400).json({ error: "no id specified." }); }
    if (!mongoose.isValidObjectId(id)) { return res.status(400).json({ error: "Please enter a valid id" }); }

    try {
        const employee = await User.findOne({ _id: id });
        if (!employee) {
            return res.status(400).json({ error: "no employee found" });
        }
        await User.deleteOne({ _id: id });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
    }
});

//get a single employee

router.get("/:id", auth, async (req, res) => {
    const { id } = req.params;

    if (!id) { return res.status(400).json({ error: "no id specified." }); }
    if (!mongoose.isValidObjectId(id)) { return res.status(400).json({ error: "Please enter a valid id" }); }

    try {
        const employee = await User.findOne({ _id: id });

        return res.status(200).json({ ...employee._doc })

    } catch (err) {
        console.log(err);
    }
})

module.exports = router;