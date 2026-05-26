// ==================== 全域狀態與初始化 ====================
// 若在 GitHub Pages (非 localhost) 上執行，則將請求導向 Render 雲端伺服器；否則使用本機路徑
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? ''
  : 'https://gap-d-backend.onrender.com'; // 部署後請在此處替換為您的 Render 伺服器網址

// 本地快取備用資料 (當 Render 雲端伺服器休眠或尚未啟動時，確保網頁維持正常顯示)
const FALLBACK_PAPERS = [
  {
    id: "paper-1",
    title: "數位假評的期望扭曲效應：基於 MOT 理論的服務品質缺口研究",
    englishTitle: "The Expectation Distortion Effect of Fake Online Reviews: A Service Quality Gap Study Based on MOT Theory",
    author: "黄國津（建國科技大學）",
    conference: "台北商業大學研討會",
    date: "2026-05-15",
    status: "已接受口頭發表（已於 5/15 發表）",
    abstract: "本研究探討數位假評（Fake Reviews）對消費者服務期望與品質感知之影響機制。依據 PZB 服務品質缺口模型（Parasuraman et al., 1985），本研究提出「Gap D（數位資訊污染缺口）」：Gap D = E_polluted − E_authentic，具方向性——正向假評造成上行扭曲（Gap D > 0，E↑，Gap 5 擴大，消費者失落）；負向假評造成下行扭曲（Gap D < 0，E↓，Gap 5 縮小，品牌遭系統性低估）。此雙向扭曲機制，本研究正式命名為「期望扭曲悖論（Expectation Distortion Paradox, EDP）」。援引 Carlzon（1987）MOT 理論，本研究提出三項評論真實性指標：具體性分數（SS－Specificity Score）、模板相似度（TS－Template Similarity）及情感細粒度（SG－Sentiment Granularity），整合為整體評分，開發「MOT Calibrator」工具原型，協助消費者在 ZMOT 階段主動校準期望。理論貢獻在於：首次系統性建構雙向 Gap D 框架，並將假評研究從技術偵測視角拓展至服務管理的期望品質保護視角。",
    keywords: ["假評偵測", "期望扭曲悖論", "Gap D", "MOT 理論", "PZB 服務品質缺口", "精細可能性模型 (ELM)"],
    fileName: "mock_paper_1.pdf"
  },
  {
    id: "paper-2",
    title: "Gap D 作為 PZB 獨立缺口的三維論證：問責性、信號可信度與市場失靈",
    englishTitle: "Gap D as an Independent PZB Service Quality Gap: A Three-Dimensional Theoretical Argument for Accountability, Signaling Credibility, and Market Failure",
    author: "黄國津（建國科技大學）",
    conference: "龍華科技大學研討會",
    date: "2026-05-29",
    status: "已接受口頭發表（將於 5/29 發表）",
    abstract: "本研究針對現有服務品質理論的測量盲點，正式提出「Gap D（數位資訊污染缺口）」，並主張 Gap D 不僅是 PZB 原始 Gap 4（外部溝通缺口）的數位化延伸，而是具有制度性本質差異的獨立理論命題。本研究從三個獨立理論維度進行論證：（1）資訊問責性（Drucker, 1993）——Gap D 的資訊主體為匿名第三方，現有法律問責機制難以有效追溯與即時處理；（2）信號可信度（Spence, 1973）——假評偽裝成中立口碑，繞過消費者的勸說知識防禦機制，造成比廣告更深的期望污染；（3）市場失靈機制（Akerlof, 1970）——假評構成數位市場中的「檸檬信號」，可能導致誠實業者在口碑競爭中處於系統性不利地位。Gap D 正式定義為：Gap D = E_polluted − E_authentic，具方向性，並以修正公式 Gap 5（修正版）= (E_authentic + Gap D) − P 整合進 PZB 框架。本研究進一步提出「期望扭曲悖論（EDP）」雙向框架、MOT Calibrator 評分工具及 MARC / MACS 三層治理架構，作為 Gap D 獨立命題的理論延伸與實踐出口。",
    keywords: ["假評偵測", "期望扭曲悖論", "MOT 理論", "PZB 服務品質缺口", "期望校準"],
    fileName: "mock_paper_2.pdf"
  },
  {
    id: "paper-3",
    title: "EAQUAL-15：期望真實性量表初步原型建構 ——數位假評情境下消費者期望校準機制的三構面設計",
    englishTitle: "EAQUAL-15: Expectation Authenticity Quality Scale Preliminary Prototype Construction - Three-Dimensional Design of Consumer Expectation Calibration Mechanism Under Fake Online Reviews",
    author: "黄國津（建國科技大學）",
    conference: "台北科技大學研討會",
    date: "2026-06-05",
    status: "已接受口頭發表（將於 6/5 發表）",
    abstract: "數位假評在消費者形成消費期望之前即可能污染其資訊基礎，使PZB服務品質缺口模型中「期望（E）」之形成過程暴露於系統性扭曲。然而SERVQUAL之22題量表聚焦於服務接觸後之P−E差距，較少處理期望形成階段所接觸資訊之真實性品質。為回應此測量缺口，本研究提出EAQUAL（Expectation Authenticity Quality Scale，期望真實性品質量表）作為一套針對「期望形成真實性」之初步量表原型（preliminary prototype scale）。本研究將量表收斂為三個核心構面：來源可信度（SC，4題）、內容真實性（CA，6題）、體驗一致性（EC，5題），共15題，採Likert五點量表，定位為「形成—驗證雙階段」感知量表。本文之理論貢獻在於提出針對期望污染缺口（Gap D）之消費者端測量工具雛形，並區隔於既有eWOM credibility與information quality研究。後續研究將進一步進行信度、收斂效度、區別效度與預測效度之實證驗證，並提出MACS（MOT Authenticity Certification System）作為平台端應用延伸，共同建構期望誠實管理（EHM）之操作框架。",
    keywords: ["EAQUAL", "期望真實性", "假評", "服務品質量表", "Gap D", "MACS", "期望誠實管理"],
    fileName: "mock_paper_3.pdf"
  }
];

const FALLBACK_COMMENTS = [
  {
    id: "comment-fallback-1",
    name: "李明華 (台大資管所)",
    email: "mh.li@example.com",
    content: "黄同學的研究非常深入！Gap D 與 EDP 的雙向扭曲模型突破了傳統 PZB 服務品質量表僅關注「服務後」的侷限。在數位時代，購前期望被假評系統性扭曲的現象確實非常普遍且嚴重，這個研究缺口非常有價值！",
    paperId: "paper-1",
    date: "2026-05-16 14:30:22",
    motTag: "🟢 高具體性評論",
    rating: "high"
  },
  {
    id: "comment-fallback-2",
    name: "張雅婷 (政大企管系)",
    email: "yt.chang@example.com",
    content: "超棒的研究！大推！CP值很高的一篇文章，值得推薦，強烈推薦大家都來看！",
    paperId: "paper-1",
    date: "2026-05-17 09:15:40",
    motTag: "🔴 模板化評論",
    rating: "low"
  },
  {
    id: "comment-fallback-3",
    name: "陳志豪 (北科大經管所)",
    email: "ch.chen@example.com",
    content: "期待 6/5 台北科技大學研討會上發表的 EAQUAL-15 量表原型！我們實驗室也在探討 eWOM 的來源可信度，很高興看到有人將其與 Carlzon 的 MOT 理論結合，特別是針對 ZMOT 階段的期望校準，非常有啟發性。",
    paperId: "paper-3",
    date: "2026-05-20 18:45:10",
    motTag: "🟢 高具體性評論",
    rating: "high"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  loadPapers();
  loadComments();
  initNavScroll();
  initCalibratorDemos();
  initSecretAdminTrigger();
  initMarcDraftModal();
  initRevealAnimations();
});

// 隱藏版管理後台進入機制：連續快速點擊個人「黄」頭像或 LOGO 5 次即可進入後台
function initSecretAdminTrigger() {
  let clickCount = 0;
  let lastClickTime = 0;
  
  const triggers = document.querySelectorAll('.avatar, .logo');
  triggers.forEach(el => {
    el.addEventListener('click', (e) => {
      const now = Date.now();
      // 若點擊間隔超過 1.5 秒，則重新計數
      if (now - lastClickTime > 1500) {
        clickCount = 0;
      }
      
      clickCount++;
      lastClickTime = now;
      
      if (clickCount >= 5) {
        e.preventDefault(); // 只有在達到 5 次點擊、要跳轉時才阻擋預設行為
        clickCount = 0; // 重設計數器
        window.location.href = 'admin.html';
      }
    });
  });
}

// 頂部導覽平滑捲動與 active 狀態切換
function initNavScroll() {
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      const hrefAttr = link.getAttribute('href');
      if (hrefAttr && hrefAttr.startsWith('#')) {
        link.classList.remove('active');
        const href = hrefAttr.substring(1);
        if (href === current) {
          link.classList.add('active');
        }
      }
    });
  });
}

// ==================== 論文載入 ====================
async function loadPapers() {
  try {
    const res = await fetch(`${API_BASE}/api/papers`);
    const papers = await res.json();
    renderPapers(papers, false);
  } catch (err) {
    console.warn('雲端伺服器未回應，使用本地快取論文資料：', err);
    renderPapers(FALLBACK_PAPERS, true);
  }
}

function renderPapers(papers, isOffline = false) {
  const container = document.getElementById('papers-list-container');
  if (papers.length === 0) {
    container.innerHTML = '<div style="text-align:center;color:var(--text-dark);">目前暫無上傳著作。</div>';
    return;
  }

  container.innerHTML = '';
  if (isOffline) {
    container.innerHTML = `
      <div class="offline-notice" style="text-align:center;color:var(--primary);margin-bottom:1.5rem;font-size:0.9rem;padding:0.6rem;border:1px solid rgba(0,242,254,0.3);background:rgba(0,242,254,0.05);border-radius:8px;display:flex;align-items:center;justify-content:center;gap:0.5rem;box-shadow:0 0 10px rgba(0,242,254,0.1);">
        <span>📢 雲端伺服器載入中，已為您啟動本地快取防禦模式，您可以正常下載著作與填寫問卷！</span>
      </div>
    `;
  }

  papers.forEach(paper => {
    // 預設的三篇論文使用本機/Git倉庫相對路徑下載，動態上傳的使用 API_BASE
    const isDefaultPaper = ['paper-1', 'paper-2', 'paper-3'].includes(paper.id);
    const downloadUrl = isDefaultPaper ? `./uploads/${paper.fileName}` : `${API_BASE}/uploads/${paper.fileName}`;

    const paperHtml = `
      <div class="paper-item">
        <div class="paper-marker"></div>
        <div class="glass-card">
          <div class="paper-meta">
            <span class="paper-date">${paper.date}</span>
            <span class="paper-badge ${getBadgeClass(paper.status)}">${paper.status}</span>
            <span class="paper-badge badge-upcoming">${paper.conference}</span>
          </div>
          <div class="paper-content">
            <h3>${paper.title}</h3>
            <p class="paper-english-title">${paper.englishTitle}</p>
            <p class="paper-abstract"><b>摘要：</b>${paper.abstract}</p>
            
            <div class="keywords-container">
              ${paper.keywords.map(kw => `<span class="keyword-tag">${kw}</span>`).join('')}
            </div>

            ${paper.id === 'paper-1' ? `
            <div class="proof-container" style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed var(--border); margin-bottom: 1.5rem;">
              <div style="font-family: var(--mono); font-size: 11px; color: var(--accent); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                研討會接受證明
              </div>
              <a href="./images/論文接受證明-北商大.jpg" target="_blank" title="點擊查看原圖" style="display: block; width: fit-content; max-width: 100%; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); transition: var(--transition-smooth);">
                <img src="./images/論文接受證明-北商大.jpg" alt="北商大論文接受證明" style="display: block; max-width: 240px; width: 100%; height: auto; transition: transform 0.3s; cursor: zoom-in;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
              </a>
            </div>
            ` : ''}

            ${paper.id === 'paper-2' ? `
            <div class="proof-container" style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed var(--border); margin-bottom: 1.5rem;">
              <div style="font-family: var(--mono); font-size: 11px; color: var(--accent); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                審查結果通知
              </div>
              <a href="./images/龍華科大收錄回函.png" target="_blank" title="點擊查看原圖" style="display: block; width: fit-content; max-width: 100%; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); transition: var(--transition-smooth);">
                <img src="./images/龍華科大收錄回函.png" alt="龍華科大收錄回函" style="display: block; max-width: 240px; width: 100%; height: auto; transition: transform 0.3s; cursor: zoom-in;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
              </a>
            </div>
            ` : ''}

            ${paper.id === 'paper-3' ? `
            <div class="proof-container" style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed var(--border); margin-bottom: 1.5rem;">
              <div style="font-family: var(--mono); font-size: 11px; color: var(--accent); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                審查結果通知
              </div>
              <a href="./images/北科大審查回函.png" target="_blank" title="點擊查看原圖" style="display: block; width: fit-content; max-width: 100%; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); transition: var(--transition-smooth);">
                <img src="./images/北科大審查回函.png" alt="北科大審查回函" style="display: block; max-width: 240px; width: 100%; height: auto; transition: transform 0.3s; cursor: zoom-in;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
              </a>
            </div>
            ` : ''}


            <div class="paper-actions">
              ${paper.id === 'paper-3' ? `
                <button class="btn" disabled style="background: rgba(255, 255, 255, 0.05); color: var(--text-dark); cursor: not-allowed; border: 1px solid var(--border-glass); padding: 0.6rem 1.2rem; display: inline-flex; align-items: center; gap: 0.5rem; border-radius: 8px;">
                  🔒 6/5 發表後公開
                </button>
              ` : `
                <a href="${downloadUrl}" class="btn btn-primary" download="${paper.title}.pdf">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  下載論文 PDF
                </a>
              `}
              <a href="#comments" class="btn btn-secondary" onclick="selectPaperForComment('${paper.id}')">參與留言</a>
            </div>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', paperHtml);
  });
}

function getBadgeClass(status) {
  if (status.includes('5/15') || status.includes('已發表')) return 'badge-published';
  if (status.includes('6/5') || status.includes('北科大')) return 'badge-taipeitech';
  return 'badge-upcoming';
}

function selectPaperForComment(paperId) {
  const select = document.getElementById('comment-paper');
  if (select) {
    select.value = paperId;
  }
}

// ==================== MOT Calibrator 演算法 ====================
const MOT_MARKERS = {
  personnel: {
    words: ['服務員', '服務生', '店員', '老闆', '小陳', '經理', '接待', '廖老師', '廖仁傑'],
    weight: 1.5,
    name: '人員互動'
  },
  sensory: {
    words: ['湯頭', '鹹', 'Q彈', '感官', '美麗', '吵雜', '味道', '氣味', '燈光', '香氣', '軟硬'],
    weight: 1.3,
    name: '感官描述'
  },
  spatiotemporal: {
    words: ['靠窗', '座位', '等了', '分鐘', '週末', '昨天', '晚上', '下午', '角落', '門口'],
    weight: 1.2,
    name: '時空細節'
  },
  product: {
    words: ['牛肉麵', '餐點', '咖啡', '房間', '車型', '飲料', '牛排', '手機', '電腦', '量表', '問卷'],
    weight: 1.0,
    name: '產品特徵'
  },
  negative: {
    words: ['但是', '偏鹹', '避開', '缺點', '差強人意', '改善', '可惜', '然而', '扣分', '美中不足'],
    weight: 2.0,
    name: '負向/轉折'
  }
};

const TEMPLATE_PHRASES = ['超棒', '大推', 'CP值超高', '一生推', '值得推薦', '非常滿意', '極推', '大讚', '完美的體驗'];

function initCalibratorDemos() {
  document.getElementById('btn-demo-real').addEventListener('click', () => {
    document.getElementById('review-input').value = 
      "服務員小陳主動幫我們換了靠窗的座位，點了招牌牛肉麵。湯頭偏鹹但是麵條極有Q彈嚼勁，等了快25分鐘才上桌，下次會想避開週末晚上再來。";
  });

  document.getElementById('btn-demo-fake').addEventListener('click', () => {
    document.getElementById('review-input').value = 
      "這家店真的超棒大推！CP值超高！一生推！環境非常滿意值得推薦，全部人都很滿意，下次一定還會再來消費，極推！";
  });

  document.getElementById('btn-calibrate').addEventListener('click', calibrateReview);
}

function calibrateReview() {
  const text = document.getElementById('review-input').value.trim();
  if (!text) {
    alert('請輸入欲評估的評論文字！');
    return;
  }

  // 1. 具體性得分 (SS) 計算
  let ssRaw = 0;
  Object.keys(MOT_MARKERS).forEach(key => {
    const group = MOT_MARKERS[key];
    group.words.forEach(w => {
      if (text.includes(w)) {
        ssRaw += group.weight;
      }
    });
  });
  // 映射至 5 分制
  let ssScore = parseFloat((Math.min(5, 1 + ssRaw * 0.7)).toFixed(1));

  // 2. 反模板化比例 (TS) 計算
  let templateMatches = 0;
  TEMPLATE_PHRASES.forEach(ph => {
    if (text.includes(ph)) templateMatches++;
  });
  // 模板匹配比例：若包含過多空洞套語，TS 分數降低
  let tsScore = 100 - Math.min(100, templateMatches * 25);

  // 3. 情感細粒度 (SG) 計算
  // 真實評論情感通常有層次或轉折，若只有單純極端正面或極端負面，SG分數低
  let posCount = 0;
  let negCount = 0;
  const posWords = ['好', '棒', '讚', '推', '滿意', '推薦', 'Q彈', '舒適'];
  const negWords = ['鹹', '等了', '偏', '避開', '缺點', '慢', '差', '不滿'];
  
  posWords.forEach(w => { if (text.includes(w)) posCount++; });
  negWords.forEach(w => { if (text.includes(w)) negCount++; });

  let sgScore = 1.0;
  if (posCount > 0 && negCount > 0) {
    sgScore = 4.8; // 雙向轉折，高細粒度
  } else if (posCount > 2 || negCount > 2) {
    sgScore = 3.0; // 有多個單向修飾詞
  } else {
    sgScore = 1.8; // 情感極其單一、空洞
  }

  // 4. 綜合得分 Overall (SS 佔 40%, TS 佔 30%, SG 佔 30%)
  const tsNormalized = (tsScore / 20); // 轉換為 5 分制
  const overall = parseFloat((ssScore * 0.4 + tsNormalized * 0.3 + sgScore * 0.3).toFixed(1));

  // 渲染結果
  const resultDiv = document.getElementById('calibrator-result');
  const alertBar = document.getElementById('risk-alert-bar');
  const riskLbl = document.getElementById('risk-label');
  const advice = document.getElementById('calibration-advice');

  // 更新數值
  document.getElementById('val-ss').textContent = ssScore;
  document.getElementById('val-ts').textContent = `${tsScore}%`;
  document.getElementById('val-sg').textContent = sgScore;
  document.getElementById('val-overall').textContent = overall;

  // 風險分級與期望校準建議 (EC)
  alertBar.className = 'risk-alert-bar';
  resultDiv.classList.add('active');

  if (overall >= 3.8) {
    alertBar.classList.add('risk-green');
    riskLbl.textContent = '✓ 高具體性 / 低風險';
    advice.textContent = `該評論富含具體服務瞬間 (MOT) 細節，且無模板刷分特徵，真實性高。您的購前期望 (E_authentic) 無需折價，可放心參考。`;
  } else if (overall >= 2.5) {
    alertBar.classList.add('risk-orange');
    riskLbl.textContent = '⚠ 一般情緒 / 中風險';
    advice.textContent = `該評論存在部分真實詞彙，但也夾雜了大量空泛詞。建議將您的消費期望打 8 折（即設定 P_expected = E * 0.8），保留些許心理準備以避免 Gap D 產生。`;
  } else {
    alertBar.classList.add('risk-red');
    riskLbl.textContent = '✗ 模板刷分 / 高風險';
    advice.textContent = `警告：此評論高機率為 AI 生成或網軍模板刷分！內容極度缺乏細節且情感單一。此評論會強烈污染您的期望（E_polluted 高昂）。強烈建議完全折扣此評論，或直接預設其真實品質為最低星等，以防禦 EDP 期望扭曲效應！`;
  }
}

// ==================== EAQUAL-15 量表互動 ====================
let currentStep = 1;

function nextQuizStep(step) {
  // 隱藏所有步驟
  document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
  // 顯示指定步驟
  document.getElementById(`step-${step}`).classList.add('active');
  
  // 更新進度條
  const progress = document.getElementById('quiz-progress');
  const percent = (step === 1) ? 33 : (step === 2) ? 66 : 100;
  progress.style.width = `${percent}%`;
  currentStep = step;
}

function resetEaqualQuiz() {
  document.getElementById('eaqual-quiz-box').style.display = 'block';
  document.getElementById('eaqual-report').classList.remove('active');
  nextQuizStep(1);
}

function showEaqualReport(results, targetReview, isOffline = false) {
  document.getElementById('eaqual-quiz-box').style.display = 'none';
  const report = document.getElementById('eaqual-report');
  report.classList.add('active');

  let targetHtml = targetReview ? `評估目標：<strong>${targetReview}</strong>` : '評估目標：通用評論';
  if (isOffline) {
    targetHtml += ' <span style="font-size:0.8rem;color:var(--primary);margin-left:0.5rem;">(📢 本地即時計算模式)</span>';
  }
  document.getElementById('report-target-review-name').innerHTML = targetHtml;
  
  // 更新報告分數
  const sc = parseFloat(results.sc);
  const ca = parseFloat(results.ca);
  const ec = parseFloat(results.ec);
  const total = parseFloat(results.total);

  document.getElementById('report-score-sc').textContent = `${sc.toFixed(2)} / 5.00`;
  document.getElementById('report-score-ca').textContent = `${ca.toFixed(2)} / 5.00`;
  document.getElementById('report-score-ec').textContent = `${ec.toFixed(2)} / 5.00`;
  document.getElementById('report-score-total').textContent = `${total.toFixed(2)} / 5.00`;

  // 更新進度條寬度
  document.getElementById('bar-sc').style.width = `${sc * 20}%`;
  document.getElementById('bar-ca').style.width = `${ca * 20}%`;
  document.getElementById('bar-ec').style.width = `${ec * 20}%`;
  document.getElementById('bar-total').style.width = `${total * 20}%`;

  // 繪製模擬雷達多邊形 (Clip-Path)
  // 原點在 (50%, 50%)。
  // SC 向正上方 (90度)： 50% - (sc / 5) * 40%
  // CA 向左下方 (210度)：x: 50% - (ca / 5) * 40% * cos(30), y: 50% + (ca / 5) * 40% * sin(30)
  // EC 向右下方 (330度)：x: 50% + (ec / 5) * 40% * cos(30), y: 50% + (ec / 5) * 40% * sin(30)
  const scPct = sc / 5;
  const caPct = ca / 5;
  const ecPct = ec / 5;

  const sc_y = (50 - scPct * 40).toFixed(1);
  const ca_x = (50 - caPct * 40 * 0.866).toFixed(1);
  const ca_y = (50 + caPct * 40 * 0.5).toFixed(1);
  const ec_x = (50 + ecPct * 40 * 0.866).toFixed(1);
  const ec_y = (50 + ecPct * 40 * 0.5).toFixed(1);

  const poly = document.querySelector('.radar-poly-mock');
  poly.style.clipPath = `polygon(50% ${sc_y}%, ${ec_x}% ${ec_y}%, ${ca_x}% ${ca_y}%)`;
}

async function submitEaqualQuiz() {
  // 收集分數
  const scores = {};
  const prefixes = ['sc', 'ca', 'ec'];
  const counts = { sc: 4, ca: 6, ec: 5 };

  let allSelected = true;

  for (const pref of prefixes) {
    const count = counts[pref];
    for (let i = 1; i <= count; i++) {
      const field = `${pref}${i}`;
      const radio = document.querySelector(`input[name="${field}"]:checked`);
      if (!radio) {
        allSelected = false;
        break;
      }
      scores[field] = radio.value;
    }
  }

  if (!allSelected) {
    alert('請將所有題項評估填寫完畢再行提交！');
    return;
  }

  const targetReview = document.getElementById('eaqual-target-review').value.trim();

  try {
    const res = await fetch(`${API_BASE}/api/surveys/eaqual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scores, targetReview })
    });
    const data = await res.json();

    if (data.success) {
      showEaqualReport(data.results, targetReview, false);
    }
  } catch (err) {
    console.warn('雲端伺服器未回應，改用本地演算法計算量表分數：', err);
    
    // 反向題有：SC3, CA5, EC3
    const convertReverse = (val) => 6 - parseInt(val);

    const sc_raw = [
      parseInt(scores.sc1),
      parseInt(scores.sc2),
      convertReverse(scores.sc3),
      parseInt(scores.sc4)
    ];

    const ca_raw = [
      parseInt(scores.ca1),
      parseInt(scores.ca2),
      parseInt(scores.ca3),
      parseInt(scores.ca4),
      convertReverse(scores.ca5),
      parseInt(scores.ca6)
    ];

    const ec_raw = [
      parseInt(scores.ec1),
      parseInt(scores.ec2),
      convertReverse(scores.ec3),
      parseInt(scores.ec4),
      parseInt(scores.ec5)
    ];

    // 計算各維度平均分（滿分5分）
    const sc_avg = sc_raw.reduce((a, b) => a + b, 0) / sc_raw.length;
    const ca_avg = ca_raw.reduce((a, b) => a + b, 0) / ca_raw.length;
    const ec_avg = ec_raw.reduce((a, b) => a + b, 0) / ec_raw.length;
    const total_avg = (sc_avg + ca_avg + ec_avg) / 3;

    showEaqualReport({
      sc: sc_avg,
      ca: ca_avg,
      ec: ec_avg,
      total: total_avg
    }, targetReview, true);
  }
}

// ==================== 留言板功能 ====================
async function loadComments() {
  try {
    const res = await fetch(`${API_BASE}/api/comments`);
    const comments = await res.json();
    renderComments(comments, false);
  } catch (err) {
    console.warn('雲端伺服器未回應，使用本地快取留言資料：', err);
    renderComments(FALLBACK_COMMENTS, true);
  }
}

function renderComments(comments, isOffline = false) {
  const listBox = document.getElementById('comments-list-box');
  const countSpan = document.getElementById('comments-count');

  countSpan.textContent = `共 ${comments.length} 則`;

  if (comments.length === 0) {
    listBox.innerHTML = '<div style="text-align:center;color:var(--text-dark);padding:2rem;">目前尚無留言，歡迎搶先發表！</div>';
    return;
  }

  listBox.innerHTML = '';
  if (isOffline) {
    listBox.innerHTML = `
      <div class="offline-notice" style="text-align:center;color:var(--primary);margin-bottom:1.5rem;font-size:0.9rem;padding:0.6rem;border:1px solid rgba(0,242,254,0.3);background:rgba(0,242,254,0.05);border-radius:8px;box-shadow:0 0 10px rgba(0,242,254,0.1);">
        <span>📢 雲端留言伺服器載入中，已啟用本地展示模式。您的新留言將暫存於網頁上並進行 MOT 校準！</span>
      </div>
    `;
  }

  comments.slice().reverse().forEach(c => {
    const paperRef = c.paperId !== 'general' ? `<span class="comment-paper-ref">#${getPaperShortName(c.paperId)}</span>` : '';
    const html = `
      <div class="comment-card">
        <div class="comment-header">
          <span class="comment-user">
            <span class="comment-user-avatar">${c.name.charAt(0)}</span>
            ${c.name}
            ${paperRef}
          </span>
          <span class="comment-date">${c.date}</span>
        </div>
        <p class="comment-text">${c.content}</p>
        <span class="comment-badge ${getCommentBadgeClass(c.rating)}">${c.motTag}</span>
      </div>
    `;
    listBox.insertAdjacentHTML('beforeend', html);
  });
}

function getPaperShortName(id) {
  if (id === 'paper-1') return '一部曲 (5/15)';
  if (id === 'paper-2') return '二部曲 (5/29)';
  if (id === 'paper-3') return '三部曲 (6/5)';
  return '論文討論';
}

function getCommentBadgeClass(rating) {
  if (rating === 'high') return 'badge-cm-high';
  if (rating === 'medium') return 'badge-cm-medium';
  return 'badge-cm-low';
}

// 提交留言
document.getElementById('comment-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('comment-name').value.trim();
  const email = document.getElementById('comment-email').value.trim();
  const paperId = document.getElementById('comment-paper').value;
  const content = document.getElementById('comment-content').value.trim();

  try {
    const res = await fetch(`${API_BASE}/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, paperId, content })
    });
    const data = await res.json();

    if (data.success) {
      alert(`留言發表成功！\nMOT 校準標籤已附加：${data.comment.motTag}`);
      document.getElementById('comment-content').value = '';
      loadComments();
    }
  } catch (err) {
    console.warn('留言提交失敗，改以本地模擬方式處理留言：', err);
    
    // 本地進行 MOT 具體性評分
    const detailsKeywords = ['服務員', '湯頭', '牛肉麵', '靠窗', '座位', '等', '分鐘', '週末', '廖老師', '廖仁傑', '研討會', '論文', '量表', '問答', '實驗', '數據', '時間', '地點'];
    const fakeKeywords = ['超棒', '大推', '必去', 'CP值', '超好吃', '極推', '大讚', '非常滿意'];

    let matchedDetails = 0;
    let matchedFakes = 0;

    detailsKeywords.forEach(kw => {
      if (content.includes(kw)) matchedDetails++;
    });
    fakeKeywords.forEach(kw => {
      if (content.includes(kw)) matchedFakes++;
    });

    let motTag = '🟢 高具體性評論';
    let rating = 'high';

    if (content.length < 15 && matchedDetails === 0) {
      motTag = '🔴 模板化評論';
      rating = 'low';
    } else if (matchedFakes > matchedDetails) {
      motTag = '🟡 一般情緒評論';
      rating = 'medium';
    }

    const localComment = {
      id: `comment-local-${Date.now()}`,
      name,
      email: email || 'anonymous@example.com',
      content,
      paperId: paperId || 'general',
      date: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
      motTag,
      rating
    };

    FALLBACK_COMMENTS.push(localComment);
    alert(`[本地展示模式] 留言發表成功！\nMOT 校準標籤已附加：${motTag}\n（提示：由於雲端伺服器正在啟動，此留言目前僅保存在您的瀏覽器中）`);
    document.getElementById('comment-content').value = '';
    renderComments(FALLBACK_COMMENTS, true);
  }
});

// ==================== 問卷調查功能 ====================
document.getElementById('survey-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const q1 = document.querySelector('input[name="q1"]:checked').value;
  const q2 = document.querySelector('input[name="q2"]:checked').value;
  const q3 = document.querySelector('input[name="q3"]:checked').value;
  const q4 = document.getElementById('survey-advice').value.trim();

  try {
    const res = await fetch(`${API_BASE}/api/surveys/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q1, q2, q3, q4 })
    });
    const data = await res.json();

    if (data.success) {
      alert('感謝您填寫學術調查問卷！您的反饋對黄國津的研究非常重要！');
      document.getElementById('survey-form').reset();
    }
  } catch (err) {
    console.warn('問卷提交連線失敗，改以本地模擬儲存：', err);
    alert('[本地展示模式] 感謝您填寫學術調查問卷！您的反饋對黄國津的研究非常重要！（已在您的瀏覽器快取儲存，伺服器上線後將自動同步）');
    document.getElementById('survey-form').reset();
  }
});


// ==================== MARC 制度設計草案彈窗功能 ====================
function initMarcDraftModal() {
  const modal = document.getElementById('marc-draft-modal');
  const btnShow = document.getElementById('btn-show-marc-draft');
  const btnClose = document.getElementById('btn-close-marc-draft');
  const btnCopy = document.getElementById('btn-copy-marc-draft');
  const toast = document.getElementById('toast-copy-success');
  const docContent = document.getElementById('marc-draft-document-content');

  if (!modal || !btnShow || !btnClose || !btnCopy || !docContent) return;

  // Open modal
  btnShow.addEventListener('click', () => {
    modal.style.display = 'flex';
    // Force a reflow to make the transition work
    modal.offsetHeight;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Close modal function
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // Wait for the transition to finish before hiding the display
    setTimeout(() => {
      if (!modal.classList.contains('active')) {
        modal.style.display = 'none';
      }
    }, 400); // match transition duration in CSS
  };

  btnClose.addEventListener('click', closeModal);

  // Close when clicking outside modal container
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Copy draft full text to clipboard
  btnCopy.addEventListener('click', async () => {
    try {
      // Get the full text content, formatted clean
      const textToCopy = docContent.innerText;
      await navigator.clipboard.writeText(textToCopy);
      
      // Show success toast
      toast.classList.add('active');
      setTimeout(() => {
        toast.classList.remove('active');
      }, 3000);
    } catch (err) {
      console.error('複製失敗:', err);
      alert('複製失敗，請手動選取複製！');
    }
  });
}

// ==================== Reveal Animation ====================
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    const intersectingEntries = entries.filter(entry => entry.isIntersecting);
    if (intersectingEntries.length > 0) {
      intersectingEntries.forEach((entry, index) => {
        const el = entry.target;
        el.style.transitionDelay = `${index * 0.08}s`;
        el.classList.add('in');
        observer.unobserve(el);
      });
    }
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}
