'use strict'

var Project = require('../models/project');
var fs = require('fs');
var path = require('path');

var controllers = {
	home: function(req, res){
		return res.status(200).send({
			message: 'Soy la home'
		});
	},

	test: function(req, res){
		return res.status(200).send({
			message: "Soy el metodo o accion test del controllador project"
		});

	},

	saveProject: function(req, res){
		//  Al hacer un new crea una id automaticamente
		var project = new Project();

		var params = req.body;
		project.name = params.name;
		project.description = params.description;
		project.category = params.category;
		project.year = params.year;
		project.langs = params.langs;
		project.image = null;

		// Para guardar en BD
		project.save((err, projectStored) => {
			if(err) return res.status(500).send({message: 'Error al guardar el documento.'});

			if(!projectStored) return res.status(404).send({message: 'No se ha podido guardar el projecto.'});

			return res.status(200).send({project: projectStored});
		});
	},

	//Buscar una id en la BD
	getProject: function(req, res){
		var projectId = req.params.id;

		if(projectId == null){
			if(!project) return res.status(404).send({message: 'El projecto no existe.'});
		}

		Project.findById(projectId, (err, project) => {
			if (err) return res.status(500).send({message: 'Error al devolver los datos.'});

			if(!project) return res.status(404).send({message: 'El projecto no existe.'});

			return res.status(200).send({
				project
			});
		});
	},


	getProjects: function(req, res){

		// Existe mas opciones para realizar el find
		Project.find({}).sort('-year').exec((err, projects) => {
			if(err) return res.status(500).send({message: 'Error al devolver los datos.'});

			if(!projects) return res.status(404).send({message: 'No hay projectos que mostrar.'});

			return res.status(200).send({projects});
		});
	},

	updateProject: function(req, res){
		var projectId = req.params.id;
		var update = req.body;

		Project.findByIdAndUpdate(projectId, update, {new:true}, (err, projectUpdated) =>{

			if(err) return res.status(500).send({message: 'Error al actualizar'});

			if(!projectUpdated) return res.status(404).send({message: 'No existe el projecto para actualizar'});

			return res.status(200).send({
				project: projectUpdated
			})
		});
	},


	deleteProject: function(req, res){

		var projectId = req.params.id;

		Project.findByIdAndRemove(projectId, (err, projectRemoved) => {

			if(err) return res.status(500).send({message: 'No se ha podido borrar el projecto'});

			if (!projectRemoved) return res.status(404).send({message: 'No se puede eliminar ese projecto.'});


			return res.status(200).send({
				project: projectRemoved
			})
		});
	},

	uploadImage: function(req, res){

		var projectId = req.params.id;
		var fileName = 'Imagen no subida... ';

		if(req.files){

			var filePath = req.files.image.path;
			var fileSplit = filePath.split('\\');
			var fileName = fileSplit[1];
			var extSplit = fileName.split('\.');
			var fileExt = extSplit[1];

			if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
				Project.findByIdAndUpdate(projectId, {image: fileName}, (err, projectUpdated) => {

					if(err) return res.status(500).send({message: 'La imagen no se ha subido.'});

					if(!projectUpdated) return res.status(404).send({message: 'El projecto no existe y no se ha asignado la imagen. '});

					return res.status(200).send({
						project: projectUpdated
					});
				});
			}
			else{

				fs.unlink(filePath, (err) => {
					return res.status(200).send({message: 'La extension no es valida. '});
				});
			}	
		} 
		else {
			return res.status(200).send({
				message: fileName
			});
		}
	},

	getImageFile: function(req, res){
		var file = req.params.image;
		var path_file = './uploads/'+file;

		fs.exists(path_file, (exists) => {
			if(exists){
				return res.sendFile(path.resolve(path_file));
			}else{
				return res.status(200).send({
					message: "No existe la imagen ... "
				});
			}
		});
	}
};

module.exports = controllers;