import React from 'react';
import {Button, ListItem, ListItemButton, ListItemText} from "@mui/material";
import type { Server } from '../types';
import ConfirmationDialog from "./ConfirmationDialog";

interface ServerListItemProps {
  onDelete: () => void;
  onEdit: () => void;
  onConnect: () => void;
  server: Server
}

const ServerListItem: React.FC<ServerListItemProps> = (props) => {
  const [open, setOpen] = React.useState(false);

  const [isConfirming, setIsConfirming] = React.useState(false);

  return <>
    <ListItem>
      <ListItemText primary={props.server.name} secondary={props.server.hostname + ( props.server.port ? ':' + props.server.port : '') }/>
      {/*<Button color="info" onClick={_ => props.onEdit()}>Edit</Button>*/}
      <Button color="error" onClick={_ => setIsConfirming(true)}>Delete</Button>
      <Button color="success" onClick={_ => props.onConnect()}>Connect</Button>
    </ListItem>
    <ConfirmationDialog open={isConfirming} onClose={() => setIsConfirming(false)} onAccept={() => props.onDelete()} title="Are you sure?">
      This cannot be undone.
    </ConfirmationDialog>
  </>
}

export default ServerListItem;
