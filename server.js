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
  prompts(); 
}

function prompts() {
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

// Rest of your code remains the same

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  startApp();
});
