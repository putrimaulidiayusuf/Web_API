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
        <p>${untukFormatUang.format(p.harga)}</p>
      `;
      div.onclick = () => tambahKeKeranjang(p);
      container.appendChild(div);
    });
  } catch (error) {
    container.innerHTML = `<p>Gagal memuat produk. Coba lagi nanti.</p>`;
    console.error("Gagal mengambil data dari Unsplash:", error);
  }
}




function tambahKeKeranjang(produk) {
  const index = keranjang.findIndex((p) => p.id === produk.id);
  if (index >= 0) {
    keranjang[index].jumlah += 1;
  } else {
    keranjang.push({ ...produk, jumlah: 1, catatan: "" });
  }
  renderKeranjang();
}

function renderKeranjang() {
  const daftar = document.getElementById("daftar-pesanan");
  daftar.innerHTML = "";
  let total = 0;
  keranjang.forEach((p) => {
    const subtotal = p.harga * p.jumlah;
    total += subtotal;

    const item = document.createElement("div");
    item.className = "item-keranjang";
    item.innerHTML = `
      <div class="jumlah">${p.jumlah}</div>
      <div class="nama-produk" onclick="openEditPopup(${p.id})" style="cursor:pointer;color:blue;">${p.nama}</div>
      <div class="harga-satuan">Rp ${p.harga}</div>
      <div class="harga-total">Rp ${subtotal}</div>
    `;
    daftar.appendChild(item);
  });
  document.getElementById("total-harga").innerText = "Total: Rp " + total;
}

function openEditPopup(id) {
  const item = keranjang.find((p) => p.id === id);
  if (!item) return;
  currentEditItem = item;
  currentQty = item.jumlah;
  popupTitle.textContent = `${item.nama} (Rp ${item.harga})`;
  qtyValue.textContent = currentQty;
  catatanEl.value = item.catatan || "";
  editPopup.classList.remove("hidden");
}

function closeEditPopup() {
  editPopup.classList.add("hidden");
  currentEditItem = null;
}

decQtyBtn.onclick = () => {
  if (currentQty > 1) {
    currentQty--;
    qtyValue.textContent = currentQty;
  }
};

incQtyBtn.onclick = () => {
  currentQty++;
  qtyValue.textContent = currentQty;
};

closePopupBtn.onclick = closeEditPopup;

saveQtyBtn.onclick = () => {
  if (!currentEditItem) return;
  currentEditItem.jumlah = currentQty;
  currentEditItem.catatan = catatanEl.value;
  renderKeranjang();
  closeEditPopup();
};

hapusPesananBtn.onclick = () => {
  if (!currentEditItem) return;
  keranjang = keranjang.filter((p) => p.id !== currentEditItem.id);
  renderKeranjang();
  closeEditPopup();
};

function selesaiPesan() {
  alert("Terima kasih telah memesan!");
  keranjang = [];
  renderKeranjang();
}

// Muat kategori awal supaya halaman ada isi
loadKategori("makanan");