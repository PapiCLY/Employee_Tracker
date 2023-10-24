const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employee_tracker_db',
    password: 'Bootcamp2023*'
});

module.exports = connection;