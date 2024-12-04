import { IPeriodo } from "./periodo.interface";
import { ITipoasiento } from "./tipoasiento.interface";
import { IUsuario } from "./usuario.interface";

export interface IAsiento {
  id: number;
  descripcion: string;
  comentarios: string;
  inventariable: number;
  momentstamp: Date;
  tipoasiento: ITipoasiento;
  usuario: IUsuario;
  periodo: IPeriodo;
  apuntes?: any;
}




