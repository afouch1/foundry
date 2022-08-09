import React from 'react';
import logo from './logo.svg';
import './App.css';
import { invoke } from '@tauri-apps/api';

function App() {
  const [host, setHost] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');
  const [port, setPort] = React.useState<number | null>(null);

  const handlePortChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const num = +e.target.value;

    if (isNaN(num)) {
      setPort(null);
    } else {
      setPort(num);
    }
  }

  const sendConfigs = () => {
    if (!(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.exec(host))) {
      alert("Invalid host");
      return;
    }
    if (!name) {
      alert("Invalid name")
      return;
    }
    if (!port || isNaN(port)) {
      alert("Invalid port")
      return;
    }
    invoke('set_config', {
      configs: [
        { 
          name,
          server: host,
          port
        }
      ]
    })
  }

  return (
    <div className="App">
      <label htmlFor="ip">Host</label>
      <input onChange={e => setHost(e.target.value)} type="text" name="ip" id="ip" />
      <br />
      <label htmlFor="name">Name</label>
      <input onChange={e => setName(e.target.value)} type="text" name="name" id="name" />
      <br />
      <label htmlFor="port">Port</label>
      <input onChange={handlePortChange} type="number" name="port" id="port" />
      <br />
      <button onClick={sendConfigs}>Click</button>
    </div>
  );
}

export default App;
