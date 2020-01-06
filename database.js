var mysql = require('mysql'); 

const dbConfig = {
  host: 'localhost',
  user: 'user',
  password: 'password',
  database:
   '100stunden'
};

let connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) throw err;

  console.log('Connected!');
});

function handleDisconnect(conn) {
  conn.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);

    connection = mysql.createConnection(dbConfig);
    handleDisconnect(connection);
    connection.connect();
  });
}

handleDisconnect(connection);


module.exports = connection;