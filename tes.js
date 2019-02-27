const express = require('express');
const multer = require('multer');
var path  = require('path');
const storage = multer.diskStorage({
    destination : path.join(__dirname + './../public/images/'),
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() +
        path.extname(file.originalname));
    }
});
const upload = multer({
    storage : storage
}).single('picture');
const app = express();
app.post('/', function(req, res){
    upload(req, res, err => {
        if (err) {
        }else{
        res.send({"status":"succes"})
        console.log(res)
        }
        // var sql = "INSERT INTO product (picture)     
        // VALUES('"+req.file.filename+"')";
        // connection.query(sql, function(err, results){
        //  //script lain misal redirect atau alert :D 
        // })
     });
 });



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// It's very crucial that the file name matches the name attribute in your html


app.listen(3000, () => {
  console.log('server listening at port 3000');
});