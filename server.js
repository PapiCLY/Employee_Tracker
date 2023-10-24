const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3001;

const db = mysql.createConnection('mysql://root:rootroot@localhost/employee_tracker_db');

function prompts(){
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
        }
    ]).then((answers) => {
        switch(answers.action){
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
    })
    .then(() => {
        db.query('SELECT * FROM departments', function(err, results){
            console.log(results);
        })
    })

    function viewDepartments(){
        db.query('SELECT * FROM departments', function(err, results){
            console.log(results);
        })
    }

    function viewRoles(){
        db.query('SELECT * FROM roles', function(err, results){
            console.log(results);
        })
    }

    function viewEmployees(){
        db.query('SELECT * FROM employees', function(err, results){
            console.log(results);
        })
    }

    function addDepartment(){
        inquirer.prompt([
            {
                type: 'input',
                name: 'department',
                message: 'What is the name of the department you would like to add?'
            }
        ]).then((answers) => {
            db.query(`INSERT INTO departments (name) VALUES ('${answers.department}')`, function(err, results){
                console.log(results);
            })
        })
    }

    function addRole(){
        inquirer.prompt([
            {
                type: 'input',
                name: 'role',
                message: 'What is the name of the role you would like to add?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role you would like to add?'
            },
            {
                type: 'input',
                name: 'department_id',
                message: 'What is the department id of the role you would like to add?'
            }
        ]).then((answers) => {
            db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${answers.role}', '${answers.salary}', '${answers.department_id}')`, function(err, results){
                console.log(results);
            })
        })
    }

    function addEmployee(){
        inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'What is the first name of the employee you would like to add?'
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is the last name of the employee you would like to add?'
            },
            {
                type: 'input',
                name: 'role_id',
                message: 'What is the role id of the employee you would like to add?'
            },
            {
                type: 'input',
                name: 'manager_id',
                message: 'What is the manager id of the employee you would like to add?'
            }
        ]).then((answers) => {
            db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('${answers.first_name}', '${answers.last_name}', '${answers.role_id}', '${answers.manager_id}')`, function(err, results){
                console.log(results);
            })
        })
    }

    function updateEmployeeRole(){
        inquirer.prompt([
            {
                type: 'input',
                name: 'id',
                message: 'What is the id of the employee you would like to update?'
            },
            {
                type: 'input',
                name: 'role_id',
                message: 'What is the role id of the employee you would like to update?'
            }
        ]).then((answers) => {
            db.query(`UPDATE employees SET role_id = '${answers.role_id}' WHERE id = '${answers.id}'`, function(err, results){
                console.log(results);
            })
        })
    }


}

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    prompts();
});
