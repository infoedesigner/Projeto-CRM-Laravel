import { NextPage } from 'next';
import { Fragment } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import {Footer18} from 'components/blocks/footer';
import FigureImage from 'components/reuseable/FigureImage';
import NextLink from 'components/reuseable/links/NextLink';

const NotFound: NextPage = () => {
  return (
    <Fragment>
      {/* ========== header section ========== */}
      <header className="wrapper bg-light">
        <Navbar
          button={<NextLink title="Voltar" href="/" className="btn btn-sm btn-primary rounded-pill" />}
        />
      </header>

      <main className="content-wrapper">
        <section className="wrapper bg-light">
          <div className="container pt-12 pt-md-14 pb-14 pb-md-16">
            <div className="row">
              <div className="col-lg-9 col-xl-8 mx-auto">
                <FigureImage width={800} height={316} src="/img/illustrations/404.png" className="mb-10" />
              </div>

              <div className="col-lg-8 col-xl-7 col-xxl-6 mx-auto text-center">
                <h1 className="mb-3">Oops! Parece que a API está fora do ar.</h1>
                <p className="lead mb-7 px-md-12 px-lg-5 px-xl-7">
                  Desculpe, perdemos a comunicação com o nosso sistema e/ou sistema do banco. Por favor, tente novamente mais tarde.
                </p>

                <NextLink title="Voltar" href="/" className="btn btn-primary rounded-pill" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========== footer section ========== */}
      <Footer18 />
    </Fragment>
  );
};

export default NotFound;
