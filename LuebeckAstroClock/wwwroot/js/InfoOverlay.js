// js/InfoOverlay.js
import { AppOverlay } from './AppOverlay.js';

/**
 * Spezialisierte Klasse für das "Einführung"-Overlay.
 */
export class InfoOverlay extends AppOverlay {
    constructor() {
        super(
            'infoModal',
            'Die Astronomische Uhr der Marienkirche 🧭',
            InfoOverlay._getHtml()
        );
    }

    /**
     * Liefert den spezifischen HTML-String für das Info-Modal.
     */
    static _getHtml() {
        // Inhalt aus der alten InputController._getInfoModalHtml Methode
        return `
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
                        <span style="color: #ffcc33;">**Uhrscheibe (Astrolabium):</span> Beobachten Sie, wie sich der **Sonnenzeiger** (zeigt die Uhrzeit) und der **Mondzeiger** im Verhältnis zur umlaufenden Scheibe der 13 **Tierkreissternbilder** bewegen. Die Tierkreisscheibe dreht sich mit hoher Genauigkeit in siderischer Zeit (23 h 56 min 4,1 s).
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

            <h3 style="color:#ffcc33; font-size: 1.5em; margin-bottom: 20px;">Hintergrund</h3>
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
        `;
    }
}
