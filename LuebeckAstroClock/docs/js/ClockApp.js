// ClockApp.js — ausgelagerte Haupt-Applikationsklasse
import { ImageManager } from '/js/ImageManager.js';
import { ClockRenderer } from '/js/Renderer.js';
import { InputController } from '/js/InputController.js';
import { AstroState } from '/js/AstroState.js';
import { TimeUtility } from '/js/TimeUtility.js';
import { loadCalendarData } from '/js/DataFetcher.js';

export class ClockApp {
    /**
     * @param {object} dom - DOM-Referenzen
     * @param {object} astroConfig - AstroConfig
     * @param {Date} minDateLimit
     * @param {Date} maxDateLimit
     */
    constructor(dom, astroConfig, minDateLimit, maxDateLimit) {
        this.dom = dom;
        this.config = astroConfig;
        this.minDateLimit = minDateLimit;
        this.maxDateLimit = maxDateLimit;

        this.state = new AstroState(parseFloat(dom.speedSlider?.value) || 0.5);
        this.imageManager = new ImageManager(this.config.zodiacData, this.config.MOON_CYCLE_DAYS);
        this.renderer = new ClockRenderer(dom.ctx, dom.canvas, this.imageManager.getImages(), this.config);
        this.controller = new InputController(dom, this.state, this.renderer, this.config, this.minDateLimit, this.maxDateLimit);

        // Bind animate für mögliche direkte Aufrufe
        this.animate = this.animate.bind(this);
    }

    animate() {
        if (!this.state.animationRunning) return;

        const baseSpeed = this.config.SPEED_FACTOR * this.state.speed;

        // Sonnenwinkel (entspricht der Tageszeit)
        this.state.angleSun += baseSpeed;

        // Mondwinkel (schneller als Sonne)
        const moonIncrement = baseSpeed * this.config.MOON_TO_SUN_RATIO;
        this.state.angleMoon += moonIncrement;

        // Sternscheibenwinkel (siderischer Tag)
        const zodiacIncrement = baseSpeed * this.config.ZODIAC_TO_SUN_RATIO;
        this.state.angleZodiac += zodiacIncrement;

        // Simulation der Zeitverschiebung
        const simulatedMsIncrement = baseSpeed * 24 * 60 * 60 * 1000 / this.config.TWO_PI;
        this.state.simDate = new Date(this.state.simDate.getTime() + simulatedMsIncrement);

        // Mondphasen über Winkeldifferenz
        let phaseAngle = this.state.angleMoon - this.state.angleSun;
        phaseAngle = TimeUtility.normalizeAngle(phaseAngle);
        const frac = (phaseAngle / this.config.TWO_PI) * this.config.MOON_CYCLE_DAYS;
        this.state.mondAlterFractional = frac;
        this.state.mondAlter = Math.floor(frac) + 1;

        // Kalenderwinkel aktualisieren
        this.state.angleCalendarDisk = TimeUtility.calculateCalendarDiskAngle(this.state.simDate);

        TimeUtility.updateLiveDateTime(this.state);
        this.renderer.drawClock(this.state);

        this.state.animationFrameId = requestAnimationFrame(this.animate);
    }

    init() {
        if (!this.dom.ctx) {
            console.error('Canvas-Kontext nicht verfügbar.');
            return;
        }

        this.controller.setup();

        // Bilder und Kalenderdaten parallel laden
        Promise.all([
            this.imageManager.preloadImages(),
            loadCalendarData()
        ])
            .then(([_, loadedData]) => {
                // Daten TimeUtility zuweisen
                TimeUtility.DailyCalendarData = loadedData.dailyData || {};
                TimeUtility.CalendarData = loadedData.calendarData || {};
                TimeUtility.EclipseData = loadedData.eclipseData || {};

                // Resize + initialer Zustand
                this.controller.resizeCanvas();
                this.controller.resetToCurrentTime();
                console.log('Astronomische Uhr initialisiert und Daten zugewiesen.');
            })
            .catch(e => {
                console.error('Fehler beim Laden von Ressourcen:', e);
                // trotzdem versuchen, die Oberfläche anzuzeigen
                this.controller.resizeCanvas();
                this.controller.resetToCurrentTime();
            });
    }
}