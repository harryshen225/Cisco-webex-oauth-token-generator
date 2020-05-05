const express = require('express');
const ejs = require('ejs');
const app = express();
const PORT = process.env.PORT || 5000;
const htmlRoutes = require('./routes/html-routes');
// const apiRoutes = require("./routes/api-routes").router;


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(htmlRoutes);
// app.use(apiRoutes);
app.use("/",express.static('views'))


app.listen(PORT,()=>{
    console.log(`Server started successfully and listens on port ${PORT}`)
})