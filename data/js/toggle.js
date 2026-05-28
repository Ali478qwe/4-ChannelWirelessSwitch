class toggle{
    isOn;
    button;

    constructor(isOn=false,func_style,buttonElement) {
        this.isOn = isOn;
        this.button = buttonElement;

        if(typeof func_style === "function"){
            this.func_style = func_style.bind(this);
        } 
        else{
          throw new Error("func_style must be function type.");
        }

    }

    clickHandler() {
        this.button.addEventListener("click", () => {
        this.isOn = !this.isOn;
        this.func_style();
        });
    }

    setState(isOn) {
        this.isOn = isOn;
        this.func_style();
    }

}

// function ButtonClickHandler(ButtonTextId,functionRef)
function ButtonClickHandler(ButtonTextId,functionRef){
      document.getElementById(id).addEventListener("click",functionRef);
}

export { toggle , ButtonClickHandler };
