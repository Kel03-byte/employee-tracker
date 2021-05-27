require('dotenv').config();
const inquirer = require('./node_modules/inquirer/lib/inquirer');
const mysql = require('mysql2/promise');
const cTable = require('console.table');

// Establishes a connection to the database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'employee_db'
});

// The beginging questions that estabish what the user wants to do
const questions = (connection) => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'mainResponse',
                choices: ['View', 'Add', 'Update', 'Delete', 'Quit']
            },
        ])
        .then((response) => {
            switch (response.mainResponse) {
                case 'View':
                    viewDatabasesPrompt(connection)
                    break;
            }
            switch (response.mainResponse) {
                case 'Add':
                    addToDatabasesPrompt(connection)
                    break;
            }
            switch (response.mainResponse) {
                case 'Update':
                    updateDatabasesPrompt(connection)
                    break;
            }
            switch (response.mainResponse) {
                case 'Delete':
                    deleteFromDatabasesPrompt(connection)
                    break;
            }
            switch (response.mainResponse) {
                case 'Quit':
                    connection.end()
                    break;
            }
        });
};

// Function to view the databases (Employee, Role and Department)
function viewDatabasesPrompt(connection) {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to view?',
                name: 'databases',
                choices: ['Employee', 'Departments', 'Roles', 'Go Back']
            }
        ])
        .then((response) => {
            if (response.databases === 'Employee')
                connection.query(`SELECT e.id, e.first_name, e.last_name, roles.title, department_name AS department, roles.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN roles ON e.role_id = roles.id INNER JOIN department ON roles.department_id = department.id order by e.id asc`).then((response) => {
                    console.log('\n')
                    console.table(response[0]);
                    viewDatabasesPrompt(connection);
                }).catch(error => {
                    console.error("Opps not able to read the Employee database", error.message);
                    viewDatabasesPrompt(connection);
                });
            if (response.databases === 'Departments')
                connection.query(`SELECT * FROM department`).then((response) => {
                    console.log('\n')
                    console.table(response[0]);
                    viewDatabasesPrompt(connection);
                }).catch(error => {
                    console.error("Opps not able to read the Department database", error.message);
                    viewDatabasesPrompt(connection);
                });
            if (response.databases === 'Roles')
                connection.query(`SELECT * FROM roles`).then((response) => {
                    console.log('\n')
                    console.table(response[0]);
                    viewDatabasesPrompt(connection);
                }).catch(error => {
                    console.error("Opps not able to read the Roles database", error.message);
                    viewDatabasesPrompt(connection);
                });
            if (response.databases === 'Go Back') {
                questions(connection);
            };
        });
};

// Function to start adding a new Employee, Role or Department
function addToDatabasesPrompt(connection) {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to add?',
                name: 'adding',
                choices: ['A New Employee', 'A New Department', 'A New Role', 'Go Back']
            }])
        .then((response) => {
            switch (response.adding) {
                case 'A New Employee':
                    addEmployeePrompt(connection)
                    break;
            }
            switch (response.adding) {
                case 'A New Department':
                    addNewDepartmentPrompt(connection)
                    break;
            }
            switch (response.adding) {
                case 'A New Role':
                    addNewRolePrompt(connection)
                    break;
            }
            switch (response.adding) {
                case 'Go Back':
                    questions(connection)
                    break;
            }
        })
};

// Function to add a new Employee
function addEmployeePrompt(connection) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: `What is the new Employee's first name?`,
                name: 'firstName'
            },
            {
                type: 'input',
                message: `What is the new Employee's Last Name?`,
                name: 'lastName'
            },
            {
                type: 'input',
                message: `What is the new Employee's Role Id?\n(You may need to add the Role to the database before adding a new Employee if it's not in the database!)`,
                name: 'roleId'
            },
            {
                type: 'input',
                message: `What is the new Employee's Manager Id?\n(this is the Employee Id of their Manager, if they are the Manager then enter null)`,
                name: 'managerId',
            }
        ])
        .then((employeeDetails) => {
            let {
                firstName,
                lastName,
                roleId,
                managerId,
            } = employeeDetails;
            connection.query('insert into employee set ?', {
                first_name: firstName,
                last_name: lastName,
                role_id: roleId,
                manager_id: managerId
            }).then(() => {
                console.log(`${firstName} was added to the employee database!\n`)
                addToDatabasesPrompt(connection);
            }).catch(error => {
                console.error("Wasn't able to add a new employee!", error.message)
                addEmployeePrompt(connection);
            })
        })
};

// Function to add a new Role
function addNewRolePrompt(connection) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: `What is the Title of the new Role?`,
                name: 'title'
            },
            {
                type: 'input',
                message: `What is the Salary of the new Role?`,
                name: 'salary'
            },
            {
                type: 'input',
                message: `What is the Role's Department Id?\n(You may need to add the Department to the database before adding a new Role if it's not in the database!)`,
                name: 'departmentId',
            }
        ])
        .then((roleDetails) => {
            let {
                title,
                salary,
                departmentId,
            } = roleDetails;
            connection.query('insert into roles set ?', {
                title: title,
                salary: salary,
                department_id: departmentId,
            }).then(() => {
                console.log(`${title} was added to the role database!\n`)
                addToDatabasesPrompt(connection);
            }).catch(error => {
                console.error("Wasn't able to add a new role!", error.message)
                addNewRolePrompt(connection);
            })
        });
};

// function to add a new Department
function addNewDepartmentPrompt(connection) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: `What is the Name of the new Department?`,
                name: 'departmentName'
            }
        ])
        .then((departmentDetails) => {
            let departmentName = departmentDetails.departmentName
            connection.query('insert into department set ?', {
                department_name: departmentName,
            }).then(() => {
                console.log(`${departmentName} was added to the department database!\n`)
                addToDatabasesPrompt(connection);
            }).catch(error => {
                console.error("Wasn't able to add a new department!", error.message)
                addNewDepartmentPrompt(connection);
            })
        });
};

// Function to start updating an Employee's Role or Manager
function updateDatabasesPrompt(connection) {
    inquirer
        .prompt([
            {
                type: 'list',
                message: `What part of the Employee deatails would you like to Update?`,
                name: 'updating',
                choices: ['First Name', 'Last Name', 'Role', 'Manager', 'Go Back']
            }
        ])
        .then((response) => {
            switch (response.updating) {
                case 'Role':
                    updateEmployeeRole(connection)
                    break;
            }
            switch (response.updating) {
                case 'First Name':
                    updateEmployeeFirstName(connection)
                    break;
            }
            switch (response.updating) {
                case 'Last Name':
                    updateEmployeeLastName(connection)
                    break;
            }
            switch (response.updating) {
                case 'Manager':
                    updateEmployeeManager(connection)
                    break;
            }
            switch (response.updating) {
                case 'Go Back':
                    questions(connection)
                    break;
            }
        });
};

// Function to update Employee's First Name
function updateEmployeeFirstName(connection) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: `What is the Id of the Employee you would like to update?`,
                name: 'employeeId'
            },
            {
                type: 'input',
                message: `What is the First Name you would like to update the Employee to?`,
                name: 'firstName'
            },
        ])
        .then((employeeDetails) => {
            let { firstName, employeeId } = employeeDetails
            connection.query('update employee set ? where ?',
                [{ first_name: firstName }, { id: employeeId }]).then(() => {
                    console.log(`The Employee's first name has been updated!\n`)
                    updateDatabasesPrompt(connection);
                }).catch(error => {
                    console.error("Wasn't able to update the database!", error.message)
                    updateEmployeeFirstName(connection);
                })
        });
};

function updateEmployeeLastName(connection) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: `What is the Id of the Employee you would like to update?`,
                name: 'employeeId'
            },
            {
                type: 'input',
                message: `What is the Last Name you would like to update the Employee to?`,
                name: 'lastName'
            }
        ])
        .then((employeeDetails) => {
            let { lastName, employeeId } = employeeDetails
            connection.query('update employee set ? where ?',
                [{ last_name: lastName }, { id: employeeId }]).then(() => {
                    console.log(`The Employee's last name has been updated!\n`)
                    updateDatabasesPrompt(connection);
                }).catch(error => {
                    console.error("Wasn't able to update the database!", error.message)
                    updateEmployeeLastName(connection);
                })
        });
};

// Function to update an Employee's Role
function updateEmployeeRole(connection) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: `What is the ID of the EMPLOYEE you would like to update?`,
                name: 'employeeId'
            },
            {
                type: 'input',
                message: `What is the ID of the ROLE you would like to update the EMPLOYEE to?`,
                name: 'roleId'
            }
        ])
        .then((roleDetails) => {
            let { roleId, employeeId } = roleDetails
            connection.query('update employee set ? where ?',
                [{ role_id: roleId }, { id: employeeId }]).then(() => {
                    console.log(`The Employee's Role has been updated!\n`)
                    updateDatabasesPrompt(connection);
                }).catch(error => {
                    console.error("Wasn't able to update the database!", error.message)
                    updateEmployeeRole(connection);
                })
        });
};

// Function to update Employee's Manager
function updateEmployeeManager(connection) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: `What is the ID of the EMPLOYEE you would like to update?`,
                name: 'employeeId'
            },
            {
                type: 'input',
                message: `What is the ID of the MANAGER you would like to update the EMPLOYEE to?\n(You can put null if they are the Manager)`,
                name: 'managerId'
            }
        ])
        .then((managerDetails) => {
            let { managerId, employeeId } = managerDetails
            connection.query('update employee set ? where ?',
                [{ manager_id: managerId }, { id: employeeId }]).then(() => {
                    console.log(`The Employee's Manager has been updated!\n`)
                    updateDatabasesPrompt(connection)
                }).catch(error => {
                    console.error("Wasn't able to update the database!", error.message)
                    updateEmployeeManager(connection)
                })
        });
};

// Function to start deleting an Employee, Role or Department
function deleteFromDatabasesPrompt(connection) {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to delete?\n(Note: If deleting a Department, then delete any linked Roles beforehand!)',
                name: 'deleting',
                choices: ['An Employee', 'A Department', 'A Role', 'Go Back']
            }])
        .then((response) => {
            switch (response.deleting) {
                case 'An Employee':
                    deleteEmployeePrompt(connection)
                    break;
            }
            switch (response.deleting) {
                case 'A Department':
                    deleteDepartmentPrompt(connection)
                    break;
            }
            switch (response.deleting) {
                case 'A Role':
                    deleteRolePrompt(connection)
                    break;
            }
            switch (response.deleting) {
                case 'Go Back':
                    questions(connection)
                    break;
            }
        });
};

// Function to delete an Employee
function deleteEmployeePrompt(connection) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the ID of the EMPLOYEE you wish to delete?',
                name: 'deleteEmployee',
            }])
        .then((deleteDetails) => {
            const deletedEmployee = deleteDetails.deleteEmployee
            connection.query('delete from employee where ?',
                { id: deletedEmployee, }).then(() => {
                    console.log(`The Employee file has been deleted!\n`);
                    deleteFromDatabasesPrompt(connection);
                }).catch(error => {
                    console.error("Wasn't able to delete the Employee!", error.message);
                    deleteEmployeePrompt(connection);
                })
        });
};

// Function to delete a Role
function deleteRolePrompt(connection) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the TITLE of the ROLE would you like to delete?\n(This needs to be spelt the same as in the database)',
                name: 'deleteRole',
            }])
        .then((deleteDetails) => {
            const deletedRole = deleteDetails.deleteRole
            connection.query('delete from roles where ?',
                { title: deletedRole, }).then(() => {
                    console.log(`The Role was deleted!\n`);
                    deleteFromDatabasesPrompt(connection);
                }).catch(error => {
                    console.error("Wasn't able to delete the Role!", error.message);
                    deleteRolePrompt(connection);
                })
        })
};

// Function to delete a Department
function deleteDepartmentPrompt(connection) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the ID of the DEPARTMENT you wish to delete?',
                name: 'deleteDepartment',
            }])
        .then((deleteDetails) => {
            const deletedDepartment = deleteDetails.deleteDepartment
            console.log(deletedDepartment)
            connection.query(`delete from department where id=${deletedDepartment}`,).then(() => {
                    console.log(`The Department was deleted!\n`);
                    deleteFromDatabasesPrompt(connection);
                }).catch(error => {
                    console.error("Wasn't able to delete the Department!", error.message);
                    deleteDepartmentPrompt(connection);
                })
        });
};

connection.then((con) => {
    console.log('--- Welcome To The Employee Tracker ---\n');
    questions(con);
}).catch(error => {
    console.log(error.message);
});