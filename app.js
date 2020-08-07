var express =  require('express');
var app = express();
var connectDB = require('./config/db');


connectDB();

//INIT MIDDLEWARE
app.use(express.json({
    extended: false
}));

app.get("/", (req, res) => {
    res.send("Hello From Server");
});

app.use("/api/user", require('./routes/api/user'));
app.use("/api/auth", require('./routes/api/auth'));
app.use("/api/profile", require('./routes/api/profile'));
app.use("/api/posts", require('./routes/api/posts'));

app.listen(2701, (req,res) =>{
    console.log("Server has started")
});