import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import Booking from "./models/Booking.js";

const app = express();

app.use(express.json());

app.post("/book", async (req, res) => {
  try {
    const { userId, roomId, bookingDate } = req.body;

    if (!userId || !roomId || !bookingDate) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const date = new Date(bookingDate);

    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({
        message: "Invalid booking date"
      });
    }

    const booking = await Booking.create({
      userId,
      roomId,
      bookingDate: date
    });

    return res.status(201).json({
      message: "Booking successful",
      booking
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Room already booked at this time",
        errorCode: "E11000"
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      bookingDate: 1
    });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

async function startServer() {
  await mongoose.connect(process.env.MONGO_URI);

  await Booking.init();

  console.log("Connected to MongoDB");

  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

startServer().catch(console.error);