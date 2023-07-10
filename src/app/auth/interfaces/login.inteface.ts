export interface Logresponse{
  token?:string
}

export interface guardToken{
  sub:string,
  email:string,
  rol:string,
  iat:number,
  exp:number
}
