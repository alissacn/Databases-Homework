const express = require("express");
const { Pool, Client } = require("pg");
const PORT = 3000;

const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

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



//1- Add a new GET endpoint /suppliers to load all the suppliers from the database
app.get("/products", (req, res) => {
    const newproduct = req.query.productname;
    const allProducts =
        "select products.product_name,suppliers.supplier_name " +
        "from products " +
        "INNER join suppliers on products.supplier_id=suppliers.id"
    const productByName =
        "select products.product_name,suppliers.supplier_name " +
        "from products " +
        "INNER join suppliers on products.supplier_id=suppliers.id " +
        "where products.product_name like $1"
    if (newproduct) {
        pool.query(productByName, [newproduct])
            .then(results => res.json(results.rows))
    } else {
        pool.query(allProducts)
            .then(results => {
                res.json(results.rows)
            })
    }
});


//3- Add a new GET endpoint /customers/:customerId to load a single customer by ID.
app.get("/customers/:customerId", (req, res) => {
    const customerId = req.params.customerId;
    const customerById = "SELECT * FROM customers WHERE id = $1";

    pool.query(customerById, [customerId])
        .then(result => res.json(result.rows))
        .catch(error => console.log("Something is wrong " + error))
});



//4- Add a new POST endpoint /customers to create a new customer
app.post("/customers", (req, res) => {
    const customerName = req.body.name;
    const customerAddress = req.body.address;
    const customerCity = req.body.city;
    const customerCountry = req.body.country;

    const checkNameExist = 'SELECT * FROM customers WHERE name = $1';
    const insertNewCustomer = 'INSERT INTO customers (name, address, city, country) VALUES ($1, $2, $3, $4)';

    pool.query(checkNameExist, [customerName])
        .then(result => {
            if (result.rows.length === 0) {
                pool.query(insertNewCustomer, [customerName, customerAddress, customerCity, customerCountry])
                    .then(() => res.send("Customer created!"))
                    .catch(error => res.error(error.message))
            } else {
                res.status(400).send(`Customer ${customerName} already exist`);
            }

        })
});



//5- Add a new POST endpoint `/products` to create a new product (with a product name, a price and a supplier id). Check that the price is a positive integer and that the supplier ID exists in the database, otherwise return an error.
app.post("/products", (req, res) => {
    let productName = req.body.product_name;
    let price = req.body.unit_price;
    let supplierId = req.body.supplier_id;

    const insertProducts = "INSERT INTO products(product_name, unit_price, supplier_id) VALUES($1, $2, $3)";
    pool.query(insertProducts, [productName, price, supplierId])
        .then(() => res.send("Product created!"))
        .catch(error => res.error(error.message))
});


//6- Add a new POST endpoint `/customers/:customerId/orders` to create a new order (including an order date, and an order reference) for a customer. Check that the customerId corresponds to an existing customer or return an error.
app.post("/customers/:customerId/orders", (req, res) => {
    let customerId = req.params.customerId;
    let orderDate = req.body.order_date;
    let orderRef = req.body.order_reference;

    const checkCustomer = "select * from customers where id = $1"
    const insertOrder = "insert into orders(order_date, order_reference, customer_id) values($1, $2, $3)";
    pool.query(checkCustomer, [customerId])
        .then(result => {
            if (result.rows.length > 0) {
                pool.query(insertOrder, [orderDate, orderRef, customerId])
                    .then(() => res.send("Order created"))
                    .catch(error => console.error("Something is wrong when adding new order" + error))
            } else {
                res.status(400).send("Customer id " + customerId + " does not exist")
            }
        })
        .catch(error => console.error("Something is wrong " + error))
});



//7- Add a new PUT endpoint /customers/:customerId to update an existing customer (name, address, city and country).
app.put('/customers/:customerId', (req, res) => {
    const customerId = req.params.customerId;
    const newName = req.body.name;
    const newAddress = req.body.address;
    const newCity = req.body.city;
    const newCountry = req.body.country;

    const updateCustomer = "UPDATE customers set name = $1, address = $2, city = $3, country = $4 where id = $5";

    pool.query(updateCustomer, [newName, newAddress, newCity, newCountry, customerId])
        .then(() => res.send("Customer updated!"))
        .catch(error => res.error(error.message));

});



//8- Add a new DELETE endpoint `/orders/:orderId` to delete an existing
app.delete("/orders/:orderId", (req, res) => {
    let orderId = req.params.orderId;
    let deleteOrder = "DELETE FROM orders WHERE id = $1";

    pool.query(deleteOrder, [orderId])
        .then(() => res.send("Order deleted"))
        .catch(error => res.error(error.message))
});



//9- Add a new DELETE endpoint /customers/:customerId to delete an existing customer only if this customer doesn't have orders.
app.delete("/customer/:customerId", (req, res) => {
    const customerId = req.params.customerId;
    const deleteCustomer = "DELETE from customers where id = $1";
    const customerOrders = "SELECT * FROM orders where id = $1";

    if (!customerOrders) {
        pool.query(deleteCustomer, [customerId])
            .then(() => res.send("Customer deleted"))
            .catch(error => res.error(error.message))
    }
});



//10- Add a new GET endpoint `/customers/:customerId/orders` to load all the orders along the items in the orders of a specific customer. Especially, the following information should be returned: order references, order dates, product names, unit prices, suppliers and quantities.
app.get("/customers/:customerId/orders", (req, res) => {
    let customerId = req.params.customerId;
    const getCustomerOrders = "select o.order_reference, o.order_date, p.product_name, p.unit_price, s.supplier_name " +
        "from orders o join order_items oi on o.id = oi.order_id " +
        "join products p on p.id = oi.product_id " +
        "join suppliers s on p.supplier_id = s.id " +
        "where o.customer_id = $1"
    pool.query(getCustomerOrders, [customerId])
        .then(result => res.json(result.rows))
        .catch(error => console.error("Something is wrong " + error))
});



app.listen(PORT, function () {
    console.log(`Your app is listening on port ${PORT}`);
});