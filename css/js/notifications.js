// ============ NOTIFICATIONS.JS - Local Notification Bell UI ============

(function () {
    const notiBadge = document.getElementById('noti-badge');
    const notiList = document.getElementById('noti-list');
    const notiEmpty = document.getElementById('noti-empty');
    const notiBellBtn = document.getElementById('noti-bell-btn');
    const notiDropdown = document.getElementById('noti-dropdown');
    const notiMarkAllRead = document.getElementById('noti-mark-all-read');
    const notiClearAll = document.getElementById('noti-clear-all');

    if (!notiBellBtn || !notiDropdown) return;

    let notifications = [];
    let unreadCount = 0;

    // --- Toggle dropdown ---
    notiBellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (notiDropdown.classList.contains('hidden')) {
            notiDropdown.classList.remove('hidden');
            setTimeout(() => {
                notiDropdown.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
            }, 10);
        } else {
            notiDropdown.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
            setTimeout(() => {
                notiDropdown.classList.add('hidden');
            }, 300);
        }
    });

    document.addEventListener('click', (e) => {
        if (!notiBellBtn.contains(e.target) && !notiDropdown.contains(e.target)) {
            notiDropdown.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
            setTimeout(() => {
                notiDropdown.classList.add('hidden');
            }, 300);
        }
    });

    notiDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // --- Badge ---
    function updateBadge() {
        if (unreadCount > 0) {
            notiBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            notiBadge.classList.remove('hidden');
            notiBellBtn.classList.add('animate-pulse');
            setTimeout(() => notiBellBtn.classList.remove('animate-pulse'), 3000);
        } else {
            notiBadge.classList.add('hidden');
        }
    }

    // --- Render ---
    function renderNotifications() {
        Array.from(notiList.children).forEach(child => {
            if (child.id !== 'noti-empty') {
                child.remove();
            }
        });

        if (notifications.length === 0) {
            notiEmpty.style.display = 'flex';
        } else {
            notiEmpty.style.display = 'none';

            notifications.forEach(noti => {
                const item = document.createElement('div');
                item.className = "flex flex-col gap-1 p-3 rounded-lg border-b border-dashBorder/50 cursor-pointer transition-colors " +
                    (noti.is_read ? 'bg-transparent text-dashTextMuted hover:bg-[#1e1e26]/30' : 'bg-[#1e1e26]/80 text-white hover:bg-[#1e1e26]');

                const timeString = noti.time || '';

                // Use textContent to safely set text (prevent XSS)
                const wrapper = document.createElement('div');
                wrapper.className = 'flex justify-between items-start gap-2';
                const senderSpan = document.createElement('span');
                senderSpan.className = 'font-semibold text-[13px] truncate flex-1 ' + (!noti.is_read ? 'text-dashAccent' : '');
                senderSpan.textContent = noti.sender_name;
                const timeSpan = document.createElement('span');
                timeSpan.className = 'text-[10px] opacity-70 whitespace-nowrap';
                timeSpan.textContent = timeString;
                wrapper.appendChild(senderSpan);
                wrapper.appendChild(timeSpan);

                const subjectDiv = document.createElement('div');
                subjectDiv.className = 'text-[12px] font-medium truncate';
                subjectDiv.textContent = noti.subject;

                const summaryDiv = document.createElement('div');
                summaryDiv.className = 'text-[11px] opacity-80 line-clamp-2 leading-snug';
                summaryDiv.textContent = noti.summary;

                item.appendChild(wrapper);
                item.appendChild(subjectDiv);
                item.appendChild(summaryDiv);

                item.addEventListener('click', () => {
                    if (!noti.is_read) {
                        noti.is_read = true;
                        unreadCount = Math.max(0, unreadCount - 1);
                        updateBadge();
                        renderNotifications();
                    }
                });

                notiList.appendChild(item);
            });
        }
    }

    // --- Mark all read ---
    if (notiMarkAllRead) {
        notiMarkAllRead.addEventListener('click', () => {
            notifications.forEach(n => n.is_read = true);
            unreadCount = 0;
            updateBadge();
            renderNotifications();
        });
    }

    // --- Clear all ---
    if (notiClearAll) {
        notiClearAll.addEventListener('click', () => {
            notifications = [];
            unreadCount = 0;
            updateBadge();
            renderNotifications();
        });
    }

    // --- Seed a welcome notification so the bell isn't empty ---
    notifications.push({
        sender_name: 'LNMIIT Dashboard',
        subject: 'Welcome to Grade Tracker!',
        summary: 'Enter your marks in each subject card to track your progress toward passing and A grades.',
        time: 'Now',
        is_read: false
    });
    unreadCount = 1;
    updateBadge();
    renderNotifications();
})();
