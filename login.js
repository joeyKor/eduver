// ========================================================
// NAVER Standard Login Client Logic
// Synchronizes with PocketBase and localStorage auth state
// ========================================================

document.addEventListener("DOMContentLoaded", () => {
    const POCKETBASE_URL = "https://pb.joyfamkr.synology.me";

    // 1. Query Parameters & Redirection Logic
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get("redirect") || urlParams.get("url") || "";
    const isMailRedirect = redirectUrl.includes("mail.html") || urlParams.get("service") === "mail";

    const isAlreadyLoggedIn = (localStorage.getItem("naverIsLoggedIn") === "true") || Boolean(localStorage.getItem("naverLoggedInUser"));

    // If user is already authenticated, redirect immediately
    if (isAlreadyLoggedIn) {
        if (redirectUrl) {
            window.location.replace(redirectUrl);
            return;
        }
    }

    // Display service notice banner if redirected from Mail
    const serviceNotice = document.getElementById("service-notice");
    if (serviceNotice && (isMailRedirect || redirectUrl)) {
        serviceNotice.style.display = "flex";
    }

    // 2. DOM Elements
    const loginForm = document.getElementById("eduver-login-form") || document.getElementById("naver-login-form");
    const inputId = document.getElementById("login-id");
    const inputPw = document.getElementById("login-pw");
    const inputGroup = document.getElementById("input-row-group");
    const btnClearId = document.getElementById("btn-clear-id");
    const btnClearPw = document.getElementById("btn-clear-pw");
    const btnTogglePw = document.getElementById("btn-toggle-pw");
    const errorMsg = document.getElementById("login-error-msg");
    const errorText = document.getElementById("login-error-text");
    const keepLoginCheckbox = document.getElementById("keep-login-checkbox");
    const customCheckIcon = document.getElementById("custom-check-icon");
    const ipToggleBtn = document.getElementById("ip-toggle-btn");

    // Views
    const viewIdLogin = document.getElementById("view-id-login");
    const viewQrLogin = document.getElementById("view-qr-login");
    const viewDisposableLogin = document.getElementById("view-disposable-login");

    const navToQr = document.getElementById("nav-to-qr");
    const navToDisposable = document.getElementById("nav-to-disposable");
    const btnBackFromQr = document.getElementById("btn-back-from-qr");
    const btnBackFromDisposable = document.getElementById("btn-back-from-disposable");

    // 3. Input Group Focus & Clear Button Behaviors
    const updateInputState = () => {
        if (inputId.value.trim().length > 0) {
            btnClearId.style.display = "flex";
        } else {
            btnClearId.style.display = "none";
        }

        if (inputPw.value.length > 0) {
            btnClearPw.style.display = "flex";
            btnTogglePw.style.display = "flex";
        } else {
            btnClearPw.style.display = "none";
            btnTogglePw.style.display = "none";
        }
    };

    [inputId, inputPw].forEach(input => {
        input.addEventListener("focus", () => {
            inputGroup.classList.add("focused");
            inputGroup.classList.remove("error");
            if (errorMsg) errorMsg.style.display = "none";
        });

        input.addEventListener("blur", () => {
            inputGroup.classList.remove("focused");
        });

        input.addEventListener("input", updateInputState);
    });

    btnClearId.addEventListener("click", () => {
        inputId.value = "";
        btnClearId.style.display = "none";
        inputId.focus();
    });

    btnClearPw.addEventListener("click", () => {
        inputPw.value = "";
        btnClearPw.style.display = "none";
        btnTogglePw.style.display = "none";
        inputPw.focus();
    });

    // Password Visibility Toggle
    let isPwVisible = false;
    btnTogglePw.addEventListener("click", () => {
        isPwVisible = !isPwVisible;
        inputPw.type = isPwVisible ? "text" : "password";
        btnTogglePw.innerHTML = isPwVisible ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
    });

    // Keep Login Custom Checkbox
    keepLoginCheckbox.addEventListener("change", () => {
        if (keepLoginCheckbox.checked) {
            customCheckIcon.classList.add("checked");
        } else {
            customCheckIcon.classList.remove("checked");
        }
    });

    // IP Security Toggle Switch
    ipToggleBtn.addEventListener("click", () => {
        const isActive = ipToggleBtn.classList.toggle("active");
        ipToggleBtn.setAttribute("aria-checked", isActive ? "true" : "false");
    });

    // 4. Successful Login Flow Handler
    const handleLoginSuccess = (name, username, email, pbRecordId) => {
        const cleanEmail = (email || `${username}@eduver.com`).replace(/@(edunaver|edunver|naver)\.com$/i, "@eduver.com");

        localStorage.setItem("naverIsLoggedIn", "true");
        localStorage.setItem("naverLoggedInUser", name);
        localStorage.setItem("naverLoggedInUsername", username);
        localStorage.setItem("naverLoggedInUserId", username);
        localStorage.setItem("naverLoggedInEmail", cleanEmail);
        if (pbRecordId) {
            localStorage.setItem("naverPbRecordId", pbRecordId);
        }

        // Navigate to intended destination or default home
        const target = redirectUrl ? decodeURIComponent(redirectUrl) : "index.html";
        window.location.replace(target);
    };

    const showLoginError = (msg) => {
        if (errorMsg && errorText) {
            errorText.textContent = msg || "아이디 또는 비밀번호가 올바르지 않습니다.";
            errorMsg.style.display = "flex";
        }
        inputGroup.classList.add("error");
    };

    // 5. Authentication Form Submission
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const idVal = inputId.value.trim();
        const pwVal = inputPw.value.trim();

        if (!idVal) {
            showLoginError("아이디를 입력해 주세요.");
            inputId.focus();
            return;
        }

        if (!pwVal) {
            showLoginError("비밀번호를 입력해 주세요.");
            inputPw.focus();
            return;
        }

        let finalName = "";
        let emailAddr = "";
        let actualLoginId = "";
        let loggedIn = false;
        let pbRecordId = "";

        // 5-1. Local Mock Credentials Check
        if ((idVal === "abc@eduver.com" || idVal === "abc@edunaver.com" || idVal === "abc@naver.com" || idVal === "abc") && pwVal === "abcd1234") {
            finalName = "abc";
            emailAddr = "abc@eduver.com";
            actualLoginId = "abc";
            loggedIn = true;
        } else if ((idVal === "apple@eduver.com" || idVal === "apple@edunaver.com" || idVal === "apple@naver.com" || idVal === "apple") && pwVal === "abcd1234") {
            finalName = "apple";
            emailAddr = "apple@eduver.com";
            actualLoginId = "apple";
            loggedIn = true;
        } else if (idVal === "student" && pwVal === "1234") {
            finalName = "홍길동";
            emailAddr = "gildong@eduver.com";
            actualLoginId = "student";
            loggedIn = true;
        }

        // 5-2. PocketBase Remote Authentication Fallback
        if (!loggedIn) {
            try {
                const submitBtn = document.getElementById("btn-submit");
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = "0.7";
                    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 로그인 중...';
                }

                const response = await fetch(`${POCKETBASE_URL}/api/collections/users/auth-with-password`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        identity: idVal,
                        password: pwVal
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    finalName = data.record.name || data.record.username || idVal.split("@")[0];
                    actualLoginId = data.record.username || (data.record.email ? data.record.email.split("@")[0] : idVal.split("@")[0]);
                    emailAddr = data.record.email || `${actualLoginId}@eduver.com`;
                    pbRecordId = data.record.id || "";
                    loggedIn = true;
                }
            } catch (err) {
                console.warn("PocketBase login verification failed:", err);
            } finally {
                const submitBtn = document.getElementById("btn-submit");
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = "1";
                    submitBtn.innerHTML = '<span>로그인</span>';
                }
            }
        }

        if (loggedIn) {
            handleLoginSuccess(finalName, actualLoginId, emailAddr, pbRecordId);
        } else {
            showLoginError("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
    });

    // 6. View Switching (QR & Disposable Number Login)
    const showView = (viewToShow) => {
        [viewIdLogin, viewQrLogin, viewDisposableLogin].forEach(v => {
            if (v) v.style.display = "none";
        });
        if (viewToShow) viewToShow.style.display = "block";
    };

    let qrInterval = null;
    let qrRemainingSec = 180;

    const startQrTimer = () => {
        clearInterval(qrInterval);
        qrRemainingSec = 180;
        const timerEl = document.getElementById("qr-timer");
        const updateDisplay = () => {
            const m = String(Math.floor(qrRemainingSec / 60)).padStart(2, '0');
            const s = String(qrRemainingSec % 60).padStart(2, '0');
            if (timerEl) timerEl.textContent = `${m}:${s}`;
        };
        updateDisplay();

        qrInterval = setInterval(() => {
            qrRemainingSec--;
            if (qrRemainingSec <= 0) {
                clearInterval(qrInterval);
                if (timerEl) timerEl.textContent = "00:00 (만료됨)";
            } else {
                updateDisplay();
            }
        }, 1000);
    };

    if (navToQr) {
        navToQr.addEventListener("click", () => {
            showView(viewQrLogin);
            startQrTimer();
        });
    }

    if (navToDisposable) {
        navToDisposable.addEventListener("click", () => {
            showView(viewDisposableLogin);
            const dispInput = document.getElementById("disposable-num");
            if (dispInput) dispInput.focus();
        });
    }

    if (btnBackFromQr) {
        btnBackFromQr.addEventListener("click", () => {
            clearInterval(qrInterval);
            showView(viewIdLogin);
        });
    }

    if (btnBackFromDisposable) {
        btnBackFromDisposable.addEventListener("click", () => {
            showView(viewIdLogin);
        });
    }

    const btnRefreshQr = document.getElementById("btn-refresh-qr");
    if (btnRefreshQr) {
        btnRefreshQr.addEventListener("click", () => {
            startQrTimer();
        });
    }

    // QR Simulated Login Action Button
    const btnTestQrLogin = document.getElementById("btn-test-qr-login");
    if (btnTestQrLogin) {
        btnTestQrLogin.addEventListener("click", () => {
            handleLoginSuccess("홍길동", "student", "gildong@eduver.com", "");
        });
    }

    // Disposable Number Submit
    const btnDisposableSubmit = document.getElementById("btn-disposable-submit");
    if (btnDisposableSubmit) {
        btnDisposableSubmit.addEventListener("click", () => {
            const dispInput = document.getElementById("disposable-num");
            const code = (dispInput ? dispInput.value.trim() : "");
            if (code.length < 8) {
                alert("8자리 일회용 번호를 모두 입력해 주세요.");
                return;
            }
            // Auto login with demo account
            handleLoginSuccess("홍길동", "student", "gildong@eduver.com", "");
        });
    }
});
