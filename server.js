const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public')); // Untuk serve index.html, style.css, script.js

// Endpoint API produk
app.get('/api/produk', (req, res) => {
  try {
    const rawData = fs.readFileSync('./data/products.json', 'utf-8');
    const products = JSON.parse(rawData);

    // Group data berdasarkan kategori
    const grouped = {
      makanan: [],
      minuman: [],
      cemilan: []
    };

    products.forEach(p => {
      const kategori = p.kategori.toLowerCase();
      if (grouped[kategori]) {
        grouped[kategori].push(p);
      }
    });

    res.json(grouped);
  } catch (err) {
    console.error('Gagal membaca atau memproses file JSON:', err.message);
    res.status(500).json({ error: 'Gagal memuat produk' });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Kasir app running at http://localhost:${PORT}`);
});
