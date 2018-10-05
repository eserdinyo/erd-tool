const express = require('express')
const bodyParser = require('body-parser')

const Sequelize = require('sequelize');
const { sequelize } = require('./sequelize');

const app = express();
app.use(bodyParser.json());



app.post('/tables', (req, res) => {
  // sequelize.query("CREATE TABLE MyGuests(id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, firstname VARCHAR(30) NOT NULL, lastname VARCHAR(30) NOT NULL, email VARCHAR(50), reg_date TIMESTAMP )")
  // res.status(200).send('YESSSSS');

  console.log(req);

  res.send("yoo")
})

app.listen(3000, () => {
  console.log('Started on port 3000');
})