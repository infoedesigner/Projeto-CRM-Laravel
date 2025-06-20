<?php

namespace App\Console\Commands;

use App\Http\Controllers\API\CheckBeneficiosController;
use Illuminate\Console\Command;

class processCreditosBeneficios extends Command
{
    public $cc;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:processCreditosBeneficios';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command para processar Créditos e Benefícios';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(CheckBeneficiosController $cc)
    {
        parent::__construct();
        $this->cc = $cc;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $this->cc->processConsultaCredito();

        return 0;
    }
}
