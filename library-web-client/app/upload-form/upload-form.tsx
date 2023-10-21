'use client';
import React, { Fragment } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { uploadVideo } from "../utilities/firebase/functions";
import { Cross2Icon } from '@radix-ui/react-icons';
import styles from "./upload-form.module.css";

export default function UploadForm() {
  const [file, setFile] = React.useState<File>();
  const [title, setTitle] = React.useState<string>();
  const [description, setDescription] = React.useState<string>();
  const [fileName, setFileName] = React.useState<string>();

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = event.target.value;
    if (newDescription) {
      setDescription(newDescription);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.item(0);
    if (newFile) {
      setFile(newFile);
      console.log(JSON.stringify(newFile.name))
      setFileName(newFile.name);
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
      //TODO: Display error feed - No file was selected
      return;
    }
    try {
      //TODO: conditionally call upload function based on media type - video, audio, image
      //TODO: Establish interfaces as global types - Video, Upload - then we can just send upload to the function
      const response = await uploadVideo(file, title, description);
      alert(`File uploaded successfully. Response: ${JSON.stringify(response)}`);
    } catch (error) {
      alert(`Failed to upload file: ${error}`);
    }
  }

  return (
    <Fragment>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className={styles.triggerButton}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
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
              <label htmlFor="upload" className={styles.triggerButton}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </label>
              <input id="upload" className={styles.uploadInput} type="file" accept="video/*"
                onChange={handleFileChange} />
              <p>{fileName}</p>
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
    </Fragment>
  )
}