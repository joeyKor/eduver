// EDUVER Sign-up Logic with PocketBase integration

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");
    const nameInput = document.getElementById("reg-name");
    const birthdateInput = document.getElementById("reg-birthdate");
    const usernameInput = document.getElementById("reg-username");
    const passwordInput = document.getElementById("reg-password");
    const passwordConfirmInput = document.getElementById("reg-password-confirm");
    const addressInput = document.getElementById("reg-address");
    const submitBtn = document.getElementById("submit-btn");

    // Toggle Password Visibility
    const pwToggleBtns = document.querySelectorAll(".pw-toggle-btn");
    pwToggleBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const input = btn.previousElementSibling;
            const icon = btn.querySelector("i");
            if (input.type === "password") {
                input.type = "text";
                icon.className = "fa-regular fa-eye-slash";
            } else {
                input.type = "password";
                icon.className = "fa-regular fa-eye";
            }
        });
    });

    // Validation patterns
    const usernameRegex = /^[a-z0-9]{4,20}$/;
    // 8+ chars, at least one letter, one number, one special char
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    // Utility for showing/hiding feedback
    const showFeedback = (inputEl, errorId, successId, isValid, forceHideSuccess = false) => {
        const errorEl = document.getElementById(errorId);
        const successEl = successId ? document.getElementById(successId) : null;
        
        if (isValid) {
            inputEl.parentElement.style.borderColor = "";
            if (errorEl) errorEl.style.display = "none";
            if (successEl && !forceHideSuccess) successEl.style.display = "flex";
        } else {
            inputEl.parentElement.style.borderColor = "var(--accent-red)";
            if (errorEl) errorEl.style.display = "flex";
            if (successEl) successEl.style.display = "none";
        }
    };

    // Live validation event listeners
    nameInput.addEventListener("input", () => {
        const isValid = nameInput.value.trim().length > 0;
        showFeedback(nameInput, "error-name", null, isValid);
    });

    birthdateInput.addEventListener("change", () => {
        const isValid = birthdateInput.value !== "";
        showFeedback(birthdateInput, "error-birthdate", null, isValid);
    });

    usernameInput.addEventListener("input", () => {
        const value = usernameInput.value.trim();
        const isValid = usernameRegex.test(value);
        showFeedback(usernameInput, "error-username", "success-username", isValid);
    });

    passwordInput.addEventListener("input", () => {
        const value = passwordInput.value;
        const isValid = passwordRegex.test(value);
        showFeedback(passwordInput, "error-password", null, isValid);
        
        // Also trigger password confirm check if it has value
        if (passwordConfirmInput.value) {
            const matches = value === passwordConfirmInput.value;
            showFeedback(passwordConfirmInput, "error-password-confirm", "success-password-confirm", matches);
        }
    });

    passwordConfirmInput.addEventListener("input", () => {
        const matches = passwordInput.value === passwordConfirmInput.value;
        showFeedback(passwordConfirmInput, "error-password-confirm", "success-password-confirm", matches);
    });

    addressInput.addEventListener("input", () => {
        const isValid = addressInput.value.trim().length > 0;
        showFeedback(addressInput, "error-address", null, isValid);
    });

    // Toast show helper
    const showToast = (message, isError = false) => {
        const toast = document.getElementById("toast");
        const toastMessage = document.getElementById("toast-message");
        const toastIcon = document.getElementById("toast-icon");

        toastMessage.textContent = message;
        if (isError) {
            toastIcon.className = "fa-solid fa-circle-xmark toast-icon error";
        } else {
            toastIcon.className = "fa-solid fa-circle-check toast-icon";
        }

        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    };

    // Form Submit Handler
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Run all validations once
        const nameVal = nameInput.value.trim();
        const birthdateVal = birthdateInput.value;
        const usernameVal = usernameInput.value.trim();
        const passwordVal = passwordInput.value;
        const passwordConfirmVal = passwordConfirmInput.value;
        const addressVal = addressInput.value.trim();

        const isNameValid = nameVal.length > 0;
        const isBirthdateValid = birthdateVal !== "";
        const isUsernameValid = usernameRegex.test(usernameVal);
        const isPasswordValid = passwordRegex.test(passwordVal);
        const isPasswordConfirmValid = passwordVal === passwordConfirmVal;
        const isAddressValid = addressVal.length > 0;

        showFeedback(nameInput, "error-name", null, isNameValid);
        showFeedback(birthdateInput, "error-birthdate", null, isBirthdateValid);
        showFeedback(usernameInput, "error-username", "success-username", isUsernameValid);
        showFeedback(passwordInput, "error-password", null, isPasswordValid);
        showFeedback(passwordConfirmInput, "error-password-confirm", "success-password-confirm", isPasswordConfirmValid);
        showFeedback(addressInput, "error-address", null, isAddressValid);

        if (!isNameValid || !isBirthdateValid || !isUsernameValid || !isPasswordValid || !isPasswordConfirmValid || !isAddressValid) {
            showToast("입력 정보를 다시 확인해주세요.", true);
            return;
        }

        // PocketBase endpoint settings
        const pocketbaseUrl = "https://pb.joyfamkr.synology.me/api/collections/users/records";

        // Disable button to prevent duplicate submit
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> 가입 중...';

        try {
            const signupData = {
                username: usernameVal,
                email: `${usernameVal}@eduver.com`,
                emailVisibility: true,
                password: passwordVal,
                passwordConfirm: passwordConfirmVal,
                name: nameVal,
                birthdate: birthdateVal,
                address: addressVal
            };

            const response = await fetch(pocketbaseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(signupData)
            });

            if (response.ok) {
                // 에듀버 회원가입 환영 메일 자동 발송
                try {
                    const welcomeMailData = {
                        sender: "에듀버 <admin@eduver.com>",
                        recipient: `${usernameVal}@eduver.com`,
                        subject: `[에듀버] ${nameVal}님, 에듀버에 오신 것을 진심으로 환영합니다! 🎉`,
                        body: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e1e3e8; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
  <div style="background: linear-gradient(135deg, #03c75a 0%, #00a843 100%); padding: 36px 30px; text-align: center; color: #ffffff;">
    <div style="font-size: 26px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px;">EDUNAVER</div>
    <h1 style="font-size: 20px; font-weight: 700; margin: 0; line-height: 1.4;">${nameVal}님, 에듀버 회원이 되신 것을 환영합니다! 🎉</h1>
  </div>
  <div style="padding: 32px 30px; color: #333333; line-height: 1.7; font-size: 14px;">
    <p style="margin: 0 0 16px 0; font-size: 15px;">
      안녕하세요, <strong>${nameVal}</strong>님!<br>
      스마트 교육 포털 <strong>에듀버(EDUNAVER)</strong>에 오신 것을 진심으로 환영합니다.
    </p>
    <p style="margin: 0 0 24px 0; color: #555555;">
      새롭게 생성된 <strong>${usernameVal}@eduver.com</strong> 계정으로 에듀버의 메일, 카페, 블로그, 캘린더 등 모든 서비스를 편리하게 이용하실 수 있습니다.
    </p>
    <div style="background: #f7f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px 24px; margin-bottom: 26px;">
      <div style="font-weight: 700; color: #111; margin-bottom: 12px; font-size: 14px; border-bottom: 1px solid #e2e5e8; padding-bottom: 8px;">
        📌 가입 계정 정보
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="padding: 6px 0; color: #777; width: 100px;">이름</td>
          <td style="padding: 6px 0; font-weight: 600; color: #222;">${nameVal}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #777;">아이디</td>
          <td style="padding: 6px 0; font-weight: 600; color: #222;">${usernameVal}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #777;">에듀버 메일</td>
          <td style="padding: 6px 0; font-weight: 600; color: #03c75a;">${usernameVal}@eduver.com</td>
        </tr>
      </table>
    </div>
  </div>
  <div style="background: #f8f9fa; border-top: 1px solid #edf0f2; padding: 20px 30px; font-size: 12px; color: #888; text-align: center; line-height: 1.6;">
    본 메일은 에듀버(EDUNAVER) 회원가입 시 자동 발송되는 발신전용 안내 메일입니다.<br>
    문의사항은 <a href="mailto:help@eduver.com" style="color: #03c75a; text-decoration: none;">에듀버 고객센터(help@eduver.com)</a>로 문의해 주시기 바랍니다.<br>
    © EDUNAVER Corp. All rights reserved.
  </div>
</div>
                        `.trim(),
                        is_read: false
                    };

                    await fetch("https://pb.joyfamkr.synology.me/api/collections/mails/records", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(welcomeMailData)
                    });
                } catch (welcomeErr) {
                    console.warn("환영 메일 자동 발송 실패 (계속 진행):", welcomeErr);
                }

                showToast("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            } else {
                const errData = await response.json();
                console.error("PocketBase error response:", errData);
                
                // Parse errors e.g., duplicate username
                if (errData.data && errData.data.username) {
                    showToast("이미 존재하는 아이디입니다.", true);
                    showFeedback(usernameInput, "error-username", "success-username", false, true);
                    document.getElementById("error-username").textContent = "이미 사용 중인 아이디입니다.";
                    document.getElementById("error-username").style.display = "flex";
                } else if (errData.data && errData.data.email) {
                    showToast("이미 등록된 이메일 주소입니다.", true);
                } else {
                    showToast(errData.message || "회원가입에 실패했습니다.", true);
                }
                
                submitBtn.disabled = false;
                submitBtn.textContent = "가입하기";
            }
        } catch (error) {
            console.error("Connection error to PocketBase:", error);
            showToast("PocketBase 서버에 연결할 수 없습니다. 서버 상태를 확인해주세요.", true);
            submitBtn.disabled = false;
            submitBtn.textContent = "가입하기";
        }
    });
});
