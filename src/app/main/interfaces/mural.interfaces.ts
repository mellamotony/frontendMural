export  interface PanelItem {

  file: File;
  type: string;
  url: string;
  imagenes?:ImageDatasetItem,
  videos?:VideoDatasetItem,
  pdfs?:PdfsItem
  border_style?:string,
  border_radius?:string,
  border_color?:string,
  posx?: number,
  posy?:number,
  height?:number,
  width?: number
  id?:number
}

export interface myFile extends File {
  lastModified: number;
  name: string;
  size: number;
  type: string;

}



export interface MuralDataSetItem {
  id_mural?:string |null,
  id_user:string |null,
  editor?:string,
  imgMural?:string,
  height:number,
  width:number,
  fecha_modificacion?:string,
  nombrem?:string,
  textos:TextDatasetItem[],
  imagenes:ImageDatasetItem[],
  videos:VideoDatasetItem[],
  pdfs:PdfsItem[],
  estado:string
}

export interface TextDatasetItem{
  id_mural?:string |null,
  id_txt?:string,
  valor: string,
  font:string,
  font_size:string,
  posx:number,
  posy:number,
  height:number,
  width:number,
  color:string,
  border_color:string,
  border_radius:string,
  border_style:string,
  backgroundcolor:string,
  font_weight:string,
  sangria:string

}

export interface ImageDatasetItem{

  id_mural:string |null,
  id_imagenes?:string,
  url: string,
  alt:string,
  height:number,
  width:number,
  posx:number,
  posy:number,
  border_color:string,
  border_radius:string,
  border_style:string
}

export interface VideoDatasetItem{

  id_mural:string |null,
  id_video?:string,
  url_video: string,
  height:number,
  width:number,
  posx:number,
  posy?:number,
  formato?:string,
  duration?:number,
  border_color:string,
  border_radius:string,
  border_style:string
}

export interface PdfsItem{

  id_mural:string |null,
  url_pdfs?:string,
  id_pdfs?:string,
  posx?:number,
  posy?:number,
  height?:number,
  width?:number,
  border_color?:string,
  border_style?:string,
  border_radius?:string
}


//interfaces para consumir datos del mural
// Generated by https://quicktype.io

export interface IDmural {
  id_mural: string;
}


//interfaces para mostrar en el dashbord
export interface MuralByUser{
  nombrem:string,
  numeroM?:number,
  id_mural:string,
  imgmural?:string
}


// Generated by https://quicktype.io

export interface Solicitud {
  id_mural:        string;
  nombrem:         string;
  id_user:         string;
  estado:          string;
  diseñador:       string;
  fecha_solicitud: string;
  fecha_respuesta?: string;
  fecha_publicacion?:string;
  fin_publicacion?:string;
}

export interface logs {
  fecha_modificacion:string,
  modificado:string,
  nombre_mural:string
}

export interface editors {
  "id_user":string,"nombre":string,"apellidos":string,"correo":string,"id_rol":string,"rol":string
}
