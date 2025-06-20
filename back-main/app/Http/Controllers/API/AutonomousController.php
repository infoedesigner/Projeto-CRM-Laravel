<?php

namespace App\Http\Controllers\API;

use App\Mail\ErrorCoeficiente;
use App\Models\Beneficios;
use App\Models\SimulacoesDisponiveis;
use App\Utils\Constants;
use DB;
use App\Http\Controllers\Controller;

class AutonomousController extends Controller
{

    public function checkContratosByBeneficio($id_beneficio)
    {

        $contratos = DB::table('inss_historico_contratos_emprestimo')->where('id_beneficio','=', $id_beneficio)->count();

        return $contratos > 0 ? true : false;

    }

    public function checkSimulacaoByBeneficio($id_beneficio)
    {

        $contratos = DB::table('simulacoes_disponiveis')->where('id_beneficio','=', $id_beneficio)->count();

        return $contratos > 0 ? true : false;

    }

    public function baixaCheckContrato($id_beneficio)    {

        return Beneficios::where('id','=',$id_beneficio)->update(['check_contratos' => 1]);

    }

    public function baixaCheckSimulacao($id_beneficio)    {

        return Beneficios::where('id','=',$id_beneficio)->update(['check_credito' => 1]);

    }

    public function doCheckContratos(){

        try {

            $now = now();
            $fiveDaysAgo = $now->subDays(7);
            $d1 = $fiveDaysAgo->format('Y-m-d');

            $beneficiosToDo = DB::table('beneficios_cpf AS BC')
                ->join('consulta_credito AS CC','BC.cc_id','=','CC.id')
                ->selectRaw('BC.id as id_beneficio, BC.beneficio, BC.uuid, CC.lead_id, BC.cpf, TIMESTAMPDIFF(YEAR, BC.data_nascimento, CURDATE()) as idade')
                ->whereRaw('DATE(BC.updated_at) >= ? AND check_contratos = ? AND situacao LIKE ?',[$d1,0,'%ATIVO%'])
                ->whereNotIn('BC.especie',Constants::BLOQUEADOS_INSS)
                ->having('idade', '<', Constants::MAX_IDADE)
                ->get();

            foreach ($beneficiosToDo as $beneficio){

                if(!$this->checkContratosByBeneficio($beneficio->id_beneficio)){
                    $dataconsig = new DataConsigV2Controller($beneficio->cpf,1,$beneficio->lead_id);
                    $dataconsig->getCreditoOnline($beneficio->beneficio,$beneficio->id_beneficio,$beneficio->uuid,0,1);
                }

                $this->baixaCheckContrato($beneficio->id_beneficio);

            }

            return true;

        }catch (\Exception $e){

            \Log::critical('Erro ao executar doCheckContratos: ' . $e->getMessage());

            return false;

        }

    }

    public function getCoeficiente($data){

        try {

            $coeficiente = DB::table('coeficiente')
                ->where('data','=',$data)
                ->first();

            if(is_object($coeficiente)){

                return (object)['status'=>'ok','message'=>'Coeficiente/Fator recuperado com sucesso.','data'=>$coeficiente];

            }else{

                $coeficiente['id'] = -1;
                $coeficiente['data'] = date('Y-m-d');
                $coeficiente['coeficiente'] = 0.0256;

                $message = "Erro no coeficiente.";

                \Mail::to(['phelys@gmail.com','carrera@ccef.com.br'])->send(new ErrorCoeficiente($message));

                return (object)['status'=>'ok','message'=>'Coeficiente/Fator recuperado com sucesso.','data'=>(object)$coeficiente];

            }

        }catch (\Exception $e){
            return false;
        }

    }

    public function checkMargemCredito($id_beneficio){ //validado

        try {

            $coeficiente = $this->getCoeficiente(date('Y-m-d'));
            $margem = DB::table('inss_historico_margem')->where('id_beneficio','=',$id_beneficio)->where('tipo','=','online')->first();
            if(is_null($margem)){
                $margem = DB::table('inss_historico_margem')->where('id_beneficio','=',$id_beneficio)->where('tipo','=','offline')->first();
            }

            if(!is_object($margem) || !is_object($coeficiente) || is_null($margem)){
                return false;
            }

            $margem_disponivel_emprestimo = $margem->margem_disponivel_emprestimo;

            $checkMargem = new EsteiraPropostasController();
            $res = $checkMargem->simulacoes($id_beneficio,date('Y-m-d'), null,$margem_disponivel_emprestimo);

            $result = json_decode($res->content());

            if($result->status == 'ok'){
                $this->baixaCheckSimulacao($id_beneficio);
                if (!empty($result->simulacoes)) {
                    return 1;
                }else{
                    return 0;
                }
            }

        }catch (\Exception $e){
            \Log::critical('Erro ao executar checkMargemCredito: ' . $e->getMessage());
            return 0;
        }

    }

    public function checkRefinanciamentoCredito($id_beneficio) : int {

        try {

            if(!$this->checkSimulacaoByBeneficio($id_beneficio)){

                $refinanciamento = new PortabilidadeController();
                $result = $refinanciamento->contratos($id_beneficio,'Refinanciamento');
                $result = json_decode($result->content());

                $this->baixaCheckSimulacao($id_beneficio);

                if(!empty($result)){
                    foreach ($result as $contratos) {
                        if(!empty($contratos->tabelas)){
                            foreach($contratos->tabelas as $tabela){
                                if(!is_null($tabela->simulacao)){
                                    return 1;
                                }
                            }
                            \Log::info('Beneficio: ' . $id_beneficio . ' simulado em '.date('d/m/Y H:i:s').' com sucesso');
                        }
                    }
                }

            }

        }catch (\Exception $e){
            \Log::critical('Erro ao executar checkRefinanciamentoPortabilidadeCredito: ' . $e->getMessage());
            return 0;
        }

        return 0;

    }

    public function checkPortabilidadeCredito($id_beneficio) : int {

        try {

            if(!$this->checkSimulacaoByBeneficio($id_beneficio)){

                $portabilidade = new PortabilidadeController();
                $portabilidade = $portabilidade->contratos($id_beneficio,'Portabilidade');
                $result = json_decode($portabilidade->content());

                $this->baixaCheckSimulacao($id_beneficio);

                if(!empty($result)){
                    foreach ($result as $contratos) {
                        if(!empty($contratos->tabelas)){
                            foreach($contratos->tabelas as $tabela){
                                if(!is_null($tabela->simulacao)){
                                    return 1;
                                }
                            }
                            \Log::info('Beneficio: ' . $id_beneficio . ' simulado em '.date('d/m/Y H:i:s').' com sucesso');
                        }
                    }
                }

            }

        }catch (\Exception $e){
            \Log::critical('Erro ao executar checkRefinanciamentoPortabilidadeCredito: ' . $e->getMessage());
            return 0;
        }

        return 0;

    }

    public function doSimulacaoAll(){

        try {

            $now = now();
            $fiveDaysAgo = $now->subDays(5);
            $d1 = $fiveDaysAgo->format('Y-m-d');

            $beneficiosToDo = DB::table('beneficios_cpf AS BC')
                ->selectRaw('BC.id as id_beneficio, BC.beneficio, BC.cpf, BC.uuid')
                ->whereRaw('DATE(BC.updated_at) >= ? AND check_credito = ? AND check_contratos = ? AND situacao LIKE ?',[$d1,0,1,'%ATIVO%'])
                ->get();

            foreach ($beneficiosToDo as $beneficio){

                SimulacoesDisponiveis::updateOrCreate([
                    'beneficio' => $beneficio->beneficio,
                    'cpf' => $beneficio->cpf,
                ],[
                    'id_beneficio' => $beneficio->id_beneficio,
                    'beneficio' => $beneficio->beneficio,
                    'cpf' => $beneficio->cpf,
                    'credito_margem' => $this->checkMargemCredito($beneficio->id_beneficio),
                    'credito_refin_portabilidade' => $this->checkRefinanciamentoCredito($beneficio->id_beneficio) + $this->checkPortabilidadeCredito($beneficio->id_beneficio),
                ]);

            }

        }catch (\Exception $e){
            \Log::critical('Erro ao executar doSimulacaoAll: ' . $e->getMessage(). ' na linha '.$e->getLine());
        }

    }

}
