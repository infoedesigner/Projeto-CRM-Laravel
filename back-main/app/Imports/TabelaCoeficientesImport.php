<?php

namespace App\Imports;

use App\Models\Coeficiente;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToArray;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class TabelaCoeficientesImport implements ToArray
{

    public $id_tabela;

    public function __construct($id_tabela)
    {
        $this->id_tabela = $id_tabela;
    }

    public function array(array $rows)
    {
        $processedRows = [];

        // Percorra todas as linhas do arquivo importado
        foreach ($rows as $index => $row) {
            // Ignorar a linha do cabeçalho
            if ($index === 0) {
                continue;
            }

            // Substitua 'A' e 'B' pelas letras das colunas que contêm datas
            $data_coluna1 = Carbon::instance(\PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row['A']));

            // Armazene as datas formatadas de volta no array
            $row['A'] = $data_coluna1;

            // Adicione a linha processada ao array de linhas processadas
            $processedRows[] = $row;
        }

        // Retorne o array de linhas processadas
        return $processedRows;
    }
}
