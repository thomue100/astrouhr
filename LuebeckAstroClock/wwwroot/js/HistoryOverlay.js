// js/HistoryOverlay.js
import { AppOverlay } from './AppOverlay.js';

/**
 * Spezialisierte Klasse für das "Kunst & Geschichte"-Overlay.
 */
export class HistoryOverlay extends AppOverlay {
    constructor() {
        super(
            'historyModal',
            'Kunst & Geschichte der Astronomischen Uhr 📜',
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
                <strong style="color: #ffcc33; font-size: 1.2em;">Die alte Uhr (1405–1942)</strong>
                <p style="font-size: 0.9em; margin-top: 5px;">
                  Die erste Uhr wurde 1405 geweiht, wahrscheinlich von dem Kleriker Nikolaus Gronow und dem Uhrmacher Johann von Hemme.
                </p>
                <p style="font-size: 0.9em; margin-bottom: 0;">
                 Sie zeigte ursprünglich die Bewegungen der fünf klassischen Planeten (Merkur, Venus, Mars, Jupiter, Saturn) an, was für die Zeit eine absolute Seltenheit war.
                </p>
                <hr style="border-top: 1px solid #1a4261; margin-top: 20px; margin-bottom: 20px;" />
                <strong style="color: #ffcc33; font-size: 1.2em;">Die neue Uhr</strong>
                <p style="font-size: 0.9em; margin-top: 5px;">
                 Die neue Uhr...
                </p>
            </div>`;
    }
}
