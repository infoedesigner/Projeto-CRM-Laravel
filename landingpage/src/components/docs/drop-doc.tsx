import { FC, useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import DropzoneUpload from 'components/dropzone/DropzoneUpload';
import axios from "axios";

type DropDocumentProps = {
  etapa: string;
  beneficio:string  | any;
  host:string | any;
  addPasso: any;
  setIsLoading: boolean | any;
}
const DropDocument: FC<DropDocumentProps> = ({ host, beneficio, etapa, addPasso, setIsLoading}) => {

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [docValidado, setDocValidado] = useState([]);

  const config = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data,image/jpeg',
      'Access-Control-Allow-Origin':'true'
    }
  }; 

  //envia arquivo para servidor
  const chekDocumento = async (allFiles) => {

    if (allFiles.length === 0) {
      alert("Nenhum arquivo foi selecionado.");
      return;
    }

    setIsLoading(true);
    
    const body = new FormData();

    for (let i = 0; i < allFiles.length; i++) {
      body.append('file[]', allFiles[i]['file']);
    }

    body.append('returnImage', 'false');    
    body.append('returnCrops', 'false');
    body.append('checkEnrichment', 'false');
    body.append('etapa', etapa);
    body.append('beneficio', beneficio);
    // body.append('tags', '');
    // body.append('returnedImageQuality', '');

    await axios.post(`${host}/api/mostqi/process-image/content-extraction`, body, config)
        .then((response) => {
          if(response.data.code == 200){
            console.log(response);
          }else{
            console.log(response);
          }            
        }).then(() =>{
          addPasso();
          console.log(docValidado);
        })
        .catch((error) => {
            alert(error);
        }).finally(() => {
          setIsLoading(false);
        })
  };  

  useEffect(() => {
    switch(etapa){
        case 'doc-pessoal':
          setTitulo('Para concluirmos seu pedido de empréstimo precisamos que nos envie seus documentos pessoais.');
          setDescricao('Arraste aqui o arquivo ou foto do seu RG, CNH, RNE ou clique para selecioná-los.');
          break;
        case 'doc-benef':
          setTitulo('Agora nos envie o documento do beneficiário.');
          setDescricao('Arraste aqui o arquivo ou foto do seu RG, CNH, RNE ou clique para selecioná-los.') ;   
          break;
        case 'cartao-conta':
          setTitulo('Envie a foto do cartão da conta-corrente para o crédito.');
          setDescricao('Arraste aqui o arquivo ou foto do cartão da conta ou clique para selecioná-lo.') ;   
          break;
        case 'cartao-benef':
          setTitulo('Envie a foto do cartão do benefício.');
          setDescricao('Arraste aqui o arquivo ou foto do cartão benefício ou clique para selecioná-lo.') ;   
          break;                      
        default:
          setTitulo('Para concluirmos seu pedido de empréstimo precisamos que nos envie seus documentos pessoais.');
          setDescricao('Arraste aqui o arquivo ou foto do seu RG, CNH, RNE ou clique para selecioná-los.');
          return;        
    }
    // '', ''
  },[etapa] )

    return (
    <>
      <div className="text-center">
        <h3 className="text-success">{ titulo } </h3>
      </div>
    
      <div className="border b-1 rounded">
          <DropzoneUpload 
            id_beneficio={beneficio} 
            descricao={ descricao } 
            chekDocumento={chekDocumento} 
            />
      </div>
    </>
  );
};

export default DropDocument;
