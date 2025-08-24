const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const Employee = require('./models/Employee');
const Project = require('./models/Project');
const ProjectAssignment = require('./models/ProjectAssignment');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
    addData(); // Call the function to add new data
}).catch(err => console.log(err));

// Function to add new data
async function addData() {
    try {
        // Clear existing data
        await Employee.deleteMany({});
        await Project.deleteMany({});
        await ProjectAssignment.deleteMany({});

        console.log('Existing data cleared.');

        // Add new employees
        const employees = [
            { employee_id: 'E006', full_name: 'Nora Nora', email: 'john@example.com' },
            { employee_id: 'E007', full_name: 'Nike Nike', email: 'jane@example.com' },
            { employee_id: 'E008', full_name: 'Puma Puma', email: 'john.doe@example.com' },
            { employee_id: 'E009', full_name: 'Sara Sara', email: 'sara@example.com' },
            { employee_id: 'E010', full_name: 'Tara Tara', email: 'tara@example.com' },
        ];

        // Hash passwords for each employee
        const hashedEmployees = await Promise.all(
            employees.map(async (employee) => {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(employee.full_name, salt); // Using full_name as the password
                return { ...employee, hashed_password: hashedPassword };
            })
        );

        // Insert employees with hashed passwords
        const newEmployees = await Employee.insertMany(hashedEmployees);
        console.log('New Employees with Hashed Passwords:', newEmployees);

        // Add new projects
        const newProjects = await Project.insertMany([
            { project_code: 'P105', project_name: 'TorBora', project_description: 'Security Security' },
            { project_code: 'P106', project_name: 'BigBen', project_description: 'Game Game' },
            { project_code: 'P107', project_name: 'HKR', project_description: 'Cloud Google' },
            { project_code: 'P108', project_name: 'Malmö', project_description: 'AI AI' },
            { project_code: 'P109', project_name: 'Lund', project_description: 'Web Web' },
        ]);

        console.log('New Projects:', newProjects);

        // Add new project assignments
        const newAssignments = await ProjectAssignment.insertMany([
            { employee_id: newEmployees[0]._id, project_code: newProjects[0]._id, start_date: new Date() },
            { employee_id: newEmployees[1]._id, project_code: newProjects[1]._id, start_date: new Date() },
            { employee_id: newEmployees[2]._id, project_code: newProjects[2]._id, start_date: new Date() },
            { employee_id: newEmployees[3]._id, project_code: newProjects[3]._id, start_date: new Date() },
            { employee_id: newEmployees[4]._id, project_code: newProjects[4]._id, start_date: new Date() },
        ]);

        console.log('New Project Assignments:', newAssignments);

        process.exit();
    } catch (err) {
        console.error('Error adding data:', err);
        process.exit(1);
    }
}