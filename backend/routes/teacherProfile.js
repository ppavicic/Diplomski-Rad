const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db')

router.get('/user', async (req, res) => {
    try {
        const cookie = req.cookies['jwt']
        const claims = jwt.verify(cookie, process.env.JWT_SECRET_KEY);

        if (!claims) {
            return res.status(401).send({
                message: 'Unauthenticated - Cookie invalid'
            })
        }
        const sql = `SELECT idteacher, firstname, lastname, username FROM teacher WHERE idteacher = ` + claims.id;
        const result = await db.query(sql, []);
        const user = result.rows[0];

        res.send(user)
    } catch (err) {
        return res.status(401).send({
            message: 'Unauthenticated - Cookie does not exist'
        })
    }
})

router.post('/getGrades', async function (req, res) {
    try {
        const cookie = req.cookies['jwt']
        const claims = jwt.verify(cookie, process.env.JWT_SECRET_KEY);

        if (!claims) {
            return res.status(401).send({
                message: 'Unauthenticated - Cookie invalid'
            })
        }
        rows = await getGradesByTeacherId(req.body.idteacher)

        if (rows) {
            res.json({
                grades: rows
            })
        } else {
            res.json({
                err: "Greška pri dohvatu studenata"
            })
        }
    } catch (err) {
        return res.status(401).send({
            message: 'Unauthenticated - Cookie does not exist'
        })
    }
})

router.post('/getStudents', async function (req, res) {
    try {
        const cookie = req.cookies['jwt']
        console.log(cookie)
        const claims = jwt.verify(cookie, process.env.JWT_SECRET_KEY);

        if (!claims) {
            return res.status(401).send({
                message: 'Unauthenticated - Cookie invalid'
            })
        }
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
    } catch (err) {
        return res.status(401).send({
            message: 'Unauthenticated - Cookie does not exist'
        })
    }
})

router.get('/getTasks', async function (req, res) {
    try {
        const cookie = req.cookies['jwt']
        console.log(cookie)
        const claims = jwt.verify(cookie, process.env.JWT_SECRET_KEY);

        if (!claims) {
            return res.status(401).send({
                message: 'Unauthenticated - Cookie invalid'
            })
        }
        rows = await getTasks()

        if (rows) {
            res.json({
                tasks: rows
            })
        } else {
            res.json({
                err: "Greška pri dohvatu studenata"
            })
        }
    } catch (err) {
        return res.status(401).send({
            message: 'Unauthenticated - Cookie does not exist'
        })
    }
})

router.get('/getExercises', async function (req, res) {
    try {
        const cookie = req.cookies['jwt']
        console.log(cookie)
        const claims = jwt.verify(cookie, process.env.JWT_SECRET_KEY);

        if (!claims) {
            return res.status(401).send({
                message: 'Unauthenticated - Cookie invalid'
            })
        }
        rows = await getExercises()

        if (rows) {
            res.json({
                exercises: rows
            })
        } else {
            res.json({
                err: "Greška pri dohvatu studenata"
            })
        }
    } catch (err) {
        return res.status(401).send({
            message: 'Unauthenticated - Cookie does not exist'
        })
    }
})

getExercises = async function () {
    const sql = `SELECT * FROM exercise`;
    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

getTasks = async function () {
    const sql = `SELECT * FROM task`;
    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

getGradesByTeacherId = async function (idteacher) {
    const sql = `SELECT * FROM grade WHERE idteacher = ` + idteacher;
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
