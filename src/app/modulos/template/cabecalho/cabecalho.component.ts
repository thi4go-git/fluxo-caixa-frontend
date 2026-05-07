import { Component } from '@angular/core';

@Component({
  selector: 'app-cabecalho',
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.css']
})
export class CabecalhoComponent {

  alternarMenu(event: Event): void {
    event.preventDefault();
    document.body.classList.toggle('sb-sidenav-toggled');
  }

}
