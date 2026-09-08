// إعدادات الاتصال (بدون أي مكتبات خارجية - Zero Dependencies)
const SUPABASE_URL = 'https://okekfsfyydajyfarnzra.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rZWtmc2Z5eWRhanlmYXJuenJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg1MTk1OSwiZXhwIjoyMDcyNDI3OTU5fQ.5RRxb3dLOyq9C1OwB88Sh4qNDJzk2SxD5ZTRGsQUm9U';
const BOT_TOKEN = '8790646726:AAHePtt0efbpwNXydPWOQL1aVLu0nRZrUko';
// ponytail: bot username for bind deep-links. Set to your bot's @handle (no @).
// Deep link works only if the bot handles /start bind_<id> on its side (not in this repo).
const BOT_USERNAME = 'jemo_coBot';

let allApplications = [];
let currentFilter = 'all';
let currentTrack = 'all';
let currentSearch = '';
let sortColumn = 'created_at';
let sortAsc = false;
let autoRefreshTimer = null;
let isAutoRefreshActive = true;
let currentPreviewData = null;

// ── Settings, Pagination & Bulk Selection state ──
let settings = { refresh: 30, defaultFilter: 'all', density: 'comfortable', confirmDestructive: true, resetFilterOnRefresh: true, pinLock: false, adminPin: '2026', soundFeedback: true };
let pageSize = 25;
let currentPage = 1;
let selectedIds = new Set();

let currentViewMode = localStorage.getItem('jemo_view_mode') || (window.innerWidth <= 768 ? 'cards' : 'table');

window.toggleViewMode = function() {
  currentViewMode = (currentViewMode === 'cards') ? 'table' : 'cards';
  localStorage.setItem('jemo_view_mode', currentViewMode);
  updateViewToggleIcon();
  renderTable();
};

function updateViewToggleIcon() {
  const icon = document.getElementById('viewToggleIcon');
  if (!icon) return;
  if (currentViewMode === 'cards') {
    icon.className = 'fa-solid fa-table-list';
  } else {
    icon.className = 'fa-solid fa-table-cells-large';
  }
}

// دالة مبسطة للاتصال بقاعدة البيانات مباشرة عبر REST API
async function dbFetch(method, query = '', body = null) {
  const options = {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/applications${query}`, options);
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  return await res.json();
}

// XSS Protection Helper
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function animateCount(el, target, opts = {}) {
  if (!el) return;
  const format = opts.format || ((v) => Math.round(v).toLocaleString('en-US'));
  const start = parseFloat((el.dataset.val || '0')) || 0;
  const dur = 600;
  const t0 = performance.now();
  // ponytail: setTimeout over rAF so numbers still land in backgrounded/throttled tabs
  function step() {
    const now = performance.now();
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.innerText = format(start + (target - start) * eased);
    if (p < 1) setTimeout(step, 16);
    else el.dataset.val = target;
  }
  setTimeout(step, 16);
}


// Toasts
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '<i class="fa-solid fa-circle-check" style="color:var(--success)"></i>' : '<i class="fa-solid fa-circle-exclamation" style="color:var(--danger)"></i>';
  toast.innerHTML = `${icon} <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Copy text utility
window.copyText = function(text, label = 'الآيدي') {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`تم نسخ ${label}: ${text}`);
  }).catch(() => {
    showToast('تعذر النسخ إلى الحافظة', 'error');
  });
};

// WhatsApp Direct URL helper
window.formatWhatsAppUrl = function(phone, name = 'المشترك') {
  if (!phone) return '';
  let clean = String(phone).replace(/[^0-9]/g, '');
  if (clean.startsWith('07')) clean = '964' + clean.slice(1);
  else if (clean.startsWith('7')) clean = '964' + clean;
  else if (!clean.startsWith('964')) clean = '964' + clean;
  const text = encodeURIComponent(`السلام عليكم أخي/أختي (${name})، بخصوص تسجيلك في مهرجان التخرج الرسمي.`);
  return `https://wa.me/${clean}?text=${text}`;
};

// Data Fetching
let _firstLoad = true;
async function loadApplications(manual = false) {
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) refreshBtn.classList.add('spinning');
  // First load: apply default filter from settings
  if (_firstLoad && settings.defaultFilter && settings.defaultFilter !== 'all') {
    currentFilter = settings.defaultFilter;
  }
  // ponytail: auto-refresh re-applies the default filter but must NOT wipe an
  // admin's active search text — that would hide what they're working on every 30s.
  if (!_firstLoad && manual === false && settings.resetFilterOnRefresh) {
    currentFilter = settings.defaultFilter || 'all';
  }
  try {
    const data = await dbFetch('GET', '?select=*&order=created_at.desc');
    allApplications = data;
    updateStats();
    updateAnalytics();
    updateTrackOptions();
    syncFilterUI();
    renderTable();

    const now = new Date();
    const timeStr = now.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const lastUpdatedEl = document.getElementById('lastUpdated');
    if (lastUpdatedEl) lastUpdatedEl.innerText = `آخر تحديث: ${timeStr}`;

    if (manual) showToast('تم تحديث البيانات بنجاح');
  } catch (error) {
    document.getElementById('tableContainer').innerHTML = `<div class="loader-container"><div style="color:var(--danger); font-weight:bold;"><i class="fa-solid fa-triangle-exclamation"></i> حدث خطأ في الاتصال بالخادم.<br>${escapeHtml(error.message)}</div></div>`;
    console.error(error);
    showToast('فشل تحديث البيانات من الخادم', 'error');
  } finally {
    if (refreshBtn) refreshBtn.classList.remove('spinning');
    _firstLoad = false;
  }
}

function syncFilterUI() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === currentFilter);
  });
}


// Stats & Badge Counts
function updateStats() {
window.setFilter = function(filter, btn) {
  currentFilter = filter;
  currentPage = 1;
  syncFilterUI();
  renderTable();
  if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
};

  const total = allApplications.length;
  const pending = allApplications.filter(a => a.status === 'pending').length;
  const accepted = allApplications.filter(a => a.status === 'accepted').length;
  const rejected = allApplications.filter(a => a.status === 'rejected').length;

  animateCount(document.getElementById('s-total'), total);
  animateCount(document.getElementById('s-pending'), pending);
  animateCount(document.getElementById('s-accepted'), accepted);
  animateCount(document.getElementById('s-rejected'), rejected);

  // Calculate Total Funds (counted for accepted + attended contributions)
  let totalFunds = 0;
  allApplications.forEach(app => {
    if ((app.status === 'accepted' || app.status === 'attended') && app.contribution) {
      const amount = parseInt(String(app.contribution).replace(/[^0-9]/g, ''), 10);
      if (!isNaN(amount)) totalFunds += amount;
    }
  });
  animateCount(document.getElementById('s-funds'), totalFunds);

  // Update filter button badges (instant, they act as counters)
  const countAll = document.getElementById('count-all');
  const countPending = document.getElementById('count-pending');
  const countAccepted = document.getElementById('count-accepted');
  const countRejected = document.getElementById('count-rejected');
  const countNoTg = document.getElementById('count-no_tg');

  if (countAll) countAll.innerText = total;
  if (countPending) countPending.innerText = pending;
  if (countAccepted) countAccepted.innerText = accepted;
  if (countRejected) countRejected.innerText = rejected;
  if (countNoTg) countNoTg.innerText = allApplications.filter(a => !(a.telegram || '').trim()).length;
  const countAttended = document.getElementById('count-attended');
  if (countAttended) countAttended.innerText = allApplications.filter(a => a.status === 'attended').length;
  const countToday = document.getElementById('count-today');
  const countNoPhone = document.getElementById('count-no_phone');
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  if (countToday) countToday.innerText = allApplications.filter(a => new Date(a.created_at || 0).getTime() >= dayAgo).length;
  if (countNoPhone) countNoPhone.innerText = allApplications.filter(a => {
    const p = (a.phone || (a.telegram || '').split('|')[2] || '').toString().trim();
    return !p;
  }).length;
  updateAttendanceTracker();
}
// ── Analytics Panel ──
const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
const setW = (id, pct) => { const el = document.getElementById(id); if (el) el.style.width = pct + '%'; };

function updateAnalytics() {
  const apps = allApplications;
  const total = apps.length;
  const pending = apps.filter(a => a.status === 'pending').length;
  const accepted = apps.filter(a => a.status === 'accepted').length;
  const rejected = apps.filter(a => a.status === 'rejected').length;
  const noTg = apps.filter(a => !(a.telegram || '').trim()).length;

  // Acceptance rate
  const decided = accepted + rejected;
  const rate = decided ? Math.round((accepted / decided) * 100) : 0;
  setTxt('m-accept-rate', rate + '%');
  setTxt('m-accept-sub', `${accepted} مقبول من ${decided}`);

  // Avg contribution (accepted only)
  let sum = 0, cnt = 0;
  apps.forEach(a => {
    if (a.status === 'accepted' && a.contribution) {
      const n = parseInt(String(a.contribution).replace(/[^0-9]/g, ''), 10);
      if (!isNaN(n)) { sum += n; cnt++; }
    }
  });
  const avg = cnt ? Math.round(sum / cnt).toLocaleString('en-US') : 0;
  setTxt('m-avg-contrib', avg);
  setTxt('m-no-tg', noTg);

  // Applications in last 24h
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const today = apps.filter(a => { const t = new Date(a.created_at || 0).getTime(); return t >= dayAgo; }).length;
  setTxt('m-today', today);

  // Status breakdown bars (relative to total)
  const denom = total || 1;
  setW('bar-pending', Math.round(pending / denom * 100));
  setW('bar-accepted', Math.round(accepted / denom * 100));
  setW('bar-rejected', Math.round(rejected / denom * 100));
  setTxt('num-pending', pending);
  setTxt('num-accepted', accepted);
  setTxt('num-rejected', rejected);
}

function updateAttendanceTracker() {
  const tracker = document.getElementById('attendanceTracker');
  if (!tracker) return;

  const totalAcceptedOrAttended = allApplications.filter(a => a.status === 'accepted' || a.status === 'attended').length;
  const attended = allApplications.filter(a => a.status === 'attended').length;
  const pct = totalAcceptedOrAttended ? Math.round((attended / totalAcceptedOrAttended) * 100) : 0;

  const elAttended = document.getElementById('at-attended');
  const elTotal = document.getElementById('at-total');
  const elPercent = document.getElementById('at-percent');
  const elFill = document.getElementById('at-fill');

  if (elAttended) elAttended.innerText = attended;
  if (elTotal) elTotal.innerText = totalAcceptedOrAttended;
  if (elPercent) elPercent.innerText = pct + '%';
  if (elFill) elFill.style.width = pct + '%';
}

window.toggleAnalytics = function() {
  const body = document.getElementById('analyticsBody');
  const chev = document.getElementById('analyticsChevron');
  if (!body) return;
  const hidden = body.style.display === 'none';
  body.style.display = hidden ? '' : 'none';
  if (chev) chev.className = hidden ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down';
};


// Track Filter Options
function updateTrackOptions() {
  const select = document.getElementById('trackFilter');
  if (!select) return;
  const savedValue = select.value || 'all';
  const tracks = new Map();
  allApplications.forEach(app => {
    const t = app.track || 'غير محدد';
    tracks.set(t, (tracks.get(t) || 0) + 1);
  });
  let html = '<option value="all">جميع المسارات (' + allApplications.length + ')</option>';
  tracks.forEach((count, track) => {
    const selected = track === savedValue ? 'selected' : '';
    html += `<option value="${escapeHtml(track)}" ${selected}>${escapeHtml(track)} (${count})</option>`;
  });
  select.innerHTML = html;
}

window.handleTrackChange = function(track) {
  currentTrack = track;
  currentPage = 1;
  renderTable();
};

window.handleSearch = function() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  currentSearch = input.value.trim().toLowerCase();
  currentPage = 1;
  
  if (clearBtn) {
    clearBtn.style.display = currentSearch ? 'block' : 'none';
  }
  renderTable();
};

window.clearSearch = function() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  input.value = '';
  currentSearch = '';
  currentPage = 1;
  if (clearBtn) clearBtn.style.display = 'none';
  renderTable();
  input.focus();
};


// Sorting handler
window.handleSort = function(column) {
  if (sortColumn === column) {
    sortAsc = !sortAsc;
  } else {
    sortColumn = column;
    sortAsc = true;
  }
  renderTable();
};

// Rendering Table
function renderTable() {
  const container = document.getElementById('tableContainer');
  
  // Filter
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  let filtered = allApplications.filter(app => {
    let matchesFilter = currentFilter === 'all' || app.status === currentFilter;
    if (currentFilter === 'no_telegram') matchesFilter = !(app.telegram || '').trim();
    else if (currentFilter === 'no_phone') {
      const p = (app.phone || (app.telegram || '').split('|')[2] || '').toString().trim();
      matchesFilter = !p;
    }
    else if (currentFilter === 'today') matchesFilter = new Date(app.created_at || 0).getTime() >= dayAgo;
    const matchesTrack = currentTrack === 'all' || app.track === currentTrack;
    const fullName = (app.full_name || '').toLowerCase();
    const tel = (app.telegram || '').toLowerCase();
    const track = (app.track || '').toLowerCase();
    const contribution = (app.contribution || '').toLowerCase();
    const appId = String(app.id || '').toLowerCase();
    const phone = (app.phone || '').toString().toLowerCase();
    
    const matchesSearch = !currentSearch || 
      fullName.includes(currentSearch) || 
      tel.includes(currentSearch) ||
      track.includes(currentSearch) ||
      appId.includes(currentSearch) ||
      phone.includes(currentSearch);
      
    return matchesFilter && matchesTrack && matchesSearch;
  });

  // Cache filtered set for bulk ops + selection
  window.__filteredCache = filtered;

  // Update Results Counter
  const resultsCountEl = document.getElementById('resultsCount');
  if (resultsCountEl) {
    resultsCountEl.innerText = `عرض ${filtered.length} من أصل ${allApplications.length} طلب`;
  }

  // Sort
  filtered.sort((a, b) => {
    let valA = a[sortColumn];
    let valB = b[sortColumn];

    if (sortColumn === 'contribution') {
      valA = parseInt(String(valA || '').replace(/[^0-9]/g, ''), 10) || 0;
      valB = parseInt(String(valB || '').replace(/[^0-9]/g, ''), 10) || 0;
    } else if (sortColumn === 'created_at') {
      valA = new Date(valA || 0).getTime();
      valB = new Date(valB || 0).getTime();
    } else {
      valA = String(valA || '').toLowerCase();
      valB = String(valB || '').toLowerCase();
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  // Page slicing
  const total = filtered.length;
  const pages = totalPages(total);
  if (currentPage > pages) currentPage = pages;
  if (currentPage < 1) currentPage = 1;
  let pageRows = filtered;
  if (pageSize > 0) {
    const start = (currentPage - 1) * pageSize;
    pageRows = filtered.slice(start, start + pageSize);
  }

  if (currentViewMode === 'cards') {
    if (pageRows.length === 0) {
      const empty = allApplications.length === 0
        ? { icon: 'fa-inbox', title: 'لا توجد طلبات مسجلة بعد', sub: 'ستظهر الطلبات هنا فور ورودها.' }
        : { icon: 'fa-magnifying-glass', title: 'لا توجد نتائج مطابقة', sub: 'جرّب تعديل كلمات البحث أو الفلاتر.' };
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i class="fa-solid ${empty.icon}"></i></div>
          <div class="empty-title">${empty.title}</div>
          <div class="empty-sub">${empty.sub}</div>
        </div>
      `;
      renderPagination(total);
      updateBulkBar();
      updateViewToggleIcon();
      return;
    }

    let cardsHtml = '<div class="mobile-cards-container">';
    pageRows.forEach((app, index) => {
      const rawName = (app.full_name || '').trim();
      const isDraft = rawName.toUpperCase() === 'DRAFT_USER';
      const safeName = escapeHtml(isDraft ? 'مسودة' : (rawName || 'بدون اسم'));
      const safeTrack = escapeHtml(app.track || '-');
      const safeContrib = escapeHtml(app.contribution || '-');
      const initial = (isDraft ? '؟' : (rawName || '؟')).trim().charAt(0);
      const date = new Date(app.created_at).toLocaleDateString('ar-IQ', {
        year: 'numeric', month: 'short', day: 'numeric'
      });

      const telRaw = app.telegram || '';
      const telParts = telRaw.includes('|') ? telRaw.split('|') : [telRaw, ''];
      const numericChatId = telParts[0] || '';
      const username = telParts[1] || '';
      const phoneRaw = (app.phone || telParts[2] || '').toString().trim();
      const waUrl = phoneRaw ? formatWhatsAppUrl(phoneRaw, safeName) : '';

      let telegramDisplay = '-';
      if (username) {
        telegramDisplay = `<a href="https://t.me/${escapeHtml(username.replace(/^@/, ''))}" target="_blank" rel="noopener" class="tg-link"><i class="fa-brands fa-telegram"></i> @${escapeHtml(username.replace(/^@/, ''))}</a>`;
      } else if (numericChatId) {
        telegramDisplay = `<span class="chat-id-tag" onclick="copyText('${escapeHtml(numericChatId)}')"><i class="fa-solid fa-id-badge"></i> ID: ${escapeHtml(numericChatId)}</span>`;
      }

      const phoneDisplay = phoneRaw
        ? `<div style="display:inline-flex; align-items:center; gap:5px;">
             <a href="tel:${escapeHtml(phoneRaw.replace(/[^0-9+]/g, ''))}" class="tg-link" dir="ltr" style="font-family:monospace;"><i class="fa-solid fa-phone" style="color:var(--success);"></i> ${escapeHtml(phoneRaw)}</a>
             ${waUrl ? `<a href="${waUrl}" target="_blank" rel="noopener" class="btn-wa-sm" title="مراسلة عبر واتساب"><i class="fa-brands fa-whatsapp"></i></a>` : ''}
           </div>`
        : '-';

      cardsHtml += `
        <div class="applicant-card">
          <div class="card-top">
            <div class="cell-avatar" onclick="openDetailsModal('${escapeHtml(app.id)}')" title="عرض الملف الشامل">
              <span class="avatar">${initial}</span>
              <div>
                <div class="user-name">${safeName}</div>
                <div class="card-date">${date}</div>
              </div>
            </div>
            <span class="status-badge status-${escapeHtml(app.status)}">${getStatusText(app.status)}</span>
          </div>
          <div class="card-details-grid">
            <div class="card-field">
              <span class="field-title">المسار:</span>
              <span class="track-badge">${safeTrack}</span>
            </div>
            <div class="card-field">
              <span class="field-title">المساهمة:</span>
              <span class="contrib-badge">${safeContrib}</span>
            </div>
            <div class="card-field">
              <span class="field-title">تيليجرام:</span>
              <span>${telegramDisplay}</span>
            </div>
            <div class="card-field">
              <span class="field-title">الهاتف:</span>
              <span>${phoneDisplay}</span>
            </div>
          </div>
          <div class="card-actions">
            <button class="action-btn btn-preview" onclick="previewTicket('${app.id}')"><i class="fa-solid fa-eye"></i> معاينة</button>
            <button class="action-btn" style="background:#6366f1;" onclick="openDetailsModal('${app.id}')" title="عرض الملف"><i class="fa-solid fa-id-card"></i> ملف</button>
            <button class="action-btn btn-message" onclick="openPrivateMsgModal('${app.id}')"><i class="fa-solid fa-paper-plane"></i> رسالة</button>
            <button class="action-btn btn-edit" onclick="openEditModal('${app.id}')"><i class="fa-solid fa-pen"></i></button>
            ${app.status === 'pending' ? `
              <button class="action-btn btn-success" onclick="acceptApplication('${app.id}')"><i class="fa-solid fa-check"></i> قبول</button>
              <button class="action-btn btn-danger" onclick="rejectApplication('${app.id}')"><i class="fa-solid fa-xmark"></i> رفض</button>
            ` : `
              ${app.status === 'accepted' ? `
                <button class="action-btn btn-checkin" onclick="checkinStudent('${app.id}')" title="تسجيل حضور"><i class="fa-solid fa-user-check"></i> حضور</button>
              ` : (app.status === 'attended' ? `
                <button class="action-btn btn-undo-checkin" onclick="uncheckinStudent('${app.id}')" title="إلغاء الحضور"><i class="fa-solid fa-user-xmark"></i> إلغاء</button>
              ` : '')}
              <button class="action-btn btn-secondary" onclick="resetApplication('${app.id}')"><i class="fa-solid fa-rotate-left"></i> تراجع</button>
            `}
            <button class="action-btn btn-danger btn-delete" onclick="deleteApplication('${app.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `;
    });
    cardsHtml += '</div>';
    container.innerHTML = cardsHtml;
    renderPagination(total);
    updateBulkBar();
    updateViewToggleIcon();
    return;
  }
  const getSortClass = (col) => sortColumn === col ? 'active-sort' : '';
  const getSortIcon = (col) => {
    if (sortColumn !== col) return '<i class="fa-solid fa-sort sort-icon"></i>';
    return sortAsc ? '<i class="fa-solid fa-sort-up sort-icon"></i>' : '<i class="fa-solid fa-sort-down sort-icon"></i>';
  };

  const allChecked = pageRows.length > 0 && pageRows.every(a => selectedIds.has(String(a.id)));

  let html = `<table>
    <thead>
      <tr>
        <th class="col-check"><input type="checkbox" class="row-check" ${allChecked ? 'checked' : ''} onchange="toggleSelectAll(this.checked)"></th>
        <th class="sortable ${getSortClass('created_at')}" onclick="handleSort('created_at')">التاريخ ${getSortIcon('created_at')}</th>
        <th class="sortable ${getSortClass('full_name')}" onclick="handleSort('full_name')">الاسم الرباعي ${getSortIcon('full_name')}</th>
        <th class="sortable ${getSortClass('track')}" onclick="handleSort('track')">المسار ${getSortIcon('track')}</th>
        <th class="sortable ${getSortClass('contribution')}" onclick="handleSort('contribution')">المساهمة ${getSortIcon('contribution')}</th>
        <th>تيليجرام</th>
        <th class="sortable ${getSortClass('phone')}" onclick="handleSort('phone')">الهاتف ${getSortIcon('phone')}</th>
        <th class="sortable ${getSortClass('status')}" onclick="handleSort('status')">الحالة ${getSortIcon('status')}</th>
        <th style="text-align:center;">الإجراءات والبطاقة</th>
      </tr>
    </thead>
    <tbody>`;


  pageRows.forEach((app, index) => {
    const delay = Math.min(index * 0.03, 0.4);
    const date = new Date(app.created_at).toLocaleDateString('ar-IQ', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
    const rawName = (app.full_name || '').trim();
    const isDraft = rawName.toUpperCase() === 'DRAFT_USER';
    const safeName = escapeHtml(isDraft ? 'مسودة' : (rawName || 'بدون اسم'));
    const safeTrack = escapeHtml(app.track || '-');
    const safeContrib = escapeHtml(app.contribution || '-');
    const initial = (isDraft ? '؟' : (rawName || '؟')).trim().charAt(0);
    const checked = selectedIds.has(String(app.id)) ? 'checked' : '';

    const telRaw = app.telegram || '';
    const telParts = telRaw.includes('|') ? telRaw.split('|') : [telRaw, ''];
    const numericChatId = telParts[0] || '';
    const username = telParts[1] || '';
    const phoneRaw = (app.phone || telParts[2] || '').toString().trim();
    const waUrl = phoneRaw ? formatWhatsAppUrl(phoneRaw, safeName) : '';
    const phoneDisplay = phoneRaw
      ? `<div style="display:inline-flex; align-items:center; gap:5px;">
           <a href="tel:${escapeHtml(phoneRaw.replace(/[^0-9+]/g, ''))}" class="tg-link" dir="ltr" style="font-family:monospace;"><i class="fa-solid fa-phone" style="color:var(--success);"></i> ${escapeHtml(phoneRaw)}</a>
           ${waUrl ? `<a href="${waUrl}" target="_blank" rel="noopener" class="btn-wa-sm" title="مراسلة عبر واتساب"><i class="fa-brands fa-whatsapp"></i></a>` : ''}
         </div>`
      : '-';
    let telegramDisplay = '-';
    if (username) {
      const cleanUsername = username.replace(/^@/, '');
      telegramDisplay = `
        <div style="display:flex; flex-direction:column; gap:2px;">
          <a href="https://t.me/${escapeHtml(cleanUsername)}" target="_blank" rel="noopener" class="tg-link">
            <i class="fa-brands fa-telegram"></i> @${escapeHtml(cleanUsername)}
          </a>
          ${numericChatId ? `<span class="chat-id-tag" onclick="copyText('${escapeHtml(numericChatId)}')"><i class="fa-regular fa-copy"></i> ${escapeHtml(numericChatId)}</span>` : ''}
        </div>
      `;
    } else if (numericChatId) {
      telegramDisplay = `
        <span class="chat-id-tag" onclick="copyText('${escapeHtml(numericChatId)}')">
          <i class="fa-solid fa-id-badge"></i> ID: ${escapeHtml(numericChatId)}
        </span>
      `;
    }


    html += `<tr style="animation-delay: ${delay}s">
        <td class="col-check"><input type="checkbox" class="row-check" ${checked} onchange="toggleRow('${escapeHtml(app.id)}', this.checked)"></td>
        <td class="col-date">${date}</td>
        <td class="col-name">
          <div class="cell-avatar" onclick="openDetailsModal('${escapeHtml(app.id)}')" title="عرض الملف الشامل">
            <span class="avatar">${initial}</span>
            <span class="user-name">${safeName}</span>
          </div>
        </td>
        <td class="col-track"><span class="track-badge">${safeTrack}</span></td>
        <td class="col-contrib"><span class="contrib-badge">${safeContrib}</span></td>
        <td dir="ltr" class="col-telegram">${telegramDisplay}</td>
        <td dir="ltr" class="col-phone">${phoneDisplay}</td>
        <td class="col-status"><span class="status-badge status-${escapeHtml(app.status)}">${getStatusText(app.status)}</span></td>
        <td class="col-actions">
          <div class="action-group">
            <button class="action-btn btn-preview" onclick="previewTicket('${app.id}')" title="معاينة البطاقة">
              <i class="fa-solid fa-eye"></i> معاينة
            </button>
            <button class="action-btn" style="background:#6366f1;" onclick="openDetailsModal('${app.id}')" title="عرض الملف الشامل للمشترك">
              <i class="fa-solid fa-id-card"></i>
            </button>
            <button class="action-btn btn-message" onclick="openPrivateMsgModal('${app.id}')" title="إرسال رسالة خاصة">
              <i class="fa-solid fa-paper-plane"></i> رسالة
            </button>
            <button class="action-btn btn-edit" onclick="openEditModal('${app.id}')" title="تعديل بيانات المشترك">
              <i class="fa-solid fa-pen"></i>
            </button>
            ${!telRaw ? `
              <button class="action-btn btn-bind" onclick="copyBindLink('${app.id}')" title="نسخ رابط الربط بالبوت">
                <i class="fa-solid fa-link"></i>
              </button>
            ` : ``}
            ${app.status === 'pending' ? `
              <button id="btn-acc-${app.id}" class="action-btn btn-success" onclick="acceptApplication('${app.id}')" title="قبول">
                <i class="fa-solid fa-check"></i>
              </button>
              <button id="btn-rej-${app.id}" class="action-btn btn-danger" onclick="rejectApplication('${app.id}')" title="رفض">
                <i class="fa-solid fa-xmark"></i>
              </button>
            ` : `
              ${app.status === 'accepted' ? `
                <button id="btn-snd-${app.id}" class="action-btn btn-success" onclick="resendApprovalNotification('${app.id}')" title="إرسال إشعار القبول والبطاقة للمشترك">
                  <i class="fa-solid fa-paper-plane"></i> إرسال القبول
                </button>
              ` : (app.status === 'attended' ? `
                <button class="action-btn btn-undo-checkin" onclick="uncheckinStudent('${app.id}')" title="إلغاء الحضور"><i class="fa-solid fa-user-xmark"></i></button>
              ` : '')}
              ${app.status === 'accepted' ? `
                <button class="action-btn btn-checkin" onclick="checkinStudent('${app.id}')" title="تسجيل الحضور"><i class="fa-solid fa-user-check"></i></button>
              ` : ''}
              <button id="btn-rst-${app.id}" class="action-btn btn-secondary" onclick="resetApplication('${app.id}')" title="إرجاع الطلب إلى قيد المراجعة">
                <i class="fa-solid fa-rotate-left"></i>
              </button>
            `}
            <button class="action-btn btn-danger btn-delete" onclick="deleteApplication('${app.id}')" title="حذف هذا الطلب">
            </button>
          </div>
        </td>
      </tr>`;
  });
  if (pageRows.length === 0) {
    const empty = allApplications.length === 0
      ? { icon: 'fa-inbox', title: 'لا توجد طلبات مسجلة بعد', sub: 'ستظهر الطلبات هنا فور ورودها.' }
      : { icon: 'fa-magnifying-glass', title: 'لا توجد نتائج مطابقة', sub: 'جرّب تعديل كلمات البحث أو الفلاتر.' };
    html += `<tr><td colspan="9" class="empty-state-cell">
      <div class="empty-state">
        <div class="empty-icon"><i class="fa-solid ${empty.icon}"></i></div>
        <div class="empty-title">${empty.title}</div>
        <div class="empty-sub">${empty.sub}</div>
      </div>
    </td></tr>`;
  }


  html += `</tbody></table>`;
  container.innerHTML = html;
  renderPagination(total);
  updateBulkBar();
  updateViewToggleIcon();
}


function getStatusText(status) {
  if (status === 'pending') return 'قيد المراجعة';
  if (status === 'accepted') return 'مقبول';
  if (status === 'attended') return 'حاضر (في القاعة)';
  if (status === 'rejected') return 'مرفوض';
  if (status === 'today') return 'طلبات اليوم';
  if (status === 'no_telegram') return 'بدون تيليجرام';
  if (status === 'no_phone') return 'بدون هاتف';
  if (status === 'all') return 'جميع الطلبات (الكل)';
  return status || '-';
}

// Generate Official Ticket HTML
function generateTicketHtml(id, name, track, familyCount = 0, phone = "") {
  const shortId = (id || "0000").split("-")[0].toUpperCase();
  const ticketPayload = JSON.stringify({ id, name, track, fam: familyCount, phone: phone || "", v: 1 });
  const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(ticketPayload)}&size=185&margin=1`;

  const escapeHtml = (str) => (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeName = escapeHtml(name);
  const safeTrack = escapeHtml(track);
  const safePhone = escapeHtml(phone || "");
  const avatarChar = name ? name.trim().charAt(0) : "T";

  const familyBadgeHtml = familyCount > 0
    ? `<span class="badge family-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              ${familyCount} مقاعد عائلية
            </span>`
    : `<span class="badge family-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              حضور فردي
            </span>`;

  const phoneBadgeHtml = safePhone
    ? `<span class="badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              ${safePhone}
            </span>`
    : "";

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <title>بطاقة الدخول الرسمية - ${safeName}</title>
  <meta name="description" content="بطاقة الدخول الرسمية لمهرجان التخرج الطلابي 2026" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=IBM+Plex+Mono:wght@500;600;700&display=swap" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #030305;
      --card: #09090d;
      --card-inner: #13141a;
      --line: rgba(255, 255, 255, 0.12);
      --text: #ffffff;
      --muted: #a1a1aa;
      --silver: #e4e4e7;
    }

    body {
      -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;
      min-height: 100vh;
      background: radial-gradient(circle at 50% -20%, rgba(255, 255, 255, 0.12), transparent 50%),
                  radial-gradient(circle at 50% 120%, rgba(255, 255, 255, 0.05), transparent 45%),
                  var(--bg);
      color: var(--text);
      font-family: "Cairo", sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      overflow-x: hidden;
    }

    .tilt-wrapper {
      perspective: 1600px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }

    .ticket {
      position: relative;
      width: min(100%, 420px);
      min-height: 700px;
      overflow: hidden;
      border-radius: 26px;
      background: linear-gradient(180deg, #13141a 0%, #0a0a0e 55%, #050508 100%);
      border: 1px solid rgba(255, 255, 255, 0.24);
      box-shadow: 0 35px 90px rgba(0, 0, 0, 0.95), 0 0 50px rgba(255, 255, 255, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      isolation: isolate;
      transform-style: preserve-3d;
      transition: transform 0.12s ease-out;
      will-change: transform;
    }

    /* Holographic Glare */
    .glare {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at center, rgba(255, 255, 255, 0.14) 0%, rgba(200, 220, 255, 0.06) 25%, transparent 50%),
                  linear-gradient(135deg, rgba(255, 0, 128, 0.04), rgba(0, 220, 255, 0.04), rgba(255, 215, 0, 0.04), transparent 60%);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
      mix-blend-mode: overlay;
      z-index: 25;
    }

    /* Official Watermark Seal in Background */
    .watermark-seal {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-15deg);
      width: 320px;
      height: 320px;
      opacity: 0.025;
      pointer-events: none;
      z-index: 0;
    }

    /* Header */
    .header {
      padding: 24px 24px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--line);
      position: relative;
      z-index: 2;
    }

    .university { display: flex; align-items: center; gap: 12px; }
    .logo {
      width: 44px;
      height: 44px;
      border-radius: 13px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      background: linear-gradient(135deg, #22232a 0%, #14151a 100%);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    .logo svg { width: 24px; height: 24px; }

    .university-text { line-height: 1.35; }
    .university-name { font-size: 13.5px; font-weight: 900; color: #fff; letter-spacing: -0.2px; }
    .university-sub { font-size: 9.5px; color: var(--muted); margin-top: 2px; font-weight: 600; letter-spacing: 0.5px; }

    .year { text-align: left; direction: ltr; }
    .year-number { font-family: "IBM Plex Mono", monospace; font-size: 19px; font-weight: 700; color: #fff; letter-spacing: 2px; }
    .year-label { font-size: 8.5px; color: var(--muted); letter-spacing: 1.5px; font-weight: 600; }

    /* Hero */
    .hero { text-align: center; padding: 22px 24px 14px; transform: translateZ(20px); position: relative; z-index: 2; }
    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 9px;
      font-weight: 800;
      color: #fff;
      letter-spacing: 1.8px;
      padding: 3px 12px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(255, 255, 255, 0.15);
      margin-bottom: 8px;
    }
    .eyebrow svg { width: 11px; height: 11px; }

    .title { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; text-shadow: 0 2px 10px rgba(0,0,0,0.6); }
    .subtitle { margin-top: 4px; color: var(--muted); font-size: 12px; font-weight: 600; }

    .status {
      width: fit-content;
      margin: 6px auto 16px;
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 5px 14px;
      border-radius: 100px;
      border: 1px solid rgba(255, 255, 255, 0.28);
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
      font-size: 10px;
      font-weight: 800;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    @keyframes pulseWhite {
      0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.6); }
      70% { box-shadow: 0 0 0 6px rgba(255, 255, 255, 0); }
      100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
    }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #fff; animation: pulseWhite 2s infinite; }

    /* Student Card */
    .person {
      margin: 0 20px;
      padding: 18px;
      border-radius: 18px;
      background: linear-gradient(135deg, #171922 0%, #101117 100%);
      border: 1px solid rgba(255, 255, 255, 0.16);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 24px rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      gap: 14px;
      position: relative;
      overflow: hidden;
      transform: translateZ(30px);
      z-index: 2;
    }

    .person::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.3) 100%);
    }

    .avatar {
      width: 58px;
      height: 58px;
      flex: 0 0 58px;
      border-radius: 16px;
      background: linear-gradient(135deg, #2a2c36 0%, #181920 100%);
      border: 1px solid rgba(255, 255, 255, 0.28);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 24px;
      font-weight: 900;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .person-info { min-width: 0; flex: 1; }
    .person-label { font-size: 9px; color: var(--muted); font-weight: 700; margin-bottom: 2px; }
    .person-name { font-size: 17.5px; font-weight: 900; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .badges { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; align-items: center; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 9px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.14);
      color: var(--silver);
    }
    .badge svg { width: 12px; height: 12px; flex-shrink: 0; }
    .badge.track-badge {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.25);
      color: #ffffff;
    }
    .badge.family-badge {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
      color: #ffffff;
    }

    /* Ticket Perforation & Side Cutouts */
    .perforation-wrap {
      position: relative;
      margin: 20px 0;
      display: flex;
      align-items: center;
    }
    .notch {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--bg);
      border: 1px solid rgba(255, 255, 255, 0.22);
      z-index: 10;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.9);
    }
    .notch.left { left: -11px; }
    .notch.right { right: -11px; }

    .divider {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 24px;
    }
    .divider-line {
      height: 1px;
      flex: 1;
      border-top: 1.5px dashed rgba(255, 255, 255, 0.25);
    }
    .diamond { width: 5px; height: 5px; background: #fff; transform: rotate(45deg); opacity: 0.8; }

    /* Security Ribbon */
    .security-ribbon {
      font-family: "IBM Plex Mono", monospace;
      font-size: 7.5px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.4);
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      padding: 5px 0;
      border-top: 1px dashed var(--line);
      border-bottom: 1px dashed var(--line);
      margin: 0 20px 14px;
      user-select: none;
    }

    /* QR Section */
    .qr-section { text-align: center; transform: translateZ(25px); position: relative; z-index: 2; }
    .qr-label { font-size: 10.5px; color: var(--muted); margin-bottom: 10px; font-weight: 700; letter-spacing: 0.5px; }
    .qr-container {
      position: relative;
      width: 180px;
      height: 180px;
      margin: auto;
      padding: 10px;
      border-radius: 18px;
      background: #ffffff;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.4);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .qr-container:hover {
      transform: scale(1.02);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 255, 255, 0.15);
    }

    .qr-container::before, .qr-container::after { content: ""; position: absolute; width: 18px; height: 18px; border-color: #000; border-style: solid; }
    .qr-container::before { top: -3px; right: -3px; border-width: 2.5px 2.5px 0 0; border-radius: 0 6px 0 0; }
    .qr-container::after { bottom: -3px; left: -3px; border-width: 0 0 2.5px 2.5px; border-radius: 0 0 0 6px; }
    .qr-container img, .qr-container svg { width: 100%; height: 100%; display: block; object-fit: contain; }
    .scan-note { margin-top: 10px; color: var(--muted); font-size: 9.5px; font-weight: 600; }

    /* Reference & Copy */
    .reference {
      margin: 16px 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-radius: 13px;
      background: var(--card-inner);
      border: 1px solid rgba(255, 255, 255, 0.12);
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }
    .reference:hover {
      background: #191b24;
      border-color: rgba(255, 255, 255, 0.25);
    }
    .ref-title { font-size: 9px; color: var(--muted); font-weight: 700; letter-spacing: 0.8px; }
    .ref-code-wrap { display: flex; align-items: center; gap: 8px; }
    .ref-code { font-family: "IBM Plex Mono", monospace; direction: ltr; font-size: 12px; color: #fff; font-weight: 700; letter-spacing: 1.2px; }
    .copy-hint { font-size: 8px; color: var(--muted); padding: 2px 6px; border-radius: 4px; background: rgba(255, 255, 255, 0.08); font-weight: 600; }

    /* Security items */
    .security { margin: 14px 20px 0; display: flex; justify-content: space-between; align-items: center; }
    .security-item { font-size: 8.5px; color: var(--muted); letter-spacing: 0.5px; font-weight: 700; display: flex; align-items: center; gap: 4px; }
    .security-item svg { width: 11px; height: 11px; }
    .verified { display: flex; align-items: center; gap: 6px; color: #fff; font-size: 9.5px; font-weight: 900; }
    .verified-icon {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      border: 1px solid #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
    }
    .verified-icon svg { width: 9px; height: 9px; }

    .live-sync {
      font-family: "IBM Plex Mono", monospace;
      font-size: 9.5px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 16px;
      letter-spacing: 1.5px;
      opacity: 0.85;
      font-weight: 600;
    }
    .sync-ping {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 6px #22c55e;
      display: inline-block;
    }

    /* Footer */
    .footer {
      margin-top: 14px;
      padding: 14px 24px;
      border-top: 1px solid var(--line);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-main { font-size: 9.5px; color: var(--muted); line-height: 1.4; }
    .footer-main strong { display: block; color: #fff; font-size: 10px; margin-bottom: 1px; }
    .non-transferable { font-size: 8.5px; color: var(--muted); text-align: left; font-weight: 600; line-height: 1.35; }

    /* Print & Actions */
    .actions {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 24px;
    }
    .btn {
      background: linear-gradient(135deg, #1c1d24 0%, #121318 100%);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #fff;
      padding: 10px 22px;
      border-radius: 50px;
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
    }
    .btn svg { width: 14px; height: 14px; }
    .btn:hover {
      background: linear-gradient(135deg, #2b2c36 0%, #1e1f26 100%);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-1px);
    }

    @media (max-width: 480px) {
      body { padding: 12px 8px; }
      .ticket { border-radius: 22px; min-height: auto; }
      .header { padding: 18px 18px 14px; }
      .hero { padding: 20px 16px 12px; }
      .person { margin: 0 14px; }
      .reference, .security, .footer, .security-ribbon { margin-left: 14px; margin-right: 14px; }
      .qr-container { width: 165px; height: 165px; }
      .actions { display: none; }
    }

    @media print {
      body { background: #fff !important; padding: 0 !important; }
      .ticket { box-shadow: none !important; page-break-inside: avoid; transform: none !important; border: 1px solid #000 !important; background: #000 !important; }
      .actions, .glare, .notch, .watermark-seal { display: none !important; }
    }
  </style>
  <script>
    document.addEventListener('contextmenu', e => e.preventDefault());
  </script>
</head>
<body>
  <div class="tilt-wrapper">
    <main class="ticket" id="ticket">
      <div class="glare" id="glare"></div>

      <!-- Watermark Seal -->
      <svg class="watermark-seal" viewBox="0 0 200 200" fill="none" stroke="#ffffff" stroke-width="1.5">
        <circle cx="100" cy="100" r="90" stroke-dasharray="4 4"/>
        <circle cx="100" cy="100" r="75"/>
        <path d="M100 45 L115 80 L155 85 L125 110 L135 150 L100 130 L65 150 L75 110 L45 85 L85 80 Z"/>
      </svg>

      <header class="header">
        <div class="university">
          <div class="logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div class="university-text">
            <div class="university-name">كلية الطف الجامعة</div>
            <div class="university-sub">AL-TUFF UNIVERSITY COLLEGE</div>
          </div>
        </div>
        <div class="year">
          <div class="year-number">2026</div>
          <div class="year-label">GRADUATION</div>
        </div>
      </header>

      <section class="hero">
        <span class="eyebrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          OFFICIAL EVENT PASS
        </span>
        <h1 class="title">مهرجان التخرج الطلابي</h1>
        <p class="subtitle">بطاقة الدخول الرقمية المعتمدة</p>
      </section>

      <div class="status">
        <span class="status-dot"></span>بطاقة دخول معتمدة
      </div>

      <section class="person">
        <div class="avatar">${avatarChar}</div>
        <div class="person-info">
          <div class="person-label">صاحب البطاقة</div>
          <div class="person-name">${safeName}</div>
          <div class="badges">
            <span class="badge track-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              ${safeTrack}
            </span>
            ${familyBadgeHtml}
            ${phoneBadgeHtml}
          </div>
        </div>
      </section>

      <div class="perforation-wrap">
        <div class="notch left"></div>
        <div class="divider">
          <span class="divider-line"></span><span class="diamond"></span><span class="divider-line"></span>
        </div>
        <div class="notch right"></div>
      </div>

      <section class="qr-section">
        <div class="qr-label">امسح الرمز للتحقق من الصلاحية</div>
        <div class="qr-container" id="qrContainer"><img src="${qrUrl}" alt="QR Code" loading="eager" /></div>
        <div class="scan-note">يُرجى إبراز رمز QR عند بوابات الدخول</div>
      </section>

      <div class="reference" id="refCard" title="انقر لنسخ الرمز">
        <div>
          <div class="ref-title">بطاقة الدخول • DIGITAL PASS</div>
          <div class="ref-code-wrap">
            <span class="ref-code" id="refCodeText">TU-2026-${shortId}</span>
            <span class="copy-hint" id="copyHint">نسخ</span>
          </div>
        </div>
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      </div>

      <div class="security-ribbon">
        AL-TUFF UNIVERSITY • 2026 PASS • كلية الطف الجامعة • OFFICIAL
      </div>

      <div class="security">
        <div class="verified">
          <span class="verified-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </span>
          VERIFIED
        </div>
        <div class="security-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          NON-TRANSFERABLE
        </div>
        <div class="security-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          2026 EVENT
        </div>
      </div>

      <div class="live-sync" id="live-clock">
        <span class="sync-ping"></span>
        <span id="sync-text">LIVE SYNC: CONNECTING...</span>
      </div>

      <footer class="footer">
        <div class="footer-main">
          <strong>بطاقة دخول شخصية</strong>صالحة للفعالية المحددة فقط
        </div>
        <div class="non-transferable">هذه البطاقة<br>غير قابلة للتحويل</div>
      </footer>
    </main>
  </div>

  <div class="actions">
    <button class="btn" onclick="window.print()">
      <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><path d="M6 14h12v8H6z"></path></svg>
      طباعة وتنزيل البطاقة
    </button>
  </div>

  <script>
    const wrapper = document.querySelector('.tilt-wrapper');
    const ticket = document.getElementById('ticket');
    const glare = document.getElementById('glare');

    function handleMove(clientX, clientY) {
      const rect = wrapper.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;
      
      ticket.style.transform = \`rotateX(\${rotateX}deg) rotateY(\${rotateY}deg)\`;
      
      glare.style.opacity = '1';
      glare.style.transform = \`translate(\${x - rect.width/2}px, \${y - rect.height/2}px)\`;
    }

    wrapper.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
    wrapper.addEventListener('mouseleave', () => {
      ticket.style.transform = 'rotateX(0) rotateY(0)';
      glare.style.opacity = '0';
    });

    wrapper.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    wrapper.addEventListener('touchend', () => {
      ticket.style.transform = 'rotateX(0) rotateY(0)';
      glare.style.opacity = '0';
    });

    setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Baghdad' });
      const el = document.getElementById('sync-text');
      if (el) el.innerText = 'LIVE SYNC: ' + timeStr + ' (IQ)';
    }, 1000);

    document.getElementById('refCard').addEventListener('click', () => {
      const text = document.getElementById('refCodeText').innerText;
      navigator.clipboard.writeText(text).then(() => {
        const hint = document.getElementById('copyHint');
        hint.innerText = 'تم النسخ!';
        hint.style.background = '#22c55e';
        hint.style.color = '#fff';
        setTimeout(() => {
          hint.innerText = 'نسخ';
          hint.style.background = 'rgba(255, 255, 255, 0.08)';
          hint.style.color = 'var(--muted)';
        }, 1500);
      }).catch(() => {});
    });

    try {
      if (typeof qrcode !== 'undefined') {
        const qr = qrcode(0, 'M');
        qr.addData('${ticketPayload.replace(/'/g, "\\'")}');
        qr.make();
        const qrEl = document.getElementById('qrContainer');
        if (qrEl) qrEl.innerHTML = qr.createSvgTag({ scalable: true, margin: 2 });
      }
    } catch(e) {}
  <\/script>
</body>
</html>`;
}


// Modal Preview Functions
window.previewTicket = function(id) {
  const app = allApplications.find(a => String(a.id) === String(id));
  if (!app) return;
  const name = app.full_name || app.name || 'المشترك';
  const track = app.track || app.section || '-';

  currentPreviewData = { id, name, track };
  const modal = document.getElementById('ticketModal');
  const frame = document.getElementById('ticketPreviewFrame');
  const title = document.getElementById('modalTitle');
  const downloadBtn = document.getElementById('modalDownloadBtn');

  if (title) title.innerHTML = `<i class="fa-solid fa-ticket"></i> معاينة بطاقة: ${escapeHtml(name)}`;
  
  const ticketHtml = generateTicketHtml(id, name, track, app.family_count || 0, app.phone || "");
  
  if (downloadBtn) {
    downloadBtn.onclick = () => window.downloadTicket(id);
  }

  modal.classList.add('show');
  frame.srcdoc = ticketHtml;
};

window.closePreviewModal = function() {
  const modal = document.getElementById('ticketModal');
  const frame = document.getElementById('ticketPreviewFrame');
  modal.classList.remove('show');
  if (frame) frame.srcdoc = '';
  currentPreviewData = null;
};

window.downloadTicket = function(id) {
  const app = allApplications.find(a => String(a.id) === String(id)) || currentPreviewData || {};
  const name = app.full_name || app.name || app.name || 'المشترك';
  const track = app.track || app.section || '-';

  const ticketHtml = generateTicketHtml(id || app.id, name, track, app.family_count || 0, app.phone || "");
  const blob = new Blob([ticketHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Ticket_${name.replace(/\s+/g, '_')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast('تم تحميل ملف البطاقة');
};

// Close modal on click outside
window.addEventListener('click', (e) => {
  const modal = document.getElementById('ticketModal');
  if (e.target === modal) {
    window.closePreviewModal();
  }
});

// Generate Official Terms & Conditions Document
function generateTermsDocHtml(name, track, contribution, contractId, date) {
  const shortId = (contractId || "JEMO-OFFICIAL").toUpperCase();
  const joinDate = date || new Date().toLocaleDateString("ar-IQ", { year: "numeric", month: "long", day: "numeric" });
  const qrValidationUrl = `https://event.example/verify-doc/${encodeURIComponent(shortId)}`;
  const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrValidationUrl)}&size=130&margin=1`;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>وثيقة الشروط واللوائح والالتزامات الرسمية — ${name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700;800;900&family=IBM+Plex+Mono:wght@500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --gold: #d4af37;
    --gold-light: #f5e6b3;
    --gold-dark: #aa841f;
    --emerald: #10b981;
    --dark-bg: #090c12;
    --card-bg: #111622;
    --border: rgba(212, 175, 55, 0.25);
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
  }

  body {
    font-family: "Cairo", sans-serif;
    background: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.12), transparent 45%), radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.06), transparent 40%), var(--dark-bg);
    color: var(--text-primary);
    padding: 30px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .doc-wrapper {
    max-width: 780px;
    width: 100%;
    position: relative;
    background: var(--card-bg);
    border-radius: 24px;
    padding: 40px 45px;
    border: 1px solid var(--border);
    box-shadow: 0 40px 100px -20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1);
    isolation: isolate;
  }

  .doc-wrapper::before {
    content: '';
    position: absolute;
    inset: 10px;
    border: 1px dashed rgba(212, 175, 55, 0.35);
    border-radius: 16px;
    pointer-events: none;
    z-index: 1;
  }

  .watermark {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.03;
    pointer-events: none;
    font-size: 260px;
    color: var(--gold);
    z-index: 0;
  }

  .content-layer {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .doc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid rgba(212, 175, 55, 0.2);
    padding-bottom: 20px;
    gap: 16px;
  }

  .institution {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .inst-logo {
    width: 58px;
    height: 58px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(255,255,255,0.02));
    border: 1.5px solid var(--gold);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold-light);
    font-size: 22px;
    font-weight: 900;
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  }

  .inst-text h2 {
    font-size: 19px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.3px;
  }

  .inst-text p {
    font-size: 11.5px;
    color: var(--gold);
    margin-top: 3px;
    font-weight: 600;
  }

  .doc-serial {
    text-align: left;
    direction: ltr;
    font-family: "IBM Plex Mono", monospace;
  }

  .serial-badge {
    background: rgba(212, 175, 55, 0.12);
    border: 1px solid var(--border);
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    color: var(--gold-light);
  }

  .serial-date {
    font-size: 10px;
    color: var(--text-secondary);
    margin-top: 4px;
  }

  .title-banner {
    text-align: center;
    padding: 16px;
    background: linear-gradient(180deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.02) 100%);
    border: 1px solid rgba(212, 175, 55, 0.2);
    border-radius: 14px;
  }

  .title-banner h1 {
    font-family: "Amiri", serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--gold-light);
    margin-bottom: 4px;
  }

  .title-banner p {
    font-size: 12.5px;
    color: var(--text-secondary);
  }

  .bio-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    padding: 18px;
  }

  .bio-item {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .bio-item .lbl {
    font-size: 11px;
    color: var(--text-secondary);
    font-weight: 600;
  }

  .bio-item .val {
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
  }

  .bio-item .val.gold {
    color: var(--gold-light);
    font-family: "IBM Plex Mono", monospace;
  }

  .articles-box {
    background: rgba(255, 255, 255, 0.015);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    padding: 22px;
  }

  .articles-title {
    font-size: 14px;
    font-weight: 800;
    color: var(--gold);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .articles-list {
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .article-row {
    font-size: 12px;
    line-height: 1.65;
    color: #cbd5e1;
    background: rgba(255, 255, 255, 0.02);
    padding: 9px 14px;
    border-radius: 10px;
    border-right: 3px solid var(--gold);
    display: flex;
    gap: 8px;
  }

  .article-num {
    color: var(--gold);
    font-weight: 800;
    font-family: "IBM Plex Mono", monospace;
    flex-shrink: 0;
  }

  .seal-footer {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 20px;
    align-items: center;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(212, 175, 55, 0.2);
    border-radius: 18px;
    padding: 18px 24px;
  }

  .sig-block {
    text-align: center;
  }

  .sig-title {
    font-size: 11px;
    color: var(--text-secondary);
    margin-bottom: 6px;
  }

  .sig-name {
    font-size: 13px;
    font-weight: 800;
    color: #ffffff;
  }

  .sig-stamp {
    font-size: 10px;
    color: var(--emerald);
    font-weight: 700;
    margin-top: 4px;
  }

  .qr-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 0 10px;
    border-left: 1px solid rgba(255,255,255,0.08);
    border-right: 1px solid rgba(255,255,255,0.08);
  }

  .qr-img {
    width: 75px;
    height: 75px;
    border-radius: 10px;
    background: #fff;
    padding: 4px;
  }

  .qr-label {
    font-size: 9px;
    color: var(--text-secondary);
    font-family: "IBM Plex Mono", monospace;
  }

  .actions-bar {
    margin-top: 24px;
    display: flex;
    gap: 12px;
  }

  .print-btn {
    background: linear-gradient(135deg, var(--gold), var(--gold-dark));
    color: #000;
    border: none;
    border-radius: 50px;
    padding: 12px 28px;
    font-family: inherit;
    font-weight: 800;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .print-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(212, 175, 55, 0.4);
  }

  @media (max-width: 680px) {
    .doc-wrapper { padding: 25px 20px; border-radius: 18px; }
    .bio-grid { grid-template-columns: 1fr; }
    .seal-footer { grid-template-columns: 1fr; gap: 16px; text-align: center; }
    .qr-box { border: none; padding: 12px 0; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); }
    .doc-header { flex-direction: column; align-items: flex-start; }
    .doc-serial { text-align: right; direction: rtl; }
  }

  @media print {
    body { background: #fff !important; color: #000 !important; padding: 0 !important; }
    .doc-wrapper { box-shadow: none !important; border: 1.5px solid #000 !important; background: #fff !important; color: #000 !important; max-width: 100% !important; border-radius: 0 !important; padding: 25px !important; }
    .doc-wrapper::before { border-color: #000 !important; }
    .title-banner { background: #f8fafc !important; border-color: #000 !important; }
    .title-banner h1 { color: #000 !important; }
    .inst-text h2, .bio-item .val, .sig-name { color: #000 !important; }
    .article-row { background: #f8fafc !important; color: #1e293b !important; border-right-color: #000 !important; }
    .article-num, .inst-text p, .articles-title { color: #000 !important; }
    .serial-badge { background: #eee !important; color: #000 !important; border-color: #000 !important; }
    .seal-footer { background: #f8fafc !important; border-color: #000 !important; }
    .actions-bar, .watermark { display: none !important; }
  }
</style>
</head>
<body>

<div class="doc-wrapper">
  <div class="watermark">🎓</div>
  
  <div class="content-layer">
    <header class="doc-header">
      <div class="institution">
        <div class="inst-logo">TU</div>
        <div class="inst-text">
          <h2>كلية الطف الجامعة — AL-TUFF COLLEGE</h2>
          <p>مهرجان التخرج الطلابي الأول 2026 | الأمانة العامة المشرفة</p>
        </div>
      </div>

      <div class="doc-serial">
        <div class="serial-badge">REF: ${escapeHtml(shortId)}</div>
        <div class="serial-date">التاريخ: ${escapeHtml(joinDate)}</div>
      </div>
    </header>

    <div class="title-banner">
      <h1>وثيقة الشروط واللوائح والالتزامات التنظيمية الرسمية</h1>
      <p>ميثاق المشاركة والانضباط لحاملي بطاقات الدخول الرسمية المعتمدة</p>
    </div>

    <div class="bio-grid">
      <div class="bio-item">
        <span class="lbl">اسم المشترك الرباعي:</span>
        <span class="val">${escapeHtml(name)}</span>
      </div>
      <div class="bio-item">
        <span class="lbl">المسار التخصصي المعتمد:</span>
        <span class="val" style="color: var(--emerald);">${escapeHtml(track)}</span>
      </div>
      <div class="bio-item">
        <span class="lbl">مبلغ المساهمة المقررة:</span>
        <span class="val">${escapeHtml(contribution)}</span>
      </div>
      <div class="bio-item">
        <span class="lbl">حالة الاعتماد الإلكتروني:</span>
        <span class="val gold">🟢 معتمد وموثق رسمياً</span>
      </div>
    </div>

    <div class="articles-box">
      <div class="articles-title">
        <span>📜</span>
        <span>بنود اللائحة وميثاق السلوك والانضباط الإلزامي:</span>
      </div>

      <div class="articles-list">
        <div class="article-row">
          <span class="article-num">01.</span>
          <div><strong>الالتزام المالي والمساهمة التنظيمية:</strong> يلتزم المشارك بتسوية مبلغ المساهمة المقرر لدعم المستلزمات اللوجستية والتنظيمية للمهرجان دون تأخير.</div>
        </div>
        <div class="article-row">
          <span class="article-num">02.</span>
          <div><strong>المظهر اللائق والزي الأكاديمي:</strong> الالتزام بالزي الأكاديمي والروب الجامعي المحدد للدفعة بما يعكس الوقار والهيبة الطلابية.</div>
        </div>
        <div class="article-row">
          <span class="article-num">03.</span>
          <div><strong>بروتوكول البوابات والدخول الرقمي:</strong> إبراز بطاقة الدخول الرسمية الرقمية (QR Code) عند البوابات، وتعتبر البطاقة شخصية وغير قابلة للتحويل.</div>
        </div>
        <div class="article-row">
          <span class="article-num">04.</span>
          <div><strong>الانضباط والسلوك القويم:</strong> مراعاة الأخلاق الأكاديمية والتعاون التام مع فرق التنظيم والأمن لحفظ انسيابية الحفل وتفادي أي سلوك يخل بالوقار العام.</div>
        </div>
        <div class="article-row">
          <span class="article-num">05.</span>
          <div><strong>حقوق التوثيق والإعلام الرقمي:</strong> تؤول كافة حقوق التغطية الإعلامية والتصوير للمنظومة المنظمة مع الحفاظ على خصوصية المشاركين.</div>
        </div>
        <div class="article-row">
          <span class="article-num">06.</span>
          <div><strong>المواعيد والجدول الزمني:</strong> الحضور في المواعيد المقررة لبروفات التخرج والاصطفاف لضمان تنظيم منصة التكريم بدقة.</div>
        </div>
      </div>
    </div>

    <div class="seal-footer">
      <div class="sig-block">
        <div class="sig-title">رئيس اللجنة العليا المنظمة</div>
        <div class="sig-name">أ.د. عميد الكلية المشرف</div>
        <div class="sig-stamp">✔ توقيع واعتماد رسمي</div>
      </div>

      <div class="qr-box">
        <img class="qr-img" src="${qrCodeUrl}" alt="Security Verification QR" />
        <span class="qr-label">DIGITAL VERIFIED</span>
      </div>

      <div class="sig-block">
        <div class="sig-title">أمانة شؤون الطلبة والتنظيم</div>
        <div class="sig-name">اللجنة الطلابية المركزية</div>
        <div class="sig-stamp">✔ مصادقة وتثبيت إلكتروني</div>
      </div>
    </div>
  </div>
</div>

<div class="actions-bar">
  <button class="print-btn" onclick="window.print()">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><path d="M6 14h12v8H6z"></path></svg>
    طباعة الوثيقة الرسمية (A4 PDF)
  </button>
</div>

</body>
</html>`;
}
// Custom Non-Blocking Confirmation Modal Helper
function showConfirmDialog(titleHtml, messageHtml, onConfirm, okBtnClass = 'btn-success', okBtnText = 'تأكيد ومتابعة') {
  const modal = document.getElementById('confirmModal');
  const titleEl = document.getElementById('confirmModalTitle');
  const msgEl = document.getElementById('confirmModalMessage');
  const okBtn = document.getElementById('confirmModalOkBtn');

  if (titleEl) titleEl.innerHTML = titleHtml;
  if (msgEl) msgEl.innerHTML = messageHtml;
  if (okBtn) {
    okBtn.className = `action-btn ${okBtnClass}`;
    okBtn.innerHTML = okBtnText;
    okBtn.onclick = async () => {
      closeConfirmModal();
      if (typeof onConfirm === 'function') {
        await onConfirm();
      }
    };
  }
  if (modal) modal.classList.add('show');
}

window.closeConfirmModal = function() {
  const modal = document.getElementById('confirmModal');
  if (modal) modal.classList.remove('show');
};

// Actions
async function sendStudentApprovalNotification(app) {
  const name = app.full_name || app.name || 'المشترك';
  const track = app.track || app.section || 'مسار الحضور والتكريم';
  const contribution = app.contribution || app.hours || '10,000 د.ع';
  const telRaw = app.telegram || '';
  const chatId = telRaw.includes('|') ? telRaw.split('|')[0] : telRaw;

  if (!chatId || isNaN(Number(chatId))) {
    throw new Error('لا يوجد معرف تيليجرام صالح للمشترك (chatId غير متوفر)');
  }

  const shortId = `JEMO-${(app.id || '0000').slice(0, 8).toUpperCase()}`;
  const famCount = Number(app.family_count) || 0;
  const famInfo = famCount > 0
    ? `\n👨‍👩‍👧‍👦 <b>مقاعد العائلة المرافقة:</b> ${famCount} مقاعد محجوزة ومؤكدة`
    : `\n👨‍👩‍👧‍👦 <b>حضور العائلة:</b> تسجيل فردي بدون مرافقين`;

  // 1. Send Prominent Congratulatory Text Message with Interactive Buttons
  const approvalMsg = `🎉 <b>تهانينا! تم قبول واعتماد طلبك رسمياً في مهرجان التخرج 2026 🎓</b>\n━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `عزيزنا الخريج <b>${escapeHtml(name)}</b>، نبارك لك استيفاء الشروط واعتماد مشاركتك في فعاليات المهرجان.\n\n` +
    `📋 <b>بيانات الاعتماد الرسمية:</b>\n` +
    `👤 <b>اسم الخريج:</b> ${escapeHtml(name)}\n` +
    `🎯 <b>المسار المعتمد:</b> ${escapeHtml(track)}\n` +
    `🆔 <b>رقم البطاقة (الرمز):</b> <code>${escapeHtml(shortId)}</code>` +
    famInfo + `\n` +
    `📌 <b>حالة الاعتماد:</b> 🟢 مقبول وموثق رسمياً\n\n` +
    `🎫 <b>تم تفعيل وإصدار بطاقة دخولك الرقمية (مرفقة بالأسفل)!</b>\n` +
    `احفظ الملف وافتحه بالمتصفح، وابرز رمز QR عند بوابات الدخول يوم الحفل.`;

  const workerUrl = 'https://jemo-bot.ali-jemo1-9.workers.dev/app';
  const approvalKeyboard = {
    inline_keyboard: [
      [{ text: "🎫 استعراض وتحديث بطاقتي", callback_data: "cmd_doc" }],
      [{ text: "📱 فتح تطبيق الفعالية", web_app: { url: workerUrl } }],
      [{ text: "🔙 القائمة الرئيسية", callback_data: "cmd_main_menu" }],
    ],
  };

  const textRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: approvalMsg,
      parse_mode: 'HTML',
      reply_markup: approvalKeyboard
    })
  });
  const textData = await textRes.json();
  if (!textRes.ok || !textData.ok) {
    console.error('Telegram sendMessage error:', textData);
    throw new Error('فشل إرسال رسالة القبول عبر تيليجرام: ' + (textData.description || 'Unknown error'));
  }

  // 2. Send Official VIP HTML Ticket Document
  try {
    const ticketHtml = generateTicketHtml(app.id, name, track, famCount, app.phone);
    const formPass = new FormData();
    formPass.append("chat_id", chatId);
    formPass.append("document", new Blob([ticketHtml], { type: "text/html" }), `Ticket_${name.replace(/\s+/g, '_')}.html`);
    formPass.append("caption", `✨ <b>بطاقة الدخول الرسمية المعتمدة (HTML)</b>\nافتح الملف في المتصفح لرؤية بطاقتك التفاعلية.`);
    formPass.append("parse_mode", "HTML");
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, { method: "POST", body: formPass });
  } catch (docErr) {
    console.warn("Failed to send ticket document:", docErr);
  }

  return true;
}

window.acceptApplication = async function(id) {
  const app = allApplications.find(a => String(a.id) === String(id));
  if (!app) {
    showToast('لم يتم العثور على بيانات الطلب', 'error');
    return;
  }
  const name = app.full_name || app.name || 'المشترك';

  showConfirmDialog(
    '<i class="fa-solid fa-circle-check" style="color:var(--success);"></i> تأكيد قبول الطلب',
    `هل أنت متأكد من قبول طلب المشترك <b>${escapeHtml(name)}</b> وإصدار بطاقة الدخول وإرسال إشعار القبول له عبر تيليجرام؟`,
    async () => {
      const btn = document.getElementById(`btn-acc-${id}`);
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
      }

      try {
        // Always update DB status first
        await dbFetch('PATCH', `?id=eq.${id}`, { status: 'accepted' });

        // Notify via Telegram best-effort — no chatId = skip silently
        let notified = false;
        try {
          await sendStudentApprovalNotification(app);
          notified = true;
        } catch (notifyErr) {
          console.warn('Telegram notification skipped:', notifyErr.message);
        }

        showToast(notified
          ? `تم قبول طلب (${name}) وإرسال إشعار القبول والبطاقة بنجاح!`
          : `تم قبول طلب (${name}) بنجاح! (لم يتم إرسال إشعار — معرف تيليجرام غير متوفر)`);
        window.logActivity?.('قبول طلب', `تم قبول طلب (${name}) وإصدار البطاقة`, 'accept');
        await loadApplications();
      } catch (err) {
        showToast(err.message || 'حدث خطأ أثناء الإرسال', 'error');
        console.error(err);
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-check"></i> قبول';
        }
      }
    },
    'btn-success',
    '<i class="fa-solid fa-check"></i> قبول وإرسال'
  );
};

window.resendApprovalNotification = async function(id) {
  const app = allApplications.find(a => String(a.id) === String(id));
  if (!app) {
    showToast('لم يتم العثور على بيانات الطلب', 'error');
    return;
  }
  const name = app.full_name || app.name || 'المشترك';
  const btn = document.getElementById(`btn-snd-${id}`);
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
  }

  try {
    await sendStudentApprovalNotification(app);
    showToast(`تم إرسال إشعار القبول وبطاقة الدخول للمشترك (${name}) بنجاح!`);
  } catch (err) {
    showToast(err.message || 'فشل إرسال الإشعار للمشترك', 'error');
    console.error(err);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال القبول';
    }
  }
};

window.rejectApplication = async function(id) {
  const app = allApplications.find(a => String(a.id) === String(id));
  if (!app) {
    showToast('لم يتم العثور على بيانات الطلب', 'error');
    return;
  }
  const name = app.full_name || app.name || 'المشترك';
  const telRaw = app.telegram || '';
  const chatId = telRaw.includes('|') ? telRaw.split('|')[0] : telRaw;

  showConfirmDialog(
    '<i class="fa-solid fa-circle-xmark" style="color:var(--danger);"></i> تأكيد رفض الطلب',
    `هل أنت متأكد من رفض طلب المشترك <b>${escapeHtml(name)}</b>؟ سيتم إرسال إشعار اعتذار للمستخدم عبر تيليجرام.`,
    async () => {
      const btn = document.getElementById(`btn-rej-${id}`);
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>...';
      }

      try {
        if (chatId && !isNaN(Number(chatId))) {
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: "<blockquote><b>إشعار بخصوص طلب المشاركة</b>\n\nنعتذر عن عدم قبول طلب تسجيلك في هذه الدورة لاكتمال المقاعد المقررة. نتمنى لك دوام التوفيق والنجاح.</blockquote>",
              parse_mode: "HTML"
            })
          });
        }

        await dbFetch('PATCH', `?id=eq.${id}`, { status: 'rejected' });
        showToast(`تم رفض طلب (${name}) بنجاح`);
        window.logActivity?.('رفض طلب', `تم رفض طلب (${name})`, 'reject');
        await loadApplications();
      } catch(e) {
        showToast(e.message || 'حدث خطأ أثناء الرفض', 'error');
        console.error(e);
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-xmark"></i> رفض';
        }
      }
    },
    'btn-danger',
    '<i class="fa-solid fa-xmark"></i> رفض الطلب'
  );
};

window.resetApplication = async function(id) {
  const app = allApplications.find(a => String(a.id) === String(id));
  const name = app ? (app.full_name || app.name || 'المشترك') : 'المشترك';

  showConfirmDialog(
    '<i class="fa-solid fa-rotate-left" style="color:var(--text-muted);"></i> تأكيد التراجع عن القرار',
    `هل أنت متأكد من إعادة طلب المشترك <b>${escapeHtml(name)}</b> إلى حالة <b>قيد المراجعة</b>؟`,
    async () => {
      const btn = document.getElementById(`btn-rst-${id}`);
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>...';
      }

      try {
        await dbFetch('PATCH', `?id=eq.${id}`, { status: 'pending' });
        showToast('تم إرجاع الطلب إلى (قيد المراجعة) بنجاح!');
        window.logActivity?.('تراجع عن قرار', `تم إرجاع طلب (${name}) إلى قيد المراجعة`, 'edit');
        await loadApplications();
      } catch (err) {
        showToast(err.message || 'حدث خطأ أثناء التراجع', 'error');
        console.error(err);
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-rotate-left"></i> تراجع';
        }
      }
    },
    'btn-secondary',
    '<i class="fa-solid fa-rotate-left"></i> إرجاع للمراجعة'
  );
};

window.checkinStudent = async function(id) {
  const app = allApplications.find(a => String(a.id) === String(id));
  if (!app) return;
  try {
    await dbFetch('PATCH', `?id=eq.${id}`, { status: 'attended' });
    showToast(`تم تسجيل حضور (${app.full_name || app.name}) في القاعة`);
    window.logActivity?.('تسجيل حضور', `تم تسجيل حضور (${app.full_name || app.name}) يدوياً`, 'accept');
    await loadApplications();
  } catch (err) {
    showToast('تعذر تسجيل الحضور: ' + err.message, 'error');
  }
};

window.uncheckinStudent = async function(id) {
  const app = allApplications.find(a => String(a.id) === String(id));
  if (!app) return;
  try {
    await dbFetch('PATCH', `?id=eq.${id}`, { status: 'accepted' });
    showToast(`تم إلغاء تسجيل حضور (${app.full_name || app.name})`);
    window.logActivity?.('إلغاء حضور', `تم إلغاء تسجيل حضور (${app.full_name || app.name})`, 'edit');
    await loadApplications();
  } catch (err) {
    showToast('تعذر الإلغاء: ' + err.message, 'error');
  }
};

// Edit Applicant Functions
window.openEditModal = function(id) {
  const app = allApplications.find(a => String(a.id) === String(id));
  if (!app) {
    showToast('لم يتم العثور على بيانات المشترك', 'error');
    return;
  }
  document.getElementById('edit-track-input').value = app.track || app.section || '';
  document.getElementById('edit-contrib-input').value = app.contribution || app.hours || '';
  // telegram stored as "chatId|username"; show whichever part exists
  const telRaw = (app.telegram || '').split('|');
  const chatId = (telRaw[0] || '').trim();
  const username = (telRaw[1] || '').trim();
  const phone = (app.phone || telRaw[2] || '').toString().trim();
  document.getElementById('edit-telegram-input').value = username ? (username.startsWith('@') ? username : `@${username}`) : chatId;
  document.getElementById('edit-phone-input').value = phone;
  const rawName = (app.full_name || app.name || '').trim();
  document.getElementById('edit-name-input').value = (rawName.toUpperCase() === 'DRAFT_USER') ? '' : rawName;
  document.getElementById('edit-track-input').value = app.track || app.section || '';
  document.getElementById('edit-contrib-input').value = app.contribution || app.hours || '';
  document.getElementById('edit-status-input').value = app.status || 'pending';

  const modal = document.getElementById('editAppModal');
  if (modal) modal.classList.add('show');
};
window.copyBindLink = function(id) {
  const link = `https://t.me/${BOT_USERNAME}?start=bind_${encodeURIComponent(String(id))}`;
  navigator.clipboard.writeText(link).then(() => {
    showToast('تم نسخ رابط الربط — أرسله للمشترك عبر الهاتف/SMS ليربط حسابه بالبوت');
  }).catch(() => {
    showToast('تعذر النسخ: ' + link, 'error');
  });
};


window.closeEditModal = function() {
  const modal = document.getElementById('editAppModal');
  if (modal) modal.classList.remove('show');
};

window.saveEditedApplicant = async function() {
  const id = document.getElementById('edit-app-id')?.value;
  const name = document.getElementById('edit-name-input')?.value.trim();
  const track = document.getElementById('edit-track-input')?.value.trim() || '';
  const contribution = document.getElementById('edit-contrib-input')?.value.trim();
  const rawTel = document.getElementById('edit-telegram-input')?.value.trim() || '';
  const phoneValue = document.getElementById('edit-phone-input')?.value.trim() || '';
  const status = document.getElementById('edit-status-input')?.value || 'pending';

  if (!id || !name) {
    showToast('يرجى إدخال اسم المشترك على الأقل', 'error');
    return;
  }

  const app = allApplications.find(a => String(a.id) === String(id));
  const oldParts = (app?.telegram || '').includes('|') ? app.telegram.split('|') : [app?.telegram || '', ''];
  let chatId = oldParts[0] || '';
  let username = oldParts[1] || '';

  if (rawTel) {
    if (/^@/.test(rawTel)) {
      username = rawTel.replace(/^@/, '');
    } else if (/^\d+$/.test(rawTel)) {
      chatId = rawTel;
    } else if (rawTel.includes('|')) {
      const parts = rawTel.split('|');
      chatId = parts[0] || chatId;
      username = parts[1] || username;
    } else {
      username = rawTel;
    }
  }

  const telPayload = (chatId || username || phoneValue)
    ? `${chatId}|${username}|${phoneValue}`
    : '';

  const saveBtn = document.getElementById('edit-save-btn');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';
  }

  try {
    const oldApp = allApplications.find(a => String(a.id) === String(id));
    await dbFetch('PATCH', `?id=eq.${id}`, {
      full_name: name,
      track: track,
      contribution: contribution,
      telegram: telPayload,
      status: status
    });
    if (status === 'accepted' && oldApp?.status !== 'accepted') {
      const updated = { ...(oldApp || {}), id, full_name: name, name, track, contribution, telegram: telPayload, status: 'accepted' };
      await sendStudentApprovalNotification(updated).catch(e => console.warn('Edit status notify error:', e));
    }
    closeEditModal();
    await loadApplications();
  } catch (err) {
    showToast(err.message || 'فشل حفظ التعديلات', 'error');
    console.error(err);
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> حفظ التعديلات';
    }
  }
};

// ── Add New Applicant (Manual Registration) ──
window.openAddModal = function() {
  const modal = document.getElementById('addAppModal');
  if (!modal) return;
  document.getElementById('add-name-input').value = '';
  document.getElementById('add-track-input').value = '';
  document.getElementById('add-contrib-input').value = '10,000 د.ع';
  document.getElementById('add-phone-input').value = '';
  document.getElementById('add-telegram-input').value = '';
  document.getElementById('add-status-input').value = 'pending';

  const datalist = document.getElementById('track-suggestions');
  if (datalist) {
    const tracks = [...new Set(allApplications.map(a => a.track).filter(Boolean))];
    datalist.innerHTML = tracks.map(t => `<option value="${escapeHtml(t)}">`).join('');
  }

  modal.classList.add('show');
  setTimeout(() => document.getElementById('add-name-input')?.focus(), 150);
};

window.closeAddModal = function() {
  const modal = document.getElementById('addAppModal');
  if (modal) modal.classList.remove('show');
};

window.addNewApplicant = async function() {
  const name = document.getElementById('add-name-input')?.value.trim();
  const track = document.getElementById('add-track-input')?.value.trim() || 'عام';
  const contrib = document.getElementById('add-contrib-input')?.value.trim() || '10,000 د.ع';
  const phone = document.getElementById('add-phone-input')?.value.trim() || '';
  const rawTel = document.getElementById('add-telegram-input')?.value.trim() || '';
  const status = document.getElementById('add-status-input')?.value || 'pending';

  if (!name) {
    showToast('يرجى إدخال الاسم الرباعي للطالب', 'error');
    document.getElementById('add-name-input')?.focus();
    return;
  }

  const telValue = rawTel
    ? (/^@/.test(rawTel) ? `|${rawTel.replace(/^@/, '')}` : rawTel)
    : '';
  let chatId = '';
  let username = '';
  if (rawTel) {
    if (/^@/.test(rawTel)) username = rawTel.replace(/^@/, '');
    else if (/^\d+$/.test(rawTel)) chatId = rawTel;
    else if (rawTel.includes('|')) {
      const parts = rawTel.split('|');
      chatId = parts[0] || '';
      username = parts[1] || '';
    } else username = rawTel;
  }

  const telPayload = (chatId || username || phone)
    ? `${chatId}|${username}|${phone}`
    : '';

  const btn = document.getElementById('add-save-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإضافة...';
  }

  try {
    const newRecord = {
      full_name: name,
      track: track,
      contribution: contrib,
      telegram: telPayload,
      status: status
    };

    await dbFetch('POST', '', newRecord);
    showToast(`تمت إضافة المشترك (${name}) بنجاح!`);
    closeAddModal();
    await loadApplications();
  } catch (err) {
    showToast(err.message || 'فشل إضافة المشترك', 'error');
    console.error(err);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> إضافة وحفظ المشترك';
    }
  }
};

// ── Student Profile Details Modal ──
let currentDetailsId = null;
window.openDetailsModal = function(id) {
  const app = allApplications.find(a => String(a.id) === String(id));
  if (!app) return;
  currentDetailsId = String(app.id);
  const rawName = (app.full_name || '').trim();
  const safeName = rawName.toUpperCase() === 'DRAFT_USER' ? 'مسودة' : (rawName || 'بدون اسم');
  const initial = safeName.charAt(0) || '؟';
  const date = new Date(app.created_at).toLocaleDateString('ar-IQ', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const telRaw = app.telegram || '';
  const telParts = telRaw.includes('|') ? telRaw.split('|') : [telRaw, ''];
  const numericChatId = telParts[0] || '';
  const username = telParts[1] || '';
  const phoneRaw = (app.phone || telParts[2] || '').toString().trim();

  document.getElementById('det-avatar').innerText = initial;
  document.getElementById('det-name').innerText = safeName;
  document.getElementById('det-id').innerText = String(app.id);
  document.getElementById('det-date').innerText = date;
  document.getElementById('det-contrib').innerText = app.contribution || '-';
  document.getElementById('det-track-badge').innerText = app.track || 'غير محدد';

  const statusBadge = document.getElementById('det-status-badge');
  if (statusBadge) {
    statusBadge.className = `status-badge status-${escapeHtml(app.status)}`;
    statusBadge.innerText = getStatusText(app.status);
  }

  let telHtml = '-';
  if (username) {
    telHtml = `<a href="https://t.me/${escapeHtml(username.replace(/^@/, ''))}" target="_blank" rel="noopener" class="tg-link"><i class="fa-brands fa-telegram"></i> @${escapeHtml(username.replace(/^@/, ''))}</a>`;
    if (numericChatId) telHtml += ` <span style="font-size:11px; color:var(--text-muted);">(${numericChatId})</span>`;
  } else if (numericChatId) {
    telHtml = `<span style="font-family:monospace;">ID: ${numericChatId}</span>`;
  }
  document.getElementById('det-telegram').innerHTML = telHtml;

  let phoneHtml = '-';
  const btnWa = document.getElementById('det-btn-wa');
  if (phoneRaw) {
    phoneHtml = `<a href="tel:${escapeHtml(phoneRaw.replace(/[^0-9+]/g, ''))}" dir="ltr" style="font-family:monospace; color:var(--text-main); font-weight:700;"><i class="fa-solid fa-phone" style="color:var(--success);"></i> ${escapeHtml(phoneRaw)}</a>`;
    const waUrl = formatWhatsAppUrl(phoneRaw, safeName);
    if (btnWa) {
      btnWa.href = waUrl;
      btnWa.style.display = 'inline-flex';
    }
  } else {
    if (btnWa) btnWa.style.display = 'none';
  }
  document.getElementById('det-phone').innerHTML = phoneHtml;

  const modal = document.getElementById('detailsModal');
  if (modal) modal.classList.add('show');
};

window.closeDetailsModal = function() {
  const modal = document.getElementById('detailsModal');
  if (modal) modal.classList.remove('show');
};

window.previewFromDetails = function() {
  if (!currentDetailsId) return;
  const id = currentDetailsId;
  closeDetailsModal();
  previewTicket(id);
};

window.msgFromDetails = function() {
  if (!currentDetailsId) return;
  const id = currentDetailsId;
  closeDetailsModal();
  openPrivateMsgModal(id);
};

window.editFromDetails = function() {
  if (!currentDetailsId) return;
  const id = currentDetailsId;
  closeDetailsModal();
  openEditModal(id);
};

// ── Print Official Roster ──
window.printOfficialRoster = function() {
  const rows = currentFilteredRows();
  if (!rows || rows.length === 0) {
    showToast('لا توجد بيانات مطابقة للطباعة', 'error');
    return;
  }

  const printSection = document.getElementById('printSection');
  if (!printSection) return;

  const trackLabel = currentTrack === 'all' ? 'جميع المسارات' : currentTrack;
  const filterLabel = getStatusText(currentFilter) || 'الكل';
  const printDate = new Date().toLocaleDateString('ar-IQ', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  let tableRows = rows.map((app, idx) => {
    const rawName = (app.full_name || '').trim();
    const safeName = rawName.toUpperCase() === 'DRAFT_USER' ? 'مسودة' : (rawName || '-');
    const phone = (app.phone || '').toString().trim() || '-';
    const contrib = app.contribution || '-';
    const status = getStatusText(app.status);
    return `<tr>
      <td style="text-align:center;">${idx + 1}</td>
      <td><b>${escapeHtml(safeName)}</b></td>
      <td>${escapeHtml(app.track || '-')}</td>
      <td>${escapeHtml(contrib)}</td>
      <td dir="ltr" style="text-align:right;">${escapeHtml(phone)}</td>
      <td style="text-align:center;">${status}</td>
      <td style="width:120px;"></td>
    </tr>`;
  }).join('');

  printSection.innerHTML = `
    <div class="print-header">
      <h1>🎓 مهرجان التخرج الرسمي — كشف الحضور والتكريم</h1>
      <div class="print-meta">
        <span><b>المسار:</b> ${escapeHtml(trackLabel)}</span>
        <span><b>الحالة:</b> ${escapeHtml(filterLabel)}</span>
        <span><b>العدد الإجمالي:</b> ${rows.length} طالب</span>
        <span><b>تاريخ الطباعة:</b> ${printDate}</span>
      </div>
    </div>
    <table class="print-table">
      <thead>
        <tr>
          <th style="width:36px; text-align:center;">ت</th>
          <th>الاسم الرباعي للطالب</th>
          <th>المسار الأكاديمي</th>
          <th>المساهمة</th>
          <th>رقم الهاتف</th>
          <th style="text-align:center;">الحالة</th>
          <th style="text-align:center;">توقيع الاستلام</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    <div class="print-signatures">
      <div class="sig-block">
        <div>مسؤول التسجيل والتدقيق</div>
        <div style="margin-top:35pt;">........................</div>
      </div>
      <div class="sig-block">
        <div>رئيس اللجنة التنظيمية</div>
        <div style="margin-top:35pt;">........................</div>
      </div>
    </div>
  `;

  window.print();
};

// Delete Applicant Function
window.deleteApplication = async function(id) {
  const app = allApplications.find(a => String(a.id) === String(id));
  const name = app ? (app.full_name || app.name || 'المشترك') : 'المشترك';

  showConfirmDialog(
    '<i class="fa-solid fa-trash" style="color:var(--danger);"></i> تأكيد الحذف النهائي',
    `تحذير: هل أنت متأكد من حذف طلب المشترك <b>${escapeHtml(name)}</b> نهائياً من قاعدة البيانات؟ لا يمكن التراجع عن هذا الإجراء.`,
    async () => {
      try {
        await dbFetch('DELETE', `?id=eq.${id}`);
        showToast(`تم حذف طلب (${name}) بنجاح`);
        await loadApplications();
      } catch (err) {
        showToast(err.message || 'حدث خطأ أثناء حذف الطلب', 'error');
        console.error(err);
      }
    },
    'btn-danger',
    '<i class="fa-solid fa-trash"></i> حذف نهائي'
  );
};
// ── Private & Broadcast Messaging System ───────────────────────────
let currentPmRecipient = null;

const MSG_TEMPLATES = {
  pm: {
    reminder: "مرحباً {name} 👋\n\nنود تذكيرك بالموعد المحدد لفعاليات مهرجان التخرج الطلابي 2026. يرجى التواجد في الوقت المحدد والاحتفاظ ببطاقة الدخول الرسمية.\n\nنتطلع لرؤيتك! ✨",
    info_request: "أهلاً بك {name} 📝\n\nيرجى التواصل معنا لتأكيد واستكمال بعض التفاصيل الخاصة بطلب تسجيلك في المهرجان لضمان إصدار وثائقك بشكل سليم.",
    welcome: "أهلاً بك {name} 🎉\n\nتمت مراجعة وتأكيد تسجيلك في مهرجان التخرج الطلابي بنجاح. يسعدنا جداً انضمامك إلى هذا الحدث الاستثنائي!",
    urgent: "⚠️ <b>تنبيه عاجل وهام:</b>\n\nعزيزنا {name}، يرجى مراجعة إدارة التنظيم بخصوص طلبك في أقرب وقت."
  },
  bc: {
    event_reminder: "📢 <b>إعلان رسمي هام لجميع المشاركين:</b>\n\nنود إعلامكم بالاستعداد لانطلاق فعاليات مهرجان التخرج الطلابي 2026. يرجى من جميع المسجلين مراجعة بطاقات الدخول الرسمية وتجهيز متطلبات الحضور.\n\nنتمنى لكم يوماً مميزاً ومليئاً بالإنجاز! 🎓✨",
    rehearsal: "🎓 <b>موعد البروفة الرسمية للتخرج:</b>\n\nيرجى من جميع الخريجين المشاركين الحضور في القاعة المركزية لإجراء البروفة الميدانية والاصطفاف الأكاديمي.\n\n⏰ الموعد: يرجى التواجد قبل نصف ساعة من الموعد المقرر.",
    tickets_ready: "🎫 <b>تنويه رسمي بخصوص بطاقات الدخول:</b>\n\nتم اعتماد وإصدار البطاقات الرقمية ووثائق الشروط لجميع المقبولين. يمكنكم الآن استلام وتنزيل بطاقاتكم عبر كتابة /doc للبوت مباشرة.\n\nمبارك لجميع المتخرجين! 🎉"
  }
};

// Quick Template Applicator
window.applyTemplate = function(type, key) {
  const template = MSG_TEMPLATES[type]?.[key];
  if (!template) return;

  if (type === 'pm') {
    const name = currentPmRecipient?.name || 'عزيزنا المشترك';
    const text = template.replace(/{name}/g, name);
    const input = document.getElementById('pm-message-input');
    if (input) input.value = text;
  } else if (type === 'bc') {
    const input = document.getElementById('broadcast-message-input');
    if (input) input.value = template;
  }
};

// Private Message Functions
window.openPrivateMsgModal = function(id) {
  const app = allApplications.find(a => String(a.id) === String(id));
  if (!app) return;
  const name = app.full_name || app.name || 'المشترك';
  const telRaw = app.telegram || '';
  const chatId = telRaw.includes('|') ? telRaw.split('|')[0] : telRaw;

  if (!chatId) {
    showToast('لا يمكن مراسلة هذا المستخدم: لا يوجد آيدي تيليجرام صالح', 'error');
    return;
  }

  currentPmRecipient = { id, name, chatId };
  const modal = document.getElementById('privateMsgModal');
  const nameEl = document.getElementById('pm-recipient-name');
  const chatIdEl = document.getElementById('pm-recipient-chatid');
  const input = document.getElementById('pm-message-input');

  if (nameEl) nameEl.innerText = name;
  if (chatIdEl) chatIdEl.innerHTML = `<i class="fa-solid fa-id-badge"></i> ID: ${escapeHtml(chatId)}`;
  if (input) input.value = '';

  if (modal) modal.classList.add('show');
};

window.closePrivateMsgModal = function() {
  const modal = document.getElementById('privateMsgModal');
  if (modal) modal.classList.remove('show');
  currentPmRecipient = null;
};

window.sendPrivateMessage = async function() {
  if (!currentPmRecipient || !currentPmRecipient.chatId) {
    showToast('خطأ: لم يتم تحديد مستلم صالح', 'error');
    return;
  }

  const input = document.getElementById('pm-message-input');
  const msg = input?.value.trim();
  if (!msg) {
    showToast('يرجى كتابة نص الرسالة أولاً', 'error');
    if (input) input.focus();
    return;
  }

  const sendBtn = document.getElementById('pm-send-btn');
  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
  }

  try {
    const fullText = `<blockquote><b>رسالة خاصة من إدارة مهرجان التخرج</b>\n\n${msg}</blockquote>`;
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: currentPmRecipient.chatId,
        text: fullText,
        parse_mode: 'HTML'
      })
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.description || 'فشل إرسال الرسالة عبر تيليجرام');
    }

    showToast(`تم إرسال الرسالة بنجاح إلى (${currentPmRecipient.name})`);
    closePrivateMsgModal();
  } catch (err) {
    showToast(err.message || 'حدث خطأ أثناء الإرسال', 'error');
    console.error(err);
  } finally {
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال الرسالة';
    }
  }
};

// Broadcast Functions
window.openBroadcastModal = function() {
  const modal = document.getElementById('broadcastModal');
  const input = document.getElementById('broadcast-message-input');
  const progressBox = document.getElementById('broadcast-progress-box');
  
  if (input) input.value = '';
  if (progressBox) progressBox.style.display = 'none';
  
  updateBroadcastCount();
  if (modal) modal.classList.add('show');
};

window.closeBroadcastModal = function() {
  const modal = document.getElementById('broadcastModal');
  if (modal) modal.classList.remove('show');
};

function getBroadcastRecipients() {
  const audience = document.getElementById('broadcast-audience')?.value || 'all';
  
  let targetApps = allApplications.filter(app => {
    const telRaw = app.telegram || '';
    const chatId = telRaw.includes('|') ? telRaw.split('|')[0] : telRaw;
    // ponytail: accept numeric ids incl. negative channel ids (-100...); reject only non-numeric
    if (!/^-?\d+$/.test(chatId.trim())) return false;

    if (audience === 'all') return true;
    if (audience === 'accepted') return app.status === 'accepted';
    if (audience === 'pending') return app.status === 'pending';
    if (audience === 'rejected') return app.status === 'rejected';
    if (audience === 'track') return currentTrack === 'all' || app.track === currentTrack;
    return true;
  });

  // Deduplicate by chat_id
  const uniqueMap = new Map();
  targetApps.forEach(app => {
    const telRaw = app.telegram || '';
    const chatId = telRaw.includes('|') ? telRaw.split('|')[0] : telRaw;
    if (chatId && !uniqueMap.has(chatId)) {
      uniqueMap.set(chatId, app);
    }
  });

  return Array.from(uniqueMap.values());
}

window.updateBroadcastCount = function() {
  const recipients = getBroadcastRecipients();
  const countEl = document.getElementById('broadcast-target-count');
  if (countEl) {
    countEl.innerText = `${recipients.length} مستخدم`;
  }
};

window.sendBroadcastMessage = async function() {
  const input = document.getElementById('broadcast-message-input');
  const msg = input?.value.trim();
  if (!msg) {
    showToast('يرجى كتابة نص الإشعار الجماعي أولاً', 'error');
    if (input) input.focus();
    return;
  }

  const recipients = getBroadcastRecipients();
  if (recipients.length === 0) {
    showToast('لا يوجد مستلمون مطابقون للفئة المحددة', 'error');
    return;
  }

  showConfirmDialog(
    '<i class="fa-solid fa-bullhorn" style="color:#8b5cf6;"></i> تأكيد الإرسال الجماعي',
    `هل أنت متأكد من إرسال هذا الإشعار إلى <b>${recipients.length}</b> مشترك؟`,
    async () => { await runBroadcast(); },
    'btn-success',
    '<i class="fa-solid fa-paper-plane"></i> إرسال'
  );
};

window.runBroadcast = async function() {
  const input = document.getElementById('broadcast-message-input');
  const msg = input?.value.trim();
  if (!msg) { showToast('يرجى كتابة نص الإشعار الجماعي أولاً', 'error'); return; }

  const recipients = getBroadcastRecipients();
  if (recipients.length === 0) {
    showToast('لا يوجد مستلمون مطابقون للفئة المحددة', 'error');
    return;
  }

  const sendBtn = document.getElementById('broadcast-send-btn');
  const progressBox = document.getElementById('broadcast-progress-box');
  const progressStatus = document.getElementById('broadcast-progress-status');
  const progressPercent = document.getElementById('broadcast-progress-percent');
  const progressFill = document.getElementById('broadcast-progress-fill');
  const closeBtn = document.getElementById('broadcast-close-btn');

  if (sendBtn) { sendBtn.disabled = true; }
  if (closeBtn) closeBtn.style.display = 'none';
  if (progressBox) progressBox.style.display = 'flex';

  let successCount = 0;
  let failCount = 0;
  const total = recipients.length;
  const fullText = `<blockquote><b>إشعار عام — مهرجان التخرج الطلابي 2026</b>\n\n${msg}</blockquote>`;

  for (let i = 0; i < total; i++) {
    const app = recipients[i];
    const telRaw = app.telegram || '';
    const chatId = telRaw.includes('|') ? telRaw.split('|')[0] : telRaw;

    const currentProgress = Math.round(((i + 1) / total) * 100);
    if (progressStatus) progressStatus.innerText = `جاري الإرسال (${i + 1} من ${total})...`;
    if (progressPercent) progressPercent.innerText = `${currentProgress}%`;
    if (progressFill) progressFill.style.width = `${currentProgress}%`;

    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: fullText,
          parse_mode: 'HTML'
        })
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (err) {
      failCount++;
    }

    if (i < total - 1) {
      await new Promise(r => setTimeout(r, 120));
    }
  }

  showToast(`اكتمل الإرسال الجماعي: ${successCount} نجح، ${failCount} فشل`);

  setTimeout(() => {
    if (closeBtn) closeBtn.style.display = '';
    if (sendBtn) sendBtn.disabled = false;
    if (progressBox) progressBox.style.display = 'none';
    closeBroadcastModal();
  }, 1200);
};


// Keyboard Shortcuts & Modal Escape Handler
window.addEventListener('keydown', (e) => {
  // Escape to close all modals
  if (e.key === 'Escape') {
    window.closePreviewModal?.();
    window.closePrivateMsgModal?.();
    window.closeBroadcastModal?.();
    window.closeEditModal?.();
    window.closeConfirmModal?.();
    window.closeAddModal?.();
    window.closeDetailsModal?.();
    window.closeSettingsModal?.();
    window.closeActivityModal?.();
  }
  // Quick search shortcut: / or Ctrl+F / Ctrl+K
  if ((e.ctrlKey && (e.key === 'f' || e.key === 'F' || e.key === 'k' || e.key === 'K')) || (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA')) {
    e.preventDefault();
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }
  // Alt+N for adding a new applicant
  if (e.altKey && (e.key === 'n' || e.key === 'N')) {
    e.preventDefault();
    window.openAddModal?.();
  }
  // Alt+P for printing official roster
  if (e.altKey && (e.key === 'p' || e.key === 'P')) {
    e.preventDefault();
    window.printOfficialRoster?.();
  }
});

// Close Modals on click outside
window.addEventListener('click', (e) => {
  const ticketModal = document.getElementById('ticketModal');
  const pmModal = document.getElementById('privateMsgModal');
  const bcModal = document.getElementById('broadcastModal');
  const editModal = document.getElementById('editAppModal');
  const confirmModal = document.getElementById('confirmModal');
  const addModal = document.getElementById('addAppModal');
  const detModal = document.getElementById('detailsModal');
  const setModal = document.getElementById('settingsModal');

  if (e.target === ticketModal) window.closePreviewModal?.();
  if (e.target === pmModal) window.closePrivateMsgModal?.();
  if (e.target === bcModal) window.closeBroadcastModal?.();
  if (e.target === editModal) window.closeEditModal?.();
  if (e.target === confirmModal) window.closeConfirmModal?.();
  if (e.target === addModal) window.closeAddModal?.();
  if (e.target === detModal) window.closeDetailsModal?.();
  if (e.target === setModal) window.closeSettingsModal?.();
  if (e.target === document.getElementById('activityModal')) window.closeActivityModal?.();
});
// Dark Mode Toggle
window.toggleTheme = function() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || document.body.getAttribute('data-theme') === 'dark';
  const icon = document.getElementById('theme-icon');
  const text = document.getElementById('theme-text');
  
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
    if (icon) icon.className = 'fa-solid fa-moon';
    if (text) text.innerText = 'الوضع الليلي';
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.setAttribute('data-theme', 'dark');
    if (icon) icon.className = 'fa-solid fa-sun';
    if (text) text.innerText = 'الوضع النهاري';
    localStorage.setItem('theme', 'dark');
  }
};

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  document.body.setAttribute('data-theme', 'dark');
  const icon = document.getElementById('theme-icon');
  const text = document.getElementById('theme-text');
  if (icon) icon.className = 'fa-solid fa-sun';
  if (text) text.innerText = 'الوضع النهاري';
}

// Auto-Refresh Polling (every 30 seconds)
window.toggleAutoRefresh = function() {
  isAutoRefreshActive = !isAutoRefreshActive;
  const navText = document.getElementById('auto-refresh-text');
  const navIcon = document.getElementById('auto-refresh-icon');

  if (isAutoRefreshActive) {
    startAutoRefresh();
    if (navText) navText.innerText = 'التحديث التلقائي (مفعل)';
    if (navIcon) navIcon.className = 'fa-solid fa-rotate';
    showToast('تم تفعيل التحديث التلقائي');
  } else {
    stopAutoRefresh();
    if (navText) navText.innerText = 'التحديث التلقائي (معطل)';
    if (navIcon) navIcon.className = 'fa-solid fa-pause';
    showToast('تم إيقاف التحديث التلقائي');
  }
};

function startAutoRefresh() {
  stopAutoRefresh();
  const interval = settings.refresh > 0 ? settings.refresh * 1000 : 30000;
  autoRefreshTimer = setInterval(() => {
    loadApplications(false);
  }, interval);
}

function stopAutoRefresh() {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer);
    autoRefreshTimer = null;
  }
}

// Mobile Sidebar Toggle
window.toggleMobileSidebar = function() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
};

// Export to CSV (Filtered or All)
window.exportToCSV = function(onlyFiltered = true) {
  const dataset = (onlyFiltered && window.__filteredCache && window.__filteredCache.length > 0)
    ? window.__filteredCache
    : allApplications;
  if (dataset.length === 0) {
    showToast('لا توجد بيانات لتصديرها', 'error');
    return;
  }
  const headers = ['التاريخ', 'الاسم الرباعي', 'المسار', 'المساهمة', 'تيليجرام', 'الهاتف', 'الحالة'];
  const rows = dataset.map(app => {
    const telRaw = app.telegram || '';
    const telParts = telRaw.includes('|') ? telRaw.split('|') : [telRaw, ''];
    const displayUsername = telParts[1] || telParts[0] || '-';
    const phone = app.phone || telParts[2] || '-';
    return [
      new Date(app.created_at).toLocaleDateString('ar-IQ'),
      `"${((app.full_name || '').toUpperCase() === 'DRAFT_USER' ? '' : (app.full_name || '')).replace(/"/g, '""')}"`,
      `"${(app.track || '').replace(/"/g, '""')}"`,
      `"${(app.contribution || '').replace(/"/g, '""')}"`,
      `"${displayUsername.replace(/"/g, '""')}"`,
      `"${phone.toString().replace(/"/g, '""')}"`,
      getStatusText(app.status)
    ];
  });

  const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const filterSuffix = (onlyFiltered && currentFilter !== 'all') ? `_${currentFilter}` : '';
  link.download = `Graduation_Applicants${filterSuffix}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast(`تم تصدير (${dataset.length}) سجل بنجاح!`);
};

// Batch Print Tickets
window.bulkPrintTickets = function() {
  let targets = [];
  if (selectedIds.size > 0) {
    targets = allApplications.filter(a => selectedIds.has(String(a.id)));
  } else {
    targets = allApplications.filter(a => a.status === 'accepted');
  }

  if (targets.length === 0) {
    showToast('لا توجد بطاقات متاحة للطباعة (حدد طلبات أولاً أو تأكد من وجود مقبولين)', 'error');
    return;
  }

  const printSection = document.getElementById('printSection');
  if (!printSection) return;

  const ticketsHtml = targets.map(app => {
    const rawName = (app.full_name || '').trim();
    const safeName = rawName.toUpperCase() === 'DRAFT_USER' ? 'مسودة' : (rawName || 'مشترك');
    const shortId = (app.id || "0000").split("-")[0].toUpperCase();
    const fullCode = `TU-PASS-2026-${shortId}`;
    const track = app.track || 'المسار العام';
    const date = new Date(app.created_at).toLocaleDateString('ar-IQ', { year: 'numeric', month: 'short', day: 'numeric' });

    return `
      <div class="print-ticket-badge">
        <div class="pt-header">
          <span class="pt-brand">🎓 مهرجان التخرج 2026</span>
          <span class="pt-badge">VIP PASS</span>
        </div>
        <div>
          <div class="pt-name">${escapeHtml(safeName)}</div>
          <div class="pt-track">${escapeHtml(track)}</div>
        </div>
        <div class="pt-footer">
          <span class="pt-code">${fullCode}</span>
          <span>${date}</span>
        </div>
      </div>
    `;
  }).join('');

  printSection.innerHTML = `
    <div class="print-header">
      <h1>🎓 بطاقات الدخول الرسمية — دفعة طباعة (${targets.length} بطاقة)</h1>
      <div class="print-meta">
        <span><b>العدد الإجمالي:</b> ${targets.length}</span>
        <span><b>تاريخ الطباعة:</b> ${new Date().toLocaleDateString('ar-IQ')}</span>
      </div>
    </div>
    <div class="print-tickets-grid">
      ${ticketsHtml}
    </div>
  `;

  window.print();
};

// ── Administrative Activity Logging ──
const ACTIVITY_LOG_KEY = 'jemo_activity_log';

window.logActivity = function(action, details, type = 'info') {
  try {
    const raw = localStorage.getItem(ACTIVITY_LOG_KEY);
    const logs = raw ? JSON.parse(raw) : [];
    logs.unshift({
      timestamp: Date.now(),
      action,
      details,
      type
    });
    if (logs.length > 50) logs.pop();
    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to log activity', e);
  }
};

window.openActivityModal = function() {
  const modal = document.getElementById('activityModal');
  const container = document.getElementById('activityLogList');
  if (!modal || !container) return;

  try {
    const raw = localStorage.getItem(ACTIVITY_LOG_KEY);
    const logs = raw ? JSON.parse(raw) : [];

    if (logs.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:32px 16px; color:var(--text-muted);">
          <i class="fa-solid fa-clock-rotate-left" style="font-size:32px; margin-bottom:10px; opacity:0.5;"></i>
          <div style="font-weight:700;">لا توجد عمليات مسجلة حتى الآن</div>
          <div style="font-size:12px; margin-top:4px;">ستظهر العمليات الإدارية (قبول، رفض، تعديل، حذف) هنا تلقائياً.</div>
        </div>
      `;
    } else {
      const getIcon = (type) => {
        if (type === 'accept') return '<i class="fa-solid fa-check"></i>';
        if (type === 'reject') return '<i class="fa-solid fa-xmark"></i>';
        if (type === 'add') return '<i class="fa-solid fa-user-plus"></i>';
        if (type === 'delete') return '<i class="fa-solid fa-trash"></i>';
        if (type === 'msg') return '<i class="fa-solid fa-paper-plane"></i>';
        if (type === 'edit') return '<i class="fa-solid fa-pen"></i>';
        return '<i class="fa-solid fa-info"></i>';
      };

      const formatTime = (ts) => {
        const diff = Date.now() - ts;
        if (diff < 60000) return 'الآن';
        if (diff < 3600000) return `منذ ${Math.floor(diff / 60000)} دقيقة`;
        if (diff < 86400000) return `منذ ${Math.floor(diff / 3600000)} ساعة`;
        return new Date(ts).toLocaleDateString('ar-IQ', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      };

      container.innerHTML = logs.map(l => `
        <div class="activity-item">
          <div class="activity-icon ${escapeHtml(l.type)}">${getIcon(l.type)}</div>
          <div class="activity-details">
            <div class="activity-text">${escapeHtml(l.action)}</div>
            <div class="activity-sub">${escapeHtml(l.details)}</div>
          </div>
          <span class="activity-time">${formatTime(l.timestamp)}</span>
        </div>
      `).join('');
    }
  } catch (e) {
    container.innerHTML = '<div style="color:var(--danger); padding:16px;">خطأ في قراءة السجل</div>';
  }

  modal.classList.add('show');
};

window.closeActivityModal = function() {
  const modal = document.getElementById('activityModal');
  if (modal) modal.classList.remove('show');
};

window.clearActivityLog = function() {
  localStorage.removeItem(ACTIVITY_LOG_KEY);
  openActivityModal();
  showToast('تم مسح سجل العمليات الإدارية');
};

// ════════════════════════════════════════════════════════════════════
// SETTINGS
// ════════════════════════════════════════════════════════════════════
const SETTINGS_KEY = 'jemo_admin_settings';

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) Object.assign(settings, JSON.parse(raw));
  } catch (e) { /* ponytail: ignore corrupt storage, use defaults */ }
  const saved = parseInt(localStorage.getItem('jemo_page_size'), 10);
  pageSize = isNaN(saved) ? 25 : saved; // 0 = show all
}
window.saveAdminSettings = function() {
  const refresh = parseInt(document.getElementById('set-refresh')?.value, 10);
  const density = document.getElementById('set-density')?.value;
  const defFilter = document.getElementById('set-default-filter')?.value;
  settings.refresh = isNaN(refresh) ? 30 : refresh;
  if (density === 'compact' || density === 'comfortable') settings.density = density;
  if (['all', 'pending', 'accepted', 'rejected'].includes(defFilter)) settings.defaultFilter = defFilter;
  settings.confirmDestructive = !!document.getElementById('set-confirm')?.checked;
  settings.resetFilterOnRefresh = !!document.getElementById('set-reset-filter')?.checked;
  settings.soundFeedback = !!document.getElementById('set-sound')?.checked;
  settings.pinLock = !!document.getElementById('set-pin-lock')?.checked;
  const pinVal = document.getElementById('set-pin-val')?.value.trim();
  if (pinVal) settings.adminPin = pinVal;
  saveSettings();
  applyDensity();
  applyRefreshInterval();
  checkLockState();
  closeSettingsModal();
  showToast('تم حفظ الإعدادات');
};

window.togglePinInput = function(checked) {
  const group = document.getElementById('pinConfigGroup');
  if (group) group.style.display = checked ? 'block' : 'none';
};


function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function applyDensity() {
  document.body.classList.toggle('density-compact', settings.density === 'compact');
}

window.openSettingsModal = function() {
  document.getElementById('set-refresh').value = String(settings.refresh);
  document.getElementById('set-default-filter').value = settings.defaultFilter;
  document.getElementById('set-density').value = settings.density;
  document.getElementById('set-confirm').checked = settings.confirmDestructive;
  document.getElementById('set-reset-filter').checked = settings.resetFilterOnRefresh;
  const soundEl = document.getElementById('set-sound');
  if (soundEl) soundEl.checked = settings.soundFeedback !== false;
  const pinLockEl = document.getElementById('set-pin-lock');
  if (pinLockEl) pinLockEl.checked = !!settings.pinLock;
  const pinValEl = document.getElementById('set-pin-val');
  if (pinValEl) pinValEl.value = settings.adminPin || '2026';
  window.togglePinInput(!!settings.pinLock);
  document.getElementById('settingsModal').classList.add('show');
};

window.closeSettingsModal = function() {
  document.getElementById('settingsModal').classList.remove('show');
};

window.resetSettings = function() {
  settings = { refresh: 30, defaultFilter: 'all', density: 'comfortable', confirmDestructive: true, resetFilterOnRefresh: true, pinLock: false, adminPin: '2026', soundFeedback: true };
  saveSettings();
  applyDensity();
  document.getElementById('pageSize').value = '25';
  pageSize = 25;
  localStorage.setItem('jemo_page_size', '25');
  applyRefreshInterval();
  const el = document.querySelector(`.filter-btn[data-filter="${currentFilter}"]`);
  if (el) setFilter(currentFilter, el);
  openSettingsModal();
  showToast('تمت استعادة الإعدادات الافتراضية');
};


// ── PIN Security Lock System ──
window.checkLockState = function() {
  const navLockBtn = document.getElementById('nav-lock-btn');
  if (navLockBtn) navLockBtn.style.display = settings.pinLock ? 'flex' : 'none';

  if (settings.pinLock && sessionStorage.getItem('jemo_unlocked') !== 'true') {
    const overlay = document.getElementById('lockOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
      const input = document.getElementById('lockPinInput');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 200);
      }
    }
  } else {
    const overlay = document.getElementById('lockOverlay');
    if (overlay) overlay.style.display = 'none';
  }
};

window.submitUnlockPin = function() {
  const input = document.getElementById('lockPinInput');
  const errMsg = document.getElementById('lockErrorMsg');
  const entered = (input?.value || '').trim();
  const expected = String(settings.adminPin || '2026').trim();

  if (entered === expected) {
    sessionStorage.setItem('jemo_unlocked', 'true');
    if (errMsg) errMsg.innerText = '';
    const overlay = document.getElementById('lockOverlay');
    if (overlay) overlay.style.display = 'none';
    showToast('تم التحقق وإلغاء القفل بنجاح');
    playAudioBeep(true);
  } else {
    if (errMsg) errMsg.innerText = 'رمز المرور غير صحيح، يرجى المحاولة ثانية';
    playAudioBeep(false);
    if (input) {
      input.value = '';
      input.focus();
    }
  }
};

window.lockDashboard = function() {
  sessionStorage.removeItem('jemo_unlocked');
  checkLockState();
  showToast('تم قفل لوحة التحكم');
};

// ── Full JSON Database Backup ──
window.backupDataJSON = function() {
  const backup = {
    festival: 'مهرجان التخرج 2026',
    exportDate: new Date().toISOString(),
    totalApplications: allApplications.length,
    applications: allApplications
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Jemo_Admin_Backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast('تم تصدير النسخة الاحتياطية بنجاح!');
};
function applyRefreshInterval() {
  isAutoRefreshActive = settings.refresh > 0;
  if (isAutoRefreshActive) {
    startAutoRefresh();
  } else {
    stopAutoRefresh();
  }
  const navText = document.getElementById('auto-refresh-text');
  const navIcon = document.getElementById('auto-refresh-icon');
  if (navText) navText.innerText = isAutoRefreshActive ? 'التحديث التلقائي (مفعل)' : 'التحديث التلقائي (معطل)';
  if (navIcon) navIcon.className = isAutoRefreshActive ? 'fa-solid fa-rotate' : 'fa-solid fa-pause';
}

window.changePageSize = function(val) {
  const n = parseInt(val, 10);
  pageSize = isNaN(n) ? 25 : n; // 0 = show all
  localStorage.setItem('jemo_page_size', String(pageSize));
  currentPage = 1;
  renderTable();
};


// ════════════════════════════════════════════════════════════════════
// PAGINATION
// PAGINATION
// ════════════════════════════════════════════════════════════════════
function totalPages(count) {
  if (pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(count / pageSize));
}

function renderPagination(count) {
  const el = document.getElementById('pagination');
  if (!el) return;
  if (pageSize <= 0 || count <= pageSize) { el.style.display = 'none'; el.innerHTML = ''; return; }
  const pages = totalPages(count);
  if (currentPage > pages) currentPage = pages;
  if (currentPage < 1) currentPage = 1;

  const parts = [];
  parts.push(`<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})"><i class="fa-solid fa-chevron-right"></i></button>`);
  const win = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || (p >= currentPage - 2 && p <= currentPage + 2)) win.push(p);
    else if (win[win.length - 1] !== '...') win.push('...');
  }
  win.forEach(p => {
    if (p === '...') parts.push('<span class="page-ellipsis">…</span>');
    else parts.push(`<button class="page-btn ${p === currentPage ? 'active' : ''}" onclick="goToPage(${p})">${p}</button>`);
  });
  parts.push(`<button class="page-btn" ${currentPage === pages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})"><i class="fa-solid fa-chevron-left"></i></button>`);
  el.innerHTML = parts.join('');
  el.style.display = 'flex';
}

window.goToPage = function(p) {
  currentPage = p;
  renderTable();
  const tc = document.getElementById('tableContainer');
  if (tc) tc.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

// ════════════════════════════════════════════════════════════════════
// BULK SELECTION
// ════════════════════════════════════════════════════════════════════
window.isSelected = function(id) { return selectedIds.has(String(id)); };

window.toggleRow = function(id, checked) {
  if (checked) selectedIds.add(String(id));
  else selectedIds.delete(String(id));
  updateBulkBar();
};

window.toggleSelectAll = function(checked) {
  const rows = currentFilteredRows();
  if (checked) rows.forEach(a => selectedIds.add(String(a.id)));
  else rows.forEach(a => selectedIds.delete(String(a.id)));
  renderTable();
};

window.clearSelection = function() {
  selectedIds.clear();
  updateBulkBar();
  renderTable();
};

function updateBulkBar() {
  const bar = document.getElementById('bulkBar');
  if (!bar) return;
  const visible = currentFilteredRows().length;
  if (selectedIds.size === 0) { bar.style.display = 'none'; }
  else { bar.style.display = 'flex'; }
  document.getElementById('bulkCount').innerText = `عدد المحدد: ${selectedIds.size}`;
  const selAll = document.getElementById('selectAll');
  if (selAll) selAll.checked = visible > 0 && visible === selectedIds.size && visible === currentFilteredRows().length;
}

function currentFilteredRows() {
  return (window.__filteredCache || []);
}

// Bulk ops reuse existing per-row dbFetch; grouped via in.() for status/delete
async function bulkPatchStatus(ids, status, verb) {
  const list = [...ids];
  if (list.length === 0) return;
  const inList = list.map(id => `"${id}"`).join(',');
  try {
    await dbFetch('PATCH', `?id=in.(${inList})`, { status });
    if (status === 'accepted') {
      for (const id of list) {
        const a = allApplications.find(x => String(x.id) === String(id));
        if (a) {
          sendStudentApprovalNotification({ ...a, status: 'accepted' }).catch(() => {});
        }
      }
    }
    showToast(`تم ${verb} (${list.length}) طلب بنجاح`);
    clearSelection();
    await loadApplications();
  } catch (e) {
    showToast(e.message || `فشل في ${verb}`, 'error');
    console.error(e);
  }
}

async function bulkDelete(ids) {
  const list = [...ids];
  if (list.length === 0) return;
  const inList = list.map(id => `"${id}"`).join(',');
  try {
    await dbFetch('DELETE', `?id=in.(${inList})`);
    showToast(`تم حذف (${list.length}) طلب بنجاح`);
    clearSelection();
    await loadApplications();
  } catch (e) {
    showToast(e.message || 'فشل في الحذف', 'error');
    console.error(e);
  }
}

window.bulkAccept = function() {
  const ids = [...selectedIds];
  if (!ids.length) return;
  showConfirmDialog(
    '<i class="fa-solid fa-circle-check" style="color:var(--success);"></i> تأكيد قبول المحدد',
    `هل أنت متأكد من قبول <b>${ids.length}</b> طلب محدد؟ (لن يتم إرسال البطاقات تلقائياً في الوضع الجماعي)`,
    async () => { await bulkPatchStatus(selectedIds, 'accepted', 'قبول'); }
  );
};

window.bulkReject = function() {
  const ids = [...selectedIds];
  if (!ids.length) return;
  showConfirmDialog(
    '<i class="fa-solid fa-circle-xmark" style="color:var(--danger);"></i> تأكيد رفض المحدد',
    `هل أنت متأكد من رفض <b>${ids.length}</b> طلب محدد؟`,
    async () => { await bulkPatchStatus(selectedIds, 'rejected', 'رفض'); }
  );
};

window.bulkDelete = function() {
  const ids = [...selectedIds];
  if (!ids.length) return;
  if (!settings.confirmDestructive) { bulkDelete(selectedIds); return; }
  showConfirmDialog(
    '<i class="fa-solid fa-trash" style="color:var(--danger);"></i> تأكيد حذف المحدد',
    `تحذير: سيتم حذف <b>${ids.length}</b> طلب نهائياً ولا يمكن التراجع.`,
    async () => { await bulkDelete(selectedIds); },
    'btn-danger',
    '<i class="fa-solid fa-trash"></i> حذف نهائي'
  );
};

window.bulkMessage = async function() {
  const ids = [...selectedIds];
  if (!ids.length) return;
  const apps = allApplications.filter(a => selectedIds.has(String(a.id)));
  const text = prompt(`اكتب الرسالة التي ستُرسل إلى ${ids.length} مشترك:`);
  if (!text || !text.trim()) return;
  // reuse Telegram loop pattern from broadcast
  let ok = 0, fail = 0;
  for (const app of apps) {
    const telRaw = app.telegram || '';
    const chatId = telRaw.includes('|') ? telRaw.split('|')[0] : telRaw;
    if (!chatId) { fail++; continue; }
    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: `🏛 <b>مهرجان التخرج — رسالة من الإدارة</b>\n━━━━━━━━━━━━━━━━━━━━━━\n${text}`, parse_mode: 'HTML' })
      });
      const data = await res.json();
      if (res.ok && data.ok) ok++; else fail++;
    } catch (e) { fail++; }
    await new Promise(r => setTimeout(r, 120));
  }
  showToast(`الرسالة الجماعية: ${ok} نجح، ${fail} فشل`);
};

// ════════════════════════════════════════════════════════════════════
// HOOKS INTO EXISTING renderTable / loadApplications
// ════════════════════════════════════════════════════════════════════
// renderTable is patched below to (a) cache filtered rows, (b) add a
// checkbox column, (c) slice by page. loadApplications patched to apply
// default filter & preserve selection reset behavior.

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const sm = document.getElementById('settingsModal');
    if (sm && sm.classList.contains('show')) window.closeSettingsModal();
  }
});
window.addEventListener('click', (e) => {
  const sm = document.getElementById('settingsModal');
  if (sm && e.target === sm) window.closeSettingsModal();
});

// Initialize
loadSettings();
applyDensity();
const ps = document.getElementById('pageSize');
if (ps) ps.value = String(pageSize);
applyRefreshInterval();
loadApplications();

// ════════════════════════════════════════════════════════════════════
// TELEGRAM WEBAPP INTEGRATION & AUTH
// ════════════════════════════════════════════════════════════════════
const ADMIN_USERNAMES = ['alijemo'];
const ADMIN_CHAT_IDS = ['6427981020', '123456'];

function initTelegramWebApp() {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    try {
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();
      if (tg.colorScheme === 'dark' || !document.body.classList.contains('dark-theme')) {
        document.body.classList.add('dark-theme');
        const themeIcon = document.getElementById('theme-icon');
        const themeText = document.getElementById('theme-text');
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
        if (themeText) themeText.innerText = 'الوضع النهاري';
      }
      // Sync Telegram BackButton with open modals
      if (tg.BackButton) {
        tg.BackButton.onClick(() => {
          const openModal = document.querySelector('.modal.show');
          if (openModal) {
            if (openModal.id === 'scannerModal' && typeof window.closeScannerModal === 'function') {
              window.closeScannerModal();
            } else {
              openModal.classList.remove('show');
            }
            return;
          }
          const sidebar = document.getElementById('sidebar');
          if (sidebar && sidebar.classList.contains('open') && typeof window.toggleMobileSidebar === 'function') {
            window.toggleMobileSidebar();
          }
        });

        const updateBackButton = () => {
          const hasModal = !!document.querySelector('.modal.show');
          const hasSidebar = document.getElementById('sidebar')?.classList.contains('open');
          if (hasModal || hasSidebar) {
            tg.BackButton.show();
          } else {
            tg.BackButton.hide();
          }
        };

        const observer = new MutationObserver(updateBackButton);
        observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
      }
    } catch (e) {}
    const user = tg.initDataUnsafe?.user;
    if (user) {
      const uname = (user.username || '').toLowerCase().replace(/^@/, '');
      const uid = String(user.id);
      if (!ADMIN_USERNAMES.includes(uname) && !ADMIN_CHAT_IDS.includes(uid)) {
        document.body.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:24px;text-align:center;font-family:'Cairo',sans-serif;background:#0f172a;color:#fff;">
            <div style="width:68px;height:68px;border-radius:20px;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
              <i class="fa-solid fa-shield-halved" style="font-size:32px;color:#ef4444;"></i>
            </div>
            <h2 style="font-size:20px;font-weight:900;margin-bottom:8px;">عذراً، لوحة الإدارة مخصصة للمشرفين فقط</h2>
            <p style="color:#94a3b8;font-size:14px;max-width:320px;line-height:1.6;margin-bottom:20px;">
              الحساب الحالي (@${uname || uid}) غير مدرج ضمن قائمة المشرفين المصرح لهم بإدارة الحفل.
            </p>
            <button onclick="window.Telegram.WebApp.close()" style="background:#2563eb;color:#fff;border:none;padding:10px 24px;border-radius:12px;font-family:inherit;font-weight:700;font-size:14px;cursor:pointer;">
              إغلاق
            </button>
          </div>
        `;
        return false;
      }
    }
  }
  return true;
}

// ════════════════════════════════════════════════════════════════════
// BARCODE SCANNER & ATTENDANCE CHECK-IN
// ════════════════════════════════════════════════════════════════════
let html5QrCode = null;
let isScannerRunning = false;

window.openScannerModal = function() {
  const modal = document.getElementById('scannerModal');
  if (modal) modal.classList.add('show');
  toggleScannerCamera();
};

window.closeScannerModal = async function() {
  if (html5QrCode && isScannerRunning) {
    await html5QrCode.stop().catch(() => {});
    html5QrCode = null;
    isScannerRunning = false;
  }
  const modal = document.getElementById('scannerModal');
  if (modal) modal.classList.remove('show');
  const resBox = document.getElementById('scanResultContainer');
  if (resBox) resBox.style.display = 'none';
  const laser = document.getElementById('scannerLaser');
  if (laser) laser.style.display = 'none';
  const prompt = document.getElementById('scannerPrompt');
  if (prompt) prompt.style.display = 'block';
  const btnText = document.getElementById('camBtnText');
  if (btnText) btnText.innerText = 'تشغيل الكاميرا';
};

window.toggleScannerCamera = async function() {
  const prompt = document.getElementById('scannerPrompt');
  const laser = document.getElementById('scannerLaser');
  const btnText = document.getElementById('camBtnText');

  if (isScannerRunning) {
    if (html5QrCode) {
      await html5QrCode.stop().catch(() => {});
      html5QrCode = null;
    }
    isScannerRunning = false;
    if (btnText) btnText.innerText = 'تشغيل الكاميرا';
    if (prompt) prompt.style.display = 'block';
    if (laser) laser.style.display = 'none';
    return;
  }

  try {
    if (prompt) prompt.style.display = 'none';
    if (laser) laser.style.display = 'block';
    html5QrCode = new Html5Qrcode("scannerReader");
    await html5QrCode.start(
      { facingMode: "environment" },
      { fps: 15, qrbox: { width: 240, height: 240 }, aspectRatio: 1.0 },
      (decodedText) => handleScannerPayload(decodedText),
      () => {}
    );
    isScannerRunning = true;
    if (btnText) btnText.innerText = 'إيقاف الكاميرا';
  } catch (err) {
    if (laser) laser.style.display = 'none';
    if (prompt) prompt.style.display = 'block';
    showToast('تعذر تشغيل الكاميرا: ' + (err.message || err), 'error');
  }
};

window.handleImageQrScan = async function(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const scanner = html5QrCode || new Html5Qrcode("scannerReader");
  try {
    const text = await scanner.scanFile(file, true);
    handleScannerPayload(text);
  } catch (err) {
    showToast('لم يتم العثور على رمز QR صالح في الصورة', 'error');
  }
};

function playAudioBeep(success = true) {
  if (settings.soundFeedback === false) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = success ? 880 : 330;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {}
}

window.handleScannerPayload = async function(payload) {
  let targetId = '';
  try {
    const parsed = JSON.parse(payload);
    targetId = parsed.id || '';
  } catch (e) {
    targetId = String(payload).replace(/^TU-2026-|^TU-PASS-2026-|^JEMO-/i, '').trim();
  }

  const app = allApplications.find(a => 
    String(a.id).toLowerCase() === targetId.toLowerCase() ||
    String(a.id).toLowerCase().startsWith(targetId.toLowerCase())
  );

  const resBox = document.getElementById('scanResultContainer');
  if (!resBox) return;
  resBox.style.display = 'block';

  if (!app) {
    playAudioBeep(false);
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
    }
    resBox.innerHTML = `
      <div style="padding:14px; border-radius:12px; background:var(--danger-light); border:1px solid var(--danger); color:var(--danger); text-align:center;">
        <i class="fa-solid fa-triangle-exclamation" style="font-size:22px; margin-bottom:6px;"></i>
        <div style="font-weight:800; font-size:14px;">رمز غير مسجل</div>
        <div style="font-size:12px; margin-top:2px;">لم يتم العثور على طالب يطابق الرمز: ${escapeHtml(targetId || payload)}</div>
      </div>
    `;
    return;
  }

  playAudioBeep(true);
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
  }

  const isAccepted = app.status === 'accepted' || app.status === 'attended';
  const famTxt = Number(app.family_count) > 0 ? `${app.family_count} مقاعد عائلية` : 'حضور فردي';

  if (app.status === 'accepted') {
    try {
      await dbFetch('PATCH', `?id=eq.${app.id}`, { status: 'attended' });
      app.status = 'attended';
      window.logActivity?.('تسجيل حضور', `تم تثبيت حضور الطالب (${app.full_name || app.name}) عند البوابة`, 'accept');
      loadApplications();
    } catch (e) {
      console.warn('Could not update attendance status:', e);
    }
  }

  resBox.innerHTML = `
    <div style="padding:16px; border-radius:14px; background:var(--surface); border:1.5px solid ${isAccepted ? 'var(--success)' : 'var(--warning)'}; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span style="font-size:11px; font-weight:800; padding:3px 10px; border-radius:100px; background:${isAccepted ? 'var(--success-light)' : 'var(--warning-light)'}; color:${isAccepted ? 'var(--success)' : 'var(--warning)'}; border:1px solid ${isAccepted ? 'var(--success)' : 'var(--warning)'};">
          ${isAccepted ? '✓ تم القبول وتثبيت الحضور' : '⚠️ قيد المراجعة / غير معتمد'}
        </span>
        <span style="font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--text-muted); direction:ltr;">
          TU-2026-${(app.id || '').slice(0, 8).toUpperCase()}
        </span>
      </div>
      <div style="font-size:17px; font-weight:900; color:var(--text-main);">${escapeHtml(app.full_name || app.name)}</div>
      <div style="font-size:12.5px; color:var(--text-muted); margin-top:4px;">
        <span>🎓 ${escapeHtml(app.track || '-')}</span> • <span>👥 ${famTxt}</span>
      </div>
      ${app.phone ? `<div style="font-size:12px; color:var(--primary); margin-top:4px;" dir="ltr">📞 ${escapeHtml(app.phone)}</div>` : ''}
      <div style="display:flex; gap:8px; margin-top:14px;">
        <button class="action-btn btn-primary" style="flex:1;" onclick="openDetailsModal('${app.id}'); closeScannerModal();">
          <i class="fa-solid fa-id-card"></i> عرض الملف الكامل
        </button>
      </div>
    </div>
  `;
};

// Initialize Telegram
initTelegramWebApp();

// Backward-compatible aliases
window.handleCheckinPayload = window.handleScannerPayload;
window.loadStudents = window.loadApplications;
window.loadStats = function() {
  if (typeof updateStatsCards === 'function') updateStatsCards();
};
window.playBeep = playAudioBeep;
checkLockState();

