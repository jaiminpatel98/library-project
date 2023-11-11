'use client';
import React,  { Fragment, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { uploadMedia } from "../utilities/firebase/functions";
import { Cross2Icon } from '@radix-ui/react-icons';
import { Bars } from  'react-loader-spinner';
import UploadInput from '../components/upload-input';
import Toast from '../components/toast';
import styles from "./upload-form.module.css";

export default function UploadForm() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File>();
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<Toast>();

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = event.target.value;
    if (newDescription) {
      setDescription(newDescription);
    }
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    if (newTitle) {
      setTitle(newTitle);
    }
  }

  const handleUpload = async () => {
    if (!file) {
      showToast('Warning', 'No file was selected.', 'warning');
      return;
    }
    setLoading(true);
    try {
      const response = await uploadMedia(file, title, description);
      showToast('Success', `File uploaded successfully. Response: ${JSON.stringify(response)}`, 'success');
      setLoading(false);
    } catch (error) {
      showToast('Error', `Failed to upload file: ${error}`, 'error');
      setLoading(false);
    }
  }

  const showToast = (title: string, message: string, type: string) => {
    setToast({title, message, type});
    setOpen(true);
  }

  return (
    <Fragment>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          {
            !loading &&
            <button className="Button slate">
              Upload
            </button>
          }
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Title className="DialogTitle">Upload File</Dialog.Title>
            <Dialog.Description className="DialogDescription">
              Placeholder for file upload description.
            </Dialog.Description>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="title">
                Title
              </label>
              <input className="Input" id="title"
                onChange={handleTitleChange}/>
            </fieldset>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="description">
                Description
              </label>
              <input className="Input" id="Description" 
                onChange={handleDescriptionChange}/>
            </fieldset>
            <fieldset className="Fieldset">
              <UploadInput stateChanger={setFile} />
            </fieldset>
            <div className={styles.confirmButtonDiv}>
              <Dialog.Close asChild>
                <button className="Button success" onClick={handleUpload}>Upload File</button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button className="CloseDialogButton" aria-label="Close">
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      {
        loading &&
        <Bars
          height="80"
          width="80"
          color="#222222"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      }
      <Toast open={open} setOpen={setOpen} details={toast}/>
    </Fragment>
  )
}