import {FC, useState} from 'react';
import NextLink from 'components/reuseable/links/NextLink';
import {useRouter} from "next/router";
import CPFValidar from "../../../utils/CPFValidar";
import Swal from "sweetalert2";

const Hero27: FC = () => {
  const router = useRouter()
  const [cpf, setCpf] = useState('');
  const [produto, setProduto] = useState('inss');

  const simular = (e: any) => {
    e.preventDefault();

    return !CPFValidar(cpf) ? Swal.fire({
      title: 'Ops, algo errado aconteceu.',
      text: 'Por favor, informe um CPF válido.',
      icon: 'error',
      confirmButtonText: 'Ops, blz'
    }) : router.push(`/${produto}/${cpf}/1000.00/simulacao`);
  }

  return (
    <section
      className="wrapper image-wrapper bg-cover bg-image bg-xs-none bg-gray"
      style={{ backgroundImage: 'url(/img/photos/bg37.png)' }}
    >
      <div className="container pt-17 pb-15 py-sm-17 py-xxl-20">
        <div className="row">
          <div
            className="col-sm-6 col-xxl-5 text-center text-sm-start"
            data-cues="slideInDown"
            data-group="page-title"
            data-interval="-200"
            data-delay="500"
          >
            <h2 className="display-1 fs-56 mb-4 mt-0 mt-lg-5 ls-xs pe-xl-5 pe-xxl-0" style={{textShadow: '0px 0px 9px rgba(255, 255, 255, 0.31)'}}>
              Empréstimos com as <span className="underline-3 style-3 green">menores taxas</span> e pagamentos <span className="underline-3 style-3 yellow">flexíveis</span>
            </h2>
            <p className="lead fs-23 lh-sm mb-7 pe-lg-5 pe-xl-5 pe-xxl-0" style={{textShadow: '0px 0px 9px rgba(184,187,200, .5)'}}>
              Empréstimos consignados são <span className="underline-3 style-3 green">ideias</span> para quem precisa daquela ajudinha financeira.
            </p>
            <p className="lead fs-23 lh-sm mb-7 pe-lg-5 pe-xl-5 pe-xxl-0 text-blue" style={{textShadow: '0px 0px 9px rgba(184,187,200, .5)'}}>
              Quel tal R$ 1 mil ou mais na sua mão ainda hoje? Simule sem compromisso.
            </p>

            <div>
                <div className="row">
                  <div className="col-sm-12 col-md-8 col-lg-5">
                    <input className="form-control form-control-lg" placeholder="Digite seu CPF" name="cpf" id="cpf" onChange={(e)=>{setCpf(e.target.value)}} maxLength={11}/>
                  </div>
                  <div className="col-sm-12 col-md-8 col-lg-4">
                    <select name="produto" id="produto" className="form-select form-select-lg" onChange={(e) => { setProduto(e.target.value); }}>
                      <option>INSS</option>
                      <option>FGTS</option>
                    </select>
                  </div>
                  <div className="col-sm-12 col-md-8 col-lg-3">
                    <button className="btn btn-success btn-lg rounded" onClick={(e)=>{simular(e)}}>Simular</button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero27;
