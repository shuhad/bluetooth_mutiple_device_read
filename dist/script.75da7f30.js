// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/bleuio/index.js":[function(require,module,exports) {
let port,
    reader,
    inputDone,
    outputDone,
    inputStream,
    outputStream,
    arr = [];
async function connect() {
    (port = await navigator.serial.requestPort()), await port.open({ baudRate: 9600 });
    const t = new TextEncoderStream();
    (outputDone = t.readable.pipeTo(port.writable)), (outputStream = t.writable);
    let e = new TextDecoderStream();
    (inputDone = port.readable.pipeTo(e.writable)), (inputStream = e.readable.pipeThrough(new TransformStream(new LineBreakTransformer()))), (reader = inputStream.getReader());
}
async function disconnect() {
    return (
        reader && (await reader.cancel(), await inputDone.catch(() => {}), (reader = null), (inputDone = null)),
        outputStream && (await outputStream.getWriter().close(), await outputDone, (outputStream = null), (outputDone = null)),
        await port.close(),
        (port = null),
        "Dongle Disconnected!"
    );
}
function writeCmd(t) {
    const e = outputStream.getWriter();
    e.write(t), "" !== t && e.write("\r"), e.releaseLock();
}
/**
 * @at_connect
 * Connects Device
*/
(exports.at_connect = async function () {
    return await connect(), "device connected";
}),
/**
 * @at_connect
 * Disconnects Device
*/
(exports.at_disconnect = async function () {
    return await disconnect(), "device disconnected";
}),
/**
 * @ata
 * Shows/hides ASCII values from notification/indication/read responses. 
 * ata(0) hides the ASCII values,
 * ata(1) shows the ASCII values.
 * @return {Promise} returns promise
 * 
*/
(exports.ata = function (status) {
    return writeCmd("ATA"+status), readLoop("ata");
}),
/**
 * @atasps
 * Toggle between ascii and hex responses received from SPS. 
 * atasps(0) shows hex values, atasps(1) shows ASCII. ASCII is on by default.
 * @return {Promise} returns promise
 * 
*/
(exports.atasps = function (status) {
    return writeCmd("ATASPS"+status), readLoop("atasps");
}),
/**
 * @atds
 * Turns auto discovery of services when connecting on/off. 
 * ATDS0 off, ATDS1 on. 
 * On by default. This command can be used in both central and peripheral role.
 * @return {Promise} returns promise
 * 
*/
(exports.atds = function (status) {
    return writeCmd("ATDS"+status), readLoop("atds");
}),
/**
 * @ati
 * Device information query.
 * @return {Promise} returns promise
 * 
*/
    (exports.ati = () => (port ? (writeCmd("ATI"), readLoop("ati")) : "Device not connected.")),
/**
 * @at_central
 * Sets the device Bluetooth role to central role.
 * @return {Promise} returns promise
 * 
*/  
/**
 * @ate
 * Turn echo on/off. (On per default). ex ate(0)
 * @param {number} status int (0 or 1, 0 for off 1 for on)
 * @return {Promise} returns promise
 * 
*/
(exports.ate = function (status) {
    return writeCmd("ATE"+status), readLoop("ate");
}),
/**
 * @at_central
 * Sets the device Bluetooth role to central role.
 * @return {Promise} returns promise
 * 
*/  
(exports.at_central = function () {
    return writeCmd("AT+CENTRAL"), readLoop("at_central");
}),
/**
 * @at_dis
 * Shows the Device Information Service information to be used.
 * @return {Promise} returns promise
 * 
*/  
(exports.at_dis = function () {
    return writeCmd("AT+DIS"), readLoop("at_dis");
}),
/**
 * @at_peripheral
 * Sets the device Bluetooth role to peripheral.
 * @return {Promise} returns promise
 * 
*/ 
(exports.at_peripheral = function () {
    return writeCmd("AT+PERIPHERAL"), readLoop("at_peripheral");
}),
/**
 * @atr
 * Trigger platform reset.
 * @return {Promise} returns promise
 * 
*/
(exports.atr = function () {
    return writeCmd("ATR"), readLoop("atr");
}),
/**
 * @at_advstart
 * Starts advertising .
 * @return {Promise} returns promise
 * 
*/
(exports.at_advstart = function () {
    return writeCmd("AT+ADVSTART"), readLoop("at_advstart");
}),
/**
 * @at_advstop
 * Stops advertising .
 * @return {Promise} returns promise
 * 
*/
(exports.at_advstop = function () {
    return writeCmd("AT+ADVSTOP"), readLoop("at_advstop");
}),
/**
 * @at_advdata
 * Sets or queries the advertising data.if left empty it will query what advdata is set. 
 * @param {string} t hex str format: xx:xx:xx:xx:xx.. (max 31 bytes)
 * @return {Promise} returns a promise
 * 
*/
(exports.at_advdata = (t) => (writeCmd(t ? "AT+ADVDATA=" + t : "AT+ADVDATA"), readLoop("at_advdata"))),
/**
 * @at_advdatai
 * Sets advertising data in a way that lets it be used as an iBeacon.
        Format = (UUID)(MAJOR)(MINOR)(TX)
        Example: at_advdatai(5f2dd896-b886-4549-ae01-e41acd7a354a0203010400).
 * @param {string} t  if left empty it will query what advdata is set
 * @return {Promise} returns a promise
 * 
*/
(exports.at_advdatai = function (t) {
    return writeCmd("AT+ADVDATAI=" + t), readLoop("at_advdatai");
}),
/**
 * @at_advresp
 *  Sets or queries scan response data. Data must be provided as hex string.
 * @param {string} t if left empty it will query what advdata is set.hex str format: xx:xx:xx:xx:xx.. (max 31 bytes)
 * @return {Promise} returns a promise
 * 
*/
(exports.at_advresp = function (t) {
    return writeCmd(t ? "AT+ADVRESP=" + t : "AT+ADVRESP"), readLoop("at_advresp");
}),
/**
 * @at_cancelconnect
 * While in Central Mode, cancels any ongoing connection attempts.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_cancelconnect = function () {
    return writeCmd("AT+CANCELCONNECT"), readLoop("at_cancelconnect");
}),
/**
 * @at_client
 * Only usable in Dual role. Sets the dongle role towards the targeted connection to client.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_client = function () {
    return writeCmd("AT+CLIENT"), readLoop("at_client");
}),
/**
 * @at_clearnoti
 * Disables notification for selected characteristic.
 * @param {string} t notification handle string.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_clearnoti = function (t) {
    return writeCmd("AT+CLEARNOTI="+t), readLoop("at_clearnoti");
}),
/**
 * @at_dual
 * Sets the device Bluetooth role to dual role. This means it has the capabilities of both Central and Peripheral role. Advertising must be stopped and, any connection must be terminated before the role change is accepted.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_dual = function () {
    return writeCmd("AT+DUAL"), readLoop("at_dual");
}),
/**
 * @at_enterpasskey
 * Enter the 6-digit passkey to continue the pairing and bodning request.
 * @param {string} t Enter the 6-digit passkey.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_enterpasskey = function (t=123456) {
    return writeCmd("AT+ENTERPASSKEY=" + t), readLoop("at_enterpasskey");
}),
/** @at_numcompa
* Used for accepting a numeric comparison authentication request or enabling/disabling auto-accepting numeric comparisons.
* @param {number} t 0 or 1. 0 for disabled 1 for enable. Enabled by default.
* @return {Promise} returns a promise
* 
*/
(exports.at_numcompa = function (t) {
    return writeCmd(t ? "AT+NUMCOMPA=" + t : "AT+NUMCOMPA"), readLoop("at_numcompa");
 }),
/**
 * @at_gapiocap
 * Sets or queries what input and output capabilities the device has.
 * @param {number} t int between 0 to 4. 0 - Display only, 1 - Display + yes & no, 2 - Keyboard only, 3- No input no output, 4 - Keyboard + display
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gapiocap = function (t=1) {
    return writeCmd("AT+GAPIOCAP=" + t), readLoop("at_gapiocap");
}),
/**
 * @at_gappair
 * Starts a pairing or bonding procedure. Depending on whether the device is master or slave on the connection, it will send a pairing or a security request respectively.
Only usable when connected to a device.
 * @param {number} t leave blank for pairing and write BOND for bonding.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gappair = function (t) {
    return writeCmd(t ? "AT+GAPPAIR=" + t : "AT+GAPPAIR"), readLoop("at_gappair");
}),
/**
 * @at_gapunpair
 * Unpair paired devices. This will also remove the device bond data from BLE storage. Usable both when device is connected and when not. 
 * @param {number} t Leave blank to unpair all paired devices or selected paired device (device_mac_address). Public= [0] or private= [1] address type prefix required before mac address. ex: [x]xx:xx:xx:xx:xx:xx
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gapunpair = function (t) {
    return writeCmd(t ? "AT+GAPUNPAIR=" + t : "AT+GAPUNPAIR"), readLoop("at_gapunpair");
}),
/**
 * @at_gapdisconnectall
 * Disconnects from all connected peer Bluetooth devices. This command can be used in both central and peripheral role.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gapdisconnectall = function () {
    return writeCmd("AT+GAPDISCONNECTALL"), readLoop("at_gapdisconnectall");
}),
/**
 * @at_gapscan
 * Starts a Bluetooth device scan with or without timer set in seconds. If no timer is set, it will scan for only 1 second.
 * @param {number} t int (time in seconds)
 * @param {boolean} e true/false, true will show real time device in console
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gapscan = function (t = 1,e=true) {
    return writeCmd("AT+GAPSCAN=" + t), readLoop("at_gapscan",e);
}),
/** @at_seclvl
* Sets or queries what minimum security level will be used when connected to other devices.
* @param {number} t leave blank for quering security level or set security level from 1 to 3. 1- No authentication and no encryption, 2-Unauthenticated pairing with encryption, 3 -Authenticated pairing with encryption
* @return {Promise} returns a promise
* 
*/
(exports.at_seclvl = function (t) {
    return writeCmd(t ? "AT+SECLVL=" + t : "AT+SECLVL"), readLoop("at_seclvl");
 }),
/** @at_setpasskey
* Setting or quering set passkey for passkey authentication.
* @param {string} t leave blank for quering passkey or set six digit passkey.
* @return {Promise} returns a promise
* 
*/
(exports.at_setpasskey = function (t) {
   return writeCmd(t ? "AT+SETPASSKEY=" + t : "AT+SETPASSKEY"), readLoop("at_setpasskey");
}),
/**
 * @at_findscandata
 * Scans for all advertising/response data which contains the search params. ex. at_findscandata('FF5',10)
 * @param {string} t search params.
 * @param {number} e number of responses.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_findscandata = function (t = 1,e=5) {
    return writeCmd("AT+FINDSCANDATA=" + t), readLoop("at_findscandata",e);
}),
/**
 * @at_gapconnect
 * Initiates a connection with a specific slave device.
 * @param {string} t hex str format: xx:xx:xx:xx:xx:xx
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gapconnect = function (t) {
    return writeCmd("AT+GAPCONNECT=" + t), readLoop("at_gapconnect");
}),
/**
 * @at_gapdisconnect
 * Disconnects from a peer Bluetooth device.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gapdisconnect = function () {
    return writeCmd("AT+GAPDISCONNECT"), readLoop("at_gapdisconnect");
}),
/**
 * @at_getconn
 * Gets a list of currently connected devices along with their mac addresses, connection index, our role towards this connection and if it's bonded/paired.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_getconn = async function () {
    return writeCmd("AT+GETCONN"), readLoop("at_getconn");
}),
/**
 * @at_getservices
 * Rediscovers a peripheral's services and characteristics.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_getservices = function () {
    return writeCmd("AT+GETSERVICES"), readLoop("at_getservices");
}),
/**
 * @at_getservicesonly
 * Discovers a peripherals services.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_getservicesonly = function () {
    return writeCmd("AT+GETSERVICESONLY"), readLoop("at_getservicesonly");
}),
/**
 * @at_getservicesdetails
 * Discovers all characteristics and descriptors of a selected service. Must run at_getservicesonly() first to get the service handle.
 * Example : at_getservicesdetails('0001')
 * @param {string} t service param
 * @return {Promise} returns a promise
 * 
*/
(exports.at_getservicesdetails = function (t) {
    return writeCmd("AT+GETSERVICEDETAILS="+ t), readLoop("at_getservicesdetails");
}),
/**
 * @at_indi
 * Shows list of set indication handles along with the connection index so you can see what indication you have enabled on which connected device.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_indi = function () {
    return writeCmd("AT+INDI"), readLoop("at_indi");
}),
/**
 * @at_noti
 * Shows list of set notification handles along with the connection index so you can see what notification you have enabled on which connected device.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_noti = function () {
    return writeCmd("AT+NOTI"), readLoop("at_noti");
}),
/**
 * @at_scantarget
 * Scan a target device. Displaying it's advertising and response data as it updates.
 * @param {string} t hex str format: xx:xx:xx:xx:xx:xx
 * @param {Number} e Number of responses
 * @return {Promise} returns a promise
 * 
*/
(exports.at_scantarget = function (t, e = 1) {
    return writeCmd("AT+SCANTARGET=" + t), readLoop("at_scantarget", e+2);
}),
/**
 * @at_setdis
 * Sets the Device Information Service information. example at_setdis(MAN_NAME,MOD_NUM,HW_REV,FW_REV,SW_REV)
 * @param {string} name Manufacturer Name
 * @param {string} num Model Number
 * @param {string} serial Serial Number
 * @param {string} hrev Hardware revision
 * @param {string} frev Firmware revision
 * @param {string} srev Software revision
 * @return {Promise} returns a promise
 * 
*/
(exports.at_setdis = function (name,num,serial,hrev,frev,srev) {
    return writeCmd("AT+SETDIS=" + name +"="+ num +"="+ serial +"="+ hrev +"="+ frev +"="+srev), readLoop("at_setdis");
}),
/**
 * @at_server
 * Only usable in Dual role. Sets the dongle role towards the targeted connection to server.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_server = function () {
    return writeCmd("AT+SERVER"), readLoop("at_server");
}),
/**
 * @at_setnoti
 * Enable notification for selected characteristic.
 * @param {string} t notification handle
 * @return {Promise} returns a promise
 * 
*/
(exports.at_setnoti = function (t) {
    return writeCmd("AT+SETNOTI=" + t),  readLoop("at_setnoti");
}),
/**
 * @at_setindi
 * Enable indication for selected characteristic.
 * @param {string} t indication  handle
 * @return {Promise} returns a promise
 * 
*/
(exports.at_setindi = function (t) {
    return writeCmd("AT+SETINDI=" + t),  readLoop("at_setindi");
}),
/**
 * @at_spssend
 * Send a message or data via the SPS profile.Without parameters it opens a stream for continiously sending data.
 * @param {string} t if left empty it will open Streaming mode
 * @return {Promise} returns a promise
 * 
*/
(exports.at_spssend = function (t) {
        return writeCmd(t ? "AT+SPSSEND=" + t : "AT+SPSSEND"),  readLoop("at_spssend");
}),
/**
 * @at_targetconn
 * Setting or querying the connection index to use as the targeted connection.
When connected to several devices, the target connection decides which device you target when using commands such as AT+GATTCREAD, AT+GATTCWRITE, AT+GAPDISCONNECT, AT+GAPPAIR or AT+SPSSEND etc.
 * @param {string} t write connecton index of target device. if left empty it will show what device you are targeting at the momment.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_targetconn = function (t) {
    return writeCmd(t ? "AT+TARGETCONN=" + t : "AT+TARGETCONN"),  readLoop("at_targetconn");
}),
/**
 * @at_gapstatus
 * Reports the Bluetooth role.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gapstatus = function () {
    return writeCmd("AT+GAPSTATUS"), readLoop("at_gapstatus");
}),
/**
 * @at_gattcwrite
 * Write attribute to remote GATT server in ASCII. Can only be used in Central role and when connected to a peripheral. ex at_gattcwrite('001B','HELLO')
 * @param {string} handle_param pass handle param as string
 * @param {string} msg pass msg as string. 
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gattcwrite = function (handle_param,msg) {
    return writeCmd("AT+GATTCWRITE="+handle_param+" "+msg), readLoop("at_gattcwrite");
}),
/**
 * @at_gattcwriteb
 * Write attribute to remote GATT server in Hex. Can only be used in Central role and when connected to a peripheral.ex at_gattcwriteb('001B','0101')
 * @param {string} handle_param pass handle param as string
 * @param {string} msg pass msg as string.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gattcwriteb = function (handle_param,msg) {
    return writeCmd("AT+GATTCWRITEB="+handle_param+" "+msg), readLoop("at_gattcwriteb");
}),
/**
 * @at_gattcwritewr
 * Write (without response) attribute to remote GATT server in ASCII. Can only be used in Central role and when connected to a peripheral.
 * @param {string} handle_param pass handle param as string
 * @param {string} msg pass msg as string.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gattcwritewr = function (handle_param,msg) {
    return writeCmd("AT+GATTCWRITEWR="+handle_param+" "+msg), readLoop("at_gattcwritewr");
}),
/**
 * @at_gattcwritewrb
 * Write (without response) attribute to remote GATT server in Hex. Can only be used in Central role and when connected to a peripheral.
 * @param {string} handle_param pass handle param as string
 * @param {string} msg pass msg as string.
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gattcwritewrb = function (handle_param,msg) {
    return writeCmd("AT+GATTCWRITEWRB="+handle_param+" "+msg), readLoop("at_gattcwritewrb");
}),
/**
 * @at_gattcread
 * Read attribute of remote GATT server. Can only be used in Central role and when connected to a peripheral. ex at_gattcread('001B')
 * @param {string} handle_param pass handle param as string
 * @return {Promise} returns a promise
 * 
*/
(exports.at_gattcread = function () {
    return writeCmd("AT+GATTCREAD="+handle_param), readLoop("at_gattcread");
}),
/**
 * @help
 * Shows all AT-Commands.
 * @return {Promise} returns a promise
 * 
*/
(exports.help = function () {
    return writeCmd("--H"), readLoop("help");
}),
/**
 * @stop
 * Stops Current process.
 * @return {Promise} returns a promise
 * 
*/
(exports.stop = function () {
    return writeCmd(""), "Process Stopped";
});
class LineBreakTransformer {
    constructor() {
        this.container = "";
    }
    transform(t, e) {
        this.container += t;
        const r = this.container.split("\r\n");
        (this.container = r.pop()), r.forEach((t) => e.enqueue(t));
    }
    flush(t) {
        t.enqueue(this.container);
    }
}
async function readLoop(t, e) {
    for (arr = []; ; ) {
        const { done: r, value: a } = await reader.read();        
        switch ((a && arr.push(a), t)) {
            
            case "ata":
                if (2 == arr.length) return arr;
                break;
            case "atasps":
            if (2 == arr.length) return arr;
            break;
            case "atds":
                if (2 == arr.length) return arr;
                break;
            case "ati":
                if (arr.includes("Not Advertising") || arr.includes("Advertising")) return arr;
                break;
            case "ate":
                if (arr.includes("ECHO OFF") || arr.includes("ECHO ON")) return arr;
                break;
            case "at_central":
                return "Central Mode";
            case "at_dis":
                if (arr.includes("dis_info_end")) return arr;
                break;
            case "at_peripheral":
                return "Peripheral Mode";
            case "at_advstart":
                return "Advertising";
            case "at_advstop":
                return "Advertising Stopped";
            case "at_advdata":
            case "at_advdatai":
            case "at_advresp":
                if (2 == arr.length) return arr;
                break;
            case "at_cancelconnect":
                if (arr.includes("ERROR") || arr.includes("OK")) return arr;
                break;
            case "at_client":
                return "Client";  
            case "at_clearnoti":
                if (2 == arr.length) return arr;
                break;           
            case "at_dual":
                return "Dual Mode";
            case "at_enterpasskey":
                if (2 == arr.length) return arr;
                break;
            case "atr":
                return "Trigger platform reset";
            case "at_findscandata":                
                if (arr.length == e) {
                    const t = outputStream.getWriter();
                    return t.write(""), t.releaseLock(), arr;
                }
                break;
            case "at_gapdisconnectall":
                if (arr.includes("All connections terminated.")) return arr;
                break;
            case "at_gapiocap":
                if (3 == arr.length) return arr;
                break;            
            case "at_gappair":
                if (arr.includes("PAIRING SUCCESS") || arr.includes("BONDING SUCCESS")) return arr;
                break;
            case "at_gapunpair":
                if (arr.includes("UNPARIED.")|| 3 == arr.length) return arr;
                break;
            case "at_gapscan":
                if(e===true)
                    arr.some(function(v){ if (v.indexOf("RSSI")>=0 && a!='') console.log(a) })
                if (arr.includes("SCAN COMPLETE")) return arr;                
                break;
            case "at_getconn":
               if (arr.includes("No Connections found.") || 2 == arr.length )
               {
                   return arr;
               } 
            case "at_indi":
                if (2 == arr.length) return arr;
                break;
            case "at_noti":
                if (2 == arr.length) return arr;
                break;   
            case "at_scantarget":
                if (arr.length == e) {
                    const t = outputStream.getWriter();
                    return t.write(""), t.releaseLock(), arr.slice(2);
                }
                break; 
            case "at_setdis":
                if (2 == arr.length) return arr;
                break;  
            case "at_setpasskey":
                if (2 == arr.length) return arr;
                break;          
            case "at_gattcwrite":
                if (4 == arr.length) return arr;
                break;
            case "at_gapstatus":
                if (arr.includes("Not Advertising") || arr.includes("Advertising")) return arr;
                break;
            case "at_gattcwrite":
                if (4 == arr.length) return arr;
                break;
            case "at_gattcwriteb":
                if (4 == arr.length) return arr;
                break;
            case "at_gattcwritewr":
                if (2 == arr.length) return arr;
                break;
            case "at_gattcwritewrb":
                if (2 == arr.length) return arr;
                break;
            case "at_gattcread":
                if (4 == arr.length) return arr;
                break;
            case "at_gapconnect":
                if (arr.includes("CONNECTED.") || arr.includes("DISCONNECTED.") || arr.includes("ERROR") || arr.includes("PAIRING SUCCESS")) return arr;
                break;
            case "at_getservices":
                if (arr.includes("Value received: ")) return arr;
                break;
            case "at_getservicesonly":
                if (arr.includes("handle_evt_gattc_discover_completed: conn_idx=0000 type=SVC status=0")) return arr;
                break;
            case "at_getservicesdetails":
                if (arr.includes("handle_evt_gattc_browse_completed: conn_idx=0000 status=0")) 
                return arr;
                break;
        
            case "at_gapdisconnect":
                return "Disconnected.";
            case "at_numcompa":
                if (arr.includes("ERROR") || arr.includes("OK")) return arr;
                break;
            case "at_seclvl":
                if ((2 == arr.length))  return arr;
                break;
            case "at_server":
                return "Server";                   
            case "at_setnoti":
                if (20 == arr.length) return arr;
                break;
            case "at_setindi":
                if (2 == arr.length) return arr;
                break;
            case "at_spssend":                
            if (2 == arr.length || arr.includes("[Sent]")) return arr;  
            case "at_targetconn":                
            if (2 == arr.length) return arr;    
            case "help":
                if (arr.includes("[A] = Usable in All Roles")) return arr;
                break;
            default:                
                return "Nothing!";
        }
    }
    
}
   
},{}],"script.js":[function(require,module,exports) {
"use strict";

var my_dongle = _interopRequireWildcard(require("bleuio"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

document.getElementById('connect').addEventListener('click', function () {
  my_dongle.at_connect();
  document.getElementById("connect").classList.add('disabled');
});
var dev1BoardID = '45840D';
var dev2BoardID = '60FDED';
document.getElementById('getData').addEventListener('click', function () {
  //show loading
  document.getElementById("loading").style.display = "block"; //make the dongle in dual role , so it can scan for peripheral devices advertised data

  my_dongle.at_dual().then(function () {
    //scan for a devices advertised data, a PM sensor
    my_dongle.at_findscandata(dev1BoardID, 8).then(function (x) {
      //it returns an array of advertised data
      //from the array, we take the last one
      //it looks like this "[F9:0D:35:E7:72:65] Device Data [ADV]: 0201061BFF5B07050345840DB1031527FB002A010402040004000400000001"
      //then we split it by space
      //so we can get the advertised data only (the last part)
      return x[x.length - 1].split(" ").pop();
    }).then(function (adv1) {
      //now lets decode the advertised data for this device using the device documentaion
      var pmEnvData = advDataDecode(adv1); //we do the same process to get advertised data of another device
      //after waiting 1 seconds

      setTimeout(function () {
        my_dongle.at_findscandata(dev2BoardID, 8).then(function (y) {
          var adv2 = y[y.length - 1].split(" ").pop(); //again we decode the advertised data for this device using the device documentaion

          var co2EnvData = advDataDecode(adv2); //now merge pm data to this array

          co2EnvData.pm1 = pmEnvData.pm1;
          co2EnvData.pm25 = pmEnvData.pm25;
          co2EnvData.pm10 = pmEnvData.pm10;
          document.getElementById('airData').innerHTML = "\n                    Air Quality data from PM and CO2 sensor devices<br/><br/>\n                    CO2 : ".concat(co2EnvData.co2, " ppm<br/>\n                    PM 1.0 : ").concat(co2EnvData.pm1, " \xB5g/m\xB3<br/>\n                    PM 2.5 : ").concat(co2EnvData.pm25, " \xB5g/m\xB3<br/>\n                    PM 10 : ").concat(co2EnvData.pm10, " \xB5g/m\xB3<br/>\n                    Temperature : ").concat(co2EnvData.temp, " \xB0C<br/>\n                    Humidity : ").concat(co2EnvData.hum, " %rH<br/>\n                    Pressure : ").concat(co2EnvData.pressure, " mbar<br/>\n                    Light : ").concat(co2EnvData.light, " Lux<br/>\n\n                    "); //hide loading

          document.getElementById("loading").style.display = "none";
        });
      }, 1000);
    });
  });
});

var advDataDecode = function advDataDecode(data) {
  var pos = data.indexOf("5B0705");
  var dt = new Date();
  var currentTs = dt.getFullYear() + '/' + (dt.getMonth() + 1).toString().padStart(2, "0") + '/' + dt.getDate().toString().padStart(2, "0") + ' ' + dt.getHours().toString().padStart(2, "0") + ':' + dt.getMinutes().toString().padStart(2, "0") + ':' + dt.getSeconds().toString().padStart(2, "0");
  var tempHex = parseInt('0x' + data.substr(pos + 22, 4).match(/../g).reverse().join(''));
  if (tempHex > 1000) tempHex = (tempHex - (65535 + 1)) / 10;else tempHex = tempHex / 10;
  return {
    "boardID": data.substr(pos + 8, 6),
    "type": data.substr(pos + 6, 2),
    "light": parseInt('0x' + data.substr(pos + 14, 4).match(/../g).reverse().join('')),
    "pressure": parseInt('0x' + data.substr(pos + 18, 4).match(/../g).reverse().join('')) / 10,
    "temp": tempHex,
    "hum": parseInt('0x' + data.substr(pos + 26, 4).match(/../g).reverse().join('')) / 10,
    "pm1": parseInt('0x' + data.substr(pos + 34, 4).match(/../g).reverse().join('')) / 10,
    "pm25": parseInt('0x' + data.substr(pos + 38, 4).match(/../g).reverse().join('')) / 10,
    "pm10": parseInt('0x' + data.substr(pos + 42, 4).match(/../g).reverse().join('')) / 10,
    "co2": parseInt('0x' + data.substr(pos + 46, 4)),
    "ts": currentTs
  };
};
},{"bleuio":"node_modules/bleuio/index.js"}],"C:/Users/Shuhad/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61045" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/Shuhad/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map