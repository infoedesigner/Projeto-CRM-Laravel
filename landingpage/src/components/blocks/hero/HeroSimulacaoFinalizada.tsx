import {FC, useState} from 'react';
import NextLink from 'components/reuseable/links/NextLink';
import {useRouter} from "next/router";
import CPFValidar from "../../../utils/CPFValidar";
import Swal from "sweetalert2";

const HeroSimulacaoFinalizada: FC = () => {
  const router = useRouter()

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
              Simulação finalizada com sucesso. Em breve você receberá um e-mail e um WhatsApp com próximos passos.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSimulacaoFinalizada;
