 #include <RCSwitch.h>

RCSwitch rs = RCSwitch();

void setup() {
  Serial.begin(115200);
  rs.enableTransmit(8);
  rs.setPulseLength(433);
  rs.setProtocol(1);
}

void loop() {
  if(Serial.available() > 0){
    char in = Serial.read();
    switch (in) {
      case '1':
        Serial.println("1");
        rs.send(111111,24);
        delay(1000);
        break;
      case '2':
        Serial.println("2");
        rs.send(222222,24);
        delay(1000);
        break;
      case '3':
        Serial.println("3");
        rs.send(333333,24);
        delay(1000);
        break;
      case '4':
        Serial.println("4");
        rs.send(444444,24);
        delay(1000);
        break;
      
    }
  }

}
