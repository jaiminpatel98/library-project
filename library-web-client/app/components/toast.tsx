import * as UIToast from '@radix-ui/react-toast';
import { Fragment } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { delay } from '../utilities/helpers/helper';

export default function Toast({ details, open, setOpen }: any) {

  const handleClose = () => {
    setOpen(false);
  }

  const handleOpen = async () => {
    await delay(5000);
    if (open) {
      setOpen(false);
    }
  }

  return (
    <Fragment>
      <UIToast.Provider>
        <UIToast.Root className={`ToastRoot ${details?.type}`} open={open} onOpenChange={handleOpen}>
          <UIToast.Title className="ToastTitle">{details?.title}</UIToast.Title>
          <UIToast.Description className="ToastMessage">{details?.message}</UIToast.Description>
          <UIToast.Close asChild aria-label="Close">
            <button className="CloseDialogButton" onClick={handleClose} aria-hidden>
                <Cross2Icon />
            </button>
          </UIToast.Close>
        </UIToast.Root>

        <UIToast.Viewport className="ToastViewport"/>
      </UIToast.Provider>
    </Fragment>
  )
}