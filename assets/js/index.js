// Firebase configuration


const items = [
    { id: 1, name: "Nasi Goreng", price: 15000, img: "./assets/images/nasigoreng.png", type: "makanan" },
    { id: 2, name: "Mie Goreng", price: 12000, img: "./assets/images/miegoreng.png", type: "makanan" },
    { id: 3, name: "Mie Kuah", price: 13000, img: "./assets/images/miekuah.png", type: "makanan" },
    { id: 4, name: "Minuman Reguler", price: 5000, img: "./assets/images/minumanreguler.png", type: "minuman" },
    { id: 5, name: "Minuman Jumbo", price: 8000, img: "./assets/images/minumanjumbo.png", type: "minuman" },
    { id: 6, name: "Teh Anget", price: 4000, img: "./assets/images/tehanget.png", type: "minuman" },
    { id: 7, name: "Air Putih", price: 3000, img: "./assets/images/airputih.png", type: "minuman" },
    { id: 8, name: "Air Es", price: 3000, img: "./assets/images/aires.png", type: "minuman" },
    { id: 9, name: "Air Es Jumbo", price: 5000, img: "./assets/images/airesjumbo.png", type: "minuman" },
    { id: 10, name: "Soto", price: 15000, img: "./assets/images/soto.png", type: "makanan" },
    { id: 11, name: "Magelangan", price: 15000, img: "./assets/images/magelangan.png", type: "makanan" },
    { id: 12, name: "Nasi Telur", price: 12000, img: "./assets/images/nasitelur.png", type: "makanan" },
    { id: 13, name: "Nasi Ayam", price: 18000, img: "./assets/images/nasiayam.png", type: "makanan" },
    { id: 14, name: "Nasi Rawon", price: 20000, img: "./assets/images/nasirawon.png", type: "makanan" },
    { id: 15, name: "Ciken Steak", price: 25000, img: "./assets/images/cikensteak.png", type: "jajanan" },
    { id: 16, name: "Krupuk", price: 2000, img: "./assets/images/krupuk.png", type: "jajanan" },
    { id: 17, name: "Donat Topping", price: 5000, img: "./assets/images/donattopping.png", type: "jajanan" },
    { id: 18, name: "Donat Isi", price: 6000, img: "./assets/images/donatisi.png", type: "jajanan" },
    { id: 19, name: "Roti Sus", price: 7000, img: "./assets/images/rotisus.png", type: "jajanan" },
    { id: 20, name: "Lumpia", price: 5000, img: "./assets/images/lumpia.png", type: "jajanan" },
    { id: 21, name: "Pastel", price: 5000, img: "./assets/images/pastel.png", type: "jajanan" },
    { id: 22, name: "Tahu", price: 3000, img: "./assets/images/tahu.png", type: "topping" },
    { id: 23, name: "Tempe", price: 3000, img: "./assets/images/tempe.png", type: "topping" },
    { id: 24, name: "Telur", price: 5000, img: "./assets/images/telur.png", type: "topping" },
    { id: 25, name: "Ayam", price: 10000, img: "./assets/images/ayam.png", type: "topping" }
];

document.addEventListener("DOMContentLoaded", function() {
    displayItems();
  
    function displayItems() {
      items.forEach(item => {
        const itemList = document.getElementById(`${item.type}List`);
        const itemHTML = `
          <div class="item">
            <img src="${item.img}" alt="${item.name}" class="item-image">
            <div class="item-details">
              <h5>${item.name}</h5>
              <p>Harga: Rp ${item.price}</p>
              <button class="btn btn-primary" onclick="addItem(${item.id}, '${item.name}', ${item.price})">Tambahkan</button>
            </div>
          </div>
        `;
        itemList.innerHTML += itemHTML;
      });
    }
  });
  
  // Daftar pesanan saat ini
let orderDetails = [];
let totalAmount = 0;

document.addEventListener("DOMContentLoaded", function() {
  displayItems();

  function displayItems() {
    items.forEach(item => {
      const itemList = document.getElementById(`${item.type}List`);
      const itemHTML = `
        <div class="item">
          <img src="${item.img}" alt="${item.name}" class="item-image">
          <div class="item-details">
            <h5>${item.name}</h5>
            <p>Harga: Rp ${item.price}</p>
            <button class="btn btn-primary" onclick="addItem(${item.id}, '${item.name}', ${item.price})">Tambahkan</button>
          </div>
        </div>
      `;
      itemList.innerHTML += itemHTML;
    });
  }
});

// Fungsi untuk menambahkan item ke orderDetails
function addItem(id, name, price) {
  const itemIndex = orderDetails.findIndex(item => item.id === id);
  if (itemIndex !== -1) {
    orderDetails[itemIndex].quantity += 1;
  } else {
    orderDetails.push({ id, name, price, quantity: 1 });
  }
  updateOrderDetails();
}

// Fungsi untuk mengupdate tampilan orderDetails
function updateOrderDetails() {
  const orderDetailsElement = document.getElementById('orderDetails');
  orderDetailsElement.innerHTML = '';
  totalAmount = 0;
  orderDetails.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;
    const orderRow = `
      <tr>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>${item.quantity}</td>
        <td>${itemTotal}</td>
        <td><button class="btn btn-danger" onclick="removeItem(${item.id})">Hapus</button></td>
      </tr>
    `;
    orderDetailsElement.innerHTML += orderRow;
  });
  document.getElementById('totalAmount').textContent = totalAmount;
}

// Fungsi untuk menghapus item dari orderDetails
function removeItem(id) {
  orderDetails = orderDetails.filter(item => item.id !== id);
  updateOrderDetails();
}

// Fungsi untuk menyimpan pesanan ke Firestore
function saveOrder() {
  const customerName = document.getElementById('customerName').value;
  const orderDate = document.getElementById('orderDate').value;
  const paymentMethod = document.getElementById('paymentMethod').value;
  const paymentStatus = document.getElementById('paymentStatus').value;

  // Simpan data pesanan dan totalAmount ke Firestore
  db.collection("orders").add({
    customerName,
    orderDate,
    paymentMethod,
    paymentStatus,
    orderDetails,
    totalAmount
  })
  .then(() => {
    Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Pesanan telah disimpan!',
      confirmButtonText: 'OK'
    }).then(() => {
      // Bersihkan orderDetails setelah berhasil disimpan
      orderDetails = [];
      updateOrderDetails();
      window.location.reload();
    });
  })
  .catch((error) => {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: `Terjadi kesalahan: ${error.message}`,
      confirmButtonText: 'OK'
    });
  });
}

// Panggil fungsi fetchOrders saat halaman dimuat
fetchOrders();

// Fungsi untuk menghapus pesanan dari Firestore
function deleteOrder(orderId) {
  db.collection("orders").doc(orderId).delete()
    .then(function() {
      alert("Order berhasil dihapus");
    })
    .catch(function(error) {
      console.error("Error removing document: ", error);
      alert("Terjadi kesalahan saat menghapus order");
    });
}

// Fungsi untuk mengambil pesanan dari Firestore
function fetchOrders() {
  db.collection("orders").onSnapshot(function(querySnapshot) {
    const ordersTable = document.getElementById('ordersTable');
    ordersTable.innerHTML = '';
    querySnapshot.forEach(function(doc) {
      const order = doc.data();
      const orderRow = `
        <tr>
          <td>${order.customerName}</td>
          <td>${order.orderDate}</td>
          <td>${order.paymentMethod}</td>
          <td>${order.paymentStatus}</td>
          <td>${order.totalAmount}</td>
          <td><button class="btn btn-danger" onclick="deleteOrder('${doc.id}')">Hapus</button></td>
        </tr>
      `;
      ordersTable.innerHTML += orderRow;
    });
  });
}