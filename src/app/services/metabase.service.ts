import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiEnvironment } from 'src/environments/apiEnvironment';
import { MetabaseEmbedResponseDTO } from '../model/metabase/metabaseEmbedResponseDTO';



@Injectable({providedIn: 'root'})
export class MetabaseService {

  private apiUrl: string = apiEnvironment.apiUrl;

  constructor(
    private http: HttpClient
  ) {
  }

  getDashboardToken(): Observable<MetabaseEmbedResponseDTO> {
    return this.http.get<MetabaseEmbedResponseDTO>(this.apiUrl + '/metabase/dashboard-url-token');
  }
  
}
