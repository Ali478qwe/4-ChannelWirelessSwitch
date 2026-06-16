import {toggle,ButtonClickHandler} from "./toggle.js"

//* Switch Control

let Buttons = {Button : { switch_name : "" , state : false , "test": 1}};

const switch_one_id = document.getElementById("switch-one");
const switch_two_id = document.getElementById("switch-two");
const switch_three_id = document.getElementById("switch-three");
const switch_four_id = document.getElementById("switch-four");

function switch_style(){
    const state = this.button.querySelector("h1");

    (this.isOn == true) ? this.button.classList.add("button-on") : this.button.classList.add("button-off");
    (this.isOn == true) ? this.button.classList.remove("button-off") : this.button.classList.remove("button-on");
    state.textContent = (this.isOn == true) ?  "ON" : "OFF";

    if (this.ClassID == 1){
       Buttons.Button.switch_name = "switch-one";
    }
    else if (this.ClassID == 2){
        Buttons.Button.switch_name = "switch-two"
    }
    else if (this.ClassID == 3){
        Buttons.Button.switch_name = "switch-three";
    }
    else if (this.ClassID == 4){
        Buttons.Button.switch_name = "switch-four";
    }
    else{
        console.log("switch not defined with this class id");
    }

    Buttons.Button.state = this.isOn;
    console.log(`${Buttons.Button.switch_name}`);
    console.log(Buttons);
    if (typeof websocket !== 'undefined' &&  websocket.readyState === websocket.OPEN && this.isOn != this.lastState && this.clickFlag == true){
        this.clickFlag = false;
        websocket.send(JSON.stringify(Buttons));
    }
    else if(this.clickFlag == true){
        console.warn("WebSocket is not connected or available.")
    }

}

var wsConnected = true;
const switch_one = new toggle(false,switch_style,switch_one_id,1);
const switch_two = new toggle(false,switch_style,switch_two_id,2);
const switch_three = new toggle(false,switch_style,switch_three_id,3);
const switch_four = new toggle(false,switch_style,switch_four_id,4);

function enableClickHandler(){
    switch_one.clickHandler();
    switch_two.clickHandler();
    switch_three.clickHandler();
    switch_four.clickHandler();
}




function setSwitchesState(jsonSwitchObject){

     if (jsonSwitchObject.Switch.switch_name == "switch-one"){
        switch_one.setState(jsonSwitchObject.Switch.state);
    }
    else if (jsonSwitchObject.Switch.switch_name == "switch-two"){
        switch_two.setState(jsonSwitchObject.Switch.state);
    }
    else if (jsonSwitchObject.Switch.switch_name == "switch-three"){
        switch_three.setState(jsonSwitchObject.Switch.state);
    }
    else if (jsonSwitchObject.Switch.switch_name == "switch-four"){
        switch_four.setState(jsonSwitchObject.Switch.state);
    }
    else{
        console.log("we have not defineation object :\n", jsonSwitchObject);
    }

}

//* Setting Control 

const ControlPanel_id = document.getElementById("ControlPanel");
const closeButtonControlPanel_id = document.getElementById("close-button");

function cp_dispaly_items(visible){
    const items = document.querySelectorAll("#cp-item");

    if(visible == true){
        items.forEach((element) => {
            setTimeout(() => {element.classList.add("active")},250);
        });
    }
    else if(visible == false){
        items.forEach((element) => {
            setTimeout(() => {element.classList.remove("active")},250);
        });
    }
}

function control_panel_func(){
    ControlPanel_id.style.width = (this.isOn == true) ? "200px" : "50px" ; 
    (this.isOn == true) ? closeButtonControlPanel_id.classList.add("active") : closeButtonControlPanel_id.classList.remove("active");
    cp_dispaly_items((this.isOn == true ? true : false));
}

const ControlPanel = new toggle(false,control_panel_func,closeButtonControlPanel_id);

ControlPanel.clickHandler();

const themeButtonElement = document.querySelector(".theme");

function changeTheme(){
    const themeIcon = themeButtonElement.querySelector("img");
    document.body.classList.add((this.isOn == true) ? "light-theme" : "dark-theme");
    document.body.classList.remove((this.isOn == true) ?  "dark-theme" : "light-theme");
    themeIcon.src = (this.isOn == true) ? "/icon/moon.png" : "/icon/sun.png" ;
    window.localStorage.setItem("theme-mode",this.isOn);
}

const themeButton = new toggle(false,changeTheme,themeButtonElement,null);

themeButton.clickHandler();

if("theme-mode" in localStorage){
    themeButton.setState(window.localStorage.getItem("theme-mode") === "true" ? true : false);
}



//* WiFi Setting 

const WiFiSettingPanel_id = document.querySelector(".wifi-setting-panel");
const WiFiSettingButton_id = document.querySelector(".wifi-setting");

function displayWiFiSettingPanel(){
    (this.isOn == true) ? WiFiSettingPanel_id.style.display = "flex" : WiFiSettingPanel_id.style.display = "none";
}

const WiFiSettingButton = new toggle(false,displayWiFiSettingPanel,WiFiSettingButton_id);

WiFiSettingButton.clickHandler();
// WiFiSettingButton.setState(true);

const PasswordVisibilityElement = document.querySelector(".password-visibility");
const PasswordVisibilityIcon = PasswordVisibilityElement.querySelector("img");
const PasswordFieldElement   = document.getElementById("wifi-password");

function displayPassword(){
    PasswordVisibilityIcon.src  =  (this.isOn == true) ?  "icon/eye.svg" : "icon/eye-off.svg";
    PasswordFieldElement.type = (this.isOn == true) ? 'text' : 'password';
}

const PasswordVisibilityButton = new toggle(false,displayPassword,PasswordVisibilityElement);

PasswordVisibilityButton.clickHandler();

ButtonClickHandler("send-wifi-name",() => {

    const wifi_name = document.getElementById("wifi-name").value;

    if (typeof websocket !== 'undefined' &&  websocket.readyState === websocket.OPEN && wifi_name.length > 0){
        websocket.send(JSON.stringify({"setting" : { "wifi_name" : wifi_name}}));
    }
    else{
        console.warn("WebSocket is not connected or available.")
    }
});

ButtonClickHandler("send-wifi-password",() => {

    const wifi_password = document.getElementById("wifi-password").value;

    if (typeof websocket !== 'undefined' &&  websocket.readyState === websocket.OPEN && wifi_password.length > 0){
        websocket.send(JSON.stringify({"setting" : { "wifi_password" : wifi_password}}));
    }
    else{
        console.warn("WebSocket is not connected or available.")
    }
});

ButtonClickHandler("restart",() => {
     if (typeof websocket !== 'undefined' &&  websocket.readyState === websocket.OPEN){
        websocket.send(JSON.stringify({"setting" : {"restart" : true}}));
    }
    else{
        console.warn("WebSocket is not connected or available.")
    }
});

ButtonClickHandler("restore",() =>{
    if (typeof websocket !== 'undefined' &&  websocket.readyState === websocket.OPEN){
        websocket.send(JSON.stringify({"setting" : {"restore" : true}}));
    }
    else{
        console.warn("WebSocket is not connected or available.")
    }
});

//* WebSocket 


const connectionElement = document.querySelector(".connection");
const connectionStatsuElement = document.querySelector(".connection-status");
const IPElement = document.querySelector(".local-ip");


const ws_url = "ws://192.168.4.1/ws";
const websocket = new WebSocket(ws_url);

IPElement.innerText = window.location.hostname;

if (websocket.readyState === WebSocket.CONNECTING){
    connectionStatsuElement.innerText = "CONNECTING";
    connectionElement.style.borderColor = "yellow";
    connectionElement.style.backgroundColor = "#ffe6007e";
}
else{
    connectionStatsuElement.innerText = "DISCONNECTED";
    connectionElement.style.borderColor = "gray";
    connectionElement.style.backgroundColor = "#00000046";
}


websocket.addEventListener("open", () => {
    console.log("CONNECTED");
    enableClickHandler();
    connectionStatsuElement.innerText = "CONNECTED";
    connectionElement.style.borderColor = "green";
    connectionElement.style.backgroundColor = "#00ff6a46";
    
});

websocket.addEventListener("error", (e) =>{
    console.error("WebSocket Error : ", e );
});

websocket.addEventListener("message" , (message) => {
    let data = message.data;
    let reciveObjects = JSON.parse(data);
    console.log("receivedObject : ",reciveObjects);
    setSwitchesState(reciveObjects);
});

websocket.addEventListener("close", () => {
    console.log("DISCONNECTED");
    connectionStatsuElement.innerText = "DISCONNECTED";
    connectionElement.style.borderColor = "red";
    connectionElement.style.backgroundColor = "#ff000046";

});


