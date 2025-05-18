
# 🗳️ Encuestas Online - Node.js + EJS

Este proyecto permite crear encuestas con múltiples preguntas y opciones. Cada pregunta puede tener una única opción correcta. Las encuestas se almacenan en una base de datos MySQL y se pueden responder posteriormente.

---

## 📌 Características

- Crear encuestas dinámicamente desde el frontend.
- Cada encuesta puede tener múltiples preguntas.
- Cada pregunta puede tener múltiples opciones, con una opción correcta.
- Almacena encuestas, preguntas y opciones en MySQL.
- Interfaz creada con EJS y JavaScript puro.

---

## ⚙️ Tecnologías

- Node.js
- Express.js
- EJS
- MySQL

## 🧑‍💻 Instalación

1. Clona el repositorio:

    git clone https://github.com/tu-usuario/proyecto-encuestas.git
    cd proyecto-encuestas

2. Instala las dependencias:

    npm install

3. Configura tu base de datos en `db.js`:

```js
const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'nombre_de_tu_bd'
});
module.exports = db;
```

4. Asegúrate de tener esta estructura de base de datos:

```sql
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100)
);

CREATE TABLE encuestas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  titulo VARCHAR(255),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE preguntas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  encuesta_id INT,
  texto TEXT,
  FOREIGN KEY (encuesta_id) REFERENCES encuestas(id)
);

CREATE TABLE opciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pregunta_id INT,
  texto TEXT,
  es_correcta BOOLEAN DEFAULT false,
  FOREIGN KEY (pregunta_id) REFERENCES preguntas(id)
);
```

---

## 🚀 Ejecución

    node app.js

Abre tu navegador en:  
[http://localhost:3000](http://localhost:3000)

---

## ✍️ Créditos

Proyecto creado por **Nestor Atiro** como práctica de desarrollo con Node.js y EJS.
```
