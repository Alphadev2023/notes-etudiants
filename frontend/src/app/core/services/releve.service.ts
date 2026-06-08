import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Releve } from '../models/releve.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReleveService {
  private url = `${environment.apiUrl}/releves`;

  constructor(private http: HttpClient) {}

  generer(
    etudiantId: number,
    classeId: number,
    semestre: number,
    annee: string,
  ): Observable<Releve> {
    return this.http.post<Releve>(`${this.url}/generer`, null, {
      params: { etudiantId, classeId, semestre, annee },
    });
  }

  findByEtudiant(etudiantId: number): Observable<Releve[]> {
    return this.http.get<Releve[]>(`${this.url}/etudiant/${etudiantId}`);
  }

  findByClasse(classeId: number): Observable<Releve[]> {
    return this.http.get<Releve[]>(`${this.url}/classe/${classeId}`);
  }

  exportPdf(releveId: number): Observable<Blob> {
    return this.http.get(`${this.url}/${releveId}/pdf`, { responseType: 'blob' });
  }

  exportExcel(classeId: number): Observable<Blob> {
    return this.http.get(`${this.url}/classe/${classeId}/excel`, { responseType: 'blob' });
  }
}
