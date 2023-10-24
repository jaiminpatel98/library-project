'use client';
import React,  { Fragment, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { uploadVideo } from "../utilities/firebase/functions";
import { Cross2Icon } from '@radix-ui/react-icons';
import UploadInput from '../components/upload-input';
import styles from "./upload-form.module.css";

export default function UploadForm() {
  const [file, setFile] = useState<File>();
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();

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
      //TODO: Display error feed - No file was selected
      return;
    }
    try {
      //TODO: conditionally call upload function based on media type - video, audio, image
      //TODO: Establish interfaces as global types - Video, Upload - then we can just send upload interface to the function
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
          <button className="Button slate">
            Upload
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
    </Fragment>
  )
}