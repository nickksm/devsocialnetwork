const express = require('express');

const app = express();

app.get('/', (req,res) => res.send('API Running OK'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))