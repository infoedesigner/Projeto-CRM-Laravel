// cra imports
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from 'reportWebVitals.js';

// import redux requirements
import { Provider } from 'react-redux';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';
import { store, persistedStore } from 'store.js';

// import html head tags requirements
import { Helmet } from 'react-helmet';
import { REACT_HELMET_PROPS } from 'config.js';

// import multi language
import LangProvider from 'lang/LangProvider';

// import routing modules
import { BrowserRouter as Router } from 'react-router-dom';
import RouteIdentifier from 'routing/components/RouteIdentifier';
import Loading from 'components/loading/Loading';

// import routes
import { getLayoutlessRoutes } from 'routing/helper';
import defaultRoutes from 'routing/default-routes';
import routesAndMenuItems from 'routes.js';

// import toastify for notification
import { Slide, ToastContainer } from 'react-toastify';

// mock server register for demo
import '@mock-api';
import { ApolloProvider } from '@apollo/client';
import { client } from './lib/apollo';

const Main = () => {
    const layoutlessRoutes = useMemo(() => getLayoutlessRoutes({ data: routesAndMenuItems }), []);
    return (
        <ApolloProvider client={client}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistedStore}>
                    <Helmet {...REACT_HELMET_PROPS} />
                    <ToastContainer transition={Slide} newestOnTop />
                    <Router basename={process.env.REACT_APP_BASENAME}>
                        <LangProvider>
                            <RouteIdentifier routes={[...layoutlessRoutes, ...defaultRoutes]} fallback={<Loading />} />
                        </LangProvider>
                    </Router>
                </PersistGate>
            </Provider>
        </ApolloProvider>
    );
};

ReactDOM.render(<Main />, document.getElementById('root'));

reportWebVitals();
