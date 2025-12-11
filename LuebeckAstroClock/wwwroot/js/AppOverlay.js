// js/AppOverlay.js
/**
 * Basisklasse für Overlays/Modals (Vanilla JS Component).
 * Implementiert die allgemeine Shell, die Anzeige-/Verbergelogik (show/hide),
 * und die Close-Handler (X-Button, Schließen-Button, Klick außerhalb).
 */
export class AppOverlay {
    /**
     * @param {string} id - Die ID für das generierte HTML-Element (z.B. 'infoModal').
     * @param {string} title - Der Titel des Modals.
     * @param {string} contentHtml - Der spezifische HTML-Inhalt des Modals.
     */
    constructor(id, title, contentHtml) {
        this.id = id;
        this.domElement = null; // Wird in _createAndAppendDom gesetzt
        this.title = title;
        this.contentHtml = contentHtml;

        this._createAndAppendDom();
        this._attachHandlers();
    }

    /**
     * Generiert das vollständige HTML-Markup für das Modal-Overlay.
     */
    _getFullModalHtml() {
        // Das Markup ist identisch zum alten InputController-String, aber parametrisiert
        return `
            <div id="${this.id}" class="modal-overlay" style="display: none;">
                <div class="modal-content">
                    <span id="${this.id}CloseX" class="modal-close" data-close-target="${this.id}">&times;</span>

                    <h3 style="color:#ffcc33; font-size: 1.5em; margin-bottom: 20px;">${this.title}</h3>
                    
                    <hr style="border-top: 1px solid #1a4261;"/>
                    
                    ${this.contentHtml}
                    
                    <button id="${this.id}CloseButton" style="margin-top: 20px;" data-close-target="${this.id}">Schließen</button>
                </div>
            </div>
        `;
    }

    /**
     * Erstellt das DOM-Element, hängt es an den Body an und speichert die Referenz.
     */
    _createAndAppendDom() {
        const modalHtml = this._getFullModalHtml();
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.domElement = document.getElementById(this.id);
    }

    /**
     * Fügt die Event-Handler für das Schließen hinzu (Klick außerhalb, X, Button).
     */
    _attachHandlers() {
        if (!this.domElement) return;

        // Klick außerhalb des Inhalts schließt das Modal
        this.domElement.addEventListener('click', (e) => {
            if (e.target === this.domElement) this.hide();
        });

        // Klick auf Close-X oder Close-Button
        const closeButtons = this.domElement.querySelectorAll('[data-close-target]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.hide());
        });
    }

    /**
     * Zeigt das Modal an.
     */
    show() {
        if (!this.domElement) return;

        this.domElement.style.display = 'flex';
        this.domElement.style.zIndex = '9999';
        document.body.style.overflow = 'hidden';

        // Scrollen des Inhalts auf 0 setzen
        requestAnimationFrame(() => {
            const modalContent = this.domElement.querySelector('.modal-content');
            if (modalContent) modalContent.scrollTop = 0;
        });

        const focusable = this.domElement.querySelector('button, [tabindex], a, input, textarea');
        if (focusable) focusable.focus();
    }

    /**
     * Verbirgt das Modal.
     */
    hide() {
        if (!this.domElement) return;
        this.domElement.style.display = 'none';
        document.body.style.overflow = '';
    }

    /**
     * Gibt zurück, ob das Modal sichtbar ist.
     */
    isVisible() {
        return this.domElement && this.domElement.style.display === 'flex';
    }
}
