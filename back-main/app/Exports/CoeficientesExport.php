<?php

namespace App\Exports;

use App\Models\Coeficiente;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;

class CoeficientesExport implements FromQuery
{
    use Exportable;

    public function __construct($id_tabela)
    {
        $this->id_tabela = $id_tabela;
    }

    public function query()
    {
        return Coeficiente::query()->where('id_tabela', $this->id_tabela);
    }

}
