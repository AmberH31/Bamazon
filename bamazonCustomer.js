require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
// var mysqlPass = require("./mysqlPass"); password here
const { table } = require("table"); //npm table

var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  displaySale();
  //queryAllSongs();
  //queryDanceSongs();
});

function displaySale() {
  let tableData = [];
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      var id = "ID: " + res[i].id;
      var name = "Name: " + res[i].product_name;
      var department = "Department: " + res[i].department_name;
      var price = "Price: $" + res[i].price;
      var quantity = "Quantity: " + res[i].stock_quantity;

      let data;
      data = [id, name, department, price, quantity];
      tableData.push(data);
    }
    var output = table(tableData);
    console.log(output);
    // purchasePrompt();
  });
}
