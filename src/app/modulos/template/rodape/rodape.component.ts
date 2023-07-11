import { Component } from '@angular/core';
import { apiEnvironment } from 'src/environments/apiEnvironment';

@Component({
  selector: 'app-rodape',
  templateUrl: './rodape.component.html',
  styleUrls: ['./rodape.component.css']
})
export class RodapeComponent {

  swaggerApi = apiEnvironment.apiUrl+'/docs';

}
