// js/HistoryOverlay.js
import { AppOverlay } from './AppOverlay.js';

/**
 * Spezialisierte Klasse für das "Kunst & Geschichte"-Overlay.
 */
export class HistoryOverlay extends AppOverlay {
    constructor() {
        super(
            'historyModal',
            'Juhu Kunst & Geschichte der Astronomischen Uhr 📜',
            HistoryOverlay._getHtml()
        );
    }

    /**
     * Liefert den spezifischen HTML-String für das History-Modal.
     */
    static _getHtml() {
        // Inhalt aus der alten InputController._getHistoryModalHtml Methode
        return `
            <div class="modal-step">
                <strong style="color: #ffcc33; font-size: 1.2em;">Die Funktion als Zeitmessung, Himmelskarte und Kalender</strong>
                <p style="font-size: 0.9em; margin-top: 5px;">
                    Die Astronomische Uhr der Marienkirche zu Lübeck ist eine der ältesten und bedeutendsten in Nordeuropa. Sie verbindet die Anzeige der bürgerlichen Zeit mit komplexen **astronomischen Berechnungen** und der **Bestimmung des Osterdatums**. Solche Prunkuhren dienten nicht nur der Zeitmessung, sondern waren auch ein Ausdruck von Macht, Reichtum und wissenschaftlichem Verständnis in der Hansezeit.
                </p>
            </div>
            
            <hr style="border-top: 1px solid #1a4261; margin-top: 20px; margin-bottom: 20px;" />

            <div class="modal-step">
                <strong style="color: #ffcc33; font-size: 1.2em;">Die Alte Uhr (1405–1942)</strong>
                <ul style="font-size: 0.9em; margin-top: 5px; padding-left: 20px;">
                    <li style="color: white;">
                        **Errichtung**: Die erste Uhr wurde 1405 geweiht, wahrscheinlich von dem Kleriker Nikolaus Gronow und dem Uhrmacher Johann von Hemme.
                    </li>
                    <li style="color: white;">
                        **Einzigartigkeit**: Sie zeigte ursprünglich die Bewegungen der fünf klassischen **Planeten** (Merkur, Venus, Mars, Jupiter, Saturn) an, was für die Zeit eine absolute Seltenheit war.
                    </li>
                    <li style="color: white;">
                        **Figurenumgang**: Der Figurenumgang zeigte den **Kaiser und die sieben Kurfürsten** von Deutschland, die vor einer Christusfigur prozessierten – eine politische und theologische Darstellung der Reichsstruktur.
                    </li>
                    <li style="color: white; color: #ff5555; font-weight: bold;">
                        **Zerstörung**: Die gesamte Uhr, einschließlich des wertvollen Gehäuses und der komplizierten Mechanik, wurde in der Nacht vom **29. März 1942** bei einem Bombenangriff zerstört.
                    </li>
                </ul>
            </div>

            <hr style="border-top: 1px solid #1a4261; margin-top: 20px; margin-bottom: 20px;" />

            <div class="modal-step">
                <strong style="color: #ffcc33; font-size: 1.2em;">Die Neue Uhr (1955–1976) und Ihre Kunst</strong>
                <ul style="font-size: 0.9em; margin-top: 5px; padding-left: 20px;">
                    <li style="color: white;">
                        **Neubau**: Der Lübecker Uhrmachermeister **Paul Behrens** erhielt den Auftrag zum Wiederaufbau. Die Neuanfertigung basiert auf erhaltenen Plänen und Fotos der alten Uhr, ist jedoch technisch und inhaltlich modernisiert.
                    </li>
                    <li style="color: white;">
                        **Neugestaltung der Figuren**: Die berühmteste Neuerung ist der **Figurenumgang**. Statt des Kaisers und der Kurfürsten zeigen die Figuren nun **acht Repräsentanten der Menschheit** aus verschiedenen Kulturen und Ständen (z.B. Schwarzer Missionar, weißer Arzt, Japanerin, Indianer) anstelle des Kaisers und der Kurfürsten.
                    </li>
                    <li style="color: white;">
                        **Astrologie vs. Astronomie**: Die neue Uhr berücksichtigt das Phänomen des **Schlangenträgers (Ophiuchus)** und zeigt 13 Sternbilder im Tierkreisring, um die tatsächlichen astronomischen Gegebenheiten am Himmel genauer abzubilden – ein Bruch mit der traditionellen 12-Tierkreiszeichen-Astrologie.
                    </li>
                </ul>
            </div>
        `;
    }
}
