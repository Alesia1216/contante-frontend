import { Injectable } from '@angular/core';
import { ICuenta } from '../model/cuenta.interface';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { IPage } from '../model/model.interface';
import { httpOptions, serverURL } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CuentaService {
  serverURL: string = serverURL + '/cuenta';

  constructor(private oHttp: HttpClient) { }

  getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<ICuenta>> {
    let URL: string = '';
    URL += this.serverURL;
    if (!page) {
      page = 0;
    }
    URL += '?page=' + page;
    if (!size) {
      size = 10;
    }
    URL += '&size=' + size;
    if (field) {
      URL += '&sort=' + field;
      if (dir === 'asc') {
        URL += ',asc';
      } else {
        URL += ',desc';
      }
    }
    if (filtro) {
      URL += '&filter=' + filtro;
    }
    return this.oHttp.get<IPage<ICuenta>>(URL, httpOptions);
  }

  getPageXTipoCuenta(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string,
    id_tipo_cuenta: number
  ): Observable<IPage<ICuenta>> {
    let URL: string = '';
    URL += this.serverURL + '/xtipocuenta/' + id_tipo_cuenta;
    if (!page) {
      page = 0;
    }
    URL += '?page=' + page;
    if (!size) {
      size = 10;
    }
    URL += '&size=' + size;
    if (field) {
      URL += '&sort=' + field;
      if (dir === 'asc') {
        URL += ',asc';
      } else {
        URL += ',desc';
      }
    }
    if (filtro) {
      URL += '&filter=' + filtro;
    }
    return this.oHttp.get<IPage<ICuenta>>(URL, httpOptions);
  }

  get(id: number): Observable<ICuenta> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<ICuenta>(URL);
  }

  create(oCuenta: ICuenta): Observable<ICuenta> {
    //hack para evitar error de tipo en el servidor
    oCuenta.tipocuenta.grupotipocuentas = [];
    oCuenta.tipocuenta.cuentas = [];
    //----
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<ICuenta>(URL, oCuenta);
  }

  update(oCuenta: ICuenta): Observable<ICuenta> {
    //hack para evitar error de tipo en el servidor
    oCuenta.tipocuenta.grupotipocuentas = [];
    oCuenta.tipocuenta.cuentas = [];
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.post<ICuenta>(URL, oCuenta);
  }

  getOne(id: number): Observable<ICuenta> {
    let URL: string = '';
    URL += 'http://localhost:8085';
    URL += '/cuenta';
    URL += '/' + id;
    return this.oHttp.get<ICuenta>(URL);
  }

  delete(id: number) {
    return this.oHttp.delete('http://localhost:8085/cuenta/' + id);
  }
}
