<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Imports\TabelaCoeficientesImport;
use App\Models\Coeficiente;
use Carbon\Carbon;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Ramsey\Uuid\Uuid;

class ImportExcelController extends Controller
{

    public function importTabelaExcel(Request $request){

        try {

            $extension = $request->file->extension();
            $filename = Uuid::uuid4().'.'.$extension;

            $save = $request->file->storeAs('excel', $filename);

            if($save) {

                $file = storage_path('app'.DIRECTORY_SEPARATOR.'excel'.DIRECTORY_SEPARATOR.$filename);
                if(!is_file($file)){
                    return response()->json(['message'=>'Erro ao buscar o arquivo '.$file],400);
                }

                $allArray = \Excel::toArray(new TabelaCoeficientesImport(1), $file);
                $total = sizeof($allArray[0]);
                $columns = sizeof($allArray[0][0]);

                for($i=0;$i<$total;$i++){
                    for($j=0;$j<$columns;$j++){
                        if($i>0){

                            $coeficiente = str_replace([','],['.'],$allArray[0][$i][$j]);

                            if($allArray[0][0][$j] > 0 && is_numeric($coeficiente) && is_numeric($allArray[0][0][$j])){

                                $data = Carbon::instance(\PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($allArray[0][$i][0]))->format('Y-m-d');
                                $dataParse = Carbon::parse($data);

                                if($dataParse->isValid()){

                                    Coeficiente::updateOrCreate(['id_tabela'=>$request->id_tabela,'data'=>$data,'qtde_parcela'=>$allArray[0][0][$j]],[
                                        'id_tabela' => $request->id_tabela,
                                        'qtde_parcela' => $allArray[0][0][$j],
                                        'coeficiente' => $coeficiente,
                                        'data' => $data
                                    ]);

                                }

                            }else{
                                \Log::critical($allArray[0][$i][0]." não é uma data");
                            }
                        }
                    }
                }

                return response()->json(['message'=>'Importado com sucesso.'.$file,'total'=>$total],200);

            }

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage().'#'.$e->getLine(),'status'=>'error'],400);
        }

    }

}
