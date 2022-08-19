const shell = require('shelljs');
const path = require("path");
const { Buffer } =   require('buffer');
const { basename } = require('path');
const printTitle = require('console-formatter').printTitle;
const printMsg = require('console-formatter').printMsg;
const colorette =  require("colorette");
fs = require('fs');

// STATUSES
PAUSED = 1;
RUNNING = 2;
WAITING = 3;
ERROR = 4;
RESUMING = 5;
RUN = 6;
GENERATESCHEMA = 7;


/**
 * @description Main class that executes all processes and steps
 * @param object definition
 */
exports.processEngine = class processEngine {
    os = require('os');
    commander = require("commander");
    Definitions = require('./definitions');
    startTime = Date.now();
    endTime = 0;
    /**
     * @description Initialize the processEngine.
     * @param object definition
     */
    constructor(mode, source, schemaFilePath) {
        this.currentProcessName = " ";
        this.currentStateName = " ";
        if(mode == null) mode = RUN;
        let processes = require(source);
        if(mode == RUN) {
            this.commandLineArgs = null;
            this.defs = new this.Definitions(processes, true);
            this.currentProcessName = this.defs.steps[0].processName;
            this.currentStateName = this.defs.steps[0].name;
            this.currentProcess = this.defs.processList[this.defs.processMap[this.currentProcessName]];
            this.logger = this.currentProcess.params.logger.toString().includes('[object') 
            ? this.currentProcess.params.logger : 
            (this.currentProcess.params.logger || "console.log").split('.');
            this.currrentState = this.defs.steps[0];
            this.runSteps(this.defs.steps);
        }
        else if(mode == GENERATESCHEMA) {
            this.logger = console.log;
            let buff = Buffer.from((new this.Definitions(processes, false)).toJSON);
            if(basename(schemaFilePath).includes('.hex')) buff = buff.toString('hex');
            else if(basename(schemaFilePath).includes('.b64')) buff = buff.toString('base64');
            else if(basename(schemaFilePath).includes('.bin')) {
                buff = buff.toString('binary');
                fs.writeFileSync(schemaFilePath, buff, 'binary');
                return this.destructor();
            }
            else buff = buff.toString();
            fs.writeFileSync(schemaFilePath, buff);
        }
        this.destructor();
    }
    /**
     * @description Iterates through, and execute all the steps provided.
     * @param object definition
     */
    runSteps(steps) {
        steps.forEach(element => {
            this.runStep(element);
        });
    }
    /**
     * @description Executes the proper in-built method to run for a step.
     * @param object definition
     */
    runStep(definition) {
        let time = Date.now();
        this.currentStateName = definition.name;
        this.currentProcessName = definition.processName;
        if (definition.actions.command == this.defs.TYPE1) this[this.defs.TYPE1](definition);
        if (definition.actions.command == this.defs.TYPE2) this[this.defs.TYPE2](definition);
        if (definition.actions.command == this.defs.TYPE3) this[this.defs.TYPE3](definition);
        if (definition.actions.command == this.defs.TYPE4) this[this.defs.TYPE4](definition);
        if (definition.actions.preInstallCommand.length > 0) this.preInstallCommand(definition.actions.preInstallCommand, definition.actions.preInstallCommandArg);
        if (definition.actions.postInstallCommand.length > 0) this.postInstallCommand(definition.actions.postInstallCommand, definition.actions.postInstallCommandArg);
        this.time(time);
    }
    /**
     * @description Executes the in-built `installPackage` step.
     * @param object definition
     */
    installPackage(definition) {
        const processEngineCommand = this.defs.processList[this.defs.processMap[definition.processName]].params.packageprocessEngineCommand;
        let exe = "" + processEngineCommand + " " + definition.actions.package +
            (definition.actions.version.length > 0 ? "@" + definition.actions.version : "") +
            " " + definition.actions.installArg;
        this.log(colorette.bgWhite(colorette.blue(exe)), true);
        shell.exec(exe, { silent: true});
    }
    /**
     * @description Executes the in-built `installFile` step.
     * @param object definition
     */
    installFile(definition) {
        fs.writeFileSync(definition.actions.fileName,
            (definition.actions.fileContent.length > 0
                ? definition.actions.fileContent :
                fs.readFileSync(definition.actions.fileContentFromFile, { encoding: 'utf-8' })
            )
        );
        this.log("Writing file " + definition.actions.fileName + (definition.actions.fileContent.length > 0
            ? " from input string" : " from input file"));
    }
    /**
     * @description Executes the in-built `installFolder` step.
     * @param object definition
     */
    installFolder(definition) {
        if(definition.actions.folderContentPath.length > 1){
            let stat = this.copyFolderRecursiveSync(definition.actions.folderContentPath, definition.actions.folderName);
            this.log("Copied " + stat.fileCount + " files and " + stat.dirCount + " folders");
        } 
        else {
            if(!fs.lstatSync( definition.actions.folderName ).isDirectory()) {
                fs.mkdirSync(definition.actions.folderName);
                this.log("Folder " + definition.actions.folderName + " has now been created");
            }
            else {
                this.log("Warning! Folder `" + definition.actions.folderName + "` already exists, ignoring step..");
            }
        }
    }
    /**
     * @description Executes the in-built `custom` step.
     * @param object definition
     */
    custom(definition) {
        global.PROCESS_PATH = definition.actions.processPath;
        if(definition.actions.isNodeCommand === true){
            let tmp = {};
            tmp[definition.actions.execute] = global[definition.actions.execute] = require(definition.actions.customDir);
            tmp[definition.actions.execute](...(this.commandLineArgs !== null ? this.commandLineArgs : definition.actions.args));
        }
        else {
            shell.exec("cd " + definition.actions.customDir + " && " + definition.actions.execute + " " + definition.actions.args.join(' '), { silent: true });
        }
    }
    /**
     * @description Executes the pre install command of a step.
     * @param string command
     * @param array args
     */
    preInstallCommand(command, args) {
        let time = Date.now();
        this.log("Running pre-install command: " + command + " " + args);
        let hasErrors = false;
        this.log(command + " " + args);
        let state = shell.exec(command + " " + args, { silent:true });
        this.time(time, "Pre install command ");
    }
    /**
     * @description Executes the post install command of a step.
     * @param string command
     * @param array args
     */
    postInstallCommand(command, args) {
        let time = Date.now();
        this.log("Running post-install command: " + command + " " + args);
        let hasErrors = false;
        this.log(command + " " + args);
        let state = shell.exec(command + " " + args, { silent:true });
        this.time(time, "Post install command ");
    }
    /**
     * @description Copy a file from source to target
     * @param string source
     * @param source target
     */
    copyFileSync ( source, target ) {
        let targetFile = target;
        // If target is a directory, a new file with the same name will be created
        if ( fs.existsSync( target ) ) {
            if ( fs.lstatSync( target ).isDirectory() ) {
                targetFile = path.join( target, path.basename( source ) );
            }
        }
        fs.copyFileSync(source, target);
    }
    /**
     * @description Copies folders and files recursively
     * @param string source
     * @param source target
     */
    copyFolderRecursiveSync ( source, target ) {
        let files = [];
    
        // Check if folder needs to be created or integrated
        // To also add the source folder to the copy operation, the next line will replace the line next to it.
        // Maybe this will be the default in future versions.
        // let targetFolder = path.join( target, path.basename( source ) );
        let targetFolder = target;
        if ( !fs.existsSync( targetFolder ) ) {
            fs.mkdirSync( targetFolder );
        }
        // Copy
        let fileCount = 0;
        let dirCount = 0;
        if ( fs.lstatSync( source ).isDirectory() ) {
            files = fs.readdirSync( source );
            files.forEach( function ( file ) {
                let curSource = path.join( source, file );
                if ( fs.lstatSync( curSource ).isDirectory() ) {
                    dirCount++;
                    processEngine.prototype.copyFolderRecursiveSync( curSource, targetFolder );
                } else {
                    fileCount++;
                    let targetFile = targetFolder;
                    // If target is a directory, a new file with the same name will be created
                    if ( fs.existsSync( targetFolder ) ) {
                        if ( fs.lstatSync( targetFolder ).isDirectory() ) {
                            targetFile = path.join( targetFolder, path.basename( curSource ) );
                        }
                    }
                    fs.copyFileSync(curSource, targetFile);
                }
            } );
        }
        else {
            source.split(',').forEach(element => {
                fileCount++;
                this.copyFileSync(element, target);
            });
        }
        return {
            fileCount : fileCount, 
            dirCount : dirCount
        };
    }
    /**
     * @description Logs time data
     * @param int time
     * @param string customText
     */
    time(start, customText = "") {
        const time = Date.now() - start;
        const base = time > 1000 ? "s" : "ms";
        const value = time > 1000 ? Math.floor(time / 1000) : time;
        let custom = customText.length < 1 ? `${ this.currrentState.processName } - ${this.currentStateName}` : customText; 
        this.log(`${custom} completed in ${value + base}`, false, true);
    }
    // log function needs refactoring..
    /**
     * @description Logs data from the processEngine
     * @param string data
     * @param bool printFriendlyName
     * @param bool fromTime
     */
    log(data, printFriendlyName, fromTime) {
        let extended = !this.logger.toString().includes('[object') || !this.logger.toString().includes('function') && this.logger.length > 1 ? true : false;
        if (printFriendlyName === true) {
            if(this.logger.toString().includes('[object') || this.logger.toString().includes('function')) this.logger(printTitle(colorette.bgWhite(colorette.green("Now " + this.currrentState.actions.friendlyName || "", this.currentProcess || "", this.currrentState || ""))));
            else if(extended === true) global[this.logger[0]][this.logger[1]](printTitle(colorette.bgWhite(colorette.green("Now " + this.currrentState.actions.friendlyName || ""))));
            else global[this.logger[0]](printTitle(colorette.bgWhite(colorette.green("Now " + this.currrentState.actions.friendlyName || "", this.currentProcess || "", this.currrentState || ""))));
        }
        if(fromTime === true) data = printMsg(colorette.bgMagenta(colorette.white(data)), 0);
        else data = printMsg(colorette.bgWhite(colorette.blue(data)), 0);
        if(this.logger.toString().includes('[object') || this.logger.toString().includes('function')) this.logger(data || "", this.currentProcess || "", this.currrentState || "");
        else if(extended === true) global[this.logger[0]][this.logger[1]](data || "");
        else global[this.logger[0]](data || "", this.currentProcess || "", this.currrentState || "");
    }
    destructor() {
        const time = this.startTime;
        this.currentProcessName = "All processes";
        this.currentStateName = "and all steps";
        this.time(time);
    }
}
