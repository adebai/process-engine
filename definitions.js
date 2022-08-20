module.exports = class definitions {
    startTime = Date.now();
    endTime = 0;
    TYPE1 = "installPackage";
    TYPE2 = "installFile";
    TYPE3 = "installFolder";
    TYPE4 = "custom";
    fs = require('fs');
    os = require('os');
    constructor (params, run) {
        return this.init(params, run);
    }
    init (params, run) {
        if(run == null) run = false;
        if(run === false) {
            console.log("Generating JSON schema...");
            this.toJSON = JSON.stringify(params);
            return this.toJSON;
        }
        else {
            // this.worker();
            this.splitProcesses(params);
        }
    }
    splitProcesses(params) {

        this.processList = [];
        this.processMap = {};
        this.stepsMap = {};
        let c = 0, d = 0;
        Object.entries(Object.entries(params)[0][1]).forEach(element => {
            let processParams = {};
            processParams.customCommandsDir = element[1].customCommandsDir;
            processParams.packageInstallerCommand = element[1].packageInstallerCommand;
            processParams.extraConfig = element[1].extraConfig;
            processParams.logger = element[1].logger;
            let steps = [];
            Object.entries(element[1]).forEach(e => {
                if(typeof(e[1]) == "object" || e[0] == "extraConfig")
                steps.push({name: e[0], actions : e[1]});
                this.stepsMap[element[0]+"_"+e[0]] = d;
                d++;
            })
            this.processList[c] = {name : element[0], params : processParams, steps : steps};
            this.processMap[element[0]] = c;
            c++;
        });
        this.numProcesses = this.processList.length;
        this.getSteps();
    }
    getSteps(processNumber = -1, nocache = false) {
        if(this.steps != undefined && nocache !== true)
        return this.steps;
        this.steps = [];
        if(processNumber == -1){
            this.processList.forEach(element => {
                element.steps.forEach(e =>{
                    e.processName = element.name;
                    this.steps.push(e);
                })
            });
            this.steps = this.steps;
            // console.log(this.steps);
            return this.steps;
        }
        else {
            return this.processList[processNumber].steps;
        }
    }
    getInstallPackageSteps(processNumber = -1, nocache = false) {
        if(this.steps != undefined && nocache !== true)
        return this.installPackageSteps;
        else {
            if(processNumber == -1){
                this.steps.forEach(e =>{
                    if(e.actions.command == "installPackage")
                    this.installPackageSteps.push(e);
                });
                return this.installPackageSteps;
            }
            else {
                let newList = [];
                this.steps[processNumber].steps.forEach(e =>{
                    if(e.actions.command == "installPackage")
                    newList.push(e);
                });
                return newList;
            }
        }
    }
    getInstallFileSteps() {
        if(this.steps != undefined && nocache !== true)
        return this.installFileSteps;
        else {
            if(processNumber == -1){
                this.steps.forEach(e =>{
                    if(e.actions.command == "installPackage")
                    this.installFileSteps.push(e);
                });
                return this.installFileSteps;
            }
            else {
                let newList = [];
                this.steps[processNumber].steps.forEach(e =>{
                    if(e.actions.command == "installPackage")
                    newList.push(e);
                });
                return newList;
            }
        }
    }
    getInstallFolderSteps() {
        if(this.steps != undefined && nocache !== true)
        return this.installFolderSteps;
        else {
            if(processNumber == -1){
                this.steps.forEach(e =>{
                    if(e.actions.command == "installPackage")
                    this.installFolderSteps.push(e);
                });
                return this.installFolderSteps;
            }
            else {
                let newList = [];
                this.steps[processNumber].steps.forEach(e =>{
                    if(e.actions.command == "installPackage")
                    newList.push(e);
                });
                return newList;
            }
        }
    }
    getCustomSteps() {
        if(this.steps != undefined && nocache !== true)
        return this.customSteps;
        else {
            if(processNumber == -1){
                this.steps.forEach(e =>{
                    if(e.actions.command == "installPackage")
                    this.customSteps.push(e);
                });
                return this.customSteps;
            }
            else {
                let newList = [];
                this.steps[processNumber].steps.forEach(e =>{
                    if(e.actions.command == "installPackage")
                    newList.push(e);
                });
                return newList;
            }
        }
    }
}