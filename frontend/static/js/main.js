document.addEventListener('DOMContentLoaded', () => {
    const API_URL = window.API_URL;

    // Load Stats
    async function loadStats() {
        try {
            const response = await fetch(`${API_URL}/rsvp/stats`);
            const result = await response.json();

            if (result.success) {
                const stats = result.data;
                const statsContainer = document.getElementById('stats');
                if (statsContainer) {
                    statsContainer.innerHTML = `
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
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    // Submit RSVP Form
    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = {
                name: document.getElementById('name') ? document.getElementById('name').value : '',
                email: document.getElementById('email') ? document.getElementById('email').value : '',
                phone: document.getElementById('phone') ? document.getElementById('phone').value : '',
                status: document.getElementById('status') ? document.getElementById('status').value : '',
                guest_count: document.getElementById('guest_count') ? parseInt(document.getElementById('guest_count').value) : 1,
                message: document.getElementById('message') ? document.getElementById('message').value : ''
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
                    const successMsg = document.getElementById('successMessage');
                    if (successMsg) successMsg.classList.remove('hidden');

                    // Reset form
                    rsvpForm.reset();

                    // Reload stats
                    loadStats();

                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        if (successMsg) successMsg.classList.add('hidden');
                    }, 5000);
                } else {
                    alert('Có lỗi xảy ra: ' + result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Không thể gửi xác nhận. Vui lòng thử lại!');
            }
        });
    }

    // Initialize
    // Note: updateCountdown is not defined in this file, it seems to be in index.html script tag?
    // If it's global, we can call it. If not, we might get an error.
    // Checking index.html, there is a script block with countdown logic but it doesn't define a function named updateCountdown.
    // It uses setInterval directly.
    // So lines 79-80 in original main.js calling updateCountdown() are likely broken if updateCountdown is not defined.
    // I will comment them out or remove them if I can't find the definition.
    
    loadStats();
});