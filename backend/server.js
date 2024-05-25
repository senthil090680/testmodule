const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Contact = require("./models/contacts");

const app = express();
const PORT = process.env.port || 5100;

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost:27017/contact_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.error(err));

app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts", error);
    res.status(500).json({ message: "Server Error " });
  }
});

app.post("/api/contacts", async (req, res) => {
  const contact = new Contact(req.body);
  try {
    const newContact = await contact.save();
    res.json(newContact);
  } catch (error) {
    console.error("Error creating contact", error);
    res.status(500).json({ message: "Server Error ", error });
  }
});

app.put("/api/contacts/:id", async (req, res) => {
  try {
    const updateContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updateContact);
  } catch (error) {
    console.error("Error updating contact", error);
    res.status(500).json({ message: "Server Error ", error });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
