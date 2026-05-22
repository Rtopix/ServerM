const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('OK'));
app.listen(PORT, () => console.log(`[SYSTEM] Web server running on port ${PORT}`));

const botArgs = {
    host: 'ToxaKraftXXX.aternos.me',
    port: 49471,                    
    username: 'burmalda488',       
    version: '1.21.11'              
};

const PASSWORD = 'MellStroy'; 

let bot;
let aiBrainInterval;

function createMinecraftBot() {
    bot = mineflayer.createBot(botArgs);

    bot.on('spawn', () => {
        console.log(`[GAME] Bot ${botArgs.username} spawned.`);
        
        if (aiBrainInterval) clearInterval(aiBrainInterval);

        setTimeout(() => {
            bot.chat(`/register ${PASSWORD} ${PASSWORD}`);
            
            setTimeout(() => {
                bot.chat(`/login ${PASSWORD}`);
                console.log('[GAME] Auth commands sent.');
                startAIBrain();
            }, 1000);
            
        }, 2000);
    });

    function startAIBrain() {
        if (aiBrainInterval) clearInterval(aiBrainInterval);

        let step = 0;
        console.log('[AI] Movement routine started.');

        aiBrainInterval = setInterval(() => {
            if (!bot || !bot.entity) return;

            bot.clearControlStates();
            const yaw = Math.random() * Math.PI * 2;
            const pitch = (Math.random() - 0.5) * Math.PI * 0.5;
            bot.look(yaw, pitch);

            switch (step) {
                case 0: bot.setControlState('forward', true); break;
                case 1: bot.setControlState('right', true); break;
                case 2: bot.setControlState('back', true); break;
                case 3: bot.setControlState('left', true); break;
            }

            if (Math.random() < 0.15) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 250);
            }

            step = (step + 1) % 4;
        }, 1000 + Math.random() * 500);
    }

    bot.on('death', () => {
        console.log('[GAME] Bot died. Respawning...');
        if (aiBrainInterval) clearInterval(aiBrainInterval);
        
        setTimeout(() => {
            bot.respawn();
        }, 2000);
    });

    bot.on('end', (reason) => {
        console.log(`[DISCONNECT] Connection closed: ${reason}. Reconnecting in 30s...`);
        if (aiBrainInterval) clearInterval(aiBrainInterval);
        setTimeout(createMinecraftBot, 30000);
    });

    bot.on('error', (err) => console.log('[ERROR]', err.message || err));
}

createMinecraftBot();
