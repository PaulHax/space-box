
import { AdvancedDynamicTexture, InputText } from "@babylonjs/gui/2D";


export class Label {
    input: InputText;

    static advancedTexture: AdvancedDynamicTexture;

    constructor(defaultText: string) {

        if(!Label.advancedTexture) {
            Label.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        }

        this.input = new InputText();
        this.input.fontFamily = "Monospace";
        this.input.text = defaultText;
        this.input.height = "40px";
        // Hack to resize on text change
        this.input.processKeyboard = (evt): void => {
            this.input.processKey(evt.keyCode, evt.key);
            this.input.autoStretchWidth = true;
        };
        this.input.onFocusSelectAll = true;

        this.input.color = "white";
        this.input.background = "transparent";
        this.input.focusedBackground = "rgba(0, 0, 0, .4)";
        this.input.highligherOpacity = .2;
        this.input.thickness = 0;

        this.input.shadowColor = 'black';
        this.input.shadowBlur = 15;
        
        Label.advancedTexture.addControl(this.input);
    }

}
