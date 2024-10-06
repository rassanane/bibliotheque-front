import { Injectable } from '@angular/core';
import { Livre } from './livre';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
   providedIn: 'root'
})

export class LivresService {

  private livresRestUrl = 'http://localhost:8080/api/livres';

  private httpOptions = {
    headers: new HttpHeaders( { 'Content-Type': 'application/json'
      //,
                                //'Access-Control-Allow-Origin':'*',
                                //'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                                //'Authorization': 'Basic ' + btoa('rachid:rachid123')
                               })
};
private httpOptions2 = {
  headers: new HttpHeaders( { 'Content-Type': 'application/text'
    //,
                              //'Access-Control-Allow-Origin':'*',
                              //'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                              //'Authorization': 'Basic ' + btoa('rachid:rachid123')
                             })
};

  constructor(private httpClient : HttpClient) { } 

  private httpErrorHandler (error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
       console.error("Erreur coté client : " + error.message);
    } else {
       console.error("Erreur coté serveur. Le statut est "  + error.status + " et l'erreur est " + error.message);
    }

    return throwError("Erreur, merci de réessayer");
  }

  getLivres() {
    return this.httpClient.get<Livre[]>(this.livresRestUrl, this.httpOptions)
    .pipe(
        retry(3),
        catchError(this.httpErrorHandler)
    );
   }

   getLivre(id: number){
    return this.httpClient.get<Livre>(this.livresRestUrl + "/" + id, this.httpOptions)
    .pipe(
        retry(3),
        catchError(this.httpErrorHandler)
    );
  }

  /*getNomAuteurLivre(id: number){
    return this.httpClient.get<string>(this.livresRestUrl + "/nomauteurparid/" + id, this.httpOptions2)
    .pipe(
        retry(3),
        catchError(this.httpErrorHandler)
    );
  }*/

  ajoutLivre(livre: Livre) : Observable<Livre> {
    return this.httpClient.post<Livre>(this.livresRestUrl+"/ajout", livre, this.httpOptions)
    .pipe(
        retry(3),
        catchError(this.httpErrorHandler)
    );
  }

  majLivre(livre: Livre): Observable<Livre> {
    return this.httpClient.put<Livre>(this.livresRestUrl + "/modification" , livre, this.httpOptions)
    .pipe(
        retry(3),
        catchError(this.httpErrorHandler)
    );
  }

  supprimeLivre(livre: Livre | number) : Observable<Livre> {
    const id = typeof livre == 'number' ? livre : livre.id
    const url = `${this.livresRestUrl}/suppression/${id}`;
    return this.httpClient.delete<Livre>(url, this.httpOptions);
  }

  selectTitreParId(id: number) : Observable<String> {
    return this.httpClient.get<String>(this.livresRestUrl+"/nomparidt/" + id, this.httpOptions)
    .pipe(
        retry(3),
        catchError(this.httpErrorHandler)
    );
  }

}