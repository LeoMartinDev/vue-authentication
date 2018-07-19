const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

app.listen(3000, () => console.log('Server is listening on port 3000!'));