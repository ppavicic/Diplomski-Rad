const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db')
const http = require('http');
const https = require('https');

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
        const queryParams = new URLSearchParams({
            text: req.body.text,
            context: req.body.context,
            punctuation: req.body.punctuation,
            app: process.env.ISPRAVI_ME_KEY
        }).toString();

        const options = {
            hostname: 'ispravi.me',
            path: `/api/ispravi?${queryParams}`,
            method: 'GET',
        };

        const proxyReq = http.request(options, (proxyRes) => {
            let responseData = '';

            proxyRes.on('data', (chunk) => {
                responseData += chunk;
            });

            proxyRes.on('end', () => {
                try {
                    console.log('Response Data:', responseData)
                    const newUrl = new URL(proxyRes.headers.location);
                    console.log('URL:' + newUrl.href);
                    followRedirect(newUrl.href, res);
                } catch (error) {
                    console.error('Error parsing response data:', error);
                    res.status(500).json({ error: 'Failed to parse response data' });
                }
            });
        });

        proxyReq.on('error', (error) => {
            console.error('Proxy Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });

        proxyReq.end();
    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const followRedirect = (url, res) => {
    https.get(url, (redirectRes) => {
        let responseData = '';

        redirectRes.on('data', (chunk) => {
            responseData += chunk;
        });

        redirectRes.on('end', () => {
            try {
                console.log('Response2: '+ responseData )
                const parsedData = JSON.parse(responseData);
                res.json(parsedData);
            } catch (error) {
                console.error('Error parsing redirect response data:', error);
                res.status(500).json({ error: 'Failed to parse redirect response data' });
            }
        });
    }).on('error', (error) => {
        console.error('Redirect Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    });
};

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