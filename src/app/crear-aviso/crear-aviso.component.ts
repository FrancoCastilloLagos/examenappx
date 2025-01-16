import { Component, EventEmitter, NgZone, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-aviso',
  standalone: true,
  imports: [IonicModule, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './crear-aviso.component.html',
  styleUrls: ['./crear-aviso.component.scss'],
})
export class CrearAvisoComponent {
  @Output() avisoGuardado = new EventEmitter<any>(); 

  avisoForm: FormGroup;
  fotoUrl: string | null = null;
  mensajeFoto: string = '';
  formSubmitted = false;

  requisitosMensaje = [
    'El título es obligatorio y debe tener al menos 5 caracteres.',
    'La descripción es obligatoria y debe tener al menos 20 caracteres.',
  ];

  constructor(private fb: FormBuilder, private ngZone: NgZone) {
    this.avisoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  async tomarFoto() {
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.ngZone.run(() => {
            this.fotoUrl = reader.result as string;
            this.mensajeFoto = 'Foto cargada correctamente.';
          });
        };
        reader.readAsDataURL(file);
      } else {
        this.ngZone.run(() => {
          this.mensajeFoto = 'No se seleccionó ninguna foto.';
        });
      }
    });

    input.click();
  }

  async guardarAviso() {
    this.formSubmitted = true;
    if (this.avisoForm.valid) {
      const nuevoAviso = {
        ...this.avisoForm.value,
        fecha: new Date().toISOString(),
        fotoUrl: this.fotoUrl,
      };

      const { value } = await Preferences.get({ key: 'avisos' });
      const avisos = value ? JSON.parse(value) : [];

      avisos.push(nuevoAviso);
      await Preferences.set({ key: 'avisos', value: JSON.stringify(avisos) });

      this.avisoForm.reset();
      this.fotoUrl = null;
      this.mensajeFoto = 'Aviso guardado correctamente.';
      this.avisoGuardado.emit(nuevoAviso); 
    } else {
      this.mensajeFoto = 'Formulario no válido. Verifica los datos ingresados.';
    }
  }
}
