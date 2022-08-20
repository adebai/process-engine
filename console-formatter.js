function printTitle(msg) {
    
    return ['\x1b[4m%s\x1b[0m', '\n' + msg + '\n']
}


function printMsg(msg, rc) {
    if(msg.trim().length <1) return ['',''];
    // Where rc = response code
        // 0 = success
        // 1 = fail
        // 2 = warning
        // 3 = info
    dot = '\u25CF';
    width = process.stdout.columns;
    total = width - 23
    len = msg.length
    diff = total - len - 7
    tab = ' '.repeat(7)
    if(diff < 1) diff = 0;
    str = '.'.repeat(diff);

    if (rc == 0) {
        // print GREEN
        return [tab + dot + ' ' + msg + str + '\x1b[32m%s\x1b[0m', 'SUCCESS']
    } else if (rc == 1 ) {
        // print RED
        return [tab + dot + ' ' + msg + str + '\x1b[31m%s\x1b[0m', 'FAIL']
    } else if (rc == 2) {
        // print YELLO
        return [tab + dot + ' ' + msg + str + '\x1b[33m%s\x1b[0m', 'WARNING']
    } else if (rc == 3) {
        // BLUE
        return [tab + dot + ' ' + msg + str + '\x1b[34m%s\x1b[0m', 'INFO']
    }


}

module.exports = {printMsg, printTitle}

//printTitle('Show Demo of Options')
//printMsg('Successful command', 0)
//printMsg('Failed on exit', 1)
//printMsg('There is a warning somewhere', 2)
//printMsg('Show an infomrational', 3)
//console.log('\n')
//


