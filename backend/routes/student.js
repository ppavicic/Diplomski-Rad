const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db')

router.post('/save', async function (req, res) {
    try {
        const cookie = req.cookies['jwt']
        const claims = jwt.verify(cookie, process.env.JWT_SECRET_KEY);

        if (!claims) {
            return res.status(401).send({
                message: 'Unauthenticated - Cookie invalid'
            })
        }

        const sql = `INSERT INTO student (firstname, lastname, idgrade)
        VALUES ('` + req.body.firstname + `', '` + req.body.lastname + `', ` + req.body.idgrade + `)`;
        const result = await db.query(sql, []);

        if (result) {
            res.json({
                success: true
            })
        } else {
            res.json({
                success: false
            })
        }
    } catch (err) {
        throw err
    }
})

router.post('/getStudent', async function (req, res) {
    try {
        rows = await getStudentById(req.body.idstudent);

        if (rows) {
            res.json({
                student: rows
            })
        } else {
            res.json({
                err: 'Greška pri dohvatu studenta'
            })
        }
    } catch (err) {
        throw err
    }
})

getStudentById = async function (idstudent) {
    const sql = `SELECT * FROM student WHERE idstudent = ` + idstudent;
    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

module.exports = router;