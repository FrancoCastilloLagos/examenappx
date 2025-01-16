import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FechaPipe } from '../fecha.pipe';

@Component({
  selector: 'app-avisos',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FechaPipe],
  templateUrl: './avisos.component.html',
  styleUrls: ['./avisos.component.scss'],
})
export class AvisosComponent implements OnInit {
  @Input() avisos: any[] = []; 
  @Output() avisoEliminado = new EventEmitter<number>(); 

  constructor(private alertController: AlertController) {}

  async ngOnInit() {
    if (!this.avisos.length) {
      await this.cargarAvisos();
    }
  }

  async cargarAvisos() {
    const { value } = await Preferences.get({ key: 'avisos' });
    this.avisos = value ? JSON.parse(value) : [];
  }

  async confirmarEliminar(avisoIndex: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este aviso?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            this.eliminarAviso(avisoIndex);
          },
        },
      ],
    });

    await alert.present();
  }

  async eliminarAviso(avisoIndex: number) {
    this.avisos.splice(avisoIndex, 1);
    await Preferences.set({ key: 'avisos', value: JSON.stringify(this.avisos) });
    this.avisoEliminado.emit(avisoIndex); 
  }
}
