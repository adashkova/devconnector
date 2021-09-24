const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();

var corsOptions = {
  origin: 'http://localhost:5001',
};

app.use(cors(corsOptions))
/// Connect db

connectDB();

//Init Middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('API Running'));
// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`); 
});
//0e44a75ead7aa66c4fd4