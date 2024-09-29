const mysql = require("mysql");

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: 'sql12734187'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the database successfully');
});

// Remember to close the connection when done
// process.on('SIGINT', () => {
//     nodconnection.end((err) => {
//         if (err) {
//             console.error('Error closing the connection:', err.message);
//         }
//         console.log('Database connection closed.');
//         process.exit();
//     });
// });
// TESTING
// connection.query('SELECT * FROM EnquiryDetails', (error, results) => {
//     if (error) {
//         console.error('Error executing query:', error);
//         return;
//     }
//     console.log('Query results:', results);

//     // Close the connection when done
//     connection.end(err => {
//         if (err) {
//             return console.error('Error closing connection:', err);
//         }
//         console.log('Connection closed.');
//     });
// });

module.exports = connection ;

