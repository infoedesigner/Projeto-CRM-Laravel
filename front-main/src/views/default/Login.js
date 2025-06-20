import React, {useState} from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import {Alert, Button, Form, Spinner} from 'react-bootstrap';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {BASE_URL_LOGIN} from "../../config";
import {USER_ROLE} from "../../constants";
import {setCurrentUser} from "../../auth/authSlice";

const Login = () => {
    const title = `Login ${process.env.REACT_APP_VERSION}` || 'Login';
    const description = 'Acesso a plataforma Carrera Carneiro';

    const validationSchema = Yup.object().shape({
        email: Yup.string().email().required('O e-mail é obrigatório'),
        password: Yup.string().min(6, 'Precisar ter no mínimo 6 caracteres!').required('Senha incorreta'),
    });
    const initialValues = {email: '', password: ''};

    const history = useHistory();

    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [dismissingAlertShow, setDismissingAlertShow] = useState(false);

    const onSubmit = (values) => {
        axios
            .post(`${BASE_URL_LOGIN}/login`, {
                email: values.email,
                password: values.password,
            })
            .then((response) => {

                if (response.data.success === true) {
                    dispatch(
                        setCurrentUser({
                            id: response.data.data.id,
                            role: parseInt(response.data.data.admin,10) === 1 ? USER_ROLE.Admin : USER_ROLE.Editor,
                            name: response.data.data.name,
                            thumb: '/img/profile/profile-9.webp',
                            email: response.data.data.email,
                            token: response.data.data.token,
                        })
                    );

                    sessionStorage.setItem('token',response.data.data.token);

                    return history.push('/dashboard/vendas');
                }

                setDismissingAlertShow(true);
                return false;

            })
            .catch((error) => {
                console.log('Login e/o senha inválidos.');
            });
    };

    const formik = useFormik({initialValues, validationSchema, onSubmit});
    const {handleSubmit, handleChange, values, touched, errors} = formik;

    const leftSide = (
        <div className="min-h-100 d-flex align-items-center">
            <div className="w-100 w-lg-75 w-xxl-50">
                <div>
                    <div className="mb-5">
                        <h1 className="display-3 text-white">CARRERA CARNEIRO</h1>
                        <h1 className="display-3 text-white">Liberdade financeira com inteligência</h1>
                    </div>
                    <p className="h6 text-white lh-1-5 mb-5">
                        O empréstimo consignado é uma modalidade de crédito destinada a aposentados, pensionistas e
                        servidores públicos. No consignado, o valor das parcelas de seu empréstimo é descontado
                        automaticamente de sua folha de pagamento ou benefício do INSS.
                    </p>
                </div>
            </div>
        </div>
    );

    const rightSide = (
        <div
            className="sw-lg-70 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 full-page-content-right-border">
            <div className="sw-lg-50 px-5">
                <div className="sh-11">
                    <NavLink to="/">
                        <div className="logo-default"/>
                    </NavLink>
                </div>
                {/* <div> */}
                {/*    <Alert variant="info"> {`Versão ${process.env.REACT_APP_VERSION}`} parcialmente aplicada.</Alert> */}
                {/* </div> */}
                <div className="mb-5">
                    <h2 className="cta-1 mb-0 text-primary">Bem vindo,</h2>
                    <h2 className="cta-1 text-primary">vamos começar?!</h2>
                    <Alert variant={process.env.REACT_APP_AMBIENTE === 'PRODUCAO' ? 'success' : 'warning'}>Ambiente: {process.env.REACT_APP_AMBIENTE}</Alert>
                </div>
                <div className="mb-5">
                    <p className="h6">Por favor, informe suas credências de acesso.</p>
                    <p className="h6">
                        Não tem cadastro ainda? <NavLink to="/register">Cadastro</NavLink>.
                    </p>
                </div>
                <div>
                    <form id="loginForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
                        <div className="mb-3 filled form-group tooltip-end-top">
                            <CsLineIcons icon="email"/>
                            <Form.Control type="text" name="email" placeholder="E-mail" value={values.email}
                                          onChange={handleChange}/>
                            {errors.email && touched.email &&
                                <div className="d-block invalid-tooltip">{errors.email}</div>}
                        </div>
                        <div className="mb-3 filled form-group tooltip-end-top">
                            <CsLineIcons icon="lock-off"/>
                            <Form.Control type="password" name="password" onChange={handleChange}
                                          value={values.password} placeholder="Senha"/>
                            <NavLink className="text-small position-absolute t-3 e-3" to="/forgot-password">
                                Esqueceu sua senha?
                            </NavLink>
                            {errors.password && touched.password &&
                                <div className="d-block invalid-tooltip">{errors.password}</div>}
                        </div>
                        {dismissingAlertShow && (
                            <Alert variant="danger" onClose={() => setDismissingAlertShow(false)} dismissible>
                                <strong>Ops! </strong> E-mail e/ou senha inválidos.
                            </Alert>
                        )}
                        <Button size="lg" type="submit">
                            Login
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <HtmlHead title={title} description={description}/>
            <LayoutFullpage left={leftSide} right={rightSide}/>
        </>
    );
};

export default Login;
