import React from 'react';
import {Button, Card, CardBody, CardHeader, Col, Row, Spinner} from 'react-bootstrap';
import Dropzone, { defaultClassNames } from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import DropzonePreview from 'components/dropzone/DropzonePreview';
import axios from "axios";

import swal from "@sweetalert/with-react";
import {BASE_URL} from "../../config";
import {configAxios} from "../../constants";

const DropzoneUpload = (props) => {

    const { id_beneficio } = props;

    const [filesApi, setFilesApi] = React.useState([]);

    const getFiles = async () => {
        await axios
            .get(`${BASE_URL}/data/v1/docs?id_beneficio=${id_beneficio}`, configAxios)
            .then((res) => {
                setFilesApi(res.data);
            })
            .finally(()=>{
                console.log('Carregado com sucesso!');
            })
            .catch((error_axios) => {
                swal('ERRO', `${error_axios}`, 'error');
            });
    }

    const getUploadParams = ({ file, meta }) => {

        const body= new FormData()
        body.append('file', file)
        body.append('id_beneficio', id_beneficio)

        return { url: `${BASE_URL}/data/v1/docs`,body }
    }

    const handleChangeStatus = ({ meta, file }, status) => {
        console.log(status, meta, file);
        getFiles();
    }

    const handleSubmit = (files, allFiles) => {
        allFiles.forEach(f => f.remove());
        getFiles();
    }

    const addMeta = (fileWithMeta) => {
        const { meta } = fileWithMeta
        meta.additionalData = {
            id_beneficio,
            check: 0
        }
    }

    const downloadFile = (id) => {

        axios.get(`${BASE_URL}/data/v1/view-docs/${id}`, { responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', response.headers['content-disposition'].split('filename=')[1]);
                document.body.appendChild(link);
                link.click();
            })
            .catch(error => console.log(error));

    }


    return (
        <>
            <Row>
                <Col sm={12} md={12} lg={12}>
                    <Dropzone
                        addMeta={addMeta}
                        getUploadParams={getUploadParams}
                        onChangeStatus={handleChangeStatus}
                        PreviewComponent={DropzonePreview}
                        submitButtonContent={null}
                        onSubmit={handleSubmit}
                        inputWithFilesContent={null}
                        classNames={{ inputLabelWithFiles: defaultClassNames.inputLabel }}
                        inputContent="Arraste seus arquivos aqui, ou clique."
                        autoUpload
                        submitButtonDisabled
                    />
                </Col>
                <Col>
                    <Card>
                        <CardHeader>
                            Arquivos
                        </CardHeader>
                        <CardBody>
                            <ul>
                                {filesApi.map((file, index) => (
                                    <li key={index}>
                                        <strong>Arquivo:</strong> {file.filename}<br />
                                        <strong>Extensão:</strong> {file.extensao}<br />
                                        <Button onClick={() => {
                                            downloadFile(file.id)
                                        }}>Download</Button>
                                    </li>
                                ))}
                            </ul>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );

}

export default DropzoneUpload;
