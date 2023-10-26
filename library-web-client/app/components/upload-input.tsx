'use client';
import React, { Fragment, useState } from "react";
import { Cross1Icon } from '@radix-ui/react-icons';
import styles from "./upload-input.module.css";

export default function UploadInput({ stateChanger }: any) {
  const [fileName, setFileName] = useState<string>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.item(0);
    if (newFile) {
      stateChanger(newFile);
      setFileName(newFile.name);
    }
  }

  const resetFileState = () => {
    stateChanger(undefined);
    setFileName(undefined);
  }

  return (
    <Fragment>
      <label htmlFor="upload" className={styles.triggerButton}>
        {
          !fileName && 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        }
        {
          fileName && <Cross1Icon onClick={resetFileState}/>
        }
      </label>
      {
        !fileName &&
        <input id="upload" className={styles.uploadInput} type="file" accept="video/*|audio/*|image/*"
          onChange={handleFileChange} />
      }
      <p>{fileName}</p>
    </Fragment>
  );
}