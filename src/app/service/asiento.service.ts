import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { IPage } from '../model/model.interface';
import { httpOptions, serverURL } from '../environment/environment';
import { IAsiento } from '../model/asiento.interface';

@Injectable({
  providedIn: 'root',
})
export class AsientoService {
  serverURL: string = serverURL + '/asiento';

  constructor(private oHttp: HttpClient) {}

  getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<IAsiento>> {
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
    return this.oHttp.get<IPage<IAsiento>>(URL, httpOptions);
  }

  getPageXUsuario(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string,
    id_usuario: number
  ): Observable<IPage<IAsiento>> {
    let URL: string = '';
    URL += this.serverURL + '/xusuario/' + id_usuario;
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
    return this.oHttp.get<IPage<IAsiento>>(URL, httpOptions);
  }

  getPageXTipoAsiento(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string,
    id_tipoasiento: number
  ): Observable<IPage<IAsiento>> {
    let URL: string = '';
    URL += this.serverURL + '/xtipoasiento/' + id_tipoasiento;
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
    return this.oHttp.get<IPage<IAsiento>>(URL, httpOptions);
  }

  getPageXPeriodo(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string,
    id_tipoasiento: number
  ): Observable<IPage<IAsiento>> {
    let URL: string = '';
    URL += this.serverURL + '/xperiodo/' + id_tipoasiento;
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
    return this.oHttp.get<IPage<IAsiento>>(URL, httpOptions);
  }


  get(id: number): Observable<IAsiento> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<IAsiento>(URL);
  }

  create(oAsiento: IAsiento): Observable<IAsiento> {
    //hack
    oAsiento.tipoasiento.asientos = [];
    oAsiento.tipoasiento.grupotipoasientos = [];
    
    oAsiento.usuario.asientos = [];

    oAsiento.periodo.asientos = []; 

    oAsiento.apuntes = [];

    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<IAsiento>(URL, oAsiento);
  }

  update(oAsiento: IAsiento): Observable<IAsiento> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<IAsiento>(URL, oAsiento);
  }

  getOne(id: number): Observable<IAsiento> {
    let URL: string = '';
    URL += 'http://localhost:8085';
    URL += '/asiento';
    URL += '/' + id;
    return this.oHttp.get<IAsiento>(URL);
  }

  delete(id: number) {
    return this.oHttp.delete('http://localhost:8085/asiento/' + id);
  }
}
