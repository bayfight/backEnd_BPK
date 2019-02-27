const router = require('express').Router();
const bodyParser= require('body-parser');
const cors = require('cors');
let upload = require('express-fileupload')
const db = require('../conection/mysqlconect');


router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))
router.use(cors())
router.use(upload())


// halaman dashboard
//product greenbean
router.get('/greenbean', (req, res) => {
    db.query('SELECT * FROM product',
        (err, result) => {
            if (err) throw err;
            res.send(result);
        }
    )
})

// post greenbean dashboard
router.post('/greenbean', (req, res) => {
    if(req.files){
        console.log(req.files)
        const product_name = req.body.product_name
        const price = req.body.price
        const deskrip = req.body.deskrip
        const quantity = req.body.quantity
        const file = req.files.nama_gambar
        const nama_gambar = file.name 
        file.mv('./images/product/kopi/' + nama_gambar, function (err){
            if(err){
                console.log(err)
                res.json({status : "Upload gagal"})
            }else{
                let greenbean ={
                    product_name, price,deskrip,quantity,nama_gambar
                }
                let sql = "INSERT INTO product set ?"
                db.query(sql ,greenbean,(err,result)=>{
                    if(err){
                        console.log(err)
                    }else{
                        res.send(result)
                        console.log(result)
                    }
                })
            }
        })
      
    }  
})

// get id greenbean dashboard
router.get('/greenbean/:id', (req, res) => {
    let sql = `select * from product where id = '${req.params.id}' `
    db.query(sql, (err, result) => {
        if (err) throw err
        // console.log(result)
        res.send(result)
    })
})


// edit dashboard
router.put('/greenbean/:id', (req, res) => {
    // console.log(req.params.id)
    if(req.files){ 
        // console.log(req.files)
        const product_name = req.body.product_name
        const price = req.body.price
        const deskrip = req.body.deskrip
        const quantity = req.body.quantity
        const file = req.files.nama_gambar
        const nama_gambar = file.name 
        file.mv('./images/product/kopi/' + nama_gambar, function (err){
            if(err){
                console.log(err)
                res.json({status : "Upload gagal"})
            }else{
                let greenbean ={
                    product_name, price,deskrip,quantity,nama_gambar
                }
                console.log(greenbean)
                let sql = `UPDATE product set ? where id = ?`
                db.query(sql ,[greenbean, req.params.id],(err,result)=>{
                    if(err){
                        // console.log(req.params.id)
                        console.log(err)
                    }else{
                        res.send(result)
                        console.log(result)
                    }
                })
            }
        })
      
    }  
})

// delete greenbean dashboard
router.delete('/greenbeandel/:id', (req, res)=>{
let sql = `DELETE from product where id = ?`
db.query(sql,req.params.id, (err,result)=>{
    if(err) throw err;
    res.send(result);
})
})




module.exports = router;