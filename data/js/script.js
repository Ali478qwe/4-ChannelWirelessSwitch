import {toggle,ButtonClickHandler} from "./toggle.js"

const switch_one_id = document.getElementById("switch-one");
const switch_two_id = document.getElementById("switch-two");
const switch_three_id = document.getElementById("switch-three");
const switch_four_id = document.getElementById("switch-four");

function switch_style(){
    const state = this.button.querySelector("h1");
    (this.isOn == true) ? this.button.classList.add("button-on") : this.button.classList.add("button-off");
    (this.isOn == true) ? this.button.classList.remove("button-off") : this.button.classList.remove("button-on");
    state.textContent = (this.isOn == true) ?  "ON" : "OFF";
}

const switch_one = new toggle(false,switch_style,switch_one_id);
const switch_two = new toggle(false,switch_style,switch_two_id);
const switch_three = new toggle(false,switch_style,switch_three_id);
const switch_four = new toggle(false,switch_style,switch_four_id);

switch_one.clickHandler();
switch_two.clickHandler();
switch_three.clickHandler();
switch_four.clickHandler();

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

const WiFiSettingPanel_id = document.querySelector(".wifi-setting-panel");
const WiFiSettingButton_id = document.querySelector(".wifi-setting");

function displayWiFiSettingPanel(){
    (this.isOn == true) ? WiFiSettingPanel_id.style.display = "flex" : WiFiSettingPanel_id.style.display = "none";
}

const WiFiSettingButton = new toggle(false,displayWiFiSettingPanel,WiFiSettingButton_id);

WiFiSettingButton.clickHandler();
WiFiSettingButton.setState(true);



