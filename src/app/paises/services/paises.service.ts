import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, Country } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl: string = 'https://restcountries.com/v3.1';

  private _continentes: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get continentes(): string[] {
    return [...this._continentes]
  }

  constructor(
    private http: HttpClient
  ) { }

  getPaisesPorRegion(region :string) : Observable<Pais[]> {
    const url:string = `${this._baseUrl}/region/${region}?fields=cca3,name`;
    return this.http.get<Pais[]>(url);

  }

  getPaisPorCogido(codigo:string) :Observable<Country[] | null> {

    if(!codigo){
      return of(null)
    }

    const url:string = `${this._baseUrl}/alpha/${codigo}`;
    return this.http.get<Country[]>(url);
  }

  getPaisPorCogidoSmall(codigo:string) :Observable<Pais> {


    const url:string = `${this._baseUrl}/alpha/${codigo}?fields=name,cca3`;
    return this.http.get<Pais>(url);
  }


  getPaisesPorCodigo(borders :string[]) :Observable<Pais[]> {

    if(!borders){
      return of([])
    }

    const peticiones : Observable<Pais>[] =  [];

    borders.forEach( codigo => {
      const peticion = this.getPaisPorCogidoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest( peticiones );
    
  }


}
