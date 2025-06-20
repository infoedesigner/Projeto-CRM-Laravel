<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BotManController;
use \BeyondCode\LaravelWebSockets\Facades\WebSocketsRouter;

Auth::routes();

Route::get('/', function () {
    $checkDb = DB::connection()->getDataBaseName();
    $checkApi = true;
    return view('welcome',['checkDb'=>$checkDb,'checkApi'=>$checkApi,'host'=>gethostname()]);
});


Route::group(['prefix'=>'Bot'],function () { //Report
    Route::get('train', [\App\Http\Controllers\API\BOTrainingController::class, 'train']);
    Route::get('check', [\App\Http\Controllers\API\BOTrainingController::class, 'check']);
});

Route::match(['get', 'post'], 'botman', [BotManController::class, 'handle']);
Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
Route::get('/processConsultaCredito', [App\Http\Controllers\API\CheckBeneficiosController::class, 'processConsultaCredito']);
Route::get('/processBeneficios', [App\Http\Controllers\API\CheckBeneficiosController::class, 'processaBeneficios']);
Route::post('/importTabelaExcel', [App\Http\Controllers\API\ImportExcelController::class, 'importTabelaExcel']);

Route::group(['prefix'=>'edata'],function () { //Report
    //POST
    Route::post('landingpage/{lp?}', [\App\Http\Controllers\API\LandingPageController::class, 'leads']);
    Route::post('saveSimulacao', [\App\Http\Controllers\API\LandingPageController::class, 'saveSimulacao']);
    Route::post('saveFinish', [\App\Http\Controllers\API\LandingPageController::class, 'saveFinish']);

    Route::post('changeSimulacao', [\App\Http\Controllers\API\LandingPageController::class, 'changeSimulacao']);

    //GET
    Route::get('creditosINSS/{uuid}', [\App\Http\Controllers\API\LandingPageController::class, 'creditosINSS']);
    Route::get('creditosFGTS/{uuid}', [\App\Http\Controllers\API\LandingPageController::class, 'creditosFGTS']);
    Route::get('etapaFinalINSS/{uuid}', [\App\Http\Controllers\API\LandingPageController::class, 'etapaFinalINSS']);
});

WebSocketsRouter::webSocket('/ccefwebsocket', \App\Handlers\CCEFWebSocketHandler::class);
