const mongoose = require("mongoose");
const bcrypt=require('bcryptjs')

const EVownerSchema = new mongoose.Schema({
  name: { type: String,sparse: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  password:{type:String, required:true},
  phone: {type: String, required: true, unique: true},
  makeModel: String,
  vehicleNumber: String,
  batteryCapacity: String
}, { timestamps: true });

EVownerSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  

EVownerSchema.pre("save", async function (next) {
    if (!this.isModified) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


module.exports = mongoose.model("EVowner", EVownerSchema);