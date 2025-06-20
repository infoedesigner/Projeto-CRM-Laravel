import React, { FormEvent, Fragment, useState } from 'react';
import { Alert, Col, Form, Row } from 'react-bootstrap';
import * as yup from 'yup';
import { useFormik, useFormikContext } from 'formik';
import Dropzone, { defaultClassNames } from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import DropzonePreview from 'components/dropzone/DropzonePreview';
import { BASE_URL, BASE_URL_DOCS } from '../../../config';

export function ImportTabela(props) {
    const [loading, setLoading] = useState(false);
    const { setImportModal, idImportacao, GET_DATA } = props;

    const getUploadParams = ({ file, meta }) => {
        const body = new FormData();
        body.append('file', file);
        body.append('id_tabela', idImportacao);
        return {
            url: `${BASE_URL_DOCS}/importTabelaExcel`,
            body,
            headers: {
                maxAgeSeconds: 3600,
                method: ['GET', 'HEAD', 'PUT', 'POST'],
            },
        };
    };

    const onChangeStatus = (fileWithMeta, status) => {
        if (status === 'done') {
            GET_DATA();
            setImportModal(false);
        }
    };

    return (
        <>
            {loading ? (
                <p>Salvando...</p>
            ) : (
                <Row>
                    <Col>
                        <Dropzone
                            getUploadParams={getUploadParams}
                            PreviewComponent={DropzonePreview}
                            submitButtonContent={null}
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            submitButtonDisabled
                            SubmitButtonComponent={null}
                            inputWithFilesContent={null}
                            onChangeStatus={onChangeStatus}
                            classNames={{
                                inputLabelWithFiles:
                                    defaultClassNames.inputLabel,
                            }}
                            inputContent="Arraste seus arquivos aqui"
                            multiple={false}
                        />
                    </Col>
                </Row>
            )}
        </>
    );
}
