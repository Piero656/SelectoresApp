import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, switchMap, tap } from 'rxjs';
import { Pais } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.formBuilder.group({
    region: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    frontera: ['', [Validators.required]],
  })

  //llegar los selectores
  continentes: string[] = [];
  paises: Pais[] = [];
  //fronteras: string[] = [];
  fronteras: Pais[] = [];

  cargando: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private paisesService: PaisesService
  ) { }

  ngOnInit(): void {

    this.continentes = this.paisesService.continentes;

    //cuando cambie la region

    // this.miFormulario.get('region')?.valueChanges
    //   .subscribe(region => {
    //     console.log(region);

    //     this.paisesService.getPaisesPorRegion(region)
    //         .subscribe(paises => {
    //           console.log(paises);
    //           this.paises = paises;
    //         })

    //   });


    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.miFormulario.get('pais')?.reset('');
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        console.log(paises);
        this.paises = paises;
        this.cargando = false;

      })


    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(pais => { 
          console.log(pais); 
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;

         }),
        switchMap(pais => this.paisesService.getPaisPorCogido(pais)),
        switchMap(pais => {
            if (pais) {
  
              return this.paisesService.getPaisesPorCodigo(pais[0].borders);
            }
            return of([]);
          }
        )
      )
      .subscribe(paises => {

        if (paises) {
          this.fronteras = paises;
          console.log(paises);
        }

        this.cargando = false;

      })



  }

  guardar() {
    console.log(this.miFormulario.value);
  }

}
