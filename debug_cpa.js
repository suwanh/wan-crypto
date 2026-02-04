const CryptoJS = require("crypto-js");

const cpaApiSecret = 'b6e907d979c7d3ea2e0531165264d9cc';
const encryptedStr = "CafLHzV2lhBe+KksoQrVAcGg/jajnuffWcVgkD76vs7gwQ6lApX3ulwjcSgSAo3OBf6JfJUk6w/K40ALJXUkRYMLgjsjCNmOzUV7j7G2yWHrNi8DUwzKbLUM+NvVpIpQg6s/+E4vQx20uj8xTWFj8uEJP/PZUgGQB/gTKBInJffEHp0GV+NjfOFjs6OHXBu/W7AupDbcRp409kKDwnjysWHg3wVMw3TGU6Zwgo0jRMc=";

function tryDecrypt(name, key, iv) {
    try {
        const result = CryptoJS.AES.decrypt(encryptedStr, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        const utf8 = result.toString(CryptoJS.enc.Utf8);
        console.log(`[${name}] Success:`, utf8);
    } catch (e) {
        console.log(`[${name}] Failed:`, e.message);
    }
}

// Scenario 1: Current implementation (Key as UTF8, IV empty)
tryDecrypt("Current (Key=Utf8, IV='')", CryptoJS.enc.Utf8.parse(cpaApiSecret), CryptoJS.enc.Utf8.parse(''));

// Scenario 2: Key as Hex, IV empty
tryDecrypt("Key=Hex, IV=''", CryptoJS.enc.Hex.parse(cpaApiSecret), CryptoJS.enc.Utf8.parse(''));

// Scenario 3: Key as Utf8, IV=Zero(16)
// Note: CryptoJS.enc.Utf8.parse('') is empty word array. Let's try explicit 16 bytes of zeros.
const zeroIV = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
tryDecrypt("Key=Utf8, IV=Zero", CryptoJS.enc.Utf8.parse(cpaApiSecret), zeroIV);

// Scenario 4: Key as Hex, IV=Zero(16)
tryDecrypt("Key=Hex, IV=Zero", CryptoJS.enc.Hex.parse(cpaApiSecret), zeroIV);

// Scenario 5: Key as Utf8, Mode=ECB
try {
     const result = CryptoJS.AES.decrypt(encryptedStr, CryptoJS.enc.Utf8.parse(cpaApiSecret), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    console.log(`[Key=Utf8, Mode=ECB] Success:`, result.toString(CryptoJS.enc.Utf8));
} catch(e) { console.log(`[Key=Utf8, Mode=ECB] Failed:`, e.message); }

// Scenario 6: Key as Hex, Mode=ECB
try {
     const result = CryptoJS.AES.decrypt(encryptedStr, CryptoJS.enc.Hex.parse(cpaApiSecret), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    console.log(`[Key=Hex, Mode=ECB] Success:`, result.toString(CryptoJS.enc.Utf8));
} catch(e) { console.log(`[Key=Hex, Mode=ECB] Failed:`, e.message); }
