// js/DayOfWeekOverlay.js
import { AppOverlay } from './AppOverlay.js';
import { TimeUtility } from './TimeUtility.js';

/**
 * Spezialisierte Klasse für das "Wochentags-Rechengang"-Overlay.
 * Nutzt das bereits in index.html definierte Modal ('dayOfWeekModal').
 */
export class DayOfWeekOverlay extends AppOverlay {
    /**
     * @param {object} dom - DOM-Referenzen aus dem InputController
     * @param {AstroState} state
     */
    constructor(dom, state) {
        // Übergabe der existierenden DOM-Elemente an die Basisklasse
        super(
            'dayOfWeekModal',
            'Wochentags-Rechengang 🗓️',
            '<p>Wird dynamisch generiert...</p>',
            {
                domElement: dom.dayOfWeekModal, //
                titleElement: dom.modalTitle, //
                bodyElement: dom.modalBody //
            }
        );
        this.state = state;
    }

    /**
     * Erzeugt den dynamischen HTML-Inhalt für das Modal basierend auf dem aktuellen Datum.
     */
    _getDynamicHtml(simDate) {
        // ... (Der gesamte, umfangreiche Inhalt von InputController.showDayOfWeekLogic wurde hierher verschoben) ...
        // [Der Code ist sehr lang und wurde zur Übersichtlichkeit hier ausgelassen, aber die Logik ist vollständig.]

        const year = simDate.getFullYear();
        const yearStr = year.toString();
        const yearInfo = TimeUtility.CalendarData[yearStr];
        const dailyInfo = TimeUtility.getDailyCalendarInfo(simDate);

        const dateStr = `${simDate.getDate().toString().padStart(2, '0')}.${(simDate.getMonth() + 1).toString().padStart(2, '0')}.${simDate.getFullYear()}`;
        const monthStr = simDate.toLocaleDateString('de-DE', { month: 'long' });
        const dayOfMonth = simDate.getDate();
        const dayOfWeekActual = TimeUtility.getDayOfWeekString(simDate);

        let html = '';

        if (!yearInfo || !dailyInfo) {
            html = `<p style="color: #ff5555;">Für das Jahr ${year} oder den ${dateStr} sind keine vollständigen Kalenderdaten... Bitte wählen Sie ein Datum zwischen 1911 und 2080.</p>`;
        } else {
            // ... (Die detaillierte HTML-Generierung und die Logik zur Bestimmung von Sonntagsbuchstaben, Tagesbuchstaben, und Zählung) ...
            let sundayLetterRaw = yearInfo.dayLetter;
            const sundayLetters = sundayLetterRaw.split(',').map(s => s.trim());
            let usedSundayLetter = '';
            const dailyLetter = dailyInfo.letter;
            const weekDays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
            const dailyLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
            let ruleExplanation = '';

            if (sundayLetters.length === 2) {
                const letter1 = sundayLetters[0];
                const letter2 = sundayLetters[1];
                if (simDate.getMonth() < 2) {
                    usedSundayLetter = letter1;
                    ruleExplanation = `**Lübecker Regel angewendet**: Das Jahr **${year}** verwendet die Buchstaben **${letter1}** (Jan/Feb) und **${letter2}** (ab März). Da der ${dayOfMonth}. ${monthStr} vor dem 1. März liegt, gilt der **erste Buchstabe (${letter1})**.`;
                } else {
                    usedSundayLetter = letter2;
                    ruleExplanation = `**Lübecker Regel angewendet**: Das Jahr **${year}** verwendet die Buchstaben **${letter1}** (Jan/Feb) und **${letter2}** (ab März). Da der ${dayOfMonth}. ${monthStr} nach dem 28. Februar liegt, gilt der **zweite Buchstabe (${letter2})** für den Rest des Jahres.`;
                }
            } else if (sundayLetters.length === 1) {
                usedSundayLetter = sundayLetters[0];
                ruleExplanation = `**Achtung**: Es ist nur ein Sonntagsbuchstabe (**${usedSundayLetter}**) hinterlegt. Dieser gilt das ganze Jahr über.`;
            } else {
                usedSundayLetter = 'X';
                ruleExplanation = `**Fehler**: Das DayLetter-Format (**${sundayLetterRaw}**) ist ungültig.`;
            }

            const sunIndex = dailyLetters.indexOf(usedSundayLetter);
            const dayIndex = dailyLetters.indexOf(dailyLetter);
            let diff = (dayIndex - sunIndex + 7) % 7;

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

            html += `
                <div class="modal-step">
                <strong style="color: #ffcc33; font-size: 1.2em;">Die Kalenderscheibe</strong>
                <p style="font-size: 0.9em; margin-top: 5px;">
                  Die Kalenderscheibe ist in mehrere Kreise unterteilt. Im äußeren Kreis sieht man neben den 366 Tagen des Jahres – 366, weil der 29. Februar berücksichtigt ist, der in Jahren mit 365 Tagen automatisch übersprungen wird – große rote Buchstaben: ABCDEFG. Diese sieben Buchstaben, die sich laufend wiederholen, geben die Wochentage an. Welcher dieser Buchstaben den Sonntag bezeichnet, ist im Innenkreis aus den roten Buchstaben neben den Jahreszahlen zu ersehen.
                </p>
                <p style="font-size: 0.9em; margin-bottom: 0;">
                 Ganz innen stehen dabei die Daten der Ostersonntage von 1911 bis 2080. Dazwischen stehen die sogenannten **Goldenen Zahlen**. Sie zeigen an, an welcher Stelle das betreffende Jahr im Mondzirkel steht, der 19 Jahre umfasst: Deshalb die Ziffern 1 bis 19. Bis heute ist Ostern der erste Sonntag nach Frühlingsvollmond.
                </p>
                <hr style="border-top: 1px solid #1a4261; margin-top: 20px; margin-bottom: 20px;" />
                <strong style="color: #ffcc33; font-size: 1.2em;">Die Lübecker Wochentags-Regel</strong>
                <p style="font-size: 0.9em; margin-top: 5px;">
                 Zurück zu den Wochentagen: Ein Sonntagsbuchstabe (SB), wie das **${usedSundayLetter}** in unserem Beispiel, bedeutet, dass alle mit diesem Buchstaben bezeichneten Tage des äußeren Kreises Sonntage sind. Montag ist dann der nächste Buchstabe (folgend auf den SB), Dienstag der übernächste usw.               </p>
                </P>
                <div style="margin-top: 15px;">
                  <strong style="color: #ffcc33; font-size: 1.1em;">Schritt 1: Sonntagsbuchstaben (SB) bestimmen und Regel anwenden 🗓️</strong>
                    <p>Die Jahreszahl **${year}** hat die(den) Sonntagsbuchstaben: **${sundayLetterRaw}**.<br>${ruleExplanation}</p>
                      <ul>
                        <li><span style="color: #ffcc33;">**Gültiger SB**</span>: **${usedSundayLetter}**</li>
                        <li><span style="color: #00aaff;">**TB für ${dayOfMonth}. ${monthStr}**</span>: **${dailyLetter}** (aus der 366-Tage-Tabelle)</li>
                      </ul>
                </div>
                <div style="margin-top: 15px;">
                  <strong style="color: #ffcc33; font-size: 1.1em;">Schritt 2: Vom SB zum TB zählen 🧭</strong>
                  <p>Man startet die Zählung beim **gültigen Sonntagsbuchstaben (${usedSundayLetter})** und zählt, bis man den **Tagesbuchstaben (${dailyLetter})** des aktuellen Datums erreicht. Der erste Buchstabe (${usedSundayLetter}) ist immer der **Sonntag**.</p>
                  ${countHtml}
                </div>
                <div style="margin-top: 15px;">
                  <strong style="color: #ffcc33; font-size: 1.1em;">Schritt 3: Das Ergebnis ablesen 🎉</strong>
                  <p>Der Wochentag ergibt sich aus der Position, die man beim Zählen erreicht hat (Position 0 = Sonntag, Position 6 = Samstag).</p>
                  <p class="result" style="font-size: 1.2em; font-weight: bold; color: #15e963; margin-top: 15px;">Der **${dateStr}** ist ein **${dayOfWeekActual}**!</p>
                </div>`;
        }
        return {
            title: `Wochentags-Rechengang für den ${dateStr} 🗓️`,
            html: html
        };
    }

    /**
     * Implementiert den Template-Hook der Basisklasse, um den dynamischen Inhalt
     * vor dem eigentlichen Anzeigen (in AppOverlay.show()) zu aktualisieren.
     */
    _updateContentBeforeShow() {
        // 1. Hole das aktuelle Datum aus dem Zustand.
        const simDate = this.state.simDate;

        // 2. Erzeuge den dynamischen HTML-Inhalt.
        const dynamicContent = this._getDynamicHtml(simDate);

        // 3. Aktualisiere Titel und Body über die Methoden der Basisklasse
        this.setTitle(dynamicContent.title);
        this.setBodyContent(dynamicContent.html);
    }
}
