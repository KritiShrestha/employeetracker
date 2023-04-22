-- Active: 1682197128770@@127.0.0.1@3306@library_db
-- //Populating tables with VALUES
INSERT INTO department (name)
VALUES ("Engineering"),
        ("Finance"),
        ("Legal"),
        ("Sales");

Insert INTO role (title, salary, department_id)
VALUES ("Saleslead", 1000.00,1  ),
        ("Salesperson", 800.00, 1),
        ("Lead Engineer", 1500.00, 2),
        ("Software Engineer", 1200.00, 3),
        ("Account Manager", 160.00, 4),
         ("Accountant", 1250.00, 4),
         ("Legal Team lead", 2500.00, 3),
         ("Lawyer", 1900.00, 2);

Insert INTO employee(first_name, last_name,role_id, manager_id )
VALUES ("Ashley", "Smith", 1, NULL),
        ("Jane", "Jonson", 7, NULL),
        ("Sarah", "Brown", 6, 1),
        ("Harry", "Badgley", 5, 3),
        ("Rock", "Johnson", 3, 1),
        ("Sam", "Payne", 2, NULL),
        ("Linda", "Burt", 4, 3),
        ("Tom", "lowel", 5, NULL);

