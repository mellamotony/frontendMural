export interface SolicituMural {
  id_mural:string
  nombre_mural:string,
  fecha:string,
  estado:string
}

export interface HistorialMural{
  nombre_mural:string,
  fecha_aprobado:string,
}

export interface AprobeMural{
  id_mural:string,
  id_user:number,
  estado:string,
  fecha_publicacion:Date,
  fin_publicacion:Date
}
