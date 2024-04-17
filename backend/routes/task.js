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

        console.log(req.body);
    
        const sql = `INSERT INTO task (type, question, hint, fillin, answer1, answer2, audio, tablejson)
        VALUES ('` + req.body.type + `', '` + req.body.question + `', '` + req.body.hint + `', '` + req.body.fillin + `', '`
            + req.body.answer1 + `', '` + req.body.answer2 + `', '` + req.body.audio + `', '` + req.body.tableJSON + `')`;
        const result = await db.query(sql, []);

        if (result) {
            res.json({
                success : true
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