require('dotenv').config();
const projectRoutes = require('./routes/projects');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


//Middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Connect DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));
    
// Routes configuration 
app.use('/api/employees', require('./routes/employees'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/project_assignments', require('./routes/projectAssignments'));
app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api/message', async (req, res) => {
    console.log('Message endpoint hit');
    res.json({ message: 'Hello from the server!' });
});

/*app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });*/

// Redirect to index.html for unknown routes
app.use((req, res, next) => {
    res.sendFile('index.html', { root: './client/dist' }, (err) => {
      if (err) {
        next(err)
      }
    })
  })

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
