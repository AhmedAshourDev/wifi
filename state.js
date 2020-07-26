const child_process = require("child_process");


function getInterfaceName (interface_name) {
  switch (interface_name) {
    case "wifi": return "Wi-Fi";
    case "ethernet": return "Ethernet";
  }
}

const SHOW_INTERFACE = [ "interface", "show", "interface" ];
const SET_INTERFACE = [ "interface", "set", "interface" ];
/*
Wi-Fi                                      
   Type:                 Dedicated
   Administrative state: Enabled
   Connect state:        Disconnected
*/
function isEnabled (interface_name) {
  interface_name = getInterfaceName(interface_name);
  let stdout = child_process.spawnSync("netsh", [ ...SHOW_INTERFACE, interface_name ]);
  let data = stdout.stdout.toString();
  for (let line of data.split('\n')) {
    let _line = line.trim().toLowerCase();
    if (_line.includes("administrative state")) {
      if (!_line.includes("disabled")) {
        return true;
      }
      break;
    }
  }
  return false;
}
module.exports.isEnabled = isEnabled;
/*
Wi-Fi                                      
   Type:                 Dedicated
   Administrative state: Enabled
   Connect state:        Disconnected
*/
function isConnected (interface_name) {
  if (!isEnabled( interface_name )) return false;
  interface_name = getInterfaceName(interface_name);
  let stdout = child_process.spawnSync("netsh", [ ...SHOW_INTERFACE, interface_name ]);
  let data = stdout.stdout.toString();
  for (let line of data.split('\n')) {
    let _line = line.trim().toLowerCase();
    if (_line.includes("connect state")) {
      if (!_line.includes("disconnected")) {
        return true;
      }
    }
  }
  return false;
}
module.exports.isConnected = isConnected;

/**
*@promise need
*/
function isWifiConnected() {
  return isConnected("wifi");
}
function isWifiEnabled() {
  return isEnabled("wifi");
}
module.exports.isWifiConnected = isWifiConnected;
module.exports.isWifiEnabled = isWifiEnabled;

function setState (interface_name, state=true) {
  if (isEnabled( interface_name ) !== state) {
    interface_name = getInterfaceName(interface_name);
    child_process.spawnSync("netsh", [
      ...SET_INTERFACE, "name=" + interface_name,
      "admin=" + (state ? "enabled": "disabled")
    ]);
  }
}
module.exports.setState = setState;

function setWifiEnable () {
  setState("wifi", true);
}
function setWifiDisable () {
  setState("wifi", false);
}
module.exports.setWifiEnable = setWifiEnable;
module.exports.setWifiDisable = setWifiDisable;

