import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classe, ClasseRequest } from '../models/classe.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClasseService {
  private url = `${environment.apiUrl}/classes`;

  constructor(private http: HttpClient) {}

  create(request: ClasseRequest): Observable<Classe> {
    return this.http.post<Classe>(this.url, request);
  }

  findAll(): Observable<Classe[]> {
    return this.http.get<Classe[]>(this.url);
  }

  findById(id: number): Observable<Classe> {
    return this.http.get<Classe>(`${this.url}/${id}`);
  }

  findByEnseignant(enseignantId: number): Observable<Classe[]> {
    return this.http.get<Classe[]>(`${this.url}/enseignant/${enseignantId}`);
  }

  findByEtudiant(etudiantId: number): Observable<Classe[]> {
    return this.http.get<Classe[]>(`${this.url}/etudiant/${etudiantId}`);
  }

  update(id: number, request: ClasseRequest): Observable<Classe> {
    return this.http.put<Classe>(`${this.url}/${id}`, request);
  }

  ajouterEnseignant(classeId: number, enseignantId: number): Observable<Classe> {
    return this.http.post<Classe>(`${this.url}/${classeId}/enseignants/${enseignantId}`, {});
  }

  ajouterEtudiant(classeId: number, etudiantId: number): Observable<Classe> {
    return this.http.post<Classe>(`${this.url}/${classeId}/etudiants/${etudiantId}`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
