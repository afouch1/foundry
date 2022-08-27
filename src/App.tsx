import React, {ChangeEventHandler, MouseEventHandler} from 'react';
import { invoke } from '@tauri-apps/api';
import TEST_CONFIGS from './utils/test-config';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


import type { Server } from './types';
import {
  Alert,
  Box,
  Button,
  createTheme,
  Dialog, DialogActions, DialogContent, DialogTitle,
  Fab,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader, Snackbar, TextField,
  ThemeProvider
} from "@mui/material";
import {CssBaseline} from "@mui/material";
import ServerListItem from "./components/ServerListItem";
import AddIcon from '@mui/icons-material/Add'
import {isIPv4} from './utils';
import EditServerDialog from "./components/EditServerDialog";

interface AppState {
  servers: Server[],
  hasBooted: boolean,
}

function App() {
  const [state, setState] = React.useState<AppState>({
    servers: [],
    hasBooted: false
  })

  const [showError, setShowError] = React.useState(false);

  const [showSuccess, setShowSuccess] = React.useState(false);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [currentEditingServer, setCurrentEditingServer] = React.useState<Server | null>(null);

  const onEdit = (i: number) => {
    if (state.servers.length > 0) {
      setCurrentEditingServer(state.servers[i])
      setDialogOpen(true)
    } else {
      alert('Error: No servers found in list. ')
    }
  }

  const onConnect = (i: number) => {
    if (state.servers.length > 0) {
      const server = state.servers[i];
      // @ts-ignore
      window.location = `http://${server.hostname}:${server.port}`;
    }
  }

  const onAddClick: MouseEventHandler<HTMLButtonElement> = e => {
    setCurrentEditingServer(null)
    setDialogOpen(true)
  }

  const removeServer = (i: number) => {
    state.servers.splice(i, 1);
    setState({...state, servers: state.servers})
  }

  React.useEffect(() => {
    const actualUseEffect = async () => {
      if (!state.hasBooted && await invoke<boolean>('ensure_path_found')) {
        const servers = await invoke<Server[]>('get_config')
        if (servers) {
          setState({ ...state, hasBooted: true, servers })
        } else {
          setState({ ...state, hasBooted: true })
        }
      }
    }

    actualUseEffect();
  }, [])

  React.useEffect(() => {
    if (state.hasBooted)
    invoke('set_config', {
      servers: state.servers
    })
  }, [state])

  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  });

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <List
          sx={{width: '100%'}}
          component="nav"
          subheader={
            <ListSubheader component="div" id="subheader">
              Servers
            </ListSubheader>
          }
        >
          {state.servers.map((server, i) =>
            <ServerListItem key={i}
                            onDelete={() => removeServer(i)}
                            onEdit={() => onEdit(i)}
                            onConnect={() => onConnect(i)}
                            server={server}
            />
          )}
        </List>
        <Fab onClick={onAddClick} sx={{position: 'absolute', bottom: 20, right: 20}}>
          <AddIcon />
        </Fab>
        <EditServerDialog closeDialog={() => setDialogOpen(false)}
                          showError={() => setShowError(true)}
                          isNew={!currentEditingServer}
                          addNewServer={newServer => {setState({...state, servers: [...state.servers, newServer]}); setShowSuccess(true)}}
                          editServer={_ => setState({...state, servers: [...state.servers]})}
                          open={dialogOpen}
                          server={currentEditingServer ?? undefined}
        />
        <Snackbar open={showError} autoHideDuration={6000} onClose={_ => setShowError(false)}>
          <Alert variant="filled" onClose={_ => setShowError(false)} severity="error" sx={{ width: '100%'}}>
            Invalid server configuration
          </Alert>
        </Snackbar>
        <Snackbar open={showSuccess} autoHideDuration={6000} onClose={_ => setShowSuccess(false)}>
          <Alert variant="filled" onClose={_ => setShowSuccess(false)} severity="success" sx={{ width: '100%'}}>
            Added!
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </div>
  );
}

export default App;
