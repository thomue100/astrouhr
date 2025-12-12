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
                <strong style="color: #ffcc33; font-size: 1.2em;">Die Astronomische Uhr von St. Marien zu Lübeck: Simulation</strong>
                <p style="font-size: 0.9em; margin-top: 5px;">
                    Willkommen bei der interaktiven Simulation der Astronomischen Uhr der Marienkirche zu Lübeck. Dieses Modell lädt Sie dazu ein, die Funktionsweise der Uhr selbst zu erkunden.
                </p>

                <hr style="border-top: 1px solid #1a4261; margin-top: 20px; margin-bottom: 20px;" />

                <strong style="color: #ffcc33; font-size: 1.2em;">I. Überblick der Anzeigen der Astronomischen Uhr</strong>
                <p style="font-size: 0.9em; margin-top: 5px;">
                  Die astronomische Uhr in der Lübecker Marienkirche, die 1976 fertiggestellt wurde und an das historische Vorbild angelehnt ist, erfüllt eine mehrfache Funktion und zeigt eine Fülle von astronomischen und kalendarischen Daten an. Die Uhr ist traditionell in drei Hauptteile gegliedert:
                </p>

                <div style="margin-top: 15px;">
                    <strong style="color: #ffcc33; font-size: 1.1em;">1. Die Uhrscheibe (Astrolabium)</strong>
                    <p style="font-size: 0.9em; margin-top: 5px;">
                     Die mittlere Uhrscheibe zeigt die astronomischen Gegebenheiten mit großer Genauigkeit an.
                    </p>
                    <ul style="font-size: 0.9em; margin-top: 5px; padding-left: 20px; color: white;">
                        <li><strong>Uhrzeit:</strong>Der Sonnenzeiger zeigt die Uhrzeit auf einem 2 x I...XII-Ziffernring an und dreht sich einmal in 24 Stunden. Auf einen Minutenzeiger wurde verzichtet.</li>
                        <li><strong>Sonne & Mond:</strong>Es werden die tatsächlichen astronomischen Orte von Sonne und Mond am Sternenhimmel angezeigt. Der Mondzeiger vollendet einen Umlauf nach 24 h 50 min 28,2 s.</li>
                        <li><strong>Tierkreisscheibe:</strong>Zeigt die 13 Sternbilder des Tierkreises in ihrer natürlichen Ausdehnung. Die Scheibe dreht sich einmal in 23 h 56 min 4,1 s.</li>
                        <li><strong>Mondphase:</strong>Die aktuelle Phase wird durch eine halb helle, halb dunkle Kugel am Mondzeiger angezeigt. Sie dreht sich einmal in 29,532 Tagen.</li>
                    </ul>
                </div>

                <div style="margin-top: 15px;">
                    <strong style="color: #ffcc33; font-size: 1.1em;">2. Der Kalenderraum</strong>
                    <p style="font-size: 0.9em; margin-top: 5px;">
                      Der untere Teil ist das Kalendarium. Die Kalenderscheibe enthält außen die Figurationen der 13 Tierkreissternbilder und innen acht beschriftete Ringe mit folgenden Daten:
                    </p>
                    <ul style="font-size: 0.9em; margin-top: 5px; padding-left: 20px; color: white;">
                        <li>Tagesbuchstaben, Monatsnamen, Tagesdaten, kirchliche Tagesnamen.</li>
                        <li>Jahresring (1911 bis 2080), Sonntagsbuchstaben, Goldene Zahlen, Osterdaten.</li>
                        <li>Das Uhrwerk berücksichtigt den 29. Februar der Schaltjahre.</li>
                        <li>Es werden die hier sichtbaren Sonnen- und Mondfinsternisse für den Zeitraum 2000 bis 2036 angezeigt.</li>
                    </ul>
                </div>

                <div style="margin-top: 15px;">
                    <strong style="color: #ffcc33; font-size: 1.1em;">3. Der Figurenaufsatz</strong>
                    <p style="font-size: 0.9em; margin-top: 5px;">
                       Der in der Simulation nicht dargestellte Aufsatz beinhaltet den Figurenumgang sowie eine Fülle ikonografischer Darstellungen.
                    </p>
                    <ul style="font-size: 0.9em; margin-top: 5px; padding-left: 20px; color: white;">
                        <li><strong>Figurenumgang:</strong> Zur Mittagsstunde ziehen acht Figuren von Menschen verschiedener Erdteile vor der zentralen Christusfigur vorbei.</li>
                        <li><strong>Stundenschlag:</strong> Die Stundenglocke wird von einer Figur eines alten Mannes mit einem Stundenglas angeschlagen.</li>
                        <li><strong>Ikonografie:</strong> Die Figuren stellen Sinnbilder von Zeit, Vergänglichkeit und christlichen Tugenden (Versöhnung, Glaube, Liebe, Hoffnung, etc.) dar.</li>
                    </ul><br>
                    <p style="font-size: 0.9em; margin-top: 5px;">
                       Quelle: Schukowski, Manfred: Die astronomische Uhr in der Lübecker Marienkirche. In: ASTRONOMIE + RAUMFAHRT 37 (2000), Heft 4, S. 34–36.
                    </p>
                </div>

                <hr style="border-top: 1px solid #1a4261; margin-top: 20px; margin-bottom: 20px;" />

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
                        <li><strong>Kalenderscheibe ein-/ausblenden:</strong> Blendet die große Kalenderscheibe ein.</li>
                        <li><strong>Wochentag, Goldene Zahl, Sonntagsbuchstabe:</strong> Zeigt die berechneten Kalenderdaten für das aktuell eingestellte Datum an.</li>
                        <li><strong>Finsternisse:</strong> Listet die Sonnen- und Mondfinsternisse des aktuell eingestellten Jahres auf (basierend auf statischen Daten).</li>
                    </ul>
                </div>

                <div style="margin-top: 15px;"> 
                    <strong style="color: #ffcc33; font-size: 1.1em;">3. Besondere Funktionen (Overlay-Buttons)</strong>
                    <ul style="font-size: 0.9em; margin-top: 5px; padding-left: 20px; color: white;">
                        <li><strong>Einführung:</strong> Dieses Fenster.</li>
                        <li><strong>Kalender -> Erläuterungen:</strong> Erklärt im Detail, wie die historische Uhr den Wochentag aus den Wochentagsbuchstaben berechnet.</li>
                        <li><strong>Kunst & Geschichte:</strong> Bietet Hintergrundinformationen zur Geschichte und Restaurierung der Uhr.</li>
                    </ul>
                </div>

                <hr style="border-top: 1px solid #1a4261; margin-top: 20px; margin-bottom: 20px;" />

                <strong style="color: #ffcc33; font-size: 1.2em;">III. Technische Hinweise</strong>
                <ul style="font-size: 0.9em; margin-top: 5px; padding-left: 20px; color: white;">
                    <li><strong>Datenbasis:</strong> Die Simluation bildet die Logik des Getriebes der astronomischen Uhr nach. Kalenderdaten (Ostern, Heilige) und Finsternisse werden aus statischen JSON-Tabellen geladen und sind wie beim Original auf den Zeitraum 1911 bis 2080 beschränkt.</li>
                    <li><strong>Browser-Kompatibilität:</strong> Die Simulation wurde für moderne Browser (Chrome, Firefox, Edge, Safari) entwickelt und verwendet die Canvas-API für das Rendering.</li>
                    <li><strong>Optimierung:</strong> Auf kleineren Bildschirmen (Mobil) sind die Steuerungen standardmäßig eingeklappt, um Platz für die Uhr zu schaffen.</li>
                </ul>
            </div>
        `;
    }
}
