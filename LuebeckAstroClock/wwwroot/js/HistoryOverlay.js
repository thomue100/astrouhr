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
    <strong style="color: #ffcc33; font-size: 1.2em;">Die Geschichte der Astronomischen Uhr 📜</strong>
    <p style="font-size: 0.9em; margin-top: 5px;">
      Die Uhr in St. Marien steht in einer langen Tradition von Repräsentation und Innovation in der Hansestadt Lübeck.
    </p>

    <h3 style="color: #ffcc33; font-size: 1.1em; margin-top: 15px;">Die Vorgängeruhren (1405–1942)</h3>
    <ul style="font-size: 0.9em; margin-top: 5px; padding-left: 20px;">
        <li style="margin-bottom: 5px;">
            <strong style="font-size: 1.0em;">Erste Uhr (1405):</strong> Die erste Astronomische Uhr, bestehend aus Kalenderscheibe und Planetarium, wurde in Betrieb genommen. Ein erhaltenes Relikt, der geschnitzte Tierkreis, wird heute im St.-Annen-Museum ausgestellt.
        </li>
        <li style="margin-bottom: 5px;">
            <strong style="font-size: 1.0em;">Zweite Uhr (1561–1566):</strong> Matthias van Oß baute die zweite, noch repräsentativere Uhr, wobei er Teile des ersten Werks wiederverwendete. Sie zeichnete sich durch reiche Schnitzereien von Hinrich Matthes und den berühmten Kurfürstenlauf aus. Sie übertraf die Uhren anderer Hansestädte.
        </li>
        <li style="margin-bottom: 5px;">
            <strong style="font-size: 1.0em;">Spätere Anpassungen:</strong> Die Turmuhrenfabrik Eduard Korfhage erneuerte 1889–1890 den Antrieb und ersetzte Zeiger, Tierkreis und Kalenderscheibe. Wegen des alten Uhrwerks musste in jedem Schaltjahr am 1. März die Kalenderscheibe manuell zurückgestellt werden.
        </li>
        <li style="margin-bottom: 5px;">
            <strong style="font-size: 1.0em;">Zerstörung:</strong> Die historische Uhr wurde am Palmarum (29. März) 1942 beim Bombenangriff auf Lübeck restlos zerstört.
        </li>
    </ul>

    <hr style="border-top: 1px solid #1a4261; margin-top: 20px; margin-bottom: 20px;" />

    <h3 style="color: #ffcc33; font-size: 1.1em; margin-top: 15px;">Der Neubau und die Technik (1955–1976)</h3>
    <ul style="font-size: 0.9em; margin-top: 5px; padding-left: 20px;">
        <li style="margin-bottom: 5px;">
            <strong style="font-size: 1.0em;">Wiederaufbau:</strong> Der Neubau wurde maßgeblich von Paul Behrens initiiert und geplant, der die Arbeiten im Äußeren eng an das historische Vorbild anlehnte.
        </li>
        <li style="margin-bottom: 5px;">
            <strong style="font-size: 1.0em;">Technik:</strong> Behrens kaufte ein gut erhaltenes älteres Turmuhrenwerk und arbeitete es auf. Das Zeigerwerk sowie die Mechanismen für den Figurenumgang und das Musikspiel wurden neu gefertigt.
        </li>
        <li style="margin-bottom: 5px;">
            <strong style="font-size: 1.0em;">Fertigstellung:</strong> Die neue Uhr wurde 1967 in Gang gesetzt und 1976 endgültig fertiggestellt. Das moderne Werk verarbeitet den Schalttag korrekt. Die Angaben der Mittelscheibe reichen von 1911 bis 2080.
        </li>
    </ul>

    <hr style="border-top: 1px solid #1a4261; margin-top: 20px; margin-bottom: 20px;" />

    <h3 style="color: #ffcc33; font-size: 1.1em; margin-top: 15px;">Die Künstlerischen Aspekte und Ikonografie 🎨</h3>
    <p style="font-size: 0.9em; margin-top: 5px;">
      Die Uhr ist eine herausragende Kunstuhr des 20. Jahrhunderts und folgt der charakteristischen Dreiteilung mittelalterlicher astronomischer Großuhren: Kalendarium unten, Uhrscheibe (Astrolabium) in der Mitte und Figurenumgang oben. Sie trifft eine ikonografische Aussage über das Verhältnis von Gott, Welt und Mensch.
    </p>

    <h4 style="color: #ffcc33; font-size: 1.0em; margin-top: 15px;">Uhrscheibe und Kalendarium</h4>
    <ul style="font-size: 0.9em; margin-top: 5px; padding-left: 20px;">
        <li style="margin-bottom: 5px;">
            <strong style="font-size: 1.0em;">Zentrum:</strong> Die Mitte des Planetariums nimmt die aus Wolken und Strahlen wachsende Gestalt des Heilands (Christus) ein, was auf das Johannes-Evangelium hindeutet.
        </li>
        <li style="margin-bottom: 5px;">
            <strong style="font-size: 1.0em;">Tierkreis:</strong> Die kupfergetriebene Sonne und der Mond bewegen sich astronomisch korrekt durch den Tierkreis. Der Tierkreisring ist als mitgehender blauer Himmelsring dargestellt und umfasst 13 Sternbilder, einschließlich des Schlangenträgers (*Ophiuchus*).
        </li>
        <li style="margin-bottom: 5px;">
            <strong style="font-size: 1.0em;">Ikonografie der Ecken:</strong> Die vier Ecken der Kalenderscheibe werden von den vier Evangelisten-Zeichen eingenommen (Engel/Flügelmensch, geflügelter Löwe, geflügeltes Rind, Adler).
        </li>
        <li style="margin-bottom: 5px;">
            <strong style="font-size: 1.0em;">Künstlerische Ausführung:</strong> Die Figuren stammen von Kunsttischler Heinrich Brand, die Polymentvergoldung von Malermeister Alfred Mundt.
        </li>
    </ul>
    <blockquote style="font-size: 0.9em; margin-top: 15px; margin-bottom: 10px; padding: 10px; border-left: 4px solid #ffcc33; background-color: #1a4261;">
        <p style="margin: 0; font-style: italic;">Inschrift auf der Uhrscheibe:</p>
        <p style="margin: 5px 0 0 0;">"SO OFT DU DIE KLINGENDE GLOCKE HÖRST VERGISS NICHT DEINEN GOTT DER ÜBER ALLE GESTIRNE HERRSCHT LOBEN UND IHM ZU DANKEN"</p>
    </blockquote>

    <h4 style="color: #ffcc33; font-size: 1.0em; margin-top: 15px;">Figurenumgang und Glockenaufsatz</h4>
    <ul style="font-size: 0.9em; margin-top: 5px; padding-left: 20px;">
        <li style="margin-bottom: 5px;">
           <strong style="font-size: 1.0em;">Figurenumgang:</strong> Anstelle der Kurfürsten des Vorgängermodells zeigen die Figuren des Rundgangs nun die „Gläubigen der Welt“ oder „Völker der Welt“.
        </li>
        <li style="margin-bottom: 5px;">
           <strong style="font-size: 1.0em;">Figuren:</strong> Die von Marianne Schmidt geschaffenen Figuren stellen symbolisch folgende Menschen dar: einen schwarzen Missionar, einen weißen Arzt, eine nordamerikanisch-indigene Figur, eine Japanerin, eine Afrikanerin, eine Inderin, eine arktisch-indigene Figur und einen Fischer.
        </li>
        <li style="margin-bottom: 5px;">
            strong style="font-size: 1.0em;">Zeremonie:</strong> Sie treten aus der linken Tür, verneigen sich vor Christus (dem Heiland in der Mitte) und werden von ihm gesegnet.
        </li>
        <li style="margin-bottom: 5px;">
           <strong style="font-size: 1.0em;">Glockenfiguren:</strong> Diese von Fritz Block geschnitzten Figuren symbolisieren die Zeit. Die Stundenglocke wird von einem alten Mann mit einer Sanduhr angeschlagen (Sinnbild der Zeit). Links steht eine weibliche Figur mit gesenkter Fackel und Totenkopf (Sinnbild der Vergänglichkeit). Darüber befindet sich die Janusfigur (Doppelfigur aus altem Mann und junger Frau), die Vergangenheit und Zukunft andeutet.
        </li>
    </ul>
`;

    }
}
