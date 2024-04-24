const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imagenSchema = new Schema({
  url: {
    type: String,
    required: true,
  }
});

const catalogoSchema = new Schema(
  {
    tipoMaquina: {
      type: String,
      required: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    precioComercial: {
      type: Number,
      required: true,
      trim: true,
    },
    precio: {
      type: Number,
      required: true,
      trim: true,
    },
    estado: {
      type: String,
      required: true,
      trim: true,
    },
    imagenes: [imagenSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Catalogo", catalogoSchema);
