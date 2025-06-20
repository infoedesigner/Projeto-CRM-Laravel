<?php

namespace App\Console\Commands;

use App\Http\Controllers\API\AutonomusClientController;
use Illuminate\Console\Command;

class AutonomousUpdateClient extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:AutonomousUpdateClient';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command AutonomousUpdateClient';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(AutonomusClientController $autonomous)
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

        $this->autonomous->updateClient();

        return 0;
    }
}
