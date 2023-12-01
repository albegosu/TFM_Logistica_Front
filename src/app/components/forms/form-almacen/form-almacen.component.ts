import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlmacenService } from 'src/app/services/almacen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-almacen',
  templateUrl: './form-almacen.component.html',
  styleUrls: ['./form-almacen.component.css']
})
export class FormAlmacenComponent {

  almacenForm: FormGroup;
  almacenService = inject(AlmacenService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  constructor(){
    this.almacenForm = new FormGroup({
      // idalmacen: new FormControl('', []),
      nombre_almacen: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(40)
      ]),
      long: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(-?\d+(\.\d+)?)$/), // Longitud entre -180 y 180
        Validators.min(-180),
        Validators.max(180)
      ]),
      lat: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(-?\d+(\.\d+)?)$/), // Latitud entre -90 y 90
        Validators.min(-90),
        Validators.max(90)
      ]),
      activo: new FormControl('', [Validators.required]),
      imagen_almacen: new FormControl('', [Validators.required])
    });
  }

  // LÓGICA DEL FORMULARIO EXISTENTE O NUEVO
  ngOnInit(): void {

    this.activatedRoute.params.subscribe(async (params: any) => {
      let idalmacen: number = Number(params.idalmacen);

      if (idalmacen) {
        //PINTAR ALMACEN EXISTENTE
        let response = await this.almacenService.getById(idalmacen);

        this.almacenForm = new FormGroup({
          idalmacen: new FormControl(response.idalmacen, []),
          nombre_almacen: new FormControl(response.nombre_almacen, [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(40)
          ]),
          long: new FormControl(response.long, [
            Validators.required,
            Validators.pattern(/^(-?\d+(\.\d+)?)$/), // Longitud entre -180 y 180
            Validators.min(-180),
            Validators.max(180)
          ]),
          lat: new FormControl(response.lat, [
            Validators.required,
            Validators.pattern(/^(-?\d+(\.\d+)?)$/), // Latitud entre -90 y 90
            Validators.min(-90),
            Validators.max(90)
          ]),
          activo: new FormControl(response.activo, [Validators.required]),
          imagen_almacen: new FormControl(response.imagen_almacen, [
            Validators.required,
            Validators.max(100)
          ])
      })
      }
  });
}

async submitForm(): Promise<void> {
  if (this.almacenForm.value.idalmacen) {
    try {
      await Swal.fire({
        title: '¿Quiere guardar los cambios?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#FFC007',
        confirmButtonText: 'Guardar'
      }).then((result) => {
        if (result.isConfirmed) {
          // ACTUALIZACIÓN ALMACEN
          let response = this.almacenService.updateAlmacen(this.almacenForm.value);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Almacén actualizado correctamente',
            showConfirmButton: false,
            timer: 1500
          });
        }
      })
      this.router.navigate(['/almacenes']);
      console.log(this.almacenForm.value);
    } catch(error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error al actualizar el almacen',
        showConfirmButton: false,
        timer: 1500
      })
    }
  } else {
    try {
      await Swal.fire({
        title: '¿Quiere crear el almacén?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#FFC007',
        confirmButtonText: 'Crear'
      }).then((result) => {
        if (result.isConfirmed) {
          // CREACIÓN NUEVO ALMACEN
          let response = this.almacenService.create(this.almacenForm.value);
          console.log(this.almacenForm.value);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Almacén creado correctamente',
            showConfirmButton: false,
            timer: 1500
          });
        }
      })
      this.router.navigate(['/almacenes']);
    } catch(error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Ha habido un error, inténtelo de nuevo',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }
}

checkControl(formcontrolName: string, validator: string): boolean | undefined {
  return this.almacenForm.get(formcontrolName)?.hasError(validator) && this.almacenForm.get(formcontrolName)?.touched;
}

}
