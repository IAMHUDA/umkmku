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

let orderChart = null;
let orderPieChart = null;
let nameBarChart = null;
let datePieChart = null;

document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = '404.html'; // Redirect ke halaman 404 jika tidak terautentikasi
        }
    });

    // Muat data chart tambahan saat halaman dimuat
    searchByName();
    // Panggil fungsi loadChartData ketika halaman dimuat, tanpa tergantung autentikasi
    loadChartData();
    
});

function loadChartData() {
    const startDate = document.getElementById('startDate').value;
    const period = document.getElementById('period').value;

    let query = db.collection('orders');
    if (startDate) {
        const endDate = new Date(startDate);
        if (period === 'daily') {
            endDate.setDate(endDate.getDate() + 1);
        } else if (period === 'weekly') {
            endDate.setDate(endDate.getDate() + 7);
        } else if (period === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1);
        } else if (period === 'yearly') {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }
        query = query.where('orderDate', '>=', startDate).where('orderDate', '<=', endDate.toISOString().split('T')[0]);
    }

    query.get().then(querySnapshot => {
        const orderData = [];
        const orderLabels = [];
        const periodMap = {};

        querySnapshot.forEach(doc => {
            const order = doc.data();
            const orderDate = new Date(order.orderDate);
            const label = formatLabel(orderDate, period);
            if (!periodMap[label]) {
                periodMap[label] = 0;
            }
            periodMap[label] += order.totalAmount;
        });

        for (const label in periodMap) {
            orderLabels.push(label);
            orderData.push(periodMap[label]);
        }

        // Hancurkan chart yang ada sebelum membuat yang baru
        if (orderChart) {
            orderChart.destroy();
        }
        if (orderPieChart) {
            orderPieChart.destroy();
        }

        // Membuat chart bar
        const barCtx = document.getElementById('orderChart').getContext('2d');
        orderChart = new Chart(barCtx, {
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
        orderPieChart = new Chart(pieCtx, {
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

function formatLabel(date, period) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    if (period === 'daily') {
        return date.toLocaleDateString('id-ID', options);
    } else if (period === 'weekly') {
        const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString('id-ID', options)} - ${endOfWeek.toLocaleDateString('id-ID', options)}`;
    } else if (period === 'monthly') {
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    } else if (period === 'yearly') {
        return date.toLocaleDateString('id-ID', { year: 'numeric' });
    }
}

function searchByName() {
    const searchTerm = document.getElementById('nameSearch').value.toLowerCase();

    db.collection('orders').get().then(querySnapshot => {
        const nameData = [];
        const nameLabels = [];
        const dateData = [];
        const dateLabels = [];

        querySnapshot.forEach(doc => {
            const order = doc.data();
            if (order.customerName.toLowerCase().includes(searchTerm)) {
                nameLabels.push(order.customerName);
                nameData.push(order.totalAmount);

                let orderDate;
                if (order.orderDate instanceof firebase.firestore.Timestamp) {
                    // Jika orderDate adalah Timestamp, konversi ke Date
                    orderDate = order.orderDate.toDate();
                } else if (typeof order.orderDate === 'string') {
                    // Jika orderDate adalah string, coba konversi ke Date
                    orderDate = new Date(order.orderDate);
                } else {
                    // Jika format lain, gunakan default Date
                    orderDate = new Date();
                }

                // Periksa apakah orderDate valid
                if (!isNaN(orderDate.getTime())) {
                    dateLabels.push(orderDate.toLocaleDateString());
                    dateData.push(order.totalAmount);
                }
            }
        });

        // Hapus chart lama jika ada
        if (nameBarChart) nameBarChart.destroy();
        if (datePieChart) datePieChart.destroy();

        // Membuat chart batang untuk nama
        const nameBarCtx = document.getElementById('nameBarChart').getContext('2d');
        nameBarChart = new Chart(nameBarCtx, {
            type: 'bar',
            data: {
                labels: nameLabels,
                datasets: [{
                    label: 'Total Amount',
                    data: nameData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
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

        // Membuat chart pie untuk tanggal
        const datePieCtx = document.getElementById('datePieChart').getContext('2d');
        datePieChart = new Chart(datePieCtx, {
            type: 'pie',
            data: {
                labels: dateLabels,
                datasets: [{
                    label: 'Total Amount',
                    data: dateData,
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
        console.error('Error getting extra charts data: ', error);
        Swal.fire('Gagal!', 'Terjadi kesalahan saat memuat data chart tambahan.', 'error');
    });
}



