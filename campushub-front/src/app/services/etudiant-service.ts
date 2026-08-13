
import { inject, Injectable } from '@angular/core';
import { Etudiant } from '../model/etudiant.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../model/page-response.model';
import { EtudiantRequest, EtudiantResponse } from '../model/etudiant-api.interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' }) // @Service aussi marche
export class EtudiantService {
  private apiUrl = `${environment.apiUrl}/etudiants`;
  private http = inject(HttpClient);

  getById(id: number): Observable<EtudiantResponse> {
    return this.http.get<EtudiantResponse>(`${this.apiUrl}/${id}`);
  }

  create(etudiant: EtudiantRequest): Observable<EtudiantResponse> {
    return this.http.post<EtudiantResponse>(this.apiUrl, etudiant);
  }

  getAll(page: number = 0, size: number = 10): Observable<PageResponse<Etudiant>> {
    return this.http.get<PageResponse<Etudiant>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  update(id: number, etudiant: EtudiantRequest): Observable<EtudiantResponse> {
  return this.http.put<EtudiantResponse>(`${this.apiUrl}/${id}`, etudiant);
  }
}






