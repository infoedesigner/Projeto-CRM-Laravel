import React from 'react';
import { NavLink } from 'react-router-dom';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';

const Unauthorized = () => {
  const title = 'Unauthorized';
  const description = 'Unauthorized Page';

  const rightSide = (
    <div className="sw-lg-80 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 full-page-content-right-border">
      <div className="sw-lg-60 px-5">
        <div className="sh-11">
          <NavLink to="/login">
            <div className="logo-default" />
          </NavLink>
        </div>
        <div className="mb-5">
          <h2 className="cta-1 mb-0 text-primary">Ooops, algo de errado não está certo!</h2>
          <h2 className="display-2 text-primary">Sem autorização</h2>
        </div>
        <div className="mb-5">
          <p className="h6">Parece que você não tem permissão para acessar essa página.</p>
        </div>
        <div>
          <NavLink to="/login" className="btn btn-icon btn-icon-start btn-primary">
            <CsLineIcons icon="arrow-left" /> <span>Realizar login</span>
          </NavLink>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <HtmlHead title={title} description={description} />
      <LayoutFullpage right={rightSide} />
    </>
  );
};

export default Unauthorized;
