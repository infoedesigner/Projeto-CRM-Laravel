<?php

namespace Database\Seeders;

use DB;
use Illuminate\Database\Seeder;

class Leads extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = \Faker\Factory::create('pt_BR');

        $canal = ['Facebook','Telefone','SMS','WhatsApp','Outro','Website'];

        for ($i=0; $i<62; $i++) {

            DB::table('lead')->insert([
                'nome' => $faker->name,
                'cpf' => $faker->cpf,
                'celular' => sprintf('(%s) %s', $faker->areaCode, $faker->landline),
                'email' => $faker->email,
                'cidade' => $faker->city,
                'uf' => $faker->stateAbbr,
                'valor_disponivel' => $faker->randomFloat(2, 12, 150000),
                'idade' => rand(18,85),
                'canal' => $canal[rand(1,3)],
                'status' => 5
            ]);

        }
    }
}
