// Ausgelagerter InputController
import {
    TimeUtility
} from '/js/TimeUtility.js';
import {
    InfoOverlay
} from '/js/InfoOverlay.js';
import {
    HistoryOverlay
} from '/js/HistoryOverlay.js';
import {
    DayOfWeekOverlay
} from '/js/DayOfWeekOverlay.js';

export class InputController {
    /**
     * @param {object} dom - DOM-Referenzen
     * @param {AstroState} state
     * @param {ClockRenderer} renderer
     * @param {object} config - AstroConfig
     * @param {Date} minDateLimit
     * @param {Date} maxDateLimit
     */
    constructor(dom, state, renderer, config, minDateLimit, maxDateLimit) {
        this.dom = dom;
        this.state = state;
        this.renderer = renderer;
        this.config = config;
        this.minDateLimit = minDateLimit;
        this.maxDateLimit = maxDateLimit;

        // Overlay-Klassen instanziieren
        this.infoOverlay = new InfoOverlay(dom, state);
        this.historyOverlay = new HistoryOverlay(dom, state);
        this.dayOfWeekOverlay = new DayOfWeekOverlay(dom, state);

        // Mobile-Optimierung: Controls standardmäßig verstecken
        if (window.innerWidth < 850) {
            this.dom.controlsContent.classList.add('controls-content--hidden');
            this.dom.controlsHeader.textContent = '▶️ Simulation';
            this.dom.calendarContent.classList.add('controls-content--hidden');
            if (this.dom.historyContent) {
                this.dom.historyContent.classList.add('controls-content--hidden');
            }
        }

        this._ensureModalHandlers();
    }

    _ensureModalHandlers() {
        // Die Modal-Schließ-Logik (Klick außerhalb, X, Button) liegt nun in den Overlay-Klassen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.dayOfWeekOverlay.isVisible()) this.dayOfWeekOverlay.hide();
                if (this.infoOverlay.isVisible()) this.infoOverlay.hide();
                if (this.historyOverlay.isVisible()) this.historyOverlay.hide();
            }
        });
    }

    setup() {
        this.dom.speedSlider.addEventListener('input', () => this.state.updateSpeed(parseFloat(this.dom.speedSlider.value)));
        this.dom.dateTimeInput.addEventListener('change', () => this._updateSunAndRedraw(true));
        this.dom.btnReset.addEventListener('click', () => this.resetToCurrentTime());
        this.dom.toggleButton.addEventListener('click', () => this.toggleAnimation());

        if (this.dom.infoButtonHeader) {
            this.dom.infoButtonHeader.addEventListener('click', () => {
                if (this.state.animationRunning) this.toggleAnimation();
                this.infoOverlay.show();
            });
        }

        if (this.dom.historyHeader) {
            this.dom.historyHeader.addEventListener('click', () => {
                if (this.state.animationRunning) this.toggleAnimation();
                this.historyOverlay.show();
            });
        }

        // Panel-Umschaltung
        this.dom.controlsHeader.addEventListener('click', () => this.togglePanel('settings'));
        this.dom.calendarHeader.addEventListener('click', () => this.togglePanel('calendar'));

        // Haupt-Button ruft DayOfWeekOverlay.show() auf
        if (this.dom.btnShowDayOfWeekLogic) {
            this.dom.btnShowDayOfWeekLogic.addEventListener('click', () => {
                if (this.state.animationRunning) this.toggleAnimation();
                this.dayOfWeekOverlay.show();
            });
        }

        // History-Details via Button
        if (this.dom.btnShowHistoryDetails) {
            this.dom.btnShowHistoryDetails.addEventListener('click', () => {
                if (this.state.animationRunning) this.toggleAnimation();
                this.historyOverlay.show();
            });
        }

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    /**
     * Führt alle astronomischen Berechnungen für ein gegebenes Datum durch
     * und aktualisiert den AstroState. (Ausgelagerte Logik)
     * @param {Date} date
     * @private
     */
    _updateAstroStateAngles(date) {
        // 1. Sonnenwinkel
        this.state.angleSun = TimeUtility.calculateSunAngle(date);

        // 2. Mondalter und Mondwinkel
        const frac = TimeUtility.calculateMoonAgeFromDate(date);
        this.state.mondAlterFractional = frac;
        this.state.mondAlter = Math.floor(frac) + 1;
        const moonDiffRad = TimeUtility.calculateMoonRotationDifference(date);
        this.state.angleMoon = TimeUtility.calculateMoonAngle(this.state.angleSun, moonDiffRad);

        // 3. Tierkreis-Winkel
        this.state.zodiacDayOffsetAngle = TimeUtility.calculateZodiacOffsetAngle(date, this.state.angleSun);
        this.state.angleZodiac = this.state.zodiacDayOffsetAngle;

        // 4. Kalenderscheiben-Winkel
        this.state.angleCalendarDisk = TimeUtility.calculateCalendarDiskAngle(date);
    }

    /**
     * Verarbeitet das 'change' Event des Datums-Inputs, validiert die Eingabe
     * und aktualisiert den Zustand.
     * @param {boolean} updateCalendarDateFromInput
     * @private
     */
    _updateSunAndRedraw(updateCalendarDateFromInput = false) {
        const isValid = this.updateSimDateFromInput();

        if (isValid) {
            this._updateAstroStateAngles(this.state.simDate); // Berechnung auslagern

            // UI-Updates und Redraw erfolgen nur bei gültigem Input
            TimeUtility.updateLiveDateTime(this.state);
            this.renderer.drawClock(this.state);

            if (updateCalendarDateFromInput) {
                this.updateCalendarInfo();
            }
        }
    }

    // ... (togglePanel bleibt unverändert) ...

    togglePanel(panelName) {
        // Map panelName to DOM elements and texts
        const panels = {
            'settings': {
                content: this.dom.controlsContent,
                header: this.dom.controlsHeader,
                textOpen: '🔽 Simulation',
                textClosed: '▶️ Simulation'
            },
            'calendar': {
                content: this.dom.calendarContent,
                header: this.dom.calendarHeader,
                textOpen: '🔽 Kalender',
                textClosed: '▶️ Kalender'
            }
        };

        const panelToToggle = panels[panelName];

        if (!panelToToggle || !panelToToggle.content) return;

        const isCurrentlyHidden = panelToToggle.content.classList.contains('controls-content--hidden');

        // Toggle the selected panel
        if (isCurrentlyHidden) {
            // Check if animation needs stopping
            if (panelName !== 'settings' && this.state.animationRunning) {
                this.toggleAnimation(); // Stops the animation and changes the button text
            }

            panelToToggle.content.classList.remove('controls-content--hidden');
            panelToToggle.header.textContent = panelToToggle.textOpen;

            // Hide all other panels
            for (const name in panels) {
                if (name !== panelName) {
                    const otherPanel = panels[name];
                    if (otherPanel.content && !otherPanel.content.classList.contains('controls-content--hidden')) {
                        otherPanel.content.style.transition = 'none';
                        otherPanel.content.classList.add('controls-content--hidden');
                        void otherPanel.content.offsetHeight;
                        otherPanel.content.style.transition = '';
                        otherPanel.header.textContent = otherPanel.textClosed;
                    }
                }
            }

            // Update calendar info if calendar panel is opened
            if (panelName === 'calendar') {
                this.updateCalendarInfo();
            }
        } else {
            // Close the panel
            panelToToggle.content.classList.add('controls-content--hidden');
            panelToToggle.header.textContent = panelToToggle.textClosed;
        }

        // Update state for canvas rendering (only relevant for calendar)
        this.state.showCalendarDisk = !this.dom.calendarContent.classList.contains('controls-content--hidden');

        // Die Größenänderung erfolgt verzögert, um die CSS-Animation abzuwarten (450ms)
        setTimeout(() => {
            this.resizeCanvas();
            // FIX GEGEN DAS SPRINGEN: Setze die Scroll-Position nach der Größenanpassung zurück
            window.scrollTo(0, 0);
        }, 450);
    }

    updateSimDateFromInput() {
        const inputElement = this.dom.dateTimeInput;
        const val = inputElement.value;
        const d = new Date(val);

        if (isNaN(d.getTime())) {
            console.warn('Ungültiges Datum/Uhrzeit-Format. Eingabe wird ignoriert.');
            return false;
        }

        if (d.getTime() < this.minDateLimit.getTime() || d.getTime() > this.maxDateLimit.getTime()) {
            console.error('Eingabe ungültig. Datum liegt außerhalb des erlaubten Bereichs (1911-2080). Wert wird ignoriert.');
            return false;
        }

        this.state.simDate = d;
        // TimeUtility.updateLiveDateTime(this.state); <--- Entfernt, wird jetzt in _updateSunAndRedraw ausgeführt.
        return true;
    }

    /**
     * Generiert den HTML-String für die Kalenderinformationen.
     * @private
     */
    _generateCalendarHtml(calcDate, yearInfo, dailyInfo) {
        const dayOfWeek = TimeUtility.getDayOfWeekString(calcDate);
        const dateString = calcDate.toLocaleDateString('de-DE');
        const year = calcDate.getFullYear();

        // Generiere Grundstruktur
        let html = `
            <strong style="color: #ffcc33; font-weight: normal;">Wochentag für ${dateString}:</strong>
            <span style="color: white; font-weight: normal;">${dayOfWeek}</span><br>
        `;

        // Prüfe auf Jahresdaten
        if (yearInfo) {
            html += `
                <strong style="color: #ffcc33; font-weight: normal;">Osterdatum ${year}:</strong>
                <span style="color: white; font-weight: normal;">${yearInfo.easterDate ?? '--'}</span><br>
                <strong style="color: #ffcc33; font-weight: normal;">Goldene Zahl:</strong>
                <span style="color: white; font-weight: normal;">${yearInfo.goldenNumber ?? '--'}</span><br>
                <strong style="color: #ffcc33; font-weight: normal;">Sonntagsbuchstabe:</strong>
                <span style="color: white; font-weight: normal;">${yearInfo.dayLetter ?? '--'}</span><br>
            `;
        } else {
            html += `<strong style="color: #ff5555; font-weight: normal;">Fehlendes Jahr.</strong> Jahresdaten für ${year} nicht in der statischen Tabelle hinterlegt.<br>`;
        }

        // Prüfe auf Tagesdaten
        if (dailyInfo && dailyInfo.letter !== 'N/A') {
            html += `
                <strong style="color: #ffcc33; font-weight: normal;">Tagesbuchstabe:</strong>
                <span style="color: white; font-weight: normal;">${dailyInfo.letter}</span><br>
                <strong style="color: #ffcc33; font-weight: normal;">Tagesheilige(r):</strong>
                <span style="color: white; font-weight: normal;">${dailyInfo.saint}</span>
            `;
        } else if (yearInfo) {
            // Fehlende Tagesdaten nur anzeigen, wenn die Jahresdaten OK sind
            html += `<strong style="color: #ff5555; font-weight: normal;">Fehlende Tagesdaten.</strong>`;
        }

        return html;
    }

    /**
     * Generiert den HTML-String für die Finsternisdaten.
     * @private
     */
    _generateEclipseHtml(year) {
        const eclipseList = TimeUtility.getEclipseInfo(year);
        let eclipseHtml = `<strong style="color: #ffcc33; font-weight: normal;">Finsternisse ${year}:</strong><br>`;

        if (eclipseList.length > 0) {
            eclipseList.forEach(e => {
                eclipseHtml += `<span style="color: #ffcc33; font-weight: normal;">• Datum:</span> <span style="color: white;">${e.date}</span><br>
                                <span style="color: #ffcc33; font-weight: normal;">  Typ:</span> <span style="color: white;">${e.type}</span><br>`;
            });
            // Entferne das letzte <br>
            if (eclipseHtml.endsWith('<br>')) {
                eclipseHtml = eclipseHtml.substring(0, eclipseHtml.length - 4);
            }
        } else {
            eclipseHtml += `<span style="color: white; font-weight: normal;">Keine Finsternisdaten für ${year} vorhanden.</span>`;
        }
        return eclipseHtml;
    }

    /**
     * Aktualisiert die Kalenderinformationen im DOM.
     */
    updateCalendarInfo() {
        const calcDate = this.state.simDate;
        const year = calcDate.getFullYear();

        if (isNaN(calcDate.getTime()) || year < 1911 || year > 2080) {
            this.dom.calendarInfoDisplay.innerHTML = `<strong style="color: #ff5555;">Ungültiges Jahr.</strong> Bitte wählen Sie ein Datum zwischen 1911 und 2080 im Einstellungs-Panel.`;
            this.dom.eclipseInfo.innerHTML = '';
            return;
        }

        const yearInfo = TimeUtility.getCalendarInfo(year);
        const dailyInfo = TimeUtility.getDailyCalendarInfo(calcDate);

        // Daten im DOM anzeigen
        this.dom.calendarInfoDisplay.innerHTML = this._generateCalendarHtml(calcDate, yearInfo, dailyInfo);
        this.dom.eclipseInfo.innerHTML = this._generateEclipseHtml(year);
    }

    /**
     * Hilfsfunktion zur Erstellung eines 'datetime-local' Strings.
     * @private
     */
    _createDateString(date) {
        const pad = (num) => String(num).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    /**
     * Setzt die Simulation auf die aktuelle Systemzeit zurück.
     */
    resetToCurrentTime() {
        const now = new Date();
        const dt = this._createDateString(now);
        this.dom.dateTimeInput.value = dt;

        // Zustand aktualisieren
        this.state.simDate = new Date(dt); // NEU: simDate im Zustand setzen
        this._updateAstroStateAngles(this.state.simDate); // Berechnung auslagern
        TimeUtility.updateLiveDateTime(this.state); // Jetzt aktualisiert TimeUtility das liveDateTime-Feld korrekt

        // UI aktualisieren
        this.updateCalendarInfo();
        this.renderer.drawClock(this.state);
    }
 
    toggleAnimation() {
        this.state.animationRunning = !this.state.animationRunning;
        this.dom.toggleButton.textContent = this.state.animationRunning ? '⏸️ Pause' : '▶️ Animation starten';
        if (this.state.animationRunning) {
            if (window && window.clockApp && typeof window.clockApp.animate === 'function') window.clockApp.animate();
        } else {
            if (this.state.animationFrameId) cancelAnimationFrame(this.state.animationFrameId);
        }
    }

    /**
     * Delegiert die gesamte Layout-Logik an den Renderer.
     */
    resizeCanvas() {
        this.renderer.updateCanvasSizeAndRedraw(this.dom, this.state);
    }
}
