const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const user = require("./routes/api/user");
const order = require("./routes/api/order");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const db = require("./config/keys").mongoURI;
// Connect to DB
mongoose
    .connect(db)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('Hello World!')
});

// Routes
app.use("/user", user);
app.use("/order", order);

const port = process.env.PORT || 5050;
app.listen(port, () => console.log(`Server running on port ${port}`));