//Imports inquirer and mysql
const inquirer = require('inquirer');
const mysql = require("mysql2");
const questions = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'Choice',
        choices: ['View all department', 'View all role', 'View all employee', 'Add role', 'Add employee', 'Add department', 'Update an employee role']
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
    });
  } else if (data.Choice === 'View all role') {
    db.query('SELECT * FROM role', function (err, results) {
      if (err) throw err;
      console.table(results);
    });
  } else if (data.Choice === 'View all employee') {
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
        message: 'What is the salary for this role?',
        name:'Salary'
      },

      {
        type: 'input',
      message: 'Which department does the role belong to ?',
      name: 'departmentChoice',
      choice: ["Enginnering", "Finance", "Legal", "Sales"]
      
      }
      ]
    ).then((answer) =>{
      db.query('INSERT INTO role (title, salary, department_id) VALUES (? ? ?)'), [answer.roleName, answer.Salary, answer.departmentChoice], function (err, results) {
        if (err) throw err;
        console.log (`Added '${answer.roleName}' to the database`);
      }
    }
    ) 
   }
   else if (data.name === 'Add an employee') {
    inquirer.prompt ([
      {
        type: 'input',
        message: "What is the employee's first name?",
        name: "employeeFirstname"
      },
      {
        type: 'input',
        message: "What is the employee's last name?",
        name: "employeeLastname"
      },
      {
        type: 'input',
        message: " What is the role of employee?",
        name: "employeeRole",
       choice:['Sales lead', 'Sales Person', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer']
      },
      {
        type: 'input',
        message: " Who is the employee of this manager?",
        name: "employeeManager",
        choice: ["None", "Ashley Smith", "Jane Johnson", "Sarah Brown", "Harry Badgley", "Rock Johnson", "Sam Payne", "Linda Burt", "Tom Lowel"]
      
      }
    ]

    ).then((anwser) => {
      db.query('INSERT INTO employee(first_name, last_name,role_id, manager_id) VALUES (? ? ? ?)'), [answer.employeeFirstname, answer.employeeLastname, answer.employeeRole, answer.employeeManager], function (err, results){
        if (err) throw err;
        console.log(`Added "${employeeFirstname + employeeLastname} added to the role`)
      }
    }
      )
   }
   else if (data.choice = "Update an employee role"){
    inquirer.prompt(
      [
        {
          type: 'input',
          message: "Which employee's role do you want to update?",
          name: updateEmployee
        },
        {
          type: 'input',
          message: "Which  role do you want to assign to this employee?",
          choice: ['Sales lead', 'Sales Person', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer'],
          name: employeeNewRole
        }
      ]
    ).then((answer) => {
      db.query('UPDATE role SET role_id =? WHERE CONCAT (first_name, " ", last_name)=? ') [answer.updateEmployee, answer.employeeNewRole]
    
    })
   }
 });




