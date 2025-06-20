import { FC, useRef, useState, useCallback, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Webcam from "react-webcam";
import axios from "axios";
import 'animate.css';

type VideoFaceProps = {
  etapa: string;
  beneficio:string | any;
  host:string | any;
  addPasso: any;
  setIsLoading: boolean | any;
}

const VideoFace: FC<VideoFaceProps> = ({ host, beneficio, etapa, addPasso, setIsLoading}) => {  
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);  
  const [olhar, setOlhar] = useState('frente');
  const [gravar, setGravar] = useState(false);
  const [seconds, setSeconds] = useState(3);

  const videoConstraints = {
    aspectRatio: 1.33333333,
    acingMode: "user",
      // width: { min: 480, ideal: 480 },
      // height: { min: 720, ideal: 720 },
 };

    const handleDataAvailable = useCallback(
        ({ data }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const handleStopCaptureClick = useCallback(() => {
        // @ts-ignore
        mediaRecorderRef.current.stop();
        setCapturing(false);
        setGravar(false);
    }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleStartCaptureClick = useCallback(() => {
    setGravar(true);
    setCapturing(true);
    // @ts-ignore
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    // @ts-ignore
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    // @ts-ignore
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDownload = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm"
      });

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Video = reader.result;

        setIsLoading(true);

        // Enviar o vídeo para o servidor
        const config = {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data,video/webm',
            'Access-Control-Allow-Origin':'true'
          }
        }; 
    
        const body = new FormData();
        body.append('etapa', etapa);
        // @ts-ignore
        body.append('base64Video', base64Video);
        body.append('id_beneficio', beneficio);
        body.append('movements', 'rigth, left');
        body.append('fileName', `prova-vida-${beneficio}.webm`);
        body.append('fileType', `video/webm`);
        body.append('fileExtension', `webm`);
    
        await axios.post(`${host}/api/data/save-video`, body, config)
            .then((response) => {
              console.log(response);
              if(response.status == 200){
                setRecordedChunks([]);           
              }else{
                console.log('Erro ao salvar o vídeo.');
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
      reader.readAsDataURL(blob);      
    };
  };

  useEffect(() => {
    if(gravar){
      const intervalId = setInterval(() => {
        switch (olhar) {
          case 'frente':
            setOlhar('direita');
            break;
          case 'direita':
            setOlhar('esquerda');
            break;
          case 'esquerda':
            setOlhar('frente');
            break;
          default:
            break;
        }
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else {
          handleStopCaptureClick();
        }        
      }, 3000);

      return () => clearInterval(intervalId);
    }
    
  }, [seconds, gravar]);

  return ( 
    <>
      <Row className="flex justify-content-center align-items-center text-center">
        <Col  sm={12} md={12} lg={12} >
          <h5>Vamos gravar um vídeo para Prova de vida!</h5>
          <h5>Importante tirar óculos, boné e estar em um ambiente iluminado.</h5>
        </Col>
      </Row>
      <Row className="flex justify-content-center">
        <Col className="flex justify-content-center" sm={12} md={12} lg={12}>
          <div className="flex text-truncate border border-dark border-circle border-shadow-lg  mt-2 mb-2" 
            style={{ backgroundColor: "blue",
              borderRadius: "50%",
              width: "300px",
              height: "300px",
              margin: "auto",
              overflow: "hidden",              
              // paddingLeft: "0px"
              // alignContent: "center",
              // alignItems: "center",
              // verticalAlign: "top"
              }} >
                
            <Webcam               
              videoConstraints={videoConstraints}
              audio= {false}
              ref={webcamRef}
              disablePictureInPicture= {false}
              forceScreenshotSourceSize=  {false}
              imageSmoothing= {false}
              mirrored= {true}            
              width={480} 
              height={360}      
            />                                            
          </div>                     
        </Col>                       
        {capturing ? (
                <Container className="text-center">
                <Row>
                  <Col>
                    <div className={`animate__animated ${olhar === 'frente' ? 'animate__fadeIn' : olhar === 'direita' ? 'animate__fadeInLeft' : 'animate__fadeInRight'}`}>
                      {olhar === 'frente' ? (
                        <h1>Olhe para frente!</h1>
                      ) : olhar === 'direita' ? (
                        <h1>Vire para direita!<i className="uil uil-arrow-right" /> </h1>
                      ) : (
                        <h1><i className="uil uil-arrow-left" /> Vire para esquerda!</h1>
                      )}
                    </div>
                  </Col>
                </Row>
              </Container>                 
            ) : (
              recordedChunks.length == 0 && <Button onClick={handleStartCaptureClick}>Iniciar</Button>
            )}
            {recordedChunks.length > 0 && (
              <Button onClick={handleDownload}>Salvar</Button>
            )}                          
      </Row>
    </>    
  );
};

export default VideoFace;
