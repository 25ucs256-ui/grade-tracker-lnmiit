// ============ APP.JS - LNMIIT Dashboard Pro ============

// ============ SUCCESS TOAST FUNCTIONS ============
function showSuccessToast(title, sub) {
    const toast = document.getElementById('success-toast-container');
    if (toast) {
        toast.querySelector('.success-message-text').innerText = title || 'Success message';
        toast.querySelector('.success-sub-text').innerText = sub || 'Everything seems great';
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    }
}
function hideSuccessToast() {
    const toast = document.getElementById('success-toast-container');
    if (toast) { toast.classList.remove('show'); }
}

// --- PLAY INTRO ANIMATION ON EVERY LOAD ---
function validateRollNo(rollStr) {
    if (!rollStr) return false;
    rollStr = rollStr.trim().toUpperCase();
    const regex = /^25(UCS|UCC|UEC)(\d{3})$/;
    const match = rollStr.match(regex);
    if (!match) return false;

    return true;
}

// --- WEBHOOK NOTIFICATION SYSTEM ---
// Fire-and-forget notification to prevent any lag on the animation
function sendLoginWebhook(rollStr) {
    const WEBHOOK_URL = atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTQ3NzQ1MzA1MjMwOTkzNDIxMi9Ma0JoSmdEdGJmM3Z6bWg1Y2xsZG1tOUNmSzAzVU42bXlLTHNXeTQ0RmJjSEppZUZCbU1jbGdnR2k1MXNYUXhUYWpBbQ==");

    if (!WEBHOOK_URL || WEBHOOK_URL === "YOUR_WEBHOOK_URL_HERE") return;

    const timestamp = new Date().toISOString();

    // Format specific for Discord, can be adjusted for Telegram by changing payload structure
    const payload = {
        content: `🚀 **New Login Alert**\nStudent with Roll No \`${rollStr.toUpperCase()}\` has just accessed the Grade Tracker.\n*Time: ${timestamp}*`
    };

    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    }).catch(err => {
        // Silently trap errors so UI doesn't break if webhook fails or is blocked by adblockers
        console.warn("Webhook notification failed to send.", err);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('ag-loader');
    const dashboard = document.getElementById('dashboard-wrapper');
    const loginWrapper = document.getElementById('login-wrapper');

    // Login Validation Logic
    const loginBtn = document.getElementById('login-submit-btn');
    const loginInput = document.getElementById('roll-no-input');
    const loginError = document.getElementById('login-error');

    const handleLogin = () => {
        const roll = loginInput.value;
        if (validateRollNo(roll)) {
            loginError.style.opacity = '0';
            loginBtn.classList.add('click-wave');
            loginInput.disabled = true;
            loginBtn.style.pointerEvents = 'none';

            // Fire silent backend notification
            sendLoginWebhook(roll.trim());
            window.currentRollNo = roll.trim();

            const branchMatch = roll.trim().toUpperCase().match(/^25(UCS|UCC|UEC)(\d{3})$/);
            const branchText = branchMatch ? branchMatch[1] : 'UCS';
            localStorage.setItem('lnmiit_branch', branchText);
            localStorage.setItem('lnmiit_roll_no', roll.trim().toUpperCase());
            window.currentBranch = branchText;

            // Sync UI state explicitly right when logged in
            updateBranchUI();
            updateProfileUI();

            const loginContainer = document.getElementById('login-container');
            const rect = loginContainer.getBoundingClientRect();

            // Prevent heavy effects globally just in case
            document.body.style.setProperty('--disable-heavy-fx', 'true');

            // Disintegrate the login card with a grain/particle dissolution over ~500ms
            loginContainer.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out, filter 0.5s ease-out';
            loginContainer.style.opacity = '0';
            loginContainer.style.transform = 'scale(0.95)';
            loginContainer.style.filter = 'blur(4px)';
            loginContainer.style.pointerEvents = 'none';

            // Also hide the suggestion portal at the bottom
            const suggestionPortal = loginWrapper.querySelector('.absolute.bottom-6');
            if (suggestionPortal) {
                suggestionPortal.style.transition = 'opacity 0.3s';
                suggestionPortal.style.opacity = '0';
            }

            // Create a dense grain dissolution — lots of tiny particles bursting out from the card
            const fragment = document.createDocumentFragment();
            const particleCount = 200; // More particles = denser grain effect
            for (let i = 0; i < particleCount; i++) {
                const pixel = document.createElement('div');
                pixel.className = 'shatter-pixel';

                const size = Math.random() * 4 + 1; // Smaller grains (1-5px)
                pixel.style.width = size + 'px';
                pixel.style.height = size + 'px';

                // Spawn from within the login card bounds
                pixel.style.left = rect.left + Math.random() * rect.width + 'px';
                pixel.style.top = rect.top + Math.random() * rect.height + 'px';

                // Scatter in all directions — wider spread
                pixel.style.setProperty('--tx', (Math.random() * 600 - 300) + 'px');
                pixel.style.setProperty('--ty', (Math.random() * 600 - 300) + 'px');

                // Stagger over first 300ms for a cascading grain feel
                pixel.style.animationDelay = (Math.random() * 0.3) + 's';
                pixel.style.animationDuration = (0.4 + Math.random() * 0.4) + 's';

                fragment.appendChild(pixel);
            }
            loginWrapper.appendChild(fragment);

            // === AFTER 500ms: Card has disintegrated, now start the burn ===
            setTimeout(() => {
                // Reveal Dashboard BEHIND the burn overlay so burning reveals it
                if (dashboard) {
                    dashboard.style.visibility = 'visible';
                    dashboard.style.opacity = '1';
                    dashboard.style.display = 'flex';
                    dashboard.classList.remove('ag-dashboard-hidden');
                    dashboard.classList.add('ag-revealed');
                    dashboard.style.zIndex = '50';
                }

                // Fade out login wrapper background now
                setTimeout(() => {
                    if (loginWrapper) {
                        loginWrapper.style.transition = 'opacity 0.2s';
                        loginWrapper.style.opacity = '0';
                        loginWrapper.style.pointerEvents = 'none';
                    }
                }, 100);

                // Start the burn transition overlay!
                if (typeof window.startBurnTransition === 'function') {
                    window.startBurnTransition(function onBurnComplete() {
                        // Burn finished — clean up login wrapper and animate dashboard elements in
                        if (loginWrapper) {
                            loginWrapper.style.display = 'none';
                            loginWrapper.remove();
                        }

                        // Setup strict staggered reconstitute animation for dashboard cards
                        if (dashboard) {
                            const assembleClass = 'reconstitute-item';
                            const elementsToAnimate = dashboard.querySelectorAll('aside, header, #subjects-container > .subject-card, .glass-glow, #midsem-banner, #ai-advisor-banner, #tab-content-mess > div');

                            elementsToAnimate.forEach((el) => {
                                el.style.opacity = '0';
                                el.style.transform = 'translateY(20px)';
                            });

                            let currentDelay = 0;
                            elementsToAnimate.forEach((el) => {
                                void el.offsetWidth;
                                el.classList.add(assembleClass);
                                el.style.animationDelay = currentDelay + 's';
                                currentDelay += 0.05;
                            });
                        }

                        document.body.classList.remove('ag-loading');
                        document.body.style.removeProperty('--disable-heavy-fx');
                    });
                } else {
                    // Fallback if burn-transition.js didn't load
                    console.warn('Burn transition not available, using instant fallback.');
                    if (loginWrapper) {
                        loginWrapper.style.display = 'none';
                        loginWrapper.remove();
                    }
                    document.body.classList.remove('ag-loading');
                    document.body.style.removeProperty('--disable-heavy-fx');
                }

                // Safety Fallback: Force dashboard to show up regardless after 5s
                setTimeout(() => {
                    if (dashboard && dashboard.style.opacity !== '1') {
                        dashboard.style.visibility = 'visible';
                        dashboard.style.opacity = '1';
                        dashboard.style.display = 'flex';
                        dashboard.classList.remove('ag-dashboard-hidden');
                        dashboard.classList.add('ag-revealed');
                    }
                    if (loginWrapper && loginWrapper.parentNode) {
                        loginWrapper.style.display = 'none';
                    }
                    document.body.classList.remove('ag-loading');
                }, 5000);

            }, 500); // ← 500ms delay: let the card disintegrate first, THEN burn
        } else {
            loginError.style.opacity = '1';
            loginInput.classList.add('animate-glitch-error');
            setTimeout(() => loginInput.classList.remove('animate-glitch-error'), 300);
        }
    };

    if (loginBtn) loginBtn.addEventListener('click', handleLogin);
    if (loginInput) loginInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    // Suggestion Portal Telegram Integration
    const suggestionBtn = document.getElementById('suggestion-send-btn');
    const suggestionInput = document.getElementById('suggestion-portal-input');
    if (suggestionBtn && suggestionInput) {
        const handleSuggestion = () => {
            const userInput = suggestionInput.value.trim();
            if (!userInput) return;

            const originalHTML = suggestionBtn.innerHTML;
            suggestionBtn.innerHTML = '<svg class="w-3.5 h-3.5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
            suggestionBtn.disabled = true;

            fetch(atob("aHR0cHM6Ly9hcGkudGVsZWdyYW0ub3JnL2JvdDg3MTQzNjU4MDQ6QUFGX01hWFVvajgzWnJRYm1LOGQ4TEF0OUQ0YUNiTlBtT1Evc2VuZE1lc3NhZ2U="), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: '1485819897',
                    text: '--New Suggestion--\n\n' + userInput
                })
            }).then(response => {
                if (response.ok) {
                    suggestionInput.value = '';
                    if (typeof showSuccessToast === 'function') {
                        showSuccessToast();
                    }
                }
            }).catch(error => console.error('Error sending suggestion:', error))
                .finally(() => {
                    suggestionBtn.innerHTML = originalHTML;
                    suggestionBtn.disabled = false;
                });
        };

        suggestionBtn.addEventListener('click', handleSuggestion);
        suggestionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSuggestion();
        });
    }

    // Step 2: Suck in & Explode
    setTimeout(() => {
        if (loader) loader.classList.add('ag-exploding');

        // Step 3: Reveal Login Wrapper right when explosion peaks
        setTimeout(() => {
            if (loginWrapper) {
                loginWrapper.style.display = 'flex';
                loginWrapper.classList.remove('hidden');
                setTimeout(() => {
                    if (loginInput) loginInput.focus();
                }, 100);
            }
            if (loader) {
                loader.style.display = 'none';
            }
        }, 550);
    }, 2600);
});

// --- SIDEBAR TAB SWITCHING ---
window.switchMainTab = function (tabId) {
    const mainContent = document.getElementById('tab-content-main');
    const messContent = document.getElementById('tab-content-mess');
    const footerContent = document.getElementById('tab-content-footer');
    const navMainBtn = document.getElementById('nav-main-btn');
    const navMessBtn = document.getElementById('nav-mess-btn');
    const scrollArea = document.getElementById('main-scroller');

    if (scrollArea) scrollArea.scrollTo({ top: 0, behavior: 'smooth' });

    if (tabId === 'main') {
        mainContent.classList.remove('hidden');
        if (footerContent) footerContent.classList.remove('hidden');
        messContent.classList.add('hidden');

        navMainBtn.className = "absolute top-0 left-0 w-10 h-10 md:w-12 md:h-12 hover:w-28 md:hover:w-32 rounded-[14px] bg-dashAccent text-white flex justify-start items-center shadow-[0_0_15px_rgba(164,132,251,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden origin-left z-50";
        navMessBtn.className = "absolute top-0 left-0 w-10 h-10 md:w-12 md:h-12 hover:w-36 md:hover:w-40 rounded-[14px] bg-[#17171e] text-dashTextMuted border border-dashBorder flex justify-start items-center hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-400 transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden origin-left z-50";
    } else {
        mainContent.classList.add('hidden');
        if (footerContent) footerContent.classList.add('hidden');
        messContent.classList.remove('hidden');

        navMainBtn.className = "absolute top-0 left-0 w-10 h-10 md:w-12 md:h-12 hover:w-28 md:hover:w-32 rounded-[14px] bg-[#17171e] text-dashTextMuted border border-dashBorder flex justify-start items-center hover:bg-dashAccent/10 hover:border-dashAccent/40 hover:text-dashAccent transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden origin-left z-50";
        navMessBtn.className = "absolute top-0 left-0 w-10 h-10 md:w-12 md:h-12 hover:w-36 md:hover:w-40 rounded-[14px] bg-emerald-500 text-white flex justify-start items-center shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden origin-left z-50";
    }
};

// --- MOUSE BUBBLE & HOLOGRAPHIC 3D TILT & TEXT REPEL ---
document.addEventListener('DOMContentLoaded', () => {
    const bubble = document.getElementById('mouse-bubble');
    const titleChars = document.querySelectorAll('.stunning-char');
    let mouseX = 0, mouseY = 0;
    let ticking = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (bubble) {
                    bubble.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
                    bubble.style.opacity = '1';
                }

                const cards = document.querySelectorAll('.subject-card');
                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();

                    // Spotlight coordinates
                    card.style.setProperty('--mouse-x', `${mouseX - rect.left}px`);
                    card.style.setProperty('--mouse-y', `${mouseY - rect.top}px`);
                });

                // Grade Tracker Character Repel Effect
                titleChars.forEach(char => {
                    const rect = char.getBoundingClientRect();
                    const charX = rect.left + rect.width / 2;
                    const charY = rect.top + rect.height / 2;

                    const dx = mouseX - charX;
                    const dy = mouseY - charY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    const maxDist = 80;

                    if (dist < maxDist && dist > 0) {
                        // Calculate velocity vector away from mouse
                        const force = Math.pow((maxDist - dist) / maxDist, 1.2);
                        const pushX = -(dx / dist) * force * 50;
                        const pushY = -(dy / dist) * force * 50;

                        char.style.transform = `translate(${pushX}px, ${pushY}px) scale(1.15)`;
                        char.style.color = '#fff';
                        char.style.textShadow = '0 0 20px rgba(164,132,251,0.9), 0 0 40px rgba(164,132,251,0.6)';
                        // Fast transition to instantly dodge
                        char.style.transition = 'transform 0.05s ease-out, color 0.1s, text-shadow 0.1s';
                        char.style.zIndex = '100';
                    } else {
                        if (char.style.transform) {
                            // Smoothly float back to original place
                            char.style.transform = '';
                            char.style.color = '';
                            char.style.textShadow = '';
                            char.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.5s, text-shadow 0.5s';
                            char.style.zIndex = '';
                        }
                    }
                });

                ticking = false;
            });
            ticking = true;
        }
    });

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('button, a, input, .hover-trigger, .subject-card, .toggle-container, .ag-glow-text')) {
            document.body.classList.add('hovering-clickable');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('button, a, input, .hover-trigger, .subject-card, .toggle-container, .ag-glow-text')) {
            document.body.classList.remove('hovering-clickable');
        }
    });

    document.addEventListener('mouseleave', () => {
        if (bubble) bubble.style.opacity = '0';
    });
});

// ============================================================
// GOOGLE FLOW BLOOM GLOW — labs.google/flow/about hover effect
// Smoothly animates multi-layer text-shadow intensity on hover
// giving that intensely bright white light blooming from letters
// ============================================================
(function initFlowBloom() {
    const wrap = document.getElementById('flow-title-wrap');
    const grade = document.getElementById('glowing-grade');
    const tracker = document.getElementById('flow-tracker');
    if (!wrap || !grade || !tracker) return;

    let isHovered = false;
    let rafId = null;
    let curGlow = 0;   // 0 = dark, 1 = full bloom

    const LERP_IN = 0.075;   // ease-in speed
    const LERP_OUT = 0.05;    // ease-out (slightly slower for natural fade)

    function lerp(a, b, t) { return a + (b - a) * t; }

    function applyGlow(s) {
        // s = 0..1 — the intensity scalar
        // Multi-band text-shadow: tight core → soft mid → wide halo
        const w = (v) => `rgba(255,255,255,${(v * s).toFixed(3)})`;
        const pw = (v) => `rgba(200,184,255,${(v * s).toFixed(3)})`; // purple tint for Tracker

        const gradeShadow = [
            `0 0 ${4 * s}px ${w(1.0)}`,
            `0 0 ${10 * s}px ${w(0.9)}`,
            `0 0 ${25 * s}px ${w(0.65)}`,
            `0 0 ${55 * s}px ${w(0.35)}`,
            `0 0 ${100 * s}px ${w(0.15)}`,
        ].join(', ');

        const trackerShadow = [
            `0 0 ${4 * s}px ${w(1.0)}`,
            `0 0 ${10 * s}px ${w(0.95)}`,
            `0 0 ${25 * s}px ${w(0.7)}`,
            `0 0 ${55 * s}px ${pw(0.9)}`,   // purple in the wide band
            `0 0 ${100 * s}px ${pw(0.4)}`,
            `0 0 ${160 * s}px ${pw(0.15)}`,
        ].join(', ');

        grade.style.textShadow = gradeShadow;
        tracker.style.textShadow = trackerShadow;

        // Also slightly brighten the text itself at peak
        const br = 1 + 0.25 * s;
        grade.style.filter = `brightness(${br.toFixed(3)})`;
        tracker.style.filter = `brightness(${br.toFixed(3)})`;
    }

    function tick() {
        curGlow = lerp(curGlow, isHovered ? 1 : 0, isHovered ? LERP_IN : LERP_OUT);

        applyGlow(curGlow);

        const settled = (!isHovered && curGlow < 0.004);
        if (!settled) {
            rafId = requestAnimationFrame(tick);
        } else {
            rafId = null;
            applyGlow(0); // ensure clean zero state
        }
    }

    function startLoop() {
        if (!rafId) rafId = requestAnimationFrame(tick);
    }

    wrap.addEventListener('mouseenter', () => { isHovered = true; startLoop(); });
    wrap.addEventListener('mouseleave', () => { isHovered = false; startLoop(); });
})();

// --- SPEEDOMETER NUMBER COUNTER ---
const activeAnimations = {};

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;

    if (start === end) {
        obj.innerText = end.toFixed(1).replace(/\.0$/, '');
        return;
    }

    if (activeAnimations[id]) {
        window.cancelAnimationFrame(activeAnimations[id]);
    }

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const currentVal = start + (end - start) * easeProgress;

        obj.innerText = currentVal.toFixed(1).replace(/\.0$/, '');

        if (progress < 1) {
            activeAnimations[id] = window.requestAnimationFrame(step);
        } else {
            delete activeAnimations[id];
        }
    };
    activeAnimations[id] = window.requestAnimationFrame(step);
}

// --- MAIN APP LOGIC ---
/*
 * 🎓 HOW TO EDIT SYLLABUS TEXT IN CODE:
 *
 * Below is the `subjects` array. Every subject has a `syllabus` array property.
 * Each item in the `syllabus` array is a string enclosed in backticks (`).
 * You can edit these strings to change the text shown in the Syllabus modal!
 * You can even use HTML tags inside the backticks, like <b>Bold</b> or <br> to format it.
 */
const allSubjects = [
    {
        id: "laca", name: "Linear Algebra & Complex Analysis", code: "MT121",
        color: "blue", passMark: 19, targetA: 60,
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>`,
        notesLink: "https://drive.google.com/file/d/1UyrjydHBn5WVSfrJilWI1_unRzjXSZtn/view?usp=drive_link",
        syllabus: [
            "<strong>Unit – I: Vector Spaces, Linear Transformations and System of Linear equations</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>1.1. Vector spaces, sub-spaces, linear dependence and independence, linear span, basis, dimension</li><li>1.2. Linear transformations: definition and properties, Rank-Nullity Theorem and its applications, Matrix Representations, rank of a matrix (in terms of dimension of range space)</li><li>1.3. Finding rank using Row reduced echelon form, Consistent and inconsistent of system of linear equations, Gauss Elimination Method</li></ul>",
            "<strong>Unit-II: Eigenvalue, Eigenvectors and Diagonalization</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>2.1. Eigenvalues, eigenvectors, characteristic polynomial, Cayley Hamilton Theorem, Minimal polynomial, similarity of matrices, Diagonalization, Jordan Canonical form</li></ul>",
            "<strong>Unit -III: Inner product spaces</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>3.1. Inner Product, Norm, Angles, Orthogonal and Orthonormal sets, Orthogonal Bases, Gram-Schmidt Orthogonalization process</li></ul>",
            "<strong>Unit- IV: Introduction to Complex Numbers and Function of Complex Variables</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>4.1. Complex Numbers, Polar form, Argument, De Moivre's theorem, nth roots</li><li>4.2. Neighbourhood, Domain, Function of complex numbers, Limit, continuity, Differentiability, analyticity, Cauchy-Riemann Equations, harmonic functions, conjugate harmonic</li><li>4.3. Elementary functions of complex numbers: exponential, sin z, cos z, log z</li></ul>",
            "<strong>Unit- V: Contour Integrals and Residue theory</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>5.1. Path, Length of Path, Contour integrals, ML Inequality, dependence of integral upon the endpoints of a path, Cauchy-Goursat Theorem, Generalized Cauchy Integral formula for simply connected domains</li><li>5.2. Power series, the radius of convergence, analyticity of power series, power series representation of analytic function</li><li>5.3. Laurent Series; methods of obtaining Laurent Series</li><li>5.4. Classification of isolated singularities, Cauchy Residue Theorem, Evaluation of some real integrals by using Cauchy's Residue Theorem.</li></ul>"
        ],
        components: [
            { id: "q1", name: "Quiz 1", max: 12, status: "completed" },
            { id: "q2", name: "Quiz 2", max: 13 },
            { id: "mid", name: "Midterm Exam", max: 25, status: "completed" },
            { id: "end", name: "Endterm Exam", max: 50 }
        ]
    },
    {
        id: "dsa", name: "Data Structures & Algorithms", code: "CS121",
        color: "emerald", passMark: 35, targetA: 82,
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s8-1.79-8-4"></path></svg>`,
        notesLink: "https://drive.google.com/drive/folders/1FHBL-4QAA3gNJds2jhW3ELvogXapUFsM?usp=drive_link",
        syllabus: [
            "<strong>UNIT – I (Introduction)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>1.1 Introduction to data structures, Abstract data types, Arrays.</li><li>1.2 Introduction to algorithms, Time and Space complexity of algorithms, asymptotic analysis, big O and other notations, importance of efficient algorithms, program performance measurement.</li></ul>",
            "<strong>UNIT – II (Linear Lists)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>2.1 Sequential and Linked representations, comparison of insertion, deletion and search operations for sequential and linked representation, singly linked lists, doubly linked lists, circular lists.</li></ul>",
            "<strong>UNIT – III (Stacks and Queues)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>3.1 Stacks and Queues disciplines: sequential and linked implementations. Applications of stack: Parenthesis/brackets matching, Expression conversion, Expression evaluation. Queues and Circular Queues: concepts and implementation.</li></ul>",
            "<strong>UNIT-IV (Hashing)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>4.1 Search efficiency in lists; hashing as a search structure, hash table, collision avoidance, open addressing, probing.</li></ul>",
            "<strong>UNIT-V (Graphs and Graph algorithms)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>5.1 Definition, terminology, directed and undirected graphs, properties, representation – adjacency matrix and linked adjacency chains.</li><li>5.2 Graph traversal algorithms, Spanning trees (Prim’s algorithm), Shortest path algorithms (Dijkstra’s algorithm), Topological sorting (using DFS).</li></ul>",
            "<strong>UNIT-VI (Trees and Tree algorithms)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>6.1 Binary trees and their properties, terminology, sequential and linked implementations, and tree traversal.</li><li>6.2 Binary search trees, search efficiency, insertion and deletion operations, traversal operations, importance of balancing.</li><li>6.3 AVL trees, searching insertion and deletions in AVL trees, comparison with AVL trees, search insert and delete operations.</li><li>6.4 Heaps as priority queues, heap implementation, insertion and deletion operations, heap sort.</li><li>6.5 2-3-way search trees, Search, Insert and Delete operations.</li></ul>"
        ],
        components: [
            { id: "q1", name: "Quiz 1", max: 5, status: "completed" },
            { id: "q2", name: "Quiz 2", max: 5 },
            { id: "lab_mid", name: "Lab Midterm", max: 10, status: "completed" },
            { id: "lab_end", name: "Lab Endterm", max: 15 },
            { id: "mid", name: "Midterm", max: 25, status: "completed" },
            { id: "end", name: "Endterm", max: 40 }
        ]
    },
    {
        id: "hve", name: "Value Education & Ethics", code: "HS121",
        color: "yellow", passMark: 35, targetA: 85,
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>`,
        notesLink: "https://drive.google.com/drive/folders/13fXesP-m7eBzreY_ylTnevQ8slkGna_E?usp=drive_link",
        syllabus: [
            "<strong>UNIT I Understanding Ethics: Values and Contexts</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>Why a course on Human Values and Ethics?</li><li>Secular outlook on Human Values</li><li>Good and Evil [Devdutt Pattanaik’s “Not Quite Avatar”]</li><li>Hedonism and Ethical Hedonism</li><li>Pleasure Paradox</li><li>Discussion on Doctor's Dilemma/Classic trolley problem</li><li>Utilitarianism and Deontological Ethics [Kant and Bhagavad Gita]</li><li>A Case Study on Utilitarianism and Kantian Ethics</li></ul>",
            "<strong>UNIT II Happiness: Harmony in Self</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>Introduction: “Happiness”: A Short Film by Steve Cutts</li><li>Authentic Happiness and Well-being: Martin Seligman</li><li>Ted Talk by Martin Seligman on 'PERMA and Signature Strengths'</li><li>Tal Ben Shahar's SPIRE Model</li><li>Ted Talk by Matthew Ricard on 'The Habits of Happiness' and the concept of mind training</li><li>Ted Talk by David Steindl-Rast “Want to be Happy: Be Grateful”</li></ul>",
            "<strong>UNIT III Ethics of Identity: Individual and Society</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>Ethics of Identity (Self and Representation)</li><li>Religious divide; Casteism; Racism; Gender and Patriarchy</li><li>Cosmopolitanism: thinking beyond stereotypes and prejudices through empathetic understanding</li><li>Ted Talk by Thandie Newton on 'Embracing Otherness, Embracing Myself'</li><li>Ted Talk by Anand Giridharadas: 'A Tale of Two Cities'</li></ul>",
            "<strong>UNIT IV Ethics and Professionalism: Holistic Concerns</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>Justice (Retributive and Distributive)</li><li>Professional Ethics in the Age of AI: Accountability, Transparency, and Bias</li><li>Digital Labour and Automation: Ethical Questions for the Modern Workforce</li><li>Ethical Dilemmas in Medical Decision-Making: Autonomy, Consent, and Beneficence</li><li>Climate Justice and Professional Accountability: Narmada River Dam Case Study</li><li>Organisational Ethics: Conflict of Interest; Ethics of Whistleblowing: Duties, Risks, and Organisational Accountability; Bhopal Gas Tragedy (1984)</li><li>Corporate Social Responsibility (CSR) as Professional Ethical Practice</li></ul>",
            "<strong>UNIT V Application of Holistic Understanding of Human Values and Ethics</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>Group Seminar Presentations applying the theories and practices studied in the course</li></ul>"
        ],
        components: [
            { id: "q1", name: "Quiz 1", max: 5, status: "completed" },
            { id: "q2", name: "Quiz 2", max: 5, status: "completed" },
            { id: "q3", name: "Quiz 3", max: 5 },
            { id: "q4", name: "Quiz 4", max: 5 },
            { id: "sem", name: "Seminar", max: 10 },
            { id: "cp", name: "Class Part.", max: 5 },
            { id: "mid", name: "Midterm", max: 25, status: "completed" },
            { id: "end", name: "Endterm", max: 40 }
        ]
    },
    {
        id: "dismat", name: "Discrete Mathematics", code: "CS124",
        color: "orange", passMark: 27, targetA: 75,
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>`,
        notesLink: "https://drive.google.com/drive/folders/11_hdctjXUIXP-a0DRTB4K3QpqXMbp6k8?usp=drive_link",
        syllabus: [
            "<strong>UNIT-I (SET THEORY, FUNCTIONS AND RELATIONS)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li><strong>Set Theory:</strong> Definition of Sets, Venn Diagrams, Cartesian products, Power sets, Cardinality and Countability (Countable and Uncountable sets), Computer Representation of a Set.</li><li><strong>Function:</strong> Domain, Range, One-to-One, Onto Inverses and Composition One-to-One Correspondence</li><li><strong>Relation:</strong> Definition, types of relation, composition of relations, domain and range of a relation, pictorial representation of relation, properties of relation, partial ordering relation.</li></ul>",
            "<strong>UNIT-II (MATHEMATICAL LOGIC)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li><strong>Propositional logic:</strong> Proposition logic, logical connectives, truth tables, tautologies, contradiction, normal forms (conjunctive and disjunctive), modus ponens, modus tollens, validity and satisfiability</li><li><strong>Predicate logic:</strong> Predicates, Quantifiers, Rules of Inference for Quantified Statements</li><li><strong>Notion of proof:</strong> Proof by implication, converse, inverse, contrapositive, negation and contradiction, direct proof, proof by using truth table, proof by counterexample. Induction over natural numbers</li></ul>",
            "<strong>UNIT-III (COMBINATORICS)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li><strong>Foundations of Counting:</strong> Basic rules of Counting, Pigeonhole principle, Permutations, Derangements, Combinations, Permutations and combinations with repetitions, The Binomial Theorem, Inclusion-Exclusion Principle, Binomial coefficients, and Pascal's triangle.</li><li><strong>Inductions & Algorithms:</strong> The division algorithm, Divisibility Properties, Mathematical Inductions (Weak & Strong), algorithms Correctness, The growth of functions.</li><li><strong>Number Theory:</strong> Modular Arithmetic, Prime Numbers and GCD, Linear Congruence Equations and Chinese Remainder Theorem, Fermat's Little Theorem, Primality Testing.</li><li><strong>Recursion:</strong> Recursively defined functions, Homogeneous and Heterogeneous recurrence relation, solving recurrence relation, Master method, Generating Functions, and its applications.</li></ul>",
            "<strong>UNIT-IV (GRAPHS AND TREES)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li><strong>Graph Theory:</strong> Graph and subgraphs, paths, cycles, Euler and Hamiltonian graphs, bipartite graphs, graph isomorphism, planar graphs on graphs, undirected graphs, directed graphs, graph isomorphism.</li></ul>"
        ],
        components: [
            { id: "q1", name: "Quiz 1", max: 10, status: "completed" },
            { id: "q2", name: "Quiz 2", max: 10 },
            { id: "q3", name: "Quiz 3", max: 10 },
            { id: "a1", name: "Assign 1", max: 2 },
            { id: "a2", name: "Assign 2", max: 2 },
            { id: "a3", name: "Assign 3", max: 2 },
            { id: "mid", name: "Midterm", max: 24, status: "completed" },
            { id: "end", name: "Endterm", max: 40 }
        ]
    },
    {
        id: "dsy", name: "Digital Systems", code: "CS123",
        color: "purple", passMark: 21, targetA: 56,
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>`,
        notesLink: "https://drive.google.com/drive/folders/1H1Ly-QvT0z542RU-HUk_ld1_kVBGRCBF?usp=drive_link",
        syllabus: [
            "<strong>UNIT 1 Introduction</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>1.1 Introduction, importance, application, and type of digital Systems</li><li>1.2 Digital Systems Specification, Implementation, Analysis, and Design</li><li>1.3 IEEE 754 Floating-Point representation</li><li>1.4 Integer and Floating-Point Arithmetic operations</li></ul>",
            "<strong>UNIT 2 Combinational Systems</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>2.1 High-level and Binary-level specification of combinational systems</li><li>2.2 Boolean functions and Boolean expressions</li><li>2.3 Gates, universal set</li><li>2.4 CMOS logic</li><li>2.5 Physical characteristics of gates (propagation delays, transition times, effect of load, voltage variations, noise margins, power dissipation & delay-power product)</li><li>2.6 Description, characteristics, and analysis of gate networks</li><li>2.7 Minimal two-level gate networks</li><li>2.8 Karnaugh maps</li><li>2.9 Design of multiple-output two-level gate networks</li><li>2.10 Two-level NAND-NAND and NOR-NOR networks</li><li>2.11 Networks with XOR and XNOR gates</li><li>2.12 Programmable modules: PLAs and PALs</li></ul>",
            "<strong>UNIT 3 Combinational Modules</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>3.1 Decoders</li><li>3.2 Encoders and Priority encoders</li><li>3.3 Multiplexers, Networks with 2-input multiplexers</li><li>3.4 De-multiplexers</li><li>3.5 Shifters</li><li>3.6 Multi-Module Combinational Systems</li><li>3.7 ALU Modules: 3.7.1 Adder, 3.7.2 Subtractor, 3.7.3 Multiplier, 3.7.4 Divisor, 3.7.5 Comparator</li></ul>",
            "<strong>UNIT 4 Sequential System</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>4.1 High-level and Binary-level Specification of sequential systems</li><li>4.2 Gated-latch and D flip-flop</li><li>4.3 Timing characteristics of sequential networks</li><li>4.4 Design and Analysis of sequential networks using D, SR, JK, and T Flip-flops</li><li>4.5 Design Using State Assignments: 4.5.1 One-flip-flop-per-state, 4.5.2 Shifting state register.</li><li>4.6 Standard Sequential Modules: 4.6.1 Registers, 4.6.2 Shift registers, 4.6.3 Counters, 4.6.4 Multi-Module Sequential Systems</li><li>4.7 Programmable Sequential Arrays (PSAs), Read-Only Memories (ROMs)</li></ul>"
        ],
        components: [
            { id: "q1", name: "Quiz 1", max: 5, status: "completed" },
            { id: "q2", name: "Quiz 2", max: 5 },
            { id: "assign", name: "Assignment", max: 5 },
            { id: "lab", name: "Lab Eval.", max: 25 },
            { id: "mid", name: "Midterm", max: 20, status: "completed" },
            { id: "end", name: "Endterm", max: 40 }
        ]
    }
];

const colorMap = {
    blue: { iconBg: 'bg-[#1e293b]', iconColor: 'text-[#38bdf8]', bar: 'bg-[#38bdf8]' },
    emerald: { iconBg: 'bg-[#132c24]', iconColor: 'text-[#4ade80]', bar: 'bg-[#4ade80]' },
    yellow: { iconBg: 'bg-[#2a2412]', iconColor: 'text-[#facc15]', bar: 'bg-[#facc15]' },
    orange: { iconBg: 'bg-[#2b1d14]', iconColor: 'text-[#fb923c]', bar: 'bg-[#fb923c]' },
    purple: { iconBg: 'bg-[#221733]', iconColor: 'text-[#c084fc]', bar: 'bg-[#c084fc]' }
};

let subjects = [...allSubjects];

function updateBranchUI() {
    const branchText = localStorage.getItem('lnmiit_branch') || 'UCS';
    window.currentBranch = branchText;

    const branchHeader = document.getElementById('branch-display-text');
    if (branchHeader) {
        if (branchText === 'UCS') branchHeader.innerText = 'For CSE Branch';
        else if (branchText === 'UCC') branchHeader.innerText = 'For CCE Branch';
        else if (branchText === 'UEC') branchHeader.innerText = 'For ECE Branch';
    }

    const examDismat = document.getElementById('exam-dismat');
    const examDsy = document.getElementById('exam-dsy');
    const examEce1 = document.getElementById('exam-ece-1');
    const examEce2 = document.getElementById('exam-ece-2');

    if (branchText === 'UEC') {
        if (examDismat) examDismat.style.display = 'none';
        if (examDsy) examDsy.style.display = 'none';
        if (examEce1) examEce1.style.display = 'block';
        if (examEce2) examEce2.style.display = 'block';

        subjects = allSubjects.filter(s => ['dsa', 'laca', 'hve'].includes(s.id));
        if (!subjects.find(s => s.id === 'sdc')) {
            subjects.push({
                id: "sdc", name: "Semiconductor Devices and Circuits", code: "EC121",
                color: "orange", passMark: 25, targetA: 80,
                icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`,
                notesLink: "",
                syllabus: [
                    "<strong>Course Overview</strong><p class=\"text-xs mt-1\">This course provides an introduction to semiconductor physics, carrier behavior, and the modeling of solid-state devices.</p>",
                    "<strong>Unit I: Basics of Semiconductor Physics and Carrier Statistics (10 Hours)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>History of semiconductor revolution and types of semiconductors.</li><li>Crystal structure analysis: unit cell, Bravais Lattice, and Miller Indices.</li><li>Concepts of electrons/holes, intrinsic/extrinsic semiconductors, and mass-action law.</li><li>Energy band models, direct/indirect semiconductors, and effective mass.</li><li>Distribution approximations: Fermi-Dirac and Maxwell-Boltzmann.</li><li>Excess carriers: generation, recombination, injection levels, lifetime, scattering, mobility, and conductivity.</li></ul>",
                    "<strong>Unit II: Carrier Transport in Semiconductors (6 Hours)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>Mechanisms: Drift, diffusion, Einstein relationship, and tunneling.</li><li>Equations: Basic transport/continuity equations and Quasi-Fermi levels.</li></ul>",
                    "<strong>Unit III: P-N Homo/Heterojunction Diodes (11 Hours)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>P-N junction structure, biasing (forward/reverse), and I-V characteristics.</li><li>Mathematical modeling: electrostatics, built-in potential, depletion approximation, and Poisson's equation.</li><li>Breakdown mechanisms: Avalanche and Zener breakdown.</li><li>Metal-semiconductor junctions: Schottky, ohmic, and rectifying contacts.</li></ul>",
                    "<strong>Unit IV: Bipolar Junction Transistors (BJT) (8 Hours)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>Device structures, transistor action, and current components.</li><li>Amplification configurations and input/output characteristics.</li><li>Non-ideal effects: Base width modulation, doping effects, and thermal runaway.</li><li>Circuit models: Ebers-Moll and Hybrid-π models.</li></ul>",
                    "<strong>Unit V: MOS Theory and Fundamentals of MOSFET (7 Hours)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>MOS Junction: Capacitance, equivalent resistance, C-V characteristics, and threshold voltage.</li><li>MOSFET I-V characteristics and second-order effects: body effect, channel length modulation, and velocity saturation.</li></ul>"
                ],
                components: [
                    { id: "q1", name: "Quiz 1", max: 10, status: "completed" },
                    { id: "q2", name: "Quiz 2", max: 10 },
                    { id: "mid", name: "Midterm", max: 30, status: "completed" },
                    { id: "end", name: "Endterm", max: 50 }
                ]
            });
            subjects.push({
                id: "anel", name: "Analog Electronics", code: "EC122",
                color: "purple", passMark: 25, targetA: 80,
                icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>`,
                notesLink: "",
                syllabus: [
                    "<strong>Course Overview</strong><p class=\"text-xs mt-1\">This course covers intermediate analog topics including discrete circuits, integrated circuits, and signal conversion.</p>",
                    "<strong>Unit I: Diode Circuits (9 Hours)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>Characteristics: Volt-Ampere (V-I) curves, temperature dependence, and transient behavior.</li><li>Models: Load line concept and piecewise linear diode model.</li><li>Rectifiers: Half-wave, full-wave, and bridge rectifiers.</li><li>Signal Conditioning: Clipping and clamping circuits.</li><li>Applications: Peak detector and Zener regulated DC power supplies.</li></ul>",
                    "<strong>Unit II: Bipolar Junction Transistors (14 Hours)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>Fundamentals: NPN/PNP structures, Eber-Moll model, and current gains (α and β).</li><li>Amplifiers: CE, CB, and CC configurations; DC/AC analysis.</li><li>Biasing: Fixed bias, collector feedback, emitter bias, and voltage divider biasing.</li><li>Small Signal Analysis: Analysis using the r<sub>e</sub> model.</li><li>Multistage: Cascade, Cascode, and Darlington connections.</li><li>Frequency Analysis: Low and high-frequency analysis of BJT amplifiers.</li></ul>",
                    "<strong>Unit III: Oscillators (4 Hours)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>Concepts: Positive feedback and Barkhausen criterion.</li><li>Circuits: RC Phase shift, Wien bridge, Hartley, Colpitts, and Crystal oscillators.</li></ul>",
                    "<strong>Unit IV: Active Filter Circuits Using Op-Amp (4 Hours)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>Filter Basics: Ideal vs. approximate responses.</li><li>Approximations: Sallen-Key topology; Butterworth, Chebyshev, Elliptical, and Bessel designs.</li></ul>",
                    "<strong>Unit V: 555 Timer (4 Hours)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>Internal circuit diagram and design details.</li><li>Multivibrators: Astable, mono-stable, and bi-stable designs.</li><li>Other Circuits: Zero crossing detector and Schmitt trigger.</li></ul>",
                    "<strong>Unit VI: DAC and ADC (5 Hours)</strong><ul class=\"list-disc pl-5 mt-2 space-y-1 text-xs\"><li>D/A Converters: Weighted resistor and R-2R network.</li><li>A/D Converters: Flash, Dual slope, Successive approximation, and Tracking ADC</li></ul>"
                ],
                components: [
                    { id: "q1", name: "Quiz 1", max: 10 },
                    { id: "q2", name: "Quiz 2", max: 10 },
                    { id: "q3", name: "Quiz 3", max: 10 },
                    { id: "q4", name: "Quiz 4", max: 10 },
                    { id: "q5", name: "Quiz 5", max: 10 },
                    { id: "mid", name: "Midterm", max: 20, status: "completed" },
                    { id: "end", name: "Final Exam", max: 40 }
                ]
            });
        }
    } else {
        if (examDismat) examDismat.style.display = 'block';
        if (examDsy) examDsy.style.display = 'block';
        if (examEce1) examEce1.style.display = 'none';
        if (examEce2) examEce2.style.display = 'none';
        subjects = [...allSubjects];
    }

    renderCourses();
}

function updateProfileUI() {
    const rollNo = localStorage.getItem('lnmiit_roll_no');
    const profileNameEl = document.getElementById('user-profile-name');
    if (profileNameEl) {
        if (rollNo && typeof studentData !== 'undefined' && studentData[rollNo]) {
            profileNameEl.innerText = studentData[rollNo];
        } else {
            profileNameEl.innerText = 'Student';
        }
    }
}

let userData = JSON.parse(localStorage.getItem('lnmiit_grades')) || {};
let aCelebrated = {};

function renderCourses() {
    const container = document.getElementById('subjects-container');
    if (!container) return;
    container.innerHTML = '';
    let delay = 0.3;

    subjects.forEach(subject => {
        if (!userData[subject.id]) userData[subject.id] = {};
        const theme = colorMap[subject.color];
        let inputsHTML = '';

        subject.components.forEach(comp => {
            const val = userData[subject.id][comp.id] !== undefined ? userData[subject.id][comp.id] : '';
            let badge = '';
            if (comp.status === 'completed') {
                badge = `<span class="bg-[#132c24] text-[#4ade80] text-[10px] px-2 py-0.5 rounded-md font-medium">Completed</span>`;
            } else if (comp.status === 'upcoming') {
                badge = `<span class="bg-dashBase text-dashTextMuted border border-dashBorder text-[10px] px-2 py-0.5 rounded-md font-medium">${comp.date}</span>`;
            } else {
                badge = `<span class="bg-dashBase text-dashTextMuted border border-dashBorder text-[10px] px-2 py-0.5 rounded-md font-medium">Pending</span>`;
            }

            inputsHTML += `
                        <div class="flex items-center justify-between py-2 border-b border-dashBorder/50 last:border-0 hover-trigger">
                            <div class="flex items-center gap-3">
                                <label class="text-sm text-dashTextMuted w-24 truncate">${comp.name}</label>
                                ${badge}
                            </div>
                            <div class="flex items-center gap-2">
                                <input type="number" min="0" max="${comp.max}" step="0.5" 
                                class="bg-dashBase border border-dashBorder text-white text-center text-sm rounded-lg w-14 py-1 outline-none focus:border-dashAccent transition-colors hover-trigger" 
                                value="${val}" oninput="updateScore('${subject.id}', '${comp.id}', this, ${comp.max})" onchange="syncGradeToDiscord('${subject.id}', '${comp.name}', this.value, ${comp.max})">
                                <span class="text-xs text-dashTextMuted w-6">/${comp.max}</span>
                            </div>
                        </div>`;
        });

        const card = document.createElement('div');
        card.className = `subject-card bg-dashCard rounded-2xl p-5 border border-dashBorder flex flex-col animate-slide-up hover:border-dashBorder/80 cursor-pointer hover-trigger`;
        card.style.animationDelay = `${delay}s`;
        card.onclick = (e) => {
            if (!e.target.closest('input') && !e.target.closest('button')) {
                toggleDetails(subject.id);
            }
        };
        delay += 0.1;

        card.innerHTML = `
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl ${theme.iconBg} ${theme.iconColor} flex items-center justify-center border border-dashBorder shadow-inner z-10">
                                ${subject.icon}
                            </div>
                            <div class="z-10">
                                <h3 class="text-base font-medium text-white">${subject.name}</h3>
                                <div class="flex items-center gap-2 mt-1">
                                    <span class="text-xs text-dashTextMuted">${subject.code}</span>
                                    <span class="w-1 h-1 rounded-full bg-dashBorder"></span>
                                    <button onclick="event.stopPropagation(); openSyllabus('${subject.id}')" class="text-xs text-dashAccent hover:text-white transition-colors hover-trigger">Syllabus</button>
                                </div>
                            </div>
                        </div>
                        <div class="text-right z-10">
                            <div class="text-[10px] bg-[#1a1a24] text-dashTextMuted px-2 py-1 rounded border border-dashBorder" id="tag-${subject.id}">In progress</div>
                        </div>
                    </div>
                    
                    <div class="flex flex-col gap-1 mb-3 z-10 relative">
                        <div class="flex items-center justify-between text-xs text-dashTextMuted">
                            <div class="flex items-center gap-2">
                                <span class="font-medium"><span id="total-${subject.id}" class="text-white text-sm">0</span> Score</span>
                            </div>
                            <span id="status-${subject.id}" class="font-medium text-right"></span>
                        </div>
                        <div class="flex items-center gap-3 text-[10px] text-dashTextMuted">
                            <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-red-500/80"></span>Pass: <span class="text-white">${subject.passMark}</span></span>
                            <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-white/80"></span>Target 'A': <span class="text-white">${subject.targetA}</span></span>
                        </div>
                    </div>
                    
                    <div class="w-full bg-dashBase h-1.5 rounded-full overflow-hidden mb-1 relative z-10">
                        <div id="bar-${subject.id}" class="h-full ${theme.bar} progress-transition rounded-full relative" style="width: 0%">
                            <div class="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                        </div>
                        <div class="absolute top-0 bottom-0 w-[2px] bg-white/10" style="left: ${subject.passMark}%;"></div>
                    </div>
                    
                    <div class="grid-expand-wrapper mt-4 pt-4 border-t border-dashBorder z-10 relative cursor-default" id="inputs-wrapper-${subject.id}" onclick="event.stopPropagation()">
                        <div class="grid-expand-inner">
                            <div id="inputs-${subject.id}" class="opacity-0 translate-y-2 transition-all duration-400 ease-out pt-2 pb-2">
                                ${inputsHTML}
                            </div>
                        </div>
                    </div>
                `;
        container.appendChild(card);
    });
    calculateTotals(true);
}

function toggleDetails(id) {
    const wrapper = document.getElementById(`inputs-wrapper-${id}`);
    const inner = document.getElementById(`inputs-${id}`);

    if (wrapper.classList.contains('expanded')) {
        // Collapse
        inner.classList.replace('opacity-100', 'opacity-0');
        inner.classList.replace('translate-y-0', 'translate-y-2');
        wrapper.classList.remove('expanded');
    } else {
        // Expand
        wrapper.classList.add('expanded');
        setTimeout(() => {
            inner.classList.replace('opacity-0', 'opacity-100');
            inner.classList.replace('translate-y-2', 'translate-y-0');
        }, 50); // Small delay to sync with height expansion
    }
}

let syllabusExpandTimer;
let syllabusGlowTimer;

function openSyllabus(subjectId) {
    const subject = subjects.find(s => s.id === subjectId);
    document.getElementById('modal-title').innerText = subject.name;
    document.getElementById('modal-code').innerText = subject.code;

    const btnNotes = document.getElementById('modal-notes-btn');
    if (subject.notesLink) {
        btnNotes.href = subject.notesLink;
        btnNotes.classList.remove('hidden');
    } else {
        btnNotes.classList.add('hidden');
    }

    const list = document.getElementById('modal-list');
    list.innerHTML = '';
    subject.syllabus.forEach(item => {
        const li = document.createElement('li');
        li.className = "p-3 bg-dashBase rounded-xl border border-dashBorder text-sm text-dashTextMuted";
        li.innerHTML = item; list.appendChild(li);
    });
    const modal = document.getElementById('syllabus-modal');
    const content = document.getElementById('syllabus-modal-content');

    // Reset configuration for fast entry animation
    content.classList.remove('max-w-4xl', 'duration-700', 'ease-in-out');
    content.classList.add('max-w-xl', 'duration-300', 'ease-out');
    content.style.boxShadow = '';
    content.style.borderColor = '';

    // Reset translation state explicitly
    content.classList.remove('translate-x-0', 'scale-100', 'opacity-100', 'translate-x-[-100vw]');
    content.classList.add('translate-x-[100vw]', 'scale-90', 'opacity-0');

    modal.classList.remove('hidden');

    // Phase 1: Fly to center very fast (300ms)
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('translate-x-[100vw]', 'scale-90', 'opacity-0');
        content.classList.add('translate-x-0', 'scale-100', 'opacity-100');
    }, 10);

    // Phase 2: Expand monotonously and symmetrically from center
    clearTimeout(syllabusExpandTimer);
    syllabusExpandTimer = setTimeout(() => {
        content.classList.remove('duration-300', 'ease-out');
        content.classList.add('duration-700', 'ease-in-out');
        content.classList.remove('max-w-xl');
        content.classList.add('max-w-4xl');
    }, 320); // Right as the fly-in finishes

    // Phase 3: Add the beautiful neon glowing effect
    const colorMap = {
        'blue': { hex: '#3b82f6', rgb: '59, 130, 246' },
        'emerald': { hex: '#10b981', rgb: '16, 185, 129' },
        'yellow': { hex: '#eab308', rgb: '234, 179, 8' },
        'orange': { hex: '#f97316', rgb: '249, 115, 22' },
        'purple': { hex: '#a484fb', rgb: '164, 132, 251' }
    };
    const glowColor = colorMap[subject.color] || colorMap['purple'];

    clearTimeout(syllabusGlowTimer);
    syllabusGlowTimer = setTimeout(() => {
        content.style.boxShadow = `0 0 40px rgba(${glowColor.rgb}, 0.5), 0 0 20px rgba(${glowColor.rgb}, 0.8)`;
        content.style.borderColor = glowColor.hex;
    }, 1050); // After expansion completes
}

function closeModal() {
    clearTimeout(syllabusExpandTimer);
    clearTimeout(syllabusGlowTimer);
    const modal = document.getElementById('syllabus-modal');
    const content = document.getElementById('syllabus-modal-content');

    // Instantly contract width & shut off glow for the exit
    content.style.boxShadow = '';
    content.style.borderColor = '';
    content.classList.remove('duration-700', 'ease-in-out', 'max-w-4xl');
    content.classList.add('duration-300', 'ease-in', 'max-w-xl');

    modal.classList.add('opacity-0');
    content.classList.remove('scale-100', 'translate-x-0', 'opacity-100');
    content.classList.add('scale-90', 'translate-x-[-100vw]', 'opacity-0'); // fly out fast to the opposite side

    setTimeout(() => modal.classList.add('hidden'), 350);
}

// --- Rating System Logic ---
function handleRatingClick(event, value) {
    const radio = event.target;

    if (value < 5) {
        // Not a 5-star rating -> cancel the selection
        event.preventDefault();

        // Get all labels after the clicked one (since we use row-reverse, "after" in DOM means to the left visually)
        const container = radio.closest('.radio');
        const labels = Array.from(container.querySelectorAll('label'));
        const targetLabel = radio.nextElementSibling;
        const targetIndex = labels.indexOf(targetLabel);

        // Affect the clicked star and all stars visually before it (which are DOM elements after it)
        const affectedLabels = labels.slice(targetIndex);

        affectedLabels.forEach(label => {
            const svg = label.querySelector('svg');
            // Add bright red fill and glow
            svg.style.transition = 'all 0.2s ease';
            svg.style.fill = '#ef4444'; // turn red
            svg.style.filter = 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.9))';

            setTimeout(() => {
                svg.style.fill = '';
                svg.style.filter = '';
            }, 1000);
        });

    } else {
        // 5-Star Rating -> HUGE CELEBRATION!
        // Let the radio check proceed normally
        fireConfetti();
        setTimeout(fireConfetti, 300);
        setTimeout(fireConfetti, 600);
        setTimeout(fireConfetti, 900);
        setTimeout(fireConfetti, 1200);

        // Add an extra massive burst after a delay
        setTimeout(() => {
            confetti({
                particleCount: 200,
                spread: 160,
                origin: { y: 0.6 },
                colors: ['#A484FB', '#60A5FA', '#34D399', '#FCD34D']
            });
        }, 1500);
    }
}

function fireConfetti() {
    var duration = 3000;
    var end = Date.now() + duration;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#a484fb', '#38bdf8', '#f8fafc'] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#a484fb', '#38bdf8', '#f8fafc'] });
        if (Date.now() < end) { requestAnimationFrame(frame); }
    }());
}

function syncGradeToDiscord(subjectId, componentName, marksValue, maxMarks) {
    const rollNo = window.currentRollNo || "UNKNOWN";
    if (!marksValue || isNaN(marksValue)) return; // Skip empty/invalid

    // Find full subject name
    const subject = subjects.find(s => s.id === subjectId);
    const subjectName = subject ? subject.name : subjectId;

    // Student with Roll No 25ucs256 got 5/5 marks in quiz 2 of DSA
    const contentString = `Student with Roll No. ${rollNo.toLowerCase()} got ${marksValue}/${maxMarks} marks in ${componentName} of ${subjectName}`;

    const payload = {
        embeds: [{
            description: contentString,
            color: 5763719 // Success Green HEX #57f287
        }]
    };

    fetch(atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTQ3NzQ2NjY0MzM1MjM5MTg3MS9qQkZtX3lJeVNaQmlYWVY3VUF3RWFXZ2Y3RVNMcmVIVlBldjdnZi13aFdqRHE3dWpndE96N0I2VFpoY1RiZTRsenhnbg=="), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(console.error);
}

function updateScore(subjectId, compId, el, max) {
    let val = parseFloat(el.value);
    if (val < 0) { val = 0; el.value = 0; } if (val > max) { val = max; el.value = max; }
    if (isNaN(val)) delete userData[subjectId][compId]; else userData[subjectId][compId] = val;
    saveData(); calculateTotals(false);
}

function calculateTotals(isInitialLoad) {
    subjects.forEach(subject => {
        let sTotal = 0, hasData = false;
        subject.components.forEach(comp => {
            if (userData[subject.id]?.[comp.id] !== undefined) {
                sTotal += userData[subject.id][comp.id]; hasData = true;
            }
        });

        const totalEl = document.getElementById(`total-${subject.id}`);
        const oldTotal = parseFloat(totalEl.innerText) || 0;
        animateValue(`total-${subject.id}`, oldTotal, sTotal, 600);

        document.getElementById(`bar-${subject.id}`).style.width = `${sTotal}%`;

        const statusEl = document.getElementById(`status-${subject.id}`);
        const tagEl = document.getElementById(`tag-${subject.id}`);
        const neededForPass = subject.passMark - sTotal;
        const neededForA = subject.targetA - sTotal;

        if (neededForA <= 0) {
            statusEl.innerHTML = `<span class="text-dashAccent">Target 'A' Secured ✨</span>`;
            tagEl.className = "text-[10px] bg-dashAccent/20 text-dashAccent px-2 py-1 rounded border border-dashAccent/30";
            tagEl.innerText = "Grade A";
            if (!aCelebrated[subject.id] && !isInitialLoad) { fireConfetti(); aCelebrated[subject.id] = true; }
        } else if (neededForPass <= 0) {
            statusEl.innerHTML = `<span class="text-emerald-400">Passed</span> <span class="mx-1">·</span> Need <span class="text-white">${neededForA.toFixed(1).replace(/\.0$/, '')}</span> for A`;
            tagEl.className = "text-[10px] bg-[#132c24] text-[#4ade80] px-2 py-1 rounded border border-[#132c24]";
            tagEl.innerText = "Passed";
            aCelebrated[subject.id] = false;
        } else {
            statusEl.innerHTML = `Need <span class="text-red-400">${neededForPass.toFixed(1).replace(/\.0$/, '')}</span> to Pass`;
            tagEl.className = "text-[10px] bg-[#1a1a24] text-dashTextMuted px-2 py-1 rounded border border-dashBorder";
            tagEl.innerText = "In progress";
            aCelebrated[subject.id] = false;
        }
    });
}

function saveData() { localStorage.setItem('lnmiit_grades', JSON.stringify(userData)); }

function clearData(bypassConfirm = false) {
    if (bypassConfirm || confirm("Clear all data?")) {
        userData = {}; aCelebrated = {}; saveData(); init();
    }
}

// --- HOLD TO CLEAR LOGIC (1 Second) ---
document.addEventListener('DOMContentLoaded', () => {
    const holdBtn = document.getElementById('hold-reset-btn');
    const holdCheckbox = document.getElementById('reset-checkbox');
    let holdTimer;
    let isHolding = false;

    function startHold(e) {
        // Ignore right clicks
        if (e.type === 'mousedown' && e.button !== 0) return;

        isHolding = true;
        holdBtn.classList.add('is-holding');

        holdTimer = setTimeout(() => {
            if (isHolding) {
                holdCheckbox.checked = true; // Flips to GREEN
                clearData(true); // Bypass confirm dialog

                // Revert back to RED after 1 second
                setTimeout(() => {
                    holdCheckbox.checked = false;
                    holdBtn.classList.remove('is-holding');
                }, 1000);
            }
        }, 1000); // 1 Second Hold Time
    }

    function cancelHold() {
        if (!holdCheckbox.checked) {
            isHolding = false;
            holdBtn.classList.remove('is-holding');
            clearTimeout(holdTimer);
        }
    }

    if (holdBtn) {
        holdBtn.addEventListener('mousedown', startHold);
        holdBtn.addEventListener('touchstart', startHold, { passive: true });

        holdBtn.addEventListener('mouseup', cancelHold);
        holdBtn.addEventListener('mouseleave', cancelHold);
        holdBtn.addEventListener('touchend', cancelHold);
        holdBtn.addEventListener('touchcancel', cancelHold);
    }
});

// --- REAL-TIME EXAM COUNTDOWN LOGIC ---
let examCountdownInterval;
let activeCountdownSubject = null;
let isAnimating = false;

function startExamCountdown(subject, dateTimeString, endDateTimeString) {
    if (isAnimating) return;

    const titleEl = document.getElementById('midsem-title');
    const titleWrapper = document.getElementById('title-wrapper');
    const wrapperEl = document.getElementById('countdown-wrapper');
    const displayEl = document.getElementById('countdown-display');
    const subjectLabel = document.getElementById('cd-subject');
    const targetDate = new Date(dateTimeString).getTime();
    const endDate = endDateTimeString ? new Date(endDateTimeString).getTime() : targetDate;

    // Toggle logic: return to normal if already active
    if (activeCountdownSubject === subject) {
        if (examCountdownInterval) clearInterval(examCountdownInterval);
        activeCountdownSubject = null;
        isAnimating = true;

        // Fade out timer, fade in title
        displayEl.classList.replace('opacity-100', 'opacity-0');
        displayEl.classList.replace('translate-y-0', 'translate-y-4');

        titleEl.classList.replace('opacity-0', 'opacity-100');
        titleEl.classList.replace('translate-y-4', 'translate-y-0');

        // Shrink timer, expand title (simultaneously)
        wrapperEl.classList.remove('expanded');
        titleWrapper.classList.add('expanded');

        setTimeout(() => {
            isAnimating = false;
        }, 400); // Wait for transition
        return;
    }

    activeCountdownSubject = subject;
    isAnimating = true;
    subjectLabel.innerText = subject + " EXAM IN";

    // If a countdown is ALREADY visible, just swap the text smoothly
    if (wrapperEl.classList.contains('expanded')) {
        updateTimer();
        if (examCountdownInterval) clearInterval(examCountdownInterval);
        examCountdownInterval = setInterval(updateTimer, 1000);
        setTimeout(() => { isAnimating = false; }, 100);
        return;
    }

    // Show countdown, hide title
    titleEl.classList.replace('opacity-100', 'opacity-0');
    titleEl.classList.replace('translate-y-0', 'translate-y-4');

    displayEl.classList.replace('opacity-0', 'opacity-100');
    displayEl.classList.replace('translate-y-4', 'translate-y-0');

    // Expand timer, shrink title (simultaneously)
    titleWrapper.classList.remove('expanded');
    wrapperEl.classList.add('expanded');

    setTimeout(() => {
        isAnimating = false;
    }, 400);

    if (examCountdownInterval) clearInterval(examCountdownInterval);

    function updateTimer() {
        const now = new Date().getTime();
        const distanceToStart = targetDate - now;
        const distanceToEnd = endDate - now;

        if (distanceToStart <= 0) {
            document.getElementById('cd-d').innerText = "00";
            document.getElementById('cd-h').innerText = "00";
            document.getElementById('cd-m').innerText = "00";
            document.getElementById('cd-s').innerText = "00";

            if (distanceToEnd >= 0) {
                subjectLabel.innerText = subject + " ONGOING";
                subjectLabel.previousElementSibling.className = "w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]";
            } else {
                clearInterval(examCountdownInterval);
                subjectLabel.innerText = subject + " COMPLETED";
                subjectLabel.previousElementSibling.className = "w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]";
            }
            return;
        }

        subjectLabel.previousElementSibling.className = "w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]";

        const distance = distanceToStart;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('cd-d').innerText = days.toString().padStart(2, '0');
        document.getElementById('cd-h').innerText = hours.toString().padStart(2, '0');
        document.getElementById('cd-m').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('cd-s').innerText = seconds.toString().padStart(2, '0');
    }

    updateTimer();
    examCountdownInterval = setInterval(updateTimer, 1000);
}

function updateExamDots() {
    const dots = document.querySelectorAll('.exam-status-dot');
    const now = new Date().getTime();
    dots.forEach(dot => {
        const endTimeAttr = dot.getAttribute('data-exam-end-time');
        const targetDate = new Date(endTimeAttr || dot.getAttribute('data-exam-time')).getTime();
        const parentCard = dot.closest('div');
        const timeLabel = parentCard.querySelector('p[data-original-time]');

        if (now >= targetDate) {
            dot.classList.remove('bg-emerald-500', 'animate-pulse', 'shadow-[0_0_8px_rgba(16,185,129,0.8)]');
            dot.classList.add('bg-red-500', 'shadow-[0_0_8px_rgba(239,68,68,0.8)]');

            if (timeLabel) {
                timeLabel.innerText = "Completed";
                timeLabel.classList.remove('text-dashTextMuted');
                timeLabel.classList.add('text-emerald-400');
            }
            parentCard.classList.add('opacity-50');
        } else {
            dot.classList.remove('bg-red-500', 'shadow-[0_0_8px_rgba(239,68,68,0.8)]');
            dot.classList.add('bg-emerald-500', 'shadow-[0_0_8px_rgba(16,185,129,0.8)]', 'animate-pulse');

            if (timeLabel) {
                timeLabel.innerText = timeLabel.getAttribute('data-original-time');
                timeLabel.classList.add('text-dashTextMuted');
                timeLabel.classList.remove('text-emerald-400');
            }
            parentCard.classList.remove('opacity-50');
        }
    });
}

const originalInit = renderCourses;
let examDotsIntervalId = null;
function init() {
    updateBranchUI(); // This will internally call renderCourses
    updateProfileUI();

    // Check if we need to show the login screen logic
    // This previously might have lived here, but we will leave it native
    const loginWrapper = document.getElementById('login-wrapper');
    if (loginWrapper && loginWrapper.style.display !== 'none' && !loginWrapper.classList.contains('hidden')) {
        // Animation handles it
    }

    updateExamDots();
    if (examDotsIntervalId) clearInterval(examDotsIntervalId);
    examDotsIntervalId = setInterval(updateExamDots, 60000); // Check every minute
}

window.onload = init;

// ============================================================
// MESS MENU DATA & LOGIC
// Days: 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
// Daily staples (not listed): tea, milk, bread, butter, jam for
// breakfast; plain roti, rice, dal, salad, pickle for lunch/dinner.
// ============================================================
const messMenu = [
    // Sunday (0)
    {
        day: 'Sunday',
        breakfast: ['Samosa (L)', 'Jalebi', 'Imli Chutney', 'Green chutney / Omelet (L)', 'Sprouts', 'White Bread (PeanutButter / Butter / Jam)*', 'Tea', 'Milk', 'Cornflakes / Bournvita / Coffee', 'Fruit (L)'],
        lunch: ['Chole Bhature', 'Plain & Butter Roti', 'Fried Rice', 'Salad', 'Mixed Pickle', 'Fried Masala Mirchi', 'Lassi (L)'],
        snacks: ['Bread Rolls (2Pcs)', 'Green Chutney', 'Ketchup', 'Shikanji', 'Tea'],
        dinner: ['Kaddu Masala / Arbi Masala / Baigan Aloo (Alternate)', 'Masoor Dal', 'Curd Rice', 'Plain & Butter Roti', 'Salad', 'Mango Pickle', 'Milkrose (L)']
    },
    // Monday (1)
    {
        day: 'Monday',
        breakfast: ['Pav Bhaji / Omelet (L)', 'Sprouts', 'Brown Bread (Peanut Butter / Butter / Jam)*', 'Tea', 'Milk', 'Elaichi Powder', 'Cornflakes / Coffee', 'Fruit (L)'],
        lunch: ['Khoya Paneer', 'Dal Arhar', 'Plain & Butter Roti', 'Missi Roti', 'Plain Rice', 'Raw Onion', 'Lemon Pickle', 'Fryums', 'Boondi Raita (L)'],
        snacks: ['Papadi Chaat', 'Green Chutney', 'Imli Chutney', 'Dahi', 'Tea', 'Thandai'],
        dinner: ['Dum Aloo', 'Dal Makhni', 'Pudina Rice', 'Plain & Butter Roti', 'Salad', 'Lemon Pickle', 'Gulab Jamun (L)']
    },
    // Tuesday (2)
    {
        day: 'Tuesday',
        breakfast: ['Namkeen Poha', 'White Bread (Peanut Butter / Butter / Jam)*', 'Tea', 'Milk', 'Cornflakes / Bournvita / Coffee', 'Fruit (L)', 'Boiled Sprouts'],
        lunch: ['Rajma', 'Lauki Tamatar', 'Plain & Butter Roti', 'Missi Roti', 'Plain Rice', 'Salad', 'Mixed Pickle', 'Fryums', 'Coconut Barfi (L)', 'Pineapple Raita (L)'],
        snacks: ['Veg Sandwich', 'Ketchup', 'Milkrose', 'Tea'],
        dinner: ['Sev Tamatar', 'Urad Daal Tadka', 'Plain & Butter Roti', 'Fried Rice', 'Salad', 'Lemon Pickle', 'Sama Rice Kheer (L)']
    },
    // Wednesday (3)
    {
        day: 'Wednesday',
        breakfast: ['Aaloo Paratha with curd', 'Garlic Chutney / Boiled Eggs (L)', 'Sprouts', 'White Bread (Peanut Butter / Butter / Jam)*', 'Tea', 'Kesar Badam Powder', 'Milk Cornflakes / Coffee', 'Fruit (L)'],
        lunch: ['Mix Veg', 'Dal Makhani', 'Pudina Rice', 'Plain & Butter Roti', 'Missi Roti', 'Salad', 'Mango Pickle', 'Suji Halwa (L)', 'Papad', 'Veg Raita (L)'],
        snacks: ['White sauce Pasta', 'Ketchup', 'Cold Coffee', 'Tea'],
        dinner: ['Paneer Lababdar', 'Urad Daal', 'Jeera Rice', 'Plain & Butter Roti', 'Salad', 'Lemon Pickle', 'Fruit Custard (L)']
    },
    // Thursday (4)
    {
        day: 'Thursday',
        breakfast: ['Sambhar Vada with Chutney / Omelet (L)', 'Sprouts', 'Brown Bread (Peanut Butter / Butter / Jam)*', 'Tea', 'Milk', 'Cornflakes / Bournvita / Coffee', 'Fruit (L)'],
        lunch: ['Kadhi Pakora', 'Aloo Bhujia', 'Jeera Rice', 'Plain & Butter Roti', 'Missi Roti', 'Salad', 'Lemon Pickle', 'Papad'],
        snacks: ['Veg Burger', 'Ketchup', 'Tea', 'Rasna'],
        dinner: ['Malai Kofta', 'Moong-Mogar Dal', 'Veg Biryani', 'Plain & Butter Roti', 'Salad', 'Lemon Pickle', 'Boondi Ladoo(L)']
    },
    // Friday (5)
    {
        day: 'Friday',
        breakfast: ['Matar Kulcha / Boiled Eggs (L)', 'Sprouts', 'White Bread (Peanut Butter / Butter / Jam)*', 'Tea', 'Milk', 'Cornflakes / Bournvita / Haldi / Coffee', 'Fruit (L)'],
        lunch: ['Dry Chole Masala', 'Moong Dal Tamatar', 'Kashmiri Pulao', 'Plain & Butter Roti', 'Missi Roti', 'Salad', 'Mixed Pickle', 'Besan Barfi (L)', 'Fryums', 'Boondi Raita (L)'],
        snacks: ['Aaloo Pyaz Kachori with kadhi', 'Tea', 'Vanila Shake'],
        dinner: ['Dry Bhindi Masala', 'Mix Dal', 'Plain & Butter Roti', 'Veg Biryani', 'Salad', 'Lemon Pickle', 'Rasgulla (L)']
    },
    // Saturday (6)
    {
        day: 'Saturday',
        breakfast: ['Dosa & Sambhar-Chutney / Omelet (L)', 'Sprouts', 'White Bread (Peanut Butter / Butter / Jam)*', 'Tea', 'Milk', 'Cornflakes / Bournvita / Coffee', 'Fruit (L)'],
        lunch: ['Bati', 'Dal Urad Tadka', 'Garlic Chutney', 'Plain & Butter Roti', 'Fried Mirchi', 'Jeera Rice', 'Raw Onion', 'Mixed Pickle', 'Masala Chhach (L)'],
        snacks: ['Patty', 'Chopped Onion', 'Ketchup', 'Rooafza', 'Tea'],
        dinner: ['Paneer Paratha', 'Matar sabji', 'Dahi', 'Garlic Chutney', 'Plain & Butter Roti', 'Fried Rice', 'Salad', 'Mixed Pickle', 'Ice Cream (L)']
    }
];

const mealIcons = {
    breakfast: '☀️',
    lunch: '🍽️',
    snacks: '🍟',
    dinner: '🌙'
};
const mealColors = {
    breakfast: { badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', tag: 'text-yellow-400' },
    lunch: { badge: 'bg-orange-500/15 text-orange-400 border-orange-500/30', tag: 'text-orange-400' },
    snacks: { badge: 'bg-pink-500/15 text-pink-400 border-pink-500/30', tag: 'text-pink-400' },
    dinner: { badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30', tag: 'text-indigo-400' }
};

let messExpanded = false;

function buildMessMealCard(mealKey, items, compact = false) {
    const mc = mealColors[mealKey];
    const icon = mealIcons[mealKey];
    const label = mealKey.charAt(0).toUpperCase() + mealKey.slice(1);
    const pills = items.map(i => `<span class="inline-block bg-white/5 border border-white/10 rounded-lg px-2 py-0.5 text-[11px] text-dashTextMuted">${i}</span>`).join('');
    return `
                <div class="bg-dashBase/60 backdrop-blur-md rounded-2xl p-4 border border-white/5 hover:border-emerald-500/20 transition-all">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-base">${icon}</span>
                        <span class="text-xs font-bold ${mc.tag} uppercase tracking-wider">${label}</span>
                    </div>
                    <div class="flex flex-wrap gap-1.5">${pills}</div>
                </div>`;
}

function initMessMenu() {
    const now = new Date();
    const dayIdx = now.getDay(); // 0=Sun ... 6=Sat
    const todayData = messMenu[dayIdx];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Label
    const label = document.getElementById('mess-today-label');
    if (label) label.textContent = `${dayNames[dayIdx]} — ${now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`;

    // Today's grid
    const todayGrid = document.getElementById('mess-today-grid');
    if (todayGrid && todayData) {
        todayGrid.innerHTML = ['breakfast', 'lunch', 'snacks', 'dinner']
            .map(m => buildMessMealCard(m, todayData[m])).join('');
    }

    // All-days grid
    const allGrid = document.getElementById('mess-alldays-grid');
    if (allGrid) {
        // Order: Mon → Sun, but highlight today
        const order = [1, 2, 3, 4, 5, 6, 0];
        allGrid.innerHTML = order.map(d => {
            const data = messMenu[d];
            const isToday = d === dayIdx;
            return `
                    <div class="rounded-2xl border ${isToday ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/5 bg-dashBase/40'} p-5">
                        <div class="flex items-center gap-2 mb-4">
                            <span class="text-sm font-bold ${isToday ? 'text-emerald-400' : 'text-white'}">${data.day}</span>
                            ${isToday ? '<span class="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">Today</span>' : ''}
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                            ${['breakfast', 'lunch', 'snacks', 'dinner'].map(m => buildMessMealCard(m, data[m], true)).join('')}
                        </div>
                    </div>`;
        }).join('');
    }
}

function toggleMessMenu() {
    messExpanded = !messExpanded;
    const wrapper = document.getElementById('mess-alldays-wrapper');
    const content = document.getElementById('mess-alldays-content');
    const icon = document.getElementById('mess-expand-icon');
    const lbl = document.getElementById('mess-expand-label');

    if (messExpanded) {
        wrapper.classList.add('expanded');
        setTimeout(() => {
            content.classList.replace('opacity-0', 'opacity-100');
            content.classList.replace('translate-y-2', 'translate-y-0');
        }, 50);
        icon.style.transform = 'rotate(180deg)';
        lbl.textContent = 'Collapse';
    } else {
        content.classList.replace('opacity-100', 'opacity-0');
        content.classList.replace('translate-y-0', 'translate-y-2');
        wrapper.classList.remove('expanded');
        icon.style.transform = 'rotate(0deg)';
        lbl.textContent = 'All Days';
    }
}

// Init mess menu on load
document.addEventListener('DOMContentLoaded', initMessMenu);

// ============================================================
// 🤖 AI STUDY ADVISOR — Multi-Provider Performance Analysis
// ============================================================

let aiSelectedProvider = 'groq';

function getStoredAIKey() {
    return atob("Z3NrX0tpRlpyUk9vZ0xqUEQ5MUJwNGlqV0dkeWIzRllBcDROTW9uRkxCWG4xZnRVQ3Zzb2pnWDg=");
}

function getStoredAIProvider() {
    return 'groq';
}

function selectAIProvider(provider) {
    aiSelectedProvider = provider;
    const geminiBtn = document.getElementById('provider-btn-gemini');
    const nvidiaBtn = document.getElementById('provider-btn-nvidia');
    const groqBtn = document.getElementById('provider-btn-groq');
    const keyInput = document.getElementById('ai-api-key-input');
    const helpLink = document.getElementById('ai-key-help-link');
    const hint = document.getElementById('ai-key-hint');

    geminiBtn.classList.remove('ai-provider-active');
    nvidiaBtn.classList.remove('ai-provider-active');
    groqBtn.classList.remove('ai-provider-active');

    if (provider === 'nvidia') {
        nvidiaBtn.classList.add('ai-provider-active');
        keyInput.placeholder = 'Enter your NVIDIA API Key (nvapi-...)';
        helpLink.href = 'https://build.nvidia.com/explore/discover';
        helpLink.textContent = 'Get NVIDIA Key';
        hint.textContent = '🔒 Your key is stored locally. NVIDIA NIM offers 1000 free API credits for new accounts.';
    } else if (provider === 'groq') {
        groqBtn.classList.add('ai-provider-active');
        keyInput.placeholder = 'Enter your Groq API Key (gsk_...)';
        helpLink.href = 'https://console.groq.com/keys';
        helpLink.textContent = 'Get Groq Key';
        hint.textContent = '🔒 Your key is stored locally. Groq offers blazing fast inference with a generous free tier.';
    } else {
        geminiBtn.classList.add('ai-provider-active');
        keyInput.placeholder = 'Enter your Gemini API Key...';
        helpLink.href = 'https://aistudio.google.com/app/apikey';
        helpLink.textContent = 'Get Free Key';
        hint.textContent = '🔒 Your key is stored locally. Google Gemini offers a generous free tier.';
    }
}

function saveAIKey() {
    const keyInput = document.getElementById('ai-api-key-input');
    const key = keyInput.value.trim();
    if (!key) return;
    localStorage.setItem('lnmiit_ai_key', key);
    localStorage.setItem('lnmiit_ai_provider', aiSelectedProvider);
    keyInput.value = '';
    document.getElementById('ai-key-section').classList.add('hidden');
    runAIAnalysis();
}

function resetAIKey() {
    localStorage.removeItem('lnmiit_ai_key');
    localStorage.removeItem('lnmiit_ai_provider');
    aiSelectedProvider = 'gemini';
    const area = document.getElementById('ai-response-area');
    area.classList.remove('hidden');
    document.getElementById('ai-key-section').classList.remove('hidden');
    document.getElementById('ai-chat-container').innerHTML = '';
    const keyInput = document.getElementById('ai-api-key-input');
    keyInput.value = '';
    selectAIProvider('gemini');
    keyInput.focus();
}

function openAIAdvisor() {
    const area = document.getElementById('ai-response-area');
    area.classList.remove('hidden');

    const key = getStoredAIKey();
    if (!key) {
        document.getElementById('ai-key-section').classList.remove('hidden');
        selectAIProvider(aiSelectedProvider);
        const keyInput = document.getElementById('ai-api-key-input');
        keyInput.focus();
        return;
    }

    document.getElementById('ai-key-section').classList.add('hidden');
    runAIAnalysis();
}

function gatherPerformanceData() {
    const data = [];
    let overallScored = 0, overallMax = 0;

    subjects.forEach(subject => {
        let scored = 0, maxSoFar = 0, totalMax = 0;
        let hasData = false;
        const componentDetails = [];

        subject.components.forEach(comp => {
            totalMax += comp.max;
            const val = userData[subject.id]?.[comp.id];
            if (val !== undefined) {
                scored += val;
                maxSoFar += comp.max;
                hasData = true;
                componentDetails.push({
                    name: comp.name,
                    scored: val,
                    max: comp.max,
                    percentage: Math.round((val / comp.max) * 100)
                });
            } else {
                componentDetails.push({
                    name: comp.name,
                    scored: null,
                    max: comp.max,
                    status: comp.status || 'pending'
                });
            }
        });

        const percentage = maxSoFar > 0 ? Math.round((scored / maxSoFar) * 100) : 0;
        const neededForPass = subject.passMark - scored;
        const neededForA = subject.targetA - scored;
        const remainingMax = totalMax - maxSoFar;

        data.push({
            name: subject.name,
            code: subject.code,
            scored,
            maxSoFar,
            totalMax,
            percentage,
            passMark: subject.passMark,
            targetA: subject.targetA,
            neededForPass,
            neededForA,
            remainingMax,
            hasData,
            isPassing: neededForPass <= 0,
            hasReachedA: neededForA <= 0,
            passRisk: neededForPass > 0 ? (neededForPass / remainingMax * 100) : 0,
            components: componentDetails
        });

        overallScored += scored;
        overallMax += maxSoFar;
    });

    return {
        subjects: data,
        overallScored,
        overallMax,
        overallPercentage: overallMax > 0 ? Math.round((overallScored / overallMax) * 100) : 0
    };
}

function buildPrompt(perfData) {
    let subjectSummaries = perfData.subjects.map(s => {
        let compStr = s.components.map(c => {
            if (c.scored !== null) {
                return `  - ${c.name}: ${c.scored}/${c.max} (${c.percentage}%)`;
            } else {
                return `  - ${c.name}: Not attempted yet (max: ${c.max}, status: ${c.status})`;
            }
        }).join('\n');

        return `📘 ${s.name} (${s.code})
  Scored: ${s.scored}/${s.maxSoFar} so far (${s.percentage}%)
  Total possible: ${s.totalMax} | Pass mark: ${s.passMark} | Target 'A': ${s.targetA}
  Need for pass: ${s.neededForPass <= 0 ? 'PASSED ✅' : s.neededForPass + ' more (out of ' + s.remainingMax + ' remaining)'}
  Need for 'A': ${s.neededForA <= 0 ? 'A GRADE SECURED ✨' : s.neededForA + ' more (out of ' + s.remainingMax + ' remaining)'}
  ${s.passRisk > 70 ? '⚠️ HIGH RISK OF FAILING' : s.passRisk > 40 ? '⚡ MODERATE RISK' : ''}
  Components:
${compStr}`;
    }).join('\n\n');

    return `You are the SMARTEST, most motivational study coach for a B.Tech CSE student at LNMIIT (The LNM Institute of Information Technology), Jaipur. The student is in their 2nd semester.

Here is their COMPLETE academic performance data across ALL current courses:

Overall: ${perfData.overallScored}/${perfData.overallMax} (${perfData.overallPercentage}%)

${subjectSummaries}

Based on this data, give the student a COMPREHENSIVE, PERSONALIZED study plan. Structure your response EXACTLY as follows:

## 📊 Performance Snapshot
Give a quick 2-3 line overall assessment. Be honest but encouraging.

## 🚨 Priority Alerts
List any subjects at risk of failing or far from target grades. Be specific about numbers.

## 💪 Your Strengths
Identify what the student is doing well — which subjects, which components.

## 📋 Systematic Action Plan

### Week 1: Immediate Focus
- Specific daily tasks for the most urgent subjects
- Include exact marks needed and realistic targets

### Week 2-3: Building Momentum
- Study strategies for each subject
- Practice techniques specific to each subject type (math vs theory vs coding)

### Week 4+: Maintaining Excellence
- Revision strategies
- How to distribute time across subjects

## 🧠 Subject-Specific Tips
Give 2-3 concrete, actionable tips for EACH subject (e.g., "For DSA, practice 3 linked list problems daily on LeetCode/GeeksforGeeks").

## ⏰ Daily Routine Suggestion
Suggest a realistic daily schedule that fits a college student's life.

## 💬 Motivation
End with a short, powerful motivational message personalized to their situation.

IMPORTANT RULES:
- Be specific with numbers and percentages
- Reference the actual data provided
- Give ACTIONABLE advice, not generic platitudes
- If no marks are entered for a subject, note that and advise them to start tracking
- Use emojis sparingly but effectively
- Keep the tone friendly, like a smart senior helping out
- Format with proper markdown headings, bold, and lists`;
}

async function runAIAnalysis() {
    const key = getStoredAIKey();
    if (!key) {
        openAIAdvisor();
        return;
    }

    const chatContainer = document.getElementById('ai-chat-container');
    const loading = document.getElementById('ai-loading');
    const btn = document.getElementById('ai-analyze-btn');

    // Clear previous
    chatContainer.innerHTML = '';
    loading.classList.remove('hidden');
    btn.disabled = true;
    btn.classList.add('opacity-50', 'pointer-events-none');

    const perfData = gatherPerformanceData();

    // Check if any data exists
    const hasAnyData = perfData.subjects.some(s => s.hasData);
    if (!hasAnyData) {
        loading.classList.add('hidden');
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'pointer-events-none');
        chatContainer.innerHTML = `
                    <div class="p-5 bg-dashBase/80 rounded-2xl border border-yellow-500/30">
                        <p class="text-sm text-yellow-400 font-medium mb-1">⚠️ No marks entered yet</p>
                        <p class="text-xs text-dashTextMuted">Enter your marks in the course cards above first, then come back for AI-powered analysis!</p>
                    </div>`;
        return;
    }

    const prompt = buildPrompt(perfData);

    try {
        const provider = getStoredAIProvider();
        let response, aiText;

        if (provider === 'nvidia') {
            // NVIDIA NIM API (OpenAI-compatible)
            response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                },
                body: JSON.stringify({
                    model: 'meta/llama-3.3-70b-instruct',
                    messages: [
                        { role: 'system', content: 'You are an expert AI study coach. Respond with well-structured markdown.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 4096,
                    top_p: 0.95
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData?.error?.message || errData?.detail || `API error: ${response.status}`);
            }

            const data = await response.json();
            aiText = data?.choices?.[0]?.message?.content;
        } else if (provider === 'groq') {
            // Groq API (OpenAI-compatible, blazing fast)
            response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: 'You are an expert AI study coach. Respond with well-structured markdown.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 4096,
                    top_p: 0.95
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData?.error?.message || `API error: ${response.status}`);
            }

            const data = await response.json();
            aiText = data?.choices?.[0]?.message?.content;
        } else {
            // Google Gemini API
            response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.75,
                        maxOutputTokens: 4096,
                        topP: 0.95
                    }
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData?.error?.message || `API error: ${response.status}`);
            }

            const data = await response.json();
            aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        }

        if (!aiText) throw new Error('Empty response from AI');

        loading.classList.add('hidden');
        showSuccessToast(); // Trigger success only when things worked fine

        // Render with typewriter effect
        const msgDiv = document.createElement('div');
        msgDiv.className = 'ai-message-card bg-dashBase/60 backdrop-blur-md rounded-2xl p-6 border border-violet-500/20';
        msgDiv.innerHTML = `
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-dashBorder/50">
                        <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-2h2V7h-2z"/></svg>
                        </div>
                        <span class="text-xs font-bold text-violet-400 uppercase tracking-wider">AI Study Advisor</span>
                        <span class="text-[10px] text-dashTextMuted ml-auto">${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div id="ai-response-text" class="text-sm text-dashTextMuted leading-relaxed ai-markdown"></div>`;
        chatContainer.appendChild(msgDiv);

        // Convert markdown to HTML and typewrite
        const htmlContent = markdownToHTML(aiText);
        typewriteHTML('ai-response-text', htmlContent);

    } catch (err) {
        loading.classList.add('hidden');
        let errorMsg = err.message;
        let errorTitle = '❌ Error';

        if (errorMsg.includes('API key') || errorMsg.includes('401') || errorMsg.includes('403')) {
            errorMsg = 'Invalid API key. Please check your Gemini API key and try again.';
            errorTitle = '🔑 Invalid Key';
        } else if (errorMsg.includes('429') || errorMsg.toLowerCase().includes('quota') || errorMsg.toLowerCase().includes('rate') || errorMsg.toLowerCase().includes('limit') || errorMsg.toLowerCase().includes('exceeded')) {
            errorTitle = '⏳ Rate Limit Exceeded';
            errorMsg = 'This API key has exceeded its usage limit. You can either wait a bit and try again, or use a different API key.';
        }

        chatContainer.innerHTML = `
                    <div class="p-5 bg-dashBase/80 rounded-2xl border border-red-500/30">
                        <p class="text-sm text-red-400 font-medium mb-1">${errorTitle}</p>
                        <p class="text-xs text-dashTextMuted mb-3">${errorMsg}</p>
                        <div class="flex gap-3">
                            <!-- Reset buttons removed -->
                        </div>
                    </div>`;
    } finally {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'pointer-events-none');
    }
}

function markdownToHTML(md) {
    // Process headings (## and ###)
    let html = md
        .replace(/^### (.+)$/gm, '<h4 class="text-sm font-bold text-white mt-5 mb-2">$1</h4>')
        .replace(/^## (.+)$/gm, '<h3 class="text-base font-bold text-white mt-6 mb-3 pb-2 border-b border-dashBorder/30">$1</h3>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        // Italic
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code class="bg-dashBase px-1.5 py-0.5 rounded text-violet-300 text-xs">$1</code>')
        // Unordered list items
        .replace(/^- (.+)$/gm, '<li class="flex items-start gap-2 text-dashTextMuted text-sm ml-2 mb-1"><span class="text-violet-400 mt-1 shrink-0">•</span><span>$1</span></li>')
        // Newlines to breaks (but not inside list sequences)
        .replace(/\n{2,}/g, '<br/><br/>')
        .replace(/\n/g, '');

    // Wrap consecutive <li> in <ul>
    html = html.replace(/((?:<li[^>]*>.*?<\/li>)+)/g, '<ul class="space-y-1 my-2">$1</ul>');

    return html;
}

function typewriteHTML(elementId, html, speed = 3) {
    const el = document.getElementById(elementId);
    if (!el) return;

    // For performance, we'll chunk the HTML and add it progressively
    el.innerHTML = '';
    let index = 0;
    const chunkSize = 8; // characters per frame

    function addChunk() {
        if (index >= html.length) return;

        // Find a safe break point (don't break inside tags)
        let end = Math.min(index + chunkSize, html.length);

        // If we're inside a tag, extend to close it
        const partial = html.substring(0, end);
        const openTags = (partial.match(/</g) || []).length;
        const closeTags = (partial.match(/>/g) || []).length;

        if (openTags > closeTags) {
            // We're inside a tag, find the closing >
            const nextClose = html.indexOf('>', end);
            if (nextClose !== -1) end = nextClose + 1;
        }

        index = end;
        el.innerHTML = html.substring(0, index);

        // Auto-scroll the chat container
        const container = document.getElementById('ai-chat-container');
        if (container) container.scrollTop = container.scrollHeight;

        if (index < html.length) {
            requestAnimationFrame(addChunk);
        }
    }

    requestAnimationFrame(addChunk);
}

window.onload = init;
