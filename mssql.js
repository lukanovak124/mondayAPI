const sql = require('mssql')
 
const config = {
    user: 'sa',
    password: 'projectberrySQL1',
    server: '127.0.0.1', // You can use 'localhost\\instance' to connect to named instance
    database: 'dev',
 
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
}

sql.connect(config).then(pool => {
    // Query
    
    return pool.request()
        .query('select * from Tasks')
}).then(result => {
    console.dir(result);
});
