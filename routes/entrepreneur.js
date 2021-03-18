const router = require('express').Router();
const database = require('./test-database');
//const multer = require('multer');




router.get('/3', (req, res) => {

    let entrepreneur = database.users.find(user => {
        return user.id === 3
    });
    let activeCont = database.containers.filter(cont => {
        return cont.status === 'active'
    });
    console.log(entrepreneur);
    let ent = {
        id: entrepreneur.id,
        name: entrepreneur.name,
        content: activeCont
    };
    console.log(ent);
    res.json(ent);
});

router.post('/type2submit', (req, res) => {
    console.log(req.body);
    database.containers.forEach(cont => {
        if (cont.contid === Number(req.body.contid)) {
            cont.status = 'complete';
            cont.question = req.body.question;
            cont.answer = req.body.answer;
        }
    })
    res.json('received answers');
})

router.post('/type2submitFile', (req, res) => {
    console.log(req.file);
    console.log(req.body);
    let upload = multer({ storage: storage}).single('p');

    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        // Display uploaded image for user validation
        res.send(`You have uploaded the file `);
    });
});



router.post('/completeTask', (req, res) => {
    
    database.containers.forEach(cont => {
        if (cont.contid === Number(req.body.id)) {
            cont.status = 'complete';
            console.log(cont);
        }
    });
    res.json('completed task');
})


module.exports = router;