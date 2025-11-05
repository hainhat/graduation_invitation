fetch(`${window.API_URL}/me`)
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