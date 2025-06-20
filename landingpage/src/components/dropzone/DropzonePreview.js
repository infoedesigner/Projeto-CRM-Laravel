import React from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';

const DropzonePreview = ({ meta, fileWithMeta }) => {
  const { remove } = fileWithMeta;
  const { name, status, previewUrl, size } = meta;

  return (
    <Row className="sw-40 border border-1 border-separator g-0 rounded m-2 position-relative z-index-1">
      <Col xs="auto" className="position-relative">
        {previewUrl ? (
          <img src={previewUrl} alt="preview image" height={60} width={90}  className="sw-12 sh-9 rounded-sm-start" />
        ) : (
          <div className="sw-12 sh-9 d-flex justify-content-center align-items-center">
            <i className="uil uil-file-alt" />
          </div>
        )}
        {(status === 'error_upload_params' || status === 'exception_upload' || status === 'error_upload') && (
          <div className="dzu-preview-error z-index-0 bg-danger">
            <i className="btn-close" />
          </div>
        )}
        {status !== 'error_upload_params' && status !== 'exception_upload' && status !== 'error_upload' && status !== 'done' && (
          <div className="dzu-preview-spinner">
            <Spinner animation="border" size="sm" variant="primary" className="dzu-spinner-border" />
          </div>
        )}
      </Col>
      <Col className="px-3 d-flex flex-column justify-content-center">
        <div className="d-flex justify-content-between">
          <div>
            <p className="mb-1 pe-2 sw-20 fs-12">{name}</p>
            <div className="fs-12 text-primary">{Math.round(size / 1000)} KB</div>
          </div>
          {status !== 'preparing' && status !== 'getting_upload_params' && status !== 'uploading' && (
            <button className="btn p-0 fs-30" type="button" onClick={remove}>
              <i className="uil uil-trash text-red"/>
            </button>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default DropzonePreview;
