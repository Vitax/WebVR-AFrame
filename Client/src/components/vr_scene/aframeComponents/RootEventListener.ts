export default AFRAME.registerComponent("click-listener", {
    schema: {
        default: "",
    },
    init: function() {
        let cachedButton: any;
        let camera = document.getElementById("cameraContainer");

        this.buttonPressed = (button: any, hold: boolean): boolean => {
            let buttonState: boolean = false;

            if (hold) {
                if (button.pressed) buttonState = true;
            } else {
                if (button.pressed && cachedButton != button) {
                    cachedButton = button;
                    buttonState = true;
                } else if (!button.pressed && cachedButton == button) {
                    cachedButton = null;
                }
            }

            return buttonState;
        };

        this.toggleVisible = function(el: HTMLElement) {
            let branchElement = document.getElementById("branch".concat(el.id));

            if (branchElement) {
                el.getAttribute("color") === "green"
                    ? this.el.setAttribute("color", "yellow")
                    : this.el.setAttribute("color", "green");

                branchElement.setAttribute("visible", (!Boolean(branchElement.getAttribute("visible"))).toString());
                branchElement.childNodes.forEach(branchNode => {
                    if (
                        (branchNode as any).getAttribute("color") == "red" &&
                        branchNode.parentElement == branchElement
                    ) {
                        (branchNode as any).setAttribute("color", "orange");
                        document.getElementById("infoInterface") &&
                            camera.removeChild(document.getElementById("infoInterface"));
                    }
                });
            }
        };

        this.el.addEventListener("mousedown", () => {
            this.toggleVisible(this.target);
        });

        this.el.addEventListener("raycaster-intersected", element => {
            this.target = element.target;
        });

        this.el.addEventListener("raycaster-intersected-cleared", () => {
            this.target = null;
        });

        window.addEventListener("gamepadconnected", () => {
            let gamepads = navigator.getGamepads
                ? navigator.getGamepads()
                : (navigator as any).webkitGetGamepads
                ? (navigator as any).webkitGetGamepads()
                : [];
            this.gamepad = gamepads[0];
        });

        window.addEventListener("gamepaddisconnected", () => {
            this.gamepad = null;
        });
    },
    tick: function() {
        if (
            (this.gamepad === undefined || this.gamepad === null) ||
            (this.target === null || this.target === undefined)
        ) {
            return;
        }

        if (this.buttonPressed(this.gamepad.buttons[0], false)) {
            this.toggleVisible(this.target);
        }
    },
});
