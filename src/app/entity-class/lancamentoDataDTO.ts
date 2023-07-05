import { LancamentoDTOResponse } from "./lancamentoDTOResponse";

export class LancamentoDataDTO {
    data_inicio: any;
    data_fim: any;
    total_lancamentos: number = 0;
    lancamentos: LancamentoDTOResponse[] = [];
}