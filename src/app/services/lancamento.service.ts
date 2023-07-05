import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiEnvironment } from 'src/environments/apiEnvironment';
import { Observable } from 'rxjs';
import { LancamentoDataDTO } from '../entity-class/lancamentoDataDTO';
import { LancamentoDTO } from '../entity-class/lancamentoDTO';
import { DashboardDTO } from '../entity-class/dashboardDTO';
import { AutenticacaoService } from './autenticacao.service';
import { NaturezaDTO } from '../entity-class/naturezaDTO';
import { Natureza } from '../entity-class/natureza';
import { LancamentoFilterDTO } from '../entity-class/lancamentoFilterDTO';



@Injectable({ providedIn: 'root' })
export class LancamentoService {


  username: string = "";

  apiUrl: string = apiEnvironment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AutenticacaoService
  ) {
    this.username = this.authService.getUsuarioAutenticado();
  }

  save(lancamento: LancamentoDTO): Observable<LancamentoDTO> {
    return this.http.post<LancamentoDTO>(this.apiUrl + '/lancamentos', lancamento);
  }


  finByIdUserDataMesAtual(): Observable<LancamentoDataDTO> {
    const params = new HttpParams()
      .set('username', this.username);
    return this.http.get<LancamentoDataDTO>(this.apiUrl + '/lancamentos', { params });
  }

  finByIdUserDataPersonaliozada(
    inicio: any, fim: any): Observable<LancamentoDataDTO> {
    const params = new HttpParams()
      .set('inicio', inicio)
      .set('fim', fim)
      .set('username', this.username);
    return this.http.get<LancamentoDataDTO>
      (this.apiUrl + '/lancamentos', { params });
  }

  finByIdUserDataFilter(lancamentoFilter: LancamentoFilterDTO): Observable<LancamentoDataDTO> {
    const params = new HttpParams()
      .set('inicio', lancamentoFilter.data_inicio)
      .set('fim', lancamentoFilter.data_fim);
    lancamentoFilter.username = this.username;
    return this.http.post<LancamentoDataDTO>(this.apiUrl + '/lancamentos/filter',
      lancamentoFilter, { params });
  }

  getNaturezasByUsername(): Observable<NaturezaDTO[]> {
    const params = new HttpParams()
      .set('username', this.username);
    return this.http.get<NaturezaDTO[]>(this.apiUrl + '/naturezas', { params });
  }

  findAllSituacao(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/lancamentos/situacao');
  }

  findAllTipo(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/lancamentos/tipo');
  }

  getLancamentosDashboard(): Observable<DashboardDTO> {
    const params = new HttpParams()
      .set('username', this.username);
    return this.http.get<DashboardDTO>(this.apiUrl + '/lancamentos/dashboard', { params });
  }


  saveNatureza(natureza: Natureza): Observable<NaturezaDTO> {
    return this.http.post<NaturezaDTO>(this.apiUrl + '/naturezas', natureza);
  }

  deletarporLancamentoId(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + "/lancamentos/" + id);
  }

}
