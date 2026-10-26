// ====================================================
// EDUNAVER NEWS (에듀버 뉴스) - Core Engine & Data Manager
// ====================================================

const POCKETBASE_URL = "https://pb.joyfamkr.synology.me";

// Initial seed articles if local storage is empty
const defaultNews = [

];

// Initialize and Fetch News
async function getNewsArticles() {
    let articles = JSON.parse(localStorage.getItem("naverNewsArticles") || "[]");
    if (!articles || articles.length === 0) {
        articles = defaultNews;
        localStorage.setItem("naverNewsArticles", JSON.stringify(articles));
    }

    // Try background sync with PocketBase if collection exists
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(`${POCKETBASE_URL}/api/collections/news/records?sort=-created`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
            const data = await res.json();
            if (data && data.items && data.items.length > 0) {
                const pbArticles = data.items.map(item => {
                    const likedArr = Array.isArray(item.likedUsers) ? item.likedUsers : [];
                    return {
                        id: item.id,
                        title: item.title,
                        subtitle: item.subtitle || "",
                        category: item.category || "특수교육",
                        author: item.author || "기자",
                        authorId: item.authorId || "",
                        press: item.press || "에듀버 뉴스",
                        date: item.created ? new Date(item.created).toLocaleDateString() : "최근",
                        time: item.created ? new Date(item.created).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "",
                        summary: item.summary || "",
                        content: item.content || item.summary || "",
                        thumbnail: item.thumbnail || "",
                        views: item.views || 0,
                        likedUsers: likedArr,
                        likes: likedArr.length || item.likes || 0,
                        isHeadline: Boolean(item.isHeadline)
                    };
                });
                // Merge without duplicating (check by ID and title)
                const merged = [...pbArticles];
                const seenTitleSet = new Set(pbArticles.map(p => (p.title || "").replace(/\s+/g, "").toLowerCase()));
                articles.forEach(localArt => {
                    const normTitle = (localArt.title || "").replace(/\s+/g, "").toLowerCase();
                    if (!merged.find(m => m.id === localArt.id) && !seenTitleSet.has(normTitle)) {
                        seenTitleSet.add(normTitle);
                        merged.push(localArt);
                    }
                });
                localStorage.setItem("naverNewsArticles", JSON.stringify(merged));
                return merged;
            }
        }
    } catch (e) {
        // Fallback to local
    }
    return articles;
}

// Global active category
let currentNewsCategory = "전체";

// Render News Portal Home
async function renderNewsHome() {
    const articles = await getNewsArticles();
    if (!articles || articles.length === 0) return;

    // Filter by category
    const filtered = currentNewsCategory === "전체" 
        ? articles 
        : articles.filter(a => a.category === currentNewsCategory);

    // Headline is either marked or first item
    const headline = filtered.find(a => a.isHeadline) || filtered[0] || articles[0];
    const subArticles = filtered.filter(a => a.id !== headline.id);

    // Render Headline Hero
    const heroContainer = document.getElementById("headline-hero-box");
    if (heroContainer && headline) {
        heroContainer.innerHTML = `
            <div class="headline-hero-card" onclick="openNewsDetail('${headline.id}')">
                <div class="headline-hero-img-wrap">
                    <span class="headline-badge">헤드라인</span>
                    ${headline.thumbnail 
                        ? `<img src="${headline.thumbnail}" alt="Thumbnail" class="headline-hero-img">`
                        : `<div class="headline-hero-img placeholder-hero-img" style="display:flex;align-items:center;justify-content:center;background:#1e293b;color:#94a3b8;font-size:42px;"><i class="fa-solid fa-newspaper"></i></div>`}
                </div>
                <div class="headline-hero-content">
                    <div>
                        <div class="headline-hero-category">[${headline.category}]</div>
                        <h2 class="headline-hero-title">${headline.title}</h2>
                        <p class="headline-hero-desc">${headline.subtitle || headline.summary}</p>
                    </div>
                    <div class="headline-hero-meta">
                        <span><strong>${headline.press}</strong></span>
                        <span>· ${headline.date}</span>
                        <span>· 조회수 ${headline.views.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Render Sub Cards List
    const listContainer = document.getElementById("news-cards-list");
    if (listContainer) {
        if (subArticles.length === 0) {
            listContainer.innerHTML = `<div style="text-align:center; padding: 40px; color: #888; background:#fff; border-radius:8px; border:1px solid #e3e7ed;">해당 분야의 등록된 기사가 없습니다.</div>`;
        } else {
            listContainer.innerHTML = subArticles.map(art => `
                <article class="news-card-item" onclick="openNewsDetail('${art.id}')">
                    <div class="news-card-text">
                        <div>
                            <div class="news-card-cat-badge">[${art.category}]</div>
                            <h3 class="news-card-title">${art.title}</h3>
                            <p class="news-card-snippet">${art.summary}</p>
                        </div>
                        <div class="news-card-meta">
                            <span><strong>${art.press}</strong> (${art.author})</span>
                            <span>· ${art.date}</span>
                            <span><i class="fa-regular fa-heart"></i> ${art.likes}</span>
                        </div>
                    </div>
                    ${art.thumbnail ? `<img src="${art.thumbnail}" alt="Thumb" class="news-card-thumb">` : ''}
                </article>
            `).join("");
        }
    }

    // Render Popular Ranking News
    const rankingContainer = document.getElementById("ranking-news-list");
    if (rankingContainer) {
        const sortedByViews = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
        rankingContainer.innerHTML = sortedByViews.map((art, idx) => `
            <li class="ranking-item" onclick="openNewsDetail('${art.id}')">
                <span class="ranking-num">${idx + 1}</span>
                <span class="ranking-text">${art.title}</span>
            </li>
        `).join("");
    }
}

// Open News Detail Page
function openNewsDetail(newsId) {
    window.location.href = `news-detail.html?id=${encodeURIComponent(newsId)}`;
}

// Adjust font size in article detail
let currentDetailFontSize = 16.5;
function changeDetailFontSize(delta) {
    currentDetailFontSize = Math.max(14, Math.min(24, currentDetailFontSize + delta));
    const bodyEl = document.getElementById("detail-body");
    if (bodyEl) {
        bodyEl.style.fontSize = `${currentDetailFontSize}px`;
    }
}
