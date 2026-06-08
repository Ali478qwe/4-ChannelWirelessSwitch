#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <FS.h>
#include <SPIFFS.h>
#include <Preferences.h>


#define SWITCH_ONE_PIN 1
#define SWITCH_TWO_PIN 2
#define SWITCH_THREE_PIN 9
#define SWITCH_FOUR_PIN 10
#define RXB22_DATA_PIN 8


typedef struct {
    uint8_t relayPin;
    volatile bool relayState;
    String relayName;
} relay_t;

typedef struct{
    char SSID[32];
    char Password[32];
}wifi_setting;

wifi_setting APInfo;

Preferences _flash;

relay_t switch_one = {SWITCH_ONE_PIN,false,"switch-one"};
relay_t switch_two = {SWITCH_TWO_PIN,false,"switch-two"};
relay_t switch_three = {SWITCH_THREE_PIN,false,"switch-three"};
relay_t switch_four = {SWITCH_FOUR_PIN,false,"switch-four"};

relay_t switchs[4] = {switch_one,switch_two,switch_three,switch_four};

const char * web_page_file = "/index.html";

AsyncWebServer server(80);
AsyncWebSocket web_socket("/ws");

IPAddress local_IP(192,168,4,1);
IPAddress gateway(192,168,4,1);
IPAddress subnet(255,255,255,0);

String wsMessage = "";
bool wsNewMessage = false;

StaticJsonDocument<256> receivedMessage;
StaticJsonDocument<256> sendMessage;

void initSPIFFS(){
    if(!SPIFFS.begin(false)){
      Serial.println("SPIFFS NOT MOUNTED");
      return;
    }
    Serial.println("SPIFFS MOUNTED SUCCESSFULLY");

    Serial.println((SPIFFS.exists(web_page_file) ? "Web Page File Exists" : "Web Page File Not Found")); 
}



void WebSocketMessageHandler(void * arg,uint8_t * data,size_t len){

    AwsFrameInfo * info = (AwsFrameInfo*) arg;

    if(info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT){
      
      String message = "";

      for(size_t index = 0; index < len;index++){
          message += (char)data[index];
      }

      wsMessage = message;
      wsNewMessage = true;

    }
}

void sendSwitchStatus(StaticJsonDocument<256>& sendMessage,String switch_name,bool state){

    sendMessage["Switch"]["switch_name"] = switch_name;
    sendMessage["Switch"]["state"] = state;

    String output; 

    serializeJson(sendMessage,output);

    web_socket.textAll(output);

}

void switchStatusSender(void){
    for(uint8_t index = 0; index < 4;index++){
      sendSwitchStatus(sendMessage,switchs[index].relayName,switchs[index].relayState);
    }
}

void web_socket_handler(AsyncWebSocket * server,AsyncWebSocketClient * client,AwsEventType type,void * arg, uint8_t * data,size_t len){

    switch(type){

      case WS_EVT_CONNECT:
        Serial.printf("WebSocket client #%u connected from %s \n",client->id(),client->remoteIP().toString().c_str());
        switchStatusSender();
        break;
      case WS_EVT_DISCONNECT:
        Serial.printf("WebSocket client #%u disconnected\n",client->id());
        break;
      case WS_EVT_DATA:
        WebSocketMessageHandler(arg,data,len);
        break;
      case WS_EVT_PONG:
      case WS_EVT_ERROR:
        break;
    }
  
}

void safe_strcpy(char * dest , const char * src, size_t dest_len){

    if(src == nullptr){
      dest[0] = '\0';
      return;
    }

    size_t src_len = strlen(src);

    size_t copy_len = (src_len < dest_len - 1) ? src_len : dest_len - 1;

    memcpy(dest,src,copy_len);
    dest[copy_len] = '\0';

}

void LoadSetting(const char * defaultSSID,const char * defaultPassword){
    _flash.begin("wifi_setting",true);
    safe_strcpy(APInfo.SSID,_flash.getString("wifi_name",defaultSSID).c_str(),sizeof(APInfo.SSID));
    safe_strcpy(APInfo.Password,_flash.getString("wifi_password",defaultPassword).c_str(),sizeof(APInfo.Password));
    _flash.end();

    Serial.println("__________ Load WiFi Setting __________");
    Serial.printf("WIFI Name : %s\n",APInfo.SSID);
    Serial.printf("WIFI Password : %s\n",APInfo.Password);
    Serial.println("_______________________________________");
}

bool JSON_PARSER(String& json,StaticJsonDocument<256>& receivedMessage){

    DeserializationError error = deserializeJson(receivedMessage,json);

    if(error){
        Serial.print("JSON Parse Error: ");
        Serial.println(error.c_str());
        return false;
    }
    return true;
}

void ChangeSettings(StaticJsonDocument<256>& receivedMessage){
    if(!receivedMessage.containsKey("setting")) return;

    if(receivedMessage["setting"].containsKey("restart")) ESP.restart();

    if(receivedMessage["setting"].containsKey("restore")){
        _flash.begin("wifi_setting",false);
        _flash.putString("wifi_name","RemoteSwitch");
        _flash.putString("wifi_password","");
        _flash.end();
        ESP.restart();
    }

    if(receivedMessage["setting"].containsKey("wifi_name")){
        const char * wifi_name = receivedMessage["setting"]["wifi_name"];
        if(wifi_name != nullptr){
          _flash.begin("wifi_setting",false);
          _flash.putString("wifi_name",wifi_name);
          _flash.end();
        }
    }

    if(receivedMessage["setting"].containsKey("wifi_password")){
      const char * wifi_password = receivedMessage["setting"]["wifi_password"];
      if(wifi_password != nullptr){
        _flash.begin("wifi_setting",false);
        _flash.putString("wifi_password",wifi_password);
        _flash.end();
      }
    }

    Serial.println("__________ Change WiFi Setting __________");
    Serial.printf("WIFI Name : %s\n",APInfo.SSID);
    Serial.printf("WIFI Password : %s\n",APInfo.Password);
    Serial.println("_________________________________________");
}
  
void setSwitchesFromWebServer(StaticJsonDocument<256>& receivedMessage){
    if(!receivedMessage.containsKey("Button")) return;

    if(receivedMessage.containsKey("Button")){
      for(uint8_t index =0;index < 4;index++){
        if(switchs[index].relayName == receivedMessage["Button"]["switch_name"]){
          switchs[index].relayState = ! switchs[index].relayState;
          digitalWrite(switchs[index].relayPin,switchs[index].relayState ? HIGH : LOW);
        }
      }
    }
}




void setup(){

    pinMode(switch_one.relayPin,OUTPUT);
    pinMode(switch_two.relayPin,OUTPUT);
    pinMode(switch_three.relayPin,OUTPUT);
    pinMode(switch_four.relayPin,OUTPUT);
    pinMode(RXB22_DATA_PIN,INPUT);

    Serial.begin(115200);

    LoadSetting("RemoteSwitch","");

    WiFi.softAPConfig(local_IP,gateway,subnet) ? Serial.println("IP Setting Applied") : Serial.println("Failed to apply IP Setting");

    WiFi.softAP(APInfo.SSID,APInfo.Password);


    Serial.print("Access Point IP Address : ");
    Serial.println(WiFi.softAPIP());

    initSPIFFS();

    web_socket.onEvent(web_socket_handler);
    server.addHandler(&web_socket);

    server.serveStatic("/",SPIFFS,"/").setDefaultFile("index.html").setCacheControl("no-cache, no-store,must-revalidate");

    server.begin();

}

void loop(){

    if(wsNewMessage){
      wsNewMessage = false;

      bool json_flag = JSON_PARSER(wsMessage,receivedMessage);

      if(json_flag){
        ChangeSettings(receivedMessage);
        setSwitchesFromWebServer(receivedMessage);
      }
      Serial.println(wsMessage);
    }

    web_socket.cleanupClients();

}