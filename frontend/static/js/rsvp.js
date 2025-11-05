fetch(`${window.API_URL}/me`)

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token');

    // Lấy các phần tử trong form RSVP
    const form = document.querySelector('#rsvpForm');
    const nameInput = document.querySelector('#rsvp_name');
    const emailInput = document.querySelector('#rsvp_email');
    const phoneInput = document.querySelector('#rsvp_phone');
    const statusInput = document.querySelector('#attendance');
    const messageInput = document.querySelector('#message');
    const notice = document.querySelector('#rsvp_notice');

    if (!form) {
        console.warn("⚠️ Không tìm thấy form RSVP trong DOM.");
        return;
    }

    // ✅ Tự động điền thông tin nếu user đã đăng nhập
    if (token) {
        try {
            const res = await fetch(`${API_URL}/me`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const data = await res.json();

            if (data.success && data.user) {
                const user = data.user;

                // Điền thông tin user vào form
                if (nameInput) nameInput.value = user.full_name || '';
                if (emailInput) emailInput.value = user.email || '';
                if (phoneInput) phoneInput.value = user.phone || '';

                // Ẩn chỉnh sửa để tránh sửa nhầm
                [nameInput, emailInput, phoneInput].forEach((input) => {
                    if (input) {
                        input.readOnly = true;
                        input.classList.add('bg-gray-100', 'cursor-not-allowed');
                    }
                });

                // Hiển thị thông báo user hiện tại
                if (notice) {
                    notice.classList.remove('hidden');
                    notice.textContent = `Bạn đang đăng nhập với tài khoản ${user.full_name} (${user.email})`;
                }
            } else {
                console.warn('Token không hợp lệ hoặc đã hết hạn.');
                localStorage.removeItem('token');
            }
        } catch (err) {
            console.error('❌ Lỗi khi lấy thông tin user:', err);
        }
    }

    // ✅ Xử lý khi người dùng gửi form RSVP
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Thu thập dữ liệu RSVP
        const rsvpData = {
            guest_name: nameInput ? nameInput.value.trim() : '',
            guest_email: emailInput ? emailInput.value.trim() : '',
            guest_phone: phoneInput ? phoneInput.value.trim() : '',
            status: statusInput ? statusInput.value : 'yes',
            message: messageInput ? messageInput.value.trim() : '',
            guest_count: 1
        };

        // Kiểm tra dữ liệu cơ bản
        if (!rsvpData.guest_name || !rsvpData.guest_email) {
            alert('⚠️ Vui lòng nhập đầy đủ họ tên và email!');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/rsvp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: 'Bearer ' + token } : {})
                },
                body: JSON.stringify(rsvpData)
            });

            const data = await res.json();

            if (data.success) {
                alert('🎉 ' + data.message);
                form.reset();

                // Nếu user đăng nhập thì điền lại auto sau reset
                if (token) {
                    nameInput.value = localStorage.getItem('user_name') || '';
                    emailInput.readOnly = true;
                    phoneInput.readOnly = true;
                }
            } else {
                alert('❌ ' + (data.message || 'Không thể gửi RSVP.'));
            }
        } catch (err) {
            console.error('RSVP Error:', err);
            alert('Không thể kết nối tới server.');
        }
    });
});
