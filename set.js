const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMEtLZnc1ZUR5Z251T1EyalJnamxtOTcrRFNncUd2SWFEb1M5ckl2Z25HTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiei9YMHdzbXRGcVhabDZOT3dWU1JMcXBNY3l6bmVuazMzRklrZEdIbjJ5az0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJjR0QzbXUxR2RkdEltWUsvTVlmbDIwdlJaeDhpeXpEdktMZzFPR0pIL2tnPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIzWERWeFlRV1NmTk10RkNKcHJ0eU1ialhzUExISVMxOUdQQnM0dHY0TkZvPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImFMcEtBcFZjVzR5dkY4eHpoakxQUlNEdXp0NjVhQW9kUExXNGJ4SldSRlU9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik5xRm9iWkYzTWJTeFdqMEViZlNQN3dQMWxmRUNDZ1Y4dVBBSHJRMUxGV2s9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaUdlTHNsWHZaT0tERWdYT3cxOXZuVlFWUWVhRTAxV0xZMlU4YkxYalFGcz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR2FlbHNHVHRnblNZS3FMMzRxVjdWakVsNkpNNjBRNjhxRlFsTzRVY3pEUT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InI4aDVBSzZLWDEyYVpwb1Y4Q1JXRERKWHU0Ym54NDlCVE1lamMvWENRTnF5ajc5bFMzcGtrOExkWUVZVXQ2TEcxTjgxV3FLV1gvLzJkSmhOUzhDY2lRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTA1LCJhZHZTZWNyZXRLZXkiOiI4TkFGbHFYZGZxYURRTUtKdGMzWnNkSWRXejZLaWxNQkxWQVh3ajM0bzZJPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJFajBtZFRYc1QtMi1FZmtURU5BZlNRIiwicGhvbmVJZCI6IjQyYmZlNzhmLTVmOTYtNGViOS04NmJmLTk1MzExYTQ4ZmEzMyIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIydmdnRWQyOWVKbkwzbnpmVXVya1BKbGJsNms9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTTNGem92TTFGczVmRmhYWEZsd09vOGoyQWhzPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjdTNFlITTg3IiwibWUiOnsiaWQiOiIyNTQ3OTkwNjM3ODA6MTJAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiQkFaRU5HQSJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDUDZqanJFREVNS3hsN3NHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiVUdVbVBIMjFjVWFUdlRLQmJUM0IweHFQS1VTMllBa3FGcjJNMms1VjRSQT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiTXVWMXYrWTFvcFNmbXNiV1NVVld6OHNpeWowbHNnWjNCOTZqdG5SYnpqcEQrditvdTZtWWxJRWY2aWU4dktvQUhoOUVYYll0SkYyek9SWU9zcUxjQmc9PSIsImRldmljZVNpZ25hdHVyZSI6IjZaRFN1VGVYY282QXF5cTNKZEQveXVQSTBqZDFHYXN6aU8yL0pGU2FOVWdkTWRTaFJlYnhPQ01JaUUrdWxCa0dRcTc4VWxQTjFnN1pwditOeTdtQ2l3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0Nzk5MDYzNzgwOjEyQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlZCbEpqeDl0WEZHazcweWdXMDl3ZE1hanlsRXRtQUpLaGE5ak5wT1ZlRVEifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MzQ3Mjc4ODgsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBQmdQIn0=',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "Ibrahim Adams",
    NUMERO_OWNER : process.env.NUMERO_OWNER || " Ibrahim Adams",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'BMW_MD',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/17c83719a1b40e02971e4.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
