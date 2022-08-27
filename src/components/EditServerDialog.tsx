import React, {ChangeEventHandler, MouseEventHandler, useEffect} from 'react';
import {Dialog, DialogContent, Box, DialogTitle, DialogActions, Button, TextField} from "@mui/material";
import { isIPv4 } from "../utils";
import {Server} from "../types";

interface EditServerDialogProps {
  isNew: boolean;
  closeDialog: () => void,
  addNewServer: (server: Server) => void,
  editServer: (server: Server) => void,
  open: boolean,
  server?: Server,
  showError: () => void;
}

const EditServerDialog: React.FC<EditServerDialogProps> = ({ isNew, closeDialog, addNewServer, editServer, open, server, showError}) => {
  const initialDialogError = {
    hostnameError: true,
    nameError: true,
    portError: false
  } as const;

  const editingDialogError = {
    hostnameError: false,
    nameError: false,
    portError: false
  } as const;

  const [dialogError, setDialogError] = React.useState<{
    hostnameError: boolean,
    nameError: boolean,
    portError: boolean
  }>(isNew ? initialDialogError : editingDialogError);

  const initialNewServer = {
    name: '',
    hostname: '',
    port: 30000
  } as const;

  const [newServer, setNewServer] = React.useState<Server>(server ?? initialNewServer)

  const onNewServerNameChange: ChangeEventHandler<HTMLInputElement> = e => {
    setNewServer({ ...newServer, name: e.target.value ?? '' })
    if (e.target.value.length > 35) {
      setDialogError({ ...dialogError, nameError: true })
    } else {
      setDialogError({ ...dialogError, nameError: false })
    }
  }

  const onNewServerHostnameChange: ChangeEventHandler<HTMLInputElement> = e => {
    setNewServer({ ...newServer, hostname: e.target.value ?? '' })
    if (!e.target.value || !isIPv4(e.target.value)) {
      setDialogError({ ...dialogError, hostnameError: true })
    } else {
      setDialogError({ ...dialogError, hostnameError: false })
    }
  }

  const onNewServerPortChange: ChangeEventHandler<HTMLInputElement> = e => {
    const num = +e.target.value;
    if (!num || isNaN(num) || !Number.isInteger(num) || e.target.value.includes("-")) {
      setDialogError({ ...dialogError, portError: true})
    } else {
      setDialogError({ ...dialogError, portError: false })
      setNewServer({ ...newServer, port: num })
    }
  }

  const handleDialogClose: MouseEventHandler<HTMLButtonElement> = _ => {
    // setDialogError(initialDialogError)
    // setNewServer(initialNewServer)
    closeDialog()
  }


  useEffect(() => {
    setDialogError({
      nameError: !newServer.name,
      portError: !newServer.port,
      hostnameError: !isIPv4(newServer.hostname)
    })
  }, [newServer])

  const handleDialogAddClicked: MouseEventHandler<HTMLButtonElement> = _ => {
    if (dialogError.nameError || dialogError.hostnameError || dialogError.portError) {
      showError()
      return;
    }

    if (isNew) {
      addNewServer(newServer);
      console.log('Adding new server...')
    } else {
      editServer(newServer)
      console.log('Editing server...')
    }
    setNewServer(initialNewServer);
    setDialogError(initialDialogError)
    closeDialog();
  }

  return <Dialog open={open} onClose={handleDialogClose}>
    <DialogTitle>Add Server</DialogTitle>
    <br />
    <DialogContent>
      <Box sx={{ display: 'flex', flexDirection: 'column', m: 'auto', width: 'fit-content', minWidth: 400 }}>
        <TextField autoFocus
                   required
                   error={dialogError.nameError}
                   id="new-server-name"
                   label="Server Name"
                   InputLabelProps={{ shrink: true }}
                   onChange={onNewServerNameChange}
                   defaultValue={server?.name ?? ''}
        />
        <br />
        <TextField id="new-server-hostname"
                   error={dialogError.hostnameError}
                   required
                   label="Server Host (IP)"
                   InputLabelProps={{ shrink: true }}
                   onChange={onNewServerHostnameChange}
                   defaultValue={server?.hostname ?? ''}
        />
        <br />
        <TextField id="new-server-port"
                   error={dialogError.portError}
                   label="Server Port"
                   type="number"
                   defaultValue={server?.port ?? '30000'}
                   InputLabelProps={{ shrink: true }}
                   onChange={onNewServerPortChange}
        />
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleDialogClose}>Cancel</Button>
      <Button color="info" onClick={handleDialogAddClicked}>{isNew ? 'Add' : 'Confirm'}</Button>
    </DialogActions>
  </Dialog>
}

export default EditServerDialog;