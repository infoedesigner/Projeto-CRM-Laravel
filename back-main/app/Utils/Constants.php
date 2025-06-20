<?php

namespace App\Utils;

class Constants
{
    const BANCO = 9; //banco padrão inicial para simulação, ITAU CONSIGNADO
    const QTDE_PARCELAS = 84; //padrão inicial para simulação
    const BLOQUEADOS_INSS = [9,10,13,15,25,31,35,36,39,47,48,50,53,61,62,63,64,65,66,67,68,69,70,71,73,74,75,76,77,79,80,85,86,90,91,94,95,97,98,99];
    const MAX_IDADE = 81;
    const MAX_IDADE_FGTS = 81;
    const VALOR_MINIMO_INSS = 700.00;
    const VALOR_MINIMO_FGTS = 50.00;
    const STAKEHOLDERS = ['phelys@gmail.com','carrera@ccef.com.br'];
}
