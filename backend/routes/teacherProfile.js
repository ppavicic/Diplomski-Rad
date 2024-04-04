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

module.exports = router;
