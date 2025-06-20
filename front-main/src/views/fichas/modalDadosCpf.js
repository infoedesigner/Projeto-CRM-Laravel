import React, { useEffect, useState } from 'react';
import {
    Badge,
    Button,
    ButtonGroup,
    Card,
    Col,
    Form,
    Image,
    ListGroup,
    Modal,
    Nav,
    Row,
    Spinner,
    Tab,
} from 'react-bootstrap';
  import axios from 'axios';
  import ptBR from 'date-fns/locale/pt-BR';
  import { styled } from '@mui/material/styles';
  import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
  import { useDispatch } from 'react-redux';
  import { Chip, Divider, Link } from '@mui/material';
  import Swal from 'sweetalert2';
  import { configAxios } from "../../constants";
  import {BASE_URL} from "../../config";
  import { dateEnBr, dateTimeEnBr } from '../../utils';
   
const  ModalDadosCpf = ({ cpf = '', id_beneficio = '', show = false, onHide = () => {} }) => {
    const dispatch = useDispatch();  
    const [isLoadingPerson, setIsLoadingPerson] = useState(false);
    const [isLoadingBasic, setIsLoadingBasic] = useState(false);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);
    const [isLoadingCpf, setIsLoadingCpf] = useState(false);
    const [person, setPerson] = useState();
    const [basicData, setBasicData] = useState();
    const [address, setAddress] = useState();

 
    const getStatusCpf = async () => {
        setIsLoadingPerson(true);
        await axios.get(`${BASE_URL}/data/v1/mostqi/status-cpf/${id_beneficio}`, configAxios)
            .then((response) => {
                setPerson(response.data);
            }).catch(error => {
                console.log(error);
            }).finally(()=>{
                setIsLoadingPerson(false);
            })
    };

    const getDadosBasicos = async () => {
        setIsLoadingBasic(true);
        await axios.get(`${BASE_URL}/data/v1/mostqi/dados-basicos/${id_beneficio}`, configAxios)
            .then((response) => {
                setBasicData(response.data);
            }).catch(error => {
                console.log(error);
            }).finally(()=>{
                setIsLoadingBasic(false);
            })
    };    
 
    const getEnderecos = async () => {
        setIsLoadingAddress(true);
        await axios.get(`${BASE_URL}/data/v1/mostqi/endereco/${id_beneficio}`, configAxios)
            .then((response) => {
                setAddress(response.data);
            }).catch(error => {
                console.log(error);
            }).finally(()=>{
                setIsLoadingAddress(false);
            })
    };  


    useEffect(async () => {    
        if(id_beneficio > 0) {
            getStatusCpf();
            getDadosBasicos();
            getEnderecos();
        }        
    },[id_beneficio]);     

    const consultarCpf = async () => {
        Swal.fire({
            title: `Consultar CPF ${cpf}`,
            html: "Atenção, deseja pesquisar a situação do CPF?<br> Essa pesquisa gera custos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#da1919',
            cancelButtonColor: '#52e152',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
        }).then( async(result) => {
            if (result.isConfirmed) {
                setIsLoadingCpf(true);
                setIsLoadingAddress(true);
                setIsLoadingBasic(true);
                setIsLoadingPerson(true);

                await axios.post(`${BASE_URL}/data/v1/mostqi/consulta-cpf/${cpf}/${id_beneficio}`, configAxios)
                    .then((response) => {                        
                        if(id_beneficio > 0) {
                            getStatusCpf();
                            getDadosBasicos();
                            getEnderecos();
                        }                          
                    }).catch(error => {
                        console.log(error);
                    }).finally(()=>{                       
                        setIsLoadingCpf(false);
                        setIsLoadingAddress(false);
                        setIsLoadingBasic(false);
                        setIsLoadingPerson(false);                        
                    })
            }
        })
    };    

    return (
        <Modal className="modal-right scroll-out-negative"
            show={show} 
            onHide={onHide}
        >
            <Tab.Container defaultActiveKey="status">
                <Modal.Header closeButton className='border shadow-sm'>                
                    <Nav className="nav-tabs-line card-header-tabs" variant="tabs" activeKey="status">
                        <Nav.Item>
                            <Nav.Link eventKey="status">
                                Status
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="dados-basicos">
                                Dados
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="endereco">
                                Endereços
                            </Nav.Link>
                        </Nav.Item>  
                    </Nav> 
                </Modal.Header>                
                    <Modal.Body className="border shadow-lg d-flex flex-column"> 
                    <Tab.Content>
                        <Tab.Pane eventKey="status">
                            <Card>
                                <Card.Body>                     
                                    { isLoadingPerson ? <Spinner animation="border" variant="light" size="lg"/> : 
                                        (<>                                            
                                            { person ? 
                                                (<>
                                                    <Card.Title tag="h5">{person?.name}</Card.Title>
                                                    <Card.Text>
                                                        <strong>Protocolo:</strong> {person?.protocolNumber}<br />
                                                        <strong>Status do CPF:</strong> {person?.baseStatus} <br />
                                                        <strong>Data de nascimento:</strong> {dateEnBr(person?.birthdate)} <br />
                                                        <strong>Nome social:</strong> {person?.socialName} <br />
                                                        <strong>Data de registro:</strong> {dateEnBr(person?.registrationDate)} <br />
                                                        { person?.isDead === 1 && (
                                                            <Badge bg="danger">Falecido ({person?.deathYear})</Badge>
                                                        )}
                                                        { person?.isDead === 0 && (
                                                            <Badge bg="success">Vivo</Badge>
                                                        )}
                                                        <br /><strong>Consultado em: </strong>{dateEnBr(person?.created_at)}<br />
                                                        { person?.status === "ERROR" && ( 
                                                            <small className="bg-danger"> Erro ({person?.errors})</small>
                                                        )}
                                                    </Card.Text>
                                                </>): "Este CPF ainda não foi consultado."                                            
                                            }
                                        </>)
                                    }
                                </Card.Body>
                            </Card>
                        </Tab.Pane>
                        <Tab.Pane eventKey="dados-basicos">
                            <Card>
                                <Card.Body>
                                    { isLoadingBasic ? (<Spinner animation="border" variant="light" size="lg"/>) : 
                                        (<>
                                            <Card.Title tag="h5">{basicData?.name}</Card.Title>
                                            { basicData ? 
                                                <Card.Text>
                                                    <strong>Nome comum:</strong> {basicData?.commonName}<br />
                                                    <strong>Nome padronizado:</strong> {basicData?.standardizedizedName} <br />
                                                    <strong>Gênero:</strong> {basicData?.gender} <br />
                                                    <strong>Idade:</strong> {basicData?.age} <br />
                                                    <strong>Data de nascimento:</strong> {dateEnBr(basicData?.birthDate)} <br />
                                                    <strong>Signo:</strong> {basicData?.zodiacSign} <br />
                                                    <strong>Nascionalidade:</strong> {basicData?.birthCountry} <br />
                                                    <strong>Nome da mãe:</strong> {basicData?.motherName} <br />
                                                    <strong>Nome do pai:</strong> {basicData?.fatherName} <br />
                                                    <strong>Estado civil:</strong> {basicData?.maritalStatusData} <br />
                                                    <strong>Origem dos dados:</strong> {basicData?.taxIdOrigin} <br />
                                                    <strong>Situação:</strong> {basicData?.taxIdStatus} <br />
                                                    <strong>Data da situação:</strong> {dateEnBr(basicData?.taxIdStatusDate)} <br />
                                                    <strong>Data de registro:</strong> {dateEnBr(basicData?.taxIdStatusRegistrationDate)} <br />
                                                    <strong>Última atualização:</strong> {dateEnBr(basicData?.lastUpdateDate)} <br />                                 
                                                    { basicData?.hasObitIndication ? (
                                                        <Badge bg="danger">Falecido</Badge>
                                                    ) : ( 
                                                        <Badge bg="success">Vivo</Badge>
                                                    )}
                                                    <br /><strong>Consultado em: </strong>{dateEnBr(basicData?.created_at)}<br />
                                                    { basicData?.status === "ERROR" && ( 
                                                        <small className="bg-danger"> Erro ({basicData?.errors})</small>
                                                    )}
                                                </Card.Text>
                                                : "Este CPF não foi consultado"
                                            }
                                        </>)
                                    }
                                </Card.Body>
                            </Card>
                        </Tab.Pane>
                        <Tab.Pane eventKey="endereco">
                            <Card>
                                <Card.Body>
                                    { isLoadingPerson ? (<Spinner animation="border" variant="light" size="lg"/>) : 
                                        (<>
                                            <Card.Title tag="h5">{address?.name}</Card.Title>
                                            { 
                                                address && address.length > 0 ? 
                                                <>  
                                                    { address?.map((item,k) => {
                                                    return (
                                                        <Card.Text key={k} className='shadow-sm border p-2'>
                                                            <strong>Logradouro:</strong> {item?.typology} {item?.addressMain}<br />
                                                            <strong>Número:</strong> {item?.number} <br />
                                                            <strong>Complemento:</strong> {item?.complement} <br />
                                                            <strong>Bairro:</strong> {item?.neighborhood} <br />
                                                            <strong>Cidade:</strong> {item?.city} <br />
                                                            <strong>UF:</strong> {item?.state} <br />
                                                            <strong>CEP:</strong> {item?.zipCode} <br />
                                                            <strong>País:</strong> {item?.country} <br />
                                                            <strong>Tipo:</strong> {item?.type} <br />                                                        
                                                            <strong>Criado em:</strong> {dateEnBr(item?.creationDate)} <br />                                            
                                                            <strong>Última atualização:</strong> {dateEnBr(item?.lastUpdateDate)} <br />                                
                                                            { item?.isActive && item?.isActive === 1  ? (
                                                                <Badge bg="success">Ativo</Badge>
                                                            ) : ( 
                                                                <Badge bg="danger">Inativo</Badge>
                                                            )}
                                                            { item?.priority && item?.priority === 1 ? (
                                                                <Badge bg="success">Principal</Badge>
                                                            ) : ( 
                                                                <Badge bg="warning">Endereço {item?.priority}</Badge>
                                                            )}                                            
                                                            <br /><Link
                                                                href={`https://www.google.com/search?q=${item?.latitude}%2C+${item?.longitude}`}
                                                                rel="noopener" 
                                                                target="_blank" 

                                                            >
                                                                Google Maps
                                                            </Link>                                            
                                                            <br /><strong>Consultado em: </strong>{dateEnBr(item?.created_at)}<br />
                                                            { item?.status === "ERROR" && ( 
                                                                <small className="bg-danger"> Erro ({item?.errors})</small>
                                                            )}                                                            
                                                        </Card.Text>
                                                    )
                                                    }) }
                                                </>
                                                : "Este CPF não foi consultado."
                                            }
                                        </>)
                                    }
                                </Card.Body>
                            </Card>
                        </Tab.Pane> 
                    </Tab.Content>
                    </Modal.Body>
            </Tab.Container>         
            <Modal.Footer className='border'>
                <Button
                    onClick={consultarCpf}
                >
                    Atualizar
                </Button>
            </Modal.Footer>                          
        </Modal>                          
    );
};

export default ModalDadosCpf;
