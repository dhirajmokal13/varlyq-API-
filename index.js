require('dotenv').config();
const express = require('express');
const app = express();
const conn = require('./connection');
const cors = require('cors');
const port = process.env.PORT;
const routes = require('./routes');

//Database Accessing
conn(process.env.DATABASE_URL_CLOUD); //speed may be slow in case of cloud database
//setting json middleware
app.use(express.json());

//setup cors *without cors this will work in postman Not in Browser
app.use(cors({
    origin: JSON.parse(process.env.CLIENT_URLS),
    methods: JSON.parse(process.env.ALLOWED_METHODS),
    credentials: true,
}));

app.use('/', routes);

app.listen(3000, () => {
    console.log(`server listening at http://localhost:${port}`);
});