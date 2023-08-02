export interface Logresponse{
  token?:string,
  id_user?:string
}

export interface guardToken{
  sub:string,
  email:string,
  rol:string,
  iat:number,
  exp:number
}
