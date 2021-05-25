const inquirer = require('./node_modules/inquirer/lib/inquirer')
const employeeArray = [{
    firstName: 'Kellie',
    lastName: 'Ryan',
    department: 'Sales',
    role: 'Salesperson',
    manager: 'Alice Smith'
},
{
    firstName: 'Alice',
    lastName: 'Smith',
    department: 'Sales',
    role: 'Sales Manager',
    manager: 'None'
},
{
    firstName: 'John',
    lastName: 'Doe',
    department: 'Engineering',
    role: 'Lead Engineer',
    manager: 'None'
},
{
    firstName: 'Tom',
    lastName: 'Allen',
    department: 'Engineer',
    role: 'Software Engineer',
    manager: 'John Doe'
}
];

const questions = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'employee',
                choices: ['View Employees', 'Add Employees', 'Update Employees']
            },
        ])

        .then((response) => {
            switch (response.employee) {
                case 'View Employees':
                    viewEmployees()
                    break;
            }
            switch (response.employee) {
                case 'Add Employees':
                    addEmployeePrompt()
                    break;
            }
            switch (response.employee) {
                case 'Update Employees':
                    updateEmployeePrompt()
                    break;
            }
        });
}

function viewEmployees() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to view?',
                name: 'viewEmployees',
                choices: ['None', 'All Employees', 'Employees by Department', 'Employees by Manager']
            }
        ])
        .then((response) => {
            if (response.viewEmployees === 'All Employees') {
                return console.log(employeeArray)
            }
            else if (response.viewEmployees === 'Employees by Department') {
                return console.log(`Employees by department!`)
            }
            else if (response.viewEmployees === 'Employees by Manager') {
                return console.log(`Employees by manager!`)
            } else if (response.viewEmployees === 'None') {
                return console.log(`You have finshed!`)
            }
        })
}

function addEmployeePrompt() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: `What is the Employee's first name?`,
                name: 'firstName'
            },
            {
                type: 'input',
                message: `What is the Employee's Last Name?`,
                name: 'lastName'
            },
            {
                type: 'input',
                message: `What is the Employee's role?`,
                name: 'role'
            },
            {
                type: 'list',
                message: `What Department does the Employee work in?`,
                name: 'department',
                choices: ['Sales', 'Engineering']
            },
            {
                type: 'list',
                message: `Who is the Employee's Manager?`,
                name: 'manager',
                choices: ['None', 'Alice Smith', 'John Doe']
            },
        ])
        .then((employeeDetails) => {
            let {
                firstName,
                lastName,
                role,
                manager,
                department
            } = employeeDetails;
            const newEmployee = { firstName, lastName, department, role, manager }
            employeeArray.push(newEmployee)
            console.log(employeeArray)
        })
}

function updateEmployeePrompt() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: `What would you like to Update?`,
                name: 'updateEmployee',
                choices: ['None', 'Role', 'Manager']
            },
        ])
        .then((response) => {
            if (response.updateEmployee === 'Role') {
                return console.log(`updating the Employee's Role!`)
            }
            else if (response.updateEmployee === 'Manager') {
                return console.log(`updating the Employee's Manager!`)
            }
            else if (response.updateEmployee === 'None') {
                return console.log(`You have finished!`)
            }
        })
}

questions()