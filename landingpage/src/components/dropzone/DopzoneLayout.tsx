import { ILayoutProps } from 'react-dropzone-uploader'

// add type defs to custom LayoutComponent prop to easily inspect props passed to injected components
const DopzoneLayout = ({ input, previews, submitButton, dropzoneProps, files, extra: { maxFiles } }: ILayoutProps) => {
  return (
    <div>
      {previews}

      <div {...dropzoneProps}>{files.length < maxFiles && input}</div>

      {files.length > 0 && submitButton}
    </div>
  )
}

export default DopzoneLayout;