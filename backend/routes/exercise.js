const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db')

router.post('/sendLog', async function (req, res) {
    console.log(req.body);
    if (req.body.idtask != 0) {
        latestLog = await getLatestLog()
        const date1 = latestLog[0].createddate
        const date2 = new Date(Date.now());
        duration = Math.abs(date2 - date1) / 1000;
    } else {
        duration = "00:00:00";
    }

    let studentAnswer = req.body.studentAnswer;
    let correctAnswer = req.body.correctAnswer;
    if (req.body.type === 'table') {
        studentAnswer = JSON.stringify(req.body.studentAnswer);
        correctAnswer = JSON.stringify(req.body.correctAnswer);
    }
    const sql = `INSERT INTO logs (duration, correct, studentanswer, correctanswer, idstudent, idexercise, idtask, createddate)
                VALUES ('` + duration + `',` + req.body.correct + `, '` + studentAnswer + `', '` + correctAnswer + `',`
        + req.body.idstudent + `,` + req.body.idexercise + `,` + req.body.idtask + `,` + ` CURRENT_TIMESTAMP)`;
    const result = await db.query(sql, []);

    if (result) {
        res.json({
            success: true,
        })
    } else {
        res.json({
            success: false
        })
    }
});

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

router.get('/getSettedExercise', async (req, res) => {
    rows = await getExerciseSetToStart();

    if (rows) {
        res.json({
            exercise: rows
        })
    } else {
        res.json({
            err: "Greška pri dohvatu vježbe"
        })
    }
})

router.post('/getExercise', async (req, res) => {
    rows = await getExerciseById(req.body.idexercise);

    console.log(rows[0])
    if (rows) {
        res.json({
            exercise: rows
        })
    } else {
        res.json({
            err: "Greška pri dohvatu vježbe"
        })
    }
})

router.post('/update', async (req, res) => {
    const idexercise = req.body.idexercise;
    rows = await getExerciseSetToStart();
    if (rows && req.body.start) {
        res.json({
            err: 'Već postoji vježba postavljena za odradit'
        })
    } else {
        const sql = `UPDATE exercise
         SET start = `+ req.body.start + `, name = '` + req.body.name +
            `' WHERE idexercise=` + idexercise;
        const result = await db.query(sql, []);
        console.log(sql)
        let result2 = null;
        if (req.body.tasks.length > 0) {
            for (const idtask of req.body.tasks) {
                const sql2 = `DELETE from exercisetask where idexercise = ` + idexercise + ` AND idtask = ` + idtask;
                result2 = await db.query(sql2, []);
            }
        }

        if (result && result2) {
             res.json({
                 success: true
             })
         } else {
             res.json({
                 err: "Greška pri update vježbe"
             })
         }
    }
})

getExerciseSetToStart = async function () {
    try {
        const sql = `SELECT * FROM exercise WHERE start = true`;
        const result = await db.query(sql, []);
        console.log(result.rows.length)
        if (result.rows.length !== 0) {
            let exerciseId = result.rows[0].idexercise;
            let exerciseName = result.rows[0].name;
            const sql2 = `SELECT idtask FROM exercisetask WHERE idexercise = ` + exerciseId;
            const result2 = await db.query(sql2, []);
            const taskIds = result2.rows.map(row => row.idtask);
            const taskIdString = taskIds.join(', '); // Convert array of task ids to comma-separated string
            const sql3 = `SELECT * FROM task WHERE idtask IN (${taskIdString})`;
            const result3 = await db.query(sql3, []);

            const exercise = {
                "idexercise": exerciseId,
                "name": exerciseName,
                "tasks": result3.rows,
            }
            return JSON.stringify(exercise)
        }
    } catch (err) {
        console.log(err);
        throw err
    }
}

getLatestLog = async function () {
    const sql = `SELECT * FROM logs
                ORDER BY idlog DESC
                LIMIT 1`
    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

getExerciseById = async function (idexercise) {
    const sql = `SELECT * FROM exercise WHERE idexercise=` + idexercise;
    try {
        const result = await db.query(sql, []);
        const exercise = result.rows;
        exercise[0].tasks = await getTasksForExercise(idexercise);
        return exercise;
    } catch (err) {
        console.log(err);
        throw err
    }
}

getTasksForExercise = async function (idexercise) {
    const sql = `SELECT idtask FROM exercisetask WHERE idexercise = ` + idexercise;
    try {
        const result = await db.query(sql, []);
        const idTasks = result.rows;
        const extractedIds = idTasks.map(task => task.idtask);

        let tasksArray = [];
        for (const idtask of extractedIds) {
            const task = await getTaskById(idtask);
            tasksArray.push(JSON.stringify(task))
        }
        return tasksArray;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

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