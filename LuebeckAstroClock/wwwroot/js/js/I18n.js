// js/I18n.js

/**
 * Klasse zur Verwaltung von Internationalisierung (i18n).
 * Speichert alle Übersetzungen und stellt Methoden zur Aktualisierung des DOM bereit.
 */
export class I18n {

    // Alle Texte der Anwendung
    static TRANSLATIONS = {
        de: {
            // -- Globale Texte --
            appTitle: 'Astronomische Uhr - St. Marien zu Lübeck',
            modalCloseButton: 'Schließen',

            // -- Controls Header --
            infoHeader: '▶️ Einführung',
            simHeaderOpen: '🔽 Simulation',
            simHeaderClosed: '▶️ Simulation',
            calendarHeaderClosed: '▶️ Kalender',
            calendarHeaderOpen: '🔽 Kalender',
            historyHeader: '▶️ Kunst & Geschichte',

            // -- Simulation Panel --
            dateTimeLabel: 'Wähle Datum und Uhrzeit und starte die Animation:',
            resetButton: 'Aktuelle Zeit',
            speedLabel: 'Geschwindigkeit:',
            toggleButtonStart: '▶️ Animation starten',
            toggleButtonPause: '⏸️ Pause',

            // -- Kalender Panel --
            calendarButton: 'Erläuterungen',
            eclipseHeader: 'Finsternisse',

            // -- History Panel --
            historyPlaceholder: 'Hier werden in Zukunft Informationen zur Geschichte der Uhr und ihrer kunsthistorischen Bedeutung angezeigt.',
            historyButton: 'Mehr erfahren',

            // -- Meldungen / Warnungen --
            invalidDateError: 'Eingabe ungültig. Datum liegt außerhalb des erlaubten Bereichs (1911-2080). Wert wird ignoriert.',
            invalidFormatWarning: 'Ungültiges Datum/Uhrzeit-Format. Eingabe wird ignoriert.',
            invalidYearCalendar: '<strong style="color: #ff5555;">Ungültiges Jahr.</strong> Bitte wählen Sie ein Datum zwischen 1911 und 2080 im Einstellungs-Panel.',

            // -- Dynamische Kalendertexte --
            'Wochentag für': 'Wochentag für',
            'Osterdatum': 'Osterdatum',
            'Goldene Zahl': 'Goldene Zahl',
            'Sonntagsbuchstabe': 'Sonntagsbuchstabe',
            'Tagesbuchstabe': 'Tagesbuchstabe',
            'Tagesheilige(r)': 'Tagesheilige(r)',
            'Datum': 'Datum',
            'Typ': 'Typ',
            'Keine Finsternisdaten für': 'Keine Finsternisdaten für',
            'vorhanden': 'vorhanden',
            'Fehlendes Jahr': 'Fehlendes Jahr',
            'Jahresdaten für': 'Jahresdaten für',
            'nicht in der statischen Tabelle hinterlegt': 'nicht in der statischen Tabelle hinterlegt',
            'Fehlende Tagesdaten': 'Fehlende Tagesdaten',

            // -- DayOfWeekOverlay Texte --
            DayOfWeekModalTitle: 'Wochentags-Rechengang für den',
            CalendarDiskHeader: '1. Die Kalenderscheibe und die Buchstaben',
            CalendarDiskP1: 'Die Kalenderscheibe der Lübecker Uhr zeigt das Datum und wichtige kirchliche Feiertage. Jeder Tag des Jahres ist mit einem Buchstaben von **A bis G** (Tagesbuchstabe) markiert. **A** steht dabei für den **1. Januar**, **B** für den **2. Januar** usw. Nach **G** beginnt die Zählung wieder bei **A**.',
            CalendarDiskP2: 'Um den Wochentag eines Datums zu bestimmen, vergleicht man den **Tagesbuchstaben** des Datums mit dem sogenannten **Sonntagsbuchstaben** des Jahres.',
            LuebeckRuleHeader: '2. Die Lübecker Rechenregel',
            LuebeckRuleP1: 'Der **Sonntagsbuchstabe (SB)** ist der Buchstabe, der im jeweiligen Jahr auf alle Sonntage fällt. Die Kalenderscheibe hat daher für alle Sonntage den Buchstaben **SB** (**SB**). In Schaltjahren gibt es zwei Sonntagsbuchstaben, die vor und nach dem Schalttag (24. Februar) gelten.',
            Step1Header: 'Schritt 1: Sonntags- und Tagesbuchstaben bestimmen',
            Step1P1: 'Bestimme den gültigen Sonntagsbuchstaben für das Jahr **YEAR** (**SBRAW**) und den Tagesbuchstaben des gewählten Datums.',
            ValidSB: 'Gültiger Sonntagsbuchstabe (SB)',
            TBFor: 'Tagesbuchstabe (TB) für',
            DayTableInfo: 'Abgelesen von der Tagestabelle',
            Step2Header: 'Schritt 2: Den Wochentag ausrechnen',
            Step2P1: 'Man beginnt beim gültigen Sonntagsbuchstaben (**VALIDSB**) und zählt buchstabenweise (**VALIDSB** → nächster Buchstabe → ...) bis man den **Tagesbuchstaben** (**DAILYLETTER**) des aktuellen Datums erreicht. Der erste Buchstabe (**VALIDSB**) ist immer der **Sonntag**.',
            Counting: 'Zählung',
            Step3Header: 'Schritt 3: Das Ergebnis ablesen 🎉',
            Step3P1: 'Der Wochentag ergibt sich aus der Position, die man beim Zählen erreicht hat (Position 0 = Sonntag, Position 6 = Samstag).',
            ResultP1: 'Der **DATE** ist ein **WEEKDAY**!',
            RuleApplied: 'Für das Schaltjahr **YEAR** gelten die Buchstaben **L1** (bis 24. Feb.) und **L2** (ab 25. Feb.).',
            RuleStart: 'Am **DAY**. **MONTH** gilt **L1**.',
            RuleEnd: 'Am **DAY**. **MONTH** gilt **L2**.',
            RuleSingle: 'Der Sonntagsbuchstabe für dieses Jahr ist **L1**.',
            RuleError: 'Fehler beim Parsen der Sonntagsbuchstaben-Daten (**RAW**).'
        },
        en: {
            // -- Global Texts --
            appTitle: 'Astronomical Clock - St. Mary\'s in Lübeck',
            modalCloseButton: 'Close',

            // -- Controls Header --
            infoHeader: '▶️ Introduction',
            simHeaderOpen: '🔽 Simulation',
            simHeaderClosed: '▶️ Simulation',
            calendarHeaderClosed: '▶️ Calendar',
            calendarHeaderOpen: '🔽 Calendar',
            historyHeader: '▶️ Art & History',

            // -- Simulation Panel --
            dateTimeLabel: 'Select Date and Time and start the animation:',
            resetButton: 'Current Time',
            speedLabel: 'Speed:',
            toggleButtonStart: '▶️ Start Animation',
            toggleButtonPause: '⏸️ Pause',

            // -- Calendar Panel --
            calendarButton: 'Explanations',
            eclipseHeader: 'Eclipses',

            // -- History Panel --
            historyPlaceholder: 'Information about the history of the clock and its art-historical significance will be displayed here in the future.',
            historyButton: 'Learn More',

            // -- Messages / Warnings --
            invalidDateError: 'Invalid input. Date is outside the allowed range (1911-2080). Value is ignored.',
            invalidFormatWarning: 'Invalid date/time format. Input is ignored.',
            invalidYearCalendar: '<strong style="color: #ff5555;">Invalid Year.</strong> Please select a date between 1911 and 2080 in the Settings panel.',

            // -- Dynamic Calendar Texts --
            'Wochentag für': 'Day of week for',
            'Osterdatum': 'Easter Date',
            'Goldene Zahl': 'Golden Number',
            'Sonntagsbuchstabe': 'Sunday Letter',
            'Tagesbuchstabe': 'Daily Letter',
            'Tagesheilige(r)': 'Daily Saint',
            'Datum': 'Date',
            'Typ': 'Type',
            'Keine Finsternisdaten für': 'No eclipse data available for',
            'vorhanden': '', // Leer lassen, da der Satzbau anders ist
            'Fehlendes Jahr': 'Missing Year',
            'Jahresdaten für': 'Annual data for',
            'nicht in der statischen Tabelle hinterlegt': 'not stored in static table',
            'Fehlende Tagesdaten': 'Missing daily data',

            // -- DayOfWeekOverlay Texts --
            DayOfWeekModalTitle: 'Day of Week Calculation for',
            CalendarDiskHeader: '1. The Calendar Disk and the Letters',
            CalendarDiskP1: 'The calendar disk of the Lübeck clock shows the date and important church holidays. Each day of the year is marked with a letter from **A to G** (Daily Letter). **A** stands for **January 1st**, **B** for **January 2nd**, etc. After **G**, the counting restarts at **A**.',
            CalendarDiskP2: 'To determine the day of the week for a given date, the **Daily Letter** of the date is compared with the **Sunday Letter** of the year.',
            LuebeckRuleHeader: '2. The Lübeck Calculation Rule',
            LuebeckRuleP1: 'The **Sunday Letter (SB)** is the letter that falls on all Sundays in that year. The calendar disk therefore has the letter **SB** (**SB**) for all Sundays. Leap years have two Sunday Letters, valid before and after the leap day (February 24th).',
            Step1Header: 'Step 1: Determine Sunday and Daily Letters',
            Step1P1: 'Determine the valid Sunday Letter for the year **YEAR** (**SBRAW**) and the Daily Letter for the selected date.',
            ValidSB: 'Valid Sunday Letter (SB)',
            TBFor: 'Daily Letter (DL) for',
            DayTableInfo: 'Read from the daily table',
            Step2Header: 'Step 2: Calculate the Day of the Week',
            Step2P1: 'Start at the valid Sunday Letter (**VALIDSB**) and count letter by letter (**VALIDSB** → next letter → ...) until you reach the **Daily Letter** (**DAILYLETTER**) of the current date. The first letter (**VALIDSB**) is always **Sunday**.',
            Counting: 'Counting',
            Step3Header: 'Step 3: Read the Result 🎉',
            Step3P1: 'The day of the week results from the position reached during counting (Position 0 = Sunday, Position 6 = Saturday).',
            ResultP1: 'The **DATE** is a **WEEKDAY**!',
            RuleApplied: 'For the leap year **YEAR**, the letters **L1** (up to Feb 24th) and **L2** (from Feb 25th) are valid.',
            RuleStart: 'On **DAY** **MONTH**, **L1** applies.',
            RuleEnd: 'On **DAY** **MONTH**, **L2** applies.',
            RuleSingle: 'The Sunday Letter for this year is **L1**.',
            RuleError: 'Error parsing the Sunday Letter data (**RAW**).'
        }
    };

    /**
     * @param {AstroState} state - Der globale Anwendungszustand zur Speicherung der Sprache.
     * @param {string} initialLang - Die initiale Sprache ('de' oder 'en').
     */
    constructor(state, initialLang = 'de') {
        this.state = state;
        this.state.currentLanguage = initialLang;
        this.domElements = document.querySelectorAll('[data-i18n-key]');
    }

    /**
     * Setzt die aktuelle Sprache, aktualisiert den Zustand und die DOM-Elemente.
     * @param {string} langCode - Die neue Sprache ('de' oder 'en').
     * @returns {void}
     */
    setLanguage(langCode) {
        if (this.state.currentLanguage === langCode) return;

        this.state.currentLanguage = langCode;
        this._updateStaticDomTexts(langCode);

        // Optional: Trigger, um dynamische Komponenten (z.B. Kalender) zu aktualisieren.
        // Dies wird im InputController gehandhabt.
    }

    /**
     * Aktualisiert alle DOM-Elemente mit dem Attribut data-i18n-key.
     * @private
     * @param {string} langCode
     * @returns {void}
     */
    _updateStaticDomTexts(langCode) {
        const texts = I18n.TRANSLATIONS[langCode];

        this.domElements.forEach(el => {
            const key = el.getAttribute('data-i18n-key');
            if (key && texts[key] !== undefined) {
                // Bei Buttons, die auch Icons enthalten, nur den reinen Text-Knoten aktualisieren
                if (el.tagName === 'BUTTON' || el.tagName === 'H2') {
                    el.textContent = texts[key];
                } else {
                    el.innerHTML = texts[key];
                }
            }
        });

        // Spezielle Handhabung für Titel, die nicht über data-i18n-key aktualisiert werden
        document.title = texts.appTitle;
        document.querySelector('.app-title').textContent = texts.appTitle;
    }


    /**
     * Gibt die Übersetzung für einen bestimmten Schlüssel zurück.
     * @param {string} key - Der Schlüssel im Übersetzungsobjekt.
     * @returns {string} Die übersetzte Zeichenkette oder ein Fehler-String.
     */
    getTranslation(key) {
        const langCode = this.state.currentLanguage;
        return I18n.TRANSLATIONS[langCode]?.[key] || `[i18n-MISSING: ${key}]`;
    }

    /**
     * Gibt die komplette Übersetzungstabelle für die aktuelle Sprache zurück.
     * @returns {object} Die Übersetzungstabelle.
     */
    getTranslationsForCurrentLanguage() {
        return I18n.TRANSLATIONS[this.state.currentLanguage];
    }
}
