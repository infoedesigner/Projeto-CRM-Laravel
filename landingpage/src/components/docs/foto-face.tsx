import { FC, useRef, useState, useCallback } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import Webcam from "react-webcam";
import axios from "axios";

type FotoFaceProps = {
  etapa: string;
  beneficio:string | any;
  host:string | any;
  addPasso: any;
  setIsLoading: boolean | any;
}

const FotoFace: FC<FotoFaceProps> = ({ host, beneficio, etapa, addPasso, setIsLoading}) => {  

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState('');

  const capture = useCallback(() => {
      // @ts-ignore
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    window.scroll({ top: 430, left: 0, behavior: 'smooth' });
  }, [webcamRef, setImgSrc]);

 
  const savePhoto = async () => {
    
    window.scrollTo(0, 0);

    if (imgSrc === '') {
      alert("Nenhum arquivo foi selecionado.");
      return;
    }

    setIsLoading(true);

    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data,image/png',
        'Access-Control-Allow-Origin':'true'
      }
    }; 

    const body = new FormData();
    body.append('etapa', etapa);
    body.append('base64Photo', imgSrc);
    body.append('id_beneficio', beneficio);
    // body.append('tags', '');
    // body.append('returnedImageQuality', '');

    await axios.post(`${host}/api/data/save-photo`, body, config)
        .then((response) => {
          console.log(response);
          if(response.data.code == 200){
            setImgSrc('');            
          }else{
            console.log('erro ao salvar a foto');
          }            
        }).then(() =>{
          addPasso();
        })
        .catch((error) => {
            alert(error);
        }).finally(() => {
          setIsLoading(false);
        })
  };   

  return ( 
    <>
      <Row className="flex justify-content-center align-items-center text-center">
        <Col  sm={12} md={12} lg={6} >
          <h5>Hora da foto!</h5>
          <h5>Importante tirar óculos, boné e estar em um ambiente iluminado, e permitir acesso a câmera.</h5>
        </Col>
      </Row>
      <Row className="flex justify-content-center align-items-center text-center mb-10">
        <Col className="flex align-content-center" sm={6} md={6} lg={6}>
          <div className="flex mt-2" 
            style={{ backgroundColor: "white",
              margin: "auto",                
              overflow: "hidden",
              alignContent: "center",
              alignItems: "center",
              verticalAlign: "center"}} >
            <Webcam 
              audio= {false}
              ref={webcamRef}
              disablePictureInPicture= {false}
              forceScreenshotSourceSize=  {false}
              imageSmoothing= {false}
              mirrored= {true}
              height={300}
              min-width={300}       
              screenshotFormat= {"image/png"}
              // onUserMedia = { fn()}
            />               
          </div>                 
          <Button className="flex w-100" onClick={capture}>Capturar foto</Button>
        </Col>        
      </Row>
      <Row className="flex justify-content-center align-items-center text-center gap-2 ">        
        <Col className="flex align-content-center" sm={6} md={6} lg={6}>
          {imgSrc && (
            <>
              <img src={imgSrc}   
                alt="Foto tirada"
                height={300}
                width={370} />              
              <Button className="btn btn-success flex mt-2 w-100" onClick={savePhoto}>Salvar foto</Button>
              </>
          )}   
        </Col>      
      </Row>
    </>
  );
};

export default FotoFace;
