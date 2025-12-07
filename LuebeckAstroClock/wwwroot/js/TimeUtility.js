// Ausgelagerte TimeUtility-Klasse (Daten, Formatierung, DOM‑Helfer)
// Numerische Logik ist an AstroCalc ausgelagert.

import {
    configureAstroCalc,
    normalizeAngle,
    isLeapYear as astroIsLeapYear,
    calculateMoonAgeFromDate,
    calculateMoonRotationDifference,
    getDayOfYear,
    calculateZodiacOffsetAngle,
    calculateSunAngle,
    calculateMoonAngle,
    calculateCalendarDiskAngle
} from '/js/AstroCalc.js';

let CONFIG = null;
let DOM_REF = null;

/**
 * Injektions-Funktion — muss nach Import aufgerufen werden.
 * @param {object} config - AstroConfig
 * @param {object} dom - DOM-Referenzen
 */
export function configureTimeUtility(config, dom) {
    CONFIG = config;
    DOM_REF = dom;
    // AstroCalc ebenfalls konfigurieren
    configureAstroCalc(config);
}

export class TimeUtility {

    static DailyCalendarData = {};
    static CalendarData = {};
    static EclipseData = {};

    static normalizeAngle(angle) {
        return normalizeAngle(angle);
    }

    /**
     * Prüft, ob ein Jahr ein Schaltjahr ist (Gregorianischer Kalender).
     * @param {number} year
     * @returns {boolean}
     */
    static isLeapYear(year) {
        return astroIsLeapYear(year);
    }

    static formatDateTime(date) {
        return date.toLocaleString("de-DE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }

    // Formatierung für das Kalender-Datum
    static formatDateForInput(date) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    static updateLiveDateTime(state) {
        if (!DOM_REF) return;
        DOM_REF.liveDateTime.textContent = TimeUtility.formatDateTime(state.simDate);
    }

    static calculateMoonAgeFromDate(targetDate) {
        return calculateMoonAgeFromDate(targetDate);
    }

    static calculateMoonRotationDifference(targetDate) {
        return calculateMoonRotationDifference(targetDate);
    }

    static getDayOfYear(date) {
        return getDayOfYear(date);
    }

    /**
     * Ruft Tagesbuchstabe und Tagesheiligen ab.
     * Unterstützt keyed-Objekt (z.B. {"01. Jan": {...}}) und altes Array-Format.
     * Beachtet den Schalttag am 29. Februar.
     * @param {Date} date
     * @returns {object|null} { letter: string, saint: string }
     */
    static getDailyCalendarInfo(date) {
        // Wenn Daten als Array vorliegen: älteres Format (Index-basierte Zugriffe)
        if (Array.isArray(TimeUtility.DailyCalendarData)) {
            const dayOfYear = TimeUtility.getDayOfYear(date);
            const isLeap = TimeUtility.isLeapYear(date.getFullYear());
            let index = dayOfYear - 1;

            if (index < 0 || dayOfYear > 366) {
                return { letter: 'N/A', saint: 'Ungültiges Datum' };
            }

            if (!isLeap && dayOfYear > 59) {
                index = dayOfYear;
            }

            if (!TimeUtility.DailyCalendarData || index < 0 || index >= TimeUtility.DailyCalendarData.length) {
                if (dayOfYear === 60 && !isLeap) {
                    return { letter: 'N/A', saint: 'Kein 29. Februar' };
                }
                return { letter: 'N/A', saint: 'Kalenderdaten nicht vorhanden' };
            }

            return TimeUtility.DailyCalendarData[index];
        }

        // Neues Format: keyed-Objekt mit deutschen Monatskürzeln wie "01. Jan"
        const day = String(date.getDate()).padStart(2, '0');
        const monthShortMap = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
        const monthKey = monthShortMap[date.getMonth()] || date.toLocaleString('de-DE', { month: 'short' });
        const key = `${day}. ${monthKey}`;

        if (TimeUtility.DailyCalendarData && typeof TimeUtility.DailyCalendarData === 'object' && TimeUtility.DailyCalendarData[key]) {
            return TimeUtility.DailyCalendarData[key];
        }

        // Spezieller Fall: 29. Feb in Nicht-Schaltjahr
        if (key === '29. Feb' && !TimeUtility.isLeapYear(date.getFullYear())) {
            return { letter: 'N/A', saint: 'Kein 29. Februar' };
        }

        return { letter: 'N/A', saint: 'Kalenderdaten nicht vorhanden' };
    }

    static calculateZodiacOffsetAngle(simDate, angleSun) {
        return calculateZodiacOffsetAngle(simDate, angleSun);
    }

    static calculateSunAngle(simDate) {
        return calculateSunAngle(simDate);
    }

    static calculateMoonAngle(sunAngle, moonDiffRad) {
        return calculateMoonAngle(sunAngle, moonDiffRad);
    }

    static getCalendarInfo(year) {
        const yearStr = year.toString();
        if (year >= 1911 && year <= 2080 && TimeUtility.CalendarData && TimeUtility.CalendarData[yearStr]) {
            return TimeUtility.CalendarData[yearStr];
        }
        return null;
    }

    static getDayOfWeekString(date) {
        const weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
        return weekdays[date.getDay()];
    }

    static getEclipseInfo(year) {
        if (year >= 1911 && year <= 2080 && TimeUtility.EclipseData && TimeUtility.EclipseData[year]) {
            return TimeUtility.EclipseData[year];
        }
        return [];
    }

    static calculateCalendarDiskAngle(simDate) {
        return calculateCalendarDiskAngle(simDate);
    }
}