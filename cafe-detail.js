/**
 * Individual Cafe Detail Logic (cafe-detail.js)
 * Manages loading specific cafe data, post rendering, board switching, 
 * rich editor post writing, comments submission & rendering, batch deleting, and post views.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Get Cafe ID & Post ID from URL Parameter
    const urlParams = new URLSearchParams(window.location.search);
    const cafeId = urlParams.get("id") || urlParams.get("cafe") || "";
    const initialPostId = urlParams.get("postId");
    const POCKETBASE_URL = "https://pb.joyfamkr.synology.me";

    // 2. Elements & Sync User Info
    const cafeTitleMain = document.getElementById("cafe-title-main");
    const cafeUrlSub = document.getElementById("cafe-url-sub");
    const cafeManagerName = document.getElementById("cafe-manager-name");
    const cafeCreatedDate = document.getElementById("cafe-created-date");
    const cafeMemberCount = document.getElementById("cafe-member-count");
    const cafeProfileAvatar = document.getElementById("cafe-profile-avatar");
    const sidebarTotalPosts = document.getElementById("sidebar-total-posts");
    const btnSidebarJoinCafe = document.getElementById("btn-sidebar-join-cafe");
    const btnOpenWriteModal = document.getElementById("btn-open-write-modal");

    const loggedInUser = localStorage.getItem("naverLoggedInUser") || 
                         localStorage.getItem("naverLoggedInUsername") || 
                         localStorage.getItem("naverLoggedInUserId") || "";
    const isAuth = (localStorage.getItem("naverIsLoggedIn") === "true") || Boolean(loggedInUser);
    const headerUserName = document.getElementById("header-user-name");
    const headerUserCaret = document.getElementById("header-user-caret");
    if (headerUserName) {
        if (isAuth && loggedInUser) {
            headerUserName.textContent = loggedInUser.endsWith("님") ? loggedInUser : `${loggedInUser}님`;
            if (headerUserCaret) headerUserCaret.style.display = "inline-block";
        } else {
            headerUserName.innerHTML = `<a href="login.html?redirect=${encodeURIComponent(window.location.href)}" onclick="event.stopPropagation();" style="color: #555; text-decoration: none; font-weight: 700;">로그인</a>`;
            if (headerUserCaret) headerUserCaret.style.display = "none";
        }
    }

    const commentWriteUserName = document.getElementById("comment-write-user-name");
    if (commentWriteUserName) commentWriteUserName.textContent = loggedInUser || "익명";

    // 3. Load cafe dataset & Safe LocalStorage / Image / Merge Helpers
    function safeSaveCafesData(cafesArray) {
        if (typeof window.safeSaveCafesData === "function") {
            window.safeSaveCafesData(cafesArray);
            return;
        }
        if (!cafesArray || !Array.isArray(cafesArray)) return;
        try {
            localStorage.setItem("naverCafesData", JSON.stringify(cafesArray));
        } catch (e) {
            try {
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
            } catch (e2) {}
        }
    }

    function compressCafeImageFile(file, maxWidth = 800, quality = 0.72) {
        if (typeof window.compressCafeImageFile === "function") {
            return window.compressCafeImageFile(file, maxWidth, quality);
        }
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
                    resolve(canvas.toDataURL("image/jpeg", quality));
                };
                img.onerror = () => resolve(e.target.result);
                img.src = e.target.result;
            };
            reader.onerror = () => resolve("");
            reader.readAsDataURL(file);
        });
    }

    let cafes = JSON.parse(localStorage.getItem("naverCafesData") || "[]");

    const searchName = urlParams.get("name") || "";
    let currentCafe = null;

    if (cafeId) {
        currentCafe = cafes.find(c => String(c.id) === String(cafeId) || String(c.urlSlug) === String(cafeId));
    }
    if (!currentCafe && searchName) {
        currentCafe = cafes.find(c => c.name === searchName || c.name.includes(searchName));
    }

    if (!currentCafe) {
        currentCafe = {
            id: cafeId || "vncvhnzfduln0p8",
            name: searchName || "통장모임",
            urlSlug: cafeId || "",
            manager: loggedInUser || "연습용",
            createdDate: "2026.08.22.",
            members: "1",
            level: "씨앗1단계",
            icon: "default-avatar.svg",
            joinedMembers: [],
            posts: []
        };
    }

    // Immediate DOM update to prevent flash of default title
    if (cafeTitleMain) cafeTitleMain.textContent = currentCafe.name;
    if (cafeUrlSub) cafeUrlSub.textContent = `https://cafe.eduver.com/${currentCafe.urlSlug || currentCafe.id.replace("cafe_", "")}`;

    // 7. Render Posts in Board Table
    const cafePostTbody = document.getElementById("cafe-post-tbody");
    const boardMainTitle = document.getElementById("board-main-title");
    const checkAllPosts = document.getElementById("check-all-posts");
    const bottomCheckAll = document.getElementById("bottom-check-all");
    const hideNoticeCheck = document.getElementById("hide-notice-check");
    let currentActiveBoard = "all"; // 'all' | 'hot' | 'free'

    function renderPostTable() {
        if (!cafePostTbody) return;

        let postList = currentCafe.posts || [];
        
        // Hide notice filter
        if (hideNoticeCheck && hideNoticeCheck.checked) {
            postList = postList.filter(p => !p.isNotice);
        }

        if (currentActiveBoard === "free") {
            postList = postList.filter(p => !p.board || p.board === "자유게시판");
            if (welcomeHeroCard) welcomeHeroCard.style.display = "none";
            if (boardMainTitle) boardMainTitle.textContent = "자유게시판";
        } else if (currentActiveBoard === "hot") {
            postList = postList.filter(p => (p.views || 0) > 10 || (Array.isArray(p.comments) ? p.comments.length : 0) > 0);
            if (welcomeHeroCard) welcomeHeroCard.style.display = "none";
            if (boardMainTitle) boardMainTitle.textContent = "인기글";
        } else {
            if (welcomeHeroCard) welcomeHeroCard.style.display = "block";
            if (boardMainTitle) boardMainTitle.textContent = "전체글보기";
        }

        if (sidebarTotalPosts) sidebarTotalPosts.textContent = (currentCafe.posts || []).length;

        if (postList.length === 0) {
            cafePostTbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: #888;">
                        등록된 게시글이 없습니다.
                    </td>
                </tr>
            `;
            return;
        }

        cafePostTbody.innerHTML = "";
        postList.forEach((post, index) => {
            const tr = document.createElement("tr");
            if (post.isNotice) tr.className = "notice-tr";

            const numOrBadge = post.isNotice 
                ? `<span class="badge-table-notice">공지</span>` 
                : (postList.length - index);

            const postTime = (post.time && typeof post.time === 'string') 
                ? (post.time.includes(" ") ? post.time.split(" ")[0] : post.time)
                : "2026.08.23";

            const commList = Array.isArray(post.comments) ? post.comments : [];
            const commCount = commList.length || parseInt(post.commentsCount, 10) || 0;
            const commBadge = commCount > 0 ? `<span class="badge-post-comment-count">[${commCount}]</span>` : '';
            const clipBadge = (Array.isArray(post.attachments) && post.attachments.length > 0)
                ? `<i class="fa-solid fa-paperclip badge-post-file-clip" title="첨부파일"></i>`
                : '';

            tr.innerHTML = `
                <td class="td-check">
                    <input type="checkbox" class="post-check-item" data-id="${post.id || ''}">
                </td>
                <td>${numOrBadge}</td>
                <td class="td-board-title">
                    <span class="post-link-text" style="${post.isNotice ? 'color:#eb5757; font-weight:700;' : ''}">${post.title || '(제목 없음)'}</span>
                    ${clipBadge}
                    ${commBadge}
                    <span class="badge-n-dot">N</span>
                </td>
                <td>${post.author || '익명'}</td>
                <td>${postTime}</td>
                <td>${post.views || 0}</td>
                <td>${post.likes || 0}</td>
            `;

            tr.querySelector(".td-board-title").addEventListener("click", () => {
                showPostDetail(post.id);
            });
            cafePostTbody.appendChild(tr);
        });

        // Wire checkbox sync
        syncCheckboxes();
    }

    function syncCheckboxes() {
        const itemChecks = document.querySelectorAll(".post-check-item");
        
        const toggleAll = (checked) => {
            itemChecks.forEach(c => c.checked = checked);
            if (checkAllPosts) checkAllPosts.checked = checked;
            if (bottomCheckAll) bottomCheckAll.checked = checked;
        };

        if (checkAllPosts) {
            checkAllPosts.onchange = (e) => toggleAll(e.target.checked);
        }
        if (bottomCheckAll) {
            bottomCheckAll.onchange = (e) => toggleAll(e.target.checked);
        }

        itemChecks.forEach(c => {
            c.onchange = () => {
                const allChecked = Array.from(itemChecks).length > 0 && Array.from(itemChecks).every(i => i.checked);
                if (checkAllPosts) checkAllPosts.checked = allChecked;
                if (bottomCheckAll) bottomCheckAll.checked = allChecked;
            };
        });
    }

    // Try fetching live cafe record from PocketBase
    async function syncFromPocketBase() {
        try {
            let targetId = cafeId || currentCafe.id;
            let targetName = searchName || currentCafe.name;
            let item = null;

            // Direct fetch by ID if valid PB ID
            if (targetId && !targetId.startsWith("cafe_")) {
                let res = await fetch(`${POCKETBASE_URL}/api/collections/cafes/records/${targetId}`);
                if (res.ok) item = await res.json();
            }

            // Fallback fetch all records and match by name or ID
            if (!item) {
                const searchRes = await fetch(`${POCKETBASE_URL}/api/collections/cafes/records?perPage=50`);
                if (searchRes.ok) {
                    const searchData = await searchRes.json();
                    if (searchData.items && searchData.items.length > 0) {
                        item = searchData.items.find(i => 
                            (targetName && i.name && (i.name === targetName || i.name.includes(targetName) || targetName.includes(i.name))) ||
                            (targetId && i.id === targetId)
                        );
                        if (!item && !targetName && !targetId) {
                            item = searchData.items[0];
                        }
                    }
                }
            }

            if (item) {
                currentCafe.id = item.id;
                currentCafe.name = item.name || currentCafe.name;
                currentCafe.desc = item.description || currentCafe.desc;
                currentCafe.manager = item.manager || currentCafe.manager;
                currentCafe.icon = item.icon || currentCafe.icon;
                currentCafe.members = item.members || currentCafe.members || "1";
                if (item.joinedMembers) {
                    if (Array.isArray(item.joinedMembers)) {
                        currentCafe.joinedMembers = item.joinedMembers;
                    } else if (typeof item.joinedMembers === 'string') {
                        try { currentCafe.joinedMembers = JSON.parse(item.joinedMembers); } catch(e) { currentCafe.joinedMembers = [item.joinedMembers]; }
                    }
                }
                
                // Fetch Posts from cafe_posts collection
                try {
                    const postsRes = await fetch(`${POCKETBASE_URL}/api/collections/cafe_posts/records?filter=${encodeURIComponent(`(cafeId='${currentCafe.id}')`)}&sort=-isNotice,-created&perPage=200`);
                    if (postsRes.ok) {
                        const postsData = await postsRes.json();
                        if (postsData && Array.isArray(postsData.items)) {
                            currentCafe.posts = postsData.items.map(pItem => {
                                const commArr = Array.isArray(pItem.comments) ? pItem.comments : [];
                                return {
                                    id: pItem.id,
                                    collectionId: pItem.collectionId || "cafe_posts",
                                    cafeId: pItem.cafeId,
                                    board: pItem.board || "자유게시판",
                                    title: pItem.title || "(제목 없음)",
                                    content: pItem.content || "",
                                    author: pItem.author || currentCafe.manager || "익명",
                                    authorId: pItem.authorId || "",
                                    isNotice: Boolean(pItem.isNotice),
                                    views: pItem.views || 0,
                                    likes: pItem.likes || 0,
                                    comments: commArr,
                                    commentsCount: commArr.length,
                                    attachments: Array.isArray(pItem.attachments) ? pItem.attachments : [],
                                    time: pItem.time || (pItem.created ? pItem.created.split(" ")[0].replace(/-/g, ".") + "." : "2026.08.23.")
                                };
                            });
                        }
                    }
                } catch (postErr) {
                    console.warn("cafe_posts fetch error:", postErr);
                }
                window.currentCafeRecord = currentCafe;

                // Update local storage cafes
                const idx = cafes.findIndex(c => String(c.id) === String(currentCafe.id));
                if (idx !== -1) {
                    cafes[idx] = currentCafe;
                } else {
                    cafes.unshift(currentCafe);
                }
                safeSaveCafesData(cafes);
            }
        } catch (e) {
            console.log("PocketBase cafe sync error:", e);
        } finally {
            updateCafeHeaders();
            renderPostTable();
            if (initialPostId) {
                showPostDetail(initialPostId);
            }
        }
    }

    // Check membership: If user is manager or in cafe.joinedMembers, they are joined
    function isUserMember() {
        const user = localStorage.getItem("naverLoggedInUser") || loggedInUser;
        const userId = localStorage.getItem("naverLoggedInUserId") || "";
        if (!user && !userId) return false;
        const curUser = (user || "").trim();
        const curId = (userId || "").trim();
        const mgr = (currentCafe.manager || "").trim();
        if (mgr && ((curUser && (curUser === mgr || curUser.includes(mgr) || mgr.includes(curUser))) || (curId && mgr.includes(curId)))) return true;
        
        const joinedMembers = (currentCafe.joinedMembers || []).map(m => String(m).trim());
        return joinedMembers.some(m => (curUser && (m === curUser || m.startsWith(curUser + " "))) || (curId && m.includes(curId)));
    }

    function updateMembershipUI() {
        const isJoined = isUserMember();
        const secedeCard = document.getElementById("sidebar-secede-card");
        if (isJoined) {
            if (btnSidebarJoinCafe) btnSidebarJoinCafe.style.display = "none";
            if (btnOpenWriteModal) btnOpenWriteModal.style.display = "block";
            if (secedeCard) secedeCard.style.display = "block";
        } else {
            if (btnSidebarJoinCafe) btnSidebarJoinCafe.style.display = "block";
            if (btnOpenWriteModal) btnOpenWriteModal.style.display = "none";
            if (secedeCard) secedeCard.style.display = "none";
        }
    }

    async function syncManagerProfileAvatar(managerName) {
        if (!cafeProfileAvatar) return;
        const targetMgr = (managerName || "").trim();
        if (!targetMgr) return;

        // 1. Check if manager is currently logged-in user and has avatar in localStorage
        const currentLoggedIn = localStorage.getItem("naverLoggedInUser") || 
                                localStorage.getItem("naverLoggedInUsername") ||
                                localStorage.getItem("naverLoggedInUserId") || "";
        const cleanLoggedIn = currentLoggedIn.replace(/님$/, "").trim();
        const cleanMgr = targetMgr.replace(/님$/, "").trim();

        if (cleanLoggedIn && (cleanLoggedIn === cleanMgr || currentLoggedIn === targetMgr)) {
            const localAvatar = localStorage.getItem("naverProfileAvatar") || 
                                localStorage.getItem("naverLoggedInAvatar") ||
                                localStorage.getItem("naverUserAvatar");
            if (localAvatar && localAvatar !== "default-avatar.svg") {
                cafeProfileAvatar.src = localAvatar;
                return;
            }
        }

        // 2. Check cached avatar in localStorage
        const cachedAvatar = localStorage.getItem(`naverUserAvatar_${cleanMgr}`) || 
                             localStorage.getItem(`naverBlogAvatar_${cleanMgr}`);
        if (cachedAvatar && cachedAvatar !== "default-avatar.svg") {
            cafeProfileAvatar.src = cachedAvatar;
            return;
        }

        // 3. Query PocketBase users collection for manager's real avatarUrl
        try {
            const filterStr = encodeURIComponent(`name='${cleanMgr}'||username='${cleanMgr}'`);
            const res = await fetch(`${POCKETBASE_URL}/api/collections/users/records?filter=(${filterStr})`);
            if (res.ok) {
                const data = await res.json();
                if (data.items && data.items.length > 0) {
                    const userRec = data.items[0];
                    const avatar = userRec.avatarUrl || userRec.avatar;
                    if (avatar) {
                        let finalUrl = avatar;
                        if (!avatar.startsWith("data:") && !avatar.startsWith("http")) {
                            finalUrl = `${POCKETBASE_URL}/api/files/${userRec.collectionId}/${userRec.id}/${avatar}`;
                        }
                        cafeProfileAvatar.src = finalUrl;
                        localStorage.setItem(`naverUserAvatar_${cleanMgr}`, finalUrl);
                        return;
                    }
                }
            }
        } catch (e) {
            console.warn("Manager avatar fetch error:", e);
        }

        // 4. Fallback: if cafe icon exists, use it; otherwise default avatar
        if (currentCafe && currentCafe.icon && currentCafe.icon !== "default-avatar.svg") {
            cafeProfileAvatar.src = currentCafe.icon;
        } else {
            cafeProfileAvatar.src = "default-avatar.svg";
        }
    }

    function updateCafeHeaders() {
        if (cafeTitleMain) cafeTitleMain.textContent = currentCafe.name;
        document.title = `${currentCafe.name} : EDUVER 카페 (에듀버)`;

        const slug = currentCafe.urlSlug || currentCafe.id.replace("cafe_", "");
        if (cafeUrlSub) cafeUrlSub.textContent = `https://cafe.eduver.com/${slug}`;

        const mgr = currentCafe.manager || (currentCafe.posts && currentCafe.posts[0] ? currentCafe.posts[0].author : "매니저");
        if (cafeManagerName) cafeManagerName.textContent = mgr.length > 6 ? mgr.substring(0, 5) + "..." : mgr;

        if (cafeCreatedDate && currentCafe.createdDate) cafeCreatedDate.textContent = currentCafe.createdDate;
        if (cafeMemberCount) cafeMemberCount.textContent = currentCafe.members || "1";
        
        // Fetch and display manager's profile picture
        syncManagerProfileAvatar(mgr);

        updateMembershipUI();
    }

    updateCafeHeaders();
    syncFromPocketBase();

    // 5. Views Switching (Board List vs Post Detail vs Full Editor View vs Join View vs Member List View)
    const postDetailContainer = document.getElementById("post-detail-container");
    const boardListContainer = document.getElementById("board-list-container");
    const cafeWriteFullView = document.getElementById("cafe-write-full-view");
    const cafeJoinView = document.getElementById("cafe-join-view");
    const cafeMemberListView = document.getElementById("cafe-member-list-view");
    const cafeLayoutGrid = document.querySelector(".cafe-layout-grid");
    const welcomeHeroCard = document.getElementById("welcome-hero-card");
    const btnBackToList = document.getElementById("btn-back-to-list");
    let currentViewingPostId = null;
    let currentEditingPostId = null;

    function showMemberListView() {
        if (typeof openCafeMembersViewDirect === 'function') {
            openCafeMembersViewDirect();
        }
    }
    window.showMemberListView = showMemberListView;

    function showPostDetail(postId) {
        const isAuthCheck = (localStorage.getItem("naverIsLoggedIn") === "true") || Boolean(localStorage.getItem("naverLoggedInUser"));
        if (!isAuthCheck) {
            location.href = "login.html?redirect=" + encodeURIComponent(location.href);
            return;
        }

        currentViewingPostId = postId;
        window.currentViewingPostId = postId;
        const post = (currentCafe.posts || []).find(p => p.id === postId) || (currentCafe.posts && currentCafe.posts[0]);
        if (!post) return;
        window.currentViewingPostId = post.id;

        // Increment views on individual cafe_posts record
        post.views = (post.views || 0) + 1;
        if (post.id && !String(post.id).startsWith("p_")) {
            fetch(`${POCKETBASE_URL}/api/collections/cafe_posts/records/${post.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ views: post.views })
            }).catch(() => {});
        }

        // Populate details
        const detailBoardName = document.getElementById("detail-board-name");
        const detailNoticeBadge = document.getElementById("detail-notice-badge");
        const detailPostTitle = document.getElementById("detail-post-title");
        const detailAuthorName = document.getElementById("detail-author-name");
        const detailPostDate = document.getElementById("detail-post-date");
        const detailPostViews = document.getElementById("detail-post-views");
        const detailPostContentBody = document.getElementById("detail-post-content-body");
        const detailBottomAuthorName = document.getElementById("detail-bottom-author-name");
        const detailLikeCount = document.getElementById("detail-like-count");
        const detailCommentCount = document.getElementById("detail-comment-count");
        const detailTopCommentCount = document.getElementById("detail-top-comment-count");
        const authorBottomBar = document.querySelector(".author-bottom-bar");
        const postReactionBar = document.querySelector(".post-reaction-bar");
        const postTopbarLeft = document.querySelector(".post-detail-topbar .topbar-left");

        if (detailBoardName) detailBoardName.textContent = (post.board || "자유게시판") + " >";
        if (detailNoticeBadge) detailNoticeBadge.style.display = post.isNotice ? "inline-block" : "none";
        if (detailPostTitle) detailPostTitle.textContent = post.title || "(제목 없음)";
        if (detailAuthorName) detailAuthorName.textContent = post.author || "매니저";
        if (detailBottomAuthorName) detailBottomAuthorName.textContent = post.author;
        if (detailPostDate) detailPostDate.textContent = post.time || "2026.08.23 12:00";
        if (detailPostViews) detailPostViews.textContent = post.views || "1";
        
        const commentsList = Array.isArray(post.comments) ? post.comments : [];
        const commCount = commentsList.length;
        if (detailTopCommentCount) detailTopCommentCount.textContent = commCount;
        if (detailCommentCount) detailCommentCount.textContent = commCount;
        if (detailLikeCount) detailLikeCount.textContent = post.likes || 0;

        const isRestricted = !isUserMember();

        if (detailPostContentBody) {
            if (isRestricted) {
                if (typeof window.renderDetailAttachmentsDirect === "function") {
                    window.renderDetailAttachmentsDirect(post, false);
                }
                detailPostContentBody.innerHTML = `
                    <div class="member-lock-wrapper">
                        <div class="blurred-preview-content">
                            <p>이 글은 카페 멤버에게만 공개된 게시글입니다. 카페에 가입하여 모든 게시글과 정보를 확인해 보세요.</p>
                            <p>함께 나누며 소통하는 커뮤니티에 지금 참여해 보세요.</p>
                        </div>
                        <div class="member-lock-guide-text">
                            멤버에게만 공개된 게시글입니다.
                        </div>
                        <div class="member-lock-divider"></div>
                        <div class="member-lock-cta-box">
                            <button type="button" class="btn-lock-join-10s" id="btn-lock-join-now">
                                10초 만에 가입하기
                            </button>
                        </div>
                    </div>
                `;
                const btnLockJoin = document.getElementById("btn-lock-join-now");
                if (btnLockJoin) btnLockJoin.addEventListener("click", showJoinView);
            } else {
                const parsedPost = typeof window.parseCafePostAttachments === "function"
                    ? window.parseCafePostAttachments(post)
                    : { cleanContent: post.content || "", attachments: [] };
                let bodyText = parsedPost.cleanContent;
                if (!bodyText) {
                    bodyText = `${currentCafe.name} 카페를 시작합니다.\n\n나의 친구들, 같은 관심사를 공유하는 멤버들과 함께 재미있는 이야기 나누며 행복한 카페를 만들어가요!`;
                }
                detailPostContentBody.innerHTML = bodyText;
                if (typeof window.renderDetailAttachmentsDirect === "function") {
                    window.renderDetailAttachmentsDirect(post, true);
                }
            }
        }

        if (authorBottomBar) authorBottomBar.style.display = isRestricted ? "none" : "flex";
        if (postReactionBar) postReactionBar.style.display = isRestricted ? "none" : "flex";

        // Set active comment author name
        const commentWriteUserEl = document.getElementById("comment-write-user-name");
        const activeCommentNick = localStorage.getItem("naverLoggedInUser") || loggedInUser || "조이";
        if (commentWriteUserEl) {
            commentWriteUserEl.textContent = activeCommentNick;
        }

        // Render Comments List (Only for members)
        const commentSectionWrap = document.getElementById("comment-section-wrap");
        if (commentSectionWrap) {
            commentSectionWrap.style.display = isRestricted ? "none" : "block";
        }
        if (!isRestricted) {
            renderComments(post);
        }

        // Check if currently logged-in user is the author of this post
        const activeUser = (localStorage.getItem("naverLoggedInUser") || loggedInUser || "").trim();
        const activeUserId = (localStorage.getItem("naverLoggedInUserId") || "").trim();
        const postAuthor = (post.author || "").trim();

        const isMyPost = Boolean(
            !isRestricted && activeUser && postAuthor && (
                postAuthor === activeUser ||
                postAuthor.includes(activeUser) ||
                activeUser.includes(postAuthor) ||
                (post.authorId && post.authorId === activeUserId)
            )
        );

        const detailAuthorActions = document.getElementById("detail-author-actions");
        if (detailAuthorActions) {
            detailAuthorActions.style.display = isMyPost ? "flex" : "none";
        }
        if (postTopbarLeft) {
            postTopbarLeft.style.display = isMyPost ? "flex" : "none";
        }

        if (cafeLayoutGrid) cafeLayoutGrid.style.display = "grid";
        if (cafeWriteFullView) cafeWriteFullView.style.display = "none";
        if (cafeJoinView) cafeJoinView.style.display = "none";
        if (cafeMemberListView) cafeMemberListView.style.display = "none";
        if (boardListContainer) boardListContainer.style.display = "none";
        if (postDetailContainer) postDetailContainer.style.display = "flex";
        window.scrollTo({ top: 120, behavior: 'smooth' });
    }

    window.showPostDetail = showPostDetail;
    window.openPostDetailDirect = showPostDetail;

    function showBoardList() {
        currentViewingPostId = null;
        if (cafeLayoutGrid) cafeLayoutGrid.style.display = "grid";
        if (cafeWriteFullView) cafeWriteFullView.style.display = "none";
        if (cafeJoinView) cafeJoinView.style.display = "none";
        if (cafeMemberListView) cafeMemberListView.style.display = "none";
        if (postDetailContainer) postDetailContainer.style.display = "none";
        if (boardListContainer) boardListContainer.style.display = "block";
        renderPostTable();
    }

    // Save cafe state locally and to PocketBase (with Fetch-Before-Merge concurrency protection)
    async function saveCafeState(mutatorFn) {
        if (typeof window.fetchAndMergeCafeRecord === "function") {
            await window.fetchAndMergeCafeRecord(currentCafe, mutatorFn);
            if (window.currentCafeRecord) {
                window.currentCafeRecord = currentCafe;
            }
            const idx = cafes.findIndex(c => String(c.id) === String(currentCafe.id));
            if (idx !== -1) cafes[idx] = currentCafe;
            else cafes.unshift(currentCafe);
            safeSaveCafesData(cafes);
            return true;
        }

        if (typeof mutatorFn === "function") {
            mutatorFn(currentCafe);
        }
        const idx = cafes.findIndex(c => String(c.id) === String(currentCafe.id));
        if (idx !== -1) {
            cafes[idx] = currentCafe;
        } else {
            cafes.unshift(currentCafe);
        }
        safeSaveCafesData(cafes);

        // PocketBase Async Sync (only lightweight cafe metadata, posts are in cafe_posts)
        if (currentCafe.id && !currentCafe.id.startsWith("cafe_")) {
            try {
                await fetch(`${POCKETBASE_URL}/api/collections/cafes/records/${currentCafe.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        newPostsToday: (currentCafe.posts || []).length,
                        members: currentCafe.members,
                        joinedMembers: currentCafe.joinedMembers,
                        manager: currentCafe.manager
                    })
                });
            } catch (err) {
                console.log("PB Sync patch notice:", err);
            }
        }
        return true;
    }

    function showWriteView() {
        const isAuthCheck = (localStorage.getItem("naverIsLoggedIn") === "true") || Boolean(localStorage.getItem("naverLoggedInUser"));
        if (!isAuthCheck) {
            alert("로그인이 필요한 서비스입니다.");
            location.href = "login.html?redirect=" + encodeURIComponent(location.href);
            return;
        }

        if (!isUserMember()) {
            if (confirm("카페 멤버만 글을 작성할 수 있습니다.\n지금 카페에 가입하시겠습니까?")) {
                showJoinView();
            }
            return;
        }

        currentEditingPostId = null;
        window.currentEditingPostId = null;
        window.attachedCafeFiles = [];
        if (typeof window.renderWriteAttachmentsDirect === "function") {
            window.renderWriteAttachmentsDirect();
        }

        if (cafeLayoutGrid) cafeLayoutGrid.style.display = "none";
        if (postDetailContainer) postDetailContainer.style.display = "none";
        if (cafeJoinView) cafeJoinView.style.display = "none";
        if (cafeMemberListView) cafeMemberListView.style.display = "none";
        if (cafeWriteFullView) {
            cafeWriteFullView.style.display = "block";
            cafeWriteFullView.style.visibility = "visible";
        }
        
        const writePageTitle = document.querySelector(".write-page-title");
        if (writePageTitle) writePageTitle.textContent = "카페 글쓰기";
        const btnFullSubmit = document.getElementById("btn-full-submit");
        if (btnFullSubmit) btnFullSubmit.textContent = "등록";

        // Reset full write form
        const titleEl = document.getElementById("full-write-title");
        const contentEl = document.getElementById("full-write-content");
        const tagsEl = document.getElementById("full-write-tags");
        const noticeEl = document.getElementById("check-write-notice");
        if (titleEl) { titleEl.value = ""; titleEl.focus(); }
        if (contentEl) contentEl.innerHTML = "";
        if (tagsEl) tagsEl.value = "";
        if (noticeEl) noticeEl.checked = false;
        
        window.scrollTo({ top: 80, behavior: 'smooth' });
    }

    function editCurrentPost() {
        const targetPostId = currentViewingPostId || window.currentViewingPostId;
        if (!targetPostId) return;
        const post = (currentCafe.posts || []).find(p => p.id === targetPostId)
            || (window.currentCafeRecord && Array.isArray(window.currentCafeRecord.posts) ? window.currentCafeRecord.posts.find(p => p.id === targetPostId) : null);
        if (!post) return;

        currentEditingPostId = post.id;
        window.currentEditingPostId = post.id;
        window.attachedCafeFiles = [];
        if (typeof window.renderWriteAttachmentsDirect === "function") {
            window.renderWriteAttachmentsDirect();
        }

        if (cafeLayoutGrid) cafeLayoutGrid.style.display = "none";
        if (postDetailContainer) postDetailContainer.style.display = "none";
        if (cafeJoinView) cafeJoinView.style.display = "none";
        if (cafeMemberListView) cafeMemberListView.style.display = "none";
        if (cafeWriteFullView) {
            cafeWriteFullView.style.display = "block";
            cafeWriteFullView.style.visibility = "visible";
        }

        const writePageTitle = document.querySelector(".write-page-title");
        if (writePageTitle) writePageTitle.textContent = "카페 글 수정";
        const btnFullSubmit = document.getElementById("btn-full-submit");
        if (btnFullSubmit) btnFullSubmit.textContent = "수정 완료";

        const titleEl = document.getElementById("full-write-title");
        const contentEl = document.getElementById("full-write-content");
        const boardEl = document.getElementById("full-write-board");
        const prefixEl = document.getElementById("full-write-prefix");
        const noticeEl = document.getElementById("check-write-notice");

        let editTitle = post.title || "";
        let editPrefix = "";
        const prefixMatch = editTitle.match(/^\[(잡담|질문|정보|후기)\]\s*(.*)$/);
        if (prefixMatch) {
            editPrefix = prefixMatch[1];
            editTitle = prefixMatch[2];
        }

        if (prefixEl) prefixEl.value = editPrefix;
        if (titleEl) {
            titleEl.value = editTitle;
            titleEl.focus();
        }
        const parsedEditContent = typeof window.parseCafePostAttachments === "function"
            ? window.parseCafePostAttachments(post).cleanContent
            : (post.content || "");
        if (contentEl) contentEl.innerHTML = parsedEditContent;
        if (boardEl && post.board) boardEl.value = post.board;
        if (noticeEl) noticeEl.checked = Boolean(post.isNotice);

        window.scrollTo({ top: 80, behavior: 'smooth' });
    }

    window.openCafeWriteView = showWriteView;
    window.editCurrentPost = editCurrentPost;
    window.editCurrentPostDirect = editCurrentPost;

    function showJoinView() {
        const isAuthCheck = (localStorage.getItem("naverIsLoggedIn") === "true") || Boolean(localStorage.getItem("naverLoggedInUser"));
        if (!isAuthCheck) {
            alert("카페 가입을 위해 먼저 로그인이 필요합니다.");
            location.href = "login.html?redirect=" + encodeURIComponent(location.href);
            return;
        }

        const boardList = document.getElementById("board-list-container");
        const postDetail = document.getElementById("post-detail-container");
        const writeView = document.getElementById("cafe-write-full-view");
        const joinView = document.getElementById("cafe-join-view");
        const memberView = document.getElementById("cafe-member-list-view");

        if (boardList) boardList.style.display = "none";
        if (postDetail) postDetail.style.display = "none";
        if (writeView) writeView.style.display = "none";
        if (memberView) memberView.style.display = "none";
        if (joinView) {
            joinView.style.display = "block";
            joinView.style.visibility = "visible";
        }

        // Fill join information
        const joinCafeDesc = document.getElementById("join-cafe-desc");
        const joinNicknameInput = document.getElementById("join-nickname-input");
        const activeUser = localStorage.getItem("naverLoggedInUser") || loggedInUser;
        if (joinCafeDesc) {
            joinCafeDesc.textContent = currentCafe.desc || `🔥 ${currentCafe.name} 카페에서 지식을 나누고 성장할 분들을 환영합니다!`;
        }
        if (joinNicknameInput) {
            joinNicknameInput.value = activeUser || "";
        }

        refreshJoinCaptcha();
        window.scrollTo({ top: 120, behavior: 'smooth' });
    }

    window.openCafeJoinView = showJoinView;

    // Attach to sidebar join button
    const joinBtn = document.getElementById("btn-sidebar-join-cafe");
    if (joinBtn) {
        joinBtn.onclick = function(e) {
            if (e) e.preventDefault();
            showJoinView();
        };
    }

    // 5-B. Join Form Captcha & Submission
    let currentJoinCaptcha = "FU5TP8";
    const joinCaptchaCode = document.getElementById("join-captcha-code");
    const btnRefreshJoinCaptcha = document.getElementById("btn-refresh-join-captcha");
    const cafeJoinForm = document.getElementById("cafe-join-form");
    const joinCaptchaInput = document.getElementById("join-captcha-input");

    function refreshJoinCaptcha() {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let str = "";
        for (let i = 0; i < 6; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        currentJoinCaptcha = str;
        if (joinCaptchaCode) joinCaptchaCode.textContent = str;
        if (joinCaptchaInput) joinCaptchaInput.value = "";
    }
    window.refreshJoinCaptcha = refreshJoinCaptcha;

    if (btnRefreshJoinCaptcha) {
        btnRefreshJoinCaptcha.addEventListener("click", refreshJoinCaptcha);
    }

    // Wire Nickname clear and byte count
    const joinNickInput = document.getElementById("join-nickname-input");
    const btnClearNick = document.getElementById("btn-clear-nick");
    const nickBytesCount = document.getElementById("nick-bytes-count");

    if (joinNickInput) {
        joinNickInput.addEventListener("input", () => {
            const val = joinNickInput.value;
            let bytes = 0;
            for (let i = 0; i < val.length; i++) {
                bytes += val.charCodeAt(i) > 128 ? 2 : 1;
            }
            if (nickBytesCount) nickBytesCount.textContent = `${bytes}/20bytes`;
        });
    }

    if (btnClearNick && joinNickInput) {
        btnClearNick.addEventListener("click", () => {
            joinNickInput.value = "";
            if (nickBytesCount) nickBytesCount.textContent = "0/20bytes";
            joinNickInput.focus();
        });
    }

    // Join Form Submission Logic
    async function handleJoinSubmit(e) {
        if (e) e.preventDefault();
        
        const inputVal = (joinCaptchaInput ? joinCaptchaInput.value.trim() : "").toUpperCase();
        if (inputVal !== currentJoinCaptcha.toUpperCase()) {
            alert("보안문자가 일치하지 않습니다. 이미지를 확인 후 다시 입력해주세요.");
            refreshJoinCaptcha();
            if (joinCaptchaInput) joinCaptchaInput.focus();
            return;
        }

        const customNick = (document.getElementById("join-nickname-input") ? document.getElementById("join-nickname-input").value.trim() : "") || "새회원";
        const loggedInId = (localStorage.getItem("naverLoggedInUsername") || (localStorage.getItem("naverLoggedInEmail") ? localStorage.getItem("naverLoggedInEmail").split("@")[0] : "") || localStorage.getItem("naverLoggedInUserId") || "").trim();

        // Save nickname as active login session
        localStorage.setItem("naverIsLoggedIn", "true");
        localStorage.setItem("naverLoggedInUser", customNick);

        if (!currentCafe.joinedMembers) currentCafe.joinedMembers = [];
        
        // Add nickname and loginId (if present)
        const memberKey = loggedInId ? `${customNick} (${loggedInId})` : customNick;
        if (!currentCafe.joinedMembers.includes(memberKey) && !currentCafe.joinedMembers.includes(customNick)) {
            currentCafe.joinedMembers.push(memberKey);
        }

        // Increment member count
        let curCount = parseInt((currentCafe.members || "1").replace(/,/g, ""));
        curCount = isNaN(curCount) ? 2 : curCount + 1;
        currentCafe.members = curCount.toLocaleString();

        await saveCafeState();
        updateCafeHeaders();

        alert(`🎉 '${currentCafe.name}' 카페에 성공적으로 가입되었습니다!\n환영합니다, ${customNick}님!`);
        showBoardList();
    }

    if (cafeJoinForm) {
        cafeJoinForm.onsubmit = handleJoinSubmit;
    }

    if (btnBackToList) {
        btnBackToList.addEventListener("click", showBoardList);
    }

    // 6. Render Comments
    const commentListContainer = document.getElementById("comment-list-container");
    const commentInputText = document.getElementById("comment-input-text");
    const btnCommentSubmit = document.getElementById("btn-comment-submit");

    function renderComments(post) {
        if (typeof window.renderComments === "function" && window.renderComments !== renderComments) {
            window.renderComments(post);
            return;
        }
        if (!commentListContainer || !post) return;
        const comments = Array.isArray(post.comments) ? post.comments : [];
        commentListContainer.innerHTML = "";
        if (comments.length === 0) return;

        comments.forEach((c, idx) => {
            const cId = c.id || ("c_idx_" + idx);
            c.id = cId;
            const item = document.createElement("div");
            item.className = "comment-item";
            const authorNick = c.author || "익명";
            const avatarUrl = c.avatar || "default-avatar.svg";
            const isMine = typeof window.isMyCafeCommentDirect === "function" ? window.isMyCafeCommentDirect(c) : false;
            const moreMenuHtml = isMine ? `
                <div class="comment-more-wrap">
                    <button type="button" class="btn-comment-more" onclick="toggleCommentMenuDirect('${cId}', event)" title="댓글 메뉴">
                        <i class="fa-solid fa-ellipsis"></i>
                    </button>
                    <div class="comment-more-dropdown" id="comment-menu-${cId}" onclick="event.stopPropagation()">
                        <button type="button" class="btn-comment-menu-item" onclick="startEditCommentDirect('${cId}')">수정</button>
                        <button type="button" class="btn-comment-menu-item" onclick="deleteCommentDirect('${cId}')">삭제</button>
                    </div>
                </div>
            ` : "";
            const safeText = (c.text || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
            item.innerHTML = `
                <div class="comment-avatar"><img src="${avatarUrl}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;"></div>
                <div class="comment-body">
                    <div class="comment-header-line">
                        <div class="comment-header-left">
                            <span class="comment-author">${authorNick}</span>
                            <span class="comment-date">${c.time}</span>
                        </div>
                        ${moreMenuHtml}
                    </div>
                    <div class="comment-text" id="comment-text-${cId}">${safeText}</div>
                    ${isMine ? `
                        <div class="comment-edit-box" id="comment-edit-box-${cId}" style="display: none;">
                            <textarea class="comment-edit-textarea" id="comment-edit-input-${cId}" rows="2">${safeText}</textarea>
                            <div class="comment-edit-actions">
                                <button type="button" class="btn-comment-edit-cancel" onclick="cancelEditCommentDirect('${cId}')">취소</button>
                                <button type="button" class="btn-comment-edit-save" onclick="saveEditCommentDirect('${cId}')">등록</button>
                            </div>
                        </div>
                    ` : ""}
                </div>
            `;
            commentListContainer.appendChild(item);
        });
    }

    // Comment Input change activates submit button (submission is handled by submitCommentDirect in cafe-detail.html)
    if (commentInputText && btnCommentSubmit) {
        commentInputText.addEventListener("input", () => {
            if (commentInputText.value.trim().length > 0) {
                btnCommentSubmit.classList.add("active");
            } else {
                btnCommentSubmit.classList.remove("active");
            }
        });
    }

    // Override submitCommentDirect so both currentCafe and window.currentCafeRecord stay synced with cafe_posts
    let isSubmittingComment = false;
    window.submitCommentDirect = async function() {
        if (isSubmittingComment) return;
        const isAuthCheck = (localStorage.getItem("naverIsLoggedIn") === "true") || Boolean(localStorage.getItem("naverLoggedInUser"));
        if (!isAuthCheck) {
            alert("댓글을 작성하려면 먼저 로그인이 필요합니다.");
            return;
        }
        const text = commentInputText ? commentInputText.value.trim() : "";
        if (!text) {
            alert("댓글 내용을 입력해주세요.");
            if (commentInputText) commentInputText.focus();
            return;
        }
        const postId = currentViewingPostId || window.currentViewingPostId;
        if (!postId) return;

        isSubmittingComment = true;
        try {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            const hours = String(now.getHours()).padStart(2, "0");
            const mins = String(now.getMinutes()).padStart(2, "0");
            const timeStr = `${year}.${month}.${day}. ${hours}:${mins}`;
            const activeNick = (localStorage.getItem("naverLoggedInUser") || loggedInUser || "새회원").trim();

            const newComment = {
                id: "c_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
                author: activeNick,
                authorId: (localStorage.getItem("naverLoggedInUserId") || "").trim(),
                time: timeStr,
                text: text
            };

            let mergedComments = [newComment];
            if (!String(postId).startsWith("p_")) {
                try {
                    const getRes = await fetch(`${POCKETBASE_URL}/api/collections/cafe_posts/records/${postId}`);
                    if (getRes.ok) {
                        const remotePost = await getRes.json();
                        const rComms = Array.isArray(remotePost.comments) ? remotePost.comments : [];
                        mergedComments = [...rComms];
                        if (!mergedComments.some(cm => cm.id === newComment.id)) {
                            mergedComments.push(newComment);
                        }
                        await fetch(`${POCKETBASE_URL}/api/collections/cafe_posts/records/${postId}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ comments: mergedComments })
                        });
                    }
                } catch (err) {
                    console.warn("Comment PB sync error:", err);
                }
            }

            const post = (currentCafe.posts || []).find(p => p.id === postId);
            if (post) {
                post.comments = mergedComments;
                post.commentsCount = mergedComments.length;
            }
            window.currentCafeRecord = currentCafe;
            safeSaveCafesData(cafes);

            if (commentInputText) commentInputText.value = "";
            if (btnCommentSubmit) btnCommentSubmit.classList.remove("active");

            const detailCommentCount = document.getElementById("detail-comment-count");
            const detailTopCommentCount = document.getElementById("detail-top-comment-count");
            if (detailCommentCount) detailCommentCount.textContent = mergedComments.length;
            if (detailTopCommentCount) detailTopCommentCount.textContent = mergedComments.length;

            renderComments(post || { comments: mergedComments });
        } finally {
            isSubmittingComment = false;
        }
    };
    window.submitComment = window.submitCommentDirect;

    if (hideNoticeCheck) {
        hideNoticeCheck.addEventListener("change", renderPostTable);
    }

    renderPostTable();

    // If URL has specific initialPostId, open immediately
    if (initialPostId) {
        showPostDetail(initialPostId);
    }

    // 8. Board Switching Events (Sidebar)
    document.querySelectorAll(".board-item").forEach(item => {
        item.addEventListener("click", () => {
            document.querySelectorAll(".board-item").forEach(b => b.classList.remove("active"));
            item.classList.add("active");
            currentActiveBoard = item.getAttribute("data-board") || "all";
            showBoardList();
        });
    });

    // 9. Delete Posts Functionality (Table Checkbox Delete & Detail View Delete)
    // Batch Delete selected posts from table
    const btnBoardDelete = document.getElementById("btn-board-delete");
    if (btnBoardDelete) {
        btnBoardDelete.addEventListener("click", async () => {
            const checkedItems = document.querySelectorAll(".post-check-item:checked");
            if (checkedItems.length === 0) {
                alert("삭제할 게시글을 선택해주세요.");
                return;
            }

            if (confirm(`선택한 ${checkedItems.length}개의 게시글을 삭제하시겠습니까?`)) {
                const idsToDelete = Array.from(checkedItems).map(i => i.getAttribute("data-id")).filter(Boolean);
                await Promise.all(idsToDelete.map(delId => {
                    if (!String(delId).startsWith("p_")) {
                        return fetch(`${POCKETBASE_URL}/api/collections/cafe_posts/records/${delId}`, { method: "DELETE" }).catch(() => {});
                    }
                    return Promise.resolve();
                }));
                currentCafe.posts = (currentCafe.posts || []).filter(p => !idsToDelete.includes(p.id));
                window.currentCafeRecord = currentCafe;
                await saveCafeState();
                renderPostTable();
                alert("게시글이 삭제되었습니다.");
            }
        });
    }

    // Single Delete & Edit from Post Detail View
    const btnPostEdit = document.getElementById("btn-post-edit");
    const btnPostDelete = document.getElementById("btn-post-delete");
    const btnDetailBottomEdit = document.getElementById("btn-detail-bottom-edit");
    const btnDetailBottomDelete = document.getElementById("btn-detail-bottom-delete");
    
    async function deleteCurrentPost() {
        if (confirm("이 게시글을 삭제하시겠습니까?\n삭제된 글은 복구할 수 없습니다.")) {
            const targetId = currentViewingPostId || window.currentViewingPostId;
            if (targetId) {
                if (!String(targetId).startsWith("p_")) {
                    try {
                        await fetch(`${POCKETBASE_URL}/api/collections/cafe_posts/records/${targetId}`, { method: "DELETE" });
                    } catch (e) {}
                }
                currentCafe.posts = (currentCafe.posts || []).filter(p => p.id !== targetId);
                window.currentCafeRecord = currentCafe;
                await saveCafeState();
            }
            alert("게시글이 삭제되었습니다.");
            showBoardList();
        }
    }

    if (btnPostEdit) btnPostEdit.addEventListener("click", editCurrentPost);
    if (btnPostDelete) btnPostDelete.addEventListener("click", deleteCurrentPost);
    if (btnDetailBottomEdit) btnDetailBottomEdit.addEventListener("click", editCurrentPost);
    if (btnDetailBottomDelete) btnDetailBottomDelete.addEventListener("click", deleteCurrentPost);

    // Detail Bottom Toolbar actions
    const btnDetailBottomList = document.getElementById("btn-detail-bottom-list");
    const btnDetailBottomTop = document.getElementById("btn-detail-bottom-top");

    if (btnDetailBottomList) btnDetailBottomList.addEventListener("click", showBoardList);
    if (btnDetailBottomTop) btnDetailBottomTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // 10. Like Button Toggle
    const btnLikePost = document.getElementById("btn-like-post");
    const detailLikeIcon = document.getElementById("detail-like-icon");
    const detailLikeCount = document.getElementById("detail-like-count");
    let isLiked = false;

    if (btnLikePost) {
        btnLikePost.addEventListener("click", () => {
            isLiked = !isLiked;
            let current = parseInt(detailLikeCount.textContent || "0");
            if (isLiked) {
                detailLikeIcon.className = "fa-solid fa-heart";
                detailLikeIcon.style.color = "#e03131";
                detailLikeCount.textContent = current + 1;
            } else {
                detailLikeIcon.className = "fa-regular fa-heart";
                detailLikeIcon.style.color = "";
                detailLikeCount.textContent = Math.max(0, current - 1);
            }
        });
    }

    // 11. URL Copy Button
    const btnCopyUrl = document.getElementById("btn-copy-url");
    if (btnCopyUrl) {
        btnCopyUrl.addEventListener("click", () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert("게시글 주소가 복사되었습니다.");
            }).catch(() => {
                prompt("게시글 주소:", window.location.href);
            });
        });
    }

    // 12. Connect [카페 글쓰기] buttons to Full Editor View
    const btnBoardWrite = document.getElementById("btn-board-write");

    if (btnOpenWriteModal) btnOpenWriteModal.addEventListener("click", () => showWriteView());
    if (btnBoardWrite) btnBoardWrite.addEventListener("click", () => showWriteView());

    // 13. Full Editor Formatting Controls (Bold, Italic, Underline, Photo, Link, etc.)
    const fmtBold = document.getElementById("fmt-bold");
    const fmtItalic = document.getElementById("fmt-italic");
    const fmtUnderline = document.getElementById("fmt-underline");
    const fmtStrike = document.getElementById("fmt-strike");
    const fmtAlignLeft = document.getElementById("fmt-align-left");
    const fmtAlignCenter = document.getElementById("fmt-align-center");
    const fmtAlignRight = document.getElementById("fmt-align-right");
    const fullWriteContent = document.getElementById("full-write-content");
    const btnToolPhoto = document.getElementById("btn-tool-photo");
    const fullWritePhotoFile = document.getElementById("full-write-photo-file");
    const btnToolLink = document.getElementById("btn-tool-link");
    const btnToolQuote = document.getElementById("btn-tool-quote");
    const btnToolDivider = document.getElementById("btn-tool-divider");

    function execCmd(cmd, val = null) {
        if (fullWriteContent) {
            fullWriteContent.focus();
            document.execCommand(cmd, false, val);
        }
    }

    if (fmtBold) fmtBold.addEventListener("click", () => execCmd("bold"));
    if (fmtItalic) fmtItalic.addEventListener("click", () => execCmd("italic"));
    if (fmtUnderline) fmtUnderline.addEventListener("click", () => execCmd("underline"));
    if (fmtStrike) fmtStrike.addEventListener("click", () => execCmd("strikeThrough"));
    if (fmtAlignLeft) fmtAlignLeft.addEventListener("click", () => execCmd("justifyLeft"));
    if (fmtAlignCenter) fmtAlignCenter.addEventListener("click", () => execCmd("justifyCenter"));
    if (fmtAlignRight) fmtAlignRight.addEventListener("click", () => execCmd("justifyRight"));

    const photoFileInput = document.getElementById("write-photo-upload") || document.getElementById("full-write-photo-file");
    if (btnToolPhoto && photoFileInput) {
        btnToolPhoto.addEventListener("click", () => photoFileInput.click());
        photoFileInput.addEventListener("change", async (e) => {
            const files = e.target.files ? Array.from(e.target.files) : [];
            photoFileInput.value = "";
            for (const file of files) {
                const compressedUrl = await compressCafeImageFile(file, 800, 0.72);
                if (compressedUrl && fullWriteContent) {
                    fullWriteContent.focus();
                    const imgHtml = `<p><img src="${compressedUrl}" alt="첨부 이미지" style="max-width: 100%; height: auto; border-radius: 8px; margin: 12px 0; display: block; box-shadow: 0 4px 12px rgba(0,0,0,0.08);"></p><p><br></p>`;
                    document.execCommand("insertHTML", false, imgHtml);
                }
            }
        });
    }

    if (btnToolLink) {
        btnToolLink.addEventListener("click", () => {
            const url = prompt("삽입할 링크 주소를 입력하세요 (http/https):", "https://");
            if (url) execCmd("createLink", url);
        });
    }

    if (btnToolQuote && fullWriteContent) {
        btnToolQuote.addEventListener("click", () => {
            fullWriteContent.focus();
            document.execCommand("insertHTML", false, `<blockquote style="border-left: 3px solid #03c75a; padding-left: 12px; margin: 10px 0; color: #555;">인용구를 입력하세요</blockquote><br>`);
        });
    }

    if (btnToolDivider && fullWriteContent) {
        btnToolDivider.addEventListener("click", () => {
            fullWriteContent.focus();
            document.execCommand("insertHorizontalRule", false, null);
        });
    }

    // 14. Full Editor Submission Handler (Create & Edit Mode)
    async function handleFullSubmit() {
        const boardEl = document.getElementById("full-write-board");
        const prefixEl = document.getElementById("full-write-prefix");
        const titleEl = document.getElementById("full-write-title");
        const contentEl = document.getElementById("full-write-content");
        const noticeEl = document.getElementById("check-write-notice");

        const board = boardEl ? boardEl.value : "자유게시판";
        const prefix = prefixEl ? prefixEl.value : "";
        const rawTitle = titleEl ? titleEl.value.trim() : "";
        const contentHtml = contentEl ? contentEl.innerHTML.trim() : "";
        const isNotice = noticeEl ? noticeEl.checked : false;

        if (!rawTitle) {
            alert("제목을 입력해 주세요.");
            if (titleEl) titleEl.focus();
            return;
        }

        const title = prefix ? `[${prefix}] ${rawTitle}` : rawTitle;
        const curAuthor = (localStorage.getItem("naverLoggedInUser") || currentCafe.manager || loggedInUser || "연습용").trim();
        let finalContent = contentHtml || `${title} 본문 내용입니다.`;
        const filesToUpload = Array.isArray(window.attachedCafeFiles) ? window.attachedCafeFiles.slice() : [];

        if (filesToUpload.length > 0) {
            const metaList = filesToUpload.map(f => ({
                name: f.name,
                size: typeof window.formatCafeFileSize === "function" ? window.formatCafeFileSize(f.size || 0) : "첨부파일"
            }));
            finalContent += `<!-- EDUVER_ATTACH_META_START --><script type="application/json" class="eduver-attach-meta">${encodeURIComponent(JSON.stringify(metaList))}<\/script><!-- EDUVER_ATTACH_META_END -->`;
        }

        // If in Edit Mode (수정 모드)
        if (currentEditingPostId || window.currentEditingPostId) {
            const editedId = currentEditingPostId || window.currentEditingPostId;
            currentEditingPostId = null;
            window.currentEditingPostId = null;
            let updatedAttachments = null;

            const postIdx = (currentCafe.posts || []).findIndex(p => p.id === editedId);
            const existingPost = postIdx !== -1 ? currentCafe.posts[postIdx] : null;
            if (filesToUpload.length === 0 && existingPost && existingPost.content) {
                const existingMetaMatch = existingPost.content.match(/<!-- EDUVER_ATTACH_META_START --><script type="application\/json" class="eduver-attach-meta">[\s\S]*?<\/script><!-- EDUVER_ATTACH_META_END -->/);
                if (existingMetaMatch) {
                    finalContent += existingMetaMatch[0];
                }
            }

            if (!String(editedId).startsWith("p_")) {
                try {
                    let patchRes;
                    if (filesToUpload.length > 0) {
                        const editFormData = new FormData();
                        editFormData.append("title", title);
                        editFormData.append("board", board);
                        editFormData.append("content", finalContent);
                        editFormData.append("isNotice", isNotice ? "true" : "false");
                        filesToUpload.forEach(file => editFormData.append("attachments", file));
                        patchRes = await fetch(`${POCKETBASE_URL}/api/collections/cafe_posts/records/${editedId}`, {
                            method: "PATCH",
                            body: editFormData
                        });
                    } else {
                        patchRes = await fetch(`${POCKETBASE_URL}/api/collections/cafe_posts/records/${editedId}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                title: title,
                                board: board,
                                content: finalContent,
                                isNotice: isNotice
                            })
                        });
                    }
                    if (patchRes && patchRes.ok) {
                        const patchedData = await patchRes.json();
                        if (patchedData && Array.isArray(patchedData.attachments)) {
                            updatedAttachments = patchedData.attachments;
                        }
                    }
                } catch (e) {
                    console.warn("PB edit cafe_post error:", e);
                }
            }

            window.attachedCafeFiles = [];
            if (typeof window.renderWriteAttachmentsDirect === "function") {
                window.renderWriteAttachmentsDirect();
            }

            if (postIdx !== -1) {
                currentCafe.posts[postIdx].title = title;
                currentCafe.posts[postIdx].board = board;
                currentCafe.posts[postIdx].content = finalContent;
                currentCafe.posts[postIdx].isNotice = isNotice;
                if (updatedAttachments) {
                    currentCafe.posts[postIdx].attachments = updatedAttachments;
                }
            }
            window.currentCafeRecord = currentCafe;
            safeSaveCafesData(cafes);

            alert("게시글이 성공적으로 수정되었습니다!");
            renderPostTable();
            showPostDetail(editedId);
            return;
        }

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const timeStr = `${year}.${month}.${day}.`;

        const newPost = {
            id: "p_" + Date.now(),
            collectionId: "cafe_posts",
            cafeId: currentCafe.id || "",
            cafeName: currentCafe.name || "",
            title: title,
            author: curAuthor,
            authorId: localStorage.getItem("naverLoggedInUserId") || "",
            time: timeStr,
            views: 0,
            likes: 0,
            commentsCount: 0,
            comments: [],
            attachments: [],
            board: board,
            content: finalContent,
            isNotice: isNotice
        };

        try {
            let createRes;
            if (filesToUpload.length > 0) {
                const formData = new FormData();
                formData.append("cafeId", newPost.cafeId);
                formData.append("cafeName", newPost.cafeName);
                formData.append("board", newPost.board);
                formData.append("title", newPost.title);
                formData.append("content", newPost.content);
                formData.append("author", newPost.author);
                formData.append("authorId", newPost.authorId);
                formData.append("isNotice", newPost.isNotice ? "true" : "false");
                formData.append("views", "0");
                formData.append("likes", "0");
                formData.append("comments", "[]");
                formData.append("time", newPost.time);
                filesToUpload.forEach(file => formData.append("attachments", file));
                createRes = await fetch(`${POCKETBASE_URL}/api/collections/cafe_posts/records`, {
                    method: "POST",
                    body: formData
                });
            } else {
                createRes = await fetch(`${POCKETBASE_URL}/api/collections/cafe_posts/records`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        cafeId: newPost.cafeId,
                        cafeName: newPost.cafeName,
                        board: newPost.board,
                        title: newPost.title,
                        content: newPost.content,
                        author: newPost.author,
                        authorId: newPost.authorId,
                        isNotice: newPost.isNotice,
                        views: 0,
                        likes: 0,
                        comments: [],
                        time: newPost.time
                    })
                });
            }
            if (createRes && createRes.ok) {
                const createdData = await createRes.json();
                if (createdData && createdData.id) {
                    newPost.id = createdData.id;
                    newPost.collectionId = createdData.collectionId || "cafe_posts";
                    newPost.attachments = Array.isArray(createdData.attachments) ? createdData.attachments : [];
                }
            }
        } catch (e) {
            console.warn("PB create cafe_post error:", e);
        }

        window.attachedCafeFiles = [];
        if (typeof window.renderWriteAttachmentsDirect === "function") {
            window.renderWriteAttachmentsDirect();
        }

        if (!Array.isArray(currentCafe.posts)) currentCafe.posts = [];
        currentCafe.posts.unshift(newPost);
        currentCafe.newPostsToday = currentCafe.posts.length;
        window.currentCafeRecord = currentCafe;
        await saveCafeState();

        alert("게시글이 성공적으로 등록되었습니다!");
        renderPostTable();
        showPostDetail(newPost.id);
    }

    window.handleFullSubmitDirect = handleFullSubmit;

    const btnFullSubmit = document.getElementById("btn-full-submit");
    if (btnFullSubmit) {
        btnFullSubmit.onclick = handleFullSubmit;
    }

    // 15. Fold Welcome Card
    const btnFoldHero = document.getElementById("btn-fold-hero");
    if (btnFoldHero && welcomeHeroCard) {
        let isFolded = false;
        btnFoldHero.addEventListener("click", () => {
            isFolded = !isFolded;
            if (isFolded) {
                welcomeHeroCard.style.display = "none";
            }
        });
    }

    // 16. Intro Toggle Alert
    const btnCafeIntroToggle = document.getElementById("btn-cafe-intro-toggle");
    if (btnCafeIntroToggle) {
        btnCafeIntroToggle.addEventListener("click", (e) => {
            e.preventDefault();
            alert(`[${currentCafe.name} 소개]\n\n매니저: ${currentCafe.manager || loggedInUser}\n주제: ${currentCafe.category || '자유'}\n설명: ${currentCafe.desc || '함께 만들어가는 이야기 공간입니다.'}`);
        });
    }

    // 17. Sidebar & Board Bottom Search
    function searchPosts(query) {
        const q = query.trim().toLowerCase();
        if (!q) {
            renderPostTable();
            return;
        }
        const filtered = (currentCafe.posts || []).filter(p => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q));
        
        if (filtered.length === 0) {
            cafePostTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#888;">'${q}' 검색 결과가 없습니다.</td></tr>`;
        } else {
            cafePostTbody.innerHTML = "";
            filtered.forEach((post, index) => {
                const tr = document.createElement("tr");
                if (post.isNotice) tr.className = "notice-tr";
                const numOrBadge = post.isNotice ? `<span class="badge-table-notice">공지</span>` : (filtered.length - index);

                tr.innerHTML = `
                    <td class="td-check"><input type="checkbox" class="post-check-item" data-id="${post.id}"></td>
                    <td>${numOrBadge}</td>
                    <td class="td-board-title"><span class="post-link-text">${post.title}</span><span class="badge-n-dot">N</span></td>
                    <td>${post.author}</td>
                    <td>${post.time}</td>
                    <td>${post.views || 0}</td>
                    <td>${post.likes || 0}</td>
                `;
                tr.querySelector(".td-board-title").addEventListener("click", () => showPostDetail(post.id));
                cafePostTbody.appendChild(tr);
            });
            syncCheckboxes();
        }
    }

    const sidebarSearchInput = document.getElementById("sidebar-search-input");
    const btnSidebarSearch = document.getElementById("btn-sidebar-search");
    if (btnSidebarSearch && sidebarSearchInput) {
        btnSidebarSearch.addEventListener("click", () => searchPosts(sidebarSearchInput.value));
    }

    const boardSearchInput = document.getElementById("board-search-input");
    const btnBottomSearchSubmit = document.getElementById("btn-bottom-search-submit");
    if (btnBottomSearchSubmit && boardSearchInput) {
        btnBottomSearchSubmit.addEventListener("click", () => searchPosts(boardSearchInput.value));
    }
});
