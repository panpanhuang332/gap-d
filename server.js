const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors()); // 允許跨來源請求以支援 GitHub Pages 串接
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = 'admin123'; // 預設管理員密碼

// 中介軟體設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'docs')));
// 6/5 北科大論文保護：在靜態資料夾開放前攔截下載請求
app.get('/uploads/mock_paper_3.pdf', (req, res) => {
  res.status(403).send('<h1>403 Forbidden</h1><p>該論文（EAQUAL-15）尚未正式發表，暫不開放下載。請待 6/5 發表後再行存取。</p>');
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 確保必要的資料夾存在
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// 檔案路徑定義
const PAPERS_FILE = path.join(DATA_DIR, 'papers.json');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');
const SURVEYS_FILE = path.join(DATA_DIR, 'surveys.json');

// 初始化資料庫檔案（若不存在則寫入預設資料）
const initJsonFile = (filePath, defaultData) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
  }
};

// 預載論文資料（學術三部曲）
const defaultPapers = [
  {
    id: "paper-1",
    title: "數位假評的期望扭曲效應：基於 MOT 理論的服務品質缺口研究",
    englishTitle: "The Expectation Distortion Effect of Fake Online Reviews: A Service Quality Gap Study Based on MOT Theory",
    author: "黄國津（建國科技大學）",
    conference: "台北商業大學研討會",
    date: "2026-05-15",
    status: "已發表於 5/15",
    abstract: "本研究探討數位假評（Fake Reviews）對消費者服務期望與品質感知之影響機制。依據 PZB 服務品質缺口模型（Parasuraman et al., 1985），本研究提出「Gap D（數位資訊污染缺口）」：Gap D = E_polluted − E_authentic，具方向性——正向假評造成上行扭曲（Gap D > 0，E↑，Gap 5 擴大，消費者失落）；負向假評造成下行扭曲（Gap D < 0，E↓，Gap 5 縮小，品牌遭系統性低估）。此雙向扭曲機制，本研究正式命名為「期望扭曲悖論（Expectation Distortion Paradox, EDP）」。援引 Carlzon（1987）MOT 理論，本研究提出三項評論真實性指標：具體性分數（SS）、模板相似度（TS）及情感細粒度（SG），整合為整體評分，開發「MOT Calibrator」工具原型，協助消費者在 ZMOT 階段主動校準期望。理論貢獻在於：首次系統性建構雙向 Gap D 框架，並將假評研究從技術偵測視角拓展至服務管理的期望品質保護視角。",
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
    status: "將於 5/29 發表",
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
    status: "將於 6/5 發表",
    abstract: "數位假評在消費者形成消費期望之前即可能污染其資訊基礎，使PZB服務品質缺口模型中「期望（E）」之形成過程暴露於系統性扭曲。然而SERVQUAL之22題量表聚焦於服務接觸後之P−E差距，較少處理期望形成階段所接觸資訊之真實性品質。為回應此測量缺口，本研究提出EAQUAL（Expectation Authenticity Quality Scale，期望真實性品質量表）作為一套針對「期望形成真實性」之初步量表原型（preliminary prototype scale）。本研究將量表收斂為三個核心構面：來源可信度（SC，4題）、內容真實性（CA，6題）、體驗一致性（EC，5題），共15題，採Likert五點量表，定位為「形成—驗證雙階段」感知量表。本文之理論貢獻在於提出針對期望污染缺口（Gap D）之消費者端測量工具雛形，並區隔於既有eWOM credibility與information quality研究。後續研究將進一步進行信度、收斂效度、區別效度與預測效度之實證驗證，並提出MACS（MOT Authenticity Certification System）作為平台端應用延伸，共同建構期望誠實管理（EHM）之操作框架。",
    keywords: ["EAQUAL", "期望真實性", "假評", "服務品質量表", "Gap D", "MACS", "期望誠實管理"],
    fileName: "mock_paper_3.pdf"
  }
];

initJsonFile(PAPERS_FILE, defaultPapers);
initJsonFile(COMMENTS_FILE, []);
initJsonFile(SURVEYS_FILE, { surveyResponses: [], eaqualScores: [] });

// Helper: 讀取 JSON 資料
const readJson = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return [];
  }
};

// Helper: 寫入 JSON 資料
const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Multer 上傳 PDF 設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    // 使用時間戳與隨機數防止衝突
    cb(null, `${Date.now()}-${baseName}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('只支援 PDF 格式檔案上傳！'));
    }
  }
});

// ==================== API 路由 ====================

// 1. 取得論文列表
app.get('/api/papers', (req, res) => {
  const papers = readJson(PAPERS_FILE);
  res.json(papers);
});

// 2. 上傳論文與儲存元數據
app.post('/api/papers/upload', upload.single('pdf'), (req, res) => {
  const { password, title, englishTitle, author, conference, date, status, abstract, keywords } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ success: false, message: '管理員密碼錯誤，拒絕存取！' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: '請上傳論文 PDF 檔案！' });
  }

  const papers = readJson(PAPERS_FILE);
  const newPaper = {
    id: `paper-${Date.now()}`,
    title: title || '未命名論文',
    englishTitle: englishTitle || '',
    author: author || '黃國津',
    conference: conference || '研討會發表',
    date: date || new Date().toISOString().split('T')[0],
    status: status || '新發表',
    abstract: abstract || '無摘要',
    keywords: keywords ? keywords.split(',').map(k => k.trim()) : [],
    fileName: req.file.filename
  };

  papers.push(newPaper);
  writeJson(PAPERS_FILE, papers);

  res.json({ success: true, message: '論文成功上傳！', paper: newPaper });
});

// 3. 取得留言列表
app.get('/api/comments', (req, res) => {
  const comments = readJson(COMMENTS_FILE);
  res.json(comments);
});

// 4. 新增留言（後端自動計算並附加簡化版 MOT 標籤）
app.post('/api/comments', (req, res) => {
  const { name, email, content, paperId } = req.body;

  if (!name || !content) {
    return res.status(400).json({ success: false, message: '姓名與內容為必填欄位！' });
  }

  const comments = readJson(COMMENTS_FILE);

  // 在後端進行一個簡易的「MOT 具體性評分」
  // 建立簡化關鍵字庫以偵測真實度
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

  // 計算等級
  let motTag = '🟢 高具體性評論';
  let rating = 'high';

  if (content.length < 15 && matchedDetails === 0) {
    motTag = '🔴 模板化評論';
    rating = 'low';
  } else if (matchedFakes > matchedDetails) {
    motTag = '🟡 一般情緒評論';
    rating = 'medium';
  }

  const newComment = {
    id: `comment-${Date.now()}`,
    name,
    email: email || 'anonymous@example.com',
    content,
    paperId: paperId || 'general',
    date: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
    motTag,
    rating
  };

  comments.push(newComment);
  writeJson(COMMENTS_FILE, comments);

  res.json({ success: true, message: '留言成功送出！', comment: newComment });
});

// 5. 提交一般問卷
app.post('/api/surveys/submit', (req, res) => {
  const { q1, q2, q3, q4 } = req.body;
  
  const surveys = readJson(SURVEYS_FILE);
  if (!surveys.surveyResponses) surveys.surveyResponses = [];

  const response = {
    id: `resp-${Date.now()}`,
    q1, // 閱讀評論頻率
    q2, // 期望被假評扭曲經驗
    q3, // 評論真實性信任評分 (1-5)
    q4, // 訪客建議
    date: new Date().toISOString()
  };

  surveys.surveyResponses.push(response);
  writeJson(SURVEYS_FILE, surveys);

  res.json({ success: true, message: '問卷調查提交成功！' });
});

// 6. 提交 EAQUAL-15 量表評估數據
app.post('/api/surveys/eaqual', (req, res) => {
  const { scores, targetReview } = req.body; // scores: { sc1..4, ca1..6, ec1..5 } 均為 1-5 分

  if (!scores) {
    return res.status(400).json({ success: false, message: '未接收到評估分數！' });
  }

  const surveys = readJson(SURVEYS_FILE);
  if (!surveys.eaqualScores) surveys.eaqualScores = [];

  // 計算分數（含反向題計分！）
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
  const sc_avg = (sc_raw.reduce((a, b) => a + b, 0) / sc_raw.length).toFixed(2);
  const ca_avg = (ca_raw.reduce((a, b) => a + b, 0) / ca_raw.length).toFixed(2);
  const ec_avg = (ec_raw.reduce((a, b) => a + b, 0) / ec_raw.length).toFixed(2);
  const total_avg = ((parseFloat(sc_avg) + parseFloat(ca_avg) + parseFloat(ec_avg)) / 3).toFixed(2);

  const entry = {
    id: `eaqual-${Date.now()}`,
    scores,
    targetReview: targetReview || '未提供評論內容',
    sc: parseFloat(sc_avg),
    ca: parseFloat(ca_avg),
    ec: parseFloat(ec_avg),
    total: parseFloat(total_avg),
    date: new Date().toISOString()
  };

  surveys.eaqualScores.push(entry);
  writeJson(SURVEYS_FILE, surveys);

  res.json({
    success: true,
    message: 'EAQUAL-15 量表評估提交成功！',
    results: {
      sc: sc_avg,
      ca: ca_avg,
      ec: ec_avg,
      total: total_avg
    }
  });
});

// 7. 取得所有問卷與 EAQUAL 統計數據（管理後台使用）
app.get('/api/admin/stats', (req, res) => {
  const password = req.query.password;
  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ success: false, message: '密碼錯誤，拒絕存取！' });
  }

  const surveys = readJson(SURVEYS_FILE);
  const comments = readJson(COMMENTS_FILE);

  res.json({
    success: true,
    surveys: surveys.surveyResponses || [],
    eaqual: surveys.eaqualScores || [],
    commentsCount: comments.length
  });
});

// 8. 刪除留言
app.delete('/api/admin/comments/:id', (req, res) => {
  const password = req.body.password;
  const id = req.params.id;

  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ success: false, message: '密碼錯誤，拒絕存取！' });
  }

  let comments = readJson(COMMENTS_FILE);
  const initialLength = comments.length;
  comments = comments.filter(c => c.id !== id);
  writeJson(COMMENTS_FILE, comments);

  if (comments.length === initialLength) {
    return res.status(404).json({ success: false, message: '找不到該筆留言！' });
  }

  res.json({ success: true, message: '留言刪除成功！' });
});

app.listen(PORT, () => {
  console.log(`伺服器正在運行於 http://localhost:${PORT}`);
});
