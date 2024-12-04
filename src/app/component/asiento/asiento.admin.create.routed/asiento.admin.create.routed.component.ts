import { Component,inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormGroup,  
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IAsiento } from '../../../model/asiento.interface';
import { AsientoService } from '../../../service/asiento.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { CalendarModule } from 'primeng/calendar';
import { CALENDAR_ES } from '../../../environment/environment';
import { PrimeNGConfig } from 'primeng/api';
import { ITipoasiento } from '../../../model/tipoasiento.interface';
import { TipoAsientoService } from '../../../service/tipoAsiento.service';
import { TipoasientoAdminSelectorUnroutedComponent } from '../../tipoasiento/tipoasiento.admin.selector.unrouted/tipoasiento.admin.selector.unrouted.component';

declare let bootstrap: any;

@Component({
  standalone: true,
  selector: 'app-asiento.admin.create.routed',
  templateUrl: './asiento.admin.create.routed.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    RouterModule,
    CalendarModule,
  ],
  styleUrls: ['./asiento.admin.create.routed.component.css'],
})
export class AsientoAdminCreateRoutedComponent implements OnInit {

  id: number = 0;
  oAsientoForm: FormGroup | undefined = undefined;
  oAsiento: IAsiento | null = null;
  strMessage: string = '';
  checkboxValue: number = 0;  // Inicia con 0

  myModal: any;

  form: FormGroup = new FormGroup({});

  readonly dialog = inject(MatDialog);
  oTipoasiento: ITipoasiento = {} as ITipoasiento;

  constructor(
    private oAsientoService: AsientoService,
    private oRouter: Router,
    private oPrimeconfig: PrimeNGConfig,
    private oTipoasientoService: TipoAsientoService
  ) {}

  ngOnInit() {
    this.createForm();
    this.oAsientoForm?.markAllAsTouched();
    this.oPrimeconfig.setTranslation(CALENDAR_ES);

    this.oAsientoForm?.controls['tipoasiento'].valueChanges.subscribe(change => {
      if (change.id) {
        // obtener el objeto tipocuenta del servidor
        this.oTipoasientoService.get(change.id).subscribe({
          next: (oTipoasiento: ITipoasiento) => {
            this.oTipoasiento = oTipoasiento;
          },
          error: (err) => {
            console.log(err);
            this.oTipoasiento = {} as ITipoasiento;
            // marcar el campo como inválido
            this.oAsientoForm?.controls['tipoasiento'].setErrors({
              invalid: true,
            });
          }
        });
      } else {
        this.oTipoasiento = {} as ITipoasiento;
      }
    });
  }

  createForm() {
    this.oAsientoForm = new FormGroup({
      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(255),
      ]),
      comentarios: new FormControl('', [
        Validators.minLength(0),
        Validators.maxLength(255),
      ]),
      inventariable: new FormControl(''),
      momentstamp: new FormControl('', [
        Validators.required
      ]),
      //tipoasiento: new FormControl('',[Validators.required]),
      tipoasiento: new FormControl({
        id: new FormControl('', Validators.required),
        descripcion: new FormControl(''),
        asientos: new FormControl([]),
        grupotipoasientos: new FormControl([])
      }),
      //usuario: new FormControl('',[Validators.required]),
      usuario: new FormControl({
        id: new FormControl('', Validators.required),
        nombre: new FormControl(''),
        apellido1: new FormControl(''),
        apellido2: new FormControl(''),
        email: new FormControl(''),
        tipousuario: new FormControl(''),
        asientos: new FormControl([])
      }),
      //periodo: new FormControl('',[Validators.required]),
      periodo: new FormControl({
        id: new FormControl('', Validators.required),
        anyo: new FormControl(''),
        descripcion: new FormControl(''),
        comentarios: new FormControl(''),
        cerrado: new FormControl(''),
        asientos: new FormControl([]),
      })

    });
  }

  updateForm() {
    this.oAsientoForm?.controls['descripcion'].setValue('');
    this.oAsientoForm?.controls['comentarios'].setValue('');
    this.oAsientoForm?.controls['inventariable'].setValue('');
    this.oAsientoForm?.controls['momentstamp'].setValue('');
    this.oAsientoForm?.controls['tipoasiento'].setValue({
      id: null,
      descripcion:  null,
      asientos: null,
      grupotipoasientos:  null,
    });
    this.oAsientoForm?.controls['usuario'].setValue({
        id:  null,
        nombre:  null,
        apellido1: null,
        apellido2:  null,
        email:  null,
        tipousuario:  null,
        asientos:  null,
    });
    this.oAsientoForm?.controls['periodo'].setValue({
        id:  null,
        anyo:  null,
        descripcion: null, 
        comentarios:  null,
        cerrado:  null,
        asientos: null,
    });
  }

  onCheckboxChange(event: any): void {
    this.checkboxValue = event.checked ? 1 : 0;
  }

  onReset() {
    this.updateForm();
    return false;
  }

  showModal(mensaje: string) {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  hideModal = () => {
    this.myModal.hide();
    if(this.oAsiento?.id){
      this.oRouter.navigate(['/admin/asiento/view/' + this.oAsiento?.id]);
    }
  }

  onSubmit() {
    if (this.oAsientoForm?.invalid) {
      this.showModal('Formulario inválido');
      return;
    } else {      
      this.oAsientoService.create(this.oAsientoForm?.value).subscribe({
        next: (oAsiento: IAsiento) => {
          this.oAsiento = oAsiento;
          this.showModal('Asiento creado con el id: ' + this.oAsiento.id);
        },
        error: (err) => {
          this.showModal('Error al crear el asiento');
          console.log(err);
        },
      });
    }
  }

  showTipoasientoSelectorModal() {
    const dialogRef = this.dialog.open(TipoasientoAdminSelectorUnroutedComponent, {
      height: '800px',
      maxHeight: '1200px',
      width: '80%',
      maxWidth: '90%',

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log(result);
        this.oAsientoForm?.controls['tipoasiento'].setValue(result.id);
        this.oTipoasiento = result;
      }
    });

    return false;
  }


}
