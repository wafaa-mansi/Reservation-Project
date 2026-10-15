import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },

  roomId: {
    type: String,
    required: true
  },

  bookingDate: {
    type: Date,
    required: true
  }
});

bookingSchema.index(
  { roomId: 1, bookingDate: 1 },
  { unique: true }
);

export default mongoose.model("Booking", bookingSchema);