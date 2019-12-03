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
  user: process.env.userDB,
  // Your password
  password: process.env.passDB,
  database: process.env.db
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  displaySale();
  setTimeout(customerInquiry, 1000);
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

      //   let data;
      data = [id, name, department, price, quantity];
      tableData.push(data);
    }
    var output = table(tableData);
    console.log(output);
  });
}

function customerInquiry() {
  inquirer
    .prompt([
      {
        name: "itemID",
        type: "number",
        message: "Please choose the item ID."
        // validate: function(input) {
        //   if (input == NaN) {
        //     return false;
        //   }
        // }
      },
      {
        name: "amount",
        type: "number",
        message: "How many whould you like?"
        // validate: function(input) {
        //   if (input == NaN) {
        //     return false;
        //   }
        // }
      }
    ])
    .then(function(answer) {
      //   console.log(answer);
      var queryURL = "SELECT * FROM products WHERE id = ?";
      connection.query(queryURL, answer.itemID, function(err, res) {
        if (err) throw err;
        if (!res.length) {
          console.log("\r\n");
          console.log("Sorry, we don't have this item. Please try again!");
          setTimeout(customerInquiry, 1000);
        } else if (parseInt(answer.amount) > parseInt(res[0].stock_quantity)) {
          console.log("\r\n");
          console.log(
            "Sorry, you select the amount that is greater than what we have. Please try again!"
          );
          setTimeout(customerInquiry, 1000);
        } else if (parseInt(answer.amount) <= parseInt(res[0].stock_quantity)) {
          var totalCost = res[0].price * answer.amount;
          console.log("\r\n");
          console.log("Good news your order is in stock!");
          console.log(
            "Your total cost for " +
              " " +
              answer.amount +
              " " +
              res[0].product_name +
              " is $" +
              totalCost +
              ". Thank you!"
          );
          //   connection.query("UPDATE products SET ? WHERE ?", [
          //     { product_sales= product_sales +totalCost},
          //   ]);
          setTimeout(customerInquiry, 1000);
        }
      });
    });
}
