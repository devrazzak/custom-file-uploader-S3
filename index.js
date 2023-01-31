import React, {useState} from 'react';
import {ReactComponent as InfoCircle} from "./static/image/info-circle.svg";
import {Storage} from "aws-amplify";
import {removeGarbageCharOnFileName} from "../../helper/CommonFunctions";
import './customFIleUpload.scss'

function CustomFileUpload(props) {
    const [uploadProgress, setUploadProgress] = useState(0)
    const [upload, setUpload] = useState(false)
    const [cancel, setCancel] = useState(false)
    const [file, setFile] = useState('')
    console.log('progress', uploadProgress)
    const fileChangeFunction = async (e) => {
    const file = e.target.files[0]
    if(file){
        await Storage.remove(file)
    }
    if (file !== undefined && file.name) {
        setUpload(true)
        let pathUrl = `dua/${Date.now()}_${removeGarbageCharOnFileName(file.name)}`;
        setFile(pathUrl)
        await props.formik.setFieldValue(props.name, pathUrl)
        await Storage.put(pathUrl, file, {
             acl: "public-read", progressCallback(progress) {
                 // console.log('progress', Math.round(Number(progress.loaded / progress.total) * 100))
                setUploadProgress(Math.round(Number(progress.loaded / progress.total) * 100))
            },
        })
            .then((res) => {
                setCancel(true)
                e.target.value = ''
            })
            .catch((err) => {
                console.log(err)
            })
    }
    console.log(e)

    }

    const uploadCancel = async () => {
        try {
            await Storage.remove(file)
            await props.formik.setFieldValue(props.name, '')
            setCancel(false)
            setUpload(false)
            setUploadProgress(0)
            setFile('')
        } catch (err) {
            console.log(err)
        }
    };
    return (
        <div className='custom-file-upload-area'>
            <div className="row">
                <div className="col-md-4">
                    <div className='custom-file-upload'>
                        <div className="label-text">
                            { props.labelText && (
                                <label htmlFor=''>
                                    <span className={props.asterisk ? "asterisk label_name" : "label_name"}>{props.labelText}</span>
                                </label>
                            )}
                        </div>
                        <label className={`file-label ${upload ? 'disabled': ''}`} htmlFor={props.name} >{props.fileLabel}</label>
                        <input
                            id={props.id}
                            className={`input-file ${props.className}`}
                            placeholder={props.placeHolder}
                            accept={props.accept}
                            type='file'
                            onChange={(e)=>{
                                props.formik.handleChange(e)
                                fileChangeFunction(e);
                            }}
                            onBlur={props.formik.handleBlur}
                            value={props.values}
                            autoComplete="off"
                            name={props.name}
                            onFocus={props.onFocus}
                            ref={props.inputRef}
                            disabled={props.disabled}
                        />
                        {props.requiredMessage ? (
                            <span className="error-message">
                                <InfoCircle fill=""/> {props.requiredMessageLabel}
                            </span>
                        ) : props.whiteSpace === false ? ''
                            :
                            (
                                <span dangerouslySetInnerHTML={{__html: "&nbsp;"}}/>
                            )
                        }
                    </div>
                </div>
                <div className="col-md-5 d-flex">
                   <div className="file-upload-progress-area">
                       <div className="file-upload-progress">
                           {
                               upload && (
                                    <div className="progress">
                                       <div className="progress-bar" style={{width: `${uploadProgress}%`}} role="progressbar" aria-label="Course Complete"  aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"/>
                                   </div>
                               )
                           }
                       </div>
                        <div className="file-cancel-btn">
                            {
                                cancel &&  (
                                    <div className='d-flex align-items-center m-l-10'>
                                        <span>uploaded</span>
                                        <button type='button' onClick={uploadCancel}>X</button>
                                    </div>
                                )
                            }
                        </div>
                   </div>
                </div>
            </div>
            {file !== '' && <span className='upload-file-name'>{file}</span>}
        </div>
    );
}

export default CustomFileUpload;


<CustomFileUpload
      id="audio_url"
      name="audio_url"
      labelText="Audio File"
      asterisk={true}
      whiteSpace={false}
      formik={SurahForm}
      fileLabel="Upload Audio"
      className={SurahForm.touched.audio_url && SurahForm.errors.audio_url ? " is-invalid" : ""}
      requiredMessage={SurahForm.touched.audio_url && SurahForm.errors.audio_url}
      requiredMessageLabel={SurahForm.touched.audio_url || SurahForm.isSubmitting ? SurahForm.errors.audio_url : ""}
  />
