<?php

use App\Http\Controllers\API\LeadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['prefix'=>'auth'],function () { //Auth
    Route::post('login', [\App\Http\Controllers\API\AuthController::class, 'signin']);
    Route::post('register', [\App\Http\Controllers\API\AuthController::class, 'signup']);
});

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('export/coeficientes', [\App\Http\Controllers\API\CoeficienteController::class, 'export']);

Route::group(['middleware' =>'throttle:100000,1', 'prefix'=>'data'],function () { //Report

    Route::resource('regrasNegocio',\App\Http\Controllers\API\RegrasNegocioController::class);
    Route::resource('cliente',\App\Http\Controllers\API\ClienteController::class);
    Route::resource('whatsapp',\App\Http\Controllers\API\WhatsAppMessagesController::class);
    Route::resource('botchat',\App\Http\Controllers\API\BOTChatMessagesController::class);
    Route::resource('user',\App\Http\Controllers\API\UserController::class);

    Route::get('cliente-select',[\App\Http\Controllers\API\ClienteController::class,'select']);
    Route::get('produto-select',[\App\Http\Controllers\API\ProdutoController::class,'select']);
    Route::get('banco-select',[\App\Http\Controllers\API\BancoController::class,'select']);
    Route::get('apis-select/{tipo?}',[\App\Http\Controllers\API\APIsController::class,'select']);
    Route::get('uf-select',[\App\Http\Controllers\API\EstadosController::class,'select']);
    Route::get('tabela-select',[\App\Http\Controllers\API\TabelaController::class,'select']);
    Route::get('coeficiente-select',[\App\Http\Controllers\API\CoeficienteController::class,'select']);

    Route::get('getBeneficiosByCPF/{cpf}',[\App\Http\Controllers\API\CheckBeneficiosController::class,'getAllBeneficios']);
    Route::get('getBeneficiosByUuid/{uuid}',[\App\Http\Controllers\API\CheckBeneficiosController::class,'getBeneficiosByUuid']);
    Route::get('getBeneficiosByUuidComMargem/{uuid}',[\App\Http\Controllers\API\CheckBeneficiosController::class,'getBeneficiosByUuid']);
    Route::get('getBeneficiosById/{id}',[\App\Http\Controllers\API\CheckBeneficiosController::class,'getBeneficiosById']);

    Route::get('getDocValidadoPorBenef/{id_beneficio}',[ \App\Http\Controllers\API\DocumensController::class,'getDocValidadoPorBenef']);
    Route::post('save-photo',[ \App\Http\Controllers\API\DocumensController::class,'savePhotoByBeneficio']);
    Route::post('save-video',[ \App\Http\Controllers\API\DocumensController::class,'saveVideoByBeneficio']);


    // Route::group(['middleware' =>['throttle:100000,1'], 'prefix'=>'v1'],function () { //Report
    Route::group(['middleware' =>['auth:sanctum','throttle:100000,1'], 'prefix'=>'v1'],function () { //Report

        Route::group(['middleware' =>'throttle:1000,1', 'prefix'=>'dashboard'],function () {
            Route::get('bia1/geral', [\App\Http\Controllers\API\Dashboard\BIA1Controller::class, 'geral']);
        }); //Report

        Route::resource('beneficios', \App\Http\Controllers\API\BeneficiosController::class);
        Route::resource('esteiraPropostas', \App\Http\Controllers\API\EsteiraPropostasController::class);
        Route::resource('leads', LeadController::class);
        Route::resource('historicoLead', \App\Http\Controllers\API\HistoricoLeadController::class);
        Route::resource('agenda-events', \App\Http\Controllers\API\AgendaController::class);
        Route::resource('promotor', \App\Http\Controllers\API\PromotorController::class);
        Route::resource('banco', \App\Http\Controllers\API\BancoController::class);
        Route::resource('tabela', \App\Http\Controllers\API\TabelaController::class);
        Route::resource('rotinas', \App\Http\Controllers\API\RotinasController::class);
        Route::resource('comissao', \App\Http\Controllers\API\ComissaoController::class);
        Route::resource('produto', \App\Http\Controllers\API\ProdutoController::class);
        Route::resource('portabilidade', \App\Http\Controllers\API\PortabilidadeController::class);
        Route::resource('regras-cartoes', \App\Http\Controllers\API\RegrasCartoesController::class);
        Route::resource('docs', \App\Http\Controllers\API\DocumensController::class);

        //Leads GET
        Route::get('beneficiosByCPF/{cpf}', [\App\Http\Controllers\API\EsteiraPropostasController::class,'beneficiosByCPF']);
        Route::get('listBeneficiosByUuid/{uuid}',[\App\Http\Controllers\API\CheckBeneficiosController::class,'getBeneficiosByUuid']);
        Route::get('listBeneficiosByCCId/{id}',[\App\Http\Controllers\API\CheckBeneficiosController::class,'getBeneficiosByCCId']);
        Route::get('digitacao',[\App\Http\Controllers\API\EsteiraPropostasController::class,'digitacao']);
        Route::get('historicoInssMargem/{id}/{parcelas}',[\App\Http\Controllers\API\BeneficiosController::class,'getHistoricoInssMargem']);
        Route::get('historicoInssBanco/{id}',[\App\Http\Controllers\API\BeneficiosController::class,'getHistoricoInssBanco']);
        Route::get('historicoInssContrato/{id}',[\App\Http\Controllers\API\BeneficiosController::class,'getHistoricoInssContratosEmprestimo']);

        Route::get('condicoesCredito/{id}',[\App\Http\Controllers\API\CondicoesCreditoController::class,'getCondicoesCredito']);
        Route::get('rotinas/menuRotinasEdicao/json/{tipo?}',[\App\Http\Controllers\API\RotinasController::class,'getJsonRotinas']);
        Route::get('processInssHistorico/{beneficio}/{id}', [\App\Http\Controllers\API\DataConsigV2Controller::class,'getCreditoOffline']);
        Route::get('reprocessOnline/{beneficio}/{idBeneficio}/{uuid}/{cpf}/{view?}/{user_force?}', [\App\Http\Controllers\API\DataConsigV2Controller::class,'reprocessConsultaOnline']);
        Route::get('getXmlConsulta/{cpf}',[LeadController::class,'getXMLConsulta']);
        Route::get('getXmlConsultaByBeneficioId/{id_beneficio}/{tipo?}',[LeadController::class,'getXMLConsultaById']);

        Route::get('regrasTabela/{id_tabela}',[\App\Http\Controllers\API\ProdutoController::class,'listRegrasTabela']);
        Route::get('delRegrasProduto/{id_regra_produto}',[\App\Http\Controllers\API\ProdutoController::class,'delRegraTabela']);

        Route::get('/file/{id}', [\App\Http\Controllers\API\DocumensController::class, 'getFile']);
        Route::get('/view-docs/{id}', [\App\Http\Controllers\API\DocumensController::class, 'viewFile']);

        Route::post('changeLeadBoard', [LeadController::class,'changeLeadBoard']);
        Route::post('saveApprove', [\App\Http\Controllers\API\EsteiraPropostasController::class,'saveApprove']);
        Route::post('saveDadosDigitacao', [\App\Http\Controllers\API\EsteiraPropostasController::class,'saveDigitacao']);
        Route::post('add-regras-tabela', [\App\Http\Controllers\API\ProdutoController::class,'addRegraTabela']);
        Route::post('change-status', [\App\Http\Controllers\API\EsteiraPropostasController::class,'changeStatus']);
        Route::post('check-regra-simulador', [\App\Http\Controllers\API\EsteiraPropostasController::class,'checkRegrarSimulacao']);

        #Regras negócio portabilidade
        Route::get('regras-tabela-portabilidade/{id_tabela}',[\App\Http\Controllers\API\PortabilidadeController::class,'listRegrasTabela']);
        Route::get('del-regras-produto-portabilidade/{id_regra_produto}',[\App\Http\Controllers\API\PortabilidadeController::class,'delRegraTabela']);
        Route::post('add-regras-tabela-portabilidade', [\App\Http\Controllers\API\PortabilidadeController::class,'addRegraTabela']);

        #Regras negócio cartão
        Route::get('regras-tabela-cartao/{id_tabela}',[\App\Http\Controllers\API\RegrasCartoesController::class,'listRegrasTabela']);
        Route::get('del-regras-produto-cartao/{id_regra_produto}',[\App\Http\Controllers\API\RegrasCartoesController::class,'delRegraTabela']);
        Route::post('add-regras-tabela-cartao', [\App\Http\Controllers\API\RegrasCartoesController::class,'addRegraTabela']);

        #Simuladores
        Route::get('simulacoes-realizadas/{id_beneficio}',[\App\Http\Controllers\API\EsteiraPropostasController::class,'simulacoesRealizads']);
        Route::get('motivo-bloqueios/{id_beneficio}',[\App\Http\Controllers\API\EsteiraPropostasController::class,'motivosBloqueios']);
        Route::get('reprocessar-simulacoes/{id_beneficio}',[\App\Http\Controllers\API\EsteiraPropostasController::class,'reprocessarSimulacoes']);
        Route::get('reprocessar-beneficios/{cpf}',[\App\Http\Controllers\API\EsteiraPropostasController::class,'reprocessarBeneficios']);
        Route::get('contratos/{id_beneficio}/{tipo}',[\App\Http\Controllers\API\PortabilidadeController::class,'contratos']);
        Route::get('simulacoes/{id_beneficio}/{data}/{valor}/{valor_parcela?}',[\App\Http\Controllers\API\EsteiraPropostasController::class,'simulacoes']);
        Route::get('portabilidade/{id_beneficio}/{id_contrato}/{cpf}/{valor}/{tipo}',[\App\Http\Controllers\API\PortabilidadeController::class,'simulacoes']);
        Route::get('renegociacoes/{id_beneficio}/{id_contrato}/{cpf}/{valor}/{tipo}',[\App\Http\Controllers\API\PortabilidadeController::class,'simulacoes']);
        Route::get('cartoes/simulacoes/{id_beneficio}/{cpf}/{valor}',[\App\Http\Controllers\API\RegrasCartoesController::class,'simulacoes']);

        Route::post('simulacoes-check',[\App\Http\Controllers\API\EsteiraPropostasController::class,'checkRegrarSimulacao']);

        #Validação de CPF na MOST API
        Route::group(['middleware' =>'throttle:1000,1', 'prefix'=>'mostqi'],function () {
            Route::get('status-cpf/{id_beneficio}', [\App\Http\Controllers\API\MostOndemandRfStatusController::class, 'getLastByBeneficio']);
            Route::get('dados-basicos/{id_beneficio}', [\App\Http\Controllers\API\MostBasicDataController::class, 'getLastByBeneficio']);
            Route::get('endereco/{id_beneficio}', [\App\Http\Controllers\API\MostAddressesExtendedController::class, 'getLastByBeneficio']);
            Route::post('consulta-cpf/{cpf}/{id_beneficio}', [\App\Http\Controllers\API\MostqiController::class,'getEnrichmentSync']);
        });
        

    });

});

Route::group(['middleware' =>['auth:sanctum'], 'prefix'=>'Dashboad'],function () { //Report
    Route::get('leadsByStatus', [\App\Http\Controllers\API\LeadsKPIsController::class, 'leadsByStatus']);
});

Route::group(['middleware' =>['auth:sanctum'], 'prefix'=>'ExternalAPIs'],function () { //Report

});

Route::middleware('throttle:100000,1')->prefix('whatsapp')->group( function () {
    Route::get('incoming', [\App\Http\Controllers\API\WhatsAppController::class, 'incomingMessages']);
    Route::post('incoming', [\App\Http\Controllers\API\WhatsAppController::class, 'incomingMessages']);
});

Route::middleware('throttle:100000,1')->prefix('mostqi')->group( function (){
    Route::post('process-image/content-extraction', [\App\Http\Controllers\API\MostqiController::class,'contentExtraction']);
    Route::post('retorno-consulta-cpf', [\App\Http\Controllers\API\MostqiController::class,'setConsultaCpf']);
});

