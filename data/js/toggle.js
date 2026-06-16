class toggle{
    isOn;
    button;

    constructor(isOn=false,callableFunction,buttonElement,uniqueClassID=null) {
        this.isOn = isOn;
        this.button = buttonElement;
        this.ClassID = uniqueClassID;
        this.lastState = isOn;
        this.clickFlag = false;
        this.setFlag = false;

        if(typeof callableFunction === "function"){
            this.inlineFunction = callableFunction.bind(this);
        } 
        else{
          throw new Error("callableFunction must be function type.");
        }

    }

    clickHandler() {
        this.button.addEventListener("click", () => {
            this.clickFlag = true;
            this.lastState = this.isOn;
            this.isOn = !this.isOn;
            this.inlineFunction();
        });
    }

    setState(inputState) {
        this.setFlag = true;
        if(inputState != this.isOn){
            this.lastState = this.isOn;
            this.isOn = inputState;
            this.inlineFunction();
        }
        else{
            this.inlineFunction();
        }
        
    }

}

// function ButtonClickHandler(ButtonTextId,functionRef)
function ButtonClickHandler(ButtonTextId,functionRef){
      document.getElementById(ButtonTextId).addEventListener("click",functionRef);
}

export { toggle , ButtonClickHandler };
