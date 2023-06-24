const mongoose = require("mongoose");
const catalogoSchema = require("./catalogo.model");

catalogoSchema.statics = {
  create: async function (data) {
    const catalogo = new this(data);
    const savedCatalogo = await catalogo.save();
    return savedCatalogo;
  }
};

const Catalogo = mongoose.model("Catalogo", catalogoSchema);

module.exports = Catalogo;
