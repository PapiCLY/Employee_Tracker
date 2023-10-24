const inquirer = require('inquirer');
const mysql = require('mysql2');
const connection = require('./db/connection');

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('connected to database');
        start();
    }
});

const start = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'start',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Exit'
            ]
        }
    ])
    .then((answer) => {
        if (answer.start === 'View All Departments') {
            viewDepartments();
        } else if (answer.start === 'View All Roles') {
            viewRoles();
        } else if (answer.start === 'View All Employees') {
            viewEmployees();
        } else if (answer.start === 'Add Department') {
            addDepartment();
        } else if (answer.start === 'Add Role') {
            addRole();
        } else if (answer.start === 'Add Employee') {
            addEmployee();
        } else if (answer.start === 'Update Employee Role') {
            updateEmployeeRole();
        } else if (answer.start === 'Exit') {
            connection.end();
        }
    })
    .catch((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('connected to database');
            start();
        }
    });
};

// Define  viewDepartments, viewRoles, addDepartment, addRole, addEmployee, and updateEmployeeRole
const newDepartment = ()=> {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the new department?'
        }
    ])
    .then((answer) => {
        connection.query('INSERT INTO department SET ?', {name: answer.department}, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Department added');
                start();
            }
        });
    });
}

const viewDepartments = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        
        const list = res.map(({ id, name }) => ({ name, value: id }));
        console.log(list);
    });
};

const addJob = () => {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) {
            console.log(err);
            return;
        }

        const departmentChoices = res.map(({ id, title }) => ({ name: title, value: id });

        inquirer.prompt([
            {
                type: 'input',
                name: 'job_name',
                message: 'What is the name of the new role?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the new role?'
            },
            {
                type: 'list',
                name: 'department',
                message: 'What department is the new role in?',
                choices: departmentChoices
            }
        ])
        .then((answers) => {
            console.log(answers);
            connection.query(`INSERT INTO role(title, salary, department_id) VALUES('${answers.job_name}', ${answers.salary}, ${answers.department})`, 
            (err, res) => { 
                if (err) {
                    console.log(err);
                } else {
                    console.log(res);
                }
                start();
            });
        });
    };
};

    // You may want to call addJob somewhere in your code to start the role creation process.
    
