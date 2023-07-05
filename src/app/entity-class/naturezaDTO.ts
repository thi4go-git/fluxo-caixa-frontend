import { UsuarioDTO } from "./usuarioDTO";

export class NaturezaDTO {
    id: number = 0;
    descricao: string = '';
    usuario: UsuarioDTO = new UsuarioDTO();
}