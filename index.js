const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const PORT = 3000;



app.use(cors());
app.use('/', require('./routes'));

app.use(express.static(path.join(path.resolve(__dirname, '../'))));

/*landingpage route*/
app.get('/', (req, res) => {
    res.sendFile('this is working');
})


app.listen(process.env.PORT || PORT, () => {
    console.log(`app is running on port ${PORT}`);
});




