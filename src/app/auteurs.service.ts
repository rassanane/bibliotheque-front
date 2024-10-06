import { Injectable } from '@angular/core';
import { Auteur } from './auteur';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { map } from 'rxjs/operators';

@Injectable({
   providedIn: 'root'
})

export class AuteursService {

  private auteursRestUrl = 'http://localhost:8080/api/auteurs';

  private httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json'
        //,
                                  //'Access-Control-Allow-Origin':'*',
                                  //'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                                  //'Authorization': 'Basic ' + btoa('rachid:rachid123')
                                 })
  };

  constructor(private httpClient : HttpClient) { } 

  private httpErrorHandler (error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
       console.error("Erreur côté client : " + error.message);
    } else {
       console.error("Erreur côté serveur. Le code de l'erreur : "  + error.status + " et l'erreur retournée : " + error.message);
    }

    return throwError("Erreur lors de l'appel du service");
  }

  getAuteurs() {
    return this.httpClient.get<Auteur[]>(this.auteursRestUrl, this.httpOptions)
    .pipe(
        retry(3),
        catchError(this.httpErrorHandler)
    );
   }

   getAuteur(id: number){
    return this.httpClient.get<Auteur>(this.auteursRestUrl + "/" + id, this.httpOptions)
    .pipe(
        retry(3),
        catchError(this.httpErrorHandler)
    );
  }

  ajoutAuteur(auteur: Auteur) : Observable<Auteur> {
    return this.httpClient.post<Auteur>(this.auteursRestUrl+"/ajout", auteur, this.httpOptions)
    .pipe(
        retry(3),
        catchError(this.httpErrorHandler)
    );
  }

  majAuteur(auteur: Auteur): Observable<Auteur> {
    return this.httpClient.put<Auteur>(this.auteursRestUrl + "/modification" , auteur, this.httpOptions)
    .pipe(
        retry(3),
        catchError(this.httpErrorHandler)
    );
  }

  supprimeAuteur(auteur: Auteur | number) : Observable<Auteur> {
    const id = typeof auteur == 'number' ? auteur : auteur.id
    const url = `${this.auteursRestUrl}/suppression/${id}`;
    return this.httpClient.delete<Auteur>(url, this.httpOptions);
  }

}