// Ausgelagerter ClockRenderer
// Nutzung: import { ClockRenderer } from '/js/Renderer.js';
// Konstruktor: new ClockRenderer(ctx, canvas, images, config);

export class ClockRenderer {
    constructor(ctx, canvas, images, config) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.images = images;
        this.config = config;
    }

    withContext(fn) {
        this.ctx.save(); fn(); this.ctx.restore();
    }

    drawClock(state) {
        const ctx = this.ctx; const c = this.canvas;
        ctx.clearRect(0, 0, c.width, c.height);

        const center = { x: c.width / 2, y: c.height / 2 };
        const rLarge = c.width * 0.37;
        const rOuter = c.width * 0.37 * 1.12;
        const rSmall = c.width * 0.32, rMoon = (rLarge + rSmall) / 2;
        const combinedAngle = state.angleZodiac + state.bgInitialAngle;

        if (state.showCalendarDisk) {
            this.drawCalendarDisk(center, rOuter, state.angleCalendarDisk);
        } else {
            this.fillRingBetween(rLarge * 1.005, rOuter, '#6d87a5', center);
            this.drawGoldenRings(rLarge * 1.005, rOuter, center);
            this.draw24HourDial(rLarge, center);
            this.drawBackgroundImage(rLarge, combinedAngle, center);
            this.drawZodiacSigns(rSmall, combinedAngle, center);
            this.drawPointer(state.angleSun, 0, rLarge * 0.96, 'gold', center);
            this.drawSun(rLarge, state.angleSun, center);
            this.drawMoon(rMoon, state.angleMoon, state.mondAlter, center);
            this.drawPointer(state.angleMoon, 0, rMoon * 0.95, 'gold', center);
            this.drawHeilandImage(center);
        }
    }

    // *****************************************************************
    // NEUE GENERISCHE ZEICHENFUNKTIONEN (Generics)
    // *****************************************************************

    /**
     * Generische Methode zum Zeichnen eines radial positionierten und rotierten Assets (Bild oder Fallback).
     *
     * @param {object} center
     * @param {number} angle - Rotationswinkel um den Mittelpunkt.
     * @param {number} radius - Radialer Abstand vom Zentrum.
     * @param {HTMLImageElement|null} image - Das zu zeichnende Bild.
     * @param {number} size - Die Größe (Breite/Höhe) des Assets.
     * @param {function} [fallbackFn] - Funktion, die aufgerufen wird, wenn das Bild nicht geladen werden kann. Signatur: (ctx, x, y, size)
     */
    _drawRadialAsset(center, angle, radius, image, size, fallbackFn = null) {
        const ctx = this.ctx;
        this.withContext(() => {
            ctx.translate(center.x, center.y);
            ctx.rotate(angle);

            // Position des Bildmittelpunkts in radialer Richtung (0-Grad-Achse)
            const x = radius;
            const y = 0;

            if (image && image.complete && image.naturalWidth > 0) {
                // Bild zeichnen: zentriert bei (x, y)
                ctx.drawImage(image, x - size / 2, y - size / 2, size, size);
            } else if (fallbackFn) {
                // Fallback aufrufen
                fallbackFn(ctx, x, y, size, this.config);
            }
        });
    }

    // *****************************************************************
    // SPEZIFISCHE ZEICHENFUNKTIONEN
    // *****************************************************************

    fillRingBetween(rInner, rOuter, color, center) {
        const ctx = this.ctx;
        this.withContext(() => {
            ctx.translate(center.x, center.y);
            ctx.beginPath();
            ctx.arc(0, 0, rOuter, 0, this.config.TWO_PI, false);
            ctx.arc(0, 0, rInner, 0, this.config.TWO_PI, true);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        });
    }

    drawGoldenRings(rInner, rOuter, center) {
        const ctx = this.ctx;
        this.withContext(() => {
            ctx.translate(center.x, center.y);
            ctx.strokeStyle = 'gold';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, 0, rOuter, 0, this.config.TWO_PI); ctx.stroke();
            ctx.beginPath(); ctx.arc(0, 0, rInner, 0, this.config.TWO_PI); ctx.stroke();
        });
    }

    draw24HourDial(rOuter, center) {
        const ctx = this.ctx;
        const img = this.images.zifferring;
        const size = rOuter * 2 * 1.2;

        if (img.complete && img.naturalWidth > 0) {
            this.withContext(() => {
                ctx.translate(center.x, center.y);
                ctx.drawImage(img, -size / 2, -size / 2, size, size);
            });
        } else {
            // Backup-Logik: Römische Ziffern zeichnen
            this.withContext(() => {
                ctx.translate(center.x, center.y);
                ctx.fillStyle = 'gold';
                const { PI, HALF_PI, romanNumerals } = this.config;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                for (let h = 1; h <= 24; h++) {
                    const a = (h * 15 - 105) * PI / 180;
                    const r = rOuter * 1.05;
                    const x = Math.cos(a) * r, y = Math.sin(a) * r;

                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(a + HALF_PI);
                    ctx.font = `${Math.floor(this.canvas.width * 0.035)}px sans-serif`;
                    ctx.fillText(romanNumerals[(h - 1) % 12], 0, 0);
                    ctx.restore();
                }
            });
        }
    }

    drawDisk(radius, angle, color, center) {
        const ctx = this.ctx;
        this.withContext(() => {
            ctx.translate(center.x, center.y);
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, this.config.TWO_PI);
            ctx.fillStyle = color;
            ctx.fill();
        });
    }

    drawBackgroundImage(radius, rotationAngle, center) {
        const ctx = this.ctx;
        const img = this.images.bg;
        const fallbackColor = '#12283b';

        if (img.complete && img.naturalWidth > 0) {
            this.withContext(() => {
                ctx.translate(center.x, center.y);
                ctx.rotate(rotationAngle);
                const size = radius * 2;
                ctx.drawImage(img, -size / 2, -size / 2, size, size);
            });
        } else {
            // FALLBACK: drawDisk verwenden
            this.drawDisk(radius, 0, fallbackColor, center);
            this.drawStarsOnBlueDiskEdge(radius - 5, rotationAngle);
        }
    }

    drawStar(cx, cy, points, outerRadius, innerRadius, color) {
        // ... (Logik bleibt unverändert, da sie ein Hilfs-Renderer ist)
        const ctx = this.ctx;
        const PI = this.config.PI;

        ctx.save();
        ctx.beginPath();
        ctx.translate(cx, cy);
        ctx.moveTo(0, -outerRadius);

        for (let i = 0; i < points * 2; i++) {
            const angle = (i * PI) / points;
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            const x = Math.sin(angle) * r;
            const y = -Math.cos(angle) * r;
            ctx.lineTo(x, y);
        }

        ctx.closePath();
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
    }

    drawStarsOnBlueDiskEdge(radius, rotationAngle) {
        // ... (Logik bleibt unverändert, da sie ein komplexes Muster ist)
        const ctx = this.ctx;
        const canvas = this.canvas;
        const TWO_PI = this.config.TWO_PI;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotationAngle);
        const numStars = 96;
        const starOuterRadius = radius * 0.015;
        const starInnerRadius = starOuterRadius * 0.5;
        const r = radius - starOuterRadius;

        for (let i = 0; i < numStars; i++) {
            const angle = (i * TWO_PI) / numStars;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            const numPoints = (i + 1) % 4 === 0 ? 8 : 4;
            this.drawStar(x, y, numPoints, starOuterRadius, starInnerRadius, "gold");
        }

        ctx.restore();
    }


    drawCalendarDisk(center, maxRadius, rotationAngle) {
        const ctx = this.ctx;
        const img = this.images.calendarDisk;
        const radius = maxRadius * 1.5;

        if (img.complete && img.naturalWidth > 0) {
            this.withContext(() => {
                ctx.translate(center.x, center.y);
                ctx.rotate(rotationAngle);
                const size = radius * 2 * 0.99;
                ctx.globalAlpha = 1.0;
                ctx.drawImage(img, -size / 2, -size / 2, size, size);
            });
        } else {
            this.withContext(() => {
                ctx.translate(center.x, center.y);
                ctx.beginPath();
                ctx.arc(0, 0, maxRadius * 0.99, 0, this.config.TWO_PI);
                ctx.fillStyle = '#1e3a5f';
                ctx.fill();
                ctx.fillStyle = 'white';
                ctx.font = '20px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Kalenderscheibe nicht geladen (Kalenderscheibe.png)', 0, 0);
            });
        }
    }

    drawPointer(angle, start, end, color, center) {
        // ... (Logik bleibt unverändert, da es kein Bild-Asset ist, sondern ein Zeiger)
        const ctx = this.ctx;
        this.withContext(() => {
            ctx.translate(center.x, center.y);
            ctx.rotate(angle);
            const length = end - start;
            if (this.images.pointer.complete && this.images.pointer.naturalWidth > 0) {
                const imgH = this.canvas.width * 0.06;
                ctx.drawImage(this.images.pointer, start, -imgH / 2, length, imgH);
            } else {
                ctx.beginPath();
                ctx.moveTo(start, 0);
                ctx.lineTo(end, 0);
                ctx.strokeStyle = color;
                ctx.lineWidth = 4;
                ctx.stroke();
            }
        });
    }

    /**
     * KORRIGIERT: Nutzt _drawRadialAsset.
     */
    drawSun(radius, angle, center) {
        const size = this.canvas.width * 0.05;

        const fallbackFn = (ctx, x, y, s, config) => {
            ctx.beginPath();
            ctx.fillStyle = 'gold';
            // Der Kreis wird am (x, y) = (radius, 0) gezeichnet, mit Radius = s/2
            ctx.arc(x, y, s / 2, 0, config.TWO_PI);
            ctx.fill();
        };

        // Der Sonnenzeiger endet am Radius, daher wird das Bild etwas nach innen versetzt
        this._drawRadialAsset(
            center,
            angle,
            radius - size / 2,
            this.images.sun,
            size,
            fallbackFn
        );
    }

    drawMoon(radius, angle, days, center) {
        const ctx = this.ctx;
        const dynamicMoonHeight = this.canvas.width * 0.04;
        const dynamicMoonWidth = dynamicMoonHeight * this.config.moonDimensions.aspectRatio;

        /**
         * Gibt das passende UTF-8 Symbol für die Mondphase zurück.
         * ... (Logik bleibt unverändert)
         */
        const getMoonPhaseSymbol = (days) => {
            const totalDays = 29.5;
            const normalizedDays = (days - 1 + totalDays) % totalDays;
            const phaseIndex = Math.floor(normalizedDays / (totalDays / 8));
            /*
            const symbols = [
                '🌑', '🌒', '🌓', '🌔',
                '🌕', '🌖', '🌗', '🌘',
            ];
            */
            const symbols = [
                '🌘', '🌗', '🌖', '🌕',
                '🌔', '🌓', '🌒', '🌑'           
            ];
            return symbols[phaseIndex];
        };

        this.withContext(() => {
            ctx.translate(center.x, center.y);
            ctx.rotate(angle);
            const x = radius, y = 0, img = this.images.moonPhases[days - 1];

            // NEU: Nur EINE save/restore-Gruppe für die Platzierung des Mond-Assets
            ctx.save();
            ctx.translate(x, y); // Gehe zur radialen Position
            ctx.rotate(this.config.HALF_PI); // Rotiere das Asset um 90 Grad

            if (img && img.complete && img.naturalWidth !== 0) {
                // ✅ Standardfall: Bild der Mondphase zeichnen
                // Das Bild wird nun direkt im sub-Kontext gezeichnet
                ctx.drawImage(img, -dynamicMoonWidth / 2, -dynamicMoonHeight / 2, dynamicMoonWidth, dynamicMoonHeight);
            } else {
                // ❌ Fallback: Bestes/passendstes UTF-8 Symbol anzeigen
                const moonSymbol = getMoonPhaseSymbol(days);

                // Konfiguration für den Text
                const fontSize = dynamicMoonHeight * 1.5;
                ctx.font = `${fontSize}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'silver';

                // Zeichne das Symbol zentriert an der (0, 0) Position des sub-Kontexts
                ctx.fillText(moonSymbol, 0, 0);
            }

            ctx.restore(); // Setzt die interne Translation/Rotation des Mond-Assets zurück
        });
    }

    /**
     * KORRIGIERT: Nutzt _drawRadialAsset mit angle=0 und radius=0.
     */
    drawHeilandImage(center) {
        const size = this.canvas.width * 0.29;

        const fallbackFn = (ctx, x, y, s, config) => {
            ctx.beginPath();
            ctx.fillStyle = 'white';
            // Da x=0 und y=0, wird der Kreis genau im Zentrum gezeichnet
            ctx.arc(x, y, s / 2, 0, config.TWO_PI);
            ctx.fill();
        };

        this._drawRadialAsset(
            center,
            0, // angle: keine Rotation
            0, // radius: zentriert
            this.images.heiland,
            size,
            fallbackFn
        );
    }

    drawZodiacSigns(radius, rotationAngle, center) {
        const ctx = this.ctx;
        this.withContext(() => {
            ctx.translate(center.x, center.y);
            ctx.rotate(rotationAngle);

            const { zodiacData } = this.config;
            const baseFontSize = this.canvas.width * 0.02;
            const rBase = radius - radius * 0.2;

            for (const name of zodiacData.names) {
                const angle = zodiacData.angles[name];
                if (angle === undefined) continue;

                const img = this.images.zodiac[name];
                const ratioScale = zodiacData.scaleFactors ? (zodiacData.scaleFactors[name] || 1) : 1;
                const radialOffsetFactor = zodiacData.radialOffsets ? (zodiacData.radialOffsets[name] || 0.0) : 0.0;

                const rPos = rBase + (radius * radialOffsetFactor);
                const x = Math.cos(angle) * rPos;
                const y = Math.sin(angle) * rPos;
                const size = baseFontSize * ratioScale;

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(-rotationAngle); // Rotation aufheben, damit das Zeichen aufrecht steht

                if (img && img.complete && img.naturalWidth > 0) {
                    ctx.drawImage(img, -size / 2, -size / 2, size, size);
                } else {
                    ctx.font = `${10.5}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'white';
                    ctx.fillText(zodiacData.symbols[name], 0, 0);
                }

                ctx.restore();
            }
        });
    }

    /**
     * Übernimmt die gesamte Logik zur Größenberechnung des Canvas aus dem InputController.
     * @param {object} dom - DOM-Referenzen, die für die Höhenberechnung benötigt werden.
     * @param {AstroState} state - Der aktuelle Zustand für drawClock.
     */
    updateCanvasSizeAndRedraw(dom, state) {
        const BREAKPOINT = 850;
        const isMobile = window.innerWidth < BREAKPOINT;
        const margin = 20;
        const controlsW = 250;
        const gap = 30;
        let availableW, availableH;

        if (isMobile) {
            availableW = window.innerWidth - margin * 2;
            availableH = window.innerHeight - margin * 2;

            let controlsTotalHeight = dom.controlsHeader.offsetHeight;
            if (!dom.controlsContent.classList.contains('controls-content--hidden')) {
                controlsTotalHeight += dom.controlsContent.offsetHeight;
            }
            controlsTotalHeight += dom.calendarHeader.offsetHeight;
            if (!dom.calendarContent.classList.contains('controls-content--hidden')) {
                controlsTotalHeight += dom.calendarContent.offsetHeight;
            }

            if (dom.infoButtonHeader) controlsTotalHeight += dom.infoButtonHeader.offsetHeight;
            if (dom.historyHeader) controlsTotalHeight += dom.historyHeader.offsetHeight;
            if (dom.historyContent && !dom.historyContent.classList.contains('controls-content--hidden')) {
                controlsTotalHeight += dom.historyContent.offsetHeight;
            }

            availableH = window.innerHeight - controlsTotalHeight - gap - margin * 2;
            availableH = Math.min(availableH, window.innerWidth * 0.9);
        } else {
            availableW = window.innerWidth - controlsW - gap - margin * 2;
            availableH = window.innerHeight - margin * 2;
        }

        const size = Math.min(availableW, availableH);
        const finalSize = Math.max(size, 200);

        dom.canvas.width = dom.canvas.height = finalSize;

        this.drawClock(state);
    }
}
