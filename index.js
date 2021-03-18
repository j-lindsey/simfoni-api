const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const PORT = 3000;



app.use(cors());
app.use('/', require('./routes'));


/*landingpage route*/
app.get('/', (req, res) => {
    res.json('this is working');
});


app.listen(process.env.PORT || PORT, () => {
    console.log(`app is running on port ${process.env.PORT}`);
});




