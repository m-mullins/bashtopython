import React from 'react';

import './App.css';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

const pythonTemplate = (bashScript) =>  
`#!/usr/bin/python
from __future__ import print_function
import subprocess
import sys

def main():
    p = subprocess.Popen(['bash'],
                stdout=subprocess.PIPE,
                stdin=subprocess.PIPE,
                stderr=subprocess.PIPE)

    out, err = p.communicate(input=inputString)

    print(out.decode('utf-8'), end='')
    print(err.decode('utf-8'), file=sys.stderr, end='')


inputString = b"""
${bashScript}
"""


if __name__ == '__main__':
    main()
`;

const SLEEP = 12000;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      converted: 0,
      bashScript: '',
      pythonScript: '',
    }
  }

  convertScript = () => {
    this.setState({
      pythonScript: pythonTemplate(this.state.bashScript),
      converted: 1
    });
    setTimeout(() => this.setState({converted: 2}), SLEEP);
  };

  convertMore = () => {
    this.setState({
      converted: 0,
      bashScript: ''
    });
  };
  
  downloadPyFile = () => {
    const element = document.createElement("a");
    const file = new Blob([this.state.pythonScript], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "script.py";
    document.body.appendChild(element); 
    element.click();
  };

  render() {
    switch (this.state.converted) {
      case 2:
        return <div>
          <Typography variant="h4" gutterBottom>Bash to Python</Typography>

          <div style={{ display: 'flex' }}>
            <Button style={{margin: 6}} variant="contained" color="primary" onClick={this.downloadPyFile.bind(this)}>Download Python</Button>
            <Button style={{margin: 6}} variant="contained" onClick={this.convertMore.bind(this)}>Convert More</Button>
          </div>
        </div>;
      case 1:
        return <div>
            <Typography variant="h4" gutterBottom>Bash to Python</Typography>
            <CircularProgress />
          </div>;
      case 0:
        return <div>
          <Typography variant="h4" gutterBottom>Bash to Python</Typography>
          <div style={{
            backgroundColor: '#eee',
            maxHeight: 450,
            overflow: 'auto',
            height: 450,
            marginBottom: '0.92em'
          }}>
            <Editor
              value={this.state.bashScript}
              onValueChange={bashScript => this.setState({ bashScript })}
              highlight={code => Prism.highlight(code, Prism.languages.bash, 'bash')}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                height: '100%',
                width: '100%'
              }}
              placeholder="Enter bash script.."
              textareaId="bashText"
            />
          </div>
          <Button variant="contained" color="primary" disabled={!this.state.bashScript} onClick={this.convertScript.bind(this)}>Convert</Button>
        </div>
    }
  }
}

export default App;
