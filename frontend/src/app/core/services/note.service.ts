import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note, NoteRequest, MoyenneResponse } from '../models/note.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NoteService {
  private url = `${environment.apiUrl}/notes`;

  constructor(private http: HttpClient) {}

  create(request: NoteRequest): Observable<Note> {
    return this.http.post<Note>(this.url, request);
  }

  findByEtudiant(etudiantId: number): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.url}/etudiant/${etudiantId}`);
  }

  findByEnseignant(enseignantId: number): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.url}/enseignant/${enseignantId}`);
  }

  calculerMoyenne(etudiantId: number, classeId: number): Observable<MoyenneResponse> {
    return this.http.get<MoyenneResponse>(
      `${this.url}/moyenne/etudiant/${etudiantId}/classe/${classeId}`,
    );
  }

  update(id: number, request: NoteRequest): Observable<Note> {
    return this.http.put<Note>(`${this.url}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
