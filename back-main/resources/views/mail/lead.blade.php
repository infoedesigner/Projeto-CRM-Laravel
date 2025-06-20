@component('mail::message')
    Novo lead com origem da API 🙂 Segue abaixo dados do lead<br><br>

    Nome: {{ $data['nome'] }}
    CPF: {{ $data['cpf'] }}
    E-mail: {{ $data['email'] }}
    Celular: {{ $data['celular'] }}
    Produto: {{ $data['produto'] }}
    Valor: {{ $data['valor'] }}
    Qualificação: {{ $data['categoria'] }}
    Data solicitação: {{ date('d/m/Y H:i') }}

    {{ config('app.name') }}
@endcomponent
