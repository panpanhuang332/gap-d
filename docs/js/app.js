// ==================== 全域狀態與初始化 ====================
// 若在 GitHub Pages (非 localhost) 上執行，則將請求導向 Render 雲端伺服器；否則使用本機路徑
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? ''
  : 'https://gap-d-backend.onrender.com'; // 部署後請在此處替換為您的 Render 伺服器網址

document.addEventListener('DOMContentLoaded', () => {
  loadPapers();
  loadComments();
  initNavScroll();
  initCalibratorDemos();
});

// 頂部導覽平滑捲動與 active 狀態切換
function initNavScroll() {
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === current) {
        link.classList.add('active');
      }
    });
  });
}

// ==================== 論文載入 ====================
async function loadPapers() {
  const container = document.getElementById('papers-list-container');
  try {
    const res = await fetch(`${API_BASE}/api/papers`);
    const papers = await res.json();

    if (papers.length === 0) {
      container.innerHTML = '<div style="text-align:center;color:var(--text-dark);">目前暫無上傳著作。</div>';
      return;
    }

    container.innerHTML = '';
    papers.forEach(paper => {
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

              <div class="paper-actions">
                ${paper.id === 'paper-3' ? `
                  <button class="btn" disabled style="background: rgba(255, 255, 255, 0.05); color: var(--text-dark); cursor: not-allowed; border: 1px solid var(--border-glass); padding: 0.6rem 1.2rem; display: inline-flex; align-items: center; gap: 0.5rem; border-radius: 8px;">
                    🔒 6/5 發表後公開
                  </button>
                ` : `
                  <a href="${API_BASE}/uploads/${paper.fileName}" class="btn btn-primary" download="${paper.title}.pdf">
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
  } catch (err) {
    console.error('載入論文失敗：', err);
    container.innerHTML = '<div style="text-align:center;color:var(--danger);">載入論文失敗，請檢查網路連線。</div>';
  }
}

function getBadgeClass(status) {
  if (status.includes('已發表')) return 'badge-published';
  if (status.includes('6/5')) return 'badge-taipeitech';
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
      // 顯示報告
      document.getElementById('eaqual-quiz-box').style.display = 'none';
      const report = document.getElementById('eaqual-report');
      report.classList.add('active');

      document.getElementById('report-target-review-name').innerHTML = targetReview ? `評估目標：<strong>${targetReview}</strong>` : '評估目標：通用評論';
      
      // 更新報告分數
      const sc = parseFloat(data.results.sc);
      const ca = parseFloat(data.results.ca);
      const ec = parseFloat(data.results.ec);
      const total = parseFloat(data.results.total);

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
  } catch (err) {
    console.error('提交 EAQUAL 失敗：', err);
    alert('提交評估失敗，請檢查後端連線！');
  }
}

// ==================== 留言板功能 ====================
async function loadComments() {
  const listBox = document.getElementById('comments-list-box');
  const countSpan = document.getElementById('comments-count');

  try {
    const res = await fetch(`${API_BASE}/api/comments`);
    const comments = await res.json();

    countSpan.textContent = `共 ${comments.length} 則`;

    if (comments.length === 0) {
      listBox.innerHTML = '<div style="text-align:center;color:var(--text-dark);padding:2rem;">目前尚無留言，歡迎搶先發表！</div>';
      return;
    }

    listBox.innerHTML = '';
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
  } catch (err) {
    console.error('載入留言失敗：', err);
    listBox.innerHTML = '<div style="text-align:center;color:var(--danger);">載入留言失敗。</div>';
  }
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
    console.error('留言失敗：', err);
    alert('發表留言失敗！');
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
    console.error('問卷提交失敗：', err);
    alert('問卷提交失敗！');
  }
});
