// Ausgelagerter InputController
import {
    TimeUtility
} from '/js/TimeUtility.js';

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

        // NEU: Overlay aus der HTML entfernen und in den Controller einfügen
        this._createAndAppendInfoModal();

        // Mobile-Optimierung: Controls standardmäßig verstecken
        if (window.innerWidth < 850) {
            this.dom.controlsContent.classList.add('controls-content--hidden');
            this.dom.controlsHeader.textContent = '▶️ Bedienfeld anzeigen';
            this.dom.calendarContent.classList.add('controls-content--hidden');
        }

        // Modal-Elements & Close-Handler vorbereiten
        this._ensureModalHandlers();
    }

    /**
     * NEU: Erstellt das infoModal HTML und fügt es in den DOM ein.
     * Aktualisiert anschließend die DOM-Referenzen im this.dom Objekt.
     */
    _createAndAppendInfoModal() {
        const modalHtml = InputController._getInfoModalHtml();
        // Das Modal am besten an den body anhängen, damit es ein echtes Overlay ist
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Referenzen im this.dom Objekt aktualisieren
        this.dom.infoModal = document.getElementById('infoModal');
        this.dom.infoModalCloseButton = document.getElementById('infoModalCloseButton');
        this.dom.infoModalCloseX = document.getElementById('infoModalCloseX');
    }

    /**
     * STATISCH: Liefert den HTML-String für das infoModal.
     */
    /**
     * STATISCH: Liefert den HTML-String für das infoModal.
     */
    static _getInfoModalHtml() {
        return `
            <div id="infoModal" class="modal-overlay" style="display: none;">
                <div class="modal-content">
                    <span id="infoModalCloseX" class="modal-close">&times;</span>

                    <h3 style="color:#ffcc33; font-size: 1.5em; margin-bottom: 20px;">Die Astronomische Uhr der Marienkirche 🧭</h3>
                    
                    <hr style="border-top: 1px solid #1a4261;"/>
                    
                    <div class="modal-step">
                        <strong style="color: #ffcc33; font-size: 1.2em;">Simulation & Funktionen</strong>
                        <p style="font-size: 0.9em; margin-top: 5px;">
                            Willkommen zur Simulation der monumentalen astronomischen Uhr in der Marienkirche zu Lübeck, wie sie **1976 fertiggestellt** wurde und die mittelalterliche Tradition repräsentativer Kunstuhren fortführt.
                        </p>
                        <p style="font-size: 0.9em; margin-bottom: 0;">
                            Diese Uhr erfüllt traditionell eine fünffache Funktion:
                        </p>
                        <ul style="font-size: 0.9em; margin-top: 5px; padding-left: 20px;">
                            <li style="color: white;">Sie zeigt die Uhrzeit an (durch den Sonnenzeiger).</li>
                            <li style="color: white;">Sie liefert astronomische Daten, insbesondere die Örter von Sonne und Mond in den Tierkreiszeichen und die Mondphase.</li>
                            <li style="color: white;">Sie stellt kalendarische Daten bereit, die für die Ermittlung der Feste im Kirchenjahr wichtig sind.</li>
                        </ul>
                    </div>
                    
                    <hr style="border-top: 1px solid #1a4261; margin-top: 20px; margin-bottom: 20px;" />

                    <div class="modal-step">
                        <strong style="color: #ffcc33; font-size: 1.2em;">So funktioniert die Simulation:</strong>
                        <ul style="font-size: 0.9em; margin-top: 5px; padding-left: 20px;">
                            <li style="color: white;">
                                <span style="color: #ffcc33;">**Uhrscheibe (Astrolabium):**</span> Beobachten Sie, wie sich der **Sonnenzeiger** (zeigt die Uhrzeit) und der **Mondzeiger** im Verhältnis zur umlaufenden Scheibe der 13 **Tierkreissternbilder** bewegen. Die Tierkreisscheibe dreht sich mit hoher Genauigkeit in siderischer Zeit (23 h 56 min 4,1 s).
                            </li>
                            <li style="color: white;">
                                <span style="color: #ffcc33;">**Kalenderscheibe:**</span> Hier finden Sie 8 beschriftete Ringe, welche die kalendarischen Daten (wie Tagesbuchstaben, Osterdaten, Goldene Zahl) anzeigen. Typisch für die Lübecker Uhr sind die Angaben zu den **Sonnen- und Mondfinsternissen**.
                            </li>
                            <li style="color: white;">
                                <span style="color: #ffcc33;">**Steuerung:**</span> Nutzen Sie die Bedienelemente, um die Geschwindigkeit der Animation anzupassen oder ein spezifisches Datum einzugeben, um die **tatsächlichen astronomischen Örter** von Sonne und Mond am Sternenhimmel zu studieren.
                            </li>
                        </ul>
                    </div>

                    <hr style="border-top: 1px solid #1a4261; margin-top: 20px; margin-bottom: 20px;" />

                    <h3 style="color:#ffcc33; font-size: 1.5em; margin-bottom: 20px;">Die Geschichte der Uhr 📜</h3>
                    
                    <hr style="border-top: 1px solid #1a4261;"/>

                    <div class="modal-step">
                        <strong style="color: #ffcc33; font-size: 1.2em;">Die Alte Uhr (Geweiht 1405)</strong>
                        <p style="font-size: 0.9em; margin-top: 5px;">
                            Die Tradition dieser monumentalen Kunstuhr begann 1405. Im Jahr 1561 wurde eine umfassende Erweiterung und Erneuerung der Uhrwerke vorgenommen. Die alte Uhr zeigte zusätzlich die Bewegungen der fünf klassischen **Planeten** und besaß Angaben zu **Finsternissen** – ein einzigartiges Merkmal. Im Figurenumgang prozessierten der **Kaiser und die sieben Kurfürsten** vor Christus.
                        </p>
                        <p style="font-size: 0.9em; margin-bottom: 0;">
                            Die alte Uhr wurde am **29. März 1942** zusammen mit der Marienkirche bei einem Brand zerstört.
                        </p>
                    </div>

                    <hr style="border-top: 1px solid #1a4261; margin-top: 20px; margin-bottom: 20px;" />

                    <div class="modal-step">
                        <strong style="color: #ffcc33; font-size: 1.2em;">Die Neue Uhr (1955–1976)</strong>
                        <p style="font-size: 0.9em; margin-top: 5px;">
                            Nach der Zerstörung begann der Lübecker Uhrmachermeister **Paul Behrens** 1955 mit der Planung und Neugestaltung. Die neue Uhr ist der alten verpflichtet, aber modernisiert.
                        </p>
                        <p style="font-size: 0.9em;">
                            **Wichtigste Unterschiede zur Vorgängerin:**
                        </p>
                        <ul style="font-size: 0.9em; margin-top: 5px; padding-left: 20px;">
                            <li style="color: white;">Sie zeigt die **tatsächlichen astronomischen Örter** von Sonne und Mond am Sternenhimmel an.</li>
                            <li style="color: white;">Der Figurenumgang zeigt jetzt **acht Figuren verschiedener Hautfarbe und Stände** (z.B. schwarzer Missionar, weißer Arzt, Japanerin, Indianer) anstelle des Kaisers und der Kurfürsten.</li>
                            <li style="color: white;">Der Tierkreisring stellt **13 Sternbilder** (inkl. Schlangenträger) dar, um die tatsächlichen Gegebenheiten genauer abzubilden.</li>
                        </ul>
                    </div>
                    
                    <button id="infoModalCloseButton" style="margin-top: 20px;">Schließen</button>
                </div>
            </div>
        `;
    }

    _ensureModalHandlers() {
        // Durch _createAndAppendInfoModal() sind die DOM-Referenzen jetzt verfügbar
        const dOWModal = this.dom.dayOfWeekModal;
        const infoModal = this.dom.infoModal; // NEUE REFERENZ

        if (dOWModal) {
            dOWModal.style.zIndex = dOWModal.style.zIndex || '9999';
            // Click outside content closes modal
            dOWModal.addEventListener('click', (e) => {
                if (e.target === dOWModal) this.hideModal(dOWModal);
            });
            // Attach listeners to the new close buttons
            if (this.dom.dayOfWeekModalCloseX) this.dom.dayOfWeekModalCloseX.addEventListener('click', () => this.hideModal(dOWModal));
            if (this.dom.dayOfWeekModalCloseButton) this.dom.dayOfWeekModalCloseButton.addEventListener('click', () => this.hideModal(dOWModal));
        }

        if (infoModal) {
            infoModal.style.zIndex = infoModal.style.zIndex || '9999';
            // Click outside content closes modal
            infoModal.addEventListener('click', (e) => {
                if (e.target === infoModal) this.hideModal(infoModal);
            });
            // Attach listeners to the new close buttons
            if (this.dom.infoModalCloseX) this.dom.infoModalCloseX.addEventListener('click', () => this.hideModal(infoModal));
            if (this.dom.infoModalCloseButton) this.dom.infoModalCloseButton.addEventListener('click', () => this.hideModal(infoModal));
        }

        // Escape key closes any open modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (dOWModal && dOWModal.style.display === 'flex') this.hideModal(dOWModal);
                if (infoModal && infoModal.style.display === 'flex') this.hideModal(infoModal);
            }
        });
    }

    setup() {
        this.dom.speedSlider.addEventListener('input', () => this.state.updateSpeed(parseFloat(this.dom.speedSlider.value)));
        this.dom.dateTimeInput.addEventListener('change', () => this._updateSunAndRedraw(true));
        this.dom.btnReset.addEventListener('click', () => this.resetToCurrentTime());
        this.dom.toggleButton.addEventListener('click', () => this.toggleAnimation());

        // FIX 1.1: Listener für das Info-Modal (stoppt jetzt auch die Animation)
        if (this.dom.infoButtonHeader) {
            this.dom.infoButtonHeader.addEventListener('click', () => {
                if (this.state.animationRunning) {
                    this.toggleAnimation();
                }
                this.showModal(this.dom.infoModal);
            });
        }

        this.dom.controlsHeader.addEventListener('click', () => this.togglePanel('settings'));
        this.dom.calendarHeader.addEventListener('click', () => this.togglePanel('calendar'));

        // Die Funktion showDayOfWeekLogic() enthält bereits die Logik zum Stoppen der Animation
        this.dom.btnShowDayOfWeekLogic.addEventListener('click', () => this.showDayOfWeekLogic());

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    _updateSunAndRedraw(updateCalendarDateFromInput = false) {
        const isValid = this.updateSimDateFromInput();

        if (isValid) {
            this.state.angleSun = TimeUtility.calculateSunAngle(this.state.simDate);

            const frac = TimeUtility.calculateMoonAgeFromDate(this.state.simDate);
            this.state.mondAlterFractional = frac;
            this.state.mondAlter = Math.floor(frac) + 1;

            const moonDiffRad = TimeUtility.calculateMoonRotationDifference(this.state.simDate);
            this.state.angleMoon = TimeUtility.calculateMoonAngle(this.state.angleSun, moonDiffRad);

            this.state.zodiacDayOffsetAngle = TimeUtility.calculateZodiacOffsetAngle(this.state.simDate, this.state.angleSun);
            this.state.angleZodiac = this.state.zodiacDayOffsetAngle;

            this.state.angleCalendarDisk = TimeUtility.calculateCalendarDiskAngle(this.state.simDate);

            this.renderer.drawClock(this.state);

            if (updateCalendarDateFromInput) {
                this.updateCalendarInfo();
            }
        }
    }

    togglePanel(panelName) {
        // Map panelName to DOM elements and texts
        const panels = {
            'settings': {
                content: this.dom.controlsContent,
                header: this.dom.controlsHeader,
                textOpen: '🔽 Bedienfeld verbergen',
                textClosed: '▶️ Bedienfeld anzeigen'
            },
            'calendar': {
                content: this.dom.calendarContent,
                header: this.dom.calendarHeader,
                textOpen: '🔽 Kalenderdaten verbergen',
                textClosed: '▶️ Kalenderdaten anzeigen'
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
            this.renderer.drawClock(this.state);

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
        TimeUtility.updateLiveDateTime(this.state);
        return true;
    }

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
        const dayOfWeek = TimeUtility.getDayOfWeekString(calcDate);

        if (yearInfo && dailyInfo) {
            this.dom.calendarInfoDisplay.innerHTML = `
                <strong style="color: #ffcc33;">Wochentag für ${calcDate.toLocaleDateString('de-DE')}:</strong>
                <span style="color: white;">${dayOfWeek}</span><br>
                <strong style="color: #ffcc33;">Osterdatum ${year}:</strong>
                <span style="color: white;">${yearInfo.easterDate}</span><br>
                <strong style="color: #ffcc33;">Goldene Zahl:</strong>
                <span style="color: white;">${yearInfo.goldenNumber}</span><br>
                <strong style="color: #ffcc33;">Sonntagsbuchstabe:</strong>
                <span style="color: white;">${yearInfo.dayLetter}</span><br>
                <strong style="color: #ffcc33;">Tagesbuchstabe:</strong>
                <span style="color: white;">${dailyInfo.letter}</span><br>
                <strong style="color: #ffcc33;">Tagesheiliger:</strong>
                <span style="color: white;">${dailyInfo.saint}</span>
            `;
        } else if (!yearInfo) {
            this.dom.calendarInfoDisplay.innerHTML = `
                <strong style="color: #ffcc33;">Wochentag für ${calcDate.toLocaleDateString('de-DE')}:</strong>
                <span style="color: white;">${dayOfWeek}</span><br>
                <strong style="color: #ffcc33;">Tagesbuchstabe:</strong>
                <span style="color: white;">${dailyInfo?.letter ?? '--'}</span><br>
                <strong style="color: #ffcc33;">Tagesheiliger:</strong>
                <span style="color: white;">${dailyInfo?.saint ?? '--'}</span><br>
                <strong style="color: #ff5555;">Fehlendes Jahr.</strong>
                Jahresdaten für ${year} nicht in der statischen Tabelle hinterlegt.
            `;
        } else {
            this.dom.calendarInfoDisplay.innerHTML = `
                <strong style="color: #ffcc33;">Wochentag für ${calcDate.toLocaleDateString('de-DE')}:</strong>
                <span style="color: white;">${dayOfWeek}</span><br>
                <strong style="color: #ffcc33;">Osterdatum ${year}:</strong>
                <span style="color: white;">${yearInfo?.easterDate ?? '--'}</span><br>
                <strong style="color: #ffcc33;">Goldene Zahl:</strong>
                <span style="color: white;">${yearInfo?.goldenNumber ?? '--'}</span><br>
                <strong style="color: #ffcc33;">Sonntagsbuchstabe:</strong>
                <span style="color: white;">${yearInfo?.dayLetter ?? '--'}</span><br>
                <strong style="color: #ff5555;">Fehlende Tagesdaten.</strong>
            `;
        }

        const eclipseList = TimeUtility.getEclipseInfo(year);
        let eclipseHtml = `<strong style="color: #ffcc33;">Finsternisse ${year}:</strong><br>`;

        if (eclipseList.length > 0) {
            eclipseList.forEach(e => {
                eclipseHtml += `<span style="color: #ffcc33;">• Datum:</span> <span style="color: white;">${e.date}</span><br>
                                 <span style="color: #ffcc33;">  Typ:</span> <span style="color: white;">${e.type}</span><br><br>`;
            });
        } else {
            eclipseHtml += `<span style="color: white;">Keine Finsternisdaten für ${year} vorhanden.</span>`;
        }

        this.dom.eclipseInfo.innerHTML = eclipseHtml;
    }

    showDayOfWeekLogic() {
        // FIX 1.2: Stoppe die Animation, falls sie läuft.
        if (this.state.animationRunning) {
            this.toggleAnimation();
        }

        // ANPASSUNG: Verwende das simDate aus dem state
        const simDate = this.state.simDate;

        const year = simDate.getFullYear();
        const yearStr = year.toString(); // Für den Zugriff auf CalendarData
        // ZUGRIFF AUF GELADENE GLOBALE DATEN
        const yearInfo = TimeUtility.CalendarData[yearStr]; // Sonntagsbuchstaben-Daten (z.B. E,D oder B,A)
        const dailyInfo = TimeUtility.getDailyCalendarInfo(simDate); // Tagesbuchstabe-Daten (z.B. C)

        const dateStr = `${simDate.getDate().toString().padStart(2, '0')}.${(simDate.getMonth() + 1).toString().padStart(2, '0')}.${simDate.getFullYear()}`;
        const monthStr = simDate.toLocaleDateString('de-DE', {
            month: 'long'
        });
        const dayOfMonth = simDate.getDate();
        const dayOfWeekActual = TimeUtility.getDayOfWeekString(simDate); // Tatsächlicher Wochentag zur Verifikation

        this.dom.modalTitle.textContent = `Wochentags-Rechengang für den ${dateStr} 🗓️`;
        let html = '';

        if (!yearInfo || !dailyInfo) {
            html = `<p style="color: #ff5555;">Für das Jahr ${year} oder den ${dateStr} sind keine vollständigen Kalenderdaten (Sonntags- oder Tagesbuchstabe) in den statischen Tabellen hinterlegt. Bitte wählen Sie ein Datum zwischen 1911 und 2080, für das Beispieldaten vorliegen (z.B. 2025).</p>`;
        } else {

            // --- ERSTER ABSCHNITT: ALLGEMEINE ERKLÄRUNG DER KALENDERSCHEIBE (NEU) ---
            html += `<div class="modal-step" style="background-color: #0e3048; padding: 10px; border-radius: 6px; margin-bottom: 20px;">
                                <h3 style="margin-top:0; color:#ffcc33; font-size: 1.2em;">Die Kalenderscheibe 🧭</h3>
                                <p style="font-size: 0.9em; margin-bottom: 5px;">
                                    Die Kalenderscheibe ist in mehrere Kreise unterteilt. Im äußeren Kreis sieht man neben den **366 Tagen** des Jahres – 366, weil der 29. Februar berücksichtigt ist, der in Jahren mit 365 Tagen automatisch übersprungen wird – große rote Buchstaben: **ABCDEFG**. Diese sieben Buchstaben, die sich laufend wiederholen, geben die **Wochentage** an. Welcher dieser Buchstaben den Sonntag bezeichnet, ist im Innenkreis aus den roten Buchstaben neben den Jahreszahlen zu ersehen.
                                </p>
                                <p style="font-size: 0.9em; margin-bottom: 0;">
                                    Ganz innen stehen dabei die Daten der **Ostersonntage** von 1911 bis 2080. Dazwischen stehen die sogenannten **goldenen Zahlen**. Sie zeigen an, an welcher Stelle das betreffende Jahr im **Mondzirkel** steht, der 19 Jahre umfasst: Deshalb die Ziffern 1 bis 19. Bis heute ist Ostern der erste Sonntag nach Frühlingsvollmond.
                                </p>

                            </div>
                            <hr style="border-top: 1px solid #1a4261;"/>`;


            // --- Berechnungen für die Erklärung (Lübecker Kalenderregel) ---

            let sundayLetterRaw = yearInfo.dayLetter; // Jetzt z.B. "E,D" oder "B,A"
            const sundayLetters = sundayLetterRaw.split(',').map(s => s.trim());
            let usedSundayLetter = '';

            // const isLeapYear = TimeUtility.isLeapYear(year); // <-- NICHT MEHR NÖTIG
            const dailyLetter = dailyInfo.letter;

            const weekDays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
            const dailyLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

            let ruleExplanation = '';

            // NEUE, VEREINFACHTE LOGIK: Nur Aufteilung des übergebenen Strings und Monats-Check
            if (sundayLetters.length === 2) {
                const letter1 = sundayLetters[0];
                const letter2 = sundayLetters[1];

                // Monat 0=Jan, 1=Feb, 2=März
                if (simDate.getMonth() < 2) {
                    // Erster Buchstabe für Januar und Februar
                    usedSundayLetter = letter1;
                    ruleExplanation = `**Lübecker Regel angewendet**: Das Jahr **${year}** verwendet die Buchstaben **${letter1}** (Jan/Feb) und **${letter2}** (ab März). Da der ${dayOfMonth}. ${monthStr} vor dem 1. März liegt, gilt der **erste Buchstabe (${letter1})**.`;
                } else {
                    // Zweiter Buchstabe ab März
                    usedSundayLetter = letter2;
                    ruleExplanation = `**Lübecker Regel angewendet**: Das Jahr **${year}** verwendet die Buchstaben **${letter1}** (Jan/Feb) und **${letter2}** (ab März). Da der ${dayOfMonth}. ${monthStr} nach dem 28. Februar liegt, gilt der **zweite Buchstabe (${letter2})** für den Rest des Jahres.`;
                }
            } else if (sundayLetters.length === 1) {
                // Fallback für Jahre mit nur einem übergebenen Buchstaben
                usedSundayLetter = sundayLetters[0];
                ruleExplanation = `**Achtung**: Es ist nur ein Sonntagsbuchstabe (**${usedSundayLetter}**) hinterlegt. Dieser gilt das ganze Jahr über. (Dieses Format kann für Schaltjahre, in denen der Kalender nicht verschoben wird, oder für vereinfachte Kalender verwendet werden.)`;
            } else {
                // Error case
                usedSundayLetter = 'X';
                ruleExplanation = `**Fehler**: Das DayLetter-Format (**${sundayLetterRaw}**) ist ungültig. Es müssen ein oder zwei durch Komma getrennte Buchstaben übergeben werden (z.B. 'E,D').`;
            }


            // Index der Buchstaben im Array dailyLetters (A=0, B=1, ...)
            const sunIndex = dailyLetters.indexOf(usedSundayLetter);
            const dayIndex = dailyLetters.indexOf(dailyLetter);

            // Die tatsächliche Differenz in Wochentagen. Sonntag = 0, Montag = 1, ...
            let diff = (dayIndex - sunIndex + 7) % 7;

            // --- Erstellung des HTML-Inhalts basierend auf der Vorlage ---

            html += `<div class="modal-step">
                                <h3 style="margin-top:0; color:#ffcc33; font-size: 1.2em;">Die Lübecker Wochentags-Regel</h3>
                                <p style="font-size: 0.9em;">Zurück zu den Wochentagen: Ein Sonntagsbuchstabe (SB), z.B. das **${usedSundayLetter}** in unserem Beispiel, bedeutet, dass alle mit diesem Buchstaben bezeichneten Tage des äußeren Kreises Sonntage sind. Montag ist dann der nächste Buchstabe (folgend auf den SB), Dienstag der übernächste usw. </p>
                            </div>
                            <hr style="border-top: 1px solid #1a4261;"/>`;

            // Das Beispiel mit dem aktuellen Datum durchrechnen
            html += `<div class="modal-step">
                                <strong style="color: #ffcc33;">Schritt 1: Sonntagsbuchstaben (SB) bestimmen und Regel anwenden 🗓️</strong>
                                <p>
                                    Die Jahreszahl **${year}** hat die(den) Sonntagsbuchstaben: **${sundayLetterRaw}**.
                                    <br>
                                    ${ruleExplanation}
                                </p>
                                <ul>
                                    <li><span style="color: #ffcc33;">**Gültiger SB**</span>: **${usedSundayLetter}**</li>
                                    <li><span style="color: #00aaff;">**TB für ${dayOfMonth}. ${monthStr}**</span>: **${dailyLetter}** (aus der 366-Tage-Tabelle)</li>
                                </ul>
                            </div>`;

            // Visualisierung der Zählung
            let countHtml = '<p style="font-size: 1.0em; text-align: center;">Zählung: ';
            let currentLetter = usedSundayLetter;
            let currentIndex = sunIndex;

            for (let i = 0; i <= diff; i++) {

                const color = i === 0 ? '#ffcc33' : i === diff ? '#00aaff' : '#aaa';

                countHtml += `<span style="font-weight: bold; color: ${color};">${currentLetter}</span> <span style="font-size: 0.9em;">(${weekDays[i]})</span>`;

                if (i < diff) {
                    countHtml += ' → ';
                    currentIndex = (currentIndex + 1) % 7;
                    currentLetter = dailyLetters[currentIndex];
                }
            }
            countHtml += '</p>';

            html += `<div class="modal-step">
                                <strong style="color: #ffcc33;">Schritt 2: Vom SB zum TB zählen 🧭</strong>
                                <p>Man startet die Zählung beim **gültigen Sonntagsbuchstaben (${usedSundayLetter})** und zählt, bis man den **Tagesbuchstaben (${dailyLetter})** des aktuellen Datums erreicht. Der erste Buchstabe (${usedSundayLetter}) ist immer der **Sonntag**.</p>
                                ${countHtml}
                            </div>`;

            html += `<div class="modal-step">
                                <strong style="color: #ffcc33;">Schritt 3: Das Ergebnis ablesen 🎉</strong>
                                <p>Der Wochentag ergibt sich aus der Position, die man beim Zählen erreicht hat (Position 0 = Sonntag, Position 6 = Samstag).</p>
                                <p class="result" style="font-size: 1.2em; font-weight: bold; color: #15e963; margin-top: 15px;">Der **${dateStr}** ist ein **${dayOfWeekActual}**!</p>
                            </div>`;
        }

        this.dom.modalBody.innerHTML = html;
        this.showModal(this.dom.dayOfWeekModal); // Modalfenster anzeigen
    }


    showModal(modalElement) {
        if (!modalElement) return;

        modalElement.style.display = 'flex';
        modalElement.style.zIndex = '9999';

        // nach dem Rendern scrollen
        requestAnimationFrame(() => {
            const modalContent = modalElement.querySelector('.modal-content');
            if (modalContent) {
                modalContent.scrollTop = 0;
                // alternativ:
                // modalContent.scrollTo({ top: 0 });
            }
        });

        document.body.style.overflow = 'hidden';

        const focusable = modalElement.querySelector('button, [tabindex], a, input, textarea');
        if (focusable) focusable.focus();
    }


    /**
     * Verbirgt ein beliebiges Modal-Element.
     * @param {HTMLElement} modalElement - Das DOM-Element des Modals.
     */
    hideModal(modalElement) {
        if (!modalElement) return;
        modalElement.style.display = 'none';
        document.body.style.overflow = '';
    }

    resetToCurrentTime() {
        const now = new Date();
        const dt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        this.dom.dateTimeInput.value = dt;

        this.state.simDate = new Date(dt);

        this.state.angleSun = TimeUtility.calculateSunAngle(this.state.simDate);

        const frac = TimeUtility.calculateMoonAgeFromDate(this.state.simDate);
        this.state.mondAlterFractional = frac;
        this.state.mondAlter = Math.floor(frac) + 1;

        const moonDiffRad = TimeUtility.calculateMoonRotationDifference(this.state.simDate);
        this.state.angleMoon = TimeUtility.calculateMoonAngle(this.state.angleSun, moonDiffRad);

        this.state.zodiacDayOffsetAngle = TimeUtility.calculateZodiacOffsetAngle(this.state.simDate, this.state.angleSun);
        this.state.angleZodiac = this.state.zodiacDayOffsetAngle;

        this.state.angleCalendarDisk = TimeUtility.calculateCalendarDiskAngle(this.state.simDate);

        this.updateCalendarInfo();

        TimeUtility.updateLiveDateTime(this.state);
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

    resizeCanvas() {
        const BREAKPOINT = 850;
        const isMobile = window.innerWidth < BREAKPOINT;
        const margin = 20;
        const controlsW = 250;
        const gap = 30;
        let availableW, availableH;

        if (isMobile) {
            availableW = window.innerWidth - margin * 2;
            availableH = window.innerHeight - margin * 2;

            let controlsTotalHeight = this.dom.controlsHeader.offsetHeight;
            if (!this.dom.controlsContent.classList.contains('controls-content--hidden')) {
                controlsTotalHeight += this.dom.controlsContent.offsetHeight;
            }
            controlsTotalHeight += this.dom.calendarHeader.offsetHeight;
            if (!this.dom.calendarContent.classList.contains('controls-content--hidden')) {
                controlsTotalHeight += this.dom.calendarContent.offsetHeight;
            }
            // Höhe für den Info-Button berücksichtigen
            if (this.dom.infoButtonHeader) controlsTotalHeight += this.dom.infoButtonHeader.offsetHeight;


            availableH = window.innerHeight - controlsTotalHeight - gap - margin * 2;
            availableH = Math.min(availableH, window.innerWidth * 0.9);
        } else {
            availableW = window.innerWidth - controlsW - gap - margin * 2;
            availableH = window.innerHeight - margin * 2;
        }

        const size = Math.min(availableW, availableH);
        const finalSize = Math.max(size, 200);
        this.dom.canvas.width = this.dom.canvas.height = finalSize;
        this.renderer.drawClock(this.state);
    }
}
