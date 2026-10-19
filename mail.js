// Pocketbase configuration: Leave blank if hosted in pb_public (same host/port).
// If hosted on Synology Web Station or locally, enter your Pocketbase API URL (e.g. "http://192.168.0.10:8090").
const POCKETBASE_URL = "https://pb.joyfamkr.synology.me";

// EDUVER Mail Client - Interactive Logic Script

document.addEventListener("DOMContentLoaded", () => {
    // Read logged-in username and email from localStorage or default
    const userName = localStorage.getItem("naverLoggedInUser") || "홍길동";
    const userEmail = (localStorage.getItem("naverLoggedInEmail") || "gildong@eduver.com").replace(/@(edunaver|edunver|naver)\.com$/i, "@eduver.com");
    const headerUserName = document.getElementById("header-user-name");
    if (headerUserName) {
        headerUserName.textContent = userName;
    }
    const mailHeaderAvatar = document.getElementById("mail-header-avatar");
    if (mailHeaderAvatar) {
        mailHeaderAvatar.src = "default-avatar.svg";
        const loggedUsername = localStorage.getItem("naverLoggedInUsername") || userName;
        fetch(`https://pb.joyfamkr.synology.me/api/collections/users/records?filter=(name='${encodeURIComponent(userName)}'||username='${encodeURIComponent(userName)}'||name='${encodeURIComponent(loggedUsername)}'||username='${encodeURIComponent(loggedUsername)}')`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.items && data.items.length > 0 && data.items[0].avatarUrl) {
                    mailHeaderAvatar.src = data.items[0].avatarUrl;
                }
            })
            .catch(err => console.warn("Mail avatar sync failed:", err));
    }

    const currentUserEmail = userEmail;
    const currentUserName = userName;

    // User Directory Cache for resolving email to display name
    const userDirectory = {
        "notify@style24.com": "스타일24",
        "teacher@school.net": "김선생님",
        "admin@eduver.com": "에듀버 관리자",
        "help@eduver.com": "에듀버 고객센터",
        "security@eduver.com": "에듀버 보안센터",
        "naver@naver.com": "네이버"
    };

    if (currentUserEmail) {
        userDirectory[currentUserEmail.toLowerCase()] = currentUserName;
    }
    const currentUserId = (localStorage.getItem("naverLoggedInUserId") || "").toLowerCase();
    if (currentUserId) {
        userDirectory[currentUserId] = currentUserName;
        userDirectory[`${currentUserId}@eduver.com`] = currentUserName;
    }

    const loadUserDirectory = async () => {
        try {
            const response = await fetch(`${POCKETBASE_URL}/api/collections/users/records?perPage=200`);
            if (response.ok) {
                const data = await response.json();
                (data.items || []).forEach(u => {
                    const displayName = u.name || u.username;
                    if (u.email) userDirectory[u.email.toLowerCase()] = displayName;
                    if (u.username) {
                        userDirectory[u.username.toLowerCase()] = displayName;
                        userDirectory[`${u.username.toLowerCase()}@eduver.com`] = displayName;
                        userDirectory[`${u.username.toLowerCase()}@edunaver.com`] = displayName;
                        userDirectory[`${u.username.toLowerCase()}@naver.com`] = displayName;
                    }
                });
            }
        } catch (e) {
            console.warn("Could not preload user directory:", e);
        }
    };

    const getSenderInfo = (rawStr) => {
        if (!rawStr) return { name: "알 수 없음", email: "", fullDisplay: "알 수 없음" };
        
        // Match "Name <email@domain.com>"
        const match = String(rawStr).match(/^(.*?)\s*<([^>]+)>/);
        if (match) {
            const name = match[1].trim();
            const email = match[2].trim();
            return { name: name || email, email: email, fullDisplay: `${name || email} <${email}>` };
        }

        const clean = String(rawStr).trim();
        const lower = clean.toLowerCase();

        if (userDirectory[lower]) {
            const email = clean.includes("@") ? clean : `${clean}@eduver.com`;
            return {
                name: userDirectory[lower],
                email: email,
                fullDisplay: `${userDirectory[lower]} <${email}>`
            };
        }

        if (clean.includes("@")) {
            const userPart = clean.split("@")[0].toLowerCase();
            if (userDirectory[userPart]) {
                return {
                    name: userDirectory[userPart],
                    email: clean,
                    fullDisplay: `${userDirectory[userPart]} <${clean}>`
                };
            }
            return {
                name: clean.split("@")[0],
                email: clean,
                fullDisplay: `${clean.split("@")[0]} <${clean}>`
            };
        }

        return {
            name: clean,
            email: `${clean}@eduver.com`,
            fullDisplay: `${clean} <${clean}@eduver.com>`
        };
    };

    const formatKoreanDate = (dateVal) => {
        if (!dateVal) return "";
        try {
            const d = new Date(String(dateVal).replace(" ", "T"));
            if (isNaN(d.getTime())) return String(dateVal);

            const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
            const year = d.getFullYear();
            const month = d.getMonth() + 1;
            const date = d.getDate();
            const day = dayNames[d.getDay()];
            let hours = d.getHours();
            const ampm = hours < 12 ? '오전' : '오후';
            hours = hours % 12 || 12;
            const minutes = String(d.getMinutes()).padStart(2, '0');

            return `${year}년 ${month}월 ${date}일 (${day}) ${ampm} ${hours}:${minutes}`;
        } catch (e) {
            return String(dateVal);
        }
    };

    const buildEmailFilter = (field, emailStr) => {
        const clean = (emailStr || "").toLowerCase().trim();
        const user = clean.includes("@") ? clean.split("@")[0] : clean;
        const expr = `(${field}='${clean}' || ${field}='${user}@eduver.com' || ${field}='${user}@edunaver.com' || ${field}='${user}@naver.com' || ${field}='${user}')`;
        return encodeURIComponent(expr);
    };

    // View Panels selection
    const inboxPanel = document.getElementById("inbox-panel");
    const sentPanel = document.getElementById("sent-panel");
    const receiptPanel = document.getElementById("receipt-panel");
    const trashPanel = document.getElementById("trash-panel");
    const composePanel = document.getElementById("compose-panel");
    const detailPanel = document.getElementById("detail-panel");

    // Sidebar Folder/Menu items
    const sidebarWriteBtn = document.getElementById("sidebar-write-btn");
    const folderAllBtn = document.getElementById("folder-all-btn");
    const folderInboxBtn = document.getElementById("folder-inbox-btn");
    const folderSentBtn = document.getElementById("folder-sent-btn");
    const folderReceiptBtn = document.getElementById("folder-receipt-btn");
    const folderTrashBtn = document.getElementById("folder-trash-btn");

    // Compose inputs & elements
    const inputTo = document.getElementById("input-to");
    const inputSubject = document.getElementById("input-subject");
    const inputBody = document.getElementById("input-body");

    const composerSendBtn = document.getElementById("composer-send-btn");
    const composerCancelBtn = document.getElementById("composer-cancel-btn");

    // File attachments state & constants (개별 10MB, 총합 30MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30MB
    let attachedMailFiles = [];

    const formatFileSize = (bytes) => {
        if (!bytes || bytes <= 0) return "0KB";
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)}KB`;
        }
        return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    };

    const getFileIconInfo = (filename) => {
        const ext = ((filename || '').split('.').pop() || '').toLowerCase();
        switch (ext) {
            case 'zip':
            case 'rar':
            case '7z':
            case 'tar':
            case 'gz':
                return { icon: 'fa-solid fa-file-zipper', color: '#b5835a', bg: '#f5ece5' };
            case 'pdf':
                return { icon: 'fa-solid fa-file-pdf', color: '#e03131', bg: '#ffe3e3' };
            case 'xls':
            case 'xlsx':
            case 'csv':
                return { icon: 'fa-solid fa-file-excel', color: '#099268', bg: '#e6fcf5' };
            case 'doc':
            case 'docx':
            case 'hwp':
            case 'hwpx':
                return { icon: 'fa-solid fa-file-word', color: '#1971c2', bg: '#e7f5ff' };
            case 'ppt':
            case 'pptx':
                return { icon: 'fa-solid fa-file-powerpoint', color: '#f76707', bg: '#fff4e6' };
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'webp':
            case 'svg':
                return { icon: 'fa-solid fa-file-image', color: '#ae3ec9', bg: '#f8f0fc' };
            default:
                return { icon: 'fa-solid fa-file-lines', color: '#495057', bg: '#f1f3f5' };
        }
    };

    const updateAttachedFilesUI = () => {
        const listContainer = document.getElementById("attached-files-list");
        const dropLabel = document.getElementById("file-drop-label");
        const limitInfo = document.getElementById("attach-limit-info");
        const totalSize = attachedMailFiles.reduce((acc, f) => acc + f.size, 0);

        if (limitInfo) {
            limitInfo.textContent = `첨부 ${formatFileSize(totalSize)}/10MB | 전체 ${formatFileSize(totalSize)}/30MB`;
        }

        if (!listContainer) return;

        if (attachedMailFiles.length === 0) {
            listContainer.style.display = "none";
            listContainer.innerHTML = "";
            if (dropLabel) dropLabel.textContent = "파일을 마우스로 끌어 오거나 클릭하여 첨부하세요 (개별 10MB, 총 30MB)";
            return;
        }

        listContainer.style.display = "flex";
        if (dropLabel) dropLabel.textContent = `${attachedMailFiles.length}개 파일 첨부됨 (클릭하거나 파일을 끌어서 추가)`;

        listContainer.innerHTML = attachedMailFiles.map((f, idx) => {
            const iconInfo = getFileIconInfo(f.name);
            return `
                <div class="attached-file-item" data-index="${idx}">
                    <div class="attached-file-info">
                        <div class="detail-attach-badge" style="background-color: ${iconInfo.bg}; color: ${iconInfo.color}; width: 24px; height: 24px; font-size: 12px;">
                            <i class="${iconInfo.icon}"></i>
                        </div>
                        <span class="attached-file-name" title="${f.name}">${f.name}</span>
                        <span class="attached-file-size" style="color: #8b95a1; font-size: 12px; margin-left: 6px;">${formatFileSize(f.size)}</span>
                    </div>
                    <button type="button" class="btn-remove-file" data-index="${idx}" title="첨부 삭제">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `;
        }).join("");

        listContainer.querySelectorAll(".btn-remove-file").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.getAttribute("data-index"), 10);
                if (!isNaN(idx)) {
                    attachedMailFiles.splice(idx, 1);
                    updateAttachedFilesUI();
                }
            });
        });
    };

    const addMailFiles = (files) => {
        if (!files || files.length === 0) return;
        let currentTotal = attachedMailFiles.reduce((acc, f) => acc + f.size, 0);

        for (const file of Array.from(files)) {
            if (file.size > MAX_FILE_SIZE) {
                alert(`'${file.name}' 파일의 크기(${formatFileSize(file.size)})가 개별 파일 제한인 10MB를 초과하여 첨부할 수 없습니다.`);
                continue;
            }
            if (currentTotal + file.size > MAX_TOTAL_SIZE) {
                alert(`총 첨부 용량이 30MB를 초과하여 '${file.name}' 파일을 추가할 수 없습니다. (현재: ${formatFileSize(currentTotal)})`);
                break;
            }
            const isDuplicate = attachedMailFiles.some(f => f.name === file.name && f.size === file.size);
            if (isDuplicate) {
                continue;
            }
            attachedMailFiles.push(file);
            currentTotal += file.size;
        }
        updateAttachedFilesUI();
    };

    // Celebration screen
    const celebrationScreen = document.getElementById("celebration-screen");
    const celebrationCloseBtn = document.getElementById("celebration-close-btn");
    const celebrationXBtn = document.getElementById("celebration-x-btn");

    // Lists and Badges
    const sentList = document.getElementById("sent-list");
    const sentMailboxCount = document.getElementById("sent-mailbox-count");
    const sentMailCountSidebar = document.getElementById("sent-mail-count");
    const receiptList = document.getElementById("receipt-list");
    const receiptMailboxCount = document.getElementById("receipt-mailbox-count");
    const trashList = document.getElementById("trash-list");
    const trashMailboxCount = document.getElementById("trash-mailbox-count");
    const trashMailCountSidebar = document.getElementById("trash-mail-count");

    // Active Folders items collection for class resets
    const folderItems = document.querySelectorAll(".folder-item");

    // ----------------------------------------------------
    // Trash Management (휴지통 기능)
    // ----------------------------------------------------
    const getTrashStorageKey = () => `naverMailTrash_${(currentUserEmail || "").toLowerCase().trim()}`;

    const getTrashMails = () => {
        try {
            return JSON.parse(localStorage.getItem(getTrashStorageKey()) || "[]");
        } catch (e) {
            return [];
        }
    };

    const getTrashMailIds = () => {
        return getTrashMails().map(m => String(m.id));
    };

    const updateTrashBadges = () => {
        const trashMails = getTrashMails();
        const trashCount = trashMails.length;
        if (trashMailCountSidebar) trashMailCountSidebar.textContent = trashCount;
        if (trashMailboxCount) trashMailboxCount.textContent = trashCount;
    };

    const saveTrashMails = (trashItems) => {
        localStorage.setItem(getTrashStorageKey(), JSON.stringify(trashItems));
        updateTrashBadges();
    };

    const moveToTrash = (emails, fromMailbox = "inbox") => {
        if (!Array.isArray(emails) || emails.length === 0) return;
        const currentTrash = getTrashMails();
        emails.forEach(email => {
            if (!currentTrash.some(m => String(m.id) === String(email.id))) {
                currentTrash.unshift({
                    ...email,
                    from_mailbox: fromMailbox,
                    trashed_at: new Date().toISOString()
                });
            }
        });
        saveTrashMails(currentTrash);
        alert(`${emails.length}개의 메일을 휴지통으로 이동했습니다.`);
    };

    const restoreFromTrash = (mailIds) => {
        if (!Array.isArray(mailIds) || mailIds.length === 0) return;
        const currentTrash = getTrashMails();
        const filtered = currentTrash.filter(m => !mailIds.includes(String(m.id)));
        saveTrashMails(filtered);
    };

    const permanentlyDeleteFromTrash = async (mailIds) => {
        if (!Array.isArray(mailIds) || mailIds.length === 0) return;
        const currentTrash = getTrashMails();
        const filtered = currentTrash.filter(m => !mailIds.includes(String(m.id)));
        saveTrashMails(filtered);
        for (const id of mailIds) {
            try {
                await fetch(`${POCKETBASE_URL}/api/collections/mails/records/${id}`, {
                    method: 'DELETE'
                });
            } catch (e) {
                console.warn("Pocketbase delete ignored or failed:", id, e);
            }
        }
    };

    // Cached active emails
    let currentInboxEmails = [];
    let currentSentEmails = [];
    const selectedMailIds = new Set();

    // Sub-tab & Filter elements
    const tabInboxMain = document.getElementById("tab-inbox-main");
    const filterUnreadToggle = document.getElementById("filter-unread-toggle");
    const allMailCount = document.getElementById("all-mail-count");

    // ----------------------------------------------------
    // 1. View Switcher Helper
    // ----------------------------------------------------
    let currentPanel = "inbox";
    let inboxFilterMode = "all"; // 'all' (전체메일 기본) or 'unread' (안읽은 메일만 필터)

    const updateUnreadFilterBtnUI = () => {
        const filterBtn = document.getElementById("filter-unread-toggle");
        const filterIcon = document.getElementById("filter-unread-icon");
        if (filterBtn && filterIcon) {
            if (inboxFilterMode === "unread") {
                filterBtn.classList.add("active");
                filterIcon.className = "fa-solid fa-square-check unread-check-icon";
            } else {
                filterBtn.classList.remove("active");
                filterIcon.className = "fa-regular fa-square unread-check-icon";
            }
        }
    };

    const showPanel = (panelName, filterMode = null) => {
        // Clear selection on view change
        selectedMailIds.clear();

        // Hide all
        inboxPanel.style.display = "none";
        sentPanel.style.display = "none";
        if (receiptPanel) receiptPanel.style.display = "none";
        if (trashPanel) trashPanel.style.display = "none";
        composePanel.style.display = "none";
        if (detailPanel) detailPanel.style.display = "none";

        // Reset active sidebar items
        folderItems.forEach(item => item.classList.remove("active"));
        if (sidebarWriteBtn) {
            sidebarWriteBtn.style.backgroundColor = "";
        }

        if (panelName === "inbox") {
            currentPanel = "inbox";
            inboxFilterMode = filterMode || "all";
            inboxPanel.style.display = "flex";
            if (folderInboxBtn) folderInboxBtn.classList.add("active");
            if (tabInboxMain) tabInboxMain.textContent = "받은메일함";
            updateUnreadFilterBtnUI();
            renderInboxEmailsList();
        } else if (panelName === "all") {
            currentPanel = "all";
            inboxFilterMode = "all";
            inboxPanel.style.display = "flex";
            if (folderAllBtn) folderAllBtn.classList.add("active");
            if (tabInboxMain) tabInboxMain.textContent = "전체메일";
            updateUnreadFilterBtnUI();
            renderInboxEmailsList();
        } else if (panelName === "sent") {
            currentPanel = "sent";
            sentPanel.style.display = "flex";
            if (folderSentBtn) folderSentBtn.classList.add("active");
            renderSentEmailsList();
        } else if (panelName === "receipt") {
            currentPanel = "receipt";
            if (receiptPanel) receiptPanel.style.display = "flex";
            if (folderReceiptBtn) folderReceiptBtn.classList.add("active");
            renderReceiptEmailsList();
        } else if (panelName === "trash") {
            currentPanel = "trash";
            if (trashPanel) trashPanel.style.display = "flex";
            if (folderTrashBtn) folderTrashBtn.classList.add("active");
            renderTrashEmailsList();
        } else if (panelName === "compose") {
            currentPanel = "compose";
            composePanel.style.display = "flex";
            if (sidebarWriteBtn) {
                sidebarWriteBtn.style.backgroundColor = "var(--primary-hover)";
            }
        } else if (panelName === "detail") {
            if (detailPanel) detailPanel.style.display = "flex";
        }
    };

    // Sidebar button clicks
    if (sidebarWriteBtn) {
        sidebarWriteBtn.addEventListener("click", () => {
            resetComposerForm();
            showPanel("compose");
        });
    }
    const sidebarWriteSelfBtn = document.querySelector(".compose-btn.write-self");
    if (sidebarWriteSelfBtn) {
        sidebarWriteSelfBtn.addEventListener("click", () => {
            resetComposerForm();
            if (inputTo) inputTo.value = currentUserEmail;
            showPanel("compose");
        });
    }
    if (folderInboxBtn) {
        folderInboxBtn.addEventListener("click", () => showPanel("inbox", "all"));
    }
    if (folderAllBtn) {
        folderAllBtn.addEventListener("click", () => showPanel("all", "all"));
    }
    if (folderSentBtn) {
        folderSentBtn.addEventListener("click", () => showPanel("sent"));
    }
    if (folderReceiptBtn) {
        folderReceiptBtn.addEventListener("click", () => showPanel("receipt"));
    }
    if (folderTrashBtn) {
        folderTrashBtn.addEventListener("click", () => showPanel("trash"));
    }

    // Compose Toolbar Sub buttons
    const composeSubBtns = document.querySelectorAll(".compose-sub-btn");
    composeSubBtns.forEach(btn => {
        if (btn.textContent.trim() === "내게쓰기") {
            btn.addEventListener("click", () => {
                if (inputTo) inputTo.value = currentUserEmail;
            });
        }
    });

    // Inbox Sub-Tab & Unread Toggle Clicks
    if (tabInboxMain) {
        tabInboxMain.addEventListener("click", () => {
            inboxFilterMode = "all";
            updateUnreadFilterBtnUI();
            renderInboxEmailsList();
        });
    }

    if (filterUnreadToggle) {
        filterUnreadToggle.addEventListener("click", () => {
            inboxFilterMode = (inboxFilterMode === "unread") ? "all" : "unread";
            updateUnreadFilterBtnUI();
            renderInboxEmailsList();
        });
    }

    // (Educational Checklist logic removed)

    // ----------------------------------------------------
    // 3. Send & Cancel Mail Logic (Pocketbase Integrated)
    // ----------------------------------------------------
    if (composerSendBtn) {
        composerSendBtn.addEventListener("click", async () => {
            const toVal = inputTo.value.trim();
            const subjectVal = inputSubject.value.trim();
            const bodyVal = inputBody.innerHTML.trim();
            const textVal = (inputBody.innerText || "").trim();

            if (!toVal) {
                alert("받는 사람의 이메일 주소를 정확하게 적어주세요.");
                inputTo.focus();
                return;
            }
            if (!subjectVal) {
                alert("이메일의 제목을 입력해 주세요.");
                inputSubject.focus();
                return;
            }
            if (!textVal && !bodyVal) {
                alert("본문 내용을 작성해 주세요.");
                inputBody.focus();
                return;
            }

            const originalBtnHtml = composerSendBtn.innerHTML;
            try {
                composerSendBtn.disabled = true;
                composerSendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 파일 업로드 및 발송 중...';

                let response;

                // When files are attached, send as multipart/form-data for PocketBase File field
                if (attachedMailFiles && attachedMailFiles.length > 0) {
                    const formData = new FormData();
                    formData.append('sender', currentUserEmail);
                    formData.append('recipient', toVal);
                    formData.append('subject', subjectVal);

                    // Preserve original file names and byte sizes accurately
                    const metaList = attachedMailFiles.map(f => ({
                        name: f.name,
                        size: f.size,
                        type: f.type || 'application/octet-stream'
                    }));
                    const bodyWithMeta = bodyVal +
                        `\n<!-- EDUVER_ATTACH_META_START -->` +
                        `<script type="application/json" class="eduver-attach-meta">${encodeURIComponent(JSON.stringify(metaList))}</script>` +
                        `<!-- EDUVER_ATTACH_META_END -->`;

                    formData.append('body', bodyWithMeta);
                    formData.append('is_read', 'false');

                    // Append each file to the 'attachments' field
                    attachedMailFiles.forEach(file => {
                        formData.append('attachments', file);
                    });

                    response = await fetch(`${POCKETBASE_URL}/api/collections/mails/records`, {
                        method: 'POST',
                        body: formData // Browser sets multipart boundary automatically
                    });
                } else {
                    const mailData = {
                        sender: currentUserEmail,
                        recipient: toVal,
                        subject: subjectVal,
                        body: bodyVal,
                        is_read: false
                    };

                    response = await fetch(`${POCKETBASE_URL}/api/collections/mails/records`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(mailData)
                    });
                }

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error("PocketBase send error response:", errorData);
                    throw new Error("Failed to send mail");
                }

                // Immediately reset composer form content and files
                resetComposerForm();

                if (celebrationScreen) {
                    celebrationScreen.style.display = "flex";
                }
            } catch (err) {
                console.error("Error sending mail:", err);
                alert("메일 발송에 실패했습니다. 포켓베이스 필드 설정 또는 파일 용량을 확인해 주세요.");
            } finally {
                composerSendBtn.disabled = false;
                composerSendBtn.innerHTML = originalBtnHtml;
            }
        });
    }

    const closeCelebrationModal = () => {
        if (celebrationScreen) {
            celebrationScreen.style.display = "none";
        }
        resetComposerForm();
        showPanel("sent");
    };

    if (celebrationCloseBtn) {
        celebrationCloseBtn.addEventListener("click", closeCelebrationModal);
    }
    if (celebrationXBtn) {
        celebrationXBtn.addEventListener("click", closeCelebrationModal);
    }
    if (celebrationScreen) {
        celebrationScreen.addEventListener("click", (e) => {
            if (e.target === celebrationScreen) {
                closeCelebrationModal();
            }
        });
    }

    if (composerCancelBtn) {
        composerCancelBtn.addEventListener("click", () => {
            if (confirm("작성 중인 메일 내용이 저장되지 않고 소실됩니다. 작성 취소할까요?")) {
                resetComposerForm();
                showPanel("inbox");
            }
        });
    }

    const resetComposerForm = () => {
        if (inputTo) inputTo.value = "";
        if (inputSubject) inputSubject.value = "";
        const inputCc = document.getElementById("input-cc");
        if (inputCc) inputCc.value = "";
        const checkIndividual = document.getElementById("check-individual");
        if (checkIndividual) checkIndividual.checked = false;
        const checkImportant = document.getElementById("check-important");
        if (checkImportant) checkImportant.checked = false;

        if (inputBody) {
            inputBody.innerHTML = "";
            inputBody.innerText = "";
            inputBody.textContent = "";
            inputBody.style.fontWeight = "normal";
            inputBody.style.fontStyle = "normal";
            inputBody.style.textDecoration = "none";
            inputBody.style.color = "";
            inputBody.style.backgroundColor = "";
            inputBody.style.textAlign = "left";
            inputBody.style.fontSize = "14px";
            inputBody.style.fontFamily = "";
        }

        const edBtnBold = document.getElementById("ed-btn-bold");
        const edBtnItalic = document.getElementById("ed-btn-italic");
        const edBtnUnderline = document.getElementById("ed-btn-underline");
        const edBtnStrike = document.getElementById("ed-btn-strike");
        [edBtnBold, edBtnItalic, edBtnUnderline, edBtnStrike].forEach(btn => btn && btn.classList.remove("active"));
        
        document.querySelectorAll(".align-btn").forEach(btn => {
            btn.classList.toggle("active", btn.getAttribute("data-align") === "left");
        });
        
        const edFontSize = document.getElementById("ed-font-size");
        const edFontFamily = document.getElementById("ed-font-family");
        if (edFontSize) edFontSize.value = "14px";
        if (edFontFamily) edFontFamily.value = "'Noto Sans KR', sans-serif";

        const edColorText = document.getElementById("ed-color-text");
        if (edColorText) edColorText.value = "#333333";
        const textColorChar = document.querySelector(".text-color-char");
        if (textColorChar) {
            textColorChar.style.borderBottomColor = "#333333";
            textColorChar.style.color = "#333333";
        }
        const edColorBg = document.getElementById("ed-color-bg");
        if (edColorBg) edColorBg.value = "#ffffff";
        const markerIcon = document.querySelector(".bg-color-label i");
        if (markerIcon) markerIcon.style.color = "#555";

        // Reset attached files
        attachedMailFiles = [];
        updateAttachedFilesUI();
    };

    // ----------------------------------------------------
    // Selection Management (체크박스 및 전체선택)
    // ----------------------------------------------------
    const updateToolbarSelectAllUI = (toolbarCheckboxId, listContainerId) => {
        const toolbarCb = document.getElementById(toolbarCheckboxId);
        if (!toolbarCb) return;
        const list = document.getElementById(listContainerId);
        if (!list) return;
        const rows = list.querySelectorAll(".mail-row");
        if (rows.length === 0) {
            toolbarCb.innerHTML = '<i class="fa-regular fa-square"></i>';
            return;
        }
        const rowIds = Array.from(rows).map(r => r.getAttribute("data-id"));
        const allSelected = rowIds.length > 0 && rowIds.every(id => selectedMailIds.has(id));
        const someSelected = rowIds.some(id => selectedMailIds.has(id));

        if (allSelected) {
            toolbarCb.innerHTML = '<i class="fa-solid fa-square-check" style="color: #03c75a;"></i>';
        } else if (someSelected) {
            toolbarCb.innerHTML = '<i class="fa-regular fa-square-minus" style="color: #03c75a;"></i>';
        } else {
            toolbarCb.innerHTML = '<i class="fa-regular fa-square"></i>';
        }
    };

    const setupListSelectionHandlers = (listId, toolbarCheckboxId) => {
        const list = document.getElementById(listId);
        const toolbarCb = document.getElementById(toolbarCheckboxId);

        if (list) {
            list.addEventListener("click", (e) => {
                const checkCol = e.target.closest(".col-check");
                const starCol = e.target.closest(".col-star");
                const row = e.target.closest(".mail-row");
                if (!row) return;

                const mailId = row.getAttribute("data-id");

                if (checkCol) {
                    e.stopPropagation();
                    if (selectedMailIds.has(mailId)) {
                        selectedMailIds.delete(mailId);
                        row.classList.remove("selected");
                        checkCol.innerHTML = '<i class="fa-regular fa-square"></i>';
                    } else {
                        selectedMailIds.add(mailId);
                        row.classList.add("selected");
                        checkCol.innerHTML = '<i class="fa-solid fa-square-check" style="color: #03c75a;"></i>';
                    }
                    updateToolbarSelectAllUI(toolbarCheckboxId, listId);
                    return;
                }

                if (starCol) {
                    e.stopPropagation();
                    const starIcon = starCol.querySelector("i");
                    if (starIcon) {
                        const isStarred = starIcon.classList.contains("fa-solid");
                        if (isStarred) {
                            starIcon.className = "fa-regular fa-star";
                            starIcon.style.color = "";
                        } else {
                            starIcon.className = "fa-solid fa-star";
                            starIcon.style.color = "#ffb000";
                        }
                    }
                    return;
                }
            });
        }

        if (toolbarCb) {
            toolbarCb.addEventListener("click", () => {
                if (!list) return;
                const rows = list.querySelectorAll(".mail-row");
                if (rows.length === 0) return;

                const rowIds = Array.from(rows).map(r => r.getAttribute("data-id"));
                const allSelected = rowIds.length > 0 && rowIds.every(id => selectedMailIds.has(id));

                if (allSelected) {
                    rowIds.forEach(id => selectedMailIds.delete(id));
                    rows.forEach(r => {
                        r.classList.remove("selected");
                        const ck = r.querySelector(".col-check");
                        if (ck) ck.innerHTML = '<i class="fa-regular fa-square"></i>';
                    });
                } else {
                    rowIds.forEach(id => selectedMailIds.add(id));
                    rows.forEach(r => {
                        r.classList.add("selected");
                        const ck = r.querySelector(".col-check");
                        if (ck) ck.innerHTML = '<i class="fa-solid fa-square-check" style="color: #03c75a;"></i>';
                    });
                }
                updateToolbarSelectAllUI(toolbarCheckboxId, listId);
            });
        }
    };

    // ----------------------------------------------------
    // 4. Render Inbox, Sent & Trash Mail Box
    // ----------------------------------------------------
    const renderInboxRows = (allEmails) => {
        const inboxList = document.getElementById("inbox-list");
        if (!inboxList) return;

        const unreadCount = allEmails.filter(m => !m.is_read).length;
        
        const unreadCountBadge = document.querySelector("#folder-inbox-btn .badge-count");
        if (unreadCountBadge) unreadCountBadge.textContent = unreadCount;
        
        const unreadSidebarCount = document.getElementById("unread-sidebar-count");
        if (unreadSidebarCount) unreadSidebarCount.textContent = unreadCount;

        const inboxUnreadCount = document.getElementById("inbox-unread-count");
        if (inboxUnreadCount) inboxUnreadCount.textContent = unreadCount;

        const subtabUnreadCount = document.getElementById("subtab-unread-count");
        if (subtabUnreadCount) subtabUnreadCount.textContent = unreadCount;

        if (allMailCount) {
            allMailCount.textContent = allEmails.length;
        }

        // Apply filter: inboxFilterMode === "unread" shows only unread mails; "all" shows all mails
        const displayEmails = (inboxFilterMode === "unread")
            ? allEmails.filter(m => !m.is_read)
            : allEmails;

        if (displayEmails.length === 0) {
            const emptyText = (inboxFilterMode === "unread")
                ? "읽지 않은 메일이 없습니다."
                : "받은 메일이 없습니다.";
            inboxList.innerHTML = `
                <li class="empty-mailbox-li">
                    <div class="empty-mailbox-msg">
                        <i class="fa-regular fa-folder-open"></i>
                        <p>${emptyText}</p>
                    </div>
                </li>
            `;
            updateToolbarSelectAllUI("toolbar-select-all", "inbox-list");
            return;
        }

        inboxList.innerHTML = "";
        displayEmails.forEach((email) => {
            const isRead = email.is_read;
            const isSelected = selectedMailIds.has(String(email.id));
            const li = document.createElement("li");
            li.className = `mail-row${isRead ? "" : " unread"}${isSelected ? " selected" : ""}`;
            li.setAttribute("data-id", email.id);

            let timeStr = email.created;
            try {
                const dateObj = new Date(email.created.replace(" ", "T"));
                if (!isNaN(dateObj.getTime())) {
                    timeStr = dateObj.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }) + " " + dateObj.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
                }
            } catch (e) {}

            const readIcon = isRead 
                ? '<i class="fa-regular fa-envelope-open icon-mail-open"></i>' 
                : '<i class="fa-solid fa-envelope icon-unread-mail"></i>';

            const senderInfo = getSenderInfo(email.sender);
            const checkIcon = isSelected 
                ? '<i class="fa-solid fa-square-check" style="color: #03c75a;"></i>' 
                : '<i class="fa-regular fa-square"></i>';

            li.innerHTML = `
                <div class="col-check">${checkIcon}</div>
                <div class="col-star"><i class="fa-regular fa-star"></i></div>
                <div class="col-read-icon">${readIcon}</div>
                <div class="col-sender" title="${senderInfo.fullDisplay}"><strong>${senderInfo.name}</strong></div>
                <div class="col-subject">
                    <span class="subj-text">${email.subject}</span>
                    <i class="fa-solid fa-magnifying-glass icon-hover" title="본문 검색"></i>
                    <i class="fa-solid fa-arrow-up-right-from-square icon-hover" title="새 창으로 열기"></i>
                </div>
                <div class="col-time">${timeStr}</div>
            `;
            inboxList.appendChild(li);
        });
        updateToolbarSelectAllUI("toolbar-select-all", "inbox-list");
    };

    const renderInboxEmailsList = async () => {
        const inboxList = document.getElementById("inbox-list");
        if (!inboxList) return;

        try {
            const filterParam = buildEmailFilter('recipient', currentUserEmail);
            const response = await fetch(`${POCKETBASE_URL}/api/collections/mails/records?sort=-created&filter=${filterParam}`);
            if (!response.ok) throw new Error("API error");
            const data = await response.json();
            const trashedIds = getTrashMailIds();
            currentInboxEmails = (data.items || []).filter(m => !trashedIds.includes(String(m.id)));
            renderInboxRows(currentInboxEmails);
            updateTrashBadges();
        } catch (err) {
            console.error("Error fetching inbox emails:", err);
            inboxList.innerHTML = `
                <li class="empty-mailbox-li">
                    <div class="empty-mailbox-msg">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <p>메일을 불러오는 데 실패했습니다. 포켓베이스 서버 상태를 확인해 주세요.</p>
                    </div>
                </li>
            `;
        }
    };

    const renderSentEmailsList = async () => {
        if (!sentList) return;

        try {
            const filterParam = buildEmailFilter('sender', currentUserEmail);
            const response = await fetch(`${POCKETBASE_URL}/api/collections/mails/records?sort=-created&filter=${filterParam}`);
            if (!response.ok) throw new Error("API error");
            const data = await response.json();
            const trashedIds = getTrashMailIds();
            const emails = (data.items || []).filter(m => !trashedIds.includes(String(m.id)));
            currentSentEmails = emails;

            if (sentMailboxCount) sentMailboxCount.textContent = emails.length;
            if (sentMailCountSidebar) sentMailCountSidebar.textContent = emails.length;
            updateTrashBadges();

            if (emails.length === 0) {
                sentList.innerHTML = `
                    <li class="empty-mailbox-li">
                        <div class="empty-mailbox-msg">
                            <i class="fa-regular fa-folder-open"></i>
                            <p>보낸 메일이 없습니다. '메일 쓰기' 버튼을 눌러 첫 메일을 작성해 보세요!</p>
                        </div>
                    </li>
                `;
                updateToolbarSelectAllUI("toolbar-select-all-sent", "sent-list");
                return;
            }

            sentList.innerHTML = "";
            emails.forEach((email) => {
                const isSelected = selectedMailIds.has(String(email.id));
                const li = document.createElement("li");
                li.className = `mail-row${isSelected ? " selected" : ""}`;
                li.setAttribute("data-id", email.id);
                
                let timeStr = email.created;
                try {
                    const dateObj = new Date(email.created.replace(" ", "T"));
                    if (!isNaN(dateObj.getTime())) {
                        timeStr = dateObj.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }) + " " + dateObj.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
                    }
                } catch (e) {}

                const isRead = email.is_read;
                const receiptHtml = isRead 
                    ? `<div class="col-receipt read-receipt" title="상대방이 읽음"><i class="fa-regular fa-envelope-open receipt-icon"></i> ${timeStr}</div>`
                    : `<div class="col-receipt unread-receipt" title="상대방이 아직 읽지 않음">읽지않음</div>`;

                const recipientInfo = getSenderInfo(email.recipient);
                const checkIcon = isSelected 
                    ? '<i class="fa-solid fa-square-check" style="color: #03c75a;"></i>' 
                    : '<i class="fa-regular fa-square"></i>';

                li.innerHTML = `
                    <div class="col-check">${checkIcon}</div>
                    <div class="col-star"><i class="fa-regular fa-star"></i></div>
                    <div class="col-read-icon"><i class="fa-regular fa-envelope-open icon-mail-open"></i></div>
                    <div class="col-sender" title="${recipientInfo.fullDisplay}">${recipientInfo.name}</div>
                    <div class="col-subject">
                        <span class="subj-text">${email.subject}</span>
                        <i class="fa-solid fa-magnifying-glass icon-hover" title="본문 검색"></i>
                        <i class="fa-solid fa-arrow-up-right-from-square icon-hover" title="새 창으로 열기"></i>
                    </div>
                    <div class="col-time">${timeStr}</div>
                    ${receiptHtml}
                `;
                sentList.appendChild(li);
            });
            updateToolbarSelectAllUI("toolbar-select-all-sent", "sent-list");
        } catch (err) {
            console.error("Error fetching sent emails:", err);
            sentList.innerHTML = `
                <li class="empty-mailbox-li">
                    <div class="empty-mailbox-msg">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <p>메일을 불러오는 데 실패했습니다.</p>
                    </div>
                </li>
            `;
        }
    };

    const renderTrashEmailsList = () => {
        const trashList = document.getElementById("trash-list");
        if (!trashList) return;

        const trashMails = getTrashMails();
        updateTrashBadges();

        if (trashMails.length === 0) {
            trashList.innerHTML = `
                <li class="empty-mailbox-li">
                    <div class="empty-mailbox-msg">
                        <i class="fa-regular fa-trash-can"></i>
                        <p>휴지통이 비어 있습니다.</p>
                    </div>
                </li>
            `;
            updateToolbarSelectAllUI("toolbar-select-all-trash", "trash-list");
            return;
        }

        trashList.innerHTML = "";
        trashMails.forEach(email => {
            const isSelected = selectedMailIds.has(String(email.id));
            const li = document.createElement("li");
            li.className = `mail-row${isSelected ? " selected" : ""}`;
            li.setAttribute("data-id", email.id);

            let timeStr = email.created || "";
            try {
                const dateObj = new Date(String(email.created).replace(" ", "T"));
                if (!isNaN(dateObj.getTime())) {
                    timeStr = dateObj.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }) + " " + dateObj.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
                }
            } catch (e) {}

            const senderInfo = getSenderInfo(email.sender);
            const checkIcon = isSelected 
                ? '<i class="fa-solid fa-square-check" style="color: #03c75a;"></i>' 
                : '<i class="fa-regular fa-square"></i>';

            li.innerHTML = `
                <div class="col-check">${checkIcon}</div>
                <div class="col-star"><i class="fa-regular fa-star"></i></div>
                <div class="col-read-icon"><i class="fa-regular fa-envelope-open icon-mail-open"></i></div>
                <div class="col-sender" title="${senderInfo.fullDisplay}"><strong>${senderInfo.name}</strong></div>
                <div class="col-subject">
                    <span class="subj-text">${email.subject || '(제목 없음)'}</span>
                </div>
                <div class="col-time">${timeStr}</div>
            `;
            trashList.appendChild(li);
        });
        updateToolbarSelectAllUI("toolbar-select-all-trash", "trash-list");
    };

    const renderReceiptEmailsList = async () => {
        if (!receiptList) return;

        try {
            const filterParam = buildEmailFilter('sender', currentUserEmail);
            const response = await fetch(`${POCKETBASE_URL}/api/collections/mails/records?sort=-created&filter=${filterParam}`);
            if (!response.ok) throw new Error("API error");
            const data = await response.json();
            const emails = data.items || [];

            if (receiptMailboxCount) receiptMailboxCount.textContent = emails.length;

            if (emails.length === 0) {
                receiptList.innerHTML = `
                    <li class="empty-mailbox-li">
                        <div class="empty-mailbox-msg">
                            <i class="fa-regular fa-folder-open"></i>
                            <p>수신확인할 메일이 없습니다.</p>
                        </div>
                    </li>
                `;
                return;
            }

            receiptList.innerHTML = "";
            emails.forEach((email) => {
                const li = document.createElement("li");
                li.className = "mail-row";
                li.setAttribute("data-id", email.id);
                
                let timeStr = email.created;
                try {
                    const dateObj = new Date(email.created.replace(" ", "T"));
                    if (!isNaN(dateObj.getTime())) {
                        timeStr = dateObj.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }) + " " + dateObj.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
                    }
                } catch (e) {}

                const isRead = email.is_read;
                const receiptHtml = isRead 
                    ? `<div class="col-receipt read-receipt" title="상대방이 읽음"><i class="fa-regular fa-envelope-open receipt-icon"></i> ${timeStr}</div>`
                    : `<div class="col-receipt unread-receipt" title="상대방이 아직 읽지 않음">읽지않음</div>`;

                const recipientInfo = getSenderInfo(email.recipient);

                li.innerHTML = `
                    <div class="col-check"><i class="fa-regular fa-square"></i></div>
                    <div class="col-star"><i class="fa-regular fa-star"></i></div>
                    <div class="col-read-icon"><i class="fa-solid fa-user-check" style="color: #9aa0a6; font-size: 13px;"></i></div>
                    <div class="col-sender" title="${recipientInfo.fullDisplay}">${recipientInfo.name}</div>
                    <div class="col-subject">
                        <span class="subj-text">${email.subject}</span>
                        <i class="fa-solid fa-magnifying-glass icon-hover" title="본문 검색"></i>
                        <i class="fa-solid fa-arrow-up-right-from-square icon-hover" title="새 창으로 열기"></i>
                    </div>
                    <div class="col-time">${timeStr}</div>
                    ${receiptHtml}
                `;
                receiptList.appendChild(li);
            });
        } catch (err) {
            console.error("Error fetching receipt emails:", err);
            receiptList.innerHTML = `
                <li class="empty-mailbox-li">
                    <div class="empty-mailbox-msg">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <p>수신확인 목록을 불러오는 데 실패했습니다.</p>
                    </div>
                </li>
            `;
        }
    };

    // ----------------------------------------------------
    // 5. Interactive Details for new Compose Page widgets
    // ----------------------------------------------------
    const contactsBtn = document.querySelector(".contacts-btn");
    if (contactsBtn) {
        contactsBtn.addEventListener("click", () => {
            if (inputTo) {
                inputTo.value = "teacher@school.net";
            }
        });
    }

    const fileDropZone = document.querySelector(".file-drop-zone");
    const btnAttachMyPc = document.getElementById("btn-attach-my-pc");
    if (fileDropZone) {
        // Create hidden input element
        const hiddenFileInput = document.createElement("input");
        hiddenFileInput.type = "file";
        hiddenFileInput.multiple = true;
        hiddenFileInput.style.display = "none";
        document.body.appendChild(hiddenFileInput);

        fileDropZone.addEventListener("click", () => {
            hiddenFileInput.click();
        });

        if (btnAttachMyPc) {
            btnAttachMyPc.addEventListener("click", (e) => {
                e.preventDefault();
                hiddenFileInput.click();
            });
        }

        hiddenFileInput.addEventListener("change", () => {
            if (hiddenFileInput.files && hiddenFileInput.files.length > 0) {
                addMailFiles(hiddenFileInput.files);
                hiddenFileInput.value = "";
            }
        });

        // Drag and drop events
        fileDropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.stopPropagation();
            fileDropZone.classList.add("dragover");
        });

        fileDropZone.addEventListener("dragleave", (e) => {
            e.preventDefault();
            e.stopPropagation();
            fileDropZone.classList.remove("dragover");
        });

        fileDropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            e.stopPropagation();
            fileDropZone.classList.remove("dragover");
            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                addMailFiles(e.dataTransfer.files);
            }
        });
    }

    // Interactive Rich Text Formatting Controls for Block Selection
    let savedRange = null;
    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            if (inputBody && inputBody.contains(range.commonAncestorContainer)) {
                savedRange = range.cloneRange();
            }
        }
    };

    const restoreSelection = () => {
        if (savedRange) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(savedRange);
        }
    };

    if (inputBody) {
        inputBody.addEventListener("keyup", saveSelection);
        inputBody.addEventListener("mouseup", saveSelection);
        inputBody.addEventListener("touchend", saveSelection);
        inputBody.addEventListener("input", saveSelection);
    }

    const execFormat = (command, value = null) => {
        if (!inputBody) return;
        inputBody.focus();
        restoreSelection();
        document.execCommand('styleWithCSS', false, true);
        document.execCommand(command, false, value);
        saveSelection();
    };

    const edBtnBold = document.getElementById("ed-btn-bold");
    const edBtnItalic = document.getElementById("ed-btn-italic");
    const edBtnUnderline = document.getElementById("ed-btn-underline");
    const edBtnStrike = document.getElementById("ed-btn-strike");

    [edBtnBold, edBtnItalic, edBtnUnderline, edBtnStrike].forEach(btn => {
        if (btn) {
            btn.addEventListener("mousedown", (e) => e.preventDefault());
        }
    });

    if (edBtnBold) {
        edBtnBold.addEventListener("click", () => execFormat("bold"));
    }
    if (edBtnItalic) {
        edBtnItalic.addEventListener("click", () => execFormat("italic"));
    }
    if (edBtnUnderline) {
        edBtnUnderline.addEventListener("click", () => execFormat("underline"));
    }
    if (edBtnStrike) {
        edBtnStrike.addEventListener("click", () => execFormat("strikeThrough"));
    }

    const edFontFamily = document.getElementById("ed-font-family");
    if (edFontFamily) {
        edFontFamily.addEventListener("change", () => {
            const family = edFontFamily.value;
            execFormat("fontName", family);
        });
    }

    const edFontSize = document.getElementById("ed-font-size");
    if (edFontSize) {
        edFontSize.addEventListener("change", () => {
            const size = edFontSize.value;
            if (!inputBody) return;
            inputBody.focus();
            restoreSelection();

            const sel = window.getSelection();
            if (sel.rangeCount > 0 && !sel.isCollapsed) {
                document.execCommand("styleWithCSS", false, true);
                document.execCommand("fontSize", false, "7");
                const fonts = inputBody.querySelectorAll("font[size='7']");
                fonts.forEach(f => {
                    const span = document.createElement("span");
                    span.style.fontSize = size;
                    span.innerHTML = f.innerHTML;
                    f.parentNode.replaceChild(span, f);
                });
            } else {
                inputBody.style.fontSize = size;
            }
            saveSelection();
        });
    }

    const edColorText = document.getElementById("ed-color-text");
    const textColorChar = document.querySelector(".text-color-char");
    if (edColorText) {
        edColorText.addEventListener("input", () => {
            const color = edColorText.value;
            execFormat("foreColor", color);
            if (textColorChar) {
                textColorChar.style.borderBottomColor = color;
                textColorChar.style.color = color;
            }
        });
    }

    const edColorBg = document.getElementById("ed-color-bg");
    const markerIcon = document.querySelector(".bg-color-label i");
    if (edColorBg) {
        edColorBg.addEventListener("input", () => {
            const color = edColorBg.value;
            execFormat("hiliteColor", color);
            if (markerIcon) {
                markerIcon.style.color = color === "#ffffff" ? "#555" : color;
            }
        });
    }

    const alignBtns = document.querySelectorAll(".align-btn");
    if (alignBtns) {
        alignBtns.forEach(btn => {
            btn.addEventListener("mousedown", (e) => e.preventDefault());
            btn.addEventListener("click", () => {
                alignBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const align = btn.getAttribute("data-align") || "left";
                if (align === "left") execFormat("justifyLeft");
                else if (align === "center") execFormat("justifyCenter");
                else if (align === "right") execFormat("justifyRight");
            });
        });
    }

    // Helper to open mail detail view
    let currentDetailEmail = null;

    const openMailDetail = async (mailId) => {
        try {
            let email = getTrashMails().find(m => String(m.id) === String(mailId));
            if (!email) {
                const response = await fetch(`${POCKETBASE_URL}/api/collections/mails/records/${mailId}`);
                if (!response.ok) throw new Error("Failed to load mail details");
                email = await response.json();
            }
            currentDetailEmail = email;

            // Set folder title dynamically (< 받은메일함, < 전체메일, < 보낸메일함 등)
            const detailFolderTitle = document.getElementById("detail-folder-title");
            if (detailFolderTitle) {
                if (currentPanel === "sent") {
                    detailFolderTitle.textContent = "보낸메일함";
                } else if (currentPanel === "receipt") {
                    detailFolderTitle.textContent = "수신확인";
                } else if (currentPanel === "all") {
                    detailFolderTitle.textContent = "전체메일";
                } else if (currentPanel === "trash") {
                    detailFolderTitle.textContent = "휴지통";
                } else {
                    detailFolderTitle.textContent = "받은메일함";
                }
            }

            const senderInfo = getSenderInfo(email.sender);
            const recipientInfo = getSenderInfo(email.recipient);

            // Populate detail view fields
            const detailSubject = document.getElementById("detail-subject");
            if (detailSubject) detailSubject.textContent = email.subject || "제목 없음";

            const detailSenderName = document.getElementById("detail-sender-name");
            const detailSenderEmail = document.getElementById("detail-sender-email");
            if (detailSenderName) detailSenderName.textContent = senderInfo.name;
            if (detailSenderEmail) detailSenderEmail.textContent = senderInfo.email;

            const detailRecipientName = document.getElementById("detail-recipient-name");
            const detailRecipientEmail = document.getElementById("detail-recipient-email");
            if (detailRecipientName) detailRecipientName.textContent = recipientInfo.name;
            if (detailRecipientEmail) detailRecipientEmail.textContent = recipientInfo.email;

            const detailTime = document.getElementById("detail-time");
            if (detailTime) {
                detailTime.textContent = formatKoreanDate(email.created);
            }

            let cleanBody = email.body || "";
            let attachments = [];
            let metaAttachments = [];

            // 1. Parse original attachment metadata if present
            const metaMatch = cleanBody.match(/class="eduver-attach-meta">([^<]+)<\/script>/);
            if (metaMatch && metaMatch[1]) {
                try {
                    metaAttachments = JSON.parse(decodeURIComponent(metaMatch[1]));
                } catch (e) {
                    console.error("Failed to parse attach meta:", e);
                }
                cleanBody = cleanBody.replace(/<!-- EDUVER_ATTACH_META_START -->[\s\S]*?<!-- EDUVER_ATTACH_META_END -->/g, "")
                                     .replace(/<script[^>]*class="eduver-attach-meta"[\s\S]*?<\/script>/g, "");
            }

            // Fallback for older inline data attachments
            const attachMatch = cleanBody.match(/class="eduver-mail-attachments-data"[^>]*data-attachments="([^"]+)"/);
            if (attachMatch && attachMatch[1]) {
                try {
                    attachments = JSON.parse(decodeURIComponent(attachMatch[1]));
                } catch(e) {
                    console.error("Failed to parse legacy attachments:", e);
                }
                cleanBody = cleanBody.replace(/<!-- EDUVER_ATTACHMENTS_START -->[\s\S]*?<!-- EDUVER_ATTACHMENTS_END -->/g, "")
                                     .replace(/<div class="eduver-mail-attachments-data"[\s\S]*?<\/div>/g, "");
            }

            // 2. PocketBase default file field support (Mapped with exact original names & sizes)
            const pbFiles = Array.isArray(email.attachments) ? email.attachments : (email.attachments ? [email.attachments] : []);
            pbFiles.forEach((fname, idx) => {
                const meta = metaAttachments[idx] || {};
                const displayName = meta.name || fname.replace(/_[a-zA-Z0-9]{10}(\.[^.]+)$/, '$1');
                const fileSize = meta.size || null;

                if (!attachments.some(a => a.originalFileName === fname || a.name === displayName)) {
                    attachments.push({
                        name: displayName,
                        originalFileName: fname,
                        size: fileSize,
                        url: `${POCKETBASE_URL}/api/files/${email.collectionId || 'mails'}/${email.id}/${fname}?download=1`
                    });
                }
            });

            const detailBody = document.getElementById("detail-body");
            if (detailBody) {
                detailBody.innerHTML = cleanBody;
            }

            // Render Attachments in Detail View (Naver Mail Style)
            const detailAttachBox = document.getElementById("detail-attachments-box");
            const detailAttachCount = document.getElementById("detail-attach-count");
            const detailAttachTotalSize = document.getElementById("detail-attach-total-size");
            const detailAttachList = document.getElementById("detail-attach-list");

            if (detailAttachBox) {
                if (attachments && attachments.length > 0) {
                    detailAttachBox.style.display = "block";
                    if (detailAttachCount) detailAttachCount.textContent = attachments.length;
                    const totalAttachBytes = attachments.reduce((acc, a) => acc + (a.size || 0), 0);
                    if (detailAttachTotalSize) {
                        detailAttachTotalSize.textContent = totalAttachBytes > 0 ? formatFileSize(totalAttachBytes) : `${attachments.length}개 파일`;
                    }

                    if (detailAttachList) {
                        detailAttachList.innerHTML = attachments.map((att, idx) => {
                            const iconInfo = getFileIconInfo(att.name);
                            const sizeText = att.size ? formatFileSize(att.size) : '';
                            return `
                                <div class="detail-attach-item">
                                    <div class="detail-attach-left">
                                        <div class="detail-attach-badge" style="background-color: ${iconInfo.bg}; color: ${iconInfo.color};">
                                            <i class="${iconInfo.icon}"></i>
                                        </div>
                                        <span class="detail-attach-name" title="${att.name}">${att.name}</span>
                                        ${sizeText ? `<span class="detail-attach-size">${sizeText}</span>` : ''}
                                    </div>
                                    <div class="detail-attach-actions">
                                        <button type="button" class="btn-attach-download" data-index="${idx}">
                                            <i class="fa-solid fa-download"></i> PC 저장
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join("");

                        detailAttachList.querySelectorAll(".btn-attach-download").forEach(btn => {
                            btn.addEventListener("click", async (e) => {
                                e.preventDefault();
                                const idx = parseInt(btn.getAttribute("data-index"), 10);
                                const item = attachments[idx];
                                if (!item) return;

                                const originalBtnHtml = btn.innerHTML;
                                try {
                                    btn.disabled = true;
                                    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 저장 중...';

                                    let downloadUrl = "";
                                    let needRevoke = false;

                                    if (item.data) {
                                        downloadUrl = item.data;
                                    } else if (item.url) {
                                        // Fetch as blob so browser strictly enforces original filename (bypassing Cross-Origin a.download restriction)
                                        const res = await fetch(item.url);
                                        if (!res.ok) throw new Error("파일 다운로드 실패");
                                        const blob = await res.blob();
                                        downloadUrl = window.URL.createObjectURL(blob);
                                        needRevoke = true;
                                    }

                                    if (downloadUrl) {
                                        const a = document.createElement("a");
                                        a.href = downloadUrl;
                                        a.download = item.name; // Force exact original filename
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);

                                        if (needRevoke) {
                                            setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 20000);
                                        }
                                    }
                                } catch (err) {
                                    console.error("Download error:", err);
                                    if (item.url) {
                                        window.open(item.url, '_blank');
                                    } else {
                                        alert("파일을 다운로드하지 못했습니다.");
                                    }
                                } finally {
                                    btn.disabled = false;
                                    btn.innerHTML = originalBtnHtml;
                                }
                            });
                        });
                    }
                } else {
                    detailAttachBox.style.display = "none";
                    if (detailAttachList) detailAttachList.innerHTML = "";
                }
            }

            // Configure action buttons in detail view
            const deleteBtn = document.getElementById("detail-delete-btn");
            if (deleteBtn) {
                deleteBtn.setAttribute("data-id", email.id);
                deleteBtn.textContent = (currentPanel === "trash") ? "영구삭제" : "삭제";
            }

            const restoreBtn = document.getElementById("detail-restore-btn");
            if (restoreBtn) {
                restoreBtn.style.display = (currentPanel === "trash") ? "inline-flex" : "none";
            }

            // Reset star button state
            const detailStarBtn = document.getElementById("detail-star-btn");
            if (detailStarBtn) {
                detailStarBtn.classList.remove("active");
                const icon = detailStarBtn.querySelector("i");
                if (icon) icon.className = "fa-regular fa-star";
            }

            showPanel("detail");
        } catch (err) {
            console.error("Error opening mail detail:", err);
            alert("메일 내용을 불러오지 못했습니다.");
        }
    };

    // Mail list row unread/read toggle and detail view on click
    const inboxList = document.getElementById("inbox-list");
    if (inboxList) {
        inboxList.addEventListener("click", async (e) => {
            const row = e.target.closest(".mail-row");
            if (!row) return;

            // If user clicked check or star columns, do not open detail
            if (e.target.closest(".col-check") || e.target.closest(".col-star")) {
                return;
            }

            const mailId = row.getAttribute("data-id");

            if (row.classList.contains("unread")) {
                try {
                    const response = await fetch(`${POCKETBASE_URL}/api/collections/mails/records/${mailId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ is_read: true })
                    });
                    if (!response.ok) throw new Error("PATCH failed");

                    row.classList.remove("unread");
                    const icon = row.querySelector(".col-read-icon i");
                    if (icon) {
                        icon.className = "fa-regular fa-envelope-open icon-mail-open";
                    }
                    
                    const countBadge = document.querySelector("#folder-inbox-btn .badge-count");
                    const countSidebar = document.getElementById("unread-sidebar-count");
                    const countToolbar = document.getElementById("inbox-unread-count");
                    const countSubtab = document.getElementById("subtab-unread-count");
                    [countBadge, countSidebar, countToolbar, countSubtab].forEach(el => {
                        if (el) {
                            const val = parseInt(el.textContent);
                            if (val > 0) el.textContent = val - 1;
                        }
                    });
                } catch (err) {
                    console.error("Error patching read state:", err);
                }
            }

            // Open Detail View
            if (mailId) {
                await openMailDetail(mailId);
            }
        });
    }

    // Sent mail list row click for detail view
    if (sentList) {
        sentList.addEventListener("click", async (e) => {
            const row = e.target.closest(".mail-row");
            if (!row) return;

            // If user clicked check or star columns, do not open detail
            if (e.target.closest(".col-check") || e.target.closest(".col-star")) {
                return;
            }

            const mailId = row.getAttribute("data-id");
            if (mailId) {
                await openMailDetail(mailId);
            }
        });
    }

    // Receipt confirmation list row click for detail view
    if (receiptList) {
        receiptList.addEventListener("click", async (e) => {
            const row = e.target.closest(".mail-row");
            if (!row) return;

            // If user clicked check or star columns, do not open detail
            if (e.target.closest(".col-check") || e.target.closest(".col-star")) {
                return;
            }

            const mailId = row.getAttribute("data-id");
            if (mailId) {
                await openMailDetail(mailId);
            }
        });
    }

    // Trash list row click for detail view
    if (trashList) {
        trashList.addEventListener("click", async (e) => {
            const row = e.target.closest(".mail-row");
            if (!row) return;

            // If user clicked check or star columns, do not open detail
            if (e.target.closest(".col-check") || e.target.closest(".col-star")) {
                return;
            }

            const mailId = row.getAttribute("data-id");
            if (mailId) {
                await openMailDetail(mailId);
            }
        });
    }

    // Detail panel action buttons
    const detailBackBtn = document.getElementById("detail-back-btn");
    const detailBackTopBtn = document.getElementById("detail-back-top-btn");
    const handleDetailBack = () => {
        showPanel(currentPanel);
    };
    if (detailBackBtn) detailBackBtn.addEventListener("click", handleDetailBack);
    if (detailBackTopBtn) detailBackTopBtn.addEventListener("click", handleDetailBack);

    // Detail star button toggle
    const detailStarBtn = document.getElementById("detail-star-btn");
    if (detailStarBtn) {
        detailStarBtn.addEventListener("click", () => {
            detailStarBtn.classList.toggle("active");
            const icon = detailStarBtn.querySelector("i");
            if (icon) {
                if (detailStarBtn.classList.contains("active")) {
                    icon.className = "fa-solid fa-star";
                } else {
                    icon.className = "fa-regular fa-star";
                }
            }
        });
    }

    // Reply function
    const handleReply = (isReplyAll = false) => {
        if (!currentDetailEmail) return;

        resetComposerForm();
        
        const senderInfo = getSenderInfo(currentDetailEmail.sender);
        const recipientInfo = getSenderInfo(currentDetailEmail.recipient);
        const formattedTime = formatKoreanDate(currentDetailEmail.created);

        // If reply: To = original sender; If replyAll: To = sender + recipient
        if (inputTo) {
            inputTo.value = senderInfo.email || currentDetailEmail.sender;
        }

        // Subject: Re: [Original Subject]
        if (inputSubject) {
            const origSubj = currentDetailEmail.subject || "";
            inputSubject.value = origSubj.startsWith("Re:") ? origSubj : `Re: ${origSubj}`;
        }

        // Quoted Body
        if (inputBody) {
            inputBody.innerHTML = `<br><br><div style="border-left: 2px solid #ccc; padding-left: 10px; margin-top: 20px; color: #666; font-size: 13px;">
                <p style="margin: 0 0 6px 0;"><strong>----- 원본 메일 -----</strong></p>
                <p style="margin: 0 0 4px 0;"><strong>보낸사람:</strong> ${senderInfo.fullDisplay}</p>
                <p style="margin: 0 0 4px 0;"><strong>받는사람:</strong> ${recipientInfo.fullDisplay}</p>
                <p style="margin: 0 0 4px 0;"><strong>날짜:</strong> ${formattedTime}</p>
                <p style="margin: 0 0 10px 0;"><strong>제목:</strong> ${currentDetailEmail.subject}</p>
                <div>${currentDetailEmail.body || ""}</div>
            </div>`;
        }

        showPanel("compose");
        setTimeout(() => {
            if (inputBody) {
                inputBody.focus();
            }
        }, 100);
    };

    const detailReplyBtn = document.getElementById("detail-reply-btn");
    if (detailReplyBtn) {
        detailReplyBtn.addEventListener("click", () => handleReply(false));
    }

    const detailReplyAllBtn = document.getElementById("detail-reply-all-btn");
    if (detailReplyAllBtn) {
        detailReplyAllBtn.addEventListener("click", () => handleReply(true));
    }

    const detailForwardBtn = document.getElementById("detail-forward-btn");
    if (detailForwardBtn) {
        detailForwardBtn.addEventListener("click", () => {
            if (!currentDetailEmail) return;
            resetComposerForm();
            if (inputSubject) {
                const origSubj = currentDetailEmail.subject || "";
                inputSubject.value = origSubj.startsWith("Fwd:") ? origSubj : `Fwd: ${origSubj}`;
            }
            if (inputBody) {
                const senderInfo = getSenderInfo(currentDetailEmail.sender);
                const recipientInfo = getSenderInfo(currentDetailEmail.recipient);
                const formattedTime = formatKoreanDate(currentDetailEmail.created);

                inputBody.innerHTML = `<br><br><div style="border-left: 2px solid #ccc; padding-left: 10px; margin-top: 20px; color: #666; font-size: 13px;">
                    <p style="margin: 0 0 6px 0;"><strong>----- 전달된 메일 -----</strong></p>
                    <p style="margin: 0 0 4px 0;"><strong>보낸사람:</strong> ${senderInfo.fullDisplay}</p>
                    <p style="margin: 0 0 4px 0;"><strong>받는사람:</strong> ${recipientInfo.fullDisplay}</p>
                    <p style="margin: 0 0 4px 0;"><strong>날짜:</strong> ${formattedTime}</p>
                    <p style="margin: 0 0 10px 0;"><strong>제목:</strong> ${currentDetailEmail.subject}</p>
                    <div>${currentDetailEmail.body || ""}</div>
                </div>`;
            }
            showPanel("compose");
            if (inputTo) inputTo.focus();
        });
    }

    const detailMarkUnreadBtn = document.getElementById("detail-mark-unread-btn");
    if (detailMarkUnreadBtn) {
        detailMarkUnreadBtn.addEventListener("click", async () => {
            if (!currentDetailEmail) return;
            try {
                const response = await fetch(`${POCKETBASE_URL}/api/collections/mails/records/${currentDetailEmail.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_read: false })
                });
                if (!response.ok) throw new Error("PATCH failed");
                alert("안 읽은 메일로 변경되었습니다.");
                showPanel(currentPanel);
            } catch (err) {
                console.error("Error setting unread:", err);
                alert("상태 변경에 실패했습니다.");
            }
        });
    }

    const detailDeleteBtn = document.getElementById("detail-delete-btn");
    if (detailDeleteBtn) {
        detailDeleteBtn.addEventListener("click", async () => {
            if (!currentDetailEmail) return;
            const mailId = String(currentDetailEmail.id);
            if (currentPanel === "trash") {
                if (confirm("휴지통에서 완전히 삭제하시겠습니까? 삭제된 메일은 복구할 수 없습니다.")) {
                    await permanentlyDeleteFromTrash([mailId]);
                    alert("메일이 영구 삭제되었습니다.");
                    showPanel("trash");
                }
            } else {
                if (confirm("이 메일을 휴지통으로 이동하시겠습니까?")) {
                    moveToTrash([currentDetailEmail], currentPanel);
                    showPanel(currentPanel);
                }
            }
        });
    }

    const detailRestoreBtn = document.getElementById("detail-restore-btn");
    if (detailRestoreBtn) {
        detailRestoreBtn.addEventListener("click", () => {
            if (!currentDetailEmail) return;
            const mailId = String(currentDetailEmail.id);
            restoreFromTrash([mailId]);
            alert("메일을 복구했습니다.");
            showPanel("trash");
        });
    }

    // ----------------------------------------------------
    // Toolbar Actions (삭제, 읽음, 복구, 비우기)
    // ----------------------------------------------------
    const btnToolbarDelete = document.getElementById("btn-toolbar-delete");
    if (btnToolbarDelete) {
        btnToolbarDelete.addEventListener("click", () => {
            if (selectedMailIds.size === 0) {
                alert("삭제할 메일을 선택해주세요.");
                return;
            }
            const mailsToMove = currentInboxEmails.filter(m => selectedMailIds.has(String(m.id)));
            if (mailsToMove.length === 0) {
                alert("선택된 메일 정보가 없습니다.");
                return;
            }
            if (confirm(`선택한 ${mailsToMove.length}개의 메일을 휴지통으로 이동하시겠습니까?`)) {
                moveToTrash(mailsToMove, "inbox");
                selectedMailIds.clear();
                renderInboxEmailsList();
            }
        });
    }

    const btnToolbarRead = document.getElementById("btn-toolbar-read");
    if (btnToolbarRead) {
        btnToolbarRead.addEventListener("click", async () => {
            if (selectedMailIds.size === 0) {
                alert("읽음 처리할 메일을 선택해주세요.");
                return;
            }
            const ids = Array.from(selectedMailIds);
            for (const id of ids) {
                try {
                    await fetch(`${POCKETBASE_URL}/api/collections/mails/records/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ is_read: true })
                    });
                } catch (e) {
                    console.error("Failed to mark as read:", id, e);
                }
            }
            selectedMailIds.clear();
            renderInboxEmailsList();
        });
    }

    const deleteUnreadBtn = document.querySelector(".delete-unread-btn");
    if (deleteUnreadBtn) {
        deleteUnreadBtn.addEventListener("click", () => {
            const unreadMails = currentInboxEmails.filter(m => !m.is_read);
            if (unreadMails.length === 0) {
                alert("안 읽은 메일이 없습니다.");
                return;
            }
            if (confirm(`안 읽은 메일 ${unreadMails.length}개를 휴지통으로 이동하시겠습니까?`)) {
                moveToTrash(unreadMails, "inbox");
                selectedMailIds.clear();
                renderInboxEmailsList();
            }
        });
    }

    const btnSentToolbarDelete = document.getElementById("btn-sent-toolbar-delete");
    if (btnSentToolbarDelete) {
        btnSentToolbarDelete.addEventListener("click", () => {
            if (selectedMailIds.size === 0) {
                alert("삭제할 메일을 선택해주세요.");
                return;
            }
            const mailsToMove = currentSentEmails.filter(m => selectedMailIds.has(String(m.id)));
            if (mailsToMove.length === 0) {
                alert("선택된 메일 정보가 없습니다.");
                return;
            }
            if (confirm(`선택한 ${mailsToMove.length}개의 메일을 휴지통으로 이동하시겠습니까?`)) {
                moveToTrash(mailsToMove, "sent");
                selectedMailIds.clear();
                renderSentEmailsList();
            }
        });
    }

    const btnTrashRestore = document.getElementById("btn-trash-restore");
    if (btnTrashRestore) {
        btnTrashRestore.addEventListener("click", () => {
            if (selectedMailIds.size === 0) {
                alert("복구할 메일을 선택해주세요.");
                return;
            }
            const ids = Array.from(selectedMailIds);
            restoreFromTrash(ids);
            selectedMailIds.clear();
            alert(`${ids.length}개의 메일을 복구했습니다.`);
            renderTrashEmailsList();
            renderInboxEmailsList();
            renderSentEmailsList();
        });
    }

    const btnTrashDelete = document.getElementById("btn-trash-delete");
    if (btnTrashDelete) {
        btnTrashDelete.addEventListener("click", async () => {
            if (selectedMailIds.size === 0) {
                alert("영구 삭제할 메일을 선택해주세요.");
                return;
            }
            const ids = Array.from(selectedMailIds);
            if (confirm(`선택한 ${ids.length}개의 메일을 영구히 삭제하시겠습니까? 삭제된 메일은 복구할 수 없습니다.`)) {
                await permanentlyDeleteFromTrash(ids);
                selectedMailIds.clear();
                alert("메일이 영구 삭제되었습니다.");
                renderTrashEmailsList();
            }
        });
    }

    const btnTrashEmpty = document.getElementById("btn-trash-empty");
    if (btnTrashEmpty) {
        btnTrashEmpty.addEventListener("click", async () => {
            const trashMails = getTrashMails();
            if (trashMails.length === 0) {
                alert("휴지통이 이미 비어 있습니다.");
                return;
            }
            if (confirm(`휴지통의 모든 메일(${trashMails.length}개)을 비우시겠습니까? 삭제된 메일은 복구할 수 없습니다.`)) {
                const ids = trashMails.map(m => String(m.id));
                await permanentlyDeleteFromTrash(ids);
                selectedMailIds.clear();
                alert("휴지통을 비웠습니다.");
                renderTrashEmailsList();
            }
        });
    }

    // Initialize list selection listeners
    setupListSelectionHandlers("inbox-list", "toolbar-select-all");
    setupListSelectionHandlers("sent-list", "toolbar-select-all-sent");
    setupListSelectionHandlers("trash-list", "toolbar-select-all-trash");

    // Initial fetch of directory, received emails, trash badge & sent email counts on DOM load
    updateTrashBadges();
    showPanel("inbox", "all");
    renderSentEmailsList();
    loadUserDirectory().then(() => {
        renderInboxEmailsList();
    });
});

