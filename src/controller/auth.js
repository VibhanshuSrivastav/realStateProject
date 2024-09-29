// src/controller/auth.js
const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const conn = require('../db/config');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { isAdminAuthenticated } = require('../controller/authMiddleware')
require('dotenv').config;



// Home route - renders the index.ejs page
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/paymentPlan', (req, res) => {
    res.render('paymentPlan');
});

// dashboard

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/contactDetails',isAdminAuthenticated, (req, res) => {
    // Query to fetch contact details from your database
    if (req.session.user) {
    conn.query('SELECT * FROM EnquiryDetails', (err, results) => {
        if (err) {
            // Handle the error and send an error message if data retrieval fails
            return res.status(500).json({ message: 'Error retrieving data' });
        }
        
        // Render the contactDetails view and pass the retrieved results as data
        console.log(results);
        res.render('./dashboard/contactDetails', { contacts: results });
    });}else{
        res.redirect('/login')
    }
});

router.get('/delete/:id', (req, res) => {
    const contactId = req.params.id;
    conn.query('DELETE FROM EnquiryDetails WHERE id = ?', [contactId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting contact' });
        }
        res.redirect('/contactDetails');
    });

});





router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(email === process.env.EMAIL && password === process.env.LOGIN_PASS){
        req.session.user = { email, role: 'admin' };
        res.redirect('/dashboard');
    }else{
        res.redirect('/login');
    }
});


// Logout API
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.json({ message: 'Logged out successfully' }); // Send success message
    });
});



// Protect the dashboard route without middleware
router.get('/dashboard',isAdminAuthenticated, async (req, res) => {
    if (req.session.user) {
        res.render('./dashboard/dashboardIndex')
    }
    else {
        res.redirect('/login')
    }
});

// Twilio configuration For whatsapp message
const accountSid =  process.env.TWILIO_ACCOUNT_SID  ;   // Your Account SID
const authToken =  process.env.TWILIO_ACCOUNT_TOKEN ;  // Replace with your actual Auth Token
const client = twilio(accountSid, authToken);

// Handling form submission
router.post('/submit', async (req, res) => {
    const { name, mobile } = req.body;
    console.log(`Name: ${name}, Mobile: ${mobile}`);

    const sendMessage = async () => {
        try {
            const message = await client.messages.create({
                body: `New Enquiry:\nName: ${name}\nMobile: ${mobile}`,
                from: 'whatsapp:+13342316647',
                to: 'whatsapp:+919117996473'
            });
            console.log('WhatsApp message sent:', message.sid);
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
        }
    };

    await sendMessage();

    const query = 'INSERT INTO EnquiryDetails (Name, Mobile) VALUES (?, ?)';
    conn.query(query, [name, mobile], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('An error occurred while saving data.');
            return;
        }
        console.log('Data inserted successfully:', result);
         res.send('Data submitted successfully!'); // Send this message back to the client
    });

});








module.exports = router;
