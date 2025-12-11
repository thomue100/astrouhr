// ImageManager.js — verwaltet Laden und Bereitstellen aller Bilder
export class ImageManager {
    /**
     * @param {{names: string[]}} zodiacData
     * @param {number} moonCycleDays
     */
    constructor(zodiacData, moonCycleDays) {
        this.images = {
            sun: new Image(),
            pointer: new Image(),
            zifferring: new Image(),
            bg: new Image(),
            calendarDisk: new Image(),
            heiland: new Image(),
            zodiac: {},
            moonPhases: []
        };

        this.images.sun.src = 'bilder/zeiger/sonne.png';
        this.images.pointer.src = 'bilder/zeiger/zeiger.png';
        this.images.zifferring.src = 'bilder/hintergrund/zifferring.png';
        this.images.bg.src = 'bilders/hintergrund/sternhimmel.png';
        this.images.calendarDisk.src = 'bilder/hintergrund/kalenderscheibe.png';
        this.images.heiland.src = 'bilder/hintergrund/heiland.png';
        this.images.calendarDisk.onerror = () => console.warn('kalenderscheibe.png konnte nicht geladen werden.');

        if (Array.isArray(zodiacData?.names)) {
            zodiacData.names.forEach(name => {
                const img = new Image();
                img.src = `bilder/tierkreiszeichen/${name}.png`;
                img.onerror = () => console.warn(`Zodiac img missing: ${name}`);
                this.images.zodiac[name] = img;
            });
        }

        this.images.moonPhases = Array.from({ length: moonCycleDays }, (_, i) => {
            const img = new Image();
            img.src = `bilder/mondphasen/mond_${String(i + 1).padStart(2, '0')}.png`;
            return img;
        });

        this.allImagesArray = [
            this.images.sun,
            this.images.pointer,
            this.images.zifferring,
            this.images.bg,
            this.images.calendarDisk,
            this.images.heiland,
            ...this.images.moonPhases,
            ...Object.values(this.images.zodiac)
        ];
    }

    /**
     * Preload all images and resolve when done (loaded or errored).
     * @returns {Promise<void[]>}
     */
    preloadImages() {
        return Promise.all(this.allImagesArray.map(img => new Promise(res => {
            if (img.complete && img.naturalWidth > 0) res();
            else { img.onload = img.onerror = res; }
        })));
    }

    getImages() {
        return this.images;
    }
}
