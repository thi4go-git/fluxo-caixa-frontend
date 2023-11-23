import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'decimal' })
export class DecimalPipe implements PipeTransform {
    transform(value: number | string): string {      
        const originalString = value.toString();
        const parte1 = originalString.substring(0, originalString.length - 2);
        const parte2 = originalString.substring(originalString.length - 2, originalString.length);
        const formatado = parte1 + ',' + parte2;
     
        return formatado;
    }
}