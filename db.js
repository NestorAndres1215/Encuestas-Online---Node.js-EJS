const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',       // pon tu contraseña aquí si tienes
   database: 'encuesta_avanzada'
});

conexion.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err.message);
    } else {
        console.log('Conexión a MySQL exitosa');
    }
});

module.exports = conexion;
