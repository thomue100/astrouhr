// DataFetcher.js — liefert die Kalenderdaten (named export)
export async function loadCalendarData() {
    console.log('Starte asynchrones Laden der Kalenderdaten (DataFetcher)...');

    const dailyCalendarPromise = fetch('/data/daily-calendar.json').then(response => {
        if (!response.ok) throw new Error(`HTTP-Fehler ${response.status} beim Laden von daily-calendar.json`);
        return response.json();
    });

    const calendarPromise = fetch('/data/calendar.json').then(response => {
        if (!response.ok) throw new Error(`HTTP-Fehler ${response.status} beim Laden von calendar.json`);
        return response.json();
    });

    const eclipsePromise = fetch('/data/eclipse.json').then(response => {
        if (!response.ok) throw new Error(`HTTP-Fehler ${response.status} beim Laden von eclipse.json`);
        return response.json();
    });

    try {
        const [dailyData, calendarData, eclipseData] = await Promise.all([
            dailyCalendarPromise,
            calendarPromise,
            eclipsePromise
        ]);

        console.log('DataFetcher: Kalenderdaten erfolgreich geladen.');
        return {
            dailyData,
            calendarData,
            eclipseData
        };
    } catch (e) {
        console.error('DataFetcher: Fehler beim Laden der Kalenderdaten:', e);
        throw e;
    }
}