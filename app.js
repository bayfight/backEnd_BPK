const express = require('express')
const app = express()
const router = require("./route/route")
const routerDashboard = require("./route/routedashboard")

app.use('/getproduct', express.static('images/product/kopi/roasted_bean'))
app.use(router)
app.use(routerDashboard)

app.get("/", (req, res) => {
    res.send({ "status": "Server active" });
});

app.listen(3020, () => {
    console.log("Server Aktif")
})