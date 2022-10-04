// This process-engine is designed to work this way:
// Note that the code will be processed from top to bottom
// Which means that you can install some package, then create 
// some files, then run custom code before you add another package.
// You should split all what you want to do into processes and steps
// Process for a major work that needs multiple actions to be completed,
// and steps for the actions that comprises of a process.
// Check this example for your reference.  
exports.processDeploymentName = {
    // Name of the process you're deploying, for example, expressJS installation
    "Check if Express is installed" : {
        customCommandsDir : "custom-commmands or null", // Directory to load custom commands
        packageInstallerCommand : "npm install ", // 
        logger : "console.log", //you can create a custom function to handle your logs. Default is console.log.
        type : PE_CONDITION,
        "calculate" : {
            command : "expression",
            resultType : "const",
            result : "res"
        }
    },
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