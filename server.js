const inquirer = require('inquirer')


const questions = [
    {
        type: 'list',
        message: 'What would you like to do?',
         name: 'Choice',
        choices: ['View all department', 'View all roles', 'View all employees', 'Add role', 'Add employee', 'Add department', 'Update an employee role']
    }
]
inquirer.prompt(questions).then ((data) =>{
console.info (data.name)
}
)