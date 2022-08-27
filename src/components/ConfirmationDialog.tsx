import React from 'react';
import {Box, Button, Dialog, DialogActions, DialogTitle} from "@mui/material";

type ConfirmationDialogProps = {
  onAccept: () => void,
  onDeny?: () => void,
  title: string,
  children: JSX.Element | string,
  open: boolean,
  onClose: () => void,
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({open, onClose, onAccept, onDeny, title, children})  => {
  return <Dialog open={open}
                 onClose={_ => onClose()}
  >
    <Box sx={{ minWidth: 400 }}>
      <DialogTitle>{title}</DialogTitle>
      <Box sx={{ paddingX: 3 }}>
        {children}
      </Box>
      <DialogActions>
        <Button onClick={_ => { onClose(); onDeny?.() }}>No</Button>
        <Button onClick={_ => { onClose(); onAccept() }}>Yes</Button>
      </DialogActions>
    </Box>
  </Dialog>
}

export default ConfirmationDialog;