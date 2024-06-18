const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.get('/', (req, res) => {
  res.send('<h1>Server is running fine, Hurray</h1>');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB URI
const uri = "mongodb+srv://vdnt:vdnt@cluster0.hhje4qf.mongodb.net/mydatabaseFinal?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

// Define a schema and model
const userSchema = new mongoose.Schema({
  name: String,
  emailid: String,
  fcity: String,
  tcity: String,
  udate: String,
  useat: String,
  utime: String,
  ubus: String,
  uorder: String,
});

const User = mongoose.model('User', userSchema);

// POST endpoint to add a user
app.post('/add-user', async (req, res) => {
  const { name, emailid, fcity, tcity, udate, useat, utime, ubus, uorder } = req.body;
  const newUser = new User({ name, emailid, fcity, tcity, udate, useat, utime, ubus, uorder });

  try {
    const user = await newUser.save();
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// GET endpoint to fetch user details by email ID
app.get('/get-user-details', async (req, res) => {
  const emailid = req.query.emailid;

  try {
    const user = await User.find({ emailid });
    if (user) {
      console.log(user);  // Log the user details to the console
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user details' });
  }
});

// GET endpoint to fetch selected seats based on criteria
// GET endpoint to fetch selected seats based on criteria
app.get('/get-selected-seats', async (req, res) => {
  const { fcity, tcity, udate, utime } = req.query;

  try {
    const selectedSeats = await User.find({
      fcity: fcity,
      tcity: tcity,
      udate: udate,
      utime: utime
    }).select('useat'); // Select only the 'useat' field

    if (selectedSeats.length > 0) { // Corrected to selectedSeats.length
      res.json(selectedSeats);
    } else {
      res.status(404).json({ error: 'No selected seats found for the provided criteria' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching selected seats' });
  }
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
