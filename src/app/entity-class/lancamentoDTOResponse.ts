import { NaturezaDTO } from "./naturezaDTO";

export class LancamentoDTOResponse {
    selecionado: boolean = false;
    id: number = 0;
    tipo: any;
    descricao: string = '';
    valor_parcela: number = 0;
    qtde_parcelas: number = 0;
    data_lancamento: any;
    nr_parcela: number = 0;
    situacao: any;
    natureza: NaturezaDTO = new NaturezaDTO();
    data_criacao: any;
    data_alteracao: any;
    nomeAnexo: string = '';
}