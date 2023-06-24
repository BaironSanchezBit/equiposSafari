export class Catalogo {
    _id?: string;
    tipoMaquina: string;
    nombre: string;
    descripcion: string;
    precioComercial: string;
    precio: string;
    estado: string;
    imagenes: string[]

    constructor(tipoMaquina: string,nombre: string,descripcion: string, precioComercial: string,precio: string,estado: string, imagenes: string[]){
        this.tipoMaquina = tipoMaquina;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precioComercial = precioComercial;
        this.precio = precio;
        this.estado = estado;
        this.imagenes = imagenes;
    }
}
