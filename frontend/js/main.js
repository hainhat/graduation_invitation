// API Base URL
const API_URL = 'http://localhost:8080/api';
const eventDate = new Date('2025-12-13T13:00:00').getTime();
// Countdown Timer
function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<p>Sự kiện đã bắt đầu!</p>';
    }
}

// Load Stats
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/rsvp/stats`);
        const result = await response.json();

        if (result.success) {
            const stats = result.data;

            document.getElementById('stats').innerHTML = `
                <div class="bg-white rounded-lg shadow-lg p-6 text-center">
                    <div class="text-4xl font-bold text-blue-600 mb-2">${stats.total || 0}</div>
                    <div class="text-gray-600">Tổng số khách</div>
                </div>
                <div class="bg-white rounded-lg shadow-lg p-6 text-center">
                    <div class="text-4xl font-bold text-green-600 mb-2">${stats.confirmed || 0}</div>
                    <div class="text-gray-600">Đã xác nhận</div>
                </div>
                <div class="bg-white rounded-lg shadow-lg p-6 text-center">
                    <div class="text-4xl font-bold text-yellow-600 mb-2">${stats.pending || 0}</div>
                    <div class="text-gray-600">Chưa xác nhận</div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Submit RSVP Form
document.getElementById('rsvpForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        status: document.getElementById('status').value,
        guest_count: parseInt(document.getElementById('guest_count').value),
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch(`${API_URL}/rsvp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            // Show success message
            document.getElementById('successMessage').classList.remove('hidden');

            // Reset form
            document.getElementById('rsvpForm').reset();

            // Reload stats
            loadStats();

            // Hide success message after 5 seconds
            setTimeout(() => {
                document.getElementById('successMessage').classList.add('hidden');
            }, 5000);
        } else {
            alert('Có lỗi xảy ra: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Không thể gửi xác nhận. Vui lòng thử lại!');
    }
});

// Initialize
setInterval(updateCountdown, 1000);
updateCountdown();
loadStats();