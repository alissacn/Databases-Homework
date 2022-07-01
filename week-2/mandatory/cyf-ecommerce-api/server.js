const express = require("express");
const { Pool, Client } = require("pg");
const PORT = 3000;

const app = express();

//tell node how to connect to database
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: '8014',

});

//Add a new GET endpoint /customers to load all the customers from the database
app.get("/customers", async (req, res) => {
    try {
        const selectCustomers = await pool.query("SELECT * FROM customers");
        res.json(selectCustomers.rows);
    } catch (err) {
        console.error(err.message);
    }
});



//Add a new GET endpoint /suppliers to load all the suppliers from the database
app.get("/suppliers", async (req, res) => {
    try {
        const getSuppliers = await pool.query("SELECT * FROM suppliers");
        res.json(getSuppliers.rows);
    } catch (err) {
        console.error(err.message);
    }
});



//Add a new GET endpoint /suppliers to load all the suppliers from the database
app.get("/products", async (req, res) => {
    try {
        const getProducts = await pool.query("SELECT products.product_name, suppliers.supplier_name FROM products JOIN suppliers ON products.supplier_id = suppliers.id");
        res.json(getProducts.rows);
    } catch (err) {
        console.error(err.message);
    }

})



app.listen(PORT, function () {
    console.log(`Your app is listening on port ${PORT}`);
});