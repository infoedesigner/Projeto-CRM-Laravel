import { FC } from 'react';
// -------- custom component -------- //
import NextLink from 'components/reuseable/links/NextLink';
import SocialLinks from 'components/reuseable/SocialLinks';
// -------- data -------- //
import footerNav from 'data/footer';

const FooterInterno: FC = () => {
  return (
    <footer className="bg-gray">
      <div className="container py-13 py-md-15">

        <hr className="mt-11 mb-12" />
        <div className="row gy-6 gy-lg-0">
          <div className="col-md-4 col-lg-3">
            <div className="widget">
              <img className="mb-4" src="/img/logo-dark.png" srcSet="/img/logo-dark@2x.png 2x" alt="" />

              <p className="mb-4">
                © 2023 NEXANCE. <br className="d-none d-lg-block" />
                Todos os direitos reservados. v1.0.0
              </p>

              <SocialLinks className="nav social social-muted" />
            </div>
          </div>

          <div className="col-md-4 col-lg-3">
            <div className="widget">
              <h4 className="widget-title ls-sm mb-3">Endereço</h4>
              <address className="pe-xl-15 pe-xxl-17">Praça Rui Barbosa, 827 — Sala 111
                Centro — Curitiba, Paraná</address>
              <a href="mailto:#" className="link-body">
                atendimento@carreracarneiro.com.br
              </a>
              <br /> (41) 2118-6622
            </div>
          </div>

          <div className="col-md-12 col-lg-5">
            <div className="widget">
              <h4 className="widget-title ls-sm mb-3">Newsletter</h4>
              <p className="mb-5">Gostaria de ficar por dentro das últimas notícias e receber ofertas exclusivas? Cadastre-se em nossa newsletter e receba as informações diretamente em seu email!</p>
              <div className="newsletter-wrapper">
                <div id="mc_embed_signup2">
                  <form
                    action="#"
                    method="post"
                    id="mc-embedded-subscribe-form2"
                    name="mc-embedded-subscribe-form"
                    className="validate "
                    target="_blank"
                    noValidate
                  >
                    <div id="mc_embed_signup_scroll2">
                      <div className="mc-field-group input-group form-floating">
                        <input
                          type="email"
                          name="EMAIL"
                          id="mce-EMAIL2"
                          placeholder="E-mail"
                          className="required email form-control"
                        />
                        <label htmlFor="mce-EMAIL2">E-mail</label>

                        <input
                          type="submit"
                          value="Cadastrar"
                          name="subscribe"
                          id="mc-embedded-subscribe2"
                          className="btn btn-primary"
                        />
                      </div>

                      {/* <div id="mce-responses2" class="clear">
                    <div class="response" id="mce-error-response2" style="display:none"></div>
                    <div class="response" id="mce-success-response2" style="display:none"></div>
                  </div> 

                  <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_ddc180777a163e0f9f66ee014_4b1bcfa0bc" tabindex="-1" value=""></div>
                  <div class="clear"></div> */}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container pt-7 pb-7">
        <p style={{fontSize: '13px', textAlign:'justify', textJustify: 'auto' }}>A CARRERA CARNEIRO & CIA LTDA é correspondente bancário e presta serviços de recepção e encaminhamento de propostas para instituições financeiras nos termos do artigo 2º da resolução CMV nº 3.954, de 24/02/2011, portanto, não realiza operações de crédito diretamente, como também não cobra nenhum valor de seus clientes pelos serviços prestados, seja adiantado ou posteriormente, pois é remunerada pelas instituições financeiras. A análise de crédito, as taxas de juros e os limites de crédito atendem as regras do mercado, sendo permitido até 30% da renda líquida para empréstimos e 5% para cartão de crédito. Cada instituição financeira tem sua própria política de crédito e isso poderá ser alterado sem aviso prévio, dependendo da análise realizada pela instituição financeira. Antes da contratação de qualquer serviço por meio da CARRERA CARNEIRO & CIA LTDA, você receberá todas as condições e informações relativas ao contrato de empréstimo. O empréstimo consignado para aposentados e pensionistas do INSS tem prazo mínimo de 6 e máximo de 84 meses. Valores poderão ser alterados sem aviso prévio.</p>
      </div>
    </footer>
  );
};

export default FooterInterno;
