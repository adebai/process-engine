const { Command } = require('commander');
const { processEngine } = require('./processEngine');

let cmd = new Command("start");

cmd.command("generate-json <source> [destination]")
    .description("Generates a compact JSON version of your input javascript file."+ 
    "The JSON file can be distributed easily since it is smaller in size")
    .action(function (source, destination) {
        console.log(`Source is ${source} and description is ${description}`);
        let instance = new processEngine(GENERATESCHEMA, source, destination);

    })
    .version("0.0.1");
cmd.command("run <source>")
    .description("Processes all the process and steps in <source>."+ 
    "")
    .action(function (source, destination) {
        let instance = new processEngine(RUN, source);
    })
    .version("0.0.1");

cmd.parse();