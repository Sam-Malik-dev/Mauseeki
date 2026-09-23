const mongoose = require("mongoose");

const ContactSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    }
});

const ContactModel = mongoose.model("Contacts", ContactSchema);

module.exports = ContactModel;