import Link from 'next/link';
import LinkType from 'types/link';
import {FC, Fragment, ReactElement, useRef, useState} from 'react';
// -------- custom hook -------- //
import useSticky from 'hooks/useSticky';
// -------- custom component -------- //
import NextLink from 'components/reuseable/links/NextLink';
import SocialLinks from 'components/reuseable/SocialLinks';
import ListItemLink from 'components/reuseable/links/ListItemLink';
import DropdownToggleLink from 'components/reuseable/links/DropdownToggleLink';
// -------- partial header component -------- //
import Info from './partials/Info';
import Social from './partials/Social';
import Signin from './partials/Signin';
import Signup from './partials/Signup';
import Language from './partials/Language';

// -------- data -------- //
import {
  pages,
  documentionNavigation
} from 'data/navigation';
import {Button, Col, Modal, Row} from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// ===================================================================
type NavbarProps = {
  info?: boolean;
  cart?: boolean;
  fancy?: boolean;
  logoAlt?: string;
  search?: boolean;
  social?: boolean;
  language?: boolean;
  stickyBox?: boolean;
  navClassName?: string;
  button?: ReactElement;
  navOtherClass?: string;
};
// ===================================================================

const Navbar: FC<NavbarProps> = (props) => {
  const { navClassName, info, search, social, language, button, fancy, navOtherClass, stickyBox, logoAlt } =
    props;

  const sticky = useSticky(350);
  const navbarRef = useRef<HTMLElement | null>(null);

  // dynamically render the logo
  const logo = sticky ? 'logo-dark' : logoAlt ?? 'logo-dark';
  // dynamically added navbar classname
  const fixedClassName = 'navbar navbar-expand-lg center-nav transparent navbar-light navbar-clone fixed';

  // render inner nav item links
  const renderLinks = (links: LinkType[]) => {
    return links.map((item) => (
      <ListItemLink href={item.url} title={item.title} linkClassName="dropdown-item" key={item.id} />
    ));
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCreatePassword = () => {

  }

  // Validação com Yup
  const ContactSchema = Yup.object().shape({
    email: Yup.string()
        .min(2, 'E-mail muito curto!')
        .max(120, 'E-mail muito longo!')
        .required('Obrigatório'),
    password: Yup.string()
        .min(6, 'Senha muito curta!')
        .max(20, 'Senha muito longa!')
        .required('Obrigatório')
  });

  // all main header contents
  const headerContent = (
    <Fragment>
      <div className="navbar-brand w-100">
        <NextLink href="/" title={<img alt="logo" src={`/img/${logo}.png`} srcSet={`/img/${logo}@2x.png 2x`} />} />
      </div>

      <div id="offcanvas-nav" data-bs-scroll="true" className="navbar-collapse offcanvas offcanvas-nav offcanvas-start">
        <div className="offcanvas-header d-lg-none">
          <h3 className="text-white fs-30 mb-0">Carrera Carneiro</h3>
          <button type="button" aria-label="Close" data-bs-dismiss="offcanvas" className="btn-close btn-close-white" />
        </div>

        <div className="offcanvas-body d-flex flex-column h-100">
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
                <Button onClick={handleShow} className="btn btn-success">
                  Área do cliente
                </Button>
            </li>

          </ul>

          {/* ============= show contact info in the small device sidebar ============= */}
          <div className="offcanvas-footer d-lg-none">
            <div>
              <NextLink title="atendimento@carreracarneiro.com.br" className="link-inverse" href="mailto:atendimento@carreracarneiro.com.br" />
              <br />
              <NextLink href="tel:4121186622" title="(41) 2118-6622" />
              <br />
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>

      {/* ============= right side header content ============= */}
      <div className={navOtherClass}>
        <ul className="navbar-nav flex-row align-items-center ms-auto">
          {/* ============= language dropdwown ============= */}
          {language && <Language />}

          {/* ============= info button ============= */}
          {info && (
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="offcanvas" data-bs-target="#offcanvas-info">
                <i className="uil uil-info-circle" />
              </a>
            </li>
          )}

          {/* ============= search icon button ============= */}

          {/* ============= contact button ============= */}
          {button && <li className="nav-item d-none d-md-block">{button}</li>}

          {/* ============= social icons link ============= */}
          {social && <Social />}

          {/* ============= humburger button for small device ============= */}
          <li className="nav-item d-lg-none">
            <button data-bs-toggle="offcanvas" data-bs-target="#offcanvas-nav" className="hamburger offcanvas-nav-btn">
              <span />
            </button>
          </li>
        </ul>
      </div>
    </Fragment>
  );

  return (
    <Fragment>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>CCEF - Área do cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <span className="underline-3 style-3 green">Que bom ter você aqui</span>, para continuar seu acesso informe seu login ou seu número do celular, e sua senha.
            </Col>
            <Col sm={12} md={12} lg={12}>
              <Formik
                  initialValues={{ email: '', password: '' }}
                  validationSchema={ContactSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                      alert("Dados de acessos inválidos, favor verifique seu SMS, WhatsApp ou e-mail.");
                      setSubmitting(false);
                    }, 10);
                  }}
              >
                {({ isSubmitting }) => (
                    <Form>
                      <Row className="pt-3">
                        <Col>
                          <label htmlFor="email">E-mail ou celular</label>
                          <Field type="text" name="email" className="form-control"/>
                          <ErrorMessage name="email" component="div" className="text-danger"/>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <label htmlFor="password">Senha</label>
                          <Field type="password" name="password" className="form-control"/>
                          <ErrorMessage name="password" component="div" className="text-danger"/>
                        </Col>
                      </Row>
                      <Row className="pt-3">
                        <Col>
                          <button type="submit" disabled={isSubmitting} className="btn btn-blue">
                            Acessar área do cliente
                          </button>
                        </Col>
                      </Row>
                    </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={()=>{handleCreatePassword}}>Não tenho senha ainda</button>
        </Modal.Footer>
      </Modal>

      {stickyBox && <div style={{ paddingTop: sticky ? navbarRef.current?.clientHeight : 0 }} />}

      <nav ref={navbarRef} className={sticky ? fixedClassName : navClassName}>
        {fancy ? (
          <div className="container">
            <div className="navbar-collapse-wrapper bg-white d-flex flex-row flex-nowrap w-100 justify-content-between align-items-center">
              {headerContent}
            </div>
          </div>
        ) : (
          <div className="container flex-lg-row flex-nowrap align-items-center">{headerContent}</div>
        )}
      </nav>

      {/* ============= signin modal ============= */}
      <Signin />

      {/* ============= signup modal ============= */}
      <Signup />

      {/* ============= info sidebar ============= */}
      {info && <Info />}

    </Fragment>
  );
};

// set deafult Props
Navbar.defaultProps = {
  cart: false,
  info: false,
  social: false,
  search: false,
  language: false,
  stickyBox: true,
  navOtherClass: 'navbar-other w-100 d-flex ms-auto',
  navClassName: 'navbar navbar-expand-lg center-nav transparent navbar-light'
};

export default Navbar;
