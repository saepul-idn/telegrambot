// Import library dotenv dan node-telegram-bot-api
require('dotenv').config();
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

// Konfigurasi token dari variabel lingkungan
const botToken = process.env.TELEGRAM_BOT_TOKEN;

// Buat objek bot menggunakan token
const bot = new TelegramBot(botToken, { polling: true });

// Tanggapi pesan
bot.on('message', (msg) => {
    // config
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const username = msg.from.username;
    //
    // Periksa jika pesan mengandung perintah /register
    if (msg.text && msg.text.toLowerCase() === '/register') {
        // Lakukan operasi CRUD (Create)
        registerUser(userId, chatId);
    } 
    else if (msg.text && msg.text.toLowerCase() === '/balance') {
        // Lakukan operasi CRUD (Read)
        checkBalance(userId, chatId);
    } 
    else if (msg.text && msg.text.toLowerCase().startsWith('/bere_duit')) {
        // Lakukan operasi CRUD (Update)
        const params = msg.text.split(' ');
        if (params.length === 3) {
            const amount = parseInt(params[2]);
            if (!isNaN(amount)) {
                addBalance(userId, chatId, amount);
            } else {
                bot.sendMessage(chatId, 'Jumlah koin harus berupa angka.');
            }
        } else {
            bot.sendMessage(chatId, 'Format perintah salah. Gunakan /bere_duit userID amount');
        }
    } 
    else if (msg.text && msg.text.toLowerCase().startsWith('/hapus_aing')) {
        // Lakukan operasi CRUD (Delete)
        deleteAccount(userId, chatId);
    
    } 
    //admin on/off❌✅
    else if (msg.text && msg.text.toLowerCase().startsWith('/admin')){
        bot.sendMessage(chatId, `info\nadmin online ✅\nhttps://wa.me/0882000681150\n@pak_kades_wakanda`);
    } 
    else if (msg.text && msg.text.toLowerCase().startsWith('/start')){
        bot.sendMessage(chatId, `🇮🇩 info\nexchange paypal to >>\n> dana\n> gopay\n> bank\n> pulsa\n> paket data\n> token pln\nadmin > @pak_kades_wakanda\n try /help or help`);
    } 
    //help
    else if (msg.text && msg.text.toLowerCase().startsWith('help')){
        bot.sendMessage(chatId, `info\n/register (untuk register)\n/balance (untuk cek balance)\n/pulsa (untuk cek pulsa)\n/paket (untuk cek paket data)\n/pln (untuk cek pln)\n/gopay (untuk cek gopay)\n/dana (untuk cek dana) \ninfo lengkap chat admin : @pak_kades_wakanda`);
    } 
    else if (msg.text && msg.text.toLowerCase().startsWith('/buy')) {
        const params = msg.text.split(' ');
        if (params.length === 3) {
            const product = params[1];
            const price = parseInt(params[2]);

            if (!isNaN(price)) {
                buyProduct(userId, chatId, product, price);
            } else {
                bot.sendMessage(chatId, 'Harga produk harus berupa angka.');
            }
        } else {
            bot.sendMessage(chatId, 'Format perintah salah. Gunakan /buy product price');
        }
    } 
    //pulsa    
    else if (msg.text && msg.text.toLowerCase() === '/pulsa') {
        // Baca isi file pulsa.json
        fs.readFile('./json/pulsa.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading pulsa.json:', err);
                return;
            }

            try {
                // Mengonversi isi file menjadi objek JavaScript
                const pulsaList = JSON.parse(data);

                // Mengonversi daftar pulsa ke dalam format teks
                const pulsaText = pulsaList.map(item => `${item.pulsa} - Status: ${item.status}`).join('\n');

                // Mengirim daftar pulsa sebagai pesan
                bot.sendMessage(msg.chat.id, `Daftar Pulsa:\n${pulsaText}`);
            } catch (error) {
                console.error('Error parsing pulsa.json:', error);
            }
        });
    } 
    //pln
    else if (msg.text && msg.text.toLowerCase() === '/pln') {
        // Baca isi file pulsa.json
        fs.readFile('./json/plnpascabayar.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading pulsa.json:', err);
                return;
            }

            try {
                // Mengonversi isi file menjadi objek JavaScript
                const pulsaList = JSON.parse(data);

                // Mengonversi daftar pulsa ke dalam format teks
                const plnText = pulsaList.map(item => `${item.pln} - Status: ${item.status}`).join('\n');

                // Mengirim daftar pulsa sebagai pesan
                bot.sendMessage(msg.chat.id, `Daftar token:\n${plnText}`);
            } catch (error) {
                console.error('Error parsing pln.json:', error);
            }
        });
    }
    //paket data edit
    else if (msg.text && msg.text.toLowerCase() === '/paket') {
            // Baca isi file pulsa.json
            fs.readFile('./json/paketdata.json', 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading paketdata.json:', err);
                    return;
                }
    
                try {
                    // Mengonversi isi file menjadi objek JavaScript
                    const pulsaList = JSON.parse(data);
    
                    // Mengonversi daftar pulsa ke dalam format teks
                    const quota = pulsaList.map(item => `${item.paket_quota} ${item.info} ${item.price} - Status: ${item.status}`).join('\n');
    
                    // Mengirim daftar pulsa sebagai pesan
                    bot.sendMessage(msg.chat.id, `Daftar quota:\n${quota}`);
                } catch (error) {
                    console.error('Error parsing pln.json:', error);
                }
            });
    }
    //gopay edit
    else if (msg.text && msg.text.toLowerCase() === '/gopay') {
        // Baca isi file pulsa.json
        fs.readFile('./json/gopay.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading pulsa.json:', err);
                return;
            }

            try {
                // Mengonversi isi file menjadi objek JavaScript
                const pulsaList = JSON.parse(data);

                // Mengonversi daftar pulsa ke dalam format teks
                const gopay = pulsaList.map(item => `code: ${item.gopay} coin: ${item.harga} - Status: ${item.status}`).join('\n');

                // Mengirim daftar pulsa sebagai pesan
                bot.sendMessage(msg.chat.id, `gopay :\n${gopay}`);
            } catch (error) {
                console.error('Error parsing', error);
            }
        });
    }
    //dana edit
    else if (msg.text && msg.text.toLowerCase() === '/dana') {
        // Baca isi file pulsa.json
        fs.readFile('./json/dana.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading pulsa.json:', err);
                return;
            }

            try {
                // Mengonversi isi file menjadi objek JavaScript
                const pulsaList = JSON.parse(data);

                // Mengonversi daftar pulsa ke dalam format teks
                const dana = pulsaList.map(item => `code: ${item.dana} coin: ${item.harga} - Status: ${item.status}`).join('\n');

                // Mengirim daftar pulsa sebagai pesan
                bot.sendMessage(msg.chat.id, `dana :\n${dana}`);
            } catch (error) {
                console.error('Error parsing', error);
            }
        });
    }




//end code
    console.log(`\n\n>>Pesan dari \n>>> @${username}\n>>>> ${userId}\n>>>>> ${msg.text}`);
});

// 
// Fungsi untuk melakukan operasi CRUD (Create)
function registerUser(userId, chatId) {
    // Baca data dari berkas users.json
    let userData = [];
    try {
        userData = JSON.parse(fs.readFileSync('./json/users.json'));
    } catch (error) {
        console.error('Error reading users.json:', error);
    }

    // Periksa apakah pengguna sudah terdaftar
    const existingUser = userData.find((user) => user.userId === userId);
    if (existingUser) {
        bot.sendMessage(chatId, 'Anda sudah terdaftar.');
        return;
    }

    // Tambahkan pengguna baru
    const newUser = {
        userId,
        chatId,
        coin: 0 // Anda dapat mengatur nilai awal sesuai kebutuhan
    };
    userData.push(newUser);

    // Tulis data kembali ke berkas users.json
    try {
        fs.writeFileSync('./json/users.json', JSON.stringify(userData, null, 2));
        bot.sendMessage(chatId, 'Pendaftaran berhasil. Selamat datang!');
    } catch (error) {
        console.error('Error writing to users.json:', error);
        bot.sendMessage(chatId, 'Terjadi kesalahan saat mendaftar. Coba lagi nanti.');
    }
}
// Fungsi untuk melakukan operasi CRUD (Read)
function checkBalance(userId, chatId) {
    // Baca data dari berkas users.json
    let userData = [];
    try {
        userData = JSON.parse(fs.readFileSync('./json/users.json'));
    } catch (error) {
        console.error('Error reading users.json:', error);
        bot.sendMessage(chatId, 'Terjadi kesalahan saat membaca data. Coba lagi nanti.');
        return;
    }

    // Cari pengguna berdasarkan userId
    const user = userData.find((u) => u.userId === userId);

    // Periksa apakah pengguna ditemukan
    if (user) {
        bot.sendMessage(chatId, `Saldo untuk UserID ${userId}: ${user.coin} coins`);
    } else {
        bot.sendMessage(chatId, 'Anda belum terdaftar. Gunakan /register untuk mendaftar.');
    }
}
// Fungsi untuk melakukan operasi CRUD (Update)
function addBalance(userId, chatId, amount) {
    // Baca data dari berkas users.json
    let userData = [];
    try {
        userData = JSON.parse(fs.readFileSync('./json/users.json'));
    } catch (error) {
        console.error('Error reading users.json:', error);
        bot.sendMessage(chatId, 'Terjadi kesalahan saat membaca data. Coba lagi nanti.');
        return;
    }

    // Cari pengguna berdasarkan userId
    const userIndex = userData.findIndex((u) => u.userId === userId);

    // Periksa apakah pengguna ditemukan
    if (userIndex !== -1) {
        // Update jumlah koin
        userData[userIndex].coin += amount;

        // Tulis data kembali ke berkas users.json
        try {
            fs.writeFileSync('./json/users.json', JSON.stringify(userData, null, 2));
            bot.sendMessage(chatId, `Saldo berhasil ditambahkan. Saldo sekarang: ${userData[userIndex].coin} coins`);
        } catch (error) {
            console.error('Error writing to users.json:', error);
            bot.sendMessage(chatId, 'Terjadi kesalahan saat menambahkan saldo. Coba lagi nanti.');
        }
    } else {
        bot.sendMessage(chatId, 'Anda belum terdaftar. Gunakan /register untuk mendaftar.');
    }
}
// Fungsi untuk melakukan operasi CRUD (Delete)
function deleteAccount(userId, chatId) {
    // Baca data dari berkas users.json
    let userData = [];
    try {
        userData = JSON.parse(fs.readFileSync('./json/users.json'));
    } catch (error) {
        console.error('Error reading users.json:', error);
        bot.sendMessage(chatId, 'Terjadi kesalahan saat membaca data. Coba lagi nanti.');
        return;
    }

    // Cari pengguna berdasarkan userId
    const userIndex = userData.findIndex((u) => u.userId === userId);

    // Periksa apakah pengguna ditemukan
    if (userIndex !== -1) {
        // Hapus pengguna dari array
        userData.splice(userIndex, 1);

        // Tulis data kembali ke berkas users.json
        try {
            fs.writeFileSync('./json/users.json', JSON.stringify(userData, null, 2));
            bot.sendMessage(chatId, 'Akun berhasil dihapus.');
        } catch (error) {
            console.error('Error writing to users.json:', error);
            bot.sendMessage(chatId, 'Terjadi kesalahan saat menghapus akun. Coba lagi nanti.');
        }
    } else {
        bot.sendMessage(chatId, 'Anda belum terdaftar. Gunakan /register untuk mendaftar.');
    }
}
// Fungsi untuk melakukan operasi CRUD (Update)
function buyProduct(userId, chatId, product, price) {
    // Baca data dari berkas users.json
    let userData = [];
    try {
        userData = JSON.parse(fs.readFileSync('./json/users.json'));
    } catch (error) {
        console.error('Error reading users.json:', error);
        bot.sendMessage(chatId, 'Terjadi kesalahan saat membaca data. Coba lagi nanti.');
        return;
    }

    // Cari pengguna berdasarkan userId
    const userIndex = userData.findIndex((u) => u.userId === userId);

    // Periksa apakah pengguna ditemukan
    if (userIndex !== -1) {
        // Periksa apakah pengguna memiliki cukup koin untuk membeli produk
        if (userData[userIndex].coin >= price) {
            // Kurangi koin pengguna berdasarkan harga produk
            userData[userIndex].coin -= price;

            // Tulis data kembali ke berkas users.json
            try {
                fs.writeFileSync('./json/users.json', JSON.stringify(userData, null, 2));
                bot.sendMessage(chatId, `Pembelian produk ${product} berhasil. Koin sekarang: ${userData[userIndex].coin} coins`);
            } catch (error) {
                console.error('Error writing to users.json:', error);
                bot.sendMessage(chatId, 'Terjadi kesalahan saat melakukan pembelian. Coba lagi nanti.');
            }
        } else {
            bot.sendMessage(chatId, 'Saldo tidak mencukupi untuk pembelian ini.');
        }
    } else {
        bot.sendMessage(chatId, 'Anda belum terdaftar. Gunakan /register untuk mendaftar.');
    }
}

