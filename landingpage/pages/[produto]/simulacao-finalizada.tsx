import { Fragment } from 'react';
import type { NextPage } from 'next';
import PageProgress from "../../src/components/common/PageProgress";
import {Navbar} from "../../src/components/blocks/navbar";
import {Services29} from "../../src/components/blocks/services";
import {Process17} from "../../src/components/blocks/process";
import {Pricing10} from "../../src/components/blocks/pricing";
import {Footer18} from "../../src/components/blocks/footer";
import HeroSimulacaoFinalizada from "../../src/components/blocks/hero/HeroSimulacaoFinalizada";

const SimulacaoFinalizada: NextPage = () => {
  return (
      <Fragment>
        <PageProgress />

        {/* ========== header ========== */}
        <header className="wrapper bg-light">
          <Navbar
              info
              search
              stickyBox={false}
              navOtherClass="navbar-other ms-lg-4"
              navClassName="navbar navbar-expand-lg classic transparent position-absolute navbar-light"
          />
        </header>

        {/* ========== main content ========== */}
        <main className="content-wrapper">
          {/* ========== hero section ========== */}
          <HeroSimulacaoFinalizada />

          {/* ========== what we do section ========== */}
          <Services29 />

          {/* ========== how it works section ========== */}
          <Process17 />

          <section className="wrapper bg-white">
            <div className="container py-15 py-md-17">

              <Pricing10 />

            </div>
          </section>
        </main>

        {/* ========== footer section ========== */}
        <Footer18 />
      </Fragment>
  );
};

export default SimulacaoFinalizada;
