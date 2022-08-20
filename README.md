# Process Engine (alpha)
## Automate your daily routine in few easy steps
Process engine makes it super easy to automate things that you do frequently, 
while also giving you total freedom on what happens, when it happens and how it happens.
It allows you to define the steps to achieve your goal. Even though it's written in JS, it will
work absolutely well for processes in any language.

## Why use Process engine?
There are countless reasons
1. Anyone with or without knowledge of shell scripts (or batch scripts) can use process engine.
2. Unlike other options, you can pause, resume, run certain steps of your process. You can even rollback easily (in the future).
3. As the community, contributes pre-defined intents, almost everything you want to achieve would have been written by the community, you'll just import it from it's repo or npm source.
4. The GUI (coming soon) will make it damn too easy to use compared to shell scripts.
5. Since you can import from a git repo or npm source, all your automation tools will be easier to manage and stored in the cloud.
6.  Bugs in batch scripts are not so easy to handle, but with process engine handling everything for you, you will most likely never encounter any bug in your intent definition, and if there is, it will mostly be typos, and will be easily spotted.


## How it works
Process engine uses a JSON object (not JSON file), to define what you want to do.
A sample is already included in the project in the file `processes.js`.

Please don't mind my quick-match-up readme, I'll improve it later.

## How to install
To install, run
```javascript
npm install
```
at the root folder of the project, wait for it to finish, then you're ready to go.

## How to run
NOTE: you need to define your intention (check below) before you run.
Once you're in the root folder of the project, run:

For help 
```javascript
node start -h
```

For generating a compact json version
```javascript
node start generate-json  <source> [destination]
```
Where source is path/to/file that contains your intention definition and destination is the name of the file you want to save the generated json to.

For executing your intention
```javascript
node start run  <source> 
```
Where source is path/to/file that contains your intention definition.

For testing with the `processes.js` included in the project
```javascript
node start run  ./processes
```

## How to use
Your main intention (or goal you want to achieve) is called a process deployment. This will also be what you'll export.
Although, the name is not important in running your process, it is important so that you can understand what the intention
of your process deployment is (i.e, for your reference).

#### Processes and steps
In a process deployment, there will be processes and steps.
You should split all what you want to do into processes and steps
in such a way that processes are for major work that needs multiple actions to be completed,
and steps will be the actions that needs to be completed for a process to be executed.
Note that the code will be processed from top to bottom which means that you can install some package, then create 
some files, then run custom code before you add another package.

Check this example for your reference.

```javascript
exports.processDeploymentName = {
    // Name of the process you're deploying, for example, expressJS installation
    "ExpressJS installation" : {
        customCommandsDir : "custom-commmands or null", // Directory to load custom commands
        packageInstallerCommand : "npm install ", // 
        logger : "console.log", //you can create a custom function to handle your logs. Default is console.log.
        //Package definition start
        "Install the package" : {
            command : "installPackage", // Built-in command. 
                                        // There are only four built-in commands: installPackage, installFile, installFolder and custom
            package : "express", // name of package to install
            version : "", // version of the package
            installArg : "-g", // install argument
            preInstallCommand : "ls", // optional
            preInstallCommandArg : "-a", // optional, not applicable when preInstallCommand is not set
            postInstallCommand : "ls -a", // optional
            postInstallCommandArg : "", // optional, not applicable when postInstallCommand is not set
            friendlyName : "installing express" // used in logs
        },
        //Package definition end
        
        // repeat the above for as many packages as you want to create before proceeding.

        //Starter file definition start
        "Install expressjs config file" : {
            command : "installFile",
            fileName : "express.js",
            preInstallCommand : "preInstallCommand",
            preInstallCommandArg : "preInstallCommandArg",
            postInstallCommand : "postInstallCommand",
            postInstallCommandArg : "postInstallCommandArg",
            fileContent : "",
            fileContentFromFile : "custom-commands/e.js",
            friendlyName : "Installing express config file"
        },
        // Starter command definition end
        // repeat the above for as many commands as you want to run before proceeding.
        
        //Starter command definition start
        "Create middleware folder" : {
            command : "installFolder",
            folderName : "middleware",
            preInstallCommand : "preInstallCommand",
            preInstallCommandArg : "preInstallCommandArg",
            postInstallCommand : "postInstallCommand",
            postInstallCommandArg : "postInstallCommandArg",
            folderContentPath : "custom-commands", // use this only if you want to copy all files and folders from 
                                    // `folderContentPath` to `folderName`, else leave empty.
            // folderContentFromDefinition : "path/to/filename or null", // Reserved for dynamic content generation, 
                                                                        // currently not in use.
            friendlyName : "Installing middleware folder"
        },
        // Starter command definition end
        // repeat the above for as many commands as you want to run before proceeding.
        
        //Starter command definition start
        "Check the storage disk" : {
            command : "custom",
            execute : "du",
            customDir : "./",
            preInstallCommand : "",
            preInstallCommandArg : "",
            postInstallCommand : "",
            postInstallCommandArg : "",
            args : ["-ah"], //Custom args has to be an array
            processPath : "./", // path/to/ PROCESS_PATH constant that will be sent to command defaults to ./
            isNodeCommand : false, // if true, then `customDir` will be `require`d, 
                                    // then `execute` will be the name of the exported module
                                    // syntax for import will be the CommonJS module import syntax
                                    // else `customDir` will be the working folder for the 
                                    // `command`, and `command` will be executed
                                    // using shelljs npm package.
            friendlyName : "Running custom commands"
        },
        "Custom step to instantiate expressjs middlewares" : {
            command : "custom",
            execute : "starter",
            customDir : "./custom-commands/express-starter", // name might be changed in the future to `custom`
            preInstallCommand : "",
            preInstallCommandArg : "",
            postInstallCommand : "",
            postInstallCommandArg : "",
            args : [""], //Custom args has to be an array
            processPath : "./", // path/to/ PROCESS_PATH constant that will be sent to command defaults to ./
            isNodeCommand : true, // if true, then `customDir` will be `require`d, 
                                    // then `execute` will be the name of the exported module
                                    // syntax for import will be the CommonJS module import syntax
                                    // else `customDir` will be the working folder for the 
                                    // `command`, and `command` will be executed
                                    // using shelljs npm package.
            friendlyName : "Running custom commands"
        },
        // Starter command definition end
        // repeat the above for as many commands as you want to run before proceeding.
    }
}
```
## To-Dos
There are a lot of them.
1. Fully support imports for generated intents.
2. Handle erors more generously.
3. Create the GUI (probably using react + electron or similar stuff).
4. Create extensions for popular IDEs (VS, VS code, Android Studio, XCode, Atom, and Eclipse).
5. Incorporate RobotJS as an optional import for providing better automation handling needs.
6. Implement rollbacks.
7. Implement autoload for custom-commands that has to be up and running for dynamic intents.
8. Intent dependencies definition
7. And Lots More...

To contribute to this repo.. please contact me iamade.ayodeji [at] gmail [dot] com

