const connection = require("../db/connection");

// Queries class has all the SQL quereies that needs to be performed 
class Queries {
  constructor() {
    this.connection = connection;
  }

  // View all departments
  async viewAllDepartments() {
    const [rows] = await this.connection.query(
      `SELECT id AS "Department ID", name AS "Department Name" FROM department ORDER BY id;`
    );
    return rows;
  }

  // View all roles
  async viewAllRoles() {
    const [rows] = await this.connection.query(
      `SELECT role.id AS "Role ID", role.title AS "Job Title", department.name AS "Department", role.salary AS "Salary"
        FROM role 
        JOIN department ON role.department_id = department.id
        ORDER BY role.id;`
    );
    return rows;
  }

  // View all employees
  async viewAllEmployees() {
    const [rows] = await this.connection.query(
      `SELECT employee.id AS "Employee ID", employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title AS "Job Title", department.name AS "Department", role.salary AS "Salary", CONCAT(manager.first_name, ' ', manager.last_name) AS "Manager"
        FROM employee 
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id
        ORDER BY employee.id;`
    );
    return rows;
  }

  // View all managers
  async viewAllManagers() {
    const [rows] = await this.connection.query(
      `SELECT DISTINCT m.id AS "Employee ID", m.first_name AS "First Name", m.last_name AS "Last Name"
      FROM employee e
      JOIN employee m ON e.manager_id = m.id
      ORDER BY m.id;`
    );
    return rows;
  }


  // Add a department
  async addDepartment(name) {
    const [result] = await this.connection.query(
      `INSERT INTO department (name) VALUES (?);`,
      [name]
    );
    return result;
  }

  // Add a role
  async addRole(title, salary, department_id) {
    const [result] = await this.connection.query(
      `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`,
      [title, salary, department_id]
    );
    return result;
  }

  // Add an employee
  async addEmployee(first_name, last_name, role_id, manager_id) {
    const [result] = await this.connection.query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`,
      [first_name, last_name, role_id, manager_id]
    );
    return result;
  }

  // Update an employee's role
  async updateEmployeeRole(employee_id, role_id) {
    const [result] = await this.connection.query(
      `UPDATE employee SET role_id = ? WHERE id = ?;`,
      [role_id, employee_id]
    );
    return result;
  }

  // Update an employee's manager
  async updateEmployeeManager(employeeId, managerId) {
    const [result] = await this.connection.query(
      `UPDATE employee SET manager_id = ? WHERE id = ?`,
      [managerId, employeeId]
    );
    return result;
  }

  // View employee by manager
  async viewEmployeesByManager(managerId) {
    const sql = `SELECT e.id AS "Employee ID", e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Job Title", d.name AS "Department", CONCAT(m.first_name, ' ', m.last_name) AS "Manager" 
                 FROM employee e 
                 INNER JOIN role r ON e.role_id = r.id 
                 INNER JOIN department d ON r.department_id = d.id 
                 INNER JOIN employee m ON e.manager_id = m.id 
                 WHERE e.manager_id = ?`;

    const [rows] = await this.connection.query(sql, [managerId]);
    return rows;
  }

  // View employee by department
  async viewEmployeesByDepartment(departmentId) {
    const sql = `
      SELECT 
        e.id AS "Employee ID",
        CONCAT(e.first_name, " ", e.last_name) AS "Employee Name",
        r.title AS "Job Title",
        d.name AS "Department",
        r.salary AS "Salary"
      FROM employee e
        JOIN role r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
      WHERE d.id = ?`;
    const [rows] = await this.connection.query(sql, [departmentId]);
    return rows;
  }

  // deletes a department
  async deleteDepartment(departmentId) {
    const [rows] = await this.connection.query(
      'DELETE FROM department WHERE id = ?',
      [departmentId]
    );
    console.log(`${rows.affectedRows} department deleted with id ${departmentId}.`);
  }

  // deletes a role
  async deleteRole(roleId) {
    const [rows] = await this.connection.query(
      'DELETE FROM role WHERE id = ?',
      [roleId]
    );
    console.log(`${rows.affectedRows} role deleted with id ${roleId}.`);
  }

  // deletes an employee
  async deleteEmployee(employeeId) {
    const [rows] = await this.connection.query(
      'DELETE FROM employee WHERE id = ?',
      [employeeId]
    );
    console.log(`${rows.affectedRows} employee deleted with id ${employeeId}.`);
  }

  // shows budget of a department
  async viewDepartmentBudget(departmentId) {
    const [result] = await this.connection.query(
      `SELECT department.name AS "Department Name", SUM(role.salary) AS "Total Utilized Budget"
       FROM employee
       JOIN role ON employee.role_id = role.id
       JOIN department ON role.department_id = department.id
       WHERE department.id = ?
       GROUP BY department.id`,
      [departmentId]
    );
    return result;
  }
}

//exports Queries class
module.exports = Queries;