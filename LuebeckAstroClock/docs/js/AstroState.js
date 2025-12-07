// AstroState.js — ausgelagerte Zustandsklasse für die Uhr
export class AstroState {
    /**
     * @param {number} initialSpeed - Anfangsgeschwindigkeit (0.1..5), Standard 0.5
     */
    constructor(initialSpeed = 0.5) {
        this.angleSun = 0;
        this.angleMoon = 0;
        this.angleZodiac = 0;
        this.mondAlter = 1;
        this.mondAlterFractional = 0;
        this.speed = initialSpeed;
        this.animationRunning = false;
        this.animationFrameId = null;
        this.simDate = new Date();
        this.bgInitialAngle = 0;
        this.useBackgroundImage = true;
        this.zodiacDayOffsetAngle = 0;
        this.showCalendarDisk = false;
        this.angleCalendarDisk = 0;
    }

    updateSpeed(newSpeed) {
        this.speed = newSpeed;
    }
}