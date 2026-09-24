/**
 * ==========================================================================
 * PORTOFOLIO SYAH NUR FAJRI - SISWA RPL SMK TELKOM LAMPUNG
 * File: script.js
 * Fitur: Typewriter, Proyek Filter & Modal, Scrollspy, Counter, Form & Toast
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. DYNAMIC TYPEWRITER EFFECT ---
  const typewriterElement = document.getElementById('typewriter');
  const words = [
    'Web Developer',
    'Siswa RPL SMK Telkom Lampung',
    'Frontend & UI/UX Enthusiast',
    'Junior Fullstack Explorer',
    'Problem Solver & Clean Coder'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    if (!typewriterElement) return;

    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1600; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400; // Pause before next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // --- 2. MOBILE NAVIGATION DRAWER ---
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerClose = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.add('active');
    drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    menuToggle?.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.remove('active');
    drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    menuToggle?.setAttribute('aria-expanded', 'false');
  }

  menuToggle?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close drawer on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('active')) {
      closeDrawer();
    }
  });

  // --- 3. SCROLLSPY (ACTIVE NAV LINK HIGHLIGHT) ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // --- 4. ANIMATED STATS NUMBER COUNTER ---
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasCounted = false;

  function runCounters() {
    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.textContent.includes('%') ? '%' : '+';
      const duration = 1800; // ms
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const stepTime = duration / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = `${target}${suffix}`;
          clearInterval(timer);
        } else {
          counter.textContent = `${Math.ceil(current)}${suffix}`;
        }
      }, stepTime);
    });
  }

  const statsSection = document.querySelector('.stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasCounted) {
          hasCounted = true;
          runCounters();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  } else {
    runCounters();
  }

  // --- 5. PROJECT FILTERING LOGIC ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        
        if (filterValue === 'all' || categories.split(' ').includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --- 6. PROJECT DETAIL MODAL DATA & CONTROLLER ---
  const projectDatabase = {
    sims: {
      category: 'Sistem Informasi Manajemen Sekolah',
      title: 'SIMS Telkom - Sistem Informasi Manajemen Sekolah',
      year: '2025',
      desc: 'SIMS Telkom merupakan aplikasi portal akademik terintegrasi yang dirancang khusus untuk mempermudah tata kelola data siswa di jurusan Rekayasa Perangkat Lunak (RPL) SMK Telkom Lampung. Dibangun dengan fokus pada efisiensi pengelolaan nilai, jadwal pelajaran kejuruan, serta data guru dan wali kelas.',
      features: [
        'Autentikasi Multi-User: Hak akses terpisah untuk Administrator, Guru Pengampu, dan Siswa RPL.',
        'Manajemen Nilai & Rapor: Input nilai tugas, kuis, dan ujian kompetensi kejuruan dengan kalkulasi otomatis.',
        'Jadwal & Agenda Kelas: Visualisasi jadwal mata pelajaran produktif RPL dan laboratorium komputer.',
        'Export Data: Ekspor rekap data siswa dan nilai ke format PDF dan spreadsheet Excel.',
        'Dashboard Statistik: Visualisasi grafik persentase kehadiran dan ketuntasan materi siswa.'
      ],
      tags: ['PHP Native', 'MySQL', 'Bootstrap 5', 'JavaScript', 'Chart.js', 'FPDF'],
      mockupHtml: `
        <div class="mockup-screen mockup-sims" style="height: 220px;">
          <div class="mockup-header">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            <span class="mockup-url">https://sims.smktelkom-lpg.sch.id/dashboard</span>
          </div>
          <div class="mockup-body">
            <div class="mock-sidebar" style="width: 20%;"></div>
            <div class="mock-main" style="gap: 12px;">
              <div class="mock-banner" style="height: 35px; background: linear-gradient(90deg, #0284c7, #00f2fe);"></div>
              <div class="mock-cards-row" style="height: 40px;">
                <div class="mock-mini-card" style="height: 40px; background: rgba(0, 242, 254, 0.15);"></div>
                <div class="mock-mini-card" style="height: 40px; background: rgba(56, 189, 248, 0.15);"></div>
                <div class="mock-mini-card" style="height: 40px; background: rgba(16, 185, 129, 0.15);"></div>
              </div>
              <div class="mock-table" style="height: 55px;"></div>
            </div>
          </div>
        </div>
      `
    },
    perpus: {
      category: 'Web App & Database',
      title: 'E-Perpus Telkom - Katalog & Sirkulasi Buku Digital',
      year: '2025',
      desc: 'E-Perpus Telkom adalah solusi perpustakaan modern SMK Telkom Lampung untuk mendigitalkan sirkulasi peminjaman buku kejuruan RPL, buku umum, dan modul praktikum. Menggantikan pencatatan manual buku tamu perpustakaan dengan kode identifikasi digital.',
      features: [
        'Katalog Buku Digital: Pencarian cepat buku berdasarkan judul, pengarang, ISBN, atau kategori kejuruan.',
        'Sistem QR Code: Pembuatan QR Code unik untuk setiap kartu anggota siswa dan buku.',
        'Perhitungan Denda Otomatis: Deteksi keterlambatan pengembalian buku dan rekap status sirkulasi.',
        'Manajemen Stok Buku: Notifikasi ketersediaan buku yang sedang dipinjam oleh siswa lain.',
        'Laporan Bulanan: Rekap statistik literasi buku terpopuler yang dipinjam siswa SMK Telkom Lampung.'
      ],
      tags: ['PHP MVC', 'MySQL', 'JavaScript', 'HTML5 Semantic', 'QR Code Generator API', 'CSS Grid'],
      mockupHtml: `
        <div class="mockup-screen mockup-perpus" style="height: 220px;">
          <div class="mockup-header">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            <span class="mockup-url">https://eperpus.smktelkom-lampung.sch.id</span>
          </div>
          <div class="mockup-body" style="flex-direction: column; gap: 12px;">
            <div class="mock-search-bar" style="height: 28px;"></div>
            <div class="mock-book-grid" style="grid-template-columns: repeat(4, 1fr); gap: 12px; height: 110px;">
              <div class="mock-book" style="background: linear-gradient(135deg, #0369a1, #0ea5e9);"></div>
              <div class="mock-book" style="background: linear-gradient(135deg, #0284c7, #00f2fe);"></div>
              <div class="mock-book" style="background: linear-gradient(135deg, #0f766e, #14b8a6);"></div>
              <div class="mock-book" style="background: linear-gradient(135deg, #4338ca, #6366f1);"></div>
            </div>
          </div>
        </div>
      `
    },
    presensi: {
      category: 'IoT & Web Dashboard',
      title: 'Portal Presensi Siswa IoT & Dashboard Realtime',
      year: '2026',
      desc: 'Proyek kolaboratif kejuruan RPL SMK Telkom Lampung yang menggabungkan sensor reader kartu RFID dengan platform web monitoring kehadiran. Setiap siswa menempelkan kartu pelajar saat tiba di gerbang atau laboratorium, dan data presensi langsung diperbarui ke dashboard sekolah.',
      features: [
        'Real-time Tap-in Detection: Menerima payload tap-in kartu siswa dalam milidetik via REST API.',
        'Log Kehadiran Langsung: Tampilan status hadir, terlambat, izin, atau tanpa keterangan secara instan.',
        'Notifikasi Otomatis: Integrasi webhook untuk pengiriman log kehadiran berkala.',
        'Filter Kelas & Jurusan: Mempermudah wali kelas RPL memantau kehadiran siswa per jam pelajaran.',
        'Analisis Tren Kehadiran: Visualisasi data kehadiran mingguan dan bulanan.'
      ],
      tags: ['JavaScript ES6', 'PHP REST API', 'Node.js Basics', 'MySQL', 'CSS Flexbox/Grid', 'IoT Hardware'],
      mockupHtml: `
        <div class="mockup-screen mockup-presensi" style="height: 220px;">
          <div class="mockup-header">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            <span class="mockup-url">https://presensi-iot.telkom-lpg.id/live</span>
          </div>
          <div class="mockup-body" style="flex-direction: column; gap: 10px;">
            <div class="mock-stat-badge" style="height: 28px; background: rgba(16, 185, 129, 0.25);"></div>
            <div class="mock-live-feed" style="gap: 8px;">
              <div class="feed-row active" style="height: 26px;"></div>
              <div class="feed-row" style="height: 26px;"></div>
              <div class="feed-row" style="height: 26px;"></div>
            </div>
          </div>
        </div>
      `
    },
    tapis: {
      category: 'Frontend & E-Commerce UMKM',
      title: 'TapisCraft - Katalog Digital Kerajinan Tapis Lampung',
      year: '2025',
      desc: 'TapisCraft dikembangkan sebagai proyek mata pelajaran Produk Kreatif dan Kewirausahaan (PKK) di SMK Telkom Lampung. Bertujuan mempromosikan warisan kain Tapis dan suvenir khas daerah Lampung melalui antarmuka web modern yang estetik dan interaktif.',
      features: [
        'Katalog Interaktif Produk: Filter produk berdasarkan kategori (Kain Tapis Tradisional, Selempang, Tas, & Souvenir).',
        'Simulasi Keranjang Belanja: Menggunakan Browser LocalStorage agar data pesanan tetap tersimpan.',
        'Generator Pesanan WhatsApp: Menghasilkan pesan checkout terformat rapi yang otomatis terhubung ke WhatsApp pengrajin lokal.',
        'Galeri Detail Motif: Tampilan zoom dan penjelasan makna filosofis motif tapis khas Lampung.',
        'Desain Responsif Penuh: Pengalaman belanja yang lancar di layar ponsel maupun desktop.'
      ],
      tags: ['HTML5 Semantic', 'Modern CSS Glassmorphism', 'JavaScript ES6', 'LocalStorage API', 'Responsive UI'],
      mockupHtml: `
        <div class="mockup-screen mockup-tapis" style="height: 220px;">
          <div class="mockup-header">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            <span class="mockup-url">https://tapis-lampung.store</span>
          </div>
          <div class="mockup-body" style="flex-direction: column; gap: 12px;">
            <div class="mock-hero-banner" style="height: 50px; background: linear-gradient(90deg, #b45309, #d97706);"></div>
            <div class="mock-product-row" style="gap: 12px; height: 90px;">
              <div class="mock-prod" style="background: rgba(245, 158, 11, 0.2);"></div>
              <div class="mock-prod" style="background: rgba(245, 158, 11, 0.2);"></div>
              <div class="mock-prod" style="background: rgba(245, 158, 11, 0.2);"></div>
            </div>
          </div>
        </div>
      `
    },
    coderpl: {
      category: 'Web Tool & Media Belajar',
      title: 'CodeRPL - Kalkulator Sistem Bilangan & Kuis Algoritma',
      year: '2025',
      desc: 'Web utility yang dibuat Syah Nur Fajri untuk membantu rekan-rekan siswa baru di jurusan RPL SMK Telkom Lampung memahami konsep dasar sistem komputer, konversi sistem bilangan digital, dan latihan soal logika pemrograman dasar.',
      features: [
        'Multi-Base Converter: Konversi simultan antara basis Biner (2), Oktal (8), Desimal (10), dan Heksadesimal (16).',
        'Representasi Bit Interaktif: Visualisasi bit 1 dan 0 dengan tombol toggle interaktif.',
        'Kuis Logika Pemrograman: Modul kuis interaktif seputar if-else, looping, dan dasar algoritma dengan skor real-time.',
        'Rumus & Catatan Langkah: Menampilkan langkah perhitungan manual agar mempermudah proses belajar siswa.',
        'Dark Sea-Blue UI: Tema antarmuka ramah mata yang nyaman digunakan saat belajar di lab komputer.'
      ],
      tags: ['Vanilla JavaScript', 'CSS Custom Properties', 'HTML5', 'DOM Scripting', 'Algorithm Logic'],
      mockupHtml: `
        <div class="mockup-screen mockup-coderpl" style="height: 220px;">
          <div class="mockup-header">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            <span class="mockup-url">https://coderpl-tools.dev/converter</span>
          </div>
          <div class="mockup-body" style="flex-direction: column; gap: 12px;">
            <div class="mock-code-box" style="height: 60px; background: #040914;"></div>
            <div class="mock-converter-inputs" style="gap: 10px; height: 60px;">
              <div class="input-line" style="background: rgba(0, 242, 254, 0.15);"></div>
              <div class="input-line" style="background: rgba(56, 189, 248, 0.15);"></div>
            </div>
          </div>
        </div>
      `
    },
    porto: {
      category: 'Personal Portfolio Web',
      title: 'Sea-Blue Developer Portfolio Syah Nur Fajri',
      year: '2026',
      desc: 'Situs portofolio pribadi bertema Sea-Blue modern yang dirancang secara khusus untuk mempresentasikan karya, kompetensi kejuruan, dan identitas Syah Nur Fajri sebagai siswa Rekayasa Perangkat Lunak (RPL) SMK Telkom Lampung.',
      features: [
        'Sea-Blue Oceanic Aesthetics: Gradasi warna laut dalam dengan aksen neon cyan dan efek glassmorphism.',
        'Tanpa Dependensi Framework Berat: Dibangun 100% menggunakan HTML5, Vanilla CSS3, dan JavaScript murni.',
        'Arsitektur 3 File Rapi: Struktur bersih dan mudah dipelihara (index.html, style.css, script.js).',
        'Interaktivitas Penuh: Dilengkapi modal dialog, filter proyek, animasi typewriter, dan sistem toast.',
        'Formulir Kontak Validasi: Pemeriksaan format input secara langsung sebelum pengiriman pesan.'
      ],
      tags: ['HTML5 Semantic', 'Vanilla CSS3', 'JavaScript ES6+', 'Modern UI/UX', 'SEO Friendly'],
      mockupHtml: `
        <div class="mockup-screen mockup-porto" style="height: 220px; align-items: center; justify-content: center;">
          <div class="mockup-header" style="width: 100%;">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            <span class="mockup-url">https://syahnurfajri.dev</span>
          </div>
          <div class="mockup-body" style="flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
            <div class="mock-hero-avatar" style="width: 55px; height: 55px;"></div>
            <div style="width: 120px; height: 12px; background: var(--cyan-primary); border-radius: 4px;"></div>
          </div>
        </div>
      `
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalYear = document.getElementById('modal-year');
  const modalFullDesc = document.getElementById('modal-full-desc');
  const modalFeaturesList = document.getElementById('modal-features-list');
  const modalTags = document.getElementById('modal-tags');
  const modalPreview = document.getElementById('modal-preview');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCloseAction = document.getElementById('modal-close-action');
  const modalContactAction = document.getElementById('modal-contact-action');

  function openProjectModal(projectId) {
    const data = projectDatabase[projectId];
    if (!data || !projectModal) return;

    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalYear.textContent = data.year;
    modalFullDesc.textContent = data.desc;

    // Set preview mockup
    modalPreview.innerHTML = data.mockupHtml;

    // Populate features
    modalFeaturesList.innerHTML = '';
    data.features.forEach(feat => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fa-solid fa-check text-cyan"></i> <span>${feat}</span>`;
      modalFeaturesList.appendChild(li);
    });

    // Populate tags
    modalTags.innerHTML = '';
    data.tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag;
      modalTags.appendChild(span);
    });

    if (typeof projectModal.showModal === 'function') {
      projectModal.showModal();
    } else {
      projectModal.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    if (typeof projectModal.close === 'function') {
      projectModal.close();
    } else {
      projectModal.removeAttribute('open');
    }
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      openProjectModal(projectId);
    });
  });

  modalCloseBtn?.addEventListener('click', closeProjectModal);
  modalCloseAction?.addEventListener('click', closeProjectModal);
  modalContactAction?.addEventListener('click', closeProjectModal);

  // Close modal when clicking outside dialog box
  projectModal?.addEventListener('click', (e) => {
    const dialogDimensions = projectModal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      closeProjectModal();
    }
  });

  // --- 7. TOAST NOTIFICATION UTILITY ---
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, type = 'success', duration = 4000) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-info';
    toast.innerHTML = `
      <i class="${iconClass}"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, duration);
  }

  // --- 8. COPY EMAIL BUTTON ---
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailToCopy = 'syahnurfajri.rpl@gmail.com';

  copyEmailBtn?.addEventListener('click', () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(emailToCopy).then(() => {
        showToast('Email Syah Nur Fajri berhasil disalin ke clipboard!', 'success');
      }).catch(() => {
        showToast(`Email: ${emailToCopy}`, 'info');
      });
    } else {
      // Fallback
      showToast(`Email: ${emailToCopy}`, 'info');
    }
  });

  // --- 9. CONTACT FORM VALIDATION & SUBMISSION ---
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function setError(inputElement, errorElementId, message) {
    const errorEl = document.getElementById(errorElementId);
    if (errorEl) {
      errorEl.textContent = message;
    }
    inputElement.style.borderColor = '#ef4444';
  }

  function clearError(inputElement, errorElementId) {
    const errorEl = document.getElementById(errorElementId);
    if (errorEl) {
      errorEl.textContent = '';
    }
    inputElement.style.borderColor = '';
  }

  // Real-time input listeners to clear errors
  nameInput?.addEventListener('input', () => clearError(nameInput, 'name-error'));
  emailInput?.addEventListener('input', () => clearError(emailInput, 'email-error'));
  subjectInput?.addEventListener('input', () => clearError(subjectInput, 'subject-error'));
  messageInput?.addEventListener('input', () => clearError(messageInput, 'message-error'));

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      setError(nameInput, 'name-error', 'Nama lengkap wajib diisi');
      isValid = false;
    } else {
      clearError(nameInput, 'name-error');
    }

    // Validate Email
    if (!emailInput.value.trim()) {
      setError(emailInput, 'email-error', 'Alamat email wajib diisi');
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      setError(emailInput, 'email-error', 'Format email tidak valid (contoh: nama@mail.com)');
      isValid = false;
    } else {
      clearError(emailInput, 'email-error');
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      setError(subjectInput, 'subject-error', 'Subjek pesan wajib diisi');
      isValid = false;
    } else {
      clearError(subjectInput, 'subject-error');
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      setError(messageInput, 'message-error', 'Isi pesan tidak boleh kosong');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      setError(messageInput, 'message-error', 'Pesan terlalu singkat (minimal 10 karakter)');
      isValid = false;
    } else {
      clearError(messageInput, 'message-error');
    }

    if (!isValid) return;

    // Simulate sending with loading state
    if (submitBtn && btnText) {
      submitBtn.disabled = true;
      const originalText = btnText.textContent;
      btnText.textContent = 'Mengirim Pesan...';
      submitBtn.querySelector('i')?.setAttribute('class', 'fa-solid fa-spinner fa-spin');

      setTimeout(() => {
        submitBtn.disabled = false;
        btnText.textContent = originalText;
        submitBtn.querySelector('i')?.setAttribute('class', 'fa-solid fa-paper-plane');

        showToast(`Terima kasih ${nameInput.value.trim()}! Pesan Anda telah terkirim kepada Syah Nur Fajri.`, 'success', 5000);
        contactForm.reset();
      }, 1200);
    }
  });

  // --- 10. BACK TO TOP BUTTON ---
  const backToTopBtn = document.getElementById('back-to-top');

  function toggleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // --- 11. DYNAMIC FOOTER YEAR ---
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --- 12. SUBTLE CARD MOUSE SPOTLIGHT ---
  const glassCards = document.querySelectorAll('.glass-panel');
  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
});
