'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 2900;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/portafolio', {useNewUrlParser:true})
		.then(() => {
			console.log("Conexion a la base de datos establecida con exito");

			// Creacion del servidor

			app.listen(port, () => {
				console.log("Servidor corriendo correctamente en la url: localhost:"+port);
			});
		})
		.catch(err => console.log(err));