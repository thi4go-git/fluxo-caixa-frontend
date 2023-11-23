import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mesStr' })
export class MesStrPipe implements PipeTransform {
    transform(value: number | string): string {
        let dataStr = value.toString();//yyyy-MM-dd
        let anoNum: number = parseInt(dataStr.substring(0, 4));
        let mesNum: number = parseInt(dataStr.substring(5, 7));
        let mesExtenso: string = '';

        switch (mesNum) {
            case 1:
                mesExtenso = 'JANEIRO';
                break;
            case 2:
                mesExtenso = 'FEVEREIRO';
                break;
            case 3:
                mesExtenso = 'MARÇO';
                break;
            case 4:
                mesExtenso = 'ABRIL';
                break;
            case 5:
                mesExtenso = 'MAIO';
                break;
            case 6:
                mesExtenso = 'JUNHO';
                break;
            case 7:
                mesExtenso = 'JULHO';
                break;
            case 8:
                mesExtenso = 'AGOSTO';
                break;
            case 9:
                mesExtenso = 'SETEMBRO';
                break;
            case 10:
                mesExtenso = 'OUTUBRO';
                break;
            case 11:
                mesExtenso = 'NOVEMBRO';
                break;
            case 12:
                mesExtenso = 'DEZEMBRO';
                break;
            default:
                mesExtenso = 'DESCONHECIDO';
        }

        return `${mesExtenso} de ${anoNum}`;
    }
}