// EDUVER - Main Script file containing interactions

// ----------------------------------------------------
// 1. Data Definitions for Publishers ( 뉴스스탠드 모사 )
// ----------------------------------------------------
const publisherData = {
    all: [
        { name: "EBS 교육방송", class: "ebs" },
        { name: "NASA 우주국", class: "nasa" },
        { name: "National Geographic", class: "natgeo" },
        { name: "Nature 저널", class: "nature" },
        { name: "위키백과", class: "wikipedia" },
        { name: "서울대학교", class: "snu" },
        { name: "KAIST", class: "kaist" },
        { name: "TED Ed", class: "ted" },
        { name: "교보문고", class: "" },
        { name: "옥스포드 대학", class: "" },
        { name: "BBC Learning", class: "" },
        { name: "칸아카데미", class: "" },
        { name: "코세라", class: "" },
        { name: "듀오링고", class: "" },
        { name: "KERIS 교육학술", class: "" },
        { name: "동아사이언스", class: "" },
        { name: "학술진흥재단", class: "" },
        { name: "한국사편찬회", class: "" },
        { name: "사이언스올", class: "" },
        { name: "배움나라", class: "" },
        { name: "하버드 에듀", class: "" },
        { name: "MIT 테크리뷰", class: "" },
        { name: "한국교육과정평가원", class: "" },
        { name: "소년한국일보", class: "" }
    ],
    science: [
        { name: "NASA 우주국", class: "nasa" },
        { name: "Nature 저널", class: "nature" },
        { name: "National Geographic", class: "natgeo" },
        { name: "동아사이언스", class: "" },
        { name: "KAIST", class: "kaist" },
        { name: "MIT 테크리뷰", class: "" },
        { name: "IEEE Spectrum", class: "" },
        { name: "사이언스올", class: "" },
        { name: "천문연구원", class: "" },
        { name: "물리학동향", class: "" },
        { name: "생명공학연구소", class: "" },
        { name: "화학융합연구원", class: "" },
        { name: "지질자원연구원", class: "" },
        { name: "기상청 배움터", class: "" },
        { name: "로봇공학회", class: "" },
        { name: "해양과학기술원", class: "" },
        { name: "극지연구소", class: "" },
        { name: "스페이스X 뉴스", class: "" },
        { name: "뇌과학연구소", class: "" },
        { name: "나노융합원", class: "" },
        { name: "AI연구재단", class: "" },
        { name: "미래과학아카데미", class: "" },
        { name: "한국우주항공국", class: "" },
        { name: "사이언티픽 코리아", class: "" }
    ],
    humanities: [
        { name: "위키백과", class: "wikipedia" },
        { name: "브리태니커", class: "" },
        { name: "국립중앙도서관", class: "" },
        { name: "서울대학교", class: "snu" },
        { name: "하버드 에듀", class: "" },
        { name: "옥스포드 대학", class: "" },
        { name: "역사 채널", class: "" },
        { name: "TED Ed", class: "ted" },
        { name: "철학 나우", class: "" },
        { name: "한국사편찬회", class: "" },
        { name: "한국학연구원", class: "" },
        { name: "유네스코 코리아", class: "" },
        { name: "미술사 연구학회", class: "" },
        { name: "국립현대미술관", class: "" },
        { name: "사회과학포럼", class: "" },
        { name: "동양학연구소", class: "" },
        { name: "세계지리학회", class: "" },
        { name: "아시아인문원", class: "" },
        { name: "국회도서관", class: "" },
        { name: "고고학학술지", class: "" },
        { name: "문학동네", class: "" },
        { name: "창비 교육", class: "" },
        { name: "언어학 포털", class: "" },
        { name: "전통문화재단", class: "" }
    ],
    primary: [
        { name: "EBS 교육방송", class: "ebs" },
        { name: "코딩 놀이터", class: "" },
        { name: "수학 나라", class: "" },
        { name: "키즈 내셔널지오", class: "" },
        { name: "어린이 동아", class: "" },
        { name: "소년한국일보", class: "" },
        { name: "KBS 키즈", class: "" },
        { name: "대교 눈높이", class: "" },
        { name: "웅진 북클럽", class: "" },
        { name: "교원 빨간펜", class: "" },
        { name: "상상 초등교실", class: "" },
        { name: "아이스크림홈런", class: "" },
        { name: "밀크T 초등", class: "" },
        { name: "와이즈만 영재", class: "" },
        { name: "주니어 에듀버", class: "" },
        { name: "깨비키즈", class: "" },
        { name: "학습꾸러미", class: "" },
        { name: "재미있는 한글", class: "" },
        { name: "어린이 역사교실", class: "" },
        { name: "초등 영단어", class: "" },
        { name: "창의력 놀이터", class: "" },
        { name: "과학소년", class: "" },
        { name: "독서왕클럽", class: "" },
        { name: "주니어 수학동아", class: "" }
    ],
    secondary: [
        { name: "EBSi 고교배움", class: "ebs" },
        { name: "메가스터디", class: "" },
        { name: "이투스", class: "" },
        { name: "대성마이맥", class: "" },
        { name: "비상 교육", class: "" },
        { name: "천재교육", class: "" },
        { name: "금성 교과서", class: "" },
        { name: "교보문고", class: "" },
        { name: "대입 정보 포털", class: "" },
        { name: "수학공식 마스터", class: "" },
        { name: "코딩 올림피아드", class: "" },
        { name: "과학 탐구실험", class: "" },
        { name: "EBS 영어듣기", class: "" },
        { name: "한국사 1급 완성", class: "" },
        { name: "고교 학점제 지원", class: "" },
        { name: "진학사", class: "" },
        { name: "유웨이", class: "" },
        { name: "하이베스트", class: "" },
        { name: "일등 수학", class: "" },
        { name: "자이스토리", class: "" },
        { name: "마더텅", class: "" },
        { name: "EBS 수능특강", class: "" },
        { name: "모의고사 분석원", class: "" },
        { name: "학습 컨설팅", class: "" }
    ],
    global: [
        { name: "옥스포드 사전", class: "" },
        { name: "듀오링고", class: "" },
        { name: "캠브리지 프레스", class: "" },
        { name: "BBC Learning", class: "" },
        { name: "TED Talks", class: "ted" },
        { name: "코세라", class: "" },
        { name: "칸아카데미", class: "" },
        { name: "월스트리트 영어", class: "" },
        { name: "토익 마스터", class: "" },
        { name: "재이 어학원", class: "" },
        { name: "해커스 교육", class: "" },
        { name: "YBM Edu", class: "" },
        { name: "파고다 어학", class: "" },
        { name: "시원스쿨", class: "" },
        { name: "로제타 스톤", class: "" },
        { name: "민병철 유폰", class: "" },
        { name: "영독학습클럽", class: "" },
        { name: "프랑스어 교실", class: "" },
        { name: "중국어 마스터", class: "" },
        { name: "일본어 배움관", class: "" },
        { name: "글로벌 캠퍼스", class: "" },
        { name: "교환학생 길잡이", class: "" },
        { name: "IELTS 트레이닝", class: "" },
        { name: "영문법 기초학습", class: "" }
    ]
};

// Subscribed Publishers list tracker
const subscribedPublishers = new Set();

// Current Active Academic Stand Page
let currentGridPage = 1;
let currentGridCategory = 'all';

// ----------------------------------------------------
// 2. DOM Elements Selection
// ----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // Search Box Autocomplete
    const searchInput = document.getElementById("search-input");
    const searchDropdown = document.getElementById("search-dropdown");
    const searchForm = document.getElementById("search-form");
    const searchHistoryList = document.getElementById("search-history-list");
    const clearSearchBtn = document.getElementById("clear-search-btn");
    const aiSearchBtn = document.getElementById("ai-search-btn");

    // News Ticker
    const tickerList = document.getElementById("ticker-list");
    let tickerIndex = 0;
    const tickerItemsCount = tickerList ? tickerList.children.length : 0;

    // Academic / Journal Stand Tabs & Grid
    const journalTabs = document.querySelectorAll(".journal-tab");
    const publisherGrid = document.getElementById("publisher-grid");
    const gridPrevBtn = document.getElementById("grid-prev-btn");
    const gridNextBtn = document.getElementById("grid-next-btn");
    const gridPageIndicator = document.getElementById("grid-page-indicator");

    // Login Form State Controls
    const loginLoggedOut = document.getElementById("login-logged-out");
    const loginFormContainer = document.getElementById("login-form-container");
    const loginLoggedIn = document.getElementById("login-logged-in");
    const showLoginFormBtn = document.getElementById("show-login-form-btn");
    const closeLoginBtn = document.getElementById("close-login-btn");
    const authForm = document.getElementById("auth-form");
    const logoutBtn = document.getElementById("logout-btn");
    const userDisplayName = document.getElementById("user-display-name");

    // Course Slider
    const sliderTrack = document.getElementById("slider-track");
    const sliderPrevBtn = document.getElementById("slider-prev-btn");
    const sliderNextBtn = document.getElementById("slider-next-btn");
    const sliderIndicator = document.getElementById("slider-indicator");
    let currentSlide = 0;
    const totalSlides = 3;

    // Load recent search queries from localStorage if available
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");

    // ----------------------------------------------------
    // 3. News Ticker Auto Scrolling (뉴스 롤링)
    // ----------------------------------------------------
    const syncNewsTicker = () => {
        const storedNews = JSON.parse(localStorage.getItem("naverNewsArticles") || "[]");
        if (storedNews && storedNews.length > 0 && tickerList) {
            tickerList.innerHTML = storedNews.slice(0, 6).map(art => `
                <li><a href="news.html?id=${encodeURIComponent(art.id)}">[${art.category}] ${art.title}</a></li>
            `).join("");
        }
    };
    syncNewsTicker();

    const actualTickerCount = tickerList ? tickerList.children.length : tickerItemsCount;
    if (tickerList && actualTickerCount > 0) {
        setInterval(() => {
            const count = tickerList.children.length;
            if (count > 0) {
                tickerIndex = (tickerIndex + 1) % count;
                tickerList.style.top = `-${tickerIndex * 24}px`;
            }
        }, 3500);
    }

    // ----------------------------------------------------
    // 4. Search Box Autocomplete Controls
    // ----------------------------------------------------
    const renderRecentSearches = () => {
        if (!searchHistoryList) return;
        
        if (recentSearches.length === 0) {
            searchHistoryList.innerHTML = '<li class="empty-message">최근 검색 내역이 없습니다.</li>';
            return;
        }

        searchHistoryList.innerHTML = "";
        recentSearches.forEach((keyword, idx) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="search-keyword">${keyword}</span>
                <button class="delete-item-btn" data-index="${idx}"><i class="fa-solid fa-xmark"></i></button>
            `;
            searchHistoryList.appendChild(li);
        });

        // Add events to dynamically rendered keyword links & delete buttons
        searchHistoryList.querySelectorAll(".search-keyword").forEach(el => {
            el.addEventListener("click", (e) => {
                const keyword = e.target.textContent.trim();
                if (keyword) {
                    if (searchInput) searchInput.value = keyword;
                    if (searchDropdown) searchDropdown.style.display = "none";

                    // Re-order recent searches
                    recentSearches = recentSearches.filter(item => item !== keyword);
                    recentSearches.unshift(keyword);
                    if (recentSearches.length > 5) recentSearches.pop();
                    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
                    renderRecentSearches();

                    // Directly execute search
                    performMainSearch(keyword);
                }
            });
        });

        searchHistoryList.querySelectorAll(".delete-item-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.getAttribute("data-index"));
                recentSearches.splice(idx, 1);
                localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
                renderRecentSearches();
            });
        });
    };

    if (searchInput) {
        searchInput.addEventListener("focus", () => {
            renderRecentSearches();
            searchDropdown.style.display = "block";
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            const container = document.querySelector(".search-box-container");
            if (container && !container.contains(e.target)) {
                searchDropdown.style.display = "none";
            }
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener("click", () => {
            recentSearches = [];
            localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
            renderRecentSearches();
        });
    }

    // ----------------------------------------------------
    // Main In-Place Search Results Engine
    // ----------------------------------------------------
    const searchResultsSection = document.getElementById("main-search-results-section");
    const defaultMainContent = document.getElementById("default-main-content");
    const searchKeywordDisplay = document.getElementById("search-keyword-display");
    const searchTotalCount = document.getElementById("search-total-count");
    const searchItemsFeed = document.getElementById("search-items-feed");
    const btnCloseSearchResults = document.getElementById("btn-close-search-results");
    const searchTabBtns = document.querySelectorAll(".search-tab-btn");

    let currentSearchTab = "all";
    let activeQuery = "";

    function highlightKeyword(text, keyword) {
        if (!text || !keyword) return text || "";
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    function performMainSearch(query) {
        if (!query) return;
        activeQuery = query;
        
        // Hide default main content & show search results section
        if (defaultMainContent) defaultMainContent.style.display = "none";
        if (searchResultsSection) searchResultsSection.style.display = "block";

        if (searchKeywordDisplay) searchKeywordDisplay.textContent = query;
        if (searchInput) searchInput.value = query;
        if (searchDropdown) searchDropdown.style.display = "none";

        // Scroll to top of search results smoothly
        window.scrollTo({ top: 110, behavior: 'smooth' });

        renderSearchResultsFeed();
    }
    window.performMainSearch = performMainSearch;

    // ----------------------------------------------------
    // Webmaster Site Registration System (웹마스터 검색 사이트 등록 시스템)
    // ----------------------------------------------------
    const EDUVER_CUSTOM_SITES_KEY = "eduver_custom_registered_sites";

    const DEFAULT_INITIAL_SITES = [
        {
            id: "site_dokdo_seonhye_default",
            name: "순천선혜학교 독도교육주간",
            domain: "joeykor.github.io/dokdo",
            title: "순천선혜학교 독도교육주간 | '독도는 우리땅' 타자 대회",
            url: "https://joeykor.github.io/dokdo/index.html",
            desc: "전라남도 순천선혜학교 독도교육주간 - '독도는 우리땅' 타자 대회, 독도 퍼즐 및 우리 영토 독도 바로 알기 온라인 교육 포털",
            icon: "fa-solid fa-flag",
            iconBg: "#0070f3",
            sublinks: [
                { title: "타자 대회", url: "https://joeykor.github.io/dokdo/typing.html" },
                { title: "퍼즐 대회", url: "https://joeykor.github.io/dokdo/puzzle.html" }
            ],
            tags: [
                { title: "순천선혜학교", url: "http://seonhye.sc.jne.kr/" },
                { title: "독도는 우리땅", url: "https://joeykor.github.io/dokdo/index.html" }
            ],
            keywords: ["독도", "독도교육", "독도교육주간", "순천선혜학교", "선혜학교", "선혜학교독도", "선혜독도", "독도는우리땅", "독도타자", "독도퍼즐"],
            createdAt: "2026-10-06"
        }
    ];

    function getEduverCustomSites() {
        try {
            const stored = localStorage.getItem(EDUVER_CUSTOM_SITES_KEY);
            if (!stored) {
                localStorage.setItem(EDUVER_CUSTOM_SITES_KEY, JSON.stringify(DEFAULT_INITIAL_SITES));
                return DEFAULT_INITIAL_SITES;
            }
            const parsed = JSON.parse(stored);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                localStorage.setItem(EDUVER_CUSTOM_SITES_KEY, JSON.stringify(DEFAULT_INITIAL_SITES));
                return DEFAULT_INITIAL_SITES;
            }
            return parsed;
        } catch(e) {
            return DEFAULT_INITIAL_SITES;
        }
    }

    function saveEduverCustomSites(sites) {
        try {
            localStorage.setItem(EDUVER_CUSTOM_SITES_KEY, JSON.stringify(sites));
        } catch(e) {
            console.error("Failed to save custom sites:", e);
        }
    }

    // Auto-sync webmaster sites from PocketBase server in background
    async function syncWebmasterSitesFromPocketBase() {
        try {
            const res = await fetch("https://pb.joyfamkr.synology.me/api/collections/posts/records?filter=(category='웹마스터사이트')&sort=-created");
            if (res.ok) {
                const data = await res.json();
                if (data.items && data.items.length > 0) {
                    const synced = data.items.map(item => {
                        let meta = {};
                        try { meta = JSON.parse(item.fullContent || "{}"); } catch(e) {}
                        return {
                            id: item.id,
                            name: item.title,
                            domain: meta.domain || "",
                            title: meta.siteTitle || item.title,
                            url: meta.url || "#",
                            desc: item.summary || "",
                            icon: meta.icon || "fa-solid fa-flag",
                            iconBg: meta.iconBg || "#0070f3",
                            keywords: meta.keywords || [item.title],
                            sublinks: meta.sublinks || [],
                            tags: meta.tags || [{ title: item.title, url: meta.url || "#" }]
                        };
                    });
                    localStorage.setItem(EDUVER_CUSTOM_SITES_KEY, JSON.stringify(synced));
                }
            }
        } catch(err) {
            console.warn("Background webmaster sync skipped:", err);
        }
    }
    syncWebmasterSitesFromPocketBase();




    function closeSearchResults() {
        if (searchResultsSection) searchResultsSection.style.display = "none";
        if (defaultMainContent) defaultMainContent.style.display = "block";
        if (searchInput) searchInput.value = "";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const mainLogoLink = document.getElementById("main-logo-link");
    if (mainLogoLink) {
        mainLogoLink.addEventListener("click", (e) => {
            if (searchResultsSection && searchResultsSection.style.display !== "none") {
                e.preventDefault();
                closeSearchResults();
            }
        });
    }

    if (btnCloseSearchResults) {
        btnCloseSearchResults.addEventListener("click", closeSearchResults);
    }

    searchTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            searchTabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentSearchTab = btn.getAttribute("data-tab") || "all";
            renderSearchResultsFeed();
        });
    });

    const POCKETBASE_URL = "https://pb.joyfamkr.synology.me";

    // ----------------------------------------------------
    // Wikipedia Open API Real-Time Search Client
    // ----------------------------------------------------
    async function fetchWikipediaKnowledge(query) {
        if (!query || !query.trim()) return [];
        try {
            const url = `https://ko.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query.trim())}&gsrlimit=5&prop=pageimages|extracts|info&inprop=url&exintro=1&explaintext=1&exsentences=3&piprop=thumbnail&pithumbsize=300&format=json&origin=*`;
            const res = await fetch(url);
            if (!res.ok) return [];
            const data = await res.json();
            if (!data.query || !data.query.pages) return [];
            const pages = Object.values(data.query.pages)
                .sort((a, b) => (a.index || 0) - (b.index || 0))
                .filter(p => p.title && (p.extract || p.thumbnail));
            return pages;
        } catch (err) {
            console.warn("Wikipedia API search error:", err);
            return [];
        }
    }

    async function renderSearchResultsFeed() {
        if (!searchItemsFeed) return;

        // Show immediate loading state
        searchItemsFeed.innerHTML = `
            <div class="search-loading-state">
                <i class="fa-solid fa-circle-notch fa-spin"></i>
                <span>'<strong>${activeQuery}</strong>' 실시간 지식 및 검색 결과를 불러오는 중...</span>
            </div>
        `;

        try {
            // Concurrently fetch Wikipedia & sync PocketBase
            const wikiPromise = fetchWikipediaKnowledge(activeQuery);

        // Try syncing latest posts from PocketBase
        try {
            const pbRes = await fetch(`${POCKETBASE_URL}/api/collections/posts/records?sort=-created`);
            if (pbRes.ok) {
                const pbData = await pbRes.json();
                if (pbData.items && pbData.items.length > 0) {
                    // Extract webmaster sites to sync custom search database
                    const webmasterItems = pbData.items.filter(item => item.category === "웹마스터사이트");
                    if (webmasterItems.length > 0) {
                        const parsedSites = webmasterItems.map(item => {
                            let meta = {};
                            try { meta = JSON.parse(item.fullContent || "{}"); } catch(e) {}
                            return {
                                id: item.id,
                                name: item.title,
                                domain: meta.domain || "",
                                title: meta.siteTitle || item.title,
                                url: meta.url || "#",
                                desc: item.summary || "",
                                icon: meta.icon || "fa-solid fa-flag",
                                iconBg: meta.iconBg || "#0070f3",
                                keywords: meta.keywords || [item.title],
                                sublinks: meta.sublinks || [],
                                tags: meta.tags || [{ title: item.title, url: meta.url || "#" }]
                            };
                        });
                        localStorage.setItem(EDUVER_CUSTOM_SITES_KEY, JSON.stringify(parsedSites));
                    }

                    // Only keep normal user blog posts (exclude webmaster site markers)
                    const filteredItems = pbData.items.filter(item => item.title !== "Test Post" && item.summary !== "This is a test post." && item.category !== "웹마스터사이트");
                    const pbPosts = filteredItems.map(item => ({
                        id: item.id,
                        author: item.author || "블로거",
                        time: item.created ? new Date(item.created).toLocaleDateString() : "방금 전",
                        category: item.category || "일상·생각",
                        title: item.title || "",
                        summary: item.summary || "",
                        fullContent: item.fullContent || "",
                        thumbnail: item.thumbnail || "",
                        likes: item.likes || 0,
                        comments: item.comments || 0
                    }));

                    const localPosts = JSON.parse(localStorage.getItem("naverBlogPosts") || "[]");
                    const merged = [...pbPosts];
                    localPosts.forEach(lp => {
                        if (lp.isLocalOnly || (typeof lp.id === "string" && lp.id.startsWith("post_local_"))) {
                            if (!merged.find(mp => mp.id === lp.id)) {
                                merged.push(lp);
                            }
                        }
                    });
                    try {
                        localStorage.setItem("naverBlogPosts", JSON.stringify(merged));
                    } catch (quotaErr) {
                        try {
                            const slimPosts = merged.map((p, i) => {
                                if (i > 1 && p.fullContent && p.fullContent.length > 300) {
                                    return { ...p, fullContent: p.summary || p.fullContent.substring(0, 200) };
                                }
                                return p;
                            });
                            localStorage.setItem("naverBlogPosts", JSON.stringify(slimPosts));
                        } catch (quotaErr2) {
                            try {
                                const compactPosts = merged.slice(0, 30).map(p => ({
                                    ...p,
                                    fullContent: p.summary || ""
                                }));
                                localStorage.setItem("naverBlogPosts", JSON.stringify(compactPosts));
                            } catch (quotaErr3) {}
                        }
                    }
                }
            }
        } catch(e) {
            console.warn("PocketBase search sync skipped, using cache");
        }

        const wikiPages = await wikiPromise;

        // Try syncing latest cafes from PocketBase
        try {
            const cafeRes = await fetch(`${POCKETBASE_URL}/api/collections/cafes/records?sort=-created`);
            if (cafeRes.ok) {
                const cafeData = await cafeRes.json();
                if (cafeData.items && cafeData.items.length > 0) {
                    const pbCafes = cafeData.items.map(item => ({
                        id: item.id,
                        name: item.name,
                        icon: item.icon || "default-avatar.svg",
                        category: item.category || "자유",
                        posts: item.posts ? (typeof item.posts === 'string' ? JSON.parse(item.posts) : item.posts) : []
                    }));
                    let currentCafes = JSON.parse(localStorage.getItem("naverCafesData") || "[]");
                    pbCafes.forEach(pbc => {
                        const existingIdx = currentCafes.findIndex(c => c.id === pbc.id);
                        if (existingIdx >= 0) {
                            currentCafes[existingIdx] = { ...currentCafes[existingIdx], ...pbc };
                        } else {
                            currentCafes.push(pbc);
                        }
                    });
                    localStorage.setItem("naverCafesData", JSON.stringify(currentCafes));
                }
            }
        } catch(e) {
            console.warn("PocketBase cafes sync skipped, using cache");
        }

        // Fetch stored blog posts
        const dummyIds = ["post_1", "post_2", "post_3", "post_4", "post_fold", "post_tech"];
        let allPosts = JSON.parse(localStorage.getItem("naverBlogPosts") || "[]").filter(p => !dummyIds.includes(p.id) && p.category !== "웹마스터사이트");

        // Fetch stored cafe posts
        let allCafePosts = [];
        let allCafes = JSON.parse(localStorage.getItem("naverCafesData") || "[]");
        allCafes.forEach(cafe => {
            const rawPosts = Array.isArray(cafe.posts)
                ? cafe.posts
                : (typeof cafe.posts === "string" ? JSON.parse(cafe.posts || "[]") : []);
            rawPosts.forEach(cp => {
                allCafePosts.push({
                    id: cp.id,
                    cafeId: cafe.id,
                    cafeName: cafe.name,
                    cafeIcon: cafe.icon || "default-avatar.svg",
                    author: cp.author || "카페 회원",
                    authorAvatar: cp.authorAvatar || "default-avatar.svg",
                    time: cp.time || cp.created || "방금 전",
                    boardName: cp.boardName || "자유게시판",
                    title: cp.title || "",
                    content: cp.content || cp.summary || "",
                    summary: cp.summary || (cp.content ? cp.content.replace(/<[^>]+>/g, '').slice(0, 140) : ""),
                    thumbnail: cp.thumbnail || (cp.images && cp.images[0]) || "",
                    views: cp.views || 0,
                    likes: cp.likes || 0,
                    comments: cp.comments ? (Array.isArray(cp.comments) ? cp.comments.length : cp.comments) : (cp.commentCount || 0)
                });
            });
        });

        // ----------------------------------------------------
        // Official Popular Sites Data (대표 유명 사이트 데이터베이스)
        // ----------------------------------------------------
        const officialSites = [
            {
                name: "순천선혜학교",
                domain: "seonhye.sc.jne.kr",
                title: "순천선혜학교 - 행복한 도전! 즐거운 배움! 공립 특수학교",
                url: "http://seonhye.sc.jne.kr/",
                desc: "전라남도 순천시 조례동에 위치한 공립 특수학교. 유치부, 초등부, 중학부, 고등부, 전공과 운영 및 맞춤형 특수교육 지원.",
                icon: "fa-solid fa-school",
                iconBg: "#03c75a",
                sublinks: [
                    { title: "학교소개", url: "http://seonhye.sc.jne.kr/" },
                    { title: "교육과정", url: "http://seonhye.sc.jne.kr/" },
                    { title: "입학안내", url: "http://seonhye.sc.jne.kr/" },
                    { title: "학교소식", url: "http://seonhye.sc.jne.kr/" }
                ],
                tags: [
                    { title: "전남교육청", url: "https://www.jne.go.kr" },
                    { title: "순천교육지원청", url: "http://sced.jne.go.kr" }
                ],
                keywords: ["순천선혜", "순천선혜학교", "선혜학교", "선혜", "순천특수학교", "순천선혜초등부", "순천선혜고등부"]
            },
            {
                name: "에듀버 (EDUVER)",
                domain: "eduver.com",
                title: "EDUVER - 대한민국 대표 교육 포털",
                url: "index.html",
                desc: "배움과 지식을 연결하는 스마트 교육 포털. 웹메일, 커뮤니티 카페, 지식 블로그 및 맞춤형 학습 콘텐츠 제공.",
                icon: "fa-solid fa-graduation-cap",
                iconBg: "#03c75a",
                sublinks: [
                    { title: "웹메일", url: "mail.html" },
                    { title: "캘린더", url: "calendar.html" },
                    { title: "에듀버 카페", url: "cafe.html" },
                    { title: "블로그", url: "blog.html" },
                    { title: "회원가입", url: "signup.html" },
                    { title: "아이디 찾기", url: "find-id.html" }
                ],
                tags: [
                    { title: "캘린더 홈", url: "calendar.html" },
                    { title: "포털 홈", url: "index.html" },
                    { title: "스마트에디터", url: "blog-write.html" }
                ],
                keywords: ["에듀버", "에듀버 포털", "에듀", "eduver", "edunaver", "edunver", "에듀버 메일", "에듀버 캘린더", "캘린더", "달력", "학사일정", "에듀버 카페", "에듀버 블로그", "교육포털"]
            },
            {
                name: "네이버 지도",
                domain: "map.naver.com",
                title: "네이버 지도",
                url: "https://map.naver.com",
                desc: "길찾기, 지도검색, 거리뷰, 위성지도, 실시간교통, 지하철, 기차예매, 버스. 모든 여정의 시작, 네이버 지도",
                icon: "fa-solid fa-location-dot",
                iconBg: "#03c75a",
                sublinks: [
                    { title: "길찾기", url: "https://map.naver.com/p/directions" },
                    { title: "지도검색", url: "https://map.naver.com" },
                    { title: "거리뷰", url: "https://map.naver.com" },
                    { title: "위성지도", url: "https://map.naver.com" },
                    { title: "실시간교통", url: "https://map.naver.com" },
                    { title: "지하철", url: "https://map.naver.com/p/subway" },
                    { title: "기차예매", url: "https://map.naver.com" },
                    { title: "버스", url: "https://map.naver.com/p/bus" }
                ],
                tags: [
                    { title: "Google Play", url: "https://play.google.com/store/apps/details?id=com.nhn.android.nmap" },
                    { title: "공식 블로그", url: "https://blog.naver.com/naver_map" },
                    { title: "앱스토어", url: "https://apps.apple.com/kr/app/%EB%84%A4%EC%9D%B4%EB%B2%84-%EC%A7%80%EB%8F%84-%EB%82%B4%EB%B9%84%EA%B2%8C%EC%9D%B4%EC%85%98/id311867728" },
                    { title: "원스토어", url: "https://m.onestore.co.kr" }
                ],
                keywords: ["네이버지도", "네이버 지도", "지도", "길찾기", "지하철", "버스노선", "naver map", "map"]
            },
            {
                name: "구글",
                domain: "google.com",
                title: "Google",
                url: "https://www.google.com",
                desc: "전 세계의 정보를 검색하고 텍스트, 이미지, 동영상 등 다양한 콘텐츠를 탐색하세요.",
                icon: "fa-brands fa-google",
                iconBg: "#4285F4",
                sublinks: [
                    { title: "Google 검색", url: "https://www.google.com" },
                    { title: "Google 지도", url: "https://maps.google.com" },
                    { title: "Google 번역", url: "https://translate.google.com" },
                    { title: "Gmail", url: "https://mail.google.com" },
                    { title: "Google 드라이브", url: "https://drive.google.com" }
                ],
                tags: [
                    { title: "Google Play", url: "https://play.google.com/store/apps/details?id=com.google.android.googlequicksearchbox" },
                    { title: "Chrome 다운로드", url: "https://www.google.com/chrome" }
                ],
                keywords: ["구글", "google", "구글검색", "구글홈", "gogle", "구글포털"]
            },
            {
                name: "유튜브",
                domain: "youtube.com",
                title: "YouTube",
                url: "https://www.youtube.com",
                desc: "좋아하는 동영상과 음악을 감상하고, 직접 만든 콘텐츠를 업로드하여 친구, 가족뿐 아니라 전 세계 사람들과 공유할 수 있습니다.",
                icon: "fa-brands fa-youtube",
                iconBg: "#FF0000",
                sublinks: [
                    { title: "YouTube 홈", url: "https://www.youtube.com" },
                    { title: "Shorts", url: "https://www.youtube.com/shorts" },
                    { title: "구독 채널", url: "https://www.youtube.com/feed/subscriptions" },
                    { title: "YouTube Music", url: "https://music.youtube.com" },
                    { title: "인기 급상승", url: "https://www.youtube.com/feed/trending" }
                ],
                tags: [
                    { title: "YouTube Premium", url: "https://www.youtube.com/premium" },
                    { title: "Google Play", url: "https://play.google.com/store/apps/details?id=com.google.android.youtube" },
                    { title: "앱스토어", url: "https://apps.apple.com/kr/app/youtube/id544007664" }
                ],
                keywords: ["유튜브", "youtube", "동영상", "영상", "쇼츠", "shorts", "유투브", "유튭"]
            },
            {
                name: "네이버 웹툰",
                domain: "comic.naver.com",
                title: "네이버 웹툰",
                url: "https://comic.naver.com",
                desc: "매일매일 업데이트되는 새로운 웹툰, 요일별/장르별 다양한 인기 웹툰을 만나보세요.",
                icon: "fa-solid fa-book-open",
                iconBg: "#00d564",
                sublinks: [
                    { title: "요일별 웹툰", url: "https://comic.naver.com/webtoon" },
                    { title: "베스트도전", url: "https://comic.naver.com/genre/bestChallenge" },
                    { title: "웹소설", url: "https://novel.naver.com" },
                    { title: "시리즈", url: "https://series.naver.com" }
                ],
                tags: [
                    { title: "Google Play", url: "https://play.google.com/store/apps/details?id=com.nhn.android.webtoon" },
                    { title: "앱스토어", url: "https://apps.apple.com/kr/app/%EB%84%A4%EC%9D%B4%EB%B2%84-%EC%9B%B9%ED%88%B0-naver-webtoon/id420048308" }
                ],
                keywords: ["네이버 웹툰", "네이버웹툰", "웹툰", "만화", "comic", "webtoon", "naver webtoon"]
            },
            {
                name: "네이버 쇼핑",
                domain: "shopping.naver.com",
                title: "네이버 쇼핑",
                url: "https://shopping.naver.com",
                desc: "네이버페이 포인트 혜택과 트렌디한 패션, 라이프스타일 상품 가격비교 쇼핑.",
                icon: "fa-solid fa-bag-shopping",
                iconBg: "#03c75a",
                sublinks: [
                    { title: "쇼핑MY", url: "https://shopping.naver.com/my" },
                    { title: "네이버페이", url: "https://pay.naver.com" },
                    { title: "장보기", url: "https://shopping.naver.com/market" },
                    { title: "선물샵", url: "https://shopping.naver.com/gift" },
                    { title: "원쁠딜", url: "https://shopping.naver.com/one-plus-deal" }
                ],
                tags: [
                    { title: "네이버플러스 멤버십", url: "https://nid.naver.com/membership" },
                    { title: "네이버페이 혜택", url: "https://pay.naver.com" }
                ],
                keywords: ["네이버 쇼핑", "네이버쇼핑", "쇼핑", "shopping", "네이버페이", "가격비교", "스마트스토어"]
            },
            {
                name: "네이버 카페",
                domain: "cafe.naver.com",
                title: "네이버 카페",
                url: "https://cafe.naver.com",
                desc: "취향과 관심사로 모이는 우리들의 이야기 공간, 네이버 대표 커뮤니티.",
                icon: "fa-solid fa-mug-hot",
                iconBg: "#03c75a",
                sublinks: [
                    { title: "카페 홈", url: "https://cafe.naver.com" },
                    { title: "내 카페목록", url: "https://cafe.naver.com" },
                    { title: "주제별 카페", url: "https://cafe.naver.com" },
                    { title: "이웃 카페", url: "https://cafe.naver.com" }
                ],
                tags: [
                    { title: "네이버 카페 앱", url: "https://play.google.com/store/apps/details?id=com.nhn.android.navercafe" }
                ],
                keywords: ["네이버 카페", "네이버카페", "카페", "cafe", "naver cafe", "동호회"]
            },
            {
                name: "네이버 뉴스",
                domain: "news.naver.com",
                title: "네이버 뉴스",
                url: "https://news.naver.com",
                desc: "정치, 경제, 사회, IT 등 분야별 주요 속보와 심층 뉴스 기사를 신속하게 확인하세요.",
                icon: "fa-regular fa-newspaper",
                iconBg: "#1f3bb3",
                sublinks: [
                    { title: "언론사별 뉴스", url: "https://news.naver.com/main/officeList.naver" },
                    { title: "정치", url: "https://news.naver.com/section/100" },
                    { title: "경제", url: "https://news.naver.com/section/101" },
                    { title: "사회", url: "https://news.naver.com/section/102" },
                    { title: "IT/과학", url: "https://news.naver.com/section/105" }
                ],
                tags: [
                    { title: "랭킹뉴스", url: "https://news.naver.com/main/ranking/popularDay.naver" },
                    { title: "팩트체크", url: "https://news.naver.com/main/factcheck/main.naver" }
                ],
                keywords: ["네이버 뉴스", "네이버뉴스", "뉴스", "속보", "news", "기사", "언론사"]
            },
            {
                name: "쿠팡",
                domain: "coupang.com",
                title: "쿠팡 (Coupang)",
                url: "https://www.coupang.com",
                desc: "로켓배송, 로켓와우, 로켓프레시, 골드박스 등 빠르고 편리한 전국 특급 배송 쇼핑몰.",
                icon: "fa-solid fa-truck-fast",
                iconBg: "#802222",
                sublinks: [
                    { title: "로켓배송", url: "https://www.coupang.com" },
                    { title: "로켓프레시", url: "https://www.coupang.com" },
                    { title: "쿠팡플레이", url: "https://www.coupangplay.com" },
                    { title: "쿠팡이츠", url: "https://www.coupangeats.com" }
                ],
                tags: [
                    { title: "와우멤버십", url: "https://www.coupang.com" },
                    { title: "Google Play", url: "https://play.google.com/store/apps/details?id=com.coupang.mobile" }
                ],
                keywords: ["쿠팡", "coupang", "로켓배송", "쿠팡플레이", "쿠팡이츠", "쿠팡 쇼핑"]
            },
            {
                name: "다음 (Daum)",
                domain: "daum.net",
                title: "다음 (Daum)",
                url: "https://www.daum.net",
                desc: "뉴스, 카페, 메일, 지도, 웹툰, 연예, 스포츠 등 대한민국 대표 포털 서비스.",
                icon: "fa-solid fa-globe",
                iconBg: "#4a90e2",
                sublinks: [
                    { title: "다음 뉴스", url: "https://news.daum.net" },
                    { title: "다음 메일", url: "https://mail.daum.net" },
                    { title: "다음 카페", url: "https://top.cafe.daum.net" },
                    { title: "카카오맵", url: "https://map.kakao.com" }
                ],
                tags: [
                    { title: "카카오", url: "https://www.kakaocorp.com" }
                ],
                keywords: ["다음", "daum", "카카오", "kakao", "다음포털", "다음뉴스"]
            },
            {
                name: "ChatGPT (OpenAI)",
                domain: "chatgpt.com",
                title: "ChatGPT",
                url: "https://chatgpt.com",
                desc: "OpenAI에서 개발한 대화형 인공지능 서비스. 텍스트 작성, 코딩, 분석, 창작을 경험하세요.",
                icon: "fa-solid fa-brain",
                iconBg: "#10a37f",
                sublinks: [
                    { title: "OpenAI 홈", url: "https://openai.com" },
                    { title: "ChatGPT 시작하기", url: "https://chatgpt.com" },
                    { title: "GPT Plus", url: "https://chatgpt.com" }
                ],
                tags: [
                    { title: "앱스토어", url: "https://apps.apple.com/app/chatgpt/id6448311069" },
                    { title: "Google Play", url: "https://play.google.com/store/apps/details?id=com.openai.chatgpt" }
                ],
                keywords: ["챗지피티", "chatgpt", "gpt", "openai", "오픈ai", "지피티", "인공지능", "ai챗봇"]
            },
            {
                name: "인스타그램",
                domain: "instagram.com",
                title: "Instagram",
                url: "https://www.instagram.com",
                desc: "사진, 릴스, 스토리로 일상을 공유하고 전 세계 크리에이터 및 친구들과 소통하세요.",
                icon: "fa-brands fa-instagram",
                iconBg: "#E1306C",
                sublinks: [
                    { title: "홈 피드", url: "https://www.instagram.com" },
                    { title: "릴스 (Reels)", url: "https://www.instagram.com/reels" },
                    { title: "탐색 (Explore)", url: "https://www.instagram.com/explore" }
                ],
                tags: [
                    { title: "Google Play", url: "https://play.google.com/store/apps/details?id=com.instagram.android" },
                    { title: "앱스토어", url: "https://apps.apple.com/kr/app/instagram/id389801252" }
                ],
                keywords: ["인스타그램", "instagram", "인스타", "insta", "릴스", "reels", "스토리"]
            },
            {
                name: "GitHub",
                domain: "github.com",
                title: "GitHub: Let’s build from here",
                url: "https://github.com",
                desc: "전 세계 1억 명 이상의 개발자가 소프트웨어를 개발, 버전 관리, 협업하는 최고의 플랫폼.",
                icon: "fa-brands fa-github",
                iconBg: "#24292e",
                sublinks: [
                    { title: "Explore", url: "https://github.com/explore" },
                    { title: "GitHub Copilot", url: "https://github.com/features/copilot" },
                    { title: "Trending Repos", url: "https://github.com/trending" }
                ],
                tags: [
                    { title: "GitHub CLI", url: "https://cli.github.com" },
                    { title: "GitHub Docs", url: "https://docs.github.com" }
                ],
                keywords: ["깃허브", "github", "깃헙", "git", "코딩", "개발"]
            },
            {
                name: "넷플릭스",
                domain: "netflix.com",
                title: "Netflix (넷플릭스)",
                url: "https://www.netflix.com",
                desc: "영화, TV 프로그램, 오리지널 시리즈, 다큐멘터리를 무제한으로 스트리밍 감상하세요.",
                icon: "fa-solid fa-film",
                iconBg: "#E50914",
                sublinks: [
                    { title: "넷플릭스 홈", url: "https://www.netflix.com" },
                    { title: "인기 콘텐츠", url: "https://www.netflix.com/browse/genre/83" },
                    { title: "요금제 안내", url: "https://help.netflix.com/ko/node/24926" }
                ],
                tags: [
                    { title: "Google Play", url: "https://play.google.com/store/apps/details?id=com.netflix.mediaclient" },
                    { title: "앱스토어", url: "https://apps.apple.com/kr/app/netflix/id363590051" }
                ],
                keywords: ["넷플릭스", "netflix", "넷플", "영화", "ott", "드라마"]
            }
        ];

        const q = activeQuery.toLowerCase().trim();
        const rawCleanQuery = q.replace(/\s+/g, "");

        // 1. Match Official Site & Webmaster Registered Sites (공식 사이트 및 웹마스터 등록 사이트 매칭)
        let matchedOfficialSites = [];
        if (currentSearchTab === "all") {
            const allSites = [...getEduverCustomSites(), ...officialSites];
            matchedOfficialSites = allSites.filter(site => {
                const siteNameClean = (site.name || "").toLowerCase().replace(/\s+/g, "");
                const domainClean = (site.domain || "").toLowerCase().replace(/\s+/g, "");
                if (siteNameClean.includes(rawCleanQuery) || rawCleanQuery.includes(siteNameClean) || domainClean.includes(rawCleanQuery)) {
                    return true;
                }
                return (site.keywords || []).some(kw => {
                    const kwClean = kw.toLowerCase().replace(/\s+/g, "");
                    return kwClean.includes(rawCleanQuery) || rawCleanQuery.includes(kwClean);
                });
            });
        }
        const matchedOfficialSite = matchedOfficialSites[0] || null;

        // 2. Match Blog Posts (에듀버 블로그 글 매칭)
        let matchedPosts = allPosts.filter(p => {
            const titleMatch = p.title && p.title.toLowerCase().includes(q);
            const summaryMatch = p.summary && p.summary.toLowerCase().includes(q);
            const contentMatch = p.fullContent && p.fullContent.toLowerCase().includes(q);
            const authorMatch = p.author && p.author.toLowerCase().includes(q);
            const catMatch = p.category && p.category.toLowerCase().includes(q);
            return titleMatch || summaryMatch || contentMatch || authorMatch || catMatch;
        });

        // 3. Match Cafe Posts (에듀버 카페 게시글 매칭)
        let matchedCafePosts = allCafePosts.filter(cp => {
            const titleMatch = cp.title && cp.title.toLowerCase().includes(q);
            const contentMatch = cp.content && cp.content.toLowerCase().includes(q);
            const summaryMatch = cp.summary && cp.summary.toLowerCase().includes(q);
            const authorMatch = cp.author && cp.author.toLowerCase().includes(q);
            const cafeMatch = cp.cafeName && cp.cafeName.toLowerCase().includes(q);
            const boardMatch = cp.boardName && cp.boardName.toLowerCase().includes(q);
            return titleMatch || contentMatch || summaryMatch || authorMatch || cafeMatch || boardMatch;
        });

        // 4. Match News Articles (에듀버 뉴스 기사 매칭 - 사용자 요청: 오직 기사 제목만 부분 일치 여부 확인)
        const defaultSeedNews = [
            {
                id: "news_1",
                title: "특수교육 대상 학생 맞춤형 'AI 디지털 교과서' 현장 실증 연구 착수",
                subtitle: "개별화 학습 속도에 맞춘 시각·청각 지원 인터페이스로 수업 몰입도 대폭 향상",
                category: "특수교육",
                author: "조이 기자",
                press: "에듀버 교육보도국",
                date: "2026. 9. 10.",
                summary: "교육부와 전국 특수교육 연구진이 협력하여 특수학급 학생들을 위한 차세대 AI 디지털 교과서 시범 사업에 본격 돌입했습니다. 학생 개개인의 인지 수준과 의사소통 특성에 맞춘 동적 피드백이 제공됩니다.",
                thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80"
            },
            {
                id: "news_2",
                title: "보완대체의사소통(AAC) 그림 상징 표준화 협의회 발족... \"교실과 일상의 단절 줄인다\"",
                subtitle: "학교-가정-지역사회 어디서나 통하는 통합 상징 체계 마련 목표",
                category: "에듀테크",
                author: "정보쌤 기자",
                press: "에듀버 특수교육센터",
                date: "2026. 9. 9.",
                summary: "학교마다 제각각이던 그림 상징과 의사소통 도구의 혼선을 줄이기 위한 전국 표준 상징 체계 구축 협의회가 공식 출범했습니다.",
                thumbnail: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80"
            },
            {
                id: "news_3",
                title: "특수교사 힐링 연수 및 교과 나눔의 날 성황리 종료",
                subtitle: "지친 마음 보듬고 서로의 우수 수업 지도안 공유하는 연대의 장",
                category: "사람과 이야기",
                author: "현장취재팀",
                press: "에듀버 뉴스",
                date: "2026. 9. 8.",
                summary: "전국 각지에서 모인 특수교사들이 함께 모여 현장의 고충을 나누고, 직접 개발한 개별화 교구와 수업 활동지를 공유하는 따뜻한 연수의 밤이 열렸습니다.",
                thumbnail: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80"
            },
            {
                id: "news_4",
                title: "2026 하반기 통합교육 지원단 확대 운영... 일반학급 협력 강사 추가 배치",
                subtitle: "일반교사와 특수교사의 원활한 협력 수업 지원 체계 대폭 강화",
                category: "교육정책",
                author: "조이 기자",
                press: "에듀버 교육보도국",
                date: "2026. 9. 7.",
                summary: "일반학급에 배치된 특수교육 대상 학생의 학교생활 적응을 돕고 통합교육 내실화를 지원하기 위해 협력 강사가 추가 배치됩니다.",
                thumbnail: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80"
            }
        ];
        const storedNews = JSON.parse(localStorage.getItem("naverNewsArticles") || "[]");
        const allNewsList = (storedNews && storedNews.length > 0) ? storedNews : defaultSeedNews;

        // 사용자 요청: 제목만 부분 일치 여부 확인
        const rawMatchedNews = allNewsList.filter(art => {
            if (!art.title) return false;
            const t = art.title.toLowerCase();
            const cleanT = t.replace(/\s+/g, "");
            return t.includes(q) || cleanT.includes(rawCleanQuery);
        });

        // 기사 중복 제거 (동일 제목 기사는 ID가 다르더라도 반드시 1건만 노출)
        const newsTitleSet = new Set();
        const matchedNews = [];
        rawMatchedNews.forEach(art => {
            if (!art || !art.title) return;
            const normalizedTitle = art.title.replace(/\s+/g, "").toLowerCase();
            if (!newsTitleSet.has(normalizedTitle)) {
                newsTitleSet.add(normalizedTitle);
                matchedNews.push(art);
            }
        });

        // Tab filtering simulation
        if (currentSearchTab === "image") {
            matchedPosts = matchedPosts.filter(p => p.thumbnail);
            matchedCafePosts = matchedCafePosts.filter(cp => cp.thumbnail);
        }

        // ----------------------------------------------------
        // Dynamic Related Searches Generator (연관 검색어)
        // ----------------------------------------------------
        const relatedTagsContainer = document.getElementById("search-related-tags");
        if (relatedTagsContainer) {
            const dynamicTags = [];
            // Add titles from Wikipedia results
            if (wikiPages && wikiPages.length > 0) {
                wikiPages.forEach(p => {
                    if (p.title && p.title.toLowerCase() !== q && dynamicTags.length < 3) {
                        dynamicTags.push(p.title);
                    }
                });
            }
            // Add contextual search extensions
            const extensions = [
                `${activeQuery} 정보`,
                `${activeQuery} 위치`,
                `${activeQuery} 특징`,
                `${activeQuery} 후기`,
                `${activeQuery} 홈페이지`,
                `${activeQuery} 뉴스`
            ];
            extensions.forEach(cand => {
                if (!dynamicTags.includes(cand) && dynamicTags.length < 6) {
                    dynamicTags.push(cand);
                }
            });

            relatedTagsContainer.innerHTML = "";
            dynamicTags.forEach(tagText => {
                const span = document.createElement("span");
                span.className = "rel-tag";
                span.textContent = tagText;
                span.addEventListener("click", () => {
                    if (searchInput) searchInput.value = tagText;
                    performMainSearch(tagText);
                });
                relatedTagsContainer.appendChild(span);
            });
        }

        // Helper: Official Site Card
        const createOfficialSiteCard = (site) => {
            const siteCard = document.createElement("div");
            siteCard.className = "official-site-card";
            
            const sublinksHtml = (site.sublinks || []).map((sub, idx) => `
                ${idx > 0 ? '<span class="sublink-dot">·</span>' : ''}
                <a href="${sub.url}" target="_blank" rel="noopener noreferrer">${sub.title}</a>
            `).join("");

            const tagsHtml = (site.tags || []).map(tag => `
                <a href="${tag.url}" class="official-site-pill" target="_blank" rel="noopener noreferrer">
                    <span>${tag.title}</span>
                </a>
            `).join("");

            siteCard.innerHTML = `
                <div class="official-site-header">
                    <a href="${site.url}" target="_blank" rel="noopener noreferrer" class="official-site-source">
                        <div class="official-site-favicon" style="background-color: ${site.iconBg || '#03c75a'};">
                            <i class="${site.icon || 'fa-solid fa-globe'}"></i>
                        </div>
                        <span class="official-site-name">${site.name}</span>
                        <span class="official-site-domain">· ${site.domain || ''}</span>
                    </a>
                    <button class="official-site-more-btn" title="더보기">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                </div>
                <h3 class="official-site-title">
                    <a href="${site.url}" target="_blank" rel="noopener noreferrer">${site.title || site.name}</a>
                </h3>
                ${sublinksHtml ? `<div class="official-site-sublinks">${sublinksHtml}</div>` : ''}
                <p class="official-site-desc">${site.desc || ''}</p>
                ${tagsHtml ? `<div class="official-site-tags-row">${tagsHtml}</div>` : ''}
            `;
            return siteCard;
        };

        // Helper: External Portal Quick Search Card
        const createExternalSearchCard = () => {
            const card = document.createElement("div");
            card.className = "external-search-card";
            const encoded = encodeURIComponent(activeQuery);
            card.innerHTML = `
                <h4><i class="fa-solid fa-arrow-up-right-from-square"></i> '${activeQuery}' 다른 검색엔진에서 더보기</h4>
                <div class="external-portal-buttons">
                    <a href="https://search.naver.com/search.naver?query=${encoded}" target="_blank" rel="noopener noreferrer" class="external-portal-btn">
                        <span class="portal-icon-naver">N</span> 네이버 검색
                    </a>
                    <a href="https://www.google.com/search?q=${encoded}" target="_blank" rel="noopener noreferrer" class="external-portal-btn">
                        <i class="fa-brands fa-google portal-icon-google"></i> 구글 검색
                    </a>
                    <a href="https://www.youtube.com/results?search_query=${encoded}" target="_blank" rel="noopener noreferrer" class="external-portal-btn">
                        <i class="fa-brands fa-youtube portal-icon-youtube"></i> 유튜브 영상
                    </a>
                    <a href="https://search.daum.net/search?q=${encoded}" target="_blank" rel="noopener noreferrer" class="external-portal-btn">
                        <span class="portal-icon-daum">Daum</span> 다음 검색
                    </a>
                </div>
            `;
            return card;
        };

        // Helper: Wikipedia Knowledge Card
        const createWikiCard = (pages) => {
            if (!pages || pages.length === 0) return null;
            const topPage = pages[0];
            const card = document.createElement("div");
            card.className = "wiki-knowledge-card";

            const highlightedTitle = highlightKeyword(topPage.title, activeQuery);
            const rawExtract = topPage.extract || "위키백과 오픈 백과사전 표제어 문서입니다.";
            const highlightedExtract = highlightKeyword(rawExtract, activeQuery);
            const wikiUrl = topPage.fullurl || `https://ko.wikipedia.org/wiki/${encodeURIComponent(topPage.title)}`;

            // Sub items for pages 1, 2, 3
            let subItemsHtml = "";
            if (pages.length > 1) {
                const subPages = pages.slice(1, 4);
                subItemsHtml = `
                    <div class="wiki-sub-items">
                        ${subPages.map(sub => {
                            const subUrl = sub.fullurl || `https://ko.wikipedia.org/wiki/${encodeURIComponent(sub.title)}`;
                            const subDesc = sub.extract ? sub.extract.replace(/\n/g, ' ') : '';
                            return `
                                <div class="wiki-sub-item">
                                    <span class="wiki-sub-label">관련 백과</span>
                                    <a href="${subUrl}" target="_blank" rel="noopener noreferrer" class="wiki-sub-link">${sub.title}</a>
                                    <span class="wiki-sub-desc">${subDesc}</span>
                                </div>
                            `;
                        }).join("")}
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="wiki-header-row">
                    <div class="wiki-badge-group">
                        <span class="wiki-badge"><i class="fa-solid fa-book-bookmark"></i> 지식백과</span>
                        <span class="wiki-source-sub">위키백과 (Wikipedia)</span>
                    </div>
                    <span style="font-size: 12px; color: #888;">실시간 백과 사전</span>
                </div>
                <div class="wiki-main-content">
                    <div class="wiki-text-col">
                        <h3 class="wiki-title">
                            <a href="${wikiUrl}" target="_blank" rel="noopener noreferrer">${highlightedTitle}</a>
                        </h3>
                        <p class="wiki-extract">${highlightedExtract}</p>
                    </div>
                    ${topPage.thumbnail ? `
                        <div class="wiki-thumb-col">
                            <a href="${wikiUrl}" target="_blank" rel="noopener noreferrer">
                                <img src="${topPage.thumbnail.source}" alt="${topPage.title}" class="wiki-thumb-img">
                            </a>
                        </div>
                    ` : ''}
                </div>
                ${subItemsHtml}
                <div class="wiki-footer">
                    <span>출처: 한국어 위키백과 (CC BY-SA 4.0)</span>
                    <a href="${wikiUrl}" target="_blank" rel="noopener noreferrer">
                        위키백과 전문 보기 <i class="fa-solid fa-chevron-right" style="font-size: 10px;"></i>
                    </a>
                </div>
            `;
            return card;
        };

        // Helper: Naver-Style News Section Card (네이버 뉴스 섹션 카드)
        const createNewsSectionCard = (newsList, query, isNewsTab = false) => {
            const card = document.createElement("div");
            card.className = "search-news-section-card";
            card.style.cssText = "background: #ffffff !important; border-radius: 10px !important; border: 1px solid #e3e7ed !important; padding: 22px 24px !important; margin-bottom: 20px !important; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03) !important;";

            // 이중 방어: 제목 기준 중복 기사 확실히 제거
            const seenTitles = new Set();
            const uniqueNews = [];
            (newsList || []).forEach(item => {
                if (!item || !item.title) return;
                const norm = item.title.replace(/\s+/g, "").toLowerCase();
                if (!seenTitles.has(norm)) {
                    seenTitles.add(norm);
                    uniqueNews.push(item);
                }
            });

            const displayList = isNewsTab ? uniqueNews : uniqueNews.slice(0, 3);
            const itemsHtml = displayList.map((art, idx) => {
                const highlightedTitle = highlightKeyword(art.title || "", query);
                const summaryText = art.summary || (art.content ? art.content.replace(/<[^>]+>/g, '').slice(0, 140) : "");
                const highlightedSnippet = highlightKeyword(summaryText, query);
                const pressName = art.press || "에듀버 교육보도국";
                const dateText = art.date || "최근";
                const isLast = idx === displayList.length - 1;

                return `
                    <div class="search-news-item" style="padding: 16px 0 !important; ${isLast ? 'border-bottom: none !important; padding-bottom: 4px !important;' : 'border-bottom: 1px solid #f1f3f6 !important;'}">
                        <div class="search-news-meta" style="display: flex !important; align-items: center !important; justify-content: space-between !important; margin-bottom: 8px !important;">
                            <div style="display: flex !important; align-items: center !important; gap: 6px !important; font-size: 12px !important; color: #767676 !important;">
                                <span class="news-press-icon" style="width: 18px !important; height: 18px !important; border-radius: 50% !important; background: #03c75a !important; color: #fff !important; font-size: 10px !important; font-weight: 800 !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important;">N</span>
                                <span class="news-press-name" style="font-weight: 700 !important; color: #222 !important;">${pressName}</span>
                                <span class="news-pick-badge" style="background: #f1f3f5 !important; color: #555 !important; font-size: 10px !important; font-weight: 700 !important; padding: 1px 5px !important; border-radius: 3px !important; letter-spacing: 0.2px !important;">PiCK</span>
                                <span class="news-dot" style="color: #bbb !important;">•</span>
                                <span class="news-date" style="color: #767676 !important;">${dateText}</span>
                                <span class="news-dot" style="color: #bbb !important;">•</span>
                                <span class="news-portal" style="color: #767676 !important;">에듀버뉴스</span>
                            </div>
                            <button type="button" style="background: none !important; border: none !important; color: #aaa !important; cursor: pointer !important; padding: 2px 4px !important; font-size: 13px !important;" title="더보기">
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                        </div>
                        <div class="search-news-content-row" style="display: flex !important; justify-content: space-between !important; align-items: flex-start !important; gap: 16px !important;">
                            <div class="search-news-text" style="flex: 1 !important; min-width: 0 !important;">
                                <h4 class="search-news-headline" style="font-size: 16px !important; font-weight: 700 !important; line-height: 1.4 !important; margin: 0 0 6px 0 !important;">
                                    <a href="news.html?id=${encodeURIComponent(art.id)}" style="color: #003680 !important; text-decoration: none !important; display: -webkit-box !important; -webkit-line-clamp: 2 !important; -webkit-box-orient: vertical !important; overflow: hidden !important;">${highlightedTitle}</a>
                                </h4>
                                <p class="search-news-snippet" style="font-size: 13.5px !important; color: #444 !important; line-height: 1.55 !important; display: -webkit-box !important; -webkit-line-clamp: 2 !important; -webkit-box-orient: vertical !important; overflow: hidden !important; margin: 0 !important;">${highlightedSnippet}</p>
                            </div>
                            ${art.thumbnail ? `
                                <a href="news.html?id=${encodeURIComponent(art.id)}" class="search-news-thumb-wrap" style="width: 96px !important; height: 96px !important; min-width: 96px !important; max-width: 96px !important; aspect-ratio: 1/1 !important; border-radius: 8px !important; overflow: hidden !important; flex-shrink: 0 !important; border: 1px solid #eaedf0 !important; display: block !important; background: #f8f9fa !important;">
                                    <img src="${art.thumbnail}" alt="${art.title}" class="search-news-thumb-img" style="width: 96px !important; height: 96px !important; min-width: 96px !important; max-width: 96px !important; object-fit: cover !important; display: block !important;">
                                </a>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join("");

            const footerHtml = (!isNewsTab && newsList.length > 0) ? `
                <div class="search-news-footer" style="padding-top: 14px !important; border-top: 1px solid #f1f3f6 !important; margin-top: 12px !important; display: flex !important; justify-content: flex-end !important;">
                    <button class="btn-news-all-more" onclick="window.switchToNewsSearchTab()" style="background: none !important; border: none !important; color: #004b99 !important; font-size: 13px !important; font-weight: 600 !important; cursor: pointer !important; display: inline-flex !important; align-items: center !important; gap: 4px !important; padding: 4px 6px !important;">
                        관련뉴스 전체보기 (${newsList.length}건) <i class="fa-solid fa-chevron-right" style="font-size: 10px !important;"></i>
                    </button>
                </div>
            ` : '';

            card.innerHTML = `
                <div class="search-news-section-header" style="display: flex !important; justify-content: space-between !important; align-items: center !important; padding-bottom: 14px !important; border-bottom: 1px solid #f1f3f6 !important; margin-bottom: 16px !important;">
                    <h3 class="search-news-main-title" style="font-size: 19px !important; font-weight: 800 !important; color: #111111 !important; letter-spacing: -0.3px !important; margin: 0 !important;">뉴스</h3>
                    <div class="search-news-sort-group" style="display: flex !important; align-items: center !important; gap: 10px !important; font-size: 12.5px !important;">
                        <span class="sort-active" style="color: #111111 !important; font-weight: 700 !important; cursor: pointer !important;">• 관련도순</span>
                        <span class="sort-inactive" style="color: #888888 !important; cursor: pointer !important;">• 최신순</span>
                    </div>
                </div>
                ${itemsHtml}
                ${footerHtml}
            `;
            return card;
        };

        // Window helper for tab switching
        window.switchToNewsSearchTab = function() {
            const newsTabBtn = document.querySelector(`.search-tab-btn[data-tab="news"]`);
            if (newsTabBtn) {
                newsTabBtn.click();
            } else {
                currentSearchTab = "news";
                renderSearchResultsFeed();
            }
        };

        const hasWiki = wikiPages && wikiPages.length > 0;
        const totalResultsCount = matchedOfficialSites.length + matchedNews.length + matchedPosts.length + matchedCafePosts.length + (hasWiki ? wikiPages.length : 0);

        if (searchTotalCount) {
            searchTotalCount.textContent = `총 ${totalResultsCount}건`;
        }

        // Empty state check
        if (matchedOfficialSites.length === 0 && matchedNews.length === 0 && !hasWiki && matchedPosts.length === 0 && matchedCafePosts.length === 0) {
            searchItemsFeed.innerHTML = `
                <div style="background: #fff; border-radius: 8px; border: 1px solid #e3e7ed; padding: 50px 20px; text-align: center; color: #888;">
                    <i class="fa-solid fa-circle-exclamation" style="font-size: 38px; color: #ced4da; margin-bottom: 14px;"></i>
                    <h4 style="font-size: 16px; color: #333; margin-bottom: 6px;">'${activeQuery}'에 대한 내부 검색 결과가 없습니다.</h4>
                    <p style="font-size: 13px; margin-bottom: 16px;">단어의 철자가 정확한지 확인해 보거나, 아래 포털 바로가기를 통해 검색해 보세요.</p>
                </div>
            `;
            searchItemsFeed.appendChild(createExternalSearchCard());
            return;
        }

        searchItemsFeed.innerHTML = "";

        // ----------------------------------------------------
        // Render TAB: ALL (통합검색 - 사이트 자료 우선, 위키백과 최후)
        // ----------------------------------------------------
        if (currentSearchTab === "all") {
            // [1순위] 공식 사이트 및 웹마스터 등록 사이트 카드 표시
            if (matchedOfficialSites && matchedOfficialSites.length > 0) {
                matchedOfficialSites.slice(0, 3).forEach(site => {
                    searchItemsFeed.appendChild(createOfficialSiteCard(site));
                });
            }

            // [1.5순위] 에듀버 뉴스 검색 결과 (제목 부분 일치 시 스크린샷과 동일한 네이버 뉴스 섹션 카드 표시)
            if (matchedNews && matchedNews.length > 0) {
                searchItemsFeed.appendChild(createNewsSectionCard(matchedNews, activeQuery, false));
            }

            // [2순위] 에듀버 블로그 검색 결과 먼저 표시!
            matchedPosts.forEach(post => {
                const card = renderPostSearchCard(post, activeQuery);
                searchItemsFeed.appendChild(card);
            });

            // [3순위] 에듀버 카페 게시글 검색 결과 먼저 표시!
            matchedCafePosts.forEach(cp => {
                const card = renderCafeSearchCard(cp, activeQuery);
                searchItemsFeed.appendChild(card);
            });

            // [4순위] 위키백과 지식백과 (가장 나중에 노출!)
            if (hasWiki) {
                const wikiCard = createWikiCard(wikiPages);
                if (wikiCard) searchItemsFeed.appendChild(wikiCard);
            }

            // [5순위] 외부 포털 검색 바로가기
            searchItemsFeed.appendChild(createExternalSearchCard());
        } 
        // ----------------------------------------------------
        // Render TAB: BLOG (블로그 탭)
        // ----------------------------------------------------
        else if (currentSearchTab === "blog") {
            if (matchedPosts.length > 0) {
                matchedPosts.forEach(post => {
                    const card = renderPostSearchCard(post, activeQuery);
                    searchItemsFeed.appendChild(card);
                });
            } else if (hasWiki) {
                // If no user blog posts, show wiki articles as knowledge posts
                wikiPages.forEach(p => {
                    const wikiCard = createWikiCard([p]);
                    if (wikiCard) searchItemsFeed.appendChild(wikiCard);
                });
            } else {
                searchItemsFeed.innerHTML = `
                    <div style="background: #fff; border-radius: 8px; border: 1px solid #e3e7ed; padding: 40px 20px; text-align: center; color: #888;">
                        <p>'${activeQuery}'에 대한 블로그 글이 없습니다.</p>
                    </div>
                `;
            }
            searchItemsFeed.appendChild(createExternalSearchCard());
        }
        // ----------------------------------------------------
        // Render TAB: CAFE (카페 탭)
        // ----------------------------------------------------
        else if (currentSearchTab === "cafe") {
            if (matchedCafePosts.length > 0) {
                matchedCafePosts.forEach(cp => {
                    const card = renderCafeSearchCard(cp, activeQuery);
                    searchItemsFeed.appendChild(card);
                });
            } else {
                searchItemsFeed.innerHTML = `
                    <div style="background: #fff; border-radius: 8px; border: 1px solid #e3e7ed; padding: 40px 20px; text-align: center; color: #888;">
                        <p>'${activeQuery}' 관련 카페 글이 없습니다.</p>
                    </div>
                `;
            }
            searchItemsFeed.appendChild(createExternalSearchCard());
        }
        // ----------------------------------------------------
        // Render TAB: IMAGE (이미지 탭)
        // ----------------------------------------------------
        else if (currentSearchTab === "image") {
            const imageItems = [];
            // 1. Blog Images First
            matchedPosts.forEach(p => {
                if (p.thumbnail) imageItems.push({ title: p.title, img: p.thumbnail, url: `my-blog.html?post=${p.id}`, source: `블로그 · ${p.author}` });
            });
            // 2. Cafe Images Next
            matchedCafePosts.forEach(cp => {
                if (cp.thumbnail) imageItems.push({ title: cp.title, img: cp.thumbnail, url: `cafe-detail.html?id=${cp.cafeId}&postId=${cp.id}`, source: `카페 · ${cp.cafeName}` });
            });
            // 3. Wikipedia Images Last
            if (hasWiki) {
                wikiPages.forEach(p => {
                    if (p.thumbnail) {
                        imageItems.push({
                            title: p.title,
                            img: p.thumbnail.source,
                            url: p.fullurl || `https://ko.wikipedia.org/wiki/${encodeURIComponent(p.title)}`,
                            source: "지식백과 · 위키백과"
                        });
                    }
                });
            }

            if (imageItems.length > 0) {
                const imgGrid = document.createElement("div");
                imgGrid.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; margin-bottom: 20px;";
                imageItems.forEach(item => {
                    const imgCard = document.createElement("a");
                    imgCard.href = item.url;
                    imgCard.target = "_blank";
                    imgCard.style.cssText = "display: block; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e8eb; text-decoration: none; color: #333; transition: transform 0.15s ease, box-shadow 0.15s ease;";
                    imgCard.innerHTML = `
                        <div style="width: 100%; height: 130px; background: #f1f3f5; overflow: hidden;">
                            <img src="${item.img}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div style="padding: 8px 10px;">
                            <div style="font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</div>
                            <div style="font-size: 11px; color: #888; margin-top: 2px;">${item.source}</div>
                        </div>
                    `;
                    imgGrid.appendChild(imgCard);
                });
                searchItemsFeed.appendChild(imgGrid);
            } else {
                searchItemsFeed.innerHTML = `
                    <div style="background: #fff; border-radius: 8px; border: 1px solid #e3e7ed; padding: 40px 20px; text-align: center; color: #888;">
                        <p>'${activeQuery}'에 대한 이미지가 없습니다.</p>
                    </div>
                `;
            }
            searchItemsFeed.appendChild(createExternalSearchCard());
        }
        // ----------------------------------------------------
        // Render TAB: NEWS (뉴스 탭)
        // ----------------------------------------------------
        else if (currentSearchTab === "news") {
            if (matchedNews.length > 0) {
                searchItemsFeed.appendChild(createNewsSectionCard(matchedNews, activeQuery, true));
            } else {
                searchItemsFeed.innerHTML = `
                    <div style="background: #fff; border-radius: 8px; border: 1px solid #e3e7ed; padding: 40px 20px; text-align: center; color: #888;">
                        <p>'${activeQuery}'에 대한 뉴스 기사가 없습니다.</p>
                        <a href="news.html" style="color: #03c75a; font-weight: 700; text-decoration: none; font-size: 13px; margin-top: 8px; display: inline-block;">에듀버 뉴스 홈 바로가기 →</a>
                    </div>
                `;
            }
            searchItemsFeed.appendChild(createExternalSearchCard());
        }
        else {
            if (matchedPosts.length > 0) {
                matchedPosts.forEach(post => {
                    const card = renderPostSearchCard(post, activeQuery);
                    searchItemsFeed.appendChild(card);
                });
            } else if (hasWiki) {
                const wikiCard = createWikiCard(wikiPages);
                if (wikiCard) searchItemsFeed.appendChild(wikiCard);
            } else {
                searchItemsFeed.innerHTML = `
                    <div style="background: #fff; border-radius: 8px; border: 1px solid #e3e7ed; padding: 40px 20px; text-align: center; color: #888;">
                        <p>'${activeQuery}' 관련 게시물이 없습니다.</p>
                    </div>
                `;
            }
            searchItemsFeed.appendChild(createExternalSearchCard());
        }
        } catch (feedErr) {
            console.error("Search rendering error caught:", feedErr);
            if (searchItemsFeed) {
                searchItemsFeed.innerHTML = `
                    <div style="background: #fff; border-radius: 8px; border: 1px solid #e3e7ed; padding: 40px 20px; text-align: center; color: #888;">
                        <h4 style="font-size: 16px; color: #333; margin-bottom: 6px;">'${activeQuery}' 검색 결과를 정리하는 중입니다.</h4>
                        <p style="font-size: 13px; margin-bottom: 16px;">아래 외부 검색엔진에서 즉시 찾아보실 수 있습니다.</p>
                    </div>
                `;
                searchItemsFeed.appendChild(createExternalSearchCard());
            }
        }
    }

    // Helper: Render individual cafe card
    function renderCafeSearchCard(post, activeQuery) {
        const card = document.createElement("article");
        card.className = "search-result-card cafe-result-card";

        const highlightedTitle = highlightKeyword(post.title, activeQuery);
        let snippetText = post.summary || "";
        if (!snippetText && post.content) {
            const tmp = document.createElement("div");
            tmp.innerHTML = post.content;
            snippetText = tmp.innerText || tmp.textContent;
        }
        const highlightedSnippet = highlightKeyword(snippetText, activeQuery);
        const cafeUrl = `cafe-detail.html?id=${post.cafeId}&postId=${post.id}`;

        card.innerHTML = `
            <div class="result-source-row">
                <div class="result-source-info">
                    <img src="${post.cafeIcon}" class="result-author-avatar" alt="${post.cafeName}" onerror="this.src='default-avatar.svg'">
                    <span class="result-source-name"><strong>${post.cafeName}</strong> · ${post.author}</span>
                    <span class="result-source-time">· ${post.time || '방금 전'}</span>
                </div>
                <span class="result-type-badge cafe-badge"><i class="fa-solid fa-mug-hot" style="font-size:10px; margin-right:3px;"></i>카페</span>
            </div>
            <div class="result-main-group">
                <div class="result-text-content">
                    <h4 class="result-title" onclick="location.href='${cafeUrl}'">${highlightedTitle}</h4>
                    <p class="result-snippet">${highlightedSnippet}</p>
                </div>
                ${post.thumbnail ? `
                    <div class="result-thumb-wrapper" onclick="location.href='${cafeUrl}'">
                        <img src="${post.thumbnail}" alt="Thumbnail" class="result-thumb-img">
                    </div>
                ` : ''}
            </div>
            <div class="result-sub-replies">
                <div class="sub-reply-item">
                    <span class="sub-reply-tag">${post.boardName || '게시판'}</span>
                    <span>조회 ${post.views || 0} · 댓글 ${post.comments || 0} · 좋아요 ${post.likes || 0}</span>
                </div>
                <div class="sub-reply-item" style="color:#03c75a; font-weight:600; cursor:pointer;" onclick="location.href='${cafeUrl}'">
                    <span>카페 글 보기 <i class="fa-solid fa-chevron-right" style="font-size:10px;"></i></span>
                </div>
            </div>
        `;
        return card;
    }

    // Helper: Render individual blog card
    function renderPostSearchCard(post, activeQuery) {
        const card = document.createElement("article");
        card.className = "search-result-card";

        const highlightedTitle = highlightKeyword(post.title, activeQuery);
        let snippetText = post.summary || "";
        if (!snippetText && post.fullContent) {
            const tmp = document.createElement("div");
            tmp.innerHTML = post.fullContent;
            snippetText = tmp.innerText || tmp.textContent;
        }
        const highlightedSnippet = highlightKeyword(snippetText, activeQuery);

        let authorAvatar = localStorage.getItem(`naverBlogAvatar_${post.author}`);
        if (!authorAvatar || !authorAvatar.startsWith("http") && !authorAvatar.startsWith("data:")) {
            authorAvatar = 'default-avatar.svg';
        }

        card.innerHTML = `
            <div class="result-source-row">
                <div class="result-source-info">
                    <img src="${authorAvatar}" class="result-author-avatar" alt="${post.author}" onerror="this.onerror=null; this.src='default-avatar.svg';">
                    <span class="result-source-name">${post.author}</span>
                    <span class="result-source-time">· ${post.time || '방금 전'}</span>
                </div>
                <span class="result-type-badge">${post.category || '블로그'}</span>
            </div>
            <div class="result-main-group">
                <div class="result-text-content">
                    <h4 class="result-title" onclick="location.href='my-blog.html?post=${post.id}'">${highlightedTitle}</h4>
                    <p class="result-snippet">${highlightedSnippet}</p>
                </div>
                ${post.thumbnail ? `
                    <div class="result-thumb-wrapper" onclick="location.href='my-blog.html?post=${post.id}'">
                        <img src="${post.thumbnail}" alt="Thumbnail" class="result-thumb-img">
                    </div>
                ` : ''}
            </div>
            <div class="result-sub-replies">
                <div class="sub-reply-item">
                    <span class="sub-reply-tag">RE</span>
                    <span>${post.category || '지식공유'} 추천 글 및 상세 스펙 가이드</span>
                </div>
                <div class="sub-reply-item" style="color:#03c75a; font-weight:600; cursor:pointer;" onclick="location.href='my-blog.html?post=${post.id}'">
                    <span>원문 보기 <i class="fa-solid fa-chevron-right" style="font-size:10px;"></i></span>
                </div>
            </div>
        `;
        return card;
    }

    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                // Add to recent search array (limit to 5)
                recentSearches = recentSearches.filter(item => item !== query);
                recentSearches.unshift(query);
                if (recentSearches.length > 5) recentSearches.pop();
                
                localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
                renderRecentSearches();

                // Perform in-place search on index.html
                performMainSearch(query);
            }
        });
    }

    if (aiSearchBtn) {
        aiSearchBtn.addEventListener("click", () => {
            const query = searchInput.value.trim();
            if (query) {
                performMainSearch(query);
            } else {
                alert("검색어를 입력한 뒤 AI 버튼을 눌러주세요!");
            }
        });
    }

    // Recommend tag click events
    document.querySelectorAll(".recommend-tags .tag").forEach(tag => {
        tag.addEventListener("click", () => {
            const keyword = tag.textContent.replace("#", "").trim();
            searchInput.value = keyword;
            performMainSearch(keyword);
        });
    });

    // ----------------------------------------------------
    // 5. Publisher Grid Render & Tabs Switch (뉴스스탠드 학술사 그리드)
    // ----------------------------------------------------
    const renderPublisherGrid = (category, page = 1) => {
        if (!publisherGrid) return;
        
        publisherGrid.innerHTML = "";
        
        let allPublishers = publisherData[category] || publisherData.all;
        
        // Simulating different ordering/filtering on pagination
        // Since we have 24 publishers per page, let's rotate them based on page to show pagination works!
        let publishers = [...allPublishers];
        if (page > 1) {
            const shiftCount = (page - 1) * 6;
            // Shift array items to simulate different page configurations
            const slicedPart = publishers.splice(0, shiftCount);
            publishers = [...publishers, ...slicedPart];
        }

        publishers.forEach((pub) => {
            const isSubscribed = subscribedPublishers.has(pub.name);
            const slot = document.createElement("div");
            slot.className = "publisher-slot";
            
            // Format class names for specific text logos
            const textClass = pub.class ? `pub-logo-text ${pub.class}` : "pub-logo-text";
            
            slot.innerHTML = `
                <div class="${textClass}">${pub.name}</div>
                <div class="publisher-hover-card">
                    <button class="hover-btn subscribe ${isSubscribed ? 'subscribed' : ''}" data-name="${pub.name}">
                        ${isSubscribed ? '<i class="fa-solid fa-check"></i> 구독중' : '<i class="fa-solid fa-plus"></i> 구독'}
                    </button>
                    <button class="hover-btn view">이동</button>
                </div>
            `;
            
            publisherGrid.appendChild(slot);
        });

        // Attach events to subscribe buttons
        publisherGrid.querySelectorAll(".hover-btn.subscribe").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const name = btn.getAttribute("data-name");
                if (subscribedPublishers.has(name)) {
                    subscribedPublishers.delete(name);
                    btn.classList.remove("subscribed");
                    btn.innerHTML = '<i class="fa-solid fa-plus"></i> 구독';
                } else {
                    subscribedPublishers.add(name);
                    btn.classList.add("subscribed");
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> 구독중';
                }
            });
        });

        // Update Page Indicator text
        if (gridPageIndicator) {
            gridPageIndicator.textContent = `학술사 더보기 ${page} / 4`;
        }
    };

    // Initialize Publisher Grid
    renderPublisherGrid('all', 1);

    // Tab clicks event
    journalTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            journalTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            currentGridCategory = tab.getAttribute("data-category");
            currentGridPage = 1;
            renderPublisherGrid(currentGridCategory, currentGridPage);
        });
    });

    // Pagination Click Events
    if (gridPrevBtn) {
        gridPrevBtn.addEventListener("click", () => {
            currentGridPage = currentGridPage === 1 ? 4 : currentGridPage - 1;
            renderPublisherGrid(currentGridCategory, currentGridPage);
        });
    }

    if (gridNextBtn) {
        gridNextBtn.addEventListener("click", () => {
            currentGridPage = currentGridPage === 4 ? 1 : currentGridPage + 1;
            renderPublisherGrid(currentGridCategory, currentGridPage);
        });
    }

    // ----------------------------------------------------
    // 6. Login Form Actions & State Toggle (로그인 박스 전환)
    // ----------------------------------------------------
    if (showLoginFormBtn) {
        showLoginFormBtn.addEventListener("click", () => {
            loginLoggedOut.style.display = "none";
            loginFormContainer.style.display = "block";
        });
    }

    if (closeLoginBtn) {
        closeLoginBtn.addEventListener("click", () => {
            loginFormContainer.style.display = "none";
            loginLoggedOut.style.display = "block";
        });
    }

    async function syncPortalProfileAvatar(savedName, savedUsername, directAvatarUrl) {
        const avatarBox = document.querySelector(".profile-avatar");
        if (!avatarBox) return;

        if (directAvatarUrl) {
            avatarBox.innerHTML = `<img src="${directAvatarUrl}" alt="프로필 아바타" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" onerror="this.src='default-avatar.svg'">`;
            return;
        }

        const name = savedName || localStorage.getItem("naverLoggedInUser") || "";
        const username = savedUsername || localStorage.getItem("naverLoggedInUsername") || name;

        if (!name && !username) {
            avatarBox.innerHTML = `<img src="default-avatar.svg" alt="프로필 아바타" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            return;
        }

        try {
            const queryName = encodeURIComponent(name);
            const queryUser = encodeURIComponent(username);
            const res = await fetch(`https://pb.joyfamkr.synology.me/api/collections/users/records?filter=(name='${queryName}'||username='${queryName}'||name='${queryUser}'||username='${queryUser}')`);
            if (res.ok) {
                const data = await res.json();
                if (data.items && data.items.length > 0 && data.items[0].avatarUrl) {
                    avatarBox.innerHTML = `<img src="${data.items[0].avatarUrl}" alt="프로필 아바타" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" onerror="this.src='default-avatar.svg'">`;
                    return;
                }
            }
        } catch (err) {
            console.warn("Failed to fetch avatar from PocketBase:", err);
        }

        avatarBox.innerHTML = `<img src="default-avatar.svg" alt="프로필 아바타" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    }

    let portalCurrentAvatarUrl = "default-avatar.svg";

    window.openPortalProfileModal = function() {
        const modal = document.getElementById("profile-modal");
        if (!modal) {
            console.error("profile-modal element not found!");
            return;
        }

        const isAuth = (localStorage.getItem("naverIsLoggedIn") === "true") || Boolean(localStorage.getItem("naverLoggedInUser"));
        if (!isAuth) {
            const lOut = document.getElementById("login-logged-out");
            const lForm = document.getElementById("login-form-container");
            if (lOut && lForm) {
                lOut.style.display = "none";
                lForm.style.display = "block";
            }
            return;
        }

        const userName = localStorage.getItem("naverLoggedInUser") || "홍길동";
        const userUsername = localStorage.getItem("naverLoggedInUsername") || userName;

        const previewEl = document.getElementById("modal-avatar-preview");
        const titleInput = document.getElementById("modal-blog-title");
        const descInput = document.getElementById("modal-blog-desc");

        const currentAvatarImg = document.querySelector(".profile-avatar img");
        portalCurrentAvatarUrl = currentAvatarImg ? currentAvatarImg.src : "default-avatar.svg";
        if (previewEl) previewEl.src = portalCurrentAvatarUrl;

        if (titleInput) titleInput.value = `${userName}의 일상 & 지식 서재`;
        if (descInput) descInput.value = "배움과 소소한 일상을 기록하는 공간입니다.";

        // Direct style enforcement
        modal.classList.add("active");
        modal.style.setProperty("display", "flex", "important");
        modal.style.setProperty("opacity", "1", "important");
        modal.style.setProperty("pointer-events", "auto", "important");
        modal.style.setProperty("z-index", "999999", "important");

        // Async background fetch latest profile from PocketBase
        const queryName = encodeURIComponent(userName);
        const queryUser = encodeURIComponent(userUsername);
        fetch(`https://pb.joyfamkr.synology.me/api/collections/users/records?filter=(name='${queryName}'||username='${queryName}'||name='${queryUser}'||username='${queryUser}')`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.items && data.items.length > 0) {
                    const record = data.items[0];
                    if (record.avatarUrl) {
                        portalCurrentAvatarUrl = record.avatarUrl;
                        if (previewEl) previewEl.src = record.avatarUrl;
                    }
                    if (record.blogTitle && titleInput) {
                        titleInput.value = record.blogTitle;
                    }
                    if (record.blogDesc && descInput) {
                        let clean = record.blogDesc.replace(/__VISITORS:\d+__/g, "").trim();
                        descInput.value = clean;
                    }
                }
            })
            .catch(e => console.warn("Fetch profile for modal failed:", e));
    };

    window.closePortalProfileModal = function() {
        const modal = document.getElementById("profile-modal");
        if (modal) {
            modal.classList.remove("active");
            modal.style.setProperty("display", "none", "important");
        }
    };

    window.setPortalPresetAvatar = function(src) {
        portalCurrentAvatarUrl = src;
        const previewEl = document.getElementById("modal-avatar-preview");
        if (previewEl) previewEl.src = src;
    };

    window.handlePortalAvatarChange = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("사진 용량은 5MB 이하로 업로드해주세요.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const rawResult = e.target.result;
            portalCurrentAvatarUrl = rawResult;
            const previewEl = document.getElementById("modal-avatar-preview");
            if (previewEl) previewEl.src = rawResult;

            const img = new Image();
            img.onload = function() {
                try {
                    const canvas = document.createElement("canvas");
                    const size = 200;
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, size, size);
                    const compressedUrl = canvas.toDataURL("image/jpeg", 0.85);
                    if (compressedUrl && compressedUrl.length > 50) {
                        portalCurrentAvatarUrl = compressedUrl;
                        if (previewEl) previewEl.src = compressedUrl;
                    }
                } catch (err) {}
            };
            img.src = rawResult;
        };
        reader.readAsDataURL(file);
    };

    window.savePortalProfile = async function() {
        const userName = localStorage.getItem("naverLoggedInUser") || "홍길동";
        const userUsername = localStorage.getItem("naverLoggedInUsername") || userName;
        const newTitle = document.getElementById("modal-blog-title") ? document.getElementById("modal-blog-title").value.trim() : "";
        const newDesc = document.getElementById("modal-blog-desc") ? document.getElementById("modal-blog-desc").value.trim() : "";

        const previewEl = document.getElementById("modal-avatar-preview");
        if (previewEl && previewEl.src) {
            portalCurrentAvatarUrl = previewEl.src;
        }

        const saveBtn = document.getElementById("btn-save-portal-profile");
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.textContent = "저장 중...";
        }

        try {
            const queryName = encodeURIComponent(userName);
            const queryUser = encodeURIComponent(userUsername);
            const searchRes = await fetch(`https://pb.joyfamkr.synology.me/api/collections/users/records?filter=(name='${queryName}'||username='${queryName}'||name='${queryUser}'||username='${queryUser}')`);
            if (searchRes.ok) {
                const sData = await searchRes.json();
                if (sData.items && sData.items.length > 0) {
                    const userRecord = sData.items[0];
                    const userId = userRecord.id;

                    const updatePayload = {};
                    if (portalCurrentAvatarUrl) updatePayload.avatarUrl = portalCurrentAvatarUrl;
                    if (newTitle) updatePayload.blogTitle = newTitle;
                    if (newDesc !== undefined && newDesc !== "") {
                        updatePayload.blogDesc = newDesc.replace(/__VISITORS:\d+__/g, "").trim();
                    }

                    const patchRes = await fetch(`https://pb.joyfamkr.synology.me/api/collections/users/records/${userId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatePayload)
                    });

                    if (patchRes.ok) {
                        const updatedUser = await patchRes.json();
                        const avatarBox = document.querySelector(".profile-avatar");
                        if (avatarBox && updatedUser.avatarUrl) {
                            avatarBox.innerHTML = `<img src="${updatedUser.avatarUrl}" alt="프로필 아바타" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" onerror="this.src='default-avatar.svg'">`;
                        }
                        alert("프로필이 서버에 성공적으로 저장되었습니다.");
                        closePortalProfileModal();
                    } else {
                        const errBody = await patchRes.json().catch(() => ({}));
                        alert(`서버 저장 실패: ${errBody.message || '서버 응답 오류'}`);
                    }
                } else {
                    alert("서버에서 사용자 정보를 찾을 수 없습니다.");
                }
            } else {
                alert("서버 연결에 실패했습니다.");
            }
        } catch (err) {
            console.error("Profile save error:", err);
            alert("네트워크 오류로 서버에 저장하지 못했습니다.");
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = "저장";
            }
        }
    };

    // Event listeners for profile avatar and settings button
    document.addEventListener("click", (e) => {
        if (e.target.closest(".profile-settings-btn") || e.target.closest(".profile-avatar-wrapper")) {
            e.preventDefault();
            e.stopPropagation();
            window.openPortalProfileModal();
        }
    });

    const portalModalEl = document.getElementById("profile-modal");
    if (portalModalEl) {
        portalModalEl.addEventListener("click", (e) => {
            if (e.target === portalModalEl) {
                window.closePortalProfileModal();
            }
        });
    }

    // Persist login state on load
    if (localStorage.getItem("naverIsLoggedIn") === "true") {
        const savedName = localStorage.getItem("naverLoggedInUser") || "홍길동";
        const savedUsername = localStorage.getItem("naverLoggedInUsername") || savedName;
        let savedEmail = (localStorage.getItem("naverLoggedInEmail") || "gildong@eduver.com").replace(/@(edunaver|edunver|naver)\.com$/i, "@eduver.com");
        localStorage.setItem("naverLoggedInEmail", savedEmail);
        
        if (loginLoggedOut && loginLoggedIn) {
            loginLoggedOut.style.display = "none";
            loginLoggedIn.style.display = "block";
            userDisplayName.textContent = savedName;
            const profileEmailEl = document.querySelector(".profile-email");
            if (profileEmailEl) {
                profileEmailEl.textContent = savedEmail;
            }

            syncPortalProfileAvatar(savedName, savedUsername);
            updateUnreadCounts();
        }
    }

    if (authForm) {
        authForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const idInput = document.getElementById("user-id").value.trim();
            const pwInput = document.getElementById("user-pw").value.trim();

            let finalName = "";
            let emailAddr = "";
            let loggedIn = false;
            let actualLoginId = "";
            let avatarFromPb = "";

            // 1. Check local mock credentials first
            if ((idInput === "abc@eduver.com" || idInput === "abc@edunaver.com" || idInput === "abc@naver.com" || idInput === "abc") && pwInput === "abcd1234") {
                finalName = "abc";
                emailAddr = "abc@eduver.com";
                actualLoginId = "abc";
                loggedIn = true;
            } else if ((idInput === "apple@eduver.com" || idInput === "apple@edunaver.com" || idInput === "apple@naver.com" || idInput === "apple") && pwInput === "abcd1234") {
                finalName = "apple";
                emailAddr = "apple@eduver.com";
                actualLoginId = "apple";
                loggedIn = true;
            } else if (idInput === "student" && pwInput === "1234") {
                finalName = "홍길동";
                emailAddr = "gildong@eduver.com";
                actualLoginId = "student";
                loggedIn = true;
            }

            // 2. Try PocketBase fallback authentication if local match fails
            if (!loggedIn) {
                try {
                    const pbAuthUrl = "https://pb.joyfamkr.synology.me/api/collections/users/auth-with-password";
                    const response = await fetch(pbAuthUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            identity: idInput,
                            password: pwInput
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        finalName = data.record.name || data.record.username || idInput.split("@")[0];
                        actualLoginId = data.record.username || (data.record.email ? data.record.email.split("@")[0] : idInput.split("@")[0]);
                        emailAddr = (data.record.email || `${actualLoginId}@eduver.com`).replace(/@(edunaver|edunver|naver)\.com$/i, "@eduver.com");
                        loggedIn = true;
                        avatarFromPb = data.record.avatarUrl || "";

                        // Save PocketBase user profile info
                        localStorage.setItem("naverLoggedInUsername", actualLoginId);
                        localStorage.setItem("naverLoggedInUserId", actualLoginId);
                        if (data.record.id) localStorage.setItem("naverPbRecordId", data.record.id);
                    }
                } catch (err) {
                    console.error("PocketBase auth connection failed:", err);
                }
            }

            if (!loggedIn) {
                alert("아이디 또는 비밀번호가 올바르지 않습니다.");
                return;
            }

            emailAddr = emailAddr.replace(/@(edunaver|edunver|naver)\.com$/i, "@eduver.com");

            loginFormContainer.style.display = "none";
            loginLoggedIn.style.display = "block";
            userDisplayName.textContent = finalName;
            
            const profileEmailEl = document.querySelector(".profile-email");
            if (profileEmailEl) {
                profileEmailEl.textContent = emailAddr;
            }

            syncPortalProfileAvatar(finalName, actualLoginId, avatarFromPb);
            
            // Set persistence
            localStorage.setItem("naverIsLoggedIn", "true");
            localStorage.setItem("naverLoggedInUser", finalName);
            localStorage.setItem("naverLoggedInUsername", actualLoginId);
            localStorage.setItem("naverLoggedInUserId", actualLoginId);
            localStorage.setItem("naverLoggedInEmail", emailAddr);
            updateUnreadCounts();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            loginLoggedIn.style.display = "none";
            loginLoggedOut.style.display = "block";
            // Clean credentials in form
            authForm.reset();
            localStorage.removeItem("naverIsLoggedIn");
            localStorage.removeItem("naverLoggedInUser");
            localStorage.removeItem("naverLoggedInUsername");
            localStorage.removeItem("naverLoggedInUserId");
            localStorage.removeItem("naverLoggedInEmail");
            localStorage.removeItem("naverPbRecordId");
        });
    }

    // ----------------------------------------------------
    // 8. Dedicated Mail Application Navigation Redirect
    // ----------------------------------------------------
    const cardMailBtn = document.getElementById("card-mail-btn");
    const subnavMailBtn = document.getElementById("nav-mail-btn");

    const handleMailNavigation = (e) => {
        if (e) e.preventDefault();
        const isAuth = (localStorage.getItem("naverIsLoggedIn") === "true") || Boolean(localStorage.getItem("naverLoggedInUser"));
        if (!isAuth) {
            window.location.href = "login.html?redirect=mail.html";
            return;
        }
        window.location.href = "mail.html";
    };

    if (cardMailBtn) {
        cardMailBtn.addEventListener("click", handleMailNavigation);
    }
    if (subnavMailBtn) {
        subnavMailBtn.addEventListener("click", handleMailNavigation);
    }

    const cardCafeBtn = document.getElementById("card-cafe-btn");
    const navCafeBtn = document.getElementById("nav-cafe-btn");

    const handleCafeNavigation = (e) => {
        if (e) e.preventDefault();
        window.location.href = "cafe.html";
    };

    if (cardCafeBtn) {
        cardCafeBtn.addEventListener("click", handleCafeNavigation);
    }
    if (navCafeBtn) {
        navCafeBtn.addEventListener("click", handleCafeNavigation);
    }

    // Update mail, cafe, and note counts dynamically from PocketBase & local cache
    async function updateUnreadCounts() {
        if (localStorage.getItem("naverIsLoggedIn") !== "true") {
            return;
        }
        const POCKETBASE_URL = "https://pb.joyfamkr.synology.me";
        const currentUserEmail = (localStorage.getItem("naverLoggedInEmail") || "gildong@eduver.com").toLowerCase().trim();
        const user = currentUserEmail.includes("@") ? currentUserEmail.split("@")[0] : currentUserEmail;
        const filterParam = encodeURIComponent(`(recipient='${currentUserEmail}' || recipient='${user}@eduver.com' || recipient='${user}@edunaver.com' || recipient='${user}@naver.com' || recipient='${user}')`);
        
        let unreadCount = 0;
        try {
            const response = await fetch(`${POCKETBASE_URL}/api/collections/mails/records?filter=${filterParam}`);
            if (response.ok) {
                const data = await response.json();
                unreadCount = (data.items || []).filter(m => !m.is_read).length;
            }
        } catch (err) {
            console.error("Failed to fetch unread mail count:", err);
        }

        // Update counts in DOM
        const mailCountEl = document.getElementById("profile-mail-count");
        if (mailCountEl) {
            mailCountEl.textContent = unreadCount > 99 ? "99+" : unreadCount;
        }
        
        const noteCountEl = document.getElementById("profile-note-count");
        if (noteCountEl) {
            noteCountEl.textContent = "0";
        }
        
        const cafeCountEl = document.getElementById("profile-cafe-count");
        if (cafeCountEl) {
            const cafes = JSON.parse(localStorage.getItem("naverCafesData") || "[]");
            cafeCountEl.textContent = cafes.length;
        }
    }
});
