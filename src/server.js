const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();


const PORT = process.env.PORT || 8000;

app.use(cors())
app.use(express.json())

if (process.env.NODE_ENV != 'production'){
  require('dotenv').config()
} 

try {
  mongoose.connect(process.env.MONG0_DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('MongoDB connected')  
} catch (error) {
  console.log(error)
}


app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})