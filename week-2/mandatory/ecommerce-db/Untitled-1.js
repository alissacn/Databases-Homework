


app.post("/hotels", (req, res) => {
    const hotelName = req.body.name;
    const hotelRooms = req.body.rooms;
    const hotelPostcode = req.body.postcode;
    // Don't do it this way. Because of SQL Injection
    // const insertHotel = `INSERT INTO hotels (name, rooms, postcode) VALUES ('${hotelName}', ${hotelRooms}, '${hotelPostcode}')`;
    // This way Postgres will detect and stop SQL Injection
    const checkNameExist = 'select * from hotels where name = $1';
    const insertHotel = 'INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3)';
    pool.query(checkNameExist, [hotelName])
        .then(result => {
            if (result.rows.length === 0) {
                // There is no hotel with the name
                pool.query(insertHotel, [hotelName, hotelRooms, hotelPostcode])
                    .then(() => res.send("Hotel created!"))
                    .catch(error => res.error(error.message));
            } else {
                // Repeated name
                res.status(400).send(`hotel ${hotelName} already exist`);
            }
        })
})

app.post('/customers', (req, res) => {
    const name = req.body.name;
    
    // Check email is not repeated
    //   If is it not, insert new customer
    //   If email is already in DB, send a status 400 and a message: Customer with email X already exist
})

app.get("/hotels", function (req, res) {
    const hotelNameQuery = req.query.name;

    const allHotels = 'select * from hotels';

    const hotelsByName = 'select * from hotels where name = $1';

    if (hotelNameQuery) {
        pool.query(hotelsByName, [hotelNameQuery])
            .then(result => res.json(result.rows))
            .catch(error => console.log("Something is wrong " + error));
    } else {
        pool.query(allHotels)
            .then(result => res.json(result.rows))
            .catch(error => console.log("Something is wrong " + error));
    }
});

app.get("/hotels/:hotelId", (req, res) => {
    const hotelId = req.params.hotelId;

    const hotelsById = 'select * from hotels where id = $1';

    pool.query(hotelsById, [hotelId])
        .then(result => res.json(result.rows))
        .catch(error => console.log("Something is wrong " + error));
});

//Get all booking of a customer by id:
app.get('/customers/bookings', (req, res) => {
    // Extracting id from url like /customers/6/bookings -> in customerId I'll get the 6
    const customerName = req.query.customerName;

    // Parametrized query with a single param which is the id of the customer
    const bookingsQuery = "select b.checkin_date, b.nights, h.name as hotel_name, c.name as customer_name " +
        "from bookings b join hotels h on b.hotel_id = h.id " +
        "join customers c on b.customer_id = c.id " +
        "where c.name = $1";

    // Sending query to Postgres using the pool
    pool.query(bookingsQuery, [customerName])
        // When I get the result, I sent it back to Postman after converting it to Json
        .then(result => res.json(result.rows))
        .catch(error => console.log("Something is wrong " + error));
})

//Updating a customer:
app.put('/customers/:customerId', (req, res) => {
    const customerId = req.params.customerId;
    const newEmail = req.body.email;
    const newCity = req.body.city;

    const updateCustomer = "UPDATE customers set email = $1, city = $2 where id = $3";

    pool.query(updateCustomer, [newEmail, newCity, customerId])
        .then(() => res.send("Customer updated!"))
        .catch(error => res.error(error.message));

})


//Deleting a customer:
app.delete("/customer/:customerId", (req, res) => {
    const customerId = req.params.customerId;

    const deleteBookings = "DELETE from bookings where customer_id = $1";
    const deleteCustomer = "DELETE from customers where id = $1";

    pool.query(deleteBookings, [customerId])
        // Bookings for a customer have been removed
        .then(() => {
            pool.query(deleteCustomer, [customerId])
                .then(() => res.send("Customer and bookings have been deleted"))
                .catch(error => res.error(error.message));
        })
        .catch(error => res.error(error.message));

})