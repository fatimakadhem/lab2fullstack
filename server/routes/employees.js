const router = require('express').Router();
const Employee = require('../models/Employee');

router.post('/', async (req, res) => {
    try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
} catch (err) {
    res.status(400).json({ error: err.message });
}
});

module.exports = router;
