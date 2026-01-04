// Script Node.js per generare icone PWA
// Esegui con: node create-icons.js

const fs = require('fs');
const { createCanvas } = require('canvas');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Verifica se la directory icons esiste
if (!fs.existsSync('./icons')) {
    fs.mkdirSync('./icons');
}

sizes.forEach(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background gradient (simulato con rettangoli sovrapposti)
    ctx.fillStyle = '#667eea';
    ctx.fillRect(0, 0, size, size);

    // Overlay per effetto gradiente
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 1)');
    gradient.addColorStop(1, 'rgba(118, 75, 162, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // PDF icon - white rectangle
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(size * 0.25, size * 0.2, size * 0.5, size * 0.6);

    // Fold corner
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.moveTo(size * 0.75, size * 0.2);
    ctx.lineTo(size * 0.75, size * 0.35);
    ctx.lineTo(size * 0.6, size * 0.35);
    ctx.closePath();
    ctx.fill();

    // Border for fold
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(size * 0.6, size * 0.35);
    ctx.lineTo(size * 0.75, size * 0.35);
    ctx.lineTo(size * 0.75, size * 0.2);
    ctx.stroke();

    // Text "PDF"
    ctx.fillStyle = '#4CAF50';
    ctx.font = `bold ${size * 0.15}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PDF', size * 0.5, size * 0.5);

    // Save to file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./icons/icon-${size}x${size}.png`, buffer);
    console.log(`Created icon-${size}x${size}.png`);
});

console.log('All icons generated successfully!');
