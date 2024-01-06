export class LancamentoNewDTO {
    id: number = 0;
    username: string = '';
    tipo: any;
    origem: any;
    descricao: string = '';
    dataReferencia: Date | undefined;
    valorTotal: number = 0;
    qtdeParcelas: number = 1;
    idNatureza: any;
}