class ClickAndHold {
    /**
     *  @param {EventTarget} target The HTML element to apply the event to 
     *  @param {Function} callback  The function to run once the target is clicked and held
     */

    constructor(target, callback) {
        this.target = target;
        this.callback = callback;
        this.isHeld = false;
        this.actveHoldTimeOutId = null;

        ["mousedown", "touchstart"].forEach(type => {
            this.target.addEventListener(type, this._onHoldStart.bind(this));
        });

        ["mouseup", "mouseleave", "mouseout", "touchend", "touchcancel"].forEach(type => {
            this.target.addEventListener(type, this._onHoldEnd.bind(this));
        });
    }

    _onHoldStart(e) {
        this.isHeld = true;
        this.actveHoldTimeOutId = setInterval(() => {
            this.callback(e);
        }, 200)
    }

    _onHoldEnd() {
        this.isHeld = false;
        clearInterval(this.actveHoldTimeOutId);
    }
}