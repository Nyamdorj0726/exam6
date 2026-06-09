// ============== ТӨЛӨВ ==============
let isLoggedIn = false;
let currentUser = null;

// ============== ХУУДАС СОЛИХ ==============
function navigateTo(pageName) {
  // Хуудаснууд солих
  document.querySelectorAll('.page').forEach(p => {
    p.classList.toggle('active', p.dataset.page === pageName);
  });

  // Цэсний идэвхтэй төлөв шинэчлэх
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageName);
  });

  // Mobile цэс хаах
  document.getElementById('mainNav').classList.remove('show');

  // Дээш гүйлгэх
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Бүх цэсний холбоосуудад event тохируулах
document.querySelectorAll('[data-page]').forEach(el => {
  if (el.tagName === 'A') {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(el.dataset.page);
    });
  }
});

// ============== BURGER ЦЭС ==============
document.getElementById('burgerBtn').addEventListener('click', () => {
  document.getElementById('mainNav').classList.toggle('show');
});

// ============== MODAL УДИРДЛАГА ==============
function openModal(id) {
  document.getElementById(id).classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
  document.body.style.overflow = '';
}

// Overlay дээр дарвал хаах
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    }
  });
});

// ESC товч дарвал бүх modal хаах
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay').forEach(o => o.classList.remove('show'));
    document.body.style.overflow = '';
  }
});

// ============== НЭВТРЭЛТ ==============
document.getElementById('signInBtn').addEventListener('click', () => {
  if (isLoggedIn) {
    // Гарах
    isLoggedIn = false;
    currentUser = null;
    document.getElementById('signInLabel').textContent = 'Нэвтрэх';
    showToast('Та системээс гарлаа');
  } else {
    openModal('loginModal');
  }
});

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  // const pass = document.getElementById('loginPass').value;

  // Энд бодит ажиллагаанд серверт хүсэлт явуулна. Жишээ:
  isLoggedIn = true;
  currentUser = email.split('@')[0];
  document.getElementById('signInLabel').textContent = currentUser;
  closeModal('loginModal');
  showToast('Амжилттай нэвтэрлээ! 🎉');
}

// ============== ХАМГААЛАЛТТАЙ ҮЙЛДЛҮҮД ==============
// (Хичээл, дасгал, үнэлгээ нь зөвхөн нэвтэрсэн сурагчдад)

function openLesson(title, grade, type) {
  if (!isLoggedIn) {
    openModal('authRequiredModal');
    return;
  }
  document.getElementById('lmTitle').textContent = title;
  document.getElementById('lmGrade').textContent = grade;
  // Modal-ыг үндсэн төлөвт тохируулах
  document.querySelectorAll('.mode-btn').forEach((b, i) => {
    b.classList.toggle('active', i === 0);
  });
  setLessonViewer('video');
  openModal('lessonModal');
}

function openExercise(action) {
  if (!isLoggedIn) {
    openModal('authRequiredModal');
    return;
  }
  if (action === 'solution') {
    showToast('Бодолт, тайлбар нээгдэж байна...');
  }
}

function openAssessment(action) {
  if (!isLoggedIn) {
    openModal('authRequiredModal');
    return;
  }
  if (action === 'view') {
    showToast('Үнэлгээний дэлгэрэнгүй нээгдэж байна...');
  } else if (action === 'cert') {
    showToast('Сертификат татаж байна... 🏆');
  }
}

// ============== ХИЧЭЭЛИЙН ҮЗЭХ ХЭЛБЭР СОЛИХ ==============
function switchMode(btn, mode) {
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  setLessonViewer(mode);
}

function setLessonViewer(mode) {
  const viewer = document.getElementById('lessonViewer');
  if (mode === 'video') {
    viewer.innerHTML = `
      <div class="video-placeholder">
        <a href="https://www.youtube.com/watch?v=xisrv27PWEY" target="_blank"><i class="fa-solid fa-circle-play"></i></a>
        <p style="font-size:12px; opacity:0.7; margin-top:6px;">Үзэхийн тулд тоглуулагч дээр дарна уу</p>
      </div>`;
  } else {
    viewer.innerHTML = `
      <div class="video-placeholder">
        <i class="fa-solid fa-file-pdf"></i>
        <p>Слайд / PDF -ээр хичээл үзэх</p>
        <a href="/VIII.6.1 - 6.2.pdf" target="_blank"><p style="font-size:12px; opacity:0.7; margin-top:6px;">PDF татах</p></a>
        
      </div>`;
  }
}

// ============== УЛИРАЛ СОЛИХ ==============
function switchQuarter(btn, quarter) {
  document.querySelectorAll('.qtab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  showToast(`${quarter}-р улирлын үнэлгээ ачаалж байна...`);
}

// ============== TOAST МЭДЭГДЭЛ ==============
function showToast(message) {
  // Хуучин toast-уудыг устгах
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: linear-gradient(135deg, #6366f1, #a855f7);
    color: white;
    padding: 14px 24px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
    z-index: 300;
    opacity: 0;
    transition: all 0.3s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  `;
  document.body.appendChild(toast);

  // Animation
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';
  });

  // 3 секундын дараа арилгах
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============== ЭХЭНД АЖИЛЛАХ ==============
console.log('%c🎓 EduHub ачаалагдлаа', 'background:linear-gradient(135deg,#6366f1,#ec4899); color:white; padding:8px 16px; border-radius:8px; font-weight:bold;');
