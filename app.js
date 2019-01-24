let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let mysql = require('mysql')
var cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use('/getproduct', express.static('images/product/kopi'))


let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'bpk'
})


// Sign UP
app.post("/signUp", (req, res) => {
    var data = {
        nama_depan: req.body.nama_depan,
        nama_belakang: req.body.nama_belakang,
        email: req.body.email,
        pasword: req.body.pasword,
        birthday: req.body.birthday,
        gender: req.body.gender

    }

    var newUser = 'INSERT INTO users set ?'
    db.query(newUser, data, (err, result) => {
        if (err) throw err;
        console.log('berhasil')
        res.send(result);
    })
})

// login
app.post('/login', (req, res) => {

    db.query('SELECT * FROM users where ? and ?',
        [
            {
                email: req.body.email,
            },
            {
                pasword: req.body.pasword,
            }
        ],
        (err, result) => {
            if (err) throw err;
            res.send(result);
            console.log(result)
        }
    )
})


// product
app.get('/coffe', (req, res) => {
    db.query('SELECT * FROM product',
        (err, result) => {
            if (err) throw err;
            res.send(result);
        })
})

// halaman dashboard
//product greenbean
app.get('/greenbean', (req, res) => {
    db.query('SELECT * FROM product',
        (err, result) => {
            if (err) throw err;
            res.send(result);
        }
    )
})

app.post('/greenbean/post', (req, res) => {
    let isi = {
        product_name: req.body.product_name,
        price: req.body.price,
        deskrip: req.body.deskrip,
        quantity: req.body.quantity
    }
    let newProduct = 'INSERT INTO product set?'
    db.query(newProduct, isi, (err, result) => {
        if (err) throw err;
        console.log('berhasil')
        res.send(result);
    })
})





app.listen(3020, () => {
    console.log("Server Aktif")
})