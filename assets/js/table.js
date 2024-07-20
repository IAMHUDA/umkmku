// Konfigurasi Firebase
var firebaseConfig = {
    apiKey: "AIzaSyD6zN162LNFtTV_NnRpok6YctnYmDr5pNlyT2bRjXh0",
    authDomain: "umkmku-6fcce.firebaseapp.com",
    projectId: "umkmku-6fcce",
    storageBucket: "umkmku-6fcce.appspot.com",
    messagingSenderId: "727965779260",
    appId: "1:727965779260:web:5dabdd7694f8b81c30ca39",
    measurementId: "G-QGJ67SZ6WY"
  };
  
  // Inisialisasi Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Inisialisasi Firestore
  var db = firebase.firestore();
  const auth = firebase.auth();

// Firebase configuration
document.addEventListener('DOMContentLoaded', () => {
  auth.onAuthStateChanged((user) => {
      if (!user) {
          window.location.href = '404.html'; // Redirect ke halaman 404 jika tidak terautentikasi
      }
  });
});


function loadOrders() {
    const ordersTableBody = document.getElementById('ordersTableBody');
    ordersTableBody.innerHTML = ''; // Kosongkan tabel sebelum memuat data

    db.collection('orders').get().then(querySnapshot => {
        querySnapshot.forEach((doc, index) => {
            const order = doc.data();
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${order.customerName}</td>
                    <td>${order.orderDate}</td>
                    <td>${order.paymentMethod}</td>
                    <td>${order.paymentStatus}</td>
                    <td>${order.orderDetails ? order.orderDetails.map(item => `${item.name} (${item.quantity} x ${item.price})`).join('<br>') : ''}</td>
                    <td>${order.totalAmount}</td>
                    <td><button class="btn btn-warning" onclick="editOrder('${doc.id}')">Edit</button></td>
                    <td><button class="btn btn-danger" onclick="deleteOrder('${doc.id}')">Hapus</button></td>
                </tr>
            `;
            ordersTableBody.innerHTML += row;
        });
    }).catch(error => {
        console.error('Error getting orders: ', error);
        Swal.fire('Gagal!', 'Terjadi kesalahan saat memuat pesanan.', 'error');
    });
}


// Fungsi untuk mengedit pesanan
function editOrder(orderId) {
    db.collection('orders').doc(orderId).get().then(doc => {
        const order = doc.data();
        let detailsHTML = '';

        // Generate HTML for order details
        if (order.orderDetails && Array.isArray(order.orderDetails)) {
            order.orderDetails.forEach((detail, index) => {
                detailsHTML += `
                    <div class="mb-3">
                        <label for="swal-input-name-${index}" class="form-label">Nama Barang ${index + 1}</label>
                        <input id="swal-input-name-${index}" class="form-control" type="text" value="${detail.name}" placeholder="Nama Barang" required>
                        <label for="swal-input-quantity-${index}" class="form-label">Jumlah ${index + 1}</label>
                        <input id="swal-input-quantity-${index}" class="form-control" type="number" value="${detail.quantity}" placeholder="Jumlah" required>
                        <label for="swal-input-price-${index}" class="form-label">Harga Satuan ${index + 1}</label>
                        <input id="swal-input-price-${index}" class="form-control" type="number" value="${detail.price}" placeholder="Harga Satuan" required>
                    </div>
                `;
            });
        }

        Swal.fire({
            title: 'Edit Pesanan',
            html: `
                <input id="swal-input1" class="form-control mb-3" value="${order.customerName}" placeholder="Nama Pelanggan" required>
                <input id="swal-input2" class="form-control mb-3" value="${order.orderDate}" type="date" required>
                <select id="swal-input3" class="form-select mb-3" required>
                    <option value="cash" ${order.paymentMethod === 'cash' ? 'selected' : ''}>Cash</option>
                    <option value="transfer" ${order.paymentMethod === 'transfer' ? 'selected' : ''}>Transfer</option>
                </select>
                <select id="swal-input4" class="form-select mb-3" required>
                    <option value="paid" ${order.paymentStatus === 'paid' ? 'selected' : ''}>Sudah Dibayar</option>
                    <option value="unpaid" ${order.paymentStatus === 'unpaid' ? 'selected' : ''}>Belum Dibayar</option>
                </select>
                <div id="detailsContainer">
                    ${detailsHTML}
                </div>
                <input id="swal-input5" class="form-control mb-3" type="number" value="${order.totalAmount}" placeholder="Total" required>
            `,
            focusConfirm: false,
            preConfirm: () => {
                try {
                    // Gather updated order details
                    const updatedDetails = [];
                    const detailInputs = document.querySelectorAll('#detailsContainer input');
                    detailInputs.forEach((input, index) => {
                        const nameElement = document.getElementById(`swal-input-name-${index}`);
                        const quantityElement = document.getElementById(`swal-input-quantity-${index}`);
                        const priceElement = document.getElementById(`swal-input-price-${index}`);

                        if (nameElement && quantityElement && priceElement) {
                            const name = nameElement.value;
                            const quantity = parseInt(quantityElement.value);
                            const price = parseInt(priceElement.value);
                            updatedDetails.push({ name, quantity, price });
                        }
                    });

                    // Gather updated order information
                    const customerNameElement = document.getElementById('swal-input1');
                    const orderDateElement = document.getElementById('swal-input2');
                    const paymentMethodElement = document.getElementById('swal-input3');
                    const paymentStatusElement = document.getElementById('swal-input4');
                    const totalAmountElement = document.getElementById('swal-input5');

                    if (customerNameElement && orderDateElement && paymentMethodElement && paymentStatusElement && totalAmountElement) {
                        const updatedOrder = {
                            customerName: customerNameElement.value,
                            orderDate: orderDateElement.value,
                            paymentMethod: paymentMethodElement.value,
                            paymentStatus: paymentStatusElement.value,
                            orderDetails: updatedDetails,
                            totalAmount: parseInt(totalAmountElement.value)
                        };

                        // Update order in Firestore
                        return db.collection('orders').doc(orderId).update(updatedOrder);
                    } else {
                        throw new Error('One or more required fields are missing.');
                    }
                } catch (error) {
                    console.error('Error during preConfirm:', error);
                    Swal.showValidationMessage(`Request failed: ${error}`);
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Berhasil!', 'Pesanan berhasil diperbarui.', 'success');
                loadOrders(); // Muat ulang data pesanan setelah diedit
            }
        });
    });
}




// Fungsi untuk menghapus pesanan
function deleteOrder(orderId) {
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Pesanan yang dihapus tidak dapat dikembalikan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            db.collection('orders').doc(orderId).delete().then(() => {
                Swal.fire('Terhapus!', 'Pesanan telah dihapus.', 'success');
                loadOrders(); // Muat ulang data pesanan setelah dihapus
            }).catch((error) => {
                Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus pesanan: ' + error.message, 'error');
            });
        }
    });
}


  // Function to search and filter table rows
  function searchOrders() {
    const customerName = document.getElementById('searchCustomerName').value.toUpperCase();
    const orderDate = document.getElementById('searchOrderDate').value;
    const paymentMethod = document.getElementById('searchPaymentMethod').value.toUpperCase();
    const paymentStatus = document.getElementById('searchPaymentStatus').value.toUpperCase();

    const table = document.querySelector('.table'); // Assuming your table has class 'table'
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip header row
        const customerNameCell = rows[i].getElementsByTagName('td')[1]; // Assuming customer name is in the second column (index 1)
        const orderDateCell = rows[i].getElementsByTagName('td')[2]; // Assuming order date is in the third column (index 2)
        const paymentMethodCell = rows[i].getElementsByTagName('td')[3]; // Assuming payment method is in the fourth column (index 3)
        const paymentStatusCell = rows[i].getElementsByTagName('td')[4]; // Assuming payment status is in the fifth column (index 4)

        if (customerNameCell && orderDateCell && paymentMethodCell && paymentStatusCell) {
            const customerNameText = customerNameCell.textContent.toUpperCase();
            const orderDateText = orderDateCell.textContent;
            const paymentMethodText = paymentMethodCell.textContent.toUpperCase();
            const paymentStatusText = paymentStatusCell.textContent.toUpperCase();

            const isMatch = (
                (customerName === "" || customerNameText.includes(customerName)) &&
                (orderDate === "" || orderDateText.includes(orderDate)) &&
                (paymentMethod === "" || paymentMethodText.includes(paymentMethod)) &&
                (paymentStatus === "" || paymentStatusText.includes(paymentStatus))
            );

            rows[i].style.display = isMatch ? "" : "none";
        }
    }
}

// Add event listener for customer name input to reset the table when cleared
document.getElementById('searchCustomerName').addEventListener('input', function() {
    if (this.value === '') {
        loadOrders(); // Reload all orders when the input is cleared
    }
});

// Call searchOrders when other input fields change
document.getElementById('searchOrderDate').addEventListener('input', searchOrders);
document.getElementById('searchPaymentMethod').addEventListener('input', searchOrders);
document.getElementById('searchPaymentStatus').addEventListener('input', searchOrders);

// Panggil fungsi loadOrders saat halaman dimuat
window.onload = loadOrders;