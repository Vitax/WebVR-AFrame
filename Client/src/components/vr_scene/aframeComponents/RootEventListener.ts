export default AFRAME.registerComponent('click-listener', {
    init: function () {
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

        let that = this;
        let cachedButton: any;
        let camera = document.getElementById("cameraContainer");

        function toggleVisible(el: HTMLElement) {
            let branchElement = document.getElementById("branch".concat(el.id));
            branchElement.getAttribute('color') === 'green' ? branchElement.setAttribute('color', 'yellow') : branchElement.setAttribute('color', 'green');
            branchElement.setAttribute('visible', (!branchElement.getAttribute('visible')).toString())

            branchElement.childNodes.forEach(branchNode => {
                if ((branchNode as any).getAttribute("color") == "red" && branchNode.parentElement == branchElement) {
                    (branchNode as any).setAttribute("color", "orange");
                    document.getElementById('infoInterface') && camera.removeChild(document.getElementById("infoInterface"));
                    return;
                }
            })
        }

        function handleInput() {
            if (!that.gamepad) return;

            if (buttonPressed(that.gamepad.buttons[0], false) && that.targetElement != null) {
                toggleVisible(that.targetElement.srcElement);
            }

            requestAnimationFrame(handleInput);
        }


        window.addEventListener('gamepadconnected', function (event) {
            let gamepads = navigator.getGamepads ? navigator.getGamepads() : ((navigator as any).webkitGetGamepads ? (navigator as any).webkitGetGamepads() : []);
            that.gamepad = gamepads[0];
            window.setTimeout(handleInput, 1000 / 60)
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

        this.el.addEventListener('mousedown', function () {
            toggleVisible(that.el);
        })
    }
})