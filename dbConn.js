const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'abcdefgh1!',
    server: 'localhost',
    options: {
        trustServerCertificate:true,
    }
};
  
sql.on('error', err => {
    console.error('err: ', err);
});

sql.connect(config).then(pool => {
    return pool.request()
        .query('select @@VERSION')
}).then(result => {
    console.dir(result)
}).catch(err => {
    console.error('err: ', err);
});
