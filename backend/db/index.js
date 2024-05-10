const {Pool} = require('pg');

const pool = new Pool({
    user: 'diplomski_o917_user', //postgres
    host: 'dpg-cov0l80l6cac73bd0pl0-a.frankfurt-postgres.render.com', //localhost
    database: 'diplomski_o917', //diplomski
    password: 'rIsnhLQoCAQQIhK91sFo0wQiJBKKJ2ko', //bazepodataka
    port: 5432,
    ssl: true
});

module.exports = {
    query: (text, params) => {
        const start = Date.now();
        return pool.query(text, params)
            .then(res => {
                const duration = Date.now() - start;
                //console.log('executed query', {text, params, duration, rows: res.rows});
                return res;
            });
    },
    pool: pool
}