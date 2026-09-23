const mongoose = require('mongoose');
const db_url = process.env.DB;
mongoose.connect(db_url)
.then(()=>{
    console.log("Connected...");
}).catch((error)=>{
    console.log("Not connected...", error);
});