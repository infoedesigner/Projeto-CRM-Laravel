import { FC, useCallback, useEffect, useState } from "react"; // Removido 'React' entre {} pois não é necessário
import { Button, Card, CardBody, CardHeader, Col, Row, Spinner } from 'react-bootstrap';
import Dropzone, { defaultClassNames, IFileWithMeta, ILayoutProps  } from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import DropzonePreview from 'components/dropzone/DropzonePreview';
import DopzoneLayout from "./DopzoneLayout";

type DropzoneUploadProps = {
    id_beneficio: string;
    descricao: string;
    chekDocumento: any;
}

const DropzoneUpload: FC<DropzoneUploadProps> = ({ id_beneficio, descricao, chekDocumento }) => {

    const handleChangeStatus = ({ meta }, status: any) => {
        console.log(status, meta)
      }

    const handleSubmit = (files: any[], allFiles: any[]) => {
        chekDocumento(allFiles);
        allFiles.forEach(f => f.remove());
    };

    return (
        <>
            <Row>
                <Col sm={12} md={12} lg={12}>
                    <Dropzone
                        classNames={{ inputLabelWithFiles: defaultClassNames.inputLabel }}
                        onChangeStatus={handleChangeStatus}
                        LayoutComponent={DopzoneLayout}   
                        PreviewComponent={DropzonePreview}                     
                        onSubmit={handleSubmit}                                                                    
                        autoUpload
                        styles={{ dropzone: { minHeight: 100, maxHeight: 200, width: "95%", marginTop: 20, marginBottom: 20, overflow: "hidden" } }}                                                       
                        inputContent={descricao}
                        inputWithFilesContent={"Adicionar mais arquivos"}
                        submitButtonContent="enviar"
                    />
                </Col>
            </Row>
        </>
    );
};

export default DropzoneUpload;
