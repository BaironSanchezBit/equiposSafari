const Catalogo = require('./catalogo.controller');

module.exports = (router, upload) => {
    router.post('/catalogos/crear', upload.array('imagenes'), Catalogo.createCatalogo);
    router.get('/catalogos/:opcion', Catalogo.obtenerCatalogoPorOpcion);
    router.get('/catalogos/id/:id', Catalogo.obtenerCatalogoPorId);
    router.get('/adminProductos/todo', Catalogo.obtenerCatalogoTodo);
    router.get('/adminProductos/:opcion', Catalogo.obtenerCatalogoPorOpcion);
    router.delete('/adminProductos/delete/:id', Catalogo.deleteCatalogoPorId);
    router.get('/adminProductos/update/:id', Catalogo.obtenerCatalogoPorId);
    router.put('/adminProductos/updateCatalogo/:id', Catalogo.updateCatalogoPorId)
}