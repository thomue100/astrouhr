// js/AppOverlay.js
/**
 * Basisklasse für Overlays/Modals (Vanilla JS Component).
 * NEU: Unterstützt die Verwendung von bereits existierenden DOM-Strukturen.
 */
export class AppOverlay {
    /**
     * @param {string} id - Die ID für das generierte HTML-Element (z.B. 'infoModal').
     * @param {string} title - Der Titel des Modals.
     * @param {string} contentHtml - Der spezifische HTML-Inhalt des Modals.
     * @param {object} [existingDomRefs] - Optional: { domElement, titleElement, bodyElement } für ein bereits existierendes Modal (z.B. DayOfWeekModal).
     */
    constructor(id, title, contentHtml, existingDomRefs = {}) {
        this.id = id;
        this.title = title;
        this.contentHtml = contentHtml;

        // Referenzen von existingDomRefs übernehmen oder initialisieren
        this.domElement = existingDomRefs.domElement || null;
        this.titleElement = existingDomRefs.titleElement || null;
        this.bodyElement = existingDomRefs.bodyElement || null;

        if (!this.domElement) {
            // Modus 1: Dynamisch erstellen (für InfoOverlay, HistoryOverlay)
            this._createAndAppendDom();
        } else {
            // Modus 2: Pre-Existing Modal (für DayOfWeekOverlay)
            // Initialen Inhalt setzen, wenn ein Body-Element übergeben wurde
            if (this.bodyElement && this.contentHtml) {
                this.bodyElement.innerHTML = this.contentHtml;
            }
        }

        this._attachHandlers();
    }

    /**
     * Generiert das vollständige HTML-Markup für das Modal-Overlay (nur, wenn es nicht existiert).
     */
    _getFullModalHtml() {
        // Fügt eindeutige IDs für Titel und Body hinzu, damit sie später leicht referenziert werden können.
        return `
            <div id="${this.id}" class="modal-overlay" style="display: none;">
                <div class="modal-content">
                    <span id="${this.id}CloseX" class="modal-close" data-close-target="${this.id}">&times;</span>

                    <h3 id="${this.id}Title" style="color:#ffcc33; font-size: 1.5em; margin-bottom: 20px;">${this.title}</h3>
                    
                    <hr style="border-top: 1px solid #1a4261;"/>
                    
                    <div id="${this.id}BodyContent">${this.contentHtml}</div>
                    
                    <button id="${this.id}CloseButton" style="margin-top: 20px;" data-close-target="${this.id}">Schließen</button>
                </div>
            </div>
        `;
    }

    /**
     * Erstellt das DOM-Element, hängt es an den Body an und speichert die Referenz.
     * Wird nur aufgerufen, wenn this.domElement noch null ist.
     */
    _createAndAppendDom() {
        const modalHtml = this._getFullModalHtml();
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Speichere die Referenzen der neu erstellten Elemente
        this.domElement = document.getElementById(this.id);
        this.titleElement = document.getElementById(`${this.id}Title`);
        this.bodyElement = document.getElementById(`${this.id}BodyContent`);
    }

    /**
     * Fügt die Event-Handler für das Schließen hinzu (Klick außerhalb, X, Button).
     * Sucht nach Close-Elementen innerhalb des Modals, egal ob dynamisch oder pre-existing.
     */
    _attachHandlers() {
        if (!this.domElement) return;

        // Klick außerhalb des Inhalts schließt das Modal
        this.domElement.addEventListener('click', (e) => {
            if (e.target === this.domElement) this.hide();
        });

        // Klick auf Close-X oder Close-Button (Daten-Attribute oder Klasse werden verwendet)
        const closeButtons = this.domElement.querySelectorAll('.modal-close, button[data-close-target]');
        closeButtons.forEach(btn => {
            // Bindung zur Instanz sichern und Listener anhängen
            btn.addEventListener('click', this.hide.bind(this));
        });

        // Hinweis: Der globale Escape-Listener wird im InputController für alle Overlays zentral gehandhabt.
    }

    /**
     * Setzt den dynamischen Inhalt (für DayOfWeekOverlay).
     * @param {string} newHtml
     */
    setBodyContent(newHtml) {
        if (this.bodyElement) {
            this.bodyElement.innerHTML = newHtml;
        }
    }

    /**
     * Aktualisiert den Titel
     * @param {string} newTitle
     */
    setTitle(newTitle) {
        if (this.titleElement) {
            this.titleElement.textContent = newTitle;
        }
    }

    /**
     * NEU: Template-Hook für Subklassen, die dynamischen Inhalt benötigen.
     * Subklassen überschreiben diese Methode, um den Inhalt vor dem Anzeigen zu aktualisieren.
     */
    _updateContentBeforeShow() {
        // Standardmäßig leer.
    }


    /**
     * Zeigt das Modal an.
     */
    show() {
        // 1. NEU: Template-Hook aufrufen. DayOfWeekOverlay wird hier seinen Inhalt aktualisieren.
        this._updateContentBeforeShow();

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
