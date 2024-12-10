import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CuentaService } from '../../../service/cuenta.service';
import { ICuenta } from '../../../model/cuenta.interface';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TipoCuentaService } from '../../../service/tipoCuenta.service';
import { ITipocuenta } from '../../../model/tipocuenta.interface';
import { MatDialog } from '@angular/material/dialog';
import { TipocuentaAdminSelectorUnroutedComponent } from '../../tipocuenta/tipocuenta.admin.selector.unrouted/tipocuenta.admin.selector.unrouted.component';

declare let bootstrap: any;

@Component({
  selector: 'app-cuenta-admin-edit-routed',
  templateUrl: './cuenta.admin.edit.routed.component.html',
  styleUrls: ['./cuenta.admin.edit.routed.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})

export class CuentaAdminEditRoutedComponent implements OnInit {
  id: number = 0;
  oCuentaForm: FormGroup | undefined = undefined;
  oCuenta: ICuenta | null = null;
  strMessage: string = '';
  myModal: any;
  readonly dialog = inject(MatDialog);
  oTipocuenta: ITipocuenta = {} as ITipocuenta;

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oCuentaService: CuentaService,
    private oRouter: Router,
    private oTipocuentaService: TipoCuentaService
  ) {
    this.oActivatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.createForm();
    this.get();
    this.oCuentaForm?.markAllAsTouched();

    this.oCuentaForm?.controls['tipocuenta'].valueChanges.subscribe(change => {
      if (change) {
        if (change.id) {
          // obtener el objeto tipocuenta del servidor
          this.oTipocuentaService.get(change.id).subscribe({
            next: (oTipocuenta: ITipocuenta) => {
              this.oTipocuenta = oTipocuenta;
            },
            error: (err) => {
              console.log(err);
              this.oTipocuenta = {} as ITipocuenta;
              // marcar el campo como inválido
              this.oCuentaForm?.controls['tipocuenta'].setErrors({
                invalid: true,
              });
            }
          });
        } else {
          this.oTipocuenta = {} as ITipocuenta;
        }
      }
    });

  }

  createForm() {
    this.oCuentaForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      codigo: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(40),
      ]),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      tipocuenta: new FormGroup({
        id: new FormControl('', Validators.required), // ID de tipocuenta
        descripcion: new FormControl(''), // Descripción de tipocuenta
        creditoodebito: new FormControl(''), // Crédito o débito de tipocuenta
        comentarios: new FormControl(''), // Comentarios de tipocuenta
        realonominal: new FormControl(''), // Real o nominal de tipocuenta
        cuentas: new FormControl([]), // Cuentas de tipocuenta
        grupotipocuentas: new FormControl([]), // Grupo de tipocuentas de tipocuenta
      }),
    });
  }

  onReset() {
    this.oCuentaService.get(this.id).subscribe({
      next: (oCuenta: ICuenta) => {
        this.oCuenta = oCuenta;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
    return false;
  }

  updateForm() {
    this.oCuentaForm?.controls['id'].setValue(this.oCuenta?.id);
    this.oCuentaForm?.controls['codigo'].setValue(this.oCuenta?.codigo);
    this.oCuentaForm?.controls['descripcion'].setValue(
      this.oCuenta?.descripcion
    );
    this.oCuentaForm?.controls['tipocuenta'].setValue({
      id: this.oCuenta?.tipocuenta?.id,
      descripcion: this.oCuenta?.tipocuenta?.descripcion,
      creditoodebito: this.oCuenta?.tipocuenta?.creditoodebito,
      comentarios: this.oCuenta?.tipocuenta?.comentarios,
      realonominal: this.oCuenta?.tipocuenta?.realonominal,
      cuentas: null,
      grupotipocuentas: null
    });
  }

  get() {
    this.oCuentaService.get(this.id).subscribe({
      next: (oCuenta: ICuenta) => {
        this.oCuenta = oCuenta;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
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
    this.oRouter.navigate(['/admin/cuenta/view/' + this.oCuenta?.id]);
  };

  onSubmit() {
    if (!this.oCuentaForm?.valid) {
      this.showModal('Formulario no válido');
      return;
    } else {
      this.oCuentaService.update(this.oCuentaForm?.value).subscribe({
        next: (oCuenta: ICuenta) => {
          this.oCuenta = oCuenta;
          this.updateForm();
          this.showModal('Cuenta ' + this.oCuenta.id + ' actualizada');
        },
        error: (error) => {
          this.showModal('Error al actualizar la cuenta');
          console.error(error);
        },
      });
    }
  }

  showTipocuentaSelectorModal() {
    const dialogRef = this.dialog.open(TipocuentaAdminSelectorUnroutedComponent, {
      height: '800px',
      maxHeight: '1200px',
      width: '80%',
      maxWidth: '90%',

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log(result);
        this.oCuentaForm?.controls['tipocuenta'].setValue(result);
        this.oTipocuenta = result;
        //this.animal.set(result);
      }
    });
    return false;
  }


}
