DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

create TABLE department (
    id INT PRIMARY KEY auto_increment,
    name VARCHAR(30) not null
);

create TABLE role (
    id INT PRIMARY KEY auto_increment,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
    ON DELETE CASCADE
);

create TABLE employee (
    id INT PRIMARY KEY auto_increment,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
    ON DELETE CASCADE
);

-- Path: db/seeds.sql