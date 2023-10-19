import { LancamentoDashboardDTO } from "./lancamentoDashboardDTO";

export class DashboardDTO {
    lancamentos: LancamentoDashboardDTO[] = [];
    sumEntradas: number = 0;
    sumSaidas: number = 0;
    ano: number = 0;
}