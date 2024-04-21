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
        const sqlSelect1 = `SELECT idexercise FROM exercise WHERE start = true`;
        const result = await db.query(sqlSelect1, []);
        console.log(result)
        if (result.rowCount !== 0) {
            return res.json({
                success: false,
                message: "Već postoji vježba koja je postavljena učenicima za vježbanje!"
            })
        }

        console.log(req.body);
        const sql1 = `INSERT INTO exercise (name, start)
                        VALUES ('` + req.body.name + `',` + req.body.start + `)`;
        const result1 = await db.query(sql1, []);

        const sqlSelect2 = `SELECT MAX(idexercise) FROM exercise WHERE name = '` + req.body.name + `'`;
        const result2 = await db.query(sqlSelect2, []);
        const exerciseId = result2.rows[0].max;

        let values = '';
        for (const task of req.body.tasks) {
            values += `('${task.idtask}', '${exerciseId}'),`;
        }
        values = values.slice(0, -1);

        const sql3 = `
            INSERT INTO exercisetask (idtask, idexercise)
            VALUES ${values}`;

        const result3 = await db.query(sql3, []);
        if (result1 && result3) {
            res.json({
                success: true,
                exerciseId: exerciseId
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

module.exports = router;