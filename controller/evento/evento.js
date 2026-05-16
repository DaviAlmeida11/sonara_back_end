/******************************************************************************
 * Objetivo: Arquivo responsável pela conexão de cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Almeida Santos
 * Versão: 1.0
*****************************************************************************/

const eventoDAO = require('../../model/DAO/evento.js')

const enderecoEventoDAO = require('../../model/DAO/endereco_evento.js')

const eventoOrganizadorDAO = require('../../model/DAO/evento_organizador.js')

const viewBuscarFotoEventoDAO = require('../../model/DAO/VEWS/evento_fotos.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarEvento = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resultEvento = await eventoDAO.getSelectAllEvent()
        let fotos = await viewBuscarFotoEventoDAO.getSelectAllEventPhoto()
        let organizadores = await eventoOrganizadorDAO.getSelectAllOrganizerEvent()
        
        if(resultEvento){
            if(resultEvento.length > 0){
                MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.HEADER.message     = MESSAGES.SUCCESS_REQUEST.message
                MESSAGES.HEADER.response    = resultEvento.map(evento => ({
                    ...evento,
                    fotos: fotos.filter(foto => foto.id_evento === evento.id_evento),
                    organizadores: organizadores.filter(org => org.evento_id === evento.id_evento)
                }))
        
                return MESSAGES.HEADER
            }else{
                return MESSAGES.ERROR_NOT_FOUND //404
            }
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Retorna um evento filtrando pelo ID
const buscarEventoId = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resultEvento = await eventoDAO.getSelectByIdEvent(Number(id))

            if(resultEvento){
                if(resultEvento.length > 0){
                    let fotos = await viewBuscarFotoEventoDAO.getSelectViewEventPhoto(Number(id))
                    let organizadores = await eventoOrganizadorDAO.getSelectOrganizerEventByIdEvent(Number(id))

                    MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response    = {
                        ...resultEvento[0],
                        fotos: fotos || [],
                        organizadores: organizadores || []
                    }

                    return MESSAGES.HEADER //200
                }else{
                    return MESSAGES.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um evento 
const inserirEvento = async function (evento, contentType) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() !== 'APPLICATION/JSON') {
            return MESSAGES.ERROR_CONTENT_TYPE //415
        }

        // ================= VALIDA EVENTO =================
        let validarEvento = await validarDadosEvento(evento)

        if (validarEvento) {
            return validarEvento //400
        }

        // ================= INSERE EVENTO =================
        let resultEvento = await eventoDAO.setInsertEvent(evento)

        if (!resultEvento) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
        }

        let lastIDEvento = await eventoDAO.getSelectLastID()

        if (!lastIDEvento) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
        }

        evento.id_evento = lastIDEvento.id_evento

        // ================= ENDEREÇO =================
        let enderecoEvento = {
            cep:         evento.cep,
            cidade:      evento.cidade,
            estado:      evento.estado,
            logradouro:  evento.logradouro,
            numero:      evento.numero,
            complemento: evento.complemento,
            bairro:      evento.bairro,
            evento_id:   lastIDEvento.id_evento
        }

        let resultEndereco = await enderecoEventoDAO.setInsertAddressEvent(enderecoEvento)

        if (!resultEndereco) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
        }

        // ================= EVENTO ORGANIZADOR =================
        let eventoOrganizador = {
            evento_id: evento.id_evento,
            organizador_id: evento.organizador_id
        }

        let resultEventoOrg = await eventoOrganizadorDAO.setInsertOrganizerEvent(eventoOrganizador)

        if (!resultEventoOrg) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
        }

        let lastIDOrg = await eventoOrganizadorDAO.getSelectLastID()

        if (!lastIDOrg) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
        }

        eventoOrganizador.id_evento_organizador = lastIDOrg.id_evento_organizador

        // ================= BUSCA FOTOS =================
        let fotos = await viewBuscarFotoEventoDAO.getSelectViewEventPhoto(evento.id_evento)

        if (!fotos) {
            fotos = []
        }

        // ================= RETORNO FINAL =================
        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_CREATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_CREATED_ITEM.message
        MESSAGES.HEADER.response    = {
            evento,
            endereco: enderecoEvento,
            evento_organizador: eventoOrganizador,
            fotos: fotos
        }

        return MESSAGES.HEADER //201

    } catch (error) {
        console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}
//Atualiza um evento buscando pelo ID
const atualizarEvento = async function(evento, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validar todos os dados do evento
                let validar = await validarDadosEvento(evento)

                if(!validar){
                
                    //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                     let validarID = await buscarEventoId(id)

                    if(validarID.status_code == 200){
                        
                        //Adiciona o ID do evento no JSON de dados para ser encaminhado ao DAO
                        evento.id_evento = Number(id)

                        //Chama a função para inserir um novo evento no BD
                        let resultEvento = await eventoDAO.setUpdateEvent(evento)

                        if(resultEvento){
                            MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_UPDATED_ITEM.status
                            MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                            MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_UPDATED_ITEM.message
                            MESSAGES.HEADER.response.evento     =   evento           

                            return MESSAGES.HEADER //200
                        }else{
                            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                        }
                    }else{
                        return validarID //A função buscargeneroID poderá retornar (400 ou 404 ou 500)
                    }    
                }else{
                    return validar //400 referente a validação dos dados
                }
            
        }else{
            return MESSAGES.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}


const excluirEvento = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscarEventoId(id)

            if(validarID.status_code == 200){

                let resultEvento = await eventoDAO.setDeleteEvent(Number(id))

                if(resultEvento){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message

                        return MESSAGES.HEADER 
            
                }else{
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL 
                }
            }else{
                return MESSAGES.ERROR_NOT_FOUND 
            }
        }else{
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID incorreto]' 
            return MESSAGES.ERROR_REQUIRED_FIELDS 
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER 
    }
}

const validarDadosEvento = function (evento) {

    const gerarErro = (campo) => ({
        ...DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS,
        message: `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    });

    // ================= EVENTO =================
    if (!evento.nome || evento.nome.length > 100)
        return gerarErro('nome');

    if (!evento.descricao || evento.descricao.length > 500)
        return gerarErro('descricao');

    if (!evento.local || evento.local.length > 255)
        return gerarErro('local');

    if (!evento.data || evento.data.length > 20)
        return gerarErro('data');

    if (!evento.hora_inicio || evento.hora_inicio.length > 20)
        return gerarErro('hora_inicio');

    if (!evento.hora_fim || evento.hora_fim.length > 80)
        return gerarErro('hora_fim');

    if (!evento.usuario_id || isNaN(evento.usuario_id))
        return gerarErro('usuario_id');

    // ================= ENDEREÇO =================
    if (!evento.cep || evento.cep.length > 11)
        return gerarErro('cep');

    if (!evento.cidade || evento.cidade.length > 170)
        return gerarErro('cidade');

    if (!evento.estado || evento.estado.length > 25)
        return gerarErro('estado');

    if (!evento.logradouro || evento.logradouro.length > 255)
        return gerarErro('logradouro');

    if (!evento.numero || isNaN(evento.numero))
        return gerarErro('numero');

    if (evento.complemento && evento.complemento.length > 100)
        return gerarErro('complemento');

    if (!evento.bairro || evento.bairro.length > 100)
        return gerarErro('bairro');

    // ================= EVENTO ORGANIZADOR =================
    if (!evento.evento_id || isNaN(evento.evento_id) || evento.evento_id <= 0)
        return gerarErro('evento_id');

    if (!evento.organizador_id || isNaN(evento.organizador_id) || evento.organizador_id <= 0)
        return gerarErro('organizador_id');

    return false;
}


module.exports = {
    listarEvento,
    buscarEventoId,
    inserirEvento,
    atualizarEvento,
    excluirEvento
}