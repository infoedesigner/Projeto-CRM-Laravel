<?php

namespace App\Http\Controllers\API\Dashboard;

use DB;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BIA1Controller extends Controller
{

    public function geral(){

        $cliente = DB::table('cliente AS C')
            ->selectRaw('COUNT(*) as total, COALESCE(C.estado, "Sem Estado") as estado')
            ->whereNotNull('estado')
            ->groupBy('estado')
            ->get();

        return response()->json(['cliente' => $cliente]);

    }

}
