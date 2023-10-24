require = require('esm')(module);

const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const app = express();
const PORT = process.env.PORT || 3001;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'employee_tracker_db',
});

function startApp() {
  prompts(inquirer);
}

function prompts(inquirer) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
      }
    });
}

function viewDepartments() {
  db.query('SELECT * FROM departments', function (err, results) {
    console.log(results);
  });
}

function viewRoles() {
  db.query('SELECT * FROM roles', function (err, results) {
    console.log(results);
  });
}

function viewEmployees() {
  db.query('SELECT * FROM employees', function (err, results) {
    console.log(results);
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'department',
        message: 'What is the name of the department you would like to add?',
      },
    ])
    .then((answers) => {
      db.query(`INSERT INTO departments (name) VALUES ('${answers.department}')`, function (err, results) {
        console.log(results);
      });
    });
}



app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  startApp(); 
});
