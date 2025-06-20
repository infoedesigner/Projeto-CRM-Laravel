import {CurrencyEnToBr, CurrencyEnToBrNo} from "../../src/utils/currencyEnToBr";
import {useState} from "react";

const Simulacao = (props) => {

    const {item,data, setSelected, saveSimulacao, selected} = props;

    console.log(data);

    return (
        <div className="row">
            { item.simulacoes.map((i:any,k) => {
                return (<div className="col-sm-12 col-md-12 col-lg-4" key={k}>
                    <div className={`card m-0 p-0`}>
                        <img src="/img/top-simulacao.png" className="card-img-top"/>
                        <div className="card-header">
                            <div className="row">
                                <div className="col-12">
                                    <span
                                        className="text-info"><h4>{i.nome_banco}</h4></span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                    <span
                                        className="text-dark">{i.descricao_especie}</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                    <span
                                        className="text-info">{`Valor total disponível R$ ${i.coeficientes[0].margem_calculada_format}`}</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <h4>{`Valor do empréstimo R$ ${data.valor_solicitado_format}`}</h4>
                                        </div>
                                        <div className="col-12">
                                            <select name="opcao" id="opcao" className="form-select" onChange={(e)=>{
                                                setSelected(e.target.value);
                                            }}>
                                                <option key="-1"
                                                        value="0">Selecione uma opção</option>
                                                {
                                                    i.coeficientes.map((j: any, l) => {
                                                        j.id_beneficio = i.id_beneficio;
                                                        return (<option key={l}
                                                                        value={JSON.stringify(j)}>{`${j.qtde_parcela} de ${CurrencyEnToBr(j.valor_parcela)}`}</option>)
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <button className="btn btn-success" onClick={(e)=>{
                                        saveSimulacao(selected);
                                    }}>Selecionar essa opção</button>
                        </div>
                    </div>
                </div>);
                }
            )}
        </div>
    );
}

export default Simulacao;
