let dataProduk = [];
let keranjang = [];

const editPopup = document.getElementById("editPopup");
const popupTitle = document.getElementById("popupTitle");
const closePopupBtn = document.getElementById("closePopupBtn");
const decQtyBtn = document.getElementById("decQtyBtn");
const incQtyBtn = document.getElementById("incQtyBtn");
const qtyValue = document.getElementById("qtyValue");
const saveQtyBtn = document.getElementById("saveQtyBtn");
const hapusPesananBtn = document.getElementById("hapusPesananBtn");
const catatanEl = document.getElementById("catatan");

let currentEditItem = null;
let currentQty = 1;

async function loadKategori(kategori) {
  const container = document.getElementById("produk-container");
  container.innerHTML = "";
  const apiKeyNya = 'xzDO5vU94FruCbcQqH3SlNIGCPD2xDZ-0it2ivOgKqw'
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${kategori}&per_page=30&client_id=${apiKeyNya}`
    );

    const result = await res.json();

    dataProduk = result.results.map((item, index) => ({
      id: index + 1,
      nama: item.alt_description || `Gambar ${index + 1}`,
      harga: Math.floor(Math.random() * 10000) + 10000,
      kategori: kategori,
      gambar: item.urls.small,
    }));

    dataProduk.forEach((p) => {
      const untukFormatUang = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      });

      const div = document.createElement("div");
      div.className = "produk";
      div.innerHTML = `
        <img src="${p.gambar}" alt="${p.nama}" referrerpolicy="no-referrer" style="width:200px;height:150px;object-fit:cover;"  />
        <h4>${p.nama}</h4>
        <p>${untukFormatUang.format(p.harga)}</p> // 
      `;
      div.onclick = () => tambahKeKeranjang(p);
      container.appendChild(div);
    });
  } catch (error) {
    container.innerHTML = `<p>Gagal memuat produk. Coba lagi nanti.</p>`;
    console.error("Gagal mengambil data dari Unsplash:", error);
  }
}