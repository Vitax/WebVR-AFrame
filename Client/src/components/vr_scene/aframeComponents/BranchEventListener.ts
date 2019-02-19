export default AFRAME.registerComponent('branch-listener', {
    init: function () {
        let el = this.el;
        let that = this;
        let cachedButton: any;
        let camera = document.getElementById("cameraContainer");

        function buttonPressed(button: any, hold: boolean): boolean {
            let buttonState: boolean = false;

            if (hold) {
                if (button.pressed) {
                    buttonState = true;
                }
            } else {
                if (button.pressed && cachedButton != button) {
                    cachedButton = button;
                    buttonState = true;
                }

                if (!button.pressed && cachedButton == button) {
                    cachedButton = null;
                }
            }

            return buttonState;
        }

        function appendInterface(camera: HTMLElement, el: HTMLElement) {
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
                    information = information.concat(key.toUpperCase()).concat(" : ").concat(element).concat("\n");
                }
            }

            infoInterface.setAttribute("text", "color: #FBF1C7; value: " + information);
            camera.appendChild(infoInterface);
            el.setAttribute("color", "red");
        }

        function handleInput() {
            if (!that.gamepad) return;

            if (buttonPressed(that.gamepad.buttons[0], false) && that.targetElement != null) {
                if (el.parentElement.getAttribute('visible') == true) {
                    let activeElem: HTMLElement;
                    let interfaceElem = document.getElementById("infoInterface");

                    el.parentNode.childNodes.forEach(branchNode => {
                        branchNode.getAttribute("color") == "red" && (activeElem = branchNode)
                    })

                    if (!interfaceElem) {
                        appendInterface(camera, el);
                    }

                    if (activeElem && interfaceElem && el != activeElem) {
                        activeElem.setAttribute("color", "orange");
                        camera.removeChild(interfaceElem);

                        appendInterface(camera, el);
                    }
                }
            }

            if (buttonPressed(that.gamepad.buttons[1], false)) {
                let activeElem: HTMLElement;
                let interfaceElem = document.getElementById("infoInterface");

                el.parentNode.childNodes.forEach(branchNode => {
                    (branchNode as any).getAttribute("color") == "red" && (activeElem = branchNode)
                })

                if (activeElem && interfaceElem && el.innerHTML == activeElem.innerHTML) {
                    el.setAttribute("color", "orange");
                    camera.removeChild(interfaceElem);
                }
            }

            requestAnimationFrame(handleInput);
        }


        window.addEventListener('gamepadconnected', function (event) {
            let gamepads = navigator.getGamepads ? navigator.getGamepads() : ((navigator as any).webkitGetGamepads ? (navigator as any).webkitGetGamepads() : []);
            that.gamepad = gamepads[0];

            handleInput();
        })

        window.addEventListener('gamepaddisconnected', function (event) {
            cancelAnimationFrame(handleInput.bind(this));
        })

        this.el.addEventListener('raycaster-intersected', function (element) {
            that.targetElement = element;
        })

        this.el.addEventListener('raycaster-intersected-cleared', function () {
            that.targetElement = null;
        })

        el.addEventListener('mousedown', function () {
            if (el.parentElement.getAttribute('visible') == true) {
                let activeElem: HTMLElement;
                let interfaceElem = document.getElementById("infoInterface");

                el.parentNode.childNodes.forEach(branchNode => {
                    (branchNode as any).getAttribute("color") == "red" && (activeElem = branchNode)
                })

                if (!interfaceElem) {
                    appendInterface(camera, el);
                }

                if (activeElem && interfaceElem && el.innerHTML == activeElem.innerHTML) {
                    el.setAttribute("color", "orange");
                    camera.removeChild(interfaceElem);
                }

                if (activeElem && interfaceElem && el != activeElem) {
                    activeElem.setAttribute("color", "orange");
                    camera.removeChild(interfaceElem);

                    appendInterface(camera, el);
                }

            }
        })
    },
})