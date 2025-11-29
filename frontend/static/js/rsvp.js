document.addEventListener("DOMContentLoaded", async () => {
    const token = apiClient.getAccessToken();

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
            const res = await apiClient.get('/me');
            if (res) {
                const data = await res.json();

                if (data.success && data.user) {
                    const user = data.user;

                    // ✅ Nếu đã RSVP rồi thì ẩn form luôn
                    if (user.has_rsvp) {
                        if (form) form.classList.add('hidden');
                        if (notice) notice.classList.add('hidden');
                        
                        const successMsg = document.getElementById('successMessage');
                        if (successMsg) {
                            successMsg.classList.remove('hidden');
                            successMsg.innerHTML = `
                                <p class="text-green-800 text-center">
                                    ✅ Chào <strong>${user.full_name}</strong>, bạn đã xác nhận tham dự rồi!<br>
                                    Hẹn gặp lại bạn tại lễ tốt nghiệp.
                                </p>
                            `;
                        }
                        return; // Dừng, không điền form nữa
                    }

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
                }
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
            const res = await apiClient.post('/rsvp', rsvpData);
            if (!res) return;

            const data = await res.json();

            if (data.success) {
                alert('🎉 ' + data.message);
                // Nếu user đăng nhập thì ẩn form và hiện thông báo cảm ơn
                if (apiClient.getAccessToken()) {
                    form.classList.add('hidden');
                    if (notice) notice.classList.add('hidden');
                    
                    // Hiện message cảm ơn nếu chưa có
                    let successMsg = document.getElementById('successMessage');
                    if (successMsg) {
                        successMsg.classList.remove('hidden');
                        successMsg.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    // Nếu là guest thì reset form để nhập tiếp nếu muốn
                    form.reset();
                }



                // Reload messages if function exists
                if (typeof window.reloadRSVPMessages === 'function') {
                    // Small delay to ensure backend has processed the new message
                    setTimeout(window.reloadRSVPMessages, 500);
                }

                // Reload stats if function exists
                if (typeof window.loadRSVPStats === 'function') {
                    setTimeout(window.loadRSVPStats, 500);
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
