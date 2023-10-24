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
            newDepartment();
        } else if (answer.start === 'Add Role') {
            addJob();
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
    connection.query('SELECT * FROM department', 
    function (err, res) {
        if (err) {
            console.log(err);
            console.table(res)
            start();
        }
        
        const list = res.map(({ id, name }) => ({ name, value: id }));
        console.table(list);
        start();
    });
};

const addJob = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) {
            console.log(err);
            return;
        }

        const departmentChoices = res.map(({ id, title }) => ({ name: title, value: id }));

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
            connection.query(`INSERT INTO role(title, salary, department_id) VALUES('${answers.job_name}', '${answers.salary}', '${answers.department}')`, 
            (err, res) => { 
                if (err) {
                    console.log(err);
                } else {
                    console.log(res);
                }
                start();
            });
        });
    });
};

const viewRoles = () => {
    connection.query(`SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id`, 
    function (err, res){
        console.table(res);
        start();
    });
};
 
const addEmployee = () => {
    connection.query('SELECT * FROM role', (err, roleResults) => {
        if (err) {
            console.log(err);
            return;
        }

        const roleChoices = roleResults.map(({ id, title }) => ({ name: title, value: id }));

        connection.query('SELECT * FROM employee', (err, employeeResults) => {
            if (err) {
                console.log(err);
                return;
            }

            // const managerChoices = employeeResults.map(({ id, first_name, last_name }) => ({
            //     name: `${first_name} ${last_name}`,
            //     value: id
            // }));

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'What is the first name of the new employee?'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'What is the last name of the new employee?'
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the role of the new employee?',
                    choices: roleChoices
                }
                // {
                //     type: 'list',
                //     name: 'manager',
                //     message: 'Who is the manager of the new employee?',
                //     choices: managerChoices
                // }
            ])
            .then((answers) => {
                connection.query(
                    'INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)', //manager_id after role id
                    [answers.first_name, answers.last_name, answers.role /*answers.manager*/],
                    (err, res) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(res);
                        }
                        start();
                    }
                );
            });
        });
    });
};


const viewEmployees = () => {
    connection.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, 
        department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee 
        LEFT JOIN role ON employee.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id 
        LEFT JOIN employee manager ON manager.id = employee.manager_id`, 
        function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.table(res);
                start();
            }
        }
    );
};

const updateEmployeeRole = () => {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) {
            console.log(err);
            return;
        }

        const roleChoices = res.map(({ id, title }) => ({ name: title, value: id }));

        connection.query('SELECT * FROM employee', (err, employeeResults) => {
            if (err) {
                console.log(err);
                return;
            }

            const employeeChoices = employeeResults.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Which employee would you like to update?',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the new role of the employee?',
                    choices: roleChoices
                }
            ])
            .then((answers) => {
                connection.query(
                    `UPDATE employee SET role_id = ? WHERE id = ?`,
                    [answers.role, answers.employee],
                    (err, res) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(res);
                        }
                        start();
                    }
                );
            });
        });
    });
};
