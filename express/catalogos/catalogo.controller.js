const Catalogo = require("./catalogo.model");
const fs = require('fs');
const path = require('path');

exports.createCatalogo = async (req, res) => {
  try {
    const imagenes = req.files.map(file => {
      return { url: `http://localhost:4000/uploads/${file.filename}` }
    });
    const catalogo = new Catalogo({
      tipoMaquina: req.body.tipoMaquina,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precioComercial: req.body.precioComercial,
      precio: req.body.precio,
      estado: req.body.estado,
      imagenes: imagenes
    });
    const nuevoCatalogo = await catalogo.save();
    res.status(201).json(nuevoCatalogo);
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error al crear el catálogo');
  }
};

exports.obtenerCatalogoPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const catalogo = await Catalogo.findOne({ _id: id }); // búsqueda por id
    res.status(200).json(catalogo);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error en el servidor");
  }
};

exports.deleteCatalogoPorId = async (req, res) => {
  try {
    const catalogo = await Catalogo.findById(req.params.id);

    if (!catalogo) {
      return res.status(404).json({ msg: 'Catalogo no encontrado' });
    }

    // Eliminar las imágenes asociadas al catálogo
    for (const imagen of catalogo.imagenes) {
      const filePath = path.join(__dirname, '../public/uploads/', path.basename(imagen.url));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await catalogo.remove();
    res.json({ msg: 'Catalogo eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
};


exports.updateCatalogoPorId = async (req, res) => {
  try {
    const { tipoMaquina, nombre, descripcion, precioComercial, precio, estado } = req.body;

    let nuevasImagenes = [];
    if (req.files && req.files.length > 0) {
      nuevasImagenes = req.files.map(file => {
        return { url: `http://localhost:4000/uploads/${file.filename}` };
      });
    }

    let imagenesExistentes = [];
    if (req.body.imagenesExistentes) {
      imagenesExistentes = JSON.parse(req.body.imagenesExistentes);
    }

    const imagenes = [...imagenesExistentes, ...nuevasImagenes];

    const catalogoActualizado = await Catalogo.findByIdAndUpdate(
      req.params.id,
      { tipoMaquina, nombre, descripcion, precioComercial, precio, estado, imagenes },
      { new: true }
    );

    res.status(200).json(catalogoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
};



exports.obtenerCatalogoTodo = async (req, res) => {
  try {
    const catalogo = await Catalogo.find(); // búsqueda por id
    res.status(200).json(catalogo);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error en el servidor");
  }
};

exports.obtenerCatalogoPorOpcion = async (req, res) => {
  try {
    const opcion = req.params.opcion;
    const catalogo = await Catalogo.find({ tipoMaquina: opcion });
    res.status(200).json(catalogo);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error en el servidor");
  }
};
