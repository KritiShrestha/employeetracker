//Imports inquirer, queries and connection
const inquirer = require('inquirer');
const Queries = require("./lib/queries");
const { connection } = require("./db/connection");
const queries = new Queries(connection);

//List of questions for the user option
const questions = [
  {
    type: 'list',
    message: 'What would you like to do?',
    name: 'action',
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "View employees by manager",
      "View employees by department",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
      "Update employees manager",
      "Delete a department",
      "Delete a role",
      "Delete an employee",
      "View the total utilized budget of a department",
      "Exit",
    ],
    pageSize: 12
  }
]

// Prompt user to select an action, and shows result based on that
async function start() {
  const {action} = await inquirer.prompt(questions);

  // performs the task based on the user selection
  if (action === "View all departments") {
    console.table(await queries.viewAllDepartments());
  } else if (action === "View all roles") {
    console.table(await queries.viewAllRoles());
  } else if (action === "View all employees") {
    console.table(await queries.viewAllEmployees());
  } else if (action === "View employees by manager") {
    await viewEmployeesByManager();
  } else if (action === "View employees by department") {
    await viewEmployeesByDepartment();
  } else if (action === "Add a department") {
    await addDepartment();
  } else if (action === "Add a role") {
    await addRole();
  } else if (action === "Add an employee") {
    await addEmployee();
  } else if (action === "Update an employee role") {
    await updateEmployeeRole();
  } else if (action === "Update employees manager") {
    await updateEmployeeManager();
  }  else if (action === "Delete a department") {
    await deleteDepartment();
  } else if (action === "Delete a role") {
    await deleteRole();
  } else if (action === "Delete an employee") {
    await deleteEmployee();
  } else if (action === "View the total utilized budget of a department") {
    await viewDepartmentBudget();
  } else if (action === "Exit") {
    process.exit(0);
  }

  //repeats the prompt again
  start();
}

// Prompt user to add a department
async function addDepartment() {
  const {name} = await inquirer.prompt({
    type: "input",
    message: "What is the name of the department?",
    name: "name",
  });
  await queries.addDepartment(name);
  console.log(`Department ${name} has been added.`);
}

// Prompt user to add a role
async function addRole() {
  const departments = await queries.viewAllDepartments();
  const {title, salary, department_id } = await inquirer.prompt([{
      type: "input",
      message: "What is the title of the role?",
      name: "title",
    },
    {
      type: "input",
      message: "What is the salary of the role?",
      name: "salary",
    },
    {
      type: "list",
      message: "Which department does the role belong to?",
      name: "department_id",
      choices: departments.map((department) => ({
        name: department["Department Name"],
        value: department["Department ID"],
      })),
    },
  ]);
  await queries.addRole(title, salary, department_id);
  console.log(`Role ${title} has been added.`);
}

// Prompt user to add an employee
async function addEmployee() {
  const roles = await queries.viewAllRoles();
  const managers = await queries.viewAllManagers();
  // Adds "None" to the managers list as an option
  managers.unshift({ "Employee ID": null, "First Name": "None", "Last Name": "" });

  const {first_name, last_name, role_id, manager_id} = await inquirer.prompt([{
      type: "input",
      message: "What is the employee's first name?",
      name: "first_name",
    },
    {
      type: "input",
      message: "What is the employee's last name?",
      name: "last_name",
    },
    {
      type: "list",
      message: "What is the employee's role?",
      name: "role_id",
      choices: roles.map((role) => ({
        name: role["Job Title"],
        value: role["Role ID"],
      })),
    },
    {
      type: "list",
      message: "Who is the employee's manager?",
      name: "manager_id",
      choices: managers.map((manager) => ({
        name: `${manager["First Name"]} ${manager["Last Name"]}`,
        value: manager["Employee ID"],
      })),
    },
  ]);
  await queries.addEmployee(first_name, last_name, role_id, manager_id);
  console.log(`Employee ${first_name} ${last_name} has been added.`);
}

// Prompt user to update an employee's role
async function updateEmployeeRole() {
  const employees = await queries.viewAllEmployees();
  const roles = await queries.viewAllRoles();
  const {employee_id, role_id} = await inquirer.prompt([{
      type: "list",
      message: "Which employee would you like to update?",
      name: "employee_id",
      choices: employees.map((employee) => ({
        name: `${employee["First Name"]} ${employee["Last Name"]}`,
        value: employee["Employee ID"],
      })),
    },
    {
      type: "list",
      message: "What is the employee's new role?",
      name: "role_id",
      choices: roles.map((role) => ({
        name: role["Job Title"],
        value: role["Role ID"],
      })),
    },
  ]);
  await queries.updateEmployeeRole(employee_id, role_id);
  console.log(`Employee's role has been updated.`);
}

// Prompts user to update an employee's manager
async function updateEmployeeManager() {
  const employees = await queries.viewAllEmployees();
  const {employeeId} = await inquirer.prompt([{
    type: "list",
    message: "Which employee would you like to update?",
    name: "employeeId",
    choices: employees.map((employee) => ({
      name: `${employee["First Name"]} ${employee["Last Name"]}`,
      value: employee["Employee ID"],
    })),
  }, ]);
  const managers = await queries.viewAllManagers();
  managers.unshift({ "Employee ID": null, "First Name": "None", "Last Name": "" });

  const {managerId} = await inquirer.prompt([{
    type: "list",
    message: "Who is the employee's new manager?",
    name: "managerId",
    choices: managers.map((manager) => ({
      name: `${manager["First Name"]} ${manager["Last Name"]}`,
      value: manager["Employee ID"],
    })),
  }, ]);
  await queries.updateEmployeeManager(employeeId, managerId);
  console.log(`Employee ${employeeId} manager updated.`);
}

// Prompt user to view employee by manager
async function viewEmployeesByManager() {
  const managers = await queries.viewAllManagers();
  const {managerId} = await inquirer.prompt({
    type: "list",
    message: "Which manager's employees would you like to view?",
    name: "managerId",
    choices: managers.map((manager) => ({
      name: `${manager["First Name"]} ${manager["Last Name"]}`,
      value: manager["Employee ID"],
    })),
  });

  const employees = await queries.viewEmployeesByManager(managerId);
  console.table(employees);
}

// view employees by department
async function viewEmployeesByDepartment() {
  const departments = await queries.viewAllDepartments();
  const { departmentId } = await inquirer.prompt([
    {
      type: "list",
      message: "Which department would you like to view?",
      name: "departmentId",
      choices: departments.map((d) => ({
        name: d["Department Name"],
        value: d["Department ID"],
      })),
    },
  ]);
  console.table(await queries.viewEmployeesByDepartment(departmentId));
}

// deletes a department
async function deleteDepartment() {
  const departments = await queries.viewAllDepartments();
  const { departmentId } = await inquirer.prompt({
    type: "list",
    message: "Which department would you like to delete?",
    name: "departmentId",
    choices: departments.map((department) => ({
      name: department["Department Name"],
      value: department["Department ID"],
    })),
  });

  await queries.deleteDepartment(departmentId);
  console.log(`Department ${departmentId} has been deleted.`);
}

// deletes a role
async function deleteRole() {
  const roles = await queries.viewAllRoles();
  const { roleId } = await inquirer.prompt({
    type: "list",
    message: "Which role would you like to delete?",
    name: "roleId",
    choices: roles.map((role) => ({
      name: role["Job Title"],
      value: role["Role ID"],
    })),
  });

  await queries.deleteRole(roleId);
  console.log(`Role ${roleId} has been deleted.`);
}

// deletes an employee
async function deleteEmployee() {
  const employees = await queries.viewAllEmployees();
  const { employeeId } = await inquirer.prompt({
    type: "list",
    message: "Which employee would you like to delete?",
    name: "employeeId",
    choices: employees.map((employee) => ({
      name: `${employee["First Name"]} ${employee["Last Name"]}`,
      value: employee["Employee ID"],
    })),
  });

  await queries.deleteEmployee(employeeId);
  console.log(`Employee ${employeeId} has been deleted.`);
}

// shows department budget
async function viewDepartmentBudget() {
  const departments = await queries.viewAllDepartments();
  const { departmentId } = await inquirer.prompt({
    type: "list",
    message: "Select a department to view its total utilized budget:",
    name: "departmentId",
    choices: departments.map((department) => ({
      name: department["Department Name"],
      value: department["Department ID"],
    })),
  });
  const [result] = await queries.viewDepartmentBudget(departmentId);
  console.log(
    `The total budget for ${result["Department Name"]} department is $${result["Total Utilized Budget"]}`
  );
}

start();




