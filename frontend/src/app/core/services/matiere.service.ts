import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Matiere, MatiereRequest } from '../models/matiere.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MatiereService {
  private url = `${environment.apiUrl}/matieres`;

  constructor(private http: HttpClient) {}

  create(request: MatiereRequest): Observable<Matiere> {
    return this.http.post<Matiere>(this.url, request);
  }

  findByClasse(classeId: number): Observable<Matiere[]> {
    return this.http.get<Matiere[]>(`${this.url}/classe/${classeId}`);
  }

  findByClasseAndSemestre(classeId: number, semestre: number): Observable<Matiere[]> {
    return this.http.get<Matiere[]>(`${this.url}/classe/${classeId}/semestre/${semestre}`);
  }

  findById(id: number): Observable<Matiere> {
    return this.http.get<Matiere>(`${this.url}/${id}`);
  }

  update(id: number, request: MatiereRequest): Observable<Matiere> {
    return this.http.put<Matiere>(`${this.url}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
