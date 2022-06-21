import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Acao, AcoesAPI } from './modelo/acoes';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AcoesService {
  constructor(private httpClient: HttpClient) {}

  getAcoes(filtro?: string) {
    const params = filtro
      ? new HttpParams().append('valor', filtro)
      : undefined;
    return this.httpClient
      .get<AcoesAPI>(`${environment.api}/acoes`, { params })
      .pipe(
        tap((valor) => console.log(valor)),
        map((api) =>
          api.payload.sort((acaoA, acaoB) => this.ordenaPorCodigo(acaoA, acaoB))
        )
      );
  }

  private ordenaPorCodigo(acaoA: Acao, acaoB: Acao): number {
    return acaoA.codigo > acaoB.codigo ? 1 : -1;
  }
}
