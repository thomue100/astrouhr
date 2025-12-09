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
        const size = rOuter * 2 * 1.2; // Größer als rOuter, um den gesamten Bereich abzudecken

        if (img.complete && img.naturalWidth > 0) {
            // Normale Logik: Zifferblatt-Bild zeichnen
            this.withContext(() => {
                ctx.translate(center.x, center.y);
                // Das Bild wird zentriert gezeichnet
                ctx.drawImage(img, -size / 2, -size / 2, size, size);
            });
        } else {
            // Backup-Logik: Römische Ziffern zeichnen, falls das Bild nicht geladen ist
            this.withContext(() => {
                ctx.translate(center.x, center.y);
                ctx.fillStyle = 'gold';
                const { PI, HALF_PI, romanNumerals } = this.config;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                for (let h = 1; h <= 24; h++) {
                    // Berechnung des Winkels für die 24-Stunden-Anzeige (15 Grad pro Stunde)
                    // -105 Grad, da 6 Uhr oben (0 Grad) sein soll. (12 Uhr ist 180 Grad)
                    const a = (h * 15 - 105) * PI / 180;
                    const r = rOuter * 1.05; // Position außerhalb des Hauptrings
                    const x = Math.cos(a) * r, y = Math.sin(a) * r;

                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(a + HALF_PI);
                    ctx.font = `${Math.floor(this.canvas.width * 0.035)}px sans-serif`;
                    // Verwenden des 12-Stunden-Zählers für die römischen Ziffern (I-XII)
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
        this.withContext(() => {
            ctx.translate(center.x, center.y);
            ctx.rotate(rotationAngle);
            const size = radius * 2;
            ctx.drawImage(this.images.bg, -size / 2, -size / 2, size, size);
        });
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

    drawSun(radius, angle, center) {
        const ctx = this.ctx;
        this.withContext(() => {
            ctx.translate(center.x, center.y);
            ctx.rotate(angle);
            const size = this.canvas.width * 0.05;
            if (this.images.sun.complete && this.images.sun.naturalWidth > 0) {
                ctx.drawImage(this.images.sun, radius - size / 2, -size / 2, size, size);
            } else {
                ctx.beginPath();
                ctx.fillStyle = 'gold';
                ctx.arc(radius - 10, 0, 10, 0, this.config.TWO_PI);
                ctx.fill();
            }
        });
    }

    drawMoon(radius, angle, days, center) {
        const ctx = this.ctx;
        this.withContext(() => {
            ctx.translate(center.x, center.y);
            ctx.rotate(angle);
            const x = radius, y = 0, img = this.images.moonPhases[days - 1];
            const dynamicMoonHeight = this.canvas.width * 0.04;
            const dynamicMoonWidth = dynamicMoonHeight * this.config.moonDimensions.aspectRatio;

            if (img && img.complete && img.naturalWidth !== 0) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(this.config.HALF_PI);
                ctx.drawImage(img, -dynamicMoonWidth / 2, -dynamicMoonHeight / 2, dynamicMoonWidth, dynamicMoonHeight);
                ctx.restore();
            } else {
                ctx.beginPath();
                ctx.fillStyle = 'silver';
                ctx.ellipse(x, y, dynamicMoonWidth / 2, dynamicMoonHeight / 2, 0, 0, this.config.TWO_PI);
                ctx.fill();
            }
        });
    }

    drawHeilandImage(center) {
        const ctx = this.ctx;
        this.withContext(() => {
            ctx.translate(center.x, center.y);
            const img = this.images.heiland;
            const size = this.canvas.width * 0.29;

            if (img && img.complete && img.naturalWidth > 0) {
                ctx.drawImage(img, -size / 2, -size / 2, size, size);
            } else {
                ctx.beginPath();
                ctx.fillStyle = 'white';
                ctx.arc(0, 0, size / 2, 0, this.config.TWO_PI);
                ctx.fill();
            }
        });
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
                ctx.rotate(-rotationAngle);

                if (img && img.complete && img.naturalWidth > 0) {
                    ctx.drawImage(img, -size / 2, -size / 2, size, size);
                } else {
                    ctx.font = `${1.5}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'black';
                    ctx.fillText(zodiacData.symbols[name], 0, 0);
                }

                ctx.restore();
            }
        });
    }

    drawStar(cx, cy, points, outerRadius, innerRadius, color) {
        const ctx = this.ctx;
        this.withContext(() => {
            ctx.beginPath();
            ctx.translate(cx, cy);
            ctx.moveTo(0, -outerRadius);
            for (let i = 0; i < points * 2; i++) {
                const angle = (i * this.config.PI) / points;
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
        });
    }
}
