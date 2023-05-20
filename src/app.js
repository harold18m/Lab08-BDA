const express = require('express');
const { Router } = require('express');
const app = express();
const path = require ('path');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(require('./controllers/authController'));
app.use(express.static(path.join(__dirname,'public')))

// Agregamos la siguiente línea para configurar el motor de plantillas EJS
app.set('view engine', 'ejs');

// Agregamos la siguiente línea para especificar el directorio de las plantillas
app.set('views', path.join(__dirname, 'views'));

// Ruta para mostrar la página de dashboard
app.get('/dashboard', (req, res) => {
  const token = 'TOKEN_GENERATED'; // Reemplazamos esto con la lógica de generación de token que estés utilizando
  res.render('dashboard', { token });
});

module.exports = app;
