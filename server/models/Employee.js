const mongoose = require('mongoose');
const EmployeeSchema = new mongoose.Schema({
    employee_id: { type: String, unique: true },
    full_name: String,
    email: String,
    hashed_password: String,
});

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;