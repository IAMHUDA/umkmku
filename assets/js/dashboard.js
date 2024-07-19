// Konfigurasi Firebase Anda
const firebaseConfig = {
    apiKey: "AIzaSyD6zN162LNFtTV_NnRpAb0tVZWe8VS2Zqo",
    authDomain: "umkmku-6fcce.firebaseapp.com",
    databaseURL: "https://umkmku-6fcce-default-rtdb.firebaseio.com",
    projectId: "umkmku-6fcce",
    storageBucket: "umkmku-6fcce",
    messagingSenderId: "727965779260",
    appId: "1:727965779260:web:5dabdd7694f8b81c30ca39",
    measurementId: "G-QGJ67SZ6WY"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = '404.html'; // Redirect ke halaman 404 jika tidak terautentikasi
        }
    });

    // Panggil fungsi loadChartData ketika halaman dimuat, tanpa tergantung autentikasi
    loadChartData();
});

function loadChartData() {
    db.collection('orders').get().then(querySnapshot => {
        const orderData = [];
        const orderLabels = [];
        querySnapshot.forEach(doc => {
            const order = doc.data();
            orderLabels.push(order.customerName);
            orderData.push(order.totalAmount);
        });

        // Membuat chart bar
        const barCtx = document.getElementById('orderChart').getContext('2d');
        const orderChart = new Chart(barCtx, {
            type: 'bar', // Anda bisa mengubah jenis chart ke 'line', 'pie', dll.
            data: {
                labels: orderLabels,
                datasets: [{
                    label: 'Total Amount',
                    data: orderData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Membuat chart pie
        const pieCtx = document.getElementById('orderPieChart').getContext('2d');
        const orderPieChart = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: orderLabels,
                datasets: [{
                    label: 'Total Amount',
                    data: orderData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true
            }
        });
    }).catch(error => {
        console.error('Error getting chart data: ', error);
        Swal.fire('Gagal!', 'Terjadi kesalahan saat memuat data chart.', 'error');
    });
}
