const { Command } = require('commander');
const { processEngine } = require('./processEngine');

let cmd = new Command("start");

cmd.command("generate-json <source> <destination> <extension>")
    .description("Generates a compact JSON version of your input javascript file."+ 
    "The JSON file can be distributed easily since it is smaller in size." + 
    " Supported extensions: .json, .hex and .bin. Note that .bin might not generate an actual binary data. Check https://developer.mozilla.org/en-US/docs/Web/API/DOMString/Binary" +
    "for more info. Support for more extensions will be added later. Also note that direct use of any of these compact file generated is yet to be implemented")
    .action(function (source, destination, extension) {
        let instance = new processEngine(GENERATESCHEMA, source, destination + "." + extension);
        // Got further things to do?
        // Do them here..
    })
    .version("0.0.1");
cmd.command("run <source>")
    .description("Processes all the process and steps in <source>."+ 
    "")
    .action(function (source, destination) {
        let instance = new processEngine(RUN, source);
        // Got further things to do?
        // Do them here..
    })
    .version("0.0.1");

    exports.cmd = cmd;
    exports.processEngine = processEngine;
    // call cmd.parse(); to start the command.
    // npm run test will not work until then.
    cmd.parse(); 