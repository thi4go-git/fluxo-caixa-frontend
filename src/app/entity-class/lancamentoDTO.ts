export class LancamentoDTO {
    id: number = 0;
    username: string = '';
    tipo: any;
    descricao: string = '';
    data_referencia: Date | undefined;
    valor_total: number = 0;
    qtde_parcelas: number = 0;
    id_natureza: any;
}