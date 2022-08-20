# console-formatter
`console-fomratter` is an NPM Library that pretty-prints testing results to the console
This is a NodeJS version of the [Bash Check Scirpt Formatter](https://github.com/rob-wess/bash-check-script). There is also a [Python3 Version](https://github.com/rob-wess/python-format-module). Eventually, a Powershell Version will be published.

## Installation
To install the package locally, run the following. To install globally, add the `-g` flag

```
npm i console-formatter
```

Once installed, the module is available for import. There are two functions include in the package
* printTitle()
* printMsg()

Import the modules using require.
```javascript
const printTitle = require('console-formatter').printTitle;
const printMsg = require('console-formatter').printMsg;
```

## Usage

### printTitle
To print an underlined title to the console, call it the `printTitle` function with a string
```javascript
printTitle('This is a title')
```

#### printMsg
The `printMsg` function requires both a string and a integer. The integer represents an exit code. Number 0-4 are supported. Refer to the table below for each number's associated response code.

Integer | Response 
--- | --- 
0 | SUCCESS
1 | FAIL
2 | WARNING
3 | INFO


To call the `printMsg` function, run the following.
```javascript
printMsg('Message to be displayed', 3)
```


### Examples
The script below uses the [npm package](https://www.npmjs.com/package/systemd-status) `systemd-status`. Thanks [ZimGill](https://github.com/ZimGil). The script checks the status of a couple of systemd daemons and calls the `printMsg` function accordingly. 

```javascript
const systemdStatus = require('systemd-status');
const printTitle = require('console-formatter').printTitle;
const printMsg = require('console-formatter').printMsg;

printTitle('Test Systemd Service Status');

const currentStatus = systemdStatus(['httpd', 'firewalld' ]);

for (i=0; i<currentStatus.length; i++) {
        serviceName = currentStatus[i].name;
        serviceState = currentStatus[i].state;

        if (serviceState == 'running') {
                var rc = 0;
        } else if (serviceState = 'dead') {
                var rc = 2;
        }

        printMsg("Check " + serviceName + " is running", rc );
}

console.log('\n');

```
#### Results
![Alt text](resources/systemd-status.png?raw=true "Title")
