<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Rotinas;
use Illuminate\Http\Request;
use DB;

class RotinasController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function select(Request $request)
    {

        try {

            $all = DB::table('rotinas AS R')->get();

            return response()->json($all,200);

        }catch (\Exception $e){
            return response()->json(['message'=>$e->getMessage(),'status'=>'error'],400);
        }

    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $all = DB::table('rotinas AS R')->where('tipo','=',$request->tipo)->get();

        return response()->json($all,200);
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
        //
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

    public function getJsonRotinas(Request $request){

        $tipo = $request->tipo;

        $data = $this->menuRotinasEdicao(null,$tipo);
        return response()->json($data,200);
    }

    public function menuRotinasEdicao($parentId = 0,$tipo){

        $data = [];
        $rotinas = Rotinas::where('status','=',1)
            ->when($parentId > 0, function ($query) use ($parentId) {
                return $query->where('id_rotina_pai', '=', $parentId);
            })
            ->when($parentId <= 0, function ($query) use ($parentId) {
                return $query->whereNull('id_rotina_pai');
            })
            ->when(strlen($tipo) > 0, function ($query) use ($tipo) {
                return $query->where('tipo','=',$tipo);
            })
        ->orderBy('rotina','ASC')
        ->get();

        foreach($rotinas as $rotina){
            $id = $rotina->id;
            $name = $rotina->rotina;
            $children = $this->menuRotinasEdicao($id,$tipo);
            if(sizeof($children) > 0) {
                $data[] = [
                    'value' => $id,
                    'label' => $name,
                    'children' => $children
                ];
            }else{
                $data[] = [
                    'value' => $id,
                    'label' => $name
                ];
            }
        }

        return $data;

    }

}
