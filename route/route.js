const router = require('express').Router();
const bodyParser = require('body-parser');
const cors = require('cors');
let upload = require('express-fileupload')
const db = require('../conection/mysqlconect');

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))
router.use(cors())
router.use(upload())


// ---------------------- SIGN UP -----------------------
router.post("/signUp", (req, res) => {
    var data = {
        nama_depan: req.body.nama_depan,
        nama_belakang: req.body.nama_belakang,
        email: req.body.email,
        pasword: req.body.pasword,
        birthday: req.body.birthday,
        gender: req.body.gender
    }
    var cekUser = 'SELECT * FROM users WHERE email = ?'
    console.log('ini fungsi signup')
    db.query(cekUser, [data.email], function (err, result) {
        console.log('dbquery')
        if (err) {
            console.log('error')
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            console.log('else1')
            console.log(result)

            console.log('data diterima dari client')
            if (result.length > 0 && result[0].email == data.email) {
                console.log('masuk if')
                res.send({
                    result,
                    "code": "100",
                    "status": "email sudah ada",
                })
            }

            else {
                console.log('masuk else')
                var newUser = 'INSERT INTO users set ?'
                db.query(newUser, data, (err, result) => {
                    if (err) throw err;
                    console.log('berhasil')
                    res.send({
                        result,
                        "code": "101",
                        "status": "berhasil singUp"
                    });
                })
            }
        }
    })

})


// ---------------------- LOGIN -----------------------
router.post('/login', (req, res) => {
    var email = req.body.email;
    var pasword = req.body.pasword;
    console.log()
    db.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields) {
        if (error) {
            // console.log("error ocurred",error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            console.log('The solution is: ', results);
            if (results.length > 0) {
                if (results[0].pasword == pasword) {
                    res.send({
                        results,
                        "code": 200,
                        "status": "login sucessfull"
                    });
                }
                else {
                    res.send({
                        "code": 204,
                        "status": "Email and password does not match"
                    });
                }
            }
            else {
                res.send({
                    "code": 203,
                    "status": "Email does not exits"
                });
            }
        }
    });
})

router.get('/login', (req, res) => {
    let data = req.body
    let sql = 'select * from users '
    db.query(sql, data, (err, result) => {
        if (err) throw err
        console.log('SUKSES')
        res.send(result)
    })
})




// // ---------------------- COFFEE -----------------------
// product roastedbean
router.get('/coffe', (req, res) => {
    db.query('SELECT * FROM product where typeProduct = 1 ',
        (err, result) => {
            if (err) throw err;
            res.send(result);
        })
})

router.get('/coffe/:id', (req, res) => {
    let sql = `select * from product where typeProduct = 1 AND id = '${req.params.id}' `
    db.query(sql, (err, result) => {
        if (err) throw err
        // console.log(result)
        res.send(result)
    })
})

// product greenbean
router.get('/greenbeanf', (req, res) => {
    db.query('SELECT * FROM product where typeProduct = 2',
        (err, result) => {
            if (err) throw err;
            res.send(result);
        })
})

router.get('/greenbeanf/:id', (req, res) => {
    let sql = `SELECT * from product where typeProduct = 2 AND id = '${req.params.id}' `
    db.query(sql, (err, result) => {
        if (err) throw err
        console.log(result)
        res.send(result)
    })
})




// ---------------------- COFFEE EQUIPMENT -----------------------
//manual brew
router.get('/manualBrewf', (req, res) => {
    db.query('SELECT * FROM product ',
        (err, result) => {
            if (err) throw err;
            res.send(result);
        })
})

router.get('/manualBrewf/:id', (req, res) => {
    let sql = `select * from product where id = '${req.params.id}' `
    db.query(sql, (err, result) => {
        if (err) throw err
        // console.log(result)
        res.send(result)
    })
})

//grinder
router.get('/grinder', (req, res) => {
    db.query('SELECT * FROM product where typeProduct = 3',
        (err, result) => {
            if (err) throw err;
            res.send(result);
        })
})

router.get('/grinder/:id', (req, res) => {
    let sql = `select * from product where typeProduct = 3 AND id = '${req.params.id}' `
    db.query(sql, (err, result) => {
        if (err) throw err
        // console.log(result)
        res.send(result)
    })
})



// ---------------------- CART -----------------------
// ADD TO CART 

router.post('/addToCart', (req, res) => {
    const { id_user, id_product, quantity } = req.body;
    let data = {
        id_user: id_user,
        id_product: id_product,
        quantity: quantity,
        status: 1
    }
    const addCart = `INSERT INTO cart set ?`
    const getQuantity = `SELECT product.quantity from product where id = ${id_product}`
    const checkCart = `SELECT * from cart where id_user = ${id_user} and id_product = ${id_product} and status = 1`

    let quantityProduct;
    db.query(checkCart, (err, result) => {
        if (err) {
            throw err;
        }
        else {
            console.log('result nih', result);
            console.log('result length', result.length)
            if (result.length > 0) {
                let setQuantityCart = `UPDATE cart SET cart.quantity = ${result[0].quantity + quantity} WHERE cart.id_product = ${result[0].id_product}`
                db.query(setQuantityCart, (err, result) => {
                    if (err) {
                        throw err;
                    } else {
                        db.query(getQuantity, (err, result2) => {
                            if (err) {
                                throw err;
                            } else {
                                quantityProduct = result2[0].quantity
                                console.log(data)
                                let setQuantity = `UPDATE product SET product.quantity = ${quantityProduct - quantity} WHERE product.id = ${id_product}`
                                db.query(setQuantity, (err, result3) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                                res.send({ status: 'sukses' })
                            }
                        })
                    }
                })
            } else {
                db.query(addCart, data, (err, result1) => {
                    if (err) {
                        throw err;
                    } else {
                        db.query(getQuantity, (err, result2) => {
                            if (err) {
                                throw err;
                            } else {
                                quantityProduct = result2[0].quantity
                                console.log(data)
                                let setQuantity = `UPDATE product SET product.quantity = ${quantityProduct - data.quantity} WHERE product.id = ${data.id_product}`
                                db.query(setQuantity, (err, result3) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                            }
                        })
                        var done = {
                            status: "sukses"
                        }
                        res.send(done)
                    }

                })
            }
        }
    })

})


// DELETE ITEM CART

router.delete('/deleteCart', (req, res) => {
    const { id_user, id_product, quantity } = req.body;

    const getQuantity = `SELECT product.quantity from product where id = ${id_product}`;

    let quantityProduct;
    let setStatusCart = `UPDATE cart SET cart.status = 5 WHERE cart.id_product = ${id_product} and id_user = ${id_user} and status = 1`
    db.query(setStatusCart, (err, result) => {
        if (err) {
            throw err;
        } else {
            db.query(getQuantity, (err, result2) => {
                if (err) {
                    throw err;
                } else {
                    quantityProduct = result2[0].quantity
                    let setQuantity = `UPDATE product SET product.quantity = ${quantityProduct + quantity} WHERE product.id = ${id_product}`
                    db.query(setQuantity, (err, result3) => {
                        if (err) {
                            throw err;
                        }
                    })
                    res.send({ status: 'sukses' })
                }
            })
        }
    })
})

// TAMBAH QUANTITY CART
router.post('/add-quantity-cart', (req, res) => {
    const { id_user, id_product, quantity } = req.body;

    const getCartQuantity = `SELECT cart.quantity from cart where id_user = ${id_user} and id_product =${id_product} and status = 1`
    const getQuantityProduct = `SELECT product.quantity from product where id = ${id_product}`;
    let quantityProduct;
    let quantityCart;

    db.query(getCartQuantity, (err, result) => {
        if (err) {
            throw err;
        } else {
            console.log('resultnya', result);
            quantityCart = result[0].quantity;
            const setStatusCart = `UPDATE cart SET cart.quantity = ${quantityCart + 1} WHERE cart.id_product = ${id_product} and id_user = ${id_user} and status = 1`
            db.query(setStatusCart, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    db.query(getQuantityProduct, (err, result2) => {
                        if (err) {
                            throw err;
                        } else {
                            quantityProduct = result2[0].quantity
                            let setQuantity = `UPDATE product SET product.quantity = ${quantityProduct - 1} WHERE product.id = ${id_product}`
                            db.query(setQuantity, (err, result3) => {
                                if (err) {
                                    throw err;
                                }
                            })
                            res.send({ status: 'sukses' })
                        }
                    })
                }
            })
        }
    })
})

// KURANG QUANTITY CART
router.post('/min-quantity-cart', (req, res) => {
    const { id_user, id_product, quantity } = req.body;

    const getCartQuantity = `SELECT cart.quantity from cart where id_user = ${id_user} and id_product =${id_product} and status = 1`
    const getQuantityProduct = `SELECT product.quantity from product where id = ${id_product}`;
    let quantityProduct;
    let quantityCart;

    db.query(getCartQuantity, (err, result) => {
        if (err) {
            throw err;
        } else {
            console.log('resultnya', result);
            quantityCart = result[0].quantity;
            const setStatusCart = `UPDATE cart SET cart.quantity = ${quantityCart - 1} WHERE cart.id_product = ${id_product} and id_user = ${id_user} and status = 1`
            db.query(setStatusCart, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    db.query(getQuantityProduct, (err, result2) => {
                        if (err) {
                            throw err;
                        } else {
                            quantityProduct = result2[0].quantity
                            let setQuantity = `UPDATE product SET product.quantity = ${quantityProduct + 1} WHERE product.id = ${id_product}`
                            db.query(setQuantity, (err, result3) => {
                                if (err) {
                                    throw err;
                                }
                            })
                            res.send({ status: 'sukses' })
                        }
                    })
                }
            })
        }
    })
})





// GET CART 

router.get('/getItemCart/:id', (req, res) => {
    var data = req.params.id;
    var ambil = `SELECT cart.id, product.product_name, product.price, SUM(cart.quantity) as quantity, product.nama_gambar FROM product INNER JOIN cart ON cart.id_product = product.id WHERE cart.id_user = ${data} AND cart.status = 1 GROUP BY product.product_name`
    db.query(ambil, data, (err, result) => {
        if (err) throw err;
        let hasil = result;
        let totalCount = 0;

        for (i = 0; i < hasil.length; i++) {
            let total = hasil[i].price * hasil[i].quantity;
            hasil[i] = {
                ...hasil[i],
                total
            }
            totalCount = totalCount + total;
        }

        const sendData = {
            total: totalCount,
            data: hasil
        }
        console.log(sendData);
        res.send(sendData)
    })
}
)


// ----------  INVOICE -------------

//  ADD INVOICE
router.post('/addToInvoice', (req, res) => {
    const { id_user, idInvoice, Alamat, Name, Phone, Total, idCart } = req.body;

    const newDate = new Date();
    const date = newDate.getDate();
    const month = newDate.getMonth();
    const year = newDate.getFullYear();
    const hour = newDate.getHours();
    const setInv = `INV${year}${month}${date}${hour}${id_user}`
    console.log('idCart', idCart[0])
    res.send({ status: setInv });
    var data = {
        idInvoice: setInv,
        Alamat: req.body.Alamat,
        Name: req.body.Name,
        Phone: req.body.Phone,
        Total: req.body.Total
    }
    var addCart = `INSERT INTO invoice set ?`
    db.query(addCart, data, (err, result) => {
        if (err) {
            throw err
        } else {
            for (let i = 0; i < (idCart.length - 1); i++) {
                const dataInvoiceDetail = {
                    idInvoice: setInv,
                    id_cart: idCart[i]
                }
                const invoiceDetail = `INSERT INTO invoicedetail set ?`;
                db.query(invoiceDetail, dataInvoiceDetail, (err, result2) => {
                    if (err) {
                        throw err;
                    } else {
                        let setQuantity = `UPDATE cart SET cart.status = 2 WHERE cart.id = ${idCart[i]}`
                        db.query(setQuantity, (err, result3) => {
                            if (err) {
                                throw err;
                            }
                        })
                    }
                })
            }
            res.send({ status: "done" })
        }
    })
})



// GET INVOICE
router.post('/addToCart', (req, res) => {
    let id = req.param.id
    let getcart = `SELECT product.product_name, product.price, SUM(cart.quantity) as quantity, product.nama_gambar FROM product INNER JOIN cart ON cart.id_product = product.id WHERE cart.id_user = ${data} AND cart.status = 1 GROUP BY product.product_name`
    db.query(addCart, data, (err, result1) => {
        if (err) {
            throw err;
        } else {
            db.query(getQuantity, (err, result2) => {
                if (err) {
                    throw err;
                }
            })
            var done = {
                status: "sukses"
            }
            res.send(done)
        }

    })
})

// ADD INVOICE DETAIL




// // GET CART UPDATE MINUS

// router.post('/getCartPlus', (req, res) => {
//     var data = [
//         {
//             productqty: req.body.productqty
//         },
//         {
//             idcart: req.body.idcart
//         }
//     ]
//     // console.log('data qty & id cart', data) 
//     var updateMinus = `UPDATE cart SET ? where ?`
//     db.query(updateMinus, data, (err, result) => {
//         if (err) throw err;

//         res.send(result);
//     })
// })


// // GET CART update minus
// router.post('/getCartMinus', (req, res) => {
//     var data = [
//         {
//             productqty: req.body.productqty
//         },
//         {
//             idcart: req.body.idcart
//         }
//     ]
//     // console.log('data qty & id cart', data) 
//     var updateMinus = `UPDATE cart SET ? where ?`
//     db.query(updateMinus, data, (err, result) => {
//         if (err) throw err;

//         res.send(result);
//     })
// })


// // add Cart Delete


// // router.post('/getCartDelete', (req, res) => {
// //     var data = [
// //         {
// //             status: 'nok'
// //         },
// //         {
// //             idcart: req.body.idcart
// //         }
// //     ]
// //     console.log(data) 
// //     var deleteCart = `UPDATE cart SET ? WHERE ?`
// //     db.query(deleteCart, data, (err, result) => {
// //         if (err) throw err;
// //         res.send(result);
// //     })
// // })



module.exports = router;