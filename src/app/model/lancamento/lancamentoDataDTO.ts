import { LancamentoDTOResponse } from "./lancamentoDTOResponse";

export class LancamentoDataDTO {
    dataInicio: any;
    dataFim: any;
    totalLancamentos: number = 0;
    lancamentos: LancamentoDTOResponse[] = [];
}