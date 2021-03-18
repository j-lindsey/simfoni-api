const router = require('express').Router();

router.post('/', function (req, res) {
    const { email, name, password } = req.body;
    database.users.push({
        id: '3',
        name: name,
        email: email,
        password: password,
        joined: new Date()
    })
    res.json('register success');
    console.log(database);
})
/*database placeholder*/
const database ={
    users:[]
};
module.exports = router;