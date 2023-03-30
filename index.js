const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const conn = require('./connection');
const cors = require('cors');
const port = process.env.PORT;
const routes = require('./routes');

//Database Accessing
conn(process.env.DATABASE_URL);
//setting json middleware
app.use(express.json());

//setup cors
app.use(cors({
    origin: JSON.parse(process.env.CLIENT_URLS),
    methods: JSON.parse(process.env.ALLOWED_METHODS),
    credentials: true,
}));

app.use('/', routes);

app.listen(3000, () => {
    console.log(`server listening at http://localhost:${port}`);
});