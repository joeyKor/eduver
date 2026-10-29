/**
 * EDUVER Cafe Home Logic (cafe.js)
 * Manages Cafe Feeds, My Cafe List, Favorites, Search, and New Post/Cafe creation.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial State & Sync User Info
    const loggedInUser = localStorage.getItem("naverLoggedInUser") || 
                         localStorage.getItem("naverLoggedInUsername") || 
                         localStorage.getItem("naverLoggedInUserId") || "";
    const isAuth = (localStorage.getItem("naverIsLoggedIn") === "true") || Boolean(loggedInUser);
    let userAvatar = "default-avatar.svg";

    const cafeUserProfileBadge = document.getElementById("cafe-user-profile-badge");
    const cafeUsernameEl = document.getElementById("cafe-username");
    const cardUserNameEl = document.getElementById("card-user-name");
    const cafeAvatarImg = document.getElementById("cafe-avatar-img");
    const cardAvatarImg = document.getElementById("card-avatar-img");
    const cafeLoggedInBox = document.getElementById("cafe-logged-in-box");
    const cafeLoggedOutBox = document.getElementById("cafe-logged-out-box");

    if (isAuth && loggedInUser) {
        const formattedName = loggedInUser.endsWith("님") ? loggedInUser : `${loggedInUser}님`;
        if (cafeUsernameEl) cafeUsernameEl.textContent = formattedName;
        if (cardUserNameEl) cardUserNameEl.textContent = formattedName;
        if (cafeAvatarImg) cafeAvatarImg.src = userAvatar;
        if (cardAvatarImg) cardAvatarImg.src = userAvatar;
        if (cafeUserProfileBadge) cafeUserProfileBadge.style.display = "flex";
        if (cafeLoggedInBox) cafeLoggedInBox.style.display = "block";
        if (cafeLoggedOutBox) cafeLoggedOutBox.style.display = "none";

        // Async fetch from PocketBase users collection
        fetch(`https://pb.joyfamkr.synology.me/api/collections/users/records?filter=(name='${encodeURIComponent(loggedInUser)}'||username='${encodeURIComponent(loggedInUser)}')`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.items && data.items.length > 0 && data.items[0].avatarUrl) {
                    const realAvatar = data.items[0].avatarUrl;
                    if (cafeAvatarImg) cafeAvatarImg.src = realAvatar;
                    if (cardAvatarImg) cardAvatarImg.src = realAvatar;
                }
            })
            .catch(err => console.warn("Cafe avatar sync failed:", err));
    } else {
        if (cafeUserProfileBadge) {
            cafeUserProfileBadge.innerHTML = `<a href="login.html?redirect=cafe.html" style="color: #333; font-size: 13px; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 4px;"><i class="fa-regular fa-user"></i> 로그인</a>`;
        }
        if (cafeLoggedInBox) cafeLoggedInBox.style.display = "none";
        if (cafeLoggedOutBox) cafeLoggedOutBox.style.display = "flex";
    }

    // Logout action
    const btnLogout = document.getElementById("btn-cafe-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            if (confirm("로그아웃 하시겠습니까?")) {
                localStorage.removeItem("naverIsLoggedIn");
                localStorage.removeItem("naverLoggedInUser");
                localStorage.removeItem("naverLoggedInUserId");
                localStorage.removeItem("naverLoggedInEmail");
                location.href = "index.html";
            }
        });
    }

    // 2. Cafe Data Initialization & Safe LocalStorage Quota Protection
    const POCKETBASE_URL = "https://pb.joyfamkr.synology.me";

    function safeSaveCafesData(cafesArray) {
        if (!cafesArray || !Array.isArray(cafesArray)) return;
        try {
            localStorage.setItem("naverCafesData", JSON.stringify(cafesArray));
        } catch (e) {
            console.warn("Storage quota exceeded on naverCafesData! Trimming heavy post bodies for local cache...", e);
            try {
                // Level 1: Keep titles/authors/metadata of posts, trim heavy base64 images from older posts
                const slimCafes = cafesArray.map(c => ({
                    ...c,
                    posts: Array.isArray(c.posts) ? c.posts.slice(0, 30).map((p, idx) => {
                        if (idx > 2 && p.content && p.content.length > 500) {
                            return { ...p, content: p.content.replace(/<img[^>]*>/gi, "[이미지]") };
                        }
                        return p;
                    }) : []
                }));
                localStorage.setItem("naverCafesData", JSON.stringify(slimCafes));
            } catch (e2) {
                try {
                    // Level 2: Strip all base64 images and long content from local cache (full data stays in PocketBase)
                    const compactCafes = cafesArray.map(c => ({
                        ...c,
                        icon: (c.icon && c.icon.length > 5000) ? "default-avatar.svg" : c.icon,
                        posts: Array.isArray(c.posts) ? c.posts.slice(0, 15).map(p => ({
                            id: p.id,
                            title: p.title,
                            author: p.author,
                            time: p.time,
                            board: p.board,
                            isNotice: p.isNotice,
                            views: p.views || 0,
                            likes: p.likes || 0,
                            commentsCount: Array.isArray(p.comments) ? p.comments.length : (p.commentsCount || 0)
                        })) : []
                    }));
                    localStorage.setItem("naverCafesData", JSON.stringify(compactCafes));
                } catch (e3) {
                    console.error("Unable to save cafes to localStorage:", e3);
                }
            }
        }
    }
    window.safeSaveCafesData = safeSaveCafesData;

    function compressCafeImageFile(file, maxWidth = 800, quality = 0.72) {
        return new Promise((resolve) => {
            if (!file || !file.type.startsWith("image/")) {
                resolve("");
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
                    resolve(compressedDataUrl);
                };
                img.onerror = () => resolve(e.target.result);
                img.src = e.target.result;
            };
            reader.onerror = () => resolve("");
            reader.readAsDataURL(file);
        });
    }
    window.compressCafeImageFile = compressCafeImageFile;

    const DEFAULT_CAFES = [
        {
            id: "cafe_chiikawa",
            name: "먼작귀 치이카와 정보,거래 카페",
            isOfficial: false,
            ranking: "숲",
            level: "숲",
            members: "19,843",
            newPostsToday: 42,
            icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='24' fill='%23fce2ea'/><circle cx='34' cy='56' r='18' fill='%23ffffff'/><circle cx='66' cy='56' r='18' fill='%23ffffff'/><circle cx='50' cy='40' r='16' fill='%23fff8e7'/><circle cx='28' cy='54' r='2' fill='%23222'/><circle cx='40' cy='54' r='2' fill='%23222'/><circle cx='60' cy='54' r='2' fill='%23222'/><circle cx='72' cy='54' r='2' fill='%23222'/><circle cx='45' cy='38' r='2' fill='%23222'/><circle cx='55' cy='38' r='2' fill='%23222'/><ellipse cx='34' cy='60' rx='4' ry='2' fill='%23f99'/><ellipse cx='66' cy='60' rx='4' ry='2' fill='%23f99'/><ellipse cx='50' cy='44' rx='4' ry='2' fill='%23f99'/><text x='50' y='88' font-family='sans-serif' font-size='9' font-weight='bold' fill='%23d85d76' text-anchor='middle'>ちいかわ</text></svg>",
            isFavorite: true,
            category: "만화/애니",
            desc: "먼작귀 치이카와 관련해서 정보를 주고 받고 공구도 진행/ 주 목적은 거래를 자유롭게 할 ...",
            manager: "치이카와마스터",
            growthScore: "94,921",
            posts: [
                { id: "p1", title: "치이카와 신상 마스코트 인형 공구 및 현물 교환 게시판 오픈", author: "치이카와마스터", time: "10분 전", comments: 15 }
            ]
        },
        {
            id: "cafe_cbcm",
            name: "ComicBooks Collect Mania",
            isOfficial: true,
            ranking: "나무2단계",
            level: "나무2단계",
            members: "34,577",
            newPostsToday: 18,
            icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='24' fill='%23fff7b2'/><path d='M20,62 C35,60 48,68 50,72 C52,68 65,60 80,62 L80,32 C65,30 52,38 50,42 C48,38 35,30 20,32 Z' fill='%23ffffff' stroke='%23e59400' stroke-width='3'/><line x1='50' y1='42' x2='50' y2='72' stroke='%23e59400' stroke-width='2.5'/><text x='50' y='58' font-family='sans-serif' font-size='15' font-weight='900' fill='%23d9531e' text-anchor='middle'>CBCM</text></svg>",
            isFavorite: true,
            category: "도서/만화",
            desc: "만화책을 좋아하시고, 구매혹은 수집하시는 분들이 모여있는 카페 입니다.",
            manager: "북콜렉터",
            growthScore: "23,139",
            posts: [
                { id: "p2", title: "이번 주 발매 만화 단행본 초판 띠지 인증 모음", author: "북콜렉터", time: "25분 전", comments: 8 }
            ]
        },
        {
            id: "cafe_busan",
            name: "부산엔 [부산 부동산·학군·학원가 정보]",
            isOfficial: false,
            ranking: "씨앗3단계",
            level: "씨앗3단계",
            members: "478",
            newPostsToday: 5,
            icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='24' fill='%23f0f7ff'/><circle cx='50' cy='50' r='38' fill='%23ffffff' stroke='%233470cc' stroke-width='2'/><circle cx='40' cy='34' r='5' fill='%23ff6b4a'/><path d='M24,54 Q36,40 50,54 Q64,40 76,54' fill='none' stroke='%23193e78' stroke-width='3'/><line x1='36' y1='47' x2='36' y2='56' stroke='%23193e78' stroke-width='2'/><line x1='64' y1='47' x2='64' y2='56' stroke='%23193e78' stroke-width='2'/><path d='M22,60 Q50,54 78,60' fill='none' stroke='%234da3ff' stroke-width='2'/><text x='50' y='76' font-family='sans-serif' font-size='13' font-weight='900' fill='%23103264' text-anchor='middle'>부산엔</text></svg>",
            isFavorite: false,
            category: "부동산/지역",
            desc: "부산 부동산·아파트·분양정보·청약·신축·재개발·재건축·학군·학원가·맛집·생활정보",
            manager: "부산지기",
            growthScore: "15,007",
            posts: [
                { id: "p3", title: "해운대·수영구 학군 및 신축 분양 청약 일정 안내", author: "부산지기", time: "1시간 전", comments: 3 }
            ]
        },
        {
            id: "cafe_vgtrade",
            name: "VG trade (뱅가드 트레이드)",
            isOfficial: false,
            ranking: "열매3단계",
            level: "열매3단계",
            members: "5,643",
            newPostsToday: 12,
            icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='24' fill='%231e293b'/><circle cx='50' cy='50' r='36' fill='%230f172a' stroke='%23eab308' stroke-width='2'/><polygon points='50,22 62,42 56,42 66,66 50,56 34,66 44,42 38,42' fill='%23f59e0b'/><circle cx='50' cy='46' r='5' fill='%2338bdf8'/><text x='50' y='82' font-family='sans-serif' font-size='10' font-weight='900' fill='%23e2e8f0' text-anchor='middle'>VG TRADE</text></svg>",
            isFavorite: false,
            category: "게임/TCG",
            desc: "부시로드 사의 카드파이트 뱅가드의 거래 카페입니다.",
            manager: "뱅가드러너",
            growthScore: "12,370",
            posts: [
                { id: "p4", title: "D시리즈 신규 부스터 덱 소스 판매 및 트레이드 구합니다", author: "뱅가드러너", time: "2시간 전", comments: 7 }
            ]
        },
        {
            id: "cafe_digimon",
            name: "신 디지몬 카드게임 카페",
            isOfficial: false,
            ranking: "열매2단계",
            level: "열매2단계",
            members: "7,144",
            newPostsToday: 9,
            icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='24' fill='%232252a3'/><ellipse cx='50' cy='42' rx='42' ry='22' fill='%231d4588'/><text x='50' y='46' font-family='Impact, sans-serif' font-size='15' font-style='italic' fill='%23ffffff' text-anchor='middle' stroke='%230b2046' stroke-width='0.5'>DIGIMON</text><text x='50' y='58' font-family='sans-serif' font-size='7' font-weight='bold' fill='%2393c5fd' text-anchor='middle'>CARD GAME</text><text x='50' y='72' font-family='sans-serif' font-size='8' font-weight='bold' fill='%23ffffff' text-anchor='middle'>デジモンカード</text></svg>",
            isFavorite: false,
            category: "게임/TCG",
            desc: "2020년 새로 나온 디지몬 카드 게임에 관한 카페입니다.",
            manager: "테이머즈",
            growthScore: "11,312",
            posts: [
                { id: "p5", title: "한글판 부스터 발매 기념 매장 공인 대회 덱 리스트 공유", author: "테이머즈", time: "3시간 전", comments: 11 }
            ]
        }
    ];

    let cafes = JSON.parse(localStorage.getItem("naverCafesData") || "null");
    if (!cafes || !Array.isArray(cafes) || cafes.length === 0) {
        cafes = DEFAULT_CAFES;
        safeSaveCafesData(cafes);
    } else {
        DEFAULT_CAFES.forEach(df => {
            if (!cafes.some(c => c.id === df.id || c.name === df.name)) {
                cafes.push(df);
            }
        });
        safeSaveCafesData(cafes);
    }

    // Load real cafes from PocketBase if available
    async function loadCafesFromPocketBase() {
        try {
            const res = await fetch(`${POCKETBASE_URL}/api/collections/cafes/records?sort=-created`);
            if (res.ok) {
                const data = await res.json();
                if (data.items && data.items.length > 0) {
                    const pbCafes = data.items.map(item => ({
                        id: item.id,
                        name: item.name,
                        isOfficial: item.isOfficial || false,
                        ranking: item.ranking || "신규 개설",
                        members: item.members || "1",
                        joinedMembers: item.joinedMembers ? (typeof item.joinedMembers === 'string' ? JSON.parse(item.joinedMembers) : item.joinedMembers) : [],
                        newPostsToday: item.newPostsToday || (item.posts ? (typeof item.posts === 'string' ? JSON.parse(item.posts).length : item.posts.length) : 1),
                        icon: item.icon || "default-avatar.svg",
                        isFavorite: item.isFavorite || false,
                        category: item.category || "자유",
                        desc: item.description || "",
                        manager: item.manager || "매니저",
                        posts: item.posts ? (typeof item.posts === 'string' ? JSON.parse(item.posts) : item.posts) : []
                    }));
                    
                    cafes = pbCafes;
                    safeSaveCafesData(cafes);
                    renderCafeFeeds();
                }
            }
        } catch (e) {
            console.log("PocketBase cafes fetch notice (using local cache):", e);
        }
    }

    loadCafesFromPocketBase();

    // 3. Render Cafe Feeds & Directory
    const cafeFeedList = document.getElementById("cafe-feed-list");
    const allCafesList = document.getElementById("all-cafes-list");
    const allCafesTotalBadge = document.getElementById("all-cafes-total-badge");
    const sidebarJoinedCafesCount = document.getElementById("sidebar-joined-cafes-count");
    let currentTab = "my-cafe"; // "my-cafe" | "fav-board"
    let currentSearchQuery = "";

    // ----------------------------------------------------
    // Cafe Personal Notifications (내소식 실시간 알림 시스템)
    // ----------------------------------------------------
    const DEFAULT_CAFE_NOTIFICATIONS = [];

    let cafeNotifications = JSON.parse(localStorage.getItem("naverCafeNotifications") || "null");
    if (!cafeNotifications || !Array.isArray(cafeNotifications)) {
        cafeNotifications = DEFAULT_CAFE_NOTIFICATIONS;
        localStorage.setItem("naverCafeNotifications", JSON.stringify(cafeNotifications));
    }

    const cafeMyNewsBadge = document.getElementById("cafe-my-news-badge");
    const navCafeMyNews = document.getElementById("nav-cafe-my-news");
    const cafeNotiPopover = document.getElementById("cafe-noti-popover");
    const cafeNotiList = document.getElementById("cafe-noti-list");
    const notiUnreadCountTag = document.getElementById("noti-unread-count-tag");
    const btnCafeNotiReadAll = document.getElementById("btn-cafe-noti-read-all");
    const btnCloseCafeNoti = document.getElementById("btn-close-cafe-noti");

    function updateNotificationBadges() {
        const unreadCount = cafeNotifications.filter(n => n.unread).length;
        if (cafeMyNewsBadge) {
            cafeMyNewsBadge.textContent = unreadCount;
            cafeMyNewsBadge.style.display = unreadCount > 0 ? "inline-flex" : "none";
        }
        if (notiUnreadCountTag) {
            notiUnreadCountTag.textContent = `${unreadCount}개 안읽음`;
        }
        if (sidebarJoinedCafesCount) {
            sidebarJoinedCafesCount.textContent = Math.max(1, cafes.length);
        }
    }

    function renderNotificationsList() {
        if (!cafeNotiList) return;
        cafeNotiList.innerHTML = "";

        if (cafeNotifications.length === 0) {
            cafeNotiList.innerHTML = `
                <div style="text-align: center; padding: 30px 10px; color: #94a3b8; font-size: 13px;">
                    <i class="fa-regular fa-bell-slash" style="font-size: 24px; margin-bottom: 8px; color: #cbd5e1;"></i>
                    <p>도착한 알림이 없습니다.</p>
                </div>
            `;
            return;
        }

        cafeNotifications.forEach(noti => {
            const card = document.createElement("div");
            card.className = `noti-item-card ${noti.unread ? 'unread' : ''}`;
            card.innerHTML = `
                <div class="noti-icon-badge ${noti.iconType}">
                    <i class="${noti.iconClass}"></i>
                </div>
                <div class="noti-text-area">
                    <div class="noti-msg">${noti.message}</div>
                    <div class="noti-time">${noti.time}</div>
                </div>
            `;
            card.addEventListener("click", () => {
                noti.unread = false;
                localStorage.setItem("naverCafeNotifications", JSON.stringify(cafeNotifications));
                updateNotificationBadges();
                renderNotificationsList();
            });
            cafeNotiList.appendChild(card);
        });
    }

    if (navCafeMyNews) {
        navCafeMyNews.addEventListener("click", (e) => {
            e.preventDefault();
            const isOpen = cafeNotiPopover && cafeNotiPopover.style.display === "block";
            if (isOpen) {
                cafeNotiPopover.style.display = "none";
            } else if (cafeNotiPopover) {
                renderNotificationsList();
                cafeNotiPopover.style.display = "block";
            }
        });
    }

    if (btnCloseCafeNoti) {
        btnCloseCafeNoti.addEventListener("click", () => {
            if (cafeNotiPopover) cafeNotiPopover.style.display = "none";
        });
    }

    if (btnCafeNotiReadAll) {
        btnCafeNotiReadAll.addEventListener("click", () => {
            cafeNotifications.forEach(n => n.unread = false);
            localStorage.setItem("naverCafeNotifications", JSON.stringify(cafeNotifications));
            updateNotificationBadges();
            renderNotificationsList();
        });
    }

    function getCafeIcon(name, customIcon) {
        if (customIcon && customIcon.trim() !== "") {
            return customIcon;
        }
        return "default-avatar.svg";
    }

    window.handleCafePostClick = function(targetUrl) {
        const loggedIn = (localStorage.getItem("naverIsLoggedIn") === "true") || Boolean(localStorage.getItem("naverLoggedInUser"));
        if (!loggedIn) {
            location.href = `login.html?redirect=${encodeURIComponent(targetUrl)}`;
            return;
        }
        location.href = targetUrl;
    };

    function renderAllCafesGrid() {
        if (sidebarJoinedCafesCount) sidebarJoinedCafesCount.textContent = Math.max(1, cafes.length);
        if (allCafesTotalBadge) allCafesTotalBadge.textContent = `${cafes.length}개`;
        if (!allCafesList) return;

        if (cafes.length === 0) {
            allCafesList.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #888; background: #f8f9fa; border-radius: 10px;">
                    <i class="fa-solid fa-mug-saucer" style="font-size: 36px; color: #ced4da; margin-bottom: 12px;"></i>
                    <p style="font-size: 14px; font-weight: 600;">개설된 카페가 없습니다.</p>
                </div>
            `;
            return;
        }

        allCafesList.innerHTML = "";
        cafes.forEach(c => {
            const item = document.createElement("div");
            item.className = "cafe-row-item";
            item.onclick = () => {
                location.href = `cafe-detail.html?id=${c.id}&name=${encodeURIComponent(c.name)}`;
            };

            const desc = c.desc || `${c.name} 카페에서 다양한 정보와 소식을 나누어 보세요.`;
            const members = c.members || "1";
            const level = c.level || "씨앗1단계";
            const membersFormatted = isNaN(String(members).replace(/,/g, "")) 
                ? members 
                : Number(String(members).replace(/,/g, "")).toLocaleString();
            const score = c.growthScore || Math.floor(Math.random() * 50000 + 10000).toLocaleString();

            item.innerHTML = `
                <div class="cafe-row-avatar">
                    <img src="${getCafeIcon(c.name, c.icon)}" alt="${c.name}" onerror="this.src='default-avatar.svg'">
                </div>
                <div class="cafe-row-info">
                    <div class="cafe-row-title-line">
                        <span class="cafe-row-name">${c.name}</span>
                        ${c.isOfficial ? `<span class="cafe-tag-rep">대표</span>` : ''}
                    </div>
                    <div class="cafe-row-desc">${desc}</div>
                    <div class="cafe-row-meta-line">
                        <span><i class="fa-solid fa-user cafe-meta-icon"></i> ${membersFormatted}</span>
                        <span class="sep">·</span>
                        <span>${level}</span>
                        <span class="sep">·</span>
                        <span class="cafe-growth-stat"><span class="growth-arrow-circle"><i class="fa-solid fa-arrow-up"></i></span> ${score}</span>
                    </div>
                </div>
            `;
            allCafesList.appendChild(item);
        });
    }

    function renderCafeFeeds() {
        renderAllCafesGrid();
        if (!cafeFeedList) return;

        let displayCafes = [...cafes];

        if (currentTab === "fav-board") {
            displayCafes = displayCafes.filter(c => c.isFavorite);
        }

        if (currentSearchQuery) {
            const q = currentSearchQuery.toLowerCase();
            displayCafes = displayCafes.filter(c => {
                const nameMatch = c.name.toLowerCase().includes(q);
                const postMatch = c.posts && c.posts.some(p => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q));
                return nameMatch || postMatch;
            });
        }

        if (displayCafes.length === 0) {
            cafeFeedList.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #888; background: #f8f9fa; border-radius: 10px;">
                    <i class="fa-solid fa-mug-saucer" style="font-size: 36px; color: #ced4da; margin-bottom: 12px;"></i>
                    <p style="font-size: 14px; font-weight: 600;">등록된 카페 또는 게시글이 없습니다.</p>
                </div>
            `;
            return;
        }

        cafeFeedList.innerHTML = "";

        displayCafes.forEach(cafe => {
            const card = document.createElement("div");
            card.className = "cafe-group-card";

            const postsHtml = (cafe.posts || []).map(p => {
                const commList = Array.isArray(p.comments) ? p.comments : [];
                const commCount = commList.length || (parseInt(p.comments, 10) || parseInt(p.commentsCount, 10) || 0);
                const commBadge = commCount > 0 ? `<span class="badge-post-comment-count">[${commCount}]</span>` : '';
                const targetUrl = `cafe-detail.html?id=${cafe.id}&name=${encodeURIComponent(cafe.name)}&postId=${encodeURIComponent(p.id || '')}`;
                return `
                <li class="cafe-post-item">
                    <div class="post-item-left">
                        <span class="post-item-title" onclick="window.handleCafePostClick('${targetUrl}')">${p.title}</span>
                        ${commBadge}
                    </div>
                    <div class="post-item-right">
                        <span class="post-item-author">${p.author}</span>
                        <span class="post-item-time">· ${p.time}</span>
                    </div>
                </li>
            `}).join("");

            card.innerHTML = `
                <div class="cafe-group-card-inner">
                    <div class="cafe-card-icon-wrap">
                        <img src="${getCafeIcon(cafe.name, cafe.icon)}" class="cafe-icon-thumb" alt="${cafe.name}" onclick="location.href='cafe-detail.html?id=${cafe.id}&name=${encodeURIComponent(cafe.name)}'" onerror="this.src='default-avatar.svg'">
                    </div>
                    <div class="cafe-card-main-body">
                        <div class="cafe-group-header">
                            <div class="cafe-group-text">
                                <div class="cafe-name-row" onclick="location.href='cafe-detail.html?id=${cafe.id}&name=${encodeURIComponent(cafe.name)}'">
                                    <span>${cafe.name}</span>
                                    ${cafe.isOfficial ? `<span class="cafe-tag-green">대표</span>` : ''}
                                    ${cafe.ranking ? `<span class="cafe-members-count"><i class="fa-solid fa-users" style="font-size:9px;"></i> ${cafe.ranking}</span>` : ''}
                                </div>
                                <span class="cafe-new-posts-count">새 글 ${cafe.newPostsToday}</span>
                            </div>
                            <button class="cafe-fav-star ${cafe.isFavorite ? 'active' : ''}" data-id="${cafe.id}" title="즐겨찾기">
                                <i class="fa-${cafe.isFavorite ? 'solid' : 'regular'} fa-star"></i>
                            </button>
                        </div>
                        <ul class="cafe-post-items">
                            ${postsHtml}
                        </ul>
                    </div>
                </div>
            `;

            cafeFeedList.appendChild(card);
        });

        // Favorite Toggle Events
        cafeFeedList.querySelectorAll(".cafe-fav-star").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const target = cafes.find(c => c.id === id);
                if (target) {
                    target.isFavorite = !target.isFavorite;
                    safeSaveCafesData(cafes);
                    renderCafeFeeds();
                }
            });
        });
    }

    renderCafeFeeds();

    // 4. Tab Switching
    const tabMyCafe = document.getElementById("tab-my-cafe");
    const tabFavBoard = document.getElementById("tab-fav-board");

    if (tabMyCafe && tabFavBoard) {
        tabMyCafe.addEventListener("click", () => {
            tabMyCafe.classList.add("active");
            tabFavBoard.classList.remove("active");
            if (tabAllCafes) tabAllCafes.classList.remove("active");
            currentTab = "my-cafe";
            renderCafeFeeds();
        });

        tabFavBoard.addEventListener("click", () => {
            tabFavBoard.classList.add("active");
            tabMyCafe.classList.remove("active");
            if (tabAllCafes) tabAllCafes.classList.remove("active");
            currentTab = "fav-board";
            renderCafeFeeds();
        });
    }

    const tabAllCafes = document.getElementById("tab-all-cafes");
    const btnFeedAllCafes = document.getElementById("btn-feed-all-cafes");
    if (tabAllCafes) {
        tabAllCafes.addEventListener("click", () => {
            showAllCafesView();
        });
    }
    if (btnFeedAllCafes) {
        btnFeedAllCafes.addEventListener("click", () => {
            showAllCafesView();
        });
    }

    // 5. Search Bar Form
    const cafeSearchForm = document.getElementById("cafe-search-form");
    const cafeSearchInput = document.getElementById("cafe-search-input");

    if (cafeSearchForm) {
        cafeSearchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            currentSearchQuery = cafeSearchInput ? cafeSearchInput.value.trim() : "";
            renderCafeFeeds();
        });
    }

    // 6. View Switching (Home vs All Cafes List vs Create Form)
    const cafeHomeView = document.getElementById("cafe-home-view");
    const cafeAllListView = document.getElementById("cafe-all-list-view");
    const cafeCreateView = document.getElementById("cafe-create-view");
    const btnCreateCafe = document.getElementById("btn-create-cafe");
    const btnRealCreateCancel = document.getElementById("btn-real-create-cancel");
    const realCreateCafeForm = document.getElementById("real-create-cafe-form");
    const navCafeHome = document.getElementById("nav-cafe-home");
    const navAllCafes = document.getElementById("nav-all-cafes");
    const catAllCafesLink = document.getElementById("cat-all-cafes-link");

    function showHomeView() {
        if (cafeCreateView) cafeCreateView.style.display = "none";
        if (cafeAllListView) cafeAllListView.style.display = "none";
        if (cafeHomeView) cafeHomeView.style.display = "block";
        document.querySelectorAll(".cafe-menu-item").forEach(m => m.classList.remove("active"));
        if (navCafeHome) navCafeHome.classList.add("active");
        renderCafeFeeds();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function showAllCafesView() {
        if (cafeHomeView) cafeHomeView.style.display = "none";
        if (cafeCreateView) cafeCreateView.style.display = "none";
        if (cafeAllListView) cafeAllListView.style.display = "block";
        document.querySelectorAll(".cafe-menu-item").forEach(m => m.classList.remove("active"));
        if (navAllCafes) navAllCafes.classList.add("active");
        renderAllCafesGrid();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function showCreateView() {
        if (cafeHomeView) cafeHomeView.style.display = "none";
        if (cafeAllListView) cafeAllListView.style.display = "none";
        if (cafeCreateView) cafeCreateView.style.display = "block";
        document.querySelectorAll(".cafe-menu-item").forEach(m => m.classList.remove("active"));
        isCreatingCafe = false;
        if (btnRealCreateSubmit) {
            btnRealCreateSubmit.disabled = false;
            btnRealCreateSubmit.innerHTML = `만들기`;
        }
        if (typeof refreshCaptcha === "function") refreshCaptcha();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const navMyJoinedCafes = document.getElementById("nav-my-joined-cafes");
    const navCafeHotPosts = document.getElementById("nav-cafe-hot-posts");

    if (navCafeHome) navCafeHome.addEventListener("click", (e) => { e.preventDefault(); showHomeView(); });
    if (navAllCafes) navAllCafes.addEventListener("click", (e) => { e.preventDefault(); showAllCafesView(); });
    if (navMyJoinedCafes) navMyJoinedCafes.addEventListener("click", (e) => { e.preventDefault(); showHomeView(); });
    if (navCafeHotPosts) navCafeHotPosts.addEventListener("click", (e) => { e.preventDefault(); showHomeView(); });
    if (catAllCafesLink) catAllCafesLink.addEventListener("click", (e) => { e.preventDefault(); showAllCafesView(); });
    if (btnCreateCafe) btnCreateCafe.addEventListener("click", showCreateView);

    if (btnRealCreateCancel) {
        btnRealCreateCancel.addEventListener("click", () => {
            if (confirm("카페 만들기를 취소하시겠습니까? 입력한 내용은 저장되지 않습니다.")) {
                if (realCreateCafeForm) realCreateCafeForm.reset();
                showHomeView();
            }
        });
    }

    // Subcategory mapping
    const catMainSelect = document.getElementById("create-cafe-cat-main");
    const catSubSelect = document.getElementById("create-cafe-cat-sub");
    const subCatMap = {
        "IT/컴퓨터": ["스마트폰/태블릿", "프로그래밍/코딩", "하드웨어/PC", "인공지능/AI"],
        "경제/금융": ["재테크/부동산", "국내주식/해외주식", "창업/부업", "절약/가계부"],
        "교육/학습": ["초중고 학습", "대학/대학원", "어학/자격증", "공무원/고시"],
        "취미/여가": ["게임", "영화/음악", "운동/스포츠", "반려동물", "요리/베이킹"],
        "생활/쇼핑": ["패션/뷰티", "인테리어/DIY", "중고거래/나눔", "육아/출산"]
    };

    if (catMainSelect && catSubSelect) {
        catMainSelect.addEventListener("change", () => {
            const selectedMain = catMainSelect.value;
            const subs = subCatMap[selectedMain] || ["일반", "자유게시판"];
            catSubSelect.innerHTML = `<option value="" disabled selected>소분류 선택</option>` +
                subs.map(s => `<option value="${s}">${s}</option>`).join("");
        });
    }

    // Description character counter
    const createCafeDesc = document.getElementById("create-cafe-desc");
    const descCharCount = document.getElementById("desc-char-count");
    if (createCafeDesc && descCharCount) {
        createCafeDesc.addEventListener("input", () => {
            descCharCount.textContent = `${createCafeDesc.value.length}/100`;
        });
    }

    // Keyword tags
    const keywordInput = document.getElementById("create-cafe-keywords");
    const btnKeywordReg = document.getElementById("btn-keyword-reg");
    const tagsPreviewRow = document.getElementById("tags-preview-row");
    let keywordList = [];

    function renderKeywordTags() {
        if (!tagsPreviewRow) return;
        tagsPreviewRow.innerHTML = keywordList.map((kw, idx) => `
            <span class="keyword-tag-pill">
                #${kw}
                <button type="button" class="remove-kw-btn" onclick="removeCafeKeyword(${idx})">&times;</button>
            </span>
        `).join("");
    }

    window.removeCafeKeyword = function(index) {
        keywordList.splice(index, 1);
        renderKeywordTags();
    };

    function addKeyword() {
        if (!keywordInput) return;
        const val = keywordInput.value.replace(/\s+/g, "").trim();
        if (val && keywordList.length < 10 && !keywordList.includes(val)) {
            keywordList.push(val);
            keywordInput.value = "";
            renderKeywordTags();
        }
    }

    if (btnKeywordReg) {
        btnKeywordReg.addEventListener("click", addKeyword);
    }
    if (keywordInput) {
        keywordInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                addKeyword();
            }
        });
    }

    // Region setting simulation
    const btnAddRegion = document.getElementById("btn-add-region");
    const selectedRegionText = document.getElementById("selected-region-text");
    if (btnAddRegion && selectedRegionText) {
        btnAddRegion.addEventListener("click", () => {
            const region = prompt("활동 기반 지역을 입력해주세요 (예: 서울 강남구, 경기 성남시):", "전국");
            if (region) {
                selectedRegionText.textContent = `설정된 지역: ${region}`;
            }
        });
    }

    // Icon file upload simulation
    const cafeIconPreviewBox = document.getElementById("cafe-icon-preview-box");
    const createCafeIconFile = document.getElementById("create-cafe-icon-file");
    let uploadedCafeIcon = "";

    if (cafeIconPreviewBox && createCafeIconFile) {
        cafeIconPreviewBox.addEventListener("click", () => {
            createCafeIconFile.click();
        });

        createCafeIconFile.addEventListener("change", async (e) => {
            const file = e.target.files[0];
            if (file) {
                uploadedCafeIcon = await compressCafeImageFile(file, 300, 0.8);
                if (uploadedCafeIcon) {
                    cafeIconPreviewBox.innerHTML = `
                        <img src="${uploadedCafeIcon}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 22px;">
                        <div class="icon-camera-badge"><i class="fa-solid fa-camera"></i></div>
                    `;
                }
            }
        });
    }

    // Captcha refresh simulation
    const captchaImgBox = document.getElementById("captcha-img-box");
    const captchaInput = document.getElementById("captcha-input");
    const btnCaptchaRefresh = document.getElementById("btn-captcha-refresh");
    const btnCaptchaAudio = document.getElementById("btn-captcha-audio");
    const btnRealCreateSubmit = document.getElementById("btn-real-create-submit");
    const captchaSamples = ["JL58", "9K2P", "7M4X", "3R8T", "A6W2", "4B9Q", "E8N3"];
    let currentCaptcha = "JL58";

    function refreshCaptcha() {
        const random = captchaSamples[Math.floor(Math.random() * captchaSamples.length)];
        currentCaptcha = random;
        if (captchaImgBox) captchaImgBox.innerHTML = `<span class="captcha-fake-noise">${random}</span>`;
        if (captchaInput) {
            captchaInput.value = "";
            captchaInput.placeholder = `보안문자 (${random})`;
        }
    }

    if (btnCaptchaRefresh) {
        btnCaptchaRefresh.addEventListener("click", refreshCaptcha);
    }

    if (btnCaptchaAudio) {
        btnCaptchaAudio.addEventListener("click", () => {
            alert(`보안 음성 안내: [ ${currentCaptcha.split("").join(" - ")} ]`);
        });
    }

    // Handle Real Cafe Creation Submission
    let isCreatingCafe = false;

    async function handleCafeCreate(e) {
        if (e) e.preventDefault();
        if (isCreatingCafe) return;

        const nameInput = document.getElementById("create-cafe-name");
        const descInput = document.getElementById("create-cafe-desc");
        const catMainSelect = document.getElementById("create-cafe-cat-main");
        const agreeCheck = document.getElementById("agree-policy");

        const name = nameInput ? nameInput.value.trim() : "";
        let desc = descInput ? descInput.value.trim() : "";
        let catMain = catMainSelect ? catMainSelect.value : "";
        let inputCaptcha = (captchaInput ? captchaInput.value.trim() : "").toUpperCase();

        // 1. Validation - Cafe Name
        if (!name) {
            alert("카페 이름을 입력해주세요.");
            if (nameInput) nameInput.focus();
            return;
        }

        // 2. Auto-fill or validate Category
        if (!catMain) {
            catMain = "IT/컴퓨터";
            if (catMainSelect) catMainSelect.value = "IT/컴퓨터";
        }

        // 3. Auto-fill Description if empty
        if (!desc) {
            desc = `${name} 카페에 오신 것을 환영합니다! 다양한 이야기와 정보를 함께 나누어요.`;
            if (descInput) descInput.value = desc;
        }

        // 4. Captcha convenience: if user left it blank, auto-fill with currentCaptcha
        if (!inputCaptcha) {
            inputCaptcha = currentCaptcha.toUpperCase();
            if (captchaInput) captchaInput.value = currentCaptcha;
        } else if (inputCaptcha !== currentCaptcha.toUpperCase()) {
            alert("보안문자가 일치하지 않습니다. 이미지를 확인 후 다시 입력해주세요.");
            refreshCaptcha();
            if (captchaInput) captchaInput.focus();
            return;
        }

        // 5. Policy Agreement convenience
        if (agreeCheck && !agreeCheck.checked) {
            agreeCheck.checked = true;
        }

        isCreatingCafe = true;
        if (btnRealCreateSubmit) {
            btnRealCreateSubmit.disabled = true;
            btnRealCreateSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> 개설 중...`;
        }

        try {
            const initialPost = {
                id: "p_" + Date.now(),
                title: `[공지] ${name}에 오신 것을 환영합니다!`,
                author: loggedInUser || "조이",
                time: "방금 전",
                board: "자유게시판",
                isNotice: true,
                comments: 0,
                content: `${name} 카페를 시작합니다.\n\n함께 이야기 나누며 즐겁고 행복한 카페를 만들어가요!`
            };

            let createdCafeId = "cafe_" + Date.now();

            // Safe icon handling (prevent large base64 from blowing localStorage)
            let safeIcon = "default-avatar.svg";
            if (uploadedCafeIcon && typeof uploadedCafeIcon === "string") {
                if (uploadedCafeIcon.length < 80000) {
                    safeIcon = uploadedCafeIcon;
                }
            }

            // Save to PocketBase with 3s timeout safeguard
            try {
                const pbPayload = {
                    name: name,
                    description: desc,
                    category: catMain,
                    manager: loggedInUser || "조이",
                    members: "1",
                    ranking: "신규 카페",
                    isOfficial: false,
                    isFavorite: true,
                    newPostsToday: 1,
                    icon: safeIcon,
                    posts: JSON.stringify([initialPost])
                };

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);

                const pbRes = await fetch(`${POCKETBASE_URL}/api/collections/cafes/records`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(pbPayload),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (pbRes && pbRes.ok) {
                    const pbData = await pbRes.json();
                    if (pbData && pbData.id) {
                        createdCafeId = pbData.id;
                    }
                }
            } catch (err) {
                console.log("PocketBase create notice (fallback to local):", err);
            }

            const newCafe = {
                id: createdCafeId,
                name: name,
                isOfficial: false,
                ranking: "신규 카페",
                members: "1",
                newPostsToday: 1,
                icon: safeIcon,
                isFavorite: true,
                category: catMain,
                keywords: Array.isArray(keywordList) ? [...keywordList] : [],
                desc: desc,
                manager: loggedInUser || "조이",
                posts: [initialPost]
            };

            if (!Array.isArray(cafes)) {
                cafes = [];
            }
            cafes.unshift(newCafe);

            // Safe localStorage saving
            safeSaveCafesData(cafes);

            try {
                if (realCreateCafeForm && typeof realCreateCafeForm.reset === "function") {
                    realCreateCafeForm.reset();
                }
            } catch (resetErr) {
                console.warn("Form reset notice:", resetErr);
            }

            uploadedCafeIcon = "";
            if (cafeIconPreviewBox) {
                cafeIconPreviewBox.innerHTML = `
                    <i class="fa-solid fa-mug-saucer default-icon"></i>
                    <div class="icon-camera-badge"><i class="fa-solid fa-camera"></i></div>
                `;
            }
            keywordList = [];
            try { renderKeywordTags(); } catch (_) {}
            try { refreshCaptcha(); } catch (_) {}
            
            alert(`'${name}' 카페가 성공적으로 개설되었습니다! 개별 카페 메인으로 이동합니다.`);
            location.href = `cafe-detail.html?id=${newCafe.id}&name=${encodeURIComponent(name)}`;
        } catch (error) {
            console.error("카페 개설 오류:", error);
            alert("카페 개설 중 오류가 발생했습니다: " + (error ? (error.message || error) : "알 수 없는 오류"));
            isCreatingCafe = false;
            if (btnRealCreateSubmit) {
                btnRealCreateSubmit.disabled = false;
                btnRealCreateSubmit.innerHTML = `만들기`;
            }
        }
    }

    if (btnRealCreateSubmit) {
        btnRealCreateSubmit.addEventListener("click", handleCafeCreate);
    }
    if (realCreateCafeForm) {
        realCreateCafeForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleCafeCreate(e);
        });
    }

    // 7. Write Quick Post Modal
    const writePostModal = document.getElementById("write-post-modal");
    const writeModalCloseBtn = document.getElementById("write-modal-close-btn");
    const btnWriteCancel = document.getElementById("btn-write-cancel");
    const writePostForm = document.getElementById("write-post-form");
    const writePostCafeTitle = document.getElementById("write-post-cafe-title");
    const writePostCafeId = document.getElementById("write-post-cafe-id");

    window.openWritePostModal = function(cafeId, cafeName) {
        if (!writePostModal) return;
        writePostCafeId.value = cafeId;
        writePostCafeTitle.textContent = `[${cafeName}] 새 글 쓰기`;
        writePostModal.style.display = "flex";
    };

    if (writePostModal) {
        const closeWriteModal = () => { writePostModal.style.display = "none"; };
        if (writeModalCloseBtn) writeModalCloseBtn.addEventListener("click", closeWriteModal);
        if (btnWriteCancel) btnWriteCancel.addEventListener("click", closeWriteModal);

        writePostForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const cafeId = writePostCafeId.value;
            const title = document.getElementById("new-post-title").value.trim();
            const content = document.getElementById("new-post-content").value.trim();

            if (title && cafeId) {
                const target = cafes.find(c => c.id === cafeId);
                if (target) {
                    if (!target.posts) target.posts = [];
                    target.posts.unshift({
                        id: "p_" + Date.now(),
                        title: title,
                        author: loggedInUser || "조이",
                        time: "방금 전",
                        comments: 0
                    });
                    target.newPostsToday = (target.newPostsToday || 0) + 1;
                    safeSaveCafesData(cafes);
                    writePostForm.reset();
                    closeWriteModal();
                    renderCafeFeeds();
                    alert("게시글이 성공적으로 등록되었습니다!");
                }
            }
        });
    }
});
