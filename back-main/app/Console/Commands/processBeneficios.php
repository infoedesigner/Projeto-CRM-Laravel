<?php

namespace App\Console\Commands;

use App\Http\Controllers\API\CheckBeneficiosController;
use Illuminate\Console\Command;

class processBeneficios extends Command
{
    public $cc;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:processBeneficios';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command para processar benefícios encontrados';

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

        $this->cc->processaBeneficios();

        return 0;
    }
}
