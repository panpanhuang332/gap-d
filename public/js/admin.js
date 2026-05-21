let adminPassword = '';
let chartEaqualInstance = null;
let chartDistortionInstance = null;

// ==================== 登入驗證 ====================
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const passwordInput = document.getElementById('admin-password').value.trim();

  // 驗證密碼（向後端請求統計資料，以驗證密碼是否正確）
  try {
    const res = await fetch(`/api/admin/stats?password=${encodeURIComponent(passwordInput)}`);
    const data = await res.json();

    if (data.success) {
      adminPassword = passwordInput;
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('dashboard-section').style.display = 'grid';
      loadAdminDashboard();
    } else {
      alert('密碼錯誤，拒絕存取！');
    }
  } catch (err) {
    console.error('驗證失敗：', err);
    alert('後端連線異常，請確認伺服器已啟動。');
  }
});

// ==================== 切換面板 ====================
function switchPanel(panelId) {
  // 切換選單 Active 狀態
  document.querySelectorAll('.admin-sidebar a').forEach(a => a.classList.remove('active'));
  document.getElementById(`menu-${panelId}`).classList.add('active');

  // 切換面板顯示
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`panel-${panelId}`).classList.add('active');

  if (panelId === 'stats') {
    loadAdminStats();
  } else if (panelId === 'comments') {
    loadAdminComments();
  }
}

// ==================== 載入後台主面板 ====================
function loadAdminDashboard() {
  loadAdminStats();
  // 設定預設上傳日期為今天
  document.getElementById('paper-date').value = new Date().toISOString().split('T')[0];
}

// ==================== 1. 數據與圖表統計 ====================
async function loadAdminStats() {
  try {
    const res = await fetch(`/api/admin/stats?password=${encodeURIComponent(adminPassword)}`);
    const data = await res.json();

    if (!data.success) return;

    // 取得論文列表計數
    const papersRes = await fetch('/api/papers');
    const papers = await papersRes.json();

    // 更新統計數字
    document.getElementById('stat-papers-count').textContent = papers.length;
    document.getElementById('stat-comments-count').textContent = data.commentsCount;
    document.getElementById('stat-surveys-count').textContent = data.surveys.length + data.eaqual.length;

    // 處理 EAQUAL 平均得分
    let avgSc = 0, avgCa = 0, avgEc = 0, avgTotal = 0;
    if (data.eaqual.length > 0) {
      data.eaqual.forEach(item => {
        avgSc += item.sc;
        avgCa += item.ca;
        avgEc += item.ec;
        avgTotal += item.total;
      });
      avgSc /= data.eaqual.length;
      avgCa /= data.eaqual.length;
      avgEc /= data.eaqual.length;
      avgTotal /= data.eaqual.length;
    }

    renderEaqualChart(avgSc, avgCa, avgEc, avgTotal);

    // 處理問卷扭曲經驗分布 (Q2)
    const q2Counts = {
      '經常發生': 0,
      '偶爾發生': 0,
      '幾乎沒有': 0
    };

    data.surveys.forEach(resp => {
      const q2 = resp.q2 || '';
      if (q2.includes('經常')) q2Counts['經常發生']++;
      else if (q2.includes('偶爾')) q2Counts['偶爾發生']++;
      else if (q2.includes('幾乎沒有')) q2Counts['幾乎沒有']++;
    });

    renderDistortionChart(q2Counts);

  } catch (err) {
    console.error('載入統計數據失敗：', err);
  }
}

// 繪製 EAQUAL 圖表
function renderEaqualChart(sc, ca, ec, total) {
  const ctx = document.getElementById('chart-eaqual').getContext('2d');
  
  if (chartEaqualInstance) {
    chartEaqualInstance.destroy();
  }

  chartEaqualInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['來源可信 (SC)', '內容真實 (CA)', '體驗一致 (EC)', '綜合真實性平均'],
      datasets: [{
        label: '平均得分 (滿分 5.0)',
        data: [sc.toFixed(2), ca.toFixed(2), ec.toFixed(2), total.toFixed(2)],
        backgroundColor: [
          'rgba(59, 130, 246, 0.65)',
          'rgba(6, 182, 212, 0.65)',
          'rgba(168, 85, 247, 0.65)',
          'rgba(236, 72, 153, 0.7)'
        ],
        borderColor: [
          '#3b82f6',
          '#06b6d4',
          '#a855f7',
          '#ec4899'
        ],
        borderWidth: 1.5,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 5,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8' }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// 繪製扭曲經驗 Doughnut 圖
function renderDistortionChart(counts) {
  const ctx = document.getElementById('chart-distortion').getContext('2d');

  if (chartDistortionInstance) {
    chartDistortionInstance.destroy();
  }

  chartDistortionInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['經常發生 (高扭曲)', '偶爾發生', '幾乎沒有'],
      datasets: [{
        data: [counts['經常發生'], counts['偶爾發生'], counts['幾乎沒有']],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(16, 185, 129, 0.7)'
        ],
        borderColor: [
          '#ef4444',
          '#f59e0b',
          '#10b981'
        ],
        borderWidth: 1.5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#94a3b8', font: { size: 11 } }
        }
      }
    }
  });
}

// ==================== 2. 論文上傳處理 ====================
document.getElementById('upload-paper-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = document.getElementById('upload-paper-form');
  const formData = new FormData(form);
  formData.append('password', adminPassword); // 加入密碼驗證

  try {
    const res = await fetch('/api/papers/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();

    if (data.success) {
      alert('論文上傳成功！已成功寫入資料庫與儲存 PDF 檔案。');
      form.reset();
      document.getElementById('paper-date').value = new Date().toISOString().split('T')[0];
    } else {
      alert(`論文上傳失敗：${data.message}`);
    }
  } catch (err) {
    console.error('上傳失敗：', err);
    alert('上傳失敗，請檢查檔案格式與網路狀態！');
  }
});

// ==================== 3. 留言管理 ====================
async function loadAdminComments() {
  const tbody = document.getElementById('admin-comments-tbody');
  
  try {
    const res = await fetch('/api/comments');
    const comments = await res.json();

    if (comments.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">無任何留言記錄</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    comments.slice().reverse().forEach(c => {
      const tr = `
        <tr>
          <td style="font-weight: 600; color: var(--text-main);">${c.name}</td>
          <td>${c.email}</td>
          <td style="max-width: 250px; white-space: normal; word-break: break-all;">${c.content}</td>
          <td><span class="paper-badge badge-upcoming">${getPaperShortName(c.paperId)}</span></td>
          <td><span class="comment-badge ${getCommentBadgeClass(c.rating)}">${c.motTag}</span></td>
          <td>${c.date}</td>
          <td>
            <button class="btn-delete" onclick="deleteComment('${c.id}')">刪除</button>
          </td>
        </tr>
      `;
      tbody.insertAdjacentHTML('beforeend', tr);
    });
  } catch (err) {
    console.error('載入留言審查失敗：', err);
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--danger);">載入留言失敗。</td></tr>';
  }
}

function getPaperShortName(id) {
  if (id === 'paper-1') return '一部曲';
  if (id === 'paper-2') return '二部曲';
  if (id === 'paper-3') return '三部曲';
  return '通用討論';
}

function getCommentBadgeClass(rating) {
  if (rating === 'high') return 'badge-cm-high';
  if (rating === 'medium') return 'badge-cm-medium';
  return 'badge-cm-low';
}

// 刪除留言
async function deleteComment(id) {
  if (!confirm('您確定要刪除這則留言嗎？此動作無法復原！')) return;

  try {
    const res = await fetch(`/api/admin/comments/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: adminPassword })
    });
    const data = await res.json();

    if (data.success) {
      alert('留言刪除成功！');
      loadAdminComments();
    } else {
      alert(`刪除留言失敗：${data.message}`);
    }
  } catch (err) {
    console.error('刪除留言出錯：', err);
    alert('刪除留言失敗，請稍後再試。');
  }
}
