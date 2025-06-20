<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Beneficios;
use App\Models\Docs;
use App\Models\DocsValidacao;
use App\Models\DocsValidacaoResultado;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Ramsey\Uuid\Uuid;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use PharIo\Manifest\Url;
use Phpml\CrossValidation\Split;
use PhpParser\Node\Stmt\TryCatch;

class DocumensController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $id_beneficio = $request->id_beneficio;

        $files = Docs::where('id_beneficio',$id_beneficio)->get();

        return response()->json($files);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        try {         

            $id_beneficio = $request->input('id_beneficio');
            $etapaProvaVida = $request->input('etapa');

            $beneficio = \DB::table('beneficios_cpf AS B')
                ->join('consulta_credito AS CC','B.cc_id','=','CC.id')
                ->join('cliente AS C','C.id_lead','=','CC.lead_id')
                ->selectRaw('B.id AS id_beneficio, CC.lead_id as id_lead, C.id as id_cliente')
                ->where('B.id','=',$id_beneficio)
                ->first();

            if ($request->hasFile('file')) {

                $file = $request->file('file');

                $original = $file->getClientOriginalName();

                $extension = $file->getClientOriginalExtension();                

                $filename = Uuid::uuid4().'.'.$extension;

                $directory = $this->getDirectoryByExtension($extension);
                
                $src_file = $id_beneficio.DIRECTORY_SEPARATOR.$directory.DIRECTORY_SEPARATOR.$filename;
                
                $fileSaved = Storage::disk('public')->put($src_file,file_get_contents($file));   
                
                if($fileSaved){
                    $doc = Docs::create([
                        'filename' => $original,
                        'id_beneficio' => $id_beneficio,
                        'id_cliente' => $beneficio->id_cliente,
                        'id_lead' => $beneficio->id_lead,
                        'extensao' => $extension,
                        'src_file' => $src_file,
                        'etapa_prova_vida' => $etapaProvaVida
                    ]);

                    return response()->json([
                        'status'=> 'success',
                        'message' => 'Arquivo salvo com sucesso.',
                        'path' => $src_file,
                        'data' => $doc
                    ], 200);

                }else{
                    return response()->json([
                        'status'=> 'error',
                        'message' => 'Não foi possível salvar o arquivo.',
                        'path' => $src_file,
                        'data' => []
                    ], 200);
                }
            }

            return response()->json(['status'=> 'error','message' => 'Nenhum arquivo encontrado.'], 400);

        }catch (\Exception $e){
            \Log::debug("Erro ao salvar arquivo: ".$e->getMessage());
            return response()->json(['status'=>'error', 'message' => 'Erro ao enviar a imagem: '.$e->getMessage()], 400);
        }

    }



    private function getDirectoryByExtension($extension)
    {
        switch (strtolower($extension)) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return 'images';
            case 'mp3':
            case 'wav':
                return 'audio';
            case 'mp4':
            case 'avi':
            case 'webm':
                return 'videos';
            default:
                return 'others';
        }
    }

    public function getFile($id)
    {
        $file = Docs::find($id);

        if (!$file) {
            return response()->json(['message' => 'File not found'], 404);
        }

        $path = storage_path('app/public/' . $file->src_file);

        if (!file_exists($path)) {
            return response()->json(['message' => 'File not found on server'], 404);
        }

        return response()->download($path, $file->filename);
    }

    public function viewFile($id)
    {
        $file = Docs::find($id);

        if (!$file) {
            return response()->json(['message' => 'File not found'], 404);
        }

        $path = storage_path('app/public/' . $file->src_file);

        if (!file_exists($path)) {
            return response()->json(['message' => 'File not found on server'], 404);
        }

        return response()->file($path);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function savePhotoByBeneficio(Request $request)
    {

        $id_beneficio = $request->input('id_beneficio');
        $base64Photo = $request->input('base64Photo');
        $etapaProvaVida = $request->input('etapa');

        $extension = substr($base64Photo, 0, strpos($base64Photo, ';'));
        $extension = explode('/',$extension);
        $extension = end($extension);
        $folder = $this->getDirectoryByExtension($extension);
    
        $filename = Uuid::uuid4().'.'.$extension;
        $src_file = $id_beneficio.DIRECTORY_SEPARATOR.$folder.DIRECTORY_SEPARATOR.$filename;

        $prefix = substr($base64Photo, 0, strpos($base64Photo, ';'));
        $base64Image = str_replace($prefix.';base64,', '', $base64Photo);
        
        $imageData = base64_decode($base64Image);
        
        $fileSaved = Storage::disk('public')->put($src_file,$imageData); 

        if($fileSaved){
            $beneficio = DB::table('beneficios_cpf AS B')
                ->join('consulta_credito AS CC','B.cc_id','=','CC.id')
                ->join('cliente AS C','C.id_lead','=','CC.lead_id')
                ->selectRaw('B.id AS id_beneficio, CC.lead_id as id_lead, C.id as id_cliente')
                ->where('B.id','=',$id_beneficio)
                ->first();

            $doc = Docs::create([
                'filename' => 'foto-'.$filename,
                'id_beneficio' => $id_beneficio,
                'id_cliente' => $beneficio->id_cliente,
                'id_lead' => $beneficio->id_lead,
                'extensao' => $extension,
                'src_file' => $src_file,
                'etapa_prova_vida' => $etapaProvaVida
            ]);      
            
            return response()->json([
                'status'=> 'success',
                'message' => 'Foto salvada com sucesso.',
                'data' => $doc
            ], 200);            
        }
    }

    public function saveVideoByBeneficio(Request $request)
    {
        try{
            $base64Video = $request->input('base64Video');
            $id_beneficio = $request->input('id_beneficio');
            $fileName = $request->input('fileName');
            $fileExtension = $request->input('fileExtension');
            $etapaProvaVida = $request->input('etapa');
            
            $directory = $this->getDirectoryByExtension($fileExtension);
    
            $newFileName = Uuid::uuid4().'.'.$fileExtension;
    
            $src_file = $id_beneficio.DIRECTORY_SEPARATOR.$directory.DIRECTORY_SEPARATOR.$newFileName;
            
            $prefix = substr($base64Video, 0, strpos($base64Video, ';'));
            $base64Video = str_replace($prefix.';base64,', '', $base64Video);
            
            $videoData = base64_decode($base64Video);
    
            $fileSaved = Storage::disk('public')->put($src_file,$videoData);   
            unset($videoData);
    
            if($fileSaved){
                $beneficio = DB::table('beneficios_cpf AS B')
                    ->join('consulta_credito AS CC','B.cc_id','=','CC.id')
                    ->join('cliente AS C','C.id_lead','=','CC.lead_id')
                    ->selectRaw('B.id AS id_beneficio, CC.lead_id as id_lead, C.id as id_cliente')
                    ->where('B.id','=',$id_beneficio)
                    ->first();
    
                $doc = Docs::create([
                    'filename' => $fileName,
                    'id_beneficio' => $id_beneficio,
                    'id_cliente' => $beneficio->id_cliente,
                    'id_lead' => $beneficio->id_lead,
                    'extensao' => $fileExtension,
                    'src_file' => $src_file,
                    'etapa_prova_vida' => $etapaProvaVida
                ]);      
                
                $root = Storage::disk('public')->path($src_file);
                $root = str_replace('\\','/',$root);

                //Caminho relativo do arquivo
                $local_file = Storage::disk('public')->url($src_file);
                $local_file = str_replace("\\", '/', $local_file);

                //caminho do servidor com storage link
                $path = storage_path('app/public/'). $src_file;
                $path = str_replace('\\','/',$path);

                $mostqi = new MostqiController;
                $mostqi = $mostqi->livenessDetect($root, $fileName, $id_beneficio, $doc->id);
                
                return response()->json([
                    'status'=> 'success',
                    'message' => 'Vídeo salvo com sucesso.',
                    'data' => $doc,
                    'validacao' =>$mostqi
                ], 200);            
            }else{
                return response()->json([
                    'status'=> 'error',
                    'message' => 'Não foi possível salvar o vídeo.',
                ], 422);             
            }
        }catch(\Exception $e){
            return response()->json([
                'status'=> 'error',
                'message' => 'Erro ao salvar o vídeo: ' . $e->getMessage(),
            ], 500);  
        }

    }   
    public function getDocValidadoPorBenef($id_beneficio) 
    {
        try{
            
            //documento  que foi enviado
            $docs = Docs::select(
                'id as id_doc',
                'extensao',
                'filename' ,
                'src_file' ,
                'status',
                'created_at as upload_date')
            ->where('id_beneficio','=',$id_beneficio)                
            ->get()
            ->toArray();

            //resultado da validação do documento
            $resultado = \DB::table('docs as d')
            ->leftJoin('docs_validacao_resultado as dvr', 'd.id', '=', 'dvr.id_docs')
            ->leftJoin('docs_validacao as dv', 'dvr.id_docs_validacao', '=', 'dv.id')            
            ->select([
                'd.id as id_doc',
                'dv.api_codigo_status' ,
                'dv.api_resposta_json',	
                'dv.api_tipo_validacao',
                'dv.api_tipo_documento',
                'dv.api_subtipo_documento' ,
            ])
            ->where('d.id_beneficio', '=', $id_beneficio)
            ->get()
            ->toArray();            

//dd($resultado );

            // dados do documento encontrado pela validação
            $arrayDoc = collect($docs)->pluck('id_doc')->unique()->toArray();  
            $validacao = DocsValidacaoResultado::selectRaw(
                            "id_docs,
                            api_global_score,
                            id as id_resultado,                
                            api_campo_nome,
                            CASE WHEN (api_campo_valor = 'true' OR api_campo_valor = 'false') 
                                THEN (CASE WHEN api_campo_valor = true THEN 'sim' ELSE 'não' END) 
                                ELSE (CASE WHEN LOWER(api_campo_nome) = 'assinado' 
                                           THEN (CASE WHEN api_campo_valor = '1' THEN 'sim' ELSE 'não' END)
                                           ELSE api_campo_valor END)
                                END AS api_campo_valor,
                            api_campo_score"
                        )
                        ->whereIn('id_docs', $arrayDoc )
                        ->get()
                        ->toArray();

            $documentos = [];
            $tipoConteudo = '';

            foreach($docs as $doc){

                $idFilter = $doc['id_doc'];

                $docResultado = array_values(array_filter($resultado, function ($value) use ($idFilter) {
                    return intval($value->id_doc) == intval($idFilter);
                }));                
                $docResultado = collect($docResultado)->first();

                $docValidado = array_values(array_filter($validacao, function ($value) use ($idFilter) {
                    return intval($value['id_docs']) == intval($idFilter);
                }));

                
                $score = collect($docValidado)->pluck('api_global_score')->unique()->first();
                unset($docValidado['api_global_score']);

                $file = $doc['src_file'];
                $url = Storage::disk('public')->url($file);
                $url = str_replace("\\", '/', $url);
                
                $mymeTypeFileFromStorage = Storage::exists($file) ? Storage::disk('public')->mimeType($file) : $doc['extensao'];

                // $conteudoArquivo = base64_encode(Storage::disk('public')->get($file));
                // $tipoConteudo = $mymeTypeFileFromStorage;
          
                $documentos[] = [
                    'id' => $doc['id_doc'],
                    'mimeType' => $mymeTypeFileFromStorage,
                    'extensao' => $doc['extensao'],
                    'filename' => $doc['filename'],
                    'src_file' => $url,
                    'status' => $doc['status'],
                    'upload_date' => $doc['upload_date'],
                    'score' => $score,
                    'result' => [
                         'api_codigo_status' => $docResultado->api_codigo_status,
                         'api_tipo_validacao' => $docResultado->api_tipo_validacao,
                         'api_tipo_documento' => $docResultado->api_tipo_documento,
                        //  'api_resposta_json' => $docResultado->api_resposta_json,                         
                    ],
                    'validation' => $docValidado,
                    // 'file64' => $conteudoArquivo,
                ];                
            };

            $data = [
                'beneficio' => $id_beneficio,
                'docs' => $documentos
            ];

            return $data;
        }catch(\Exception $e){
            return $e->getMessage();
        }
    }
}
