<?php

namespace App\Console\Commands;

use App\Http\Controllers\API\AutonomousController;
use Illuminate\Console\Command;

class AutonomousCheckContratos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:AutonomousCheckContratos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command AutonomousCheckContratos';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(AutonomousController $autonomous)
    {
        parent::__construct();
        $this->autonomous = $autonomous;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $this->autonomous->doCheckContratos();

        return 0;
    }
}
