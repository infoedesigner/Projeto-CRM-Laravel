import React from 'react';
import { NavLink } from 'react-router-dom';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';

const NotFound = () => {
    const title = '404 Not Found';
    const description = '404 Not Found Page';

    const rightSide = (
        <div className="sw-lg-80 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 full-page-content-right-border">
            <div className="sw-lg-60 px-5">
                <div className="sh-11">
                    <NavLink to="/">
                        <div className="logo-default" />
                    </NavLink>
                </div>
                <div className="mb-5">
                    <h2 className="cta-1 mb-0 text-primary">
                        Ooops, algo de errado não está certo.
                    </h2>
                    <h2 className="display-2 text-primary">404 Not Found</h2>
                </div>
                <div className="mb-5">
                    <p className="h6">
                        Se você está vendo essa página, é porque a que você
                        buscou não existe!
                    </p>
                </div>
                <div>
                    <NavLink
                        to="/login"
                        className="btn btn-icon btn-icon-start btn-primary"
                    >
                        <CsLineIcons icon="arrow-left" /> <span>Login</span>
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

export default NotFound;
