const router = require('express').Router();
const sql = require('mssql');
const database = require('./test-database');

/*database configuration*/
const dbConfig = {
    server: 'localhost\\SQLEXPRESS',
    database: 'test1',
    user: 'simfoni',
    password: 'simfoni',
    options: {
        "encrypt": true,
        "enableArithAbort": true
    }
};

router.get('/ent', (req, res) => {
    //db connection
    /*
        sql.connect(dbConfig, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
        request.query('select * from dbo.ImageTable where Id=1', 
        function (err, recordset) {
            if (err) console.log(err)
            // send records as a response
            console.log(recordset);
            res.json(recordset);
        });
    });
    */   
    res.json(database.users);
});

/*request next container id number*/
router.get('/queueid', (req, res) => {
    let nextid = Number(database.containers[database.containers.length - 1].contid) + 1;
    res.json(nextid);
});

/*add container to database*/
router.post('/addContainer', (req, res) => {
    database.containers.push(req.body);
    console.log(database.containers);
    res.json('container added');
});
/*change status to active for all current Page containers*/
router.post('/statusCurrentPage', (req, res) => {

    for (let i = 0; i < req.body.length; i++) {
        database.containers.forEach(cont => {
            if (cont.contid === Number(req.body[i])) {
                cont.status = 'active';
            }
        })
    }
    let containers = database.containers;
    res.json(containers);
});



/*test internal ent page*/
router.post('/:id', (req, res) => {
    database.containers.push(req.body);
    // console.log(database.containers);
});


module.exports = router;
