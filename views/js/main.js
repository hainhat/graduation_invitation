// API Base URL
const API_URL = 'http://localhost:8080/api';

// Load stats on page load
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
});

// Submit RSVP Form
document.getElementById('rsvpForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        status: document.getElementById('status').value,
        guest_count: parseInt(document.getElementById('guestCount').value),
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
            showAlert('success', 'Cảm ơn bạn đã xác nhận! ✅');
            document.getElementById('rsvpForm').reset();
            loadStats(); // Reload stats
        } else {
            showAlert('danger', 'Có lỗi xảy ra: ' + result.message);
        }
    } catch (error) {
        showAlert('danger', 'Không thể kết nối server!');
        console.error(error);
    }
});

// Load stats
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/rsvp/stats`);
        const result = await response.json();

        if (result.success) {
            document.getElementById('totalGuests').textContent = result.data.total;
            document.getElementById('confirmed').textContent = result.data.confirmed;
            document.getElementById('pending').textContent = result.data.pending;
        }
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

// Show alert
function showAlert(type, message) {
    const alertDiv = document.getElementById('alert');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';

    // Auto hide after 5 seconds
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 5000);
}