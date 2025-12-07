// === Globale Hilfskonstanten und -funktionen ===
export const MonthNamesGerman = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
];

/**
* Konvertiert ein Datum im Format "TT.MM." in "TT. MonatName" (z.B. "20.04." in "20. April").
* @param {string} dateStr - Datum im Format TT.MM.
* @returns {string} Formatiertes Datum
*/
export function formatToGermanDate(dateStr) {
    const parts = dateStr.split('.');
    const day = parseInt(parts[0].trim());
    const monthIndex = parseInt(parts[1].trim()) - 1;

    if (isNaN(day) || monthIndex < 0 || monthIndex > 11) {
        return dateStr;
    }

    return `${day}. ${MonthNamesGerman[monthIndex]}`;
}