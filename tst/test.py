#!/usr/bin/python
from __future__ import print_function
import subprocess
import sys

def main():
    p = subprocess.Popen(['bash'],
                stdout=subprocess.PIPE,
                stdin=subprocess.PIPE,
                stderr=subprocess.PIPE)

    stdoutStream, stderrStream = p.communicate(input=inputString)

    print(stdoutStream.decode('utf-8'), end='')
    print(stderrStream.decode('utf-8'), file=sys.stderr, end='')


inputString = b"""
#!/bin/bash

echo 'Heya'

yolo()
{
    echo 'yolo'
}
yolo
"""


if __name__ == '__main__':
    main()

