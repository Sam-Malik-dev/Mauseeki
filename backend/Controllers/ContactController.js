const ContactModel = require("../Models/Contact");
const UserModel = require("../Models/User");

const contact = async (req, res) => {
    try {
        const user = req.userId;

        console.log("USER ID:", user);

        const ThisUser = await UserModel.findById(user);

        if (!ThisUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                message: "Message is required",
                success: false
            });
        }

        const Contact = new ContactModel({
            email: ThisUser.email,
            message
        });

        await Contact.save();

        res.status(200).json({
            message: "Message sent successfully",
            success: true
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Internal server error...",
            success: false
        });
    }
};
const messages = async (req, res) =>{
    try {
        const contact = await ContactModel.find();
        res.status(200).json(contact);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error...", success:false});
    }
}
module.exports = { contact };