class toggle{
    isOn;
    button;

    constructor(isOn=false,callableFunction,buttonElement,uniqueClassID=null) {
        this.isOn = isOn;
        this.button = buttonElement;
        this.ClassID = uniqueClassID;

        if(typeof callableFunction === "function"){
            this.inlineFunction = callableFunction.bind(this);
        } 
        else{
          throw new Error("func_style must be function type.");
        }

    }

    clickHandler() {
        this.button.addEventListener("click", () => {
        this.isOn = !this.isOn;
        this.inlineFunction();
        });
    }

    setState(isOn) {
        this.isOn = isOn;
        this.inlineFunction();
    }

}

// function ButtonClickHandler(ButtonTextId,functionRef)
function ButtonClickHandler(ButtonTextId,functionRef){
      document.getElementById(id).addEventListener("click",functionRef);
}

export { toggle , ButtonClickHandler };
