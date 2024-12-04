export interface ITipocuenta {
  id: number;
  descripcion: string;
  creditoodebito: number;
  comentarios: string;
  realonominal: number;
  cuentas?: any;
  grupotipocuentas?: any;
}
