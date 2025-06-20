<?php

namespace App\Http\Controllers\API;

use App\Models\ConsultaCredito;
use DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Ramsey\Uuid\Uuid;

class CheckBeneficiosController extends Controller
{

    public function getAllBeneficios(Request $request){

        try {

            $apis = isset($request->apis) ? $request->apis : 1;
            $cpf = $request->cpf;
            $valor = $request->valor;
            $user_id = !is_null($request->user()) ? $request->user()->id : 1;
            $uuid = Uuid::uuid4();
            $data_nascimento = $request->data_nascimento;
            $nome = $request->nome;

            if(!isset($request->apis) || sizeof($apis) <= 0){
                return response()->json(['message' => 'Nenhuma API selecionada'], 202);
            }

            $beneficios = false;
            $data = '';
            foreach ($apis as $api){

                switch ((int)$api){
                    case 1 : {
                        //DataConsig
                        \Log::info('getAllBeneficios - DataConsig online');
                        $dataConsig = new DataConsigController($cpf,$user_id);
                        $dataConsig = json_decode($dataConsig->getBeneficiosByCPF(1,$uuid));

                        if($dataConsig->status=='ok'){
                            $beneficios = true;
                            $data = $dataConsig->data;
                        }else{
                            $data = $dataConsig->data;
                        }
                        break;
                    }
                    case 2 : {

                        $pan = new PanController($cpf,$user_id);

                        $parametros = [
                            'provider' => 2,
                            'cpf' => $cpf,
                            'nome' => $nome,
                            'data_nascimento' => $data_nascimento,
                            'valor' => $valor,
                            'uuid' => $uuid,
                        ];

                        $pan = json_decode($pan->getSimulacaoFGTS($parametros));

                        if($pan->status=='ok'){
                            $beneficios = true;
                            $data = $pan->data;
                        }else{
                            $data = $pan->data;
                        }
                        break;
                    }
                    case 3 : {
                        \Log::info('getAllBeneficios - Mercantil');
                        $mercantil = new MercantilController($cpf,$user_id);
                        $mercantil = json_decode($mercantil->getBeneficiosByCPF());

                        if($mercantil->status=='ok'){
                            $beneficios = true;
                            $data = $mercantil->data;
                        }else{
                            $data = $mercantil->data;
                        }
                        break;
                    }
                    case 4 : {
                        \Log::info('getAllBeneficios - Genérica');
                        $generica = new GenericaController($cpf,$user_id);
                        $generica = $generica->consultaExtrato();

                        if($generica->status=='ok'){
                            $beneficios = true;
                            $data = $generica->data;
                        }else{
                            $data = $generica->data;
                        }
                        break;
                    }
                    case 5 : {

                        $dataConsig = new DataConsigController($cpf,$user_id);
                        $dataConsig = json_decode($dataConsig->getBeneficiosByCPF(5,$uuid));

                        if($dataConsig->status=='ok'){
                            $beneficios = true;
                            $data = $dataConsig->data;
                        }else{
                            $data = $dataConsig->data;
                        }
                        break;
                    }
                    case 6 : {

                        $dataConsig = new DataConsigV2Controller($cpf,$user_id);
                        $dataConsig = json_decode($dataConsig->getBeneficiosByCPF(5,$uuid));

                        if($dataConsig->status=='ok'){
                            $beneficios = true;
                            $data = $dataConsig->data;
                        }else{
                            $data = $dataConsig->data;
                        }
                        break;
                    }
                }

            }

            if($beneficios){
                return response()->json(['message'=>'Consulta realizada com sucesso, aguarde processamento.','status'=>'ok','beneficios'=>$beneficios,'uuid'=>$uuid],200);
            }else{
                return response()->json(['message'=>'Nenhum benefício encontrado para o usuário.','status'=>'no','beneficios'=>$beneficios,'uuid'=>$uuid,'data'=>$data],202);
            }

        }catch (\Exception $e){
            \Log::error($e->getMessage());
            return response()->json(['message'=>$e->getMessage().'#'.$e->getFile().'#'.$e->getLine(),'status'=>'error'],400);
        }

    }

    public function getBeneficiosByUuid($uuid){

        try {

            $all = DB::table('consulta_credito as CC')
                ->join('apis as API','CC.provider','=','API.id')
                ->selectRaw('CC.*,API.api_name')
                ->where('uuid','=',$uuid)
                ->get();

            if(is_object($all)){
                return response()->json(['status'=>'ok','beneficios'=>$all],200);
            }

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }

    }

    public function getBeneficiosByUuidComMargem($uuid){

        try {

            $all = DB::table('beneficios_cpf as B')
                ->leftJoin('inss_historico_margem as M','M.id_beneficio','=','B.id')
                ->selectRaw('B.*, M.margem_disponivel_emprestimo')
                ->where('B.uuid','=',$uuid)
                ->get();

            if(is_object($all) > 0){
                return $all;
            }

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }

    }

    public function getBeneficiosById($id){

        try {

            $all = DB::table('beneficios_cpf as B')
                ->join('apis AS A','B.provider','=','A.id')
                ->selectRaw('B.*, A.offline, CALCULAR_IDADE(data_nascimento) as idade, DATE_FORMAT(data_nascimento, \'%d/%m/%Y\') as data_nascimento_formatada')
                ->where('B.id','=',$id)
                ->first();

            if(is_object($all)){
                return response()->json($all,200);
            }

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }

    }

    public function getBeneficiosByCCId($id){

        try {

            $all = DB::table('beneficios_cpf as B')
                ->selectRaw('B.*')
                ->where('cc_id','=',$id)
                ->get();

            if(is_object($all)){
                return response()->json($all,200);
            }

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }

    }

    public function processConsultaCredito(){

        try {

            $allCC = DB::table('consulta_credito AS CC')
                ->where('CC.status','=',1)
                ->where('CC.code_response','=',200)
                ->get();

            foreach ($allCC as $cc){
                $dataConsig = new DataConsigController($cc->cpf,$cc->user_id);
                if($dataConsig->getCreditosByBeneficioId($cc->id,$cc->provider)){
                    ConsultaCredito::where('id','=',$cc->id)->update(['status'=>2]);
                }
            }

        }catch (\Exception $e){
            \Log::error($e->getMessage());
        }

    }

    public function processaBeneficios(){

        try {

            $allCC = DB::table('beneficios_cpf AS BC')
                ->join('consulta_credito AS C','BC.cc_id','=','C.id')
                ->selectRaw('BC.*,C.user_id')
                ->where('BC.status','=',1)
                ->get();

            foreach ($allCC as $cc){
                switch ((int)$cc->provider){
                    case 1 : {
                        $dataConsig = new DataConsigController($cc->cpf,$cc->user_id);
                        $dataConsig->getCreditoOnline($cc);
                        break;
                    }
                    case 5 : {
                        $dataConsig = new DataConsigController($cc->cpf,$cc->user_id);
                        $dataConsig->getCreditoOffline($cc->beneficio);
                        break;
                    }
                    default : {
                        break;
                    }
                }
            }

        }catch (\Exception $e){
            \Log::error($e->getMessage());
        }

    }

}
