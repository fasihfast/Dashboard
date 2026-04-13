import mongoose from "mongoose";

const victimSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  caller: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["Building Fire", "Kitchen Fire", "Vehicle Fire", "Other"],
    default: "Other"
  },
  status: {
    type: String,
    enum: ["active", "pending", "resolved"],
    default: "active"
  },
  date: {
    type: String,
    default: () =>
      new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
  },
  time: {
    type: String,
    default: () => new Date().toLocaleTimeString()
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  lat: Number,
  lng: Number
});

// 👇 Pre-save hook to auto-generate IDs like F001, F002
victimSchema.pre("save", async function (next) {
  if (!this.id) {
    const lastVictim = await this.constructor.findOne().sort({ _id: -1 });
    let newNumber = 1;
    if (lastVictim && lastVictim.id) {
      const lastNumber = parseInt(lastVictim.id.replace("F", ""));
      newNumber = lastNumber + 1;
    }
    this.id = `F${newNumber.toString().padStart(3, "0")}`;
  }
  next();
});

export default mongoose.model("Victim", victimSchema);
