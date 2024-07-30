import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Quote } from './Quote';
import { MessageService } from './message.service';



@Injectable({ providedIn: 'root' })
export class QuoteService {

  private quoteUrl = 'api/recentQuotes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET all quotes from the server */
  getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.quoteUrl)
      .pipe(
        tap(_ => this.log('fetched quotes')),
        catchError(this.handleError<Quote[]>('getQuotes', []))
      );
  }

  //GET all quotes whose line of business match the line of business ID
  getQuotesByLineOfBusiness(lineOfBusiness:number): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${this.quoteUrl}/?lineOfBusiness=${lineOfBusiness}`)
    .pipe(
        tap (x => x.length ?
            this.log(`found quotes matching lineOfBusiness ${lineOfBusiness}`) :
            this.log(`no quotes for line of business ${lineOfBusiness}`)
        ),
        catchError(this.handleError<Quote[]>('getQuotesByLineOfBusiness', []))
    );
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a QuoteService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`QuoteService: ${message}`);
  }
}
