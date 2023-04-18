//Imports inquirer and mysql
const inquirer = require('inquirer');
const { default: Choice } = require('inquirer/lib/objects/choice');
const mysql = require("mysql");
const questions = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'Choice',
        choices: ['View all department', 'View all roles', 'View all employees', 'Add role', 'Add employee', 'Add department', 'Update an employee role']
    }
]
       
inquirer.prompt(questions).then((data) => {
  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'MyCompany_db'
  });

  if (data.Choice === 'View all department') {
    db.query('SELECT * FROM department', function (err, results) {
      if (err) throw err;
      console.table(results);
      db.end();
    });
  } else if (data.Choice === 'View all roles') {
    db.query('SELECT * FROM role', function (err, results) {
      if (err) throw err;
      console.table(results);
    });
  } else if (data.Choice === 'View all employees') {
    db.query('SELECT * FROM employee', function (err, results) {
      if (err) throw err;
      console.table(results);
    });
   }
   else if (data.Choice === 'Add a department') {
    inquirer.prompt(
      [{
        type: 'input',
        message: 'What is the name of the department?',
        name: 'departmentName'
      }
    
      ]
    ).then((answer) =>{
      db.query('INSERT INTO department (name) VALUES (?)'), [answer.departmentName], function (err, results) {
        if (err) throw err;
        console.log ('Departement added succesfully');
      }
    }
    ) 
   }
   else if (data.Choice === 'Add role') {
    inquirer.prompt(
      [{
        type: 'input',
        message: 'What is the name of the role?',
        name: 'roleName'
      },

      {
        type: 'input',
        message: 'What is thesalary of the role?',
        name:'Salary'
      },

      {
        type: 'input',
      message: 'Which department does the role belong to ?',
      name: 'departmentChoice'
      }
      ]
    ).then((answer) =>{
      db.query('INSERT INTO role (title, salary, department_id, ) VALUES (? ? ?)'), [answer.roleName, answer.Salary, answer.departmentChoice], function (err, results) {
        if (err) throw err;
        console.log (`Added '${answer.roleName}' to the database`);
      }
    }
    ) 
   }
 });



// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database