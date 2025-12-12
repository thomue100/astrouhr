// js/InfoOverlay.js
import { AppOverlay } from './AppOverlay.js';

/**
 * Spezialisierte Klasse für das "Einführung"-Overlay.
 */
export class InfoOverlay extends AppOverlay {
    /**
     * @param {object} dom - DOM-Referenzen
     * @param {AstroState} state - Der AstroState
     */
    constructor(dom, state) {
        // super() MUSS als Erstes aufgerufen werden.
        super(
            'infoModal', // 1. ID des Modals
            'Die Astronomische Uhr der Marienkirche 🧭', // 2. Titel des Modals
            InfoOverlay._getHtml() // 3. Der gesamte HTML-Inhalt (Body)
        );

        // Jetzt, nachdem super() aufgerufen wurde, ist 'this' verfügbar.
        this.dom = dom;
        this.state = state;
    }

    /**
     * Liefert den spezifischen HTML-String für das Info-Modal.
     */
    static _getHtml() {
        return `
            <div class="modal-step">
                <strong style="color: #ffcc33; font-size: 1.2em;">Astronomische Uhr St. Marien zu Lübeck: Simulation</strong>
                <p style="font-size: 0.9em; margin-top: 5px;">
                    Willkommen bei der interaktiven Simulation der Astronomischen Uhr der St. Marienkirche zu Lübeck. Dieses Modell lädt Sie dazu ein, die Funktionsweise der Uhr selbst zu erkunden
                </p>

                <hr style="border-top: 1px solid #1a4261; margin-top: 20px; margin-bottom: 20px;" />

                <strong style="color: #ffcc33; font-size: 1.2em;">Die Funktionen der Uhr im Überblick</strong>

                <table style="width:100%; border-collapse:collapse; font-size:0.9em; margin-top:10px;">
    <thead>
        <tr style="background-color:#333; color:white;">
            <th style="padding:5px; text-align:left; border:1px solid #444;">Element</th>
            <th style="padding:5px; text-align:left; border:1px solid #444;">Funktion</th>
            <th style="padding:5px; text-align:left; border:1px solid #444;">Was angezeigt wird</th>
        </tr>
    </thead>
    <tbody>
        <tr style="background-color:#222; color:white;">
            <td style="padding:5px; border:1px solid #444;">**24-Stunden-Zifferblatt**</td>
            <td style="padding:5px; border:1px solid #444;">Basis-Zeitangabe</td>
            <td style="padding:5px; border:1px solid #444;">Zeigt die Tageszeit in 24 Stunden an – von Mitternacht über Mittag bis zur nächsten Mitternacht.</td>
        </tr>
        <tr style="color:white;">
            <td style="padding:5px; border:1px solid #444;">**Sonnenzeiger und Sonnenscheibe**</td>
            <td style="padding:5px; border:1px solid #444;">Sonnenlauf</td>
            <td style="padding:5px; border:1px solid #444;">Ein Zeiger mit Sonnensymbol umrundet das Zifferblatt einmal täglich und markiert dabei die aktuelle Stunde.</td>
        </tr>
        <tr style="background-color:#222; color:white;">
            <td style="padding:5px; border:1px solid #444;">**Mondanzeige**</td>
            <td style="padding:5px; border:1px solid #444;">Mondphase</td>
            <td style="padding:5px; border:1px solid #444;">Eine bewegliche Mondkugel zeigt das aktuelle Mondalter und die Mondphase im Monatszyklus an.</td>
        </tr>
        <tr style="color:white;">
            <td style="padding:5px; border:1px solid #444;">**Tierkreisscheibe**</td>
            <td style="padding:5px; border:1px solid #444;">Tierkreis / Ekliptik</td>
            <td style="padding:5px; border:1px solid #444;">Zeigt die Position der Sonne im Tierkreis und damit das aktuelle Sonnenzeichen im Jahreslauf.</td>
        </tr>
        <tr style="background-color:#222; color:white;">
            <td style="padding:5px; border:1px solid #444;">**Kalenderkreis**</td>
            <td style="padding:5px; border:1px solid #444;">Kalender / liturgische Daten</td>
            <td style="padding:5px; border:1px solid #444;">Gibt Datum, Wochentag und kirchliche Fest- bzw. Feiertagsinformationen wieder.</td>
        </tr>
    </tbody>
</table>
             
                <strong style="color: #ffcc33; font-size: 1.2em;">II. Bedienelemente und Funktionen</strong>
                <p style="font-size: 0.9em; margin-top: 5px;">
                    Sie können die Simulation steuern und wichtige Kalenderinformationen abrufen.
                </p>

                <div style="margin-top: 15px;"> 
                    <strong style="color: #ffcc33; font-size: 1.1em;">1. Simulation steuern (Panel: Simulation)</strong>
                    <ul style="font-size: 0.9em; margin-top: 5px; padding-left: 20px; color: white;">
                        <li><strong>Datum und Uhrzeit:</strong> Geben Sie ein spezifisches Datum und eine Uhrzeit ein. Die Uhr springt sofort zu diesem Zeitpunkt.</li>
                        <li><strong>Aktuelle Zeit:</strong> Setzt die Uhr sofort auf die aktuelle Systemzeit zurück.</li>
                        <li><strong>Animation starten/Pause:</strong> Startet die Zeitraffer-Animation.</li>
                        <li><strong>Geschwindigkeit:</strong> Steuert die Geschwindigkeit, mit der die Uhr läuft (von 0.1x bis 5x).</li>
                    </ul>
                </div>

                <div style="margin-top: 15px;"> 
                    <strong style="color: #ffcc33; font-size: 1.1em;">2. Kalenderinformationen (Panel: Kalender)</strong>
                    <ul style="font-size: 0.9em; margin-top: 5px; padding-left: 20px; color: white;">
                        <li><strong>Kalenderscheibe ein-/ausblenden:</strong> Blendet die große Kalenderscheibe im Zifferblatt ein.</li>
                        <li><strong>Wochentag, Goldene Zahl, Sonntagsbuchstabe:</strong> Zeigt die berechneten Kalenderdaten für das aktuell eingestellte Datum an.</li>
                        <li><strong>Finsternisse:</strong> Listet die Sonnen- und Mondfinsternisse des aktuell eingestellten Jahres auf (basierend auf statischen Daten).</li>
                    </ul>
                </div>

                <div style="margin-top: 15px;"> 
                    <strong style="color: #ffcc33; font-size: 1.1em;">3. Besondere Funktionen (Overlay-Buttons)</strong>
                    <ul style="font-size: 0.9em; margin-top: 5px; padding-left: 20px; color: white;">
                        <li><strong>Einführung:</strong> Dieses Fenster.</li>
                        <li><strong>Wochentagslogik:</strong> Erklärt im Detail, wie die historische Uhr den Wochentag aus den Wochentagsbuchstaben berechnet.</li>
                        <li><strong>Geschichtsdetails:</strong> Bietet Hintergrundinformationen zur Geschichte und Restaurierung der Uhr.</li>
                    </ul>
                </div>

                <hr style="border-top: 1px solid #1a4261; margin-top: 20px; margin-bottom: 20px;" />

                <strong style="color: #ffcc33; font-size: 1.2em;">III. Technische Hinweise</strong>
                <ul style="font-size: 0.9em; margin-top: 5px; padding-left: 20px; color: white;">
                    <li><strong>Datenbasis:</strong> Die astronomischen Berechnungen basieren auf modernen Algorithmen. Kalenderdaten (Ostern, Heilige) und Finsternisse werden aus statischen JSON-Tabellen geladen und sind auf den Zeitraum <strong>1911 bis 2080</strong> beschränkt.</li>
                    <li><strong>Browser-Kompatibilität:</strong> Die Simulation wurde für moderne Browser (Chrome, Firefox, Edge, Safari) entwickelt und verwendet die Canvas-API für das Rendering.</li>
                    <li><strong>Optimierung:</strong> Auf kleineren Bildschirmen (Mobil) sind die Steuerungen standardmäßig eingeklappt, um Platz für die Uhr zu schaffen.</li>
                </ul>
            </div>
        `;
    }
}
