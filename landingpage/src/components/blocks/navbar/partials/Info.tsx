import NextLink from 'components/reuseable/links/NextLink';
import SocialLinks from 'components/reuseable/SocialLinks';
import { FC, Fragment, ReactElement } from 'react';

// ========================================================
type InfoProps = {
  title?: string;
  phone?: string;
  description?: string;
  address?: string | ReactElement;
};
// ========================================================

const Info: FC<InfoProps> = (props) => {
  const { title, description, address, phone } = props;

  const otherPages = [
    { title: 'Website oficial', url: 'https://www.carreracarneiro.com.br/' },
  ];

  return (
    <div className="offcanvas offcanvas-end text-inverse" id="offcanvas-info" data-bs-scroll="true">
      <div className="offcanvas-header">
        <h3 className="text-white fs-30 mb-0">{title}</h3>
        <button
          type="button"
          className="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>

      <div className="offcanvas-body pb-6">
        <div className="widget mb-8">
          <p>{description}</p>
        </div>

        <div className="widget mb-8">
          <h4 className="widget-title text-white mb-3">Contato</h4>
          <address>{address}</address>
          <NextLink
            title="atendimento@carreracarneiro.com.br"
            className="link-inverse"
            href="mailto:atendimento@carreracarneiro.com.br"
          />
          <br />
          <NextLink href="tel:4121186622" title={phone!} />
        </div>

        <div className="widget mb-8">
          <h4 className="widget-title text-white mb-3">Sobre nós</h4>
          <ul className="list-unstyled">
            {otherPages.map((item) => (
              <li key={item.title}>
                <NextLink href="#" title={item.title} />
              </li>
            ))}
          </ul>
        </div>

        <div className="widget">
          <h4 className="widget-title text-white mb-3">Redes sociais</h4>
          <SocialLinks className="nav social social-white" />
        </div>
      </div>
    </div>
  );
};

// set default props
Info.defaultProps = {
  title: 'Carrera Carneiro',
  phone: '(41) 2118-6622',
  description: `A Carrera Carneiro foi criada no ano de 2008. A empresa iniciou suas atividades focadas na mediação de negócios e factoring. Devido a alta demanda de aposentados buscando por crédito, recebemos diversas indicações para vendas de empréstimo consignado.`,
  address: (
    <Fragment>
      Praça Rui Barbosa, 827 — Sala 111 — Centro — Curitiba, Paraná
    </Fragment>
  )
};

export default Info;
