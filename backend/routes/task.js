const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db')
const fetch = require("node-fetch");

router.post('/save', async function (req, res) {
    try {
        const cookie = req.cookies['jwt']
        const claims = jwt.verify(cookie, process.env.JWT_SECRET_KEY);

        if (!claims) {
            return res.status(401).send({
                message: 'Unauthenticated - Cookie invalid'
            })
        }

        let hint = req.body.hint.replace(/'/g, '');
        const sql = `INSERT INTO task (type, question, hint, fillin, answer1, answer2, audio, tablejson)
        VALUES ('` + req.body.type + `', '` + req.body.question + `', '` + hint + `', '` + req.body.fillin + `', '`
            + req.body.answer1 + `', '` + req.body.answer2 + `', '` + req.body.audio + `', '` + req.body.tableJSON + `')`;
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

router.post('/proxy-ispravi', async (req, res) => {
    try {
        console.log(process.env.ISPRAVI_ME_KEY)
        const postData = {
            text: req.body.text,
            context: req.body.context,
            punctuation: req.body.punctuation,
            app: process.env.ISPRAVI_ME_KEY
        };

        const response = await fetch('https://ispravi.me/api/ispravi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': '*/*'
            },
            body: JSON.stringify(postData)
        });
        console.log(response)

        if (response.ok) {
            const responseData = await response.json();
            res.json(responseData);
        } else {
            res.status(response.status).json({ error: 'Proxy Error' });
        }
    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/getTask', async function (req, res) {
    try {
        const cookie = req.cookies['jwt']
        const claims = jwt.verify(cookie, process.env.JWT_SECRET_KEY);

        if (!claims) {
            return res.status(401).send({
                message: 'Unauthenticated - Cookie invalid'
            })
        }

        const result = await getTaskById(req.body.idtask);
        if (result) {
            res.json({
                task: result
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

router.post('/update', async (req, res) => {
    let hint = req.body.hint.replace(/'/g, '');

    const sql = `UPDATE task
         SET type = '`+ req.body.type + `', question = '` + req.body.question + `', hint = '` + hint + `', fillin = '`
        + req.body.fillin + `' , answer1 = '` + req.body.answer1 + `', answer2 = '` + req.body.answer2 + `', audio = '` + req.body.audio + `', tablejson = '` + req.body.tablejson
        + `' WHERE idtask=` + req.body.idtask;

    const result = await db.query(sql, []);
    if (result) {
        res.json({
            success: true
        })
    } else {
        res.json({
            err: "Greška pri update zadatka"
        })
    }
})

getTaskById = async function (idtask) {
    const sql = `SELECT * FROM task WHERE idtask = ` + idtask;
    try {
        const result = await db.query(sql, []);
        return result.rows[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = router;