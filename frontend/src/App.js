import React from 'react';

import './App.css';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import Button from '@material-ui/core/Button';
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
    return (<div>
      <Typography variant="h4" gutterBottom>Bash to Python</Typography>
      <Typography variant="subtitle1" gutterBottom><b>Lazily</b> convert bash to python. Python scripts are Python 2 and Python 3 compatible.</Typography>
      <Typography variant="subtitle1" gutterBottom>This service is free.</Typography>
      <Typography variant="subtitle1" gutterBottom>To convert a bash script, paste the bash script below and press convert. Wait. Then finally press download to download the converted python script.</Typography>

      {this.state.converted === 2 &&
        <div style={{ display: 'flex' }}>
          <Button style={{ margin: 6 }} variant="contained" color="primary" onClick={this.downloadPyFile.bind(this)}>Download Python</Button>
          <Button style={{ margin: 6 }} variant="contained" onClick={this.convertMore.bind(this)}>Convert More</Button>
        </div>}

      {this.state.converted === 1 &&
        <CircularProgress />}

      {this.state.converted === 0 &&
        <>
          <div style={{
            backgroundColor: '#eee',
            maxHeight: 450,
            overflow: 'auto',
            height: 450,
            marginTop: '1.20em',
            marginBottom: '1.20em'
          }}>
            <Editor
              value={this.state.bashScript}
              onValueChange={bashScript => this.setState({ bashScript })}
              highlight={code => Prism.highlight(code, Prism.languages.bash, 'bash')}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                height: '100%',
                width: '100%'
              }}
              placeholder="Enter bash script.."
              textareaId="bashText"
            />
          </div>
          <Button style={{
            marginBottom: '1.20em'
          }} variant="contained" color="primary" disabled={!this.state.bashScript} onClick={this.convertScript.bind(this)}>Convert</Button>
        </>
      }
      <Typography variant="h4" gutterBottom>Notes</Typography>
      <Typography variant="subtitle1" gutterBottom>There does exist <a href="https://www.swag.uwaterloo.ca/bash2py/index.html
">bash2py</a> (a bash to python script translator), but it has many limitiations.
      A convenient docker imaged version of <a href="https://zwischenzugs.com/2016/08/29/bash-to-python-converter">it exists.</a></Typography>
      <Typography variant="subtitle1" gutterBottom>In most cases it is best to just manually convert a bash script to python, or start with the converted version supplied by this <a href="/">site.</a></Typography>
    </div>);
  }
}

export default App;
