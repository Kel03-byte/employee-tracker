--- Create and Use the Database ---
create database employee_db;

use employee_db;

--- Create the Department Table ---
create table department (
id int not null auto_increment primary key,
department_name varchar(30) not null
);

--- Create the Role Table ---
create table roles (
    id int not null auto_increment primary key,
    title varchar(30),
    salary decimal,
    department_id int,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

--- Create the Employee Table ---
create table employee (
    id int not null auto_increment primary key,
    first_name varchar(30),
    last_name varchar(30),
    role_id int not null,
    manager_id int,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

--- Add a few Departments to the table Department ---
insert into department (department_name)
values ('Sales');

insert into department (department_name)
values ('Engineering');

insert into department (department_name)
values ('Finance');

insert into department (department_name)
values ('Legal');

--- Add a few Roles to the table Role ---
insert into roles (title, salary, department_id)
values ('Sales Lead', 100000, 1);

insert into roles (title, salary, department_id)
values ('Salesperson', 80000, 1);

insert into roles (title, salary, department_id)
values ('Lead Engineer', 150000, 2);

insert into roles (title, salary, department_id)
values ('Software Engineer', 120000, 2);

insert into roles (title, salary, department_id)
values ('Accountant', 125000, 3);

insert into roles (title, salary, department_id)
values ('Legal Team Lead', 250000, 4);

insert into roles (title, salary, department_id)
values ('Lawyer', 190000, 4);

--- Add a few Employees to the table Employees ---
insert into employee (first_name, last_name, role_id, manager_id)
values ('John', 'Doe', 1, null);

insert into employee (first_name, last_name, role_id, manager_id)
values ('Mike', 'Chan', 2, null);

insert into employee (first_name, last_name, role_id, manager_id)
values ('Ashley', 'Rodriguez', 3, null);

insert into employee (first_name, last_name, role_id, manager_id)
values ('Kevin', 'Tupik', 4, null);

insert into employee (first_name, last_name, role_id, manager_id)
values ('Malia', 'Brown', 5, null);

insert into employee (first_name, last_name, role_id, manager_id)
values ('Sarah', 'Lourd', 6, null);

insert into employee (first_name, last_name, role_id, manager_id)
values ('Tom', 'Allen', 7, null);

insert into employee (first_name, last_name, role_id, manager_id)
values ('Tammer', 'Galal', 4, null);

--- Updated a few Employee details with their Manager as the Manager's Employee details aren't available until their own Employee details are created ---
update employee set manager_id = 3 where id = 1;

update employee set manager_id = 3 where id = 4;

update employee set manager_id = 1 where id = 2;

update employee set manager_id = 6 where id = 7;

update employee set manager_id = 4 where id = 8;