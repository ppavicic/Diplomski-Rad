const express = require('express');
const router = express.Router();
const db = require('../db')
const jwt = require('jsonwebtoken')

router.post("/loginTeacher", async (req, res) => {
    const sql = `SELECT * FROM teacher WHERE username = '` + req.body.session.username + `'`;
    const result = await db.query(sql, []);

    const user = result.rows[0];

    if (!user) {
        return res.status(404).send({
            message: 'Neispravni podaci'
        })
    }

    if (req.body.session.password != user.password) {
        return res.status(400).send({
            message: 'Neispravni podaci'
        })
    }

    const token = jwt.sign({ id: user.idteacher }, process.env.JWT_SECRET_KEY)

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    const userToSend = {
        idteacher: user.idteacher,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username
    };
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(201).send({
        message: 'Success',
        user: userToSend
    })
});

router.post('/logoutTeacher', (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 })

    res.status(201).send({
        message: 'Success'
    })
})

router.get('/loginStudent/getSchools', async (req, res) => {
    sql = `SELECT * FROM school`;
    const result = await db.query(sql, []);
    const rows = result.rows

    if (rows) {
        res.json({
            schools: rows
        })
    } else {
        res.json({
            err: "Greška pri dohvatu škola"
        })
    }
})

router.post('/loginStudent/getGrades', async function (req, res) {
    const rows = await getGradesBySchoolId(req.body.idschool)

    if (rows) {
        res.json({
            grades: rows
        })
    } else {
        res.json({
            err: "Greška pri dohvatu razreda"
        })
    }
})

router.post('/loginStudent/getStudents', async function (req, res) {
    rows = await getStudentsByGradeId(req.body.idgrade)

    if (rows) {
        res.json({
            students: rows
        })
    } else {
        res.json({
            err: "Greška pri dohvatu studenata"
        })
    }
})

getGradesBySchoolId = async function (idschool) {
    const sql = `SELECT * FROM grade WHERE idschool = ` + idschool;
    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

getStudentsByGradeId = async function (idgrade) {
    const sql = `SELECT * FROM student WHERE idgrade = ` + idgrade;

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

module.exports = router;
