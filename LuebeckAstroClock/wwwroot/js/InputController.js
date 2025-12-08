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

        // Mobile-Optimierung: Controls standardmäßig verstecken
        if (window.innerWidth < 850) {
            this.dom.controlsContent.classList.add('controls-content--hidden');
            this.dom.controlsHeader.textContent = '▶️ Bedienfeld anzeigen';
            this.dom.calendarContent.classList.add('controls-content--hidden');
        }

        // Modal-Elements & Close-Handler vorbereiten
        this._ensureModalHandlers();
    }

    _ensureModalHandlers() {
        // Schließe vorhandene Inline-handler nicht, sondern ergänze sichere Listener
        const modal = this.dom.dayOfWeekModal;
        if (!modal) return;

        // Ensure high z-index when opened
        modal.style.zIndex = modal.style.zIndex || '9999';

        // Close button inside modal (if present)
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideModal());
        }

        // Click outside content closes modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.hideModal();
        });

        // Escape key closes modal when focused
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.hideModal();
            }
        });
    }

    setup() {
        this.dom.speedSlider.addEventListener('input', () => this.state.updateSpeed(parseFloat(this.dom.speedSlider.value)));
        this.dom.dateTimeInput.addEventListener('change', () => this._updateSunAndRedraw(true));
        this.dom.btnReset.addEventListener('click', () => this.resetToCurrentTime());
        this.dom.toggleButton.addEventListener('click', () => this.toggleAnimation());

        this.dom.controlsHeader.addEventListener('click', () => this.togglePanel('settings'));
        this.dom.calendarHeader.addEventListener('click', () => this.togglePanel('calendar'));

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
        const isSettings = panelName === 'settings';
        const contentToShow = isSettings ? this.dom.controlsContent : this.dom.calendarContent;
        const contentToHide = isSettings ? this.dom.calendarContent : this.dom.controlsContent;

        const headerToShow = isSettings ? this.dom.controlsHeader : this.dom.calendarHeader;
        const headerToHide = isSettings ? this.dom.calendarHeader : this.dom.controlsHeader;

        const isCurrentlyHidden = contentToShow.classList.contains('controls-content--hidden');

        if (isCurrentlyHidden) {

            // NEUER CODE HIER
            // Wenn das Kalender-Panel geöffnet wird UND die Animation läuft, stoppe die Animation.
            if (!isSettings && this.state.animationRunning) {
                this.toggleAnimation(); // Stoppt die Animation und ändert den Button-Text auf '▶️ Animation starten'
            }
            // ENDE NEUER CODE

            contentToShow.classList.remove('controls-content--hidden');
            headerToShow.textContent = isSettings ? '🔽 Bedienfeld verbergen' : '🔽 Kalenderdaten verbergen';

            if (!contentToHide.classList.contains('controls-content--hidden')) {
                contentToHide.style.transition = 'none';
                contentToHide.classList.add('controls-content--hidden');
                void contentToHide.offsetHeight;
                contentToHide.style.transition = '';
                headerToHide.textContent = isSettings ? '▶️ Kalenderdaten anzeigen' : '▶️ Bedienfeld anzeigen';
            }

            if (!isSettings) {
                this.updateCalendarInfo();
            }
        } else {
            contentToShow.classList.add('controls-content--hidden');
            headerToShow.textContent = isSettings ? '▶️ Bedienfeld anzeigen' : '▶️ Kalenderdaten anzeigen';
        }

        this.state.showCalendarDisk = !this.dom.calendarContent.classList.contains('controls-content--hidden');

        setTimeout(() => {
            this.resizeCanvas();
            this.renderer.drawClock(this.state);
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
        this.dom.dayOfWeekModal.style.display = 'flex'; // Modalfenster anzeigen
    }


    showModal() {
        const modal = this.dom.dayOfWeekModal;
        if (!modal) return;
        modal.style.display = 'flex';
        modal.style.zIndex = '9999';
        // Prevent background scroll
        document.body.style.overflow = 'hidden';
        // Move focus into modal for accessibility
        const focusable = modal.querySelector('button, [tabindex], a, input, textarea');
        if (focusable) focusable.focus();
    }

    hideModal() {
        const modal = this.dom.dayOfWeekModal;
        if (!modal) return;
        modal.style.display = 'none';
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
