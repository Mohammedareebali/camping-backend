"use strict";
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log('mongodb connected'))
    .catch((err) => console.log(err));
//# sourceMappingURL=db.js.map