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
    Row,
    Spinner,
} from 'react-bootstrap';
  import axios from 'axios';
  import ptBR from 'date-fns/locale/pt-BR';
  import { styled } from '@mui/material/styles';
  import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
  import CsLineIcons from 'cs-line-icons/CsLineIcons';
  import { dateEnBr, dateTimeEnBr } from '../../utils';
  import { configAxios } from "../../constants";
  import {BASE_URL} from "../../config";


   
const ModalProvaVida = (props) => {
    // const { mBeneficios, setMBeneficios, itemModal, id_beneficio } = props
    const { id_beneficio } = props
    const [isLoading, setIsLoading] = useState(true);
    const [docValidado, setDocValidado] = useState([]);
    const [showModal, setShowModal] = useState(true);

    // registerLocale('ptBR', ptBR);

    useEffect(async () => {
        await axios.get(`${BASE_URL}/data/getDocValidadoPorBenef/${id_beneficio}`, configAxios)
            .then((response) => {
                setDocValidado(response.data);
            }).catch(error => {
                console.log(error);
            }).finally(()=>{
                setIsLoading(false);
            });
    },[]);

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        width: 200,
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: 'red' //theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 5,
          backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
        },              
        }));    

    return (
        isLoading ? <Spinner variant="primary" animation="border" size="20"/> : 
        <>
            <Card body className="mb-5">
                {docValidado?.docs?.length <= 0 ? (
                    'Nenhuma validação encontrada'
                ) : (
                    <>
                        {docValidado?.docs?.map((item, index) => {
                            return (
                                <Card
                                    className="flex justify-content-center border mb-2 shadow bg-light"
                                    key={item.id}
                                >
                                    <Card.Header className='flex pt-2 pb-2 mt-0 mb-0 justify-content-center'>                                                
                                        <Row className='flex justify-content-center'>
                                            <Col sm={12} md={6} lg={6} className='flex text-left'>
                                                <Row className='flex text-left p-0'>  
                                                    <h5 className='p-0'><strong>Arquivo:</strong> {item.filename}</h5>
                                                </Row>
                                                <Row className='flex text-left p-0'>  
                                                    <h5 className='flex text-left p-0'><strong>Importado em: </strong>{dateTimeEnBr(item.upload_date)}</h5>
                                                </Row>
                                                <Row className='flex text-left gap-1'>  
                                                    {item.score ?                                                                                                                  
                                                        ( <>                                                                      
                                                            <BorderLinearProgress className="mt-1"  variant="determinate" value={ (item.score * 100).toFixed(0) }/> 
                                                            {`${(item.score * 100).toFixed(0) }%`}
                                                        </>  
                                                        ) : <span><Badge pill bg="danger" >Arquivo não avaliado</Badge></span>
                                                    }                                                        
                                                </Row>
                                            </Col>
                                        </Row>                                                
                                    </Card.Header>
                                    <Card.Body>
                                        <Row className="flex align-items-center justify-content-center">
                                            <Col sm={12} md={4} lg={4} className='text-center w-full'>
                                                {
                                                    ["image","application"].includes(item.mimeType.split("/")[0]) ?    
                                                        <>  
                                                            { item.mimeType.split("/")[0] === "image" ? 
                                                                <Image 
                                                                    src={ item.src_file }  
                                                                    alt="" 
                                                                    className="sw-200 sh-30 rounded-sm-start w-200"
                                                                    thumbnail />    
                                                                : <CsLineIcons icon="file-text" size={120} />
                                                            }
                                                            <div className='m-2'>
                                                                <Button
                                                                    size="sm" 
                                                                    variant="outline-primary" 
                                                                    title="Visualizar em tela cheia"
                                                                    onClick={() => {
                                                                        window.open(item.src_file, '_blank' );
                                                                    }}
                                                                ><i className="d-inline-block bi-clock"/>Ver
                                                                </Button>
                                                                
                                                            </div>                                                                        
                                                        </>
                                                    : (                                                        
                                                        <video width="300" controls >
                                                            <source 
                                                                src={item.src_file} 
                                                                // type={`video/${item.extensao}`}
                                                            />
                                                            <track
                                                                kind="captions"
                                                                srcLang="en"
                                                                src=""
                                                                label="Inglês"
                                                            />                                                                    
                                                            <p>Seu navegador não suporte o formato deste vídeo.</p>
                                                        </video> 
                                                    )
                                                }

                                            </Col>
                                            <Col sm={12} md={8} lg={8}> 
                                                {item?.validation?.map((itemValidation, indexValidation) => {
                                                    return (                                                            
                                                    <Row className="flex align-content-center justify-content-left gap-2" key={indexValidation}>
                                                        {  ["image","application"].includes(item.mimeType.split("/")[0]) ?  ( 
                                                            <>                                                                                                                                                                                                  
                                                                <BorderLinearProgress className="mt-1 color:green"  variant="determinate" value={ (itemValidation.api_campo_score * 100).toFixed(0) }/>
                                                                { itemValidation.api_campo_score ? (itemValidation.api_campo_score * 100).toFixed(0) : 0 }%
                                                                {`  -  ${itemValidation.api_campo_nome}: ${itemValidation.api_campo_valor}`}  
                                                            </>
                                                            ) : (
                                                                <>
                                                                <BorderLinearProgress className="mt-1 color:green"  variant="determinate" value={ (itemValidation.api_global_score * 100).toFixed(0) }/>
                                                                { itemValidation.api_global_score ? (itemValidation.api_global_score * 100).toFixed(0) : 0 }%
                                                                {`  -  Prova de vida`}                                                                         
                                                                </>
                                                            )
                                                        }
                                                    </Row>
                                                    ); 
                                                })}                                                  
                                            </Col>                                               
                                        </Row>
                                    </Card.Body>
                                </Card>
                            );
                        })}
                    </>
                )}
            </Card>
        </>
    );
};

export default ModalProvaVida;
