import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiEnvironment } from 'src/environments/apiEnvironment';
import { Observable } from 'rxjs';
import { LancamentoDataDTO } from '../model/lancamento/lancamentoDataDTO';
import { DashboardDTO } from '../model/lancamento/dashboardDTO';
import { AutenticacaoService } from './autenticacao.service';
import { Natureza } from '../model/natureza/natureza';
import { LancamentoFilterDTO } from '../model/lancamento/lancamentoFilterDTO';
import { AnexoDownloaDTO } from '../model/anexoDownloaDTO';
import { LancamentoNewDTO } from '../model/lancamento/lancamentoNewDTO';
import { NaturezaNewDTO } from '../model/natureza/naturezaNewDTO';
import { LancamentoDTOResponse } from '../model/lancamento/lancamentoDTOResponse';
import { LancamentoUpdateDTO } from '../model/lancamento/lancamentoUpdateDTO';



@Injectable({ providedIn: 'root' })
export class LancamentoService {


  private username: string = "";
  private apiUrl: string = apiEnvironment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AutenticacaoService
  ) {
    this.username = this.authService.getUsuarioAutenticado();
  }

  save(lancamento: LancamentoNewDTO): Observable<LancamentoNewDTO> {
    return this.http.post<LancamentoNewDTO>(this.apiUrl + '/lancamentos', lancamento);
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
      .set('inicio', lancamentoFilter.dataInicio)
      .set('fim', lancamentoFilter.dataFim);
    lancamentoFilter.username = this.username;
    return this.http.post<LancamentoDataDTO>(this.apiUrl + '/lancamentos/filter',
      lancamentoFilter, { params });
  }

  getNaturezasByUsername(): Observable<NaturezaNewDTO[]> {
    const params = new HttpParams()
      .set('username', this.username);
    return this.http.get<NaturezaNewDTO[]>(this.apiUrl + '/naturezas', { params });
  }

  findAllSituacao(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/lancamentos/situacao');
  }

  findAllTipo(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/lancamentos/tipo');
  }

  findAllOrigem(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/lancamentos/origem');
  }

  getLancamentosDashboard(): Observable<DashboardDTO> {
    const params = new HttpParams()
      .set('username', this.username);
    return this.http.get<DashboardDTO>(this.apiUrl + '/lancamentos/dashboard', { params });
  }

  saveNatureza(natureza: Natureza): Observable<NaturezaNewDTO> {
    return this.http.post<NaturezaNewDTO>(this.apiUrl + '/naturezas', natureza);
  }

  deletarNaturezaPorId(natureza: Natureza): Observable<any> {
    const params = new HttpParams()
      .set('username', this.username)
      .set('descricaoNatureza', natureza.descricao);
    return this.http.delete<any>(this.apiUrl + '/naturezas', { params });
  }

  deletarporLancamentoId(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + "/lancamentos/" + id);
  }

  operacaoPersonalizada(listaIdSelecionados: string[], tipoOperacao: number): Observable<any> {
    const params = new HttpParams()
      .set('username', this.username)
      .set('tipoOperacao', tipoOperacao);
    return this.http.post<any>(this.apiUrl + "/lancamentos/operacao-personalizada", listaIdSelecionados, { params });
  }

  uploadFile(formData: FormData, id: number): Observable<any> {
    return this.http.post(this.apiUrl + `/lancamentos/${id}/upload`, formData, { responseType: 'blob' });
  }

  baixarAnexoByIdLancamento(id: number): Observable<AnexoDownloaDTO> {
    return this.http.get<AnexoDownloaDTO>(this.apiUrl + `/lancamentos/${id}/download`);
  }

  getLancamentoById(id: number): Observable<LancamentoDTOResponse> {
    return this.http.get<any>(this.apiUrl + "/lancamentos/" + id);
  }

  update(lancamentoUpdate: LancamentoUpdateDTO): Observable<LancamentoUpdateDTO> {
    lancamentoUpdate.username = this.username;
    return this.http.put<LancamentoUpdateDTO>(this.apiUrl + '/lancamentos', lancamentoUpdate);
  }
}
