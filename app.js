const express = require('express');
const db = require('./db');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Mostrar formulario para crear encuesta
app.get('/crear', (req, res) => {
    res.render('crearEncuesta');
});

// Guardar encuesta con preguntas y opciones
app.post('/guardarEncuesta', (req, res) => {
    const { titulo, preguntas } = req.body;
    const usuario_id = 1;

    db.query('INSERT INTO encuestas (usuario_id, titulo) VALUES (?, ?)', [usuario_id, titulo], (err, result) => {
        if (err) throw err;

        const encuestaId = result.insertId;
        const preguntasArray = JSON.parse(preguntas);

        preguntasArray.forEach(preg => {
            db.query('INSERT INTO preguntas (encuesta_id, texto) VALUES (?, ?)', [encuestaId, preg.texto], (err, result2) => {
                if (err) throw err;

                const preguntaId = result2.insertId;

                preg.opciones.forEach(op => {
                    const texto = op.texto;
                    const es_correcta = op.es_correcta ? 1 : 0;

                    db.query(
                        'INSERT INTO opciones (pregunta_id, texto, es_correcta) VALUES (?, ?, ?)',
                        [preguntaId, texto, es_correcta]
                    );
                });
            });
        });
        res.render('respuesta');

    });
});


// Mostrar encuesta para responder
app.get('/responder/:id', (req, res) => {
    const encuestaId = req.params.id;
console.log(encuestaId)
    db.query('SELECT * FROM encuestas WHERE id = ?', [encuestaId], (err, encRes) => {
        console.log(encRes);
        if (err) throw err;

        if (encRes.length === 0) {
            return res.status(404).send("Encuesta no encontrada");
        }

        const encuesta = encRes[0];

        db.query('SELECT * FROM preguntas WHERE encuesta_id = ?', [encuestaId], (err, preguntas) => {
            if (err) throw err;

            const promesas = preguntas.map(pregunta => {
                return new Promise((resolve, reject) => {
                    db.query('SELECT * FROM opciones WHERE pregunta_id = ?', [pregunta.id], (err, opciones) => {
                        if (err) reject(err);
                        pregunta.opciones = opciones;
                        resolve();
                    });
                });
            });

            Promise.all(promesas).then(() => {
                res.render('responderEncuesta', { encuesta, preguntas });
            }).catch(err => {
                console.error(err);
                res.status(500).send("Error al cargar las opciones");
            });
        });
    });
});

// Guardar votos
app.post('/votar/:id', (req, res) => {
    const votos = req.body;

    for (let opcionId of Object.values(votos)) {
        db.query('UPDATE opciones SET votos = votos + 1 WHERE id = ?', [opcionId]);
    }

    res.redirect(`/resultados/${req.params.id}`);
});

// Ver resultados
app.get('/resultados/:id', (req, res) => {
    const encuestaId = req.params.id;

    db.query('SELECT * FROM encuestas WHERE id = ?', [encuestaId], (err, encRes) => {
        if (err) throw err;
        const encuesta = encRes[0];

        db.query('SELECT * FROM preguntas WHERE encuesta_id = ?', [encuestaId], (err, preguntas) => {
            if (err) throw err;

            const promesas = preguntas.map(pregunta => {
                return new Promise((resolve, reject) => {
                    db.query('SELECT * FROM opciones WHERE pregunta_id = ?', [pregunta.id], (err, opciones) => {
                        if (err) reject(err);
                        pregunta.opciones = opciones;
                        resolve();
                    });
                });
            });

            Promise.all(promesas).then(() => {
                res.render('resultados', { encuesta, preguntas });
            });
        });
    });
});

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/encuestas', (req, res) => {
    db.query('SELECT * FROM encuestas', (err, encuestas) => {
        if (err) throw err;
        res.render('encuestas', { encuestas });
    });
});



app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});


app.use((req, res, next) => {
    req.usuario = { id: 1, nombre: 'Nestor' }; // Simulamos un usuario logueado
    next();
});