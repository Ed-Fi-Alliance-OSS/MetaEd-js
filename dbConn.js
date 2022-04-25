const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'abcdefgh1!',
    server: 'localhost',
    port: 1433,
    connectionTimeout: 15000,
    requestTimeout: 15000,
    driver: 'tedious',
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
