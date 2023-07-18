export  interface PanelItem {
  file: File;
  type: string;
  url: string;
}

export interface MuralDataSetItem {
  height:number,
  width:number,
  textos:TextDatasetItem[],
  imagenes:ImageDatasetItem[],
  videos:VideoDatasetItem[],
  estado:string
}

export interface TextDatasetItem{
  valor: string,
  font:string,
  font_size:string,
  posX:number,
  posY:number,
  height:number,
  width:number,
  color:string,
  borderColor:string,
  backgroundColor:string,
  fontWeight:string,
  sangria:string

}

export interface ImageDatasetItem{
  url: string,
  alt:string,
  height:number,
  width:number,
  posX:number,
  posY:number
}

export interface VideoDatasetItem{
  src: string,
  height:number,
  width:number,
  posX:number,
  posY?:number,
  formato?:string,
  duration?:number
}


