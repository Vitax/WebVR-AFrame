export default AFRAME.registerComponent('branch-listener', {
    schema: {
        default: "",
    },
    init: function () {
        let cachedButton: any;
        this.camera = document.getElementById("cameraContainer");

        this.buttonPressed = (button: any, hold: boolean): boolean => {
            let buttonState: boolean = false;

            if (hold) {
                if (button.pressed) {
                    buttonState = true;
                }
            } else {
                if (button.pressed && cachedButton != button) {
                    buttonState = true;
                    cachedButton = button;
                }

                if (!button.pressed && cachedButton == button) {
                    buttonState = false;
                    cachedButton = null;
                }
            }

            return buttonState;
        }

        this.appendInterface = (el: HTMLElement) => {
            let infoInterface = document.createElement("a-entity");
            infoInterface.setAttribute("id", "infoInterface")
            infoInterface.setAttribute("position", "0 -0.5 -2");
            infoInterface.setAttribute("rotation", "-25 0 0");
            infoInterface.setAttribute("geometry", "primitive: plane; height: auto; width: auto;")
            infoInterface.setAttribute("material", "color: #282828;");

            let information = "";
            let branchInformation = JSON.parse(el.getAttribute('branchinformation'));

            for (let key in branchInformation) {
                if (branchInformation.hasOwnProperty(key)) {
                    let element = branchInformation[key];
                    // create information text here
                    information = information.concat(key.toUpperCase()).concat(" : \t").concat(element).concat("\n");
                }
            }
            infoInterface.setAttribute("text", "color: #FBF1C7; value: " + information);

            this.camera.appendChild(infoInterface);
            el.setAttribute("color", "red");

            this.activeElement = el;
        }

        this.el.addEventListener('mousedown', () => {
        })

        this.el.addEventListener('raycaster-intersected', (element) => {
            this.target = element.target;
        })

        this.el.addEventListener('raycaster-intersected-cleared', () => {
            this.target = null;
        })

        window.addEventListener('gamepadconnected', () => {
            let gamepads = navigator.getGamepads ? navigator.getGamepads() : ((navigator as any).webkitGetGamepads ? (navigator as any).webkitGetGamepads() : []);
            this.gamepad = gamepads[0];
        })

        window.addEventListener('gamepaddisconnected', () => {
            this.gamepad = null;
        })
    },
    tick: function () {
        if ((this.gamepad === null || this.gamepad === undefined) || (this.target === undefined || this.target === null)) {
            return;
        }

        if (this.buttonPressed(this.gamepad.buttons[0], false)) {
            console.log('branch button pressed')
            const interfaceElem = document.getElementById("infoInterface");

            if (!interfaceElem) {
                this.appendInterface(this.target);
            }

            if (interfaceElem && this.activeElement && this.target.innerHTML === this.activeElement.innerHTML) {
                this.target.setAttribute("color", "orange");
                this.camera.removeChild(interfaceElem);
            }
        }
        //     if (targetElement && targetElement.parentElement.getAttribute('visible') == true) {
        //         let interfaceElem = document.getElementById("infoInterface");

        //         targetElement.parentNode.childNodes.forEach(branchNode => {
        //             branchNode.getAttribute("color") == "red" && (activeElem = branchNode)
        //         })

        //         if (!interfaceElem) {
        //             appendInterface(camera, targetElement);
        //         }

        //         if (activeElem && interfaceElem && targetElement.innerHTML != activeElem.innerHTML) {
        //             activeElem.setAttribute("color", "orange");
        //             camera.removeChild(interfaceElem);

        //             appendInterface(camera, targetElement);
        //         }
        //     }
        // }

        // if (buttonPressed(gamepad.buttons[1], false)) {
        //     let interfaceElem = document.getElementById("infoInterface");

        //     if (targetElement != null && targetElement.parentNode != null)
        //         targetElement.parentNode.childNodes.forEach(branchNode => {
        //             branchNode.getAttribute("color") === "red" && (activeElem = branchNode)
        //         })

        //     if (activeElem && interfaceElem) {
        //         activeElem.setAttribute("color", "orange");
        //         camera.removeChild(interfaceElem);
        //     }
        // }
    }
})