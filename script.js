// Navegación suave
document.addEventListener('DOMContentLoaded', function() {
    // Navegación suave entre secciones
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Menú hamburguesa para móviles
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Efecto de scroll en el header
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Animaciones de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animaciones
    const animateElements = document.querySelectorAll('.founder-card, .mission, .vision, .stat-item, .pricing-card, .platform-card, .service-card');
    animateElements.forEach(el => observer.observe(el));

    // Contadores animados para estadísticas
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.textContent);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 16);
    };

    // Observer para contadores
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => counterObserver.observe(stat));

    // Reproducción por hover para videos estáticos de Shorts
    const staticShortVideos = document.querySelectorAll('.shorts-grid .short-video');
    staticShortVideos.forEach(v => {
        if (v.dataset.bound === '1') return;
        v.dataset.bound = '1';
        v.muted = true;
        v.addEventListener('mouseenter', () => { try { v.play(); } catch(e) {} });
        v.addEventListener('mouseleave', () => { try { if (document.fullscreenElement) return; v.pause(); } catch(e) {} });
        v.addEventListener('click', () => { try { if (v.paused) v.play(); else v.pause(); } catch(e) {} });
        v.addEventListener('dblclick', () => { try { if (!document.fullscreenElement) v.requestFullscreen?.(); else document.exitFullscreen?.(); } catch(e) {} });
        v.addEventListener('touchstart', () => { try { v.play(); } catch(e) {} }, { passive: true });
    });

    const galleryImages = document.querySelectorAll('.gallery-item .gallery-image');
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            openImageModal(img.src, img.alt || '');
        });
    });
    const galleryOverlays = document.querySelectorAll('.gallery-item .gallery-overlay');
    galleryOverlays.forEach(ov => {
        ov.addEventListener('click', () => {
            const img = ov.closest('.gallery-item')?.querySelector('.gallery-image');
            const src = img?.src || '';
            const alt = img?.alt || '';
            if (src) openImageModal(src, alt);
        });
    });

    // Funcionalidad de botones de plataforma
    const platformButtons = document.querySelectorAll('.platform-btn');
    
    platformButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.closest('.platform-card').dataset.platform;
            showConsultationModal(platform);
        });
    });

    // Funcionalidad de botones de precios
    const pricingButtons = document.querySelectorAll('.pricing-btn');
    
    pricingButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.pricing-card');
            const plan = card.querySelector('h3').textContent;
            const amountEl = card.querySelector('.amount');
            const price = amountEl ? amountEl.textContent : '';
            const features = Array.from(card.querySelectorAll('.pricing-features li')).map(li => li.textContent.trim());
            openWhatsAppConsultation(plan, price, features);
        });
    });

    // Formulario de trabajo
    const jobForm = document.getElementById('jobForm');
    if (jobForm) {
        jobForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleJobSubmission(this);
        });
    }

    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmission(this);
        });
    }

    // Slideshow de fondo en Hero
    (function initHeroSlideshow() {
        const container = document.querySelector('.hero-slideshow');
        if (!container) return;

        const slides = [
            '1a (2).jpeg','1a (3).jpeg','1a (4).jpeg','1a (5).jpeg',
            '1a (6).jpeg','1a (7).jpeg','1a (8).jpeg','1a (9).jpeg','1a (10).jpeg',
            '1a (11).jpeg','1a (12).jpeg','1a (13).jpeg','1a (14).jpeg','1a (15).jpeg'
        ];

        const cacheKey = (src) => 'hero_webp_' + src;
        function generateOptimized(src) {
            return new Promise((resolve) => {
                try {
                    const cached = localStorage.getItem(cacheKey(src));
                    if (cached) return resolve(cached);
                } catch(e) {}
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.decoding = 'async';
                img.onload = function(){
                    try {
                        const targetW = 3840;
                        const w = Math.max(img.naturalWidth || targetW, targetW);
                        const h = Math.round((img.naturalHeight || targetW) * (w / (img.naturalWidth || targetW)));
                        const canvas = document.createElement('canvas');
                        canvas.width = w;
                        canvas.height = h;
                        const ctx = canvas.getContext('2d');
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';
                        ctx.drawImage(img, 0, 0, w, h);
                        const webp = canvas.toDataURL('image/webp', 0.9);
                        try { localStorage.setItem(cacheKey(src), webp); } catch(e) {}
                        resolve(webp);
                    } catch(e) { resolve(src); }
                };
                img.onerror = function(){ resolve(src); };
                img.src = src;
            });
        }
        const optimizedMap = {};
        slides.forEach(s => { generateOptimized(s).then(o => { optimizedMap[s] = o; }); });
        const pick = (s) => optimizedMap[s] || s;

        // Precarga ligera solo de las primeras imágenes
        const preloaded = [];
        [0,1].forEach(i => {
            if (slides[i]) {
                const img = new Image();
                img.src = pick(slides[i]);
                preloaded.push(img);
            }
        });
        const deferPreload = () => {
            slides.slice(2).forEach(src => { const img = new Image(); img.src = pick(src); });
        };
        if ('requestIdleCallback' in window) requestIdleCallback(deferPreload); else setTimeout(deferPreload, 1500);

        // Crear dos capas para transición cruzada
        const imgA = document.createElement('img');
        const imgB = document.createElement('img');
        [imgA, imgB].forEach(img => {
            img.className = 'hero-slide';
            img.alt = '';
            img.decoding = 'async';
            img.loading = 'eager';
            img.setAttribute('sizes', '100vw');
            img.style.opacity = '0';
            container.appendChild(img);
        });

        // Dar mayor prioridad de carga al primer fotograma
        imgA.setAttribute('fetchpriority', 'high');

        let index = 0;
        let showingA = true;
        imgA.src = pick(slides[index]);
        imgA.style.opacity = '1';
        // Preasignar la siguiente imagen para suavizar el primer cambio
        imgB.src = pick(slides[(index + 1) % slides.length]);

        const advance = () => {
            const incoming = showingA ? imgB : imgA;
            const outgoing = showingA ? imgA : imgB;
            index = (index + 1) % slides.length;
            incoming.src = pick(slides[index]);
            // pequeño retraso para asegurar carga antes de mostrar
            setTimeout(() => { incoming.style.opacity = '1'; outgoing.style.opacity = '0'; }, 50);
            showingA = !showingA;
        };

        // Cambiar cada 6 segundos con una transición suave
        setInterval(advance, 6000);
    })();
});

// Función para mostrar modal de consulta
function showConsultationModal(platform) {
    const modal = createModal('Solicitar Consulta', `
        <div class="consultation-form">
            <h4>Consulta por ${platform}</h4>
            <form id="consultationForm">
                <div class="form-group">
                    <label for="petName">Nombre de la mascota:</label>
                    <input type="text" id="petName" name="petName" required>
                </div>
                <div class="form-group">
                    <label for="ownerName">Nombre del propietario:</label>
                    <input type="text" id="ownerName" name="ownerName" required>
                </div>
                <div class="form-group">
                    <label for="phone">Teléfono:</label>
                    <input type="tel" id="phone" name="phone" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="consultationType">Tipo de consulta:</label>
                    <select id="consultationType" name="consultationType" required>
                        <option value="">Seleccionar...</option>
                        <option value="veterinaria">Consulta Veterinaria</option>
                        <option value="zootecnia">Consulta Zootécnica</option>
                        <option value="agronomia">Consulta Agronómica</option>
                        <option value="emergencia">Emergencia</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="description">Descripción del problema:</label>
                    <textarea id="description" name="description" rows="4" required></textarea>
                </div>
                <button type="submit" class="submit-btn">
                    <i class="fas fa-paper-plane"></i>
                    Solicitar Consulta
                </button>
            </form>
        </div>
    `);
    
    const form = modal.querySelector('#consultationForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleConsultationSubmission(this, platform);
    });
}

// Función para mostrar modal de precios
function showPricingModal(plan, price) {
    const modal = createModal('Contratar Plan', `
        <div class="pricing-form">
            <div class="plan-summary">
                <h4>${plan}</h4>
                <p class="plan-price">COP ${price}</p>
            </div>
            <form id="pricingForm">
                <div class="form-group">
                    <label for="clientName">Nombre completo:</label>
                    <input type="text" id="clientName" name="clientName" required>
                </div>
                <div class="form-group">
                    <label for="clientPhone">Teléfono:</label>
                    <input type="tel" id="clientPhone" name="clientPhone" required>
                </div>
                <div class="form-group">
                    <label for="clientEmail">Email:</label>
                    <input type="email" id="clientEmail" name="clientEmail" required>
                </div>
                <div class="form-group">
                    <label for="preferredPlatform">Plataforma preferida:</label>
                    <select id="preferredPlatform" name="preferredPlatform" required>
                        <option value="">Seleccionar...</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="zoom">Zoom</option>
                        <option value="skype">Skype</option>
                        <option value="teams">Microsoft Teams</option>
                        <option value="meet">Google Meet</option>
                        <option value="telegram">Telegram</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="preferredTime">Horario preferido:</label>
                    <select id="preferredTime" name="preferredTime" required>
                        <option value="">Seleccionar...</option>
                        <option value="morning">Mañana (8:00 - 12:00)</option>
                        <option value="afternoon">Tarde (12:00 - 18:00)</option>
                        <option value="evening">Noche (18:00 - 22:00)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="additionalInfo">Información adicional:</label>
                    <textarea id="additionalInfo" name="additionalInfo" rows="3"></textarea>
                </div>
                <button type="submit" class="submit-btn">
                    <i class="fas fa-credit-card"></i>
                    Contratar Plan
                </button>
            </form>
        </div>
    `);
    
    const form = modal.querySelector('#pricingForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handlePricingSubmission(this, plan, price);
    });
}

// Función para crear modales
function createModal(title, content) {
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.querySelector('.modal-overlay:last-child');
    
    // Cerrar modal
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
    
    return modal;
}

function openImageModal(src, alt) {
    const modal = createModal('Imagen', `
        <div class="image-viewer">
            <img src="${src}" alt="${alt}" class="full-image" />
            <button class="image-close-btn" aria-label="Cerrar">×</button>
        </div>
    `);
    const content = modal.querySelector('.modal-content');
    if (content) {
        content.style.width = '100vw';
        content.style.height = '100vh';
        content.style.maxWidth = '100vw';
        content.style.maxHeight = '100vh';
        content.style.overflow = 'hidden';
        content.classList.add('image-modal');
        content.addEventListener('click', function(e) {
            const imgEl = content.querySelector('.full-image');
            if (!imgEl) { modal.remove(); return; }
            if (!e.target.closest('.full-image')) {
                modal.remove();
            }
        });
    }
    const headerEl = modal.querySelector('.modal-header');
    if (headerEl) headerEl.style.display = 'none';
    const body = modal.querySelector('.modal-body');
    if (body) body.style.padding = '0';
    const closeBtn = modal.querySelector('.image-close-btn');
    closeBtn?.addEventListener('click', () => modal.remove());
}

// Función para manejar envío de formulario de trabajo
function handleJobSubmission(form) {
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Simular envío
    setTimeout(() => {
        showNotification('¡Aplicación enviada exitosamente! Te contactaremos pronto.', 'success');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Función para manejar envío de formulario de contacto
function handleContactSubmission(form) {
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Simular envío
    setTimeout(() => {
        showNotification('¡Mensaje enviado exitosamente! Te responderemos pronto.', 'success');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Función para manejar envío de consulta
function handleConsultationSubmission(form, platform) {
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    submitBtn.disabled = true;
    
    // Simular procesamiento
    setTimeout(() => {
        showNotification(`¡Consulta programada exitosamente por ${platform}! Te contactaremos para confirmar la cita.`, 'success');
        document.querySelector('.modal-overlay').remove();
    }, 2000);
}

// Función para manejar contratación de plan
function handlePricingSubmission(form, plan, price) {
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    submitBtn.disabled = true;
    
    // Simular procesamiento
    setTimeout(() => {
        showNotification(`¡Plan ${plan} contratado exitosamente! Te contactaremos para coordinar el pago y la primera consulta.`, 'success');
        document.querySelector('.modal-overlay').remove();
    }, 2000);
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Cerrar manualmente
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Validación en tiempo real para formularios
document.addEventListener('input', function(e) {
    if (e.target.matches('input[type="email"]')) {
        validateEmail(e.target);
    }
    if (e.target.matches('input[type="tel"]')) {
        validatePhone(e.target);
    }
});

function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(input.value)) {
        input.style.borderColor = '#4CAF50';
    } else {
        input.style.borderColor = '#f44336';
    }
}

function validatePhone(input) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (phoneRegex.test(input.value)) {
        input.style.borderColor = '#4CAF50';
    } else {
        input.style.borderColor = '#f44336';
    }
}

// Agregar estilos CSS para modales y notificaciones
const additionalStyles = `
<style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.35);
    backdrop-filter: blur(8px) saturate(140%);
    -webkit-backdrop-filter: blur(8px) saturate(140%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.modal-content {
    background: white;
    border-radius: 15px;
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    color: #2c5530;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
}

.modal-body {
    padding: 1.5rem;
}

.modal-content.image-modal {
    background: transparent;
    box-shadow: none;
    border: none;
    width: 100vw;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
    overflow: hidden;
    border-radius: 0;
}

.modal-content.image-modal .modal-body { padding: 0; }

.image-viewer {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.full-image {
    max-width: 100vw;
    max-height: 100vh;
    object-fit: contain;
}

.image-close-btn {
    position: absolute;
    top: 12px;
    right: calc(33px + env(safe-area-inset-right, 0px));
    background: rgba(0,0,0,0.5);
    color: #fff;
    border: none;
    border-radius: 999px;
    width: 36px;
    height: 36px;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    line-height: 1;
    z-index: 10001;
}

@media (max-width: 768px) {
    .image-close-btn { display: inline-flex; }
}

.consultation-form,
.pricing-form {
    max-width: 100%;
}

.plan-summary {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 10px;
    text-align: center;
    margin-bottom: 1.5rem;
}

.plan-summary h4 {
    color: #2c5530;
    margin-bottom: 0.5rem;
}

.plan-price {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ff6b35;
    margin: 0;
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 10001;
    min-width: 300px;
}

.notification-success {
    border-left: 4px solid #4CAF50;
}

.notification-success i {
    color: #4CAF50;
}

.notification-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #666;
    margin-left: auto;
}

.animate-in {
    animation: slideInUp 0.6s ease-out forwards;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        margin: 1rem;
    }
    
    .notification {
        right: 10px;
        left: 10px;
        min-width: auto;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

// ===== CARRUSEL DE TESTIMONIOS =====
class TestimonialsCarousel {
    constructor() {
        this.track = document.getElementById('testimonials-track');
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.indicators = document.querySelectorAll('.indicator');
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 segundos
        
        this.init();
    }
    
    init() {
        if (!this.track || this.totalSlides === 0) return;
        
        // Event listeners para botones de navegación
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Event listeners para indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pausar autoplay al hacer hover
        const carousel = document.querySelector('.testimonials-carousel');
        carousel?.addEventListener('mouseenter', () => this.pauseAutoPlay());
        carousel?.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Soporte para gestos táctiles
        this.setupTouchEvents();
        
        // Iniciar autoplay
        this.startAutoPlay();
        
        // Actualizar indicadores iniciales
        this.updateIndicators();
    }
    
    goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= this.totalSlides) return;
        
        this.currentSlide = slideIndex;
        const translateX = -slideIndex * 100;
        
        this.track.style.transform = `translateX(${translateX}%)`;
        this.updateIndicators();
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }
    
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoPlay() {
        this.pauseAutoPlay(); // Limpiar cualquier intervalo existente
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    setupTouchEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        const carousel = document.querySelector('.carousel-container');
        if (!carousel) return;
        
        // Touch events
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.pauseAutoPlay();
        });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });
        
        carousel.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diffX = startX - currentX;
            const threshold = 50; // Mínimo desplazamiento para cambiar slide
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            isDragging = false;
            this.startAutoPlay();
        });
        
        // Mouse events para desktop
        carousel.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
            this.pauseAutoPlay();
            e.preventDefault();
        });
        
        carousel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            currentX = e.clientX;
        });
        
        carousel.addEventListener('mouseup', () => {
            if (!isDragging) return;
            
            const diffX = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            isDragging = false;
            this.startAutoPlay();
        });
        
        carousel.addEventListener('mouseleave', () => {
            isDragging = false;
        });
    }
}

// Inicializar el carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para asegurar que todos los elementos estén renderizados
    setTimeout(() => {
        new TestimonialsCarousel();
    }, 100);
});

// Reinicializar el carrusel si la ventana cambia de tamaño
window.addEventListener('resize', () => {
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        // Reinicializar después de un pequeño delay
        setTimeout(() => {
            new TestimonialsCarousel();
        }, 100);
    }
});

// ===== COMENTARIOS CON ESTRELLAS =====
class ReviewsManager {
    constructor() {
        this.storageKey = 'reviewsData_v2';
        this.listEl = document.getElementById('reviews-list');
        this.avgNumberEl = document.getElementById('reviews-average-number');
        this.avgStarsEl = document.getElementById('reviews-average-stars');
        this.countEl = document.getElementById('reviews-count');
        this.sortEl = document.getElementById('reviews-sort');
        this.filterChips = document.querySelectorAll('.filter-chip');
        this.starInputs = document.querySelectorAll('#review-stars .star');
        this.ratingInput = document.getElementById('review-rating');
        this.form = document.getElementById('review-form');
        this.distEls = {
            1: document.getElementById('dist-1'),
            2: document.getElementById('dist-2'),
            3: document.getElementById('dist-3'),
            4: document.getElementById('dist-4'),
            5: document.getElementById('dist-5')
        };
        this.countByStarEls = {
            1: document.getElementById('count-1'),
            2: document.getElementById('count-2'),
            3: document.getElementById('count-3'),
            4: document.getElementById('count-4'),
            5: document.getElementById('count-5')
        };

        this.reviews = this.load();
        this.currentFilter = 'all';
        this.currentSort = 'recent';
        this.init();
    }

    defaultReviews() {
        return [];
    }

    load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (!raw) return this.defaultReviews();
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return this.defaultReviews();
            return parsed;
        } catch (e) {
            return this.defaultReviews();
        }
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.reviews));
        } catch (e) {}
    }

    init() {
        const exists = document.querySelector('.reviews-section');
        if (!exists) return;
        // Optional: reset stored reviews via query param ?resetReviews=1
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get('resetReviews') === '1') {
                this.reviews = [];
                this.save();
                if (typeof showNotification === 'function') {
                    showNotification('Comentarios reiniciados. Ya puedes añadir los tuyos.', 'success');
                }
                // Remove the param from URL without reloading
                params.delete('resetReviews');
                const newUrl = window.location.origin + window.location.pathname + (params.toString() ? '?' + params.toString() : '');
                window.history.replaceState({}, '', newUrl);
            }
        } catch(e) {}
        this.bindStars();
        this.bindFilters();
        this.bindSort();
        this.bindForm();
        this.renderAll();
    }

    bindStars() {
        this.starInputs.forEach(btn => {
            btn.addEventListener('click', () => {
                const val = Number(btn.dataset.value);
                this.setActiveStars(val);
                this.ratingInput.value = String(val);
            });
        });
    }

    setActiveStars(val) {
        this.starInputs.forEach(btn => {
            const v = Number(btn.dataset.value);
            btn.classList.toggle('active', v <= val);
        });
    }

    bindFilters() {
        this.filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                this.filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.currentFilter = chip.dataset.filter || 'all';
                this.renderList();
            });
        });
    }

    bindSort() {
        this.sortEl?.addEventListener('change', () => {
            this.currentSort = this.sortEl.value;
            this.renderList();
        });
    }

    bindForm() {
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = (document.getElementById('review-name')?.value || '').trim();
            const text = (document.getElementById('review-text')?.value || '').trim();
            const rating = Number(this.ratingInput?.value || '0');

            if (!name || !text || rating < 1) {
                showNotification?.('Por favor completa nombre, comentario y calificación.', 'error') || alert('Completa nombre, comentario y calificación.');
                return;
            }

            const review = { name, text, stars: rating, date: Date.now() };
            this.reviews.unshift(review);
            this.save();
            this.form.reset();
            this.setActiveStars(0);
            this.ratingInput.value = '0';
            this.renderAll();
            showNotification?.('¡Gracias por tu comentario!', 'success');
        });
    }

    renderAll() {
        this.renderSummary();
        this.renderList();
    }

    renderSummary() {
        const count = this.reviews.length;
        const sum = this.reviews.reduce((acc, r) => acc + r.stars, 0);
        const avg = count ? (sum / count) : 0;
        this.avgNumberEl.textContent = avg.toFixed(1);
        this.countEl.textContent = String(count);
        this.avgStarsEl.innerHTML = this.renderStarsHTML(Math.round(avg));

        const byStar = {1:0,2:0,3:0,4:0,5:0};
        this.reviews.forEach(r => { byStar[r.stars] = (byStar[r.stars]||0) + 1; });
        Object.keys(byStar).forEach(k => {
            const total = count || 1;
            const pct = Math.round((byStar[k] / total) * 100);
            const fill = this.distEls[k];
            const cnt = this.countByStarEls[k];
            if (fill) fill.style.width = pct + '%';
            if (cnt) cnt.textContent = String(byStar[k]);
        });
    }

    renderStarsHTML(val) {
        let html = '';
        for (let i=1; i<=5; i++) {
            const filled = i <= val;
            html += `<i class="${filled ? 'fas' : 'far'} fa-star"></i>`;
        }
        return html;
    }

    renderList() {
        if (!this.listEl) return;
        let items = [...this.reviews];
        if (this.currentFilter !== 'all') {
            const s = Number(this.currentFilter);
            items = items.filter(r => r.stars === s);
        }
        if (this.currentSort === 'rating') {
            items.sort((a,b) => b.stars - a.stars || b.date - a.date);
        } else {
            items.sort((a,b) => b.date - a.date);
        }

        const groups = [5,4,3,2,1].map(star => ({ star, list: items.filter(r => r.stars === star) }));
        const html = groups.map(g => this.renderGroupHTML(g.star, g.list)).join('');
        this.listEl.innerHTML = html || '<p style="color:#6b7280">Aún no hay comentarios para este filtro.</p>';
    }

    renderGroupHTML(stars, list) {
        if (list.length === 0) return '';
        const header = `<div class="group-header" style="margin:1rem 0"><strong>${stars} estrellas</strong></div>`;
        const items = list.map(r => this.renderCardHTML(r)).join('');
        return header + items;
    }

    renderCardHTML(r) {
        const initial = (r.name || 'A')[0].toUpperCase();
        const date = new Date(r.date);
        const dateStr = date.toLocaleDateString('es-CO', { year:'numeric', month:'short', day:'numeric' });
        const starsHTML = `<span class="rating-stars">${this.renderStarsHTML(r.stars)}</span>`;
        return `
        <div class="review-card">
            <div class="review-header">
                <div class="review-author">
                    <div class="author-avatar">${initial}</div>
                    <div>
                        <div class="author-name">${this.escape(r.name)}</div>
                        <div class="review-meta">${dateStr}</div>
                    </div>
                </div>
                ${starsHTML}
            </div>
            <div class="review-body">${this.escape(r.text)}</div>
        </div>`;
    }

    escape(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new ReviewsManager();
    }, 100);
});
// Utilidades de Blog (posts por defecto y resolución desde storage)
function defaultBlogPosts() {
    return [
        {
            id: 'p1',
            title: 'Cuidados postoperatorios en mascotas',
            category: 'Veterinaria',
            image: 'IMG/IMG7.jpeg',
            excerpt: 'Recomendaciones clave para una recuperación segura tras cirugía veterinaria...',
            content: 'Guía práctica de cuidados postoperatorios: control del dolor, higiene de la herida, uso adecuado del collar isabelino, seguimiento del apetito y alertas de complicaciones. Incluye checklist descargable y consejos de alimentación.',
            date: new Date().toISOString()
        },
        {
            id: 'p2',
            title: 'Bienestar animal en sistemas de doble propósito',
            category: 'Zootecnia',
            image: 'IMG/IMG12 (2).jpeg',
            excerpt: 'Buenas prácticas para producción sostenible sin comprometer el bienestar...',
            content: 'Estrategias de manejo, densidades adecuadas, enriquecimiento ambiental, monitoreo de condición corporal y protocolos de salud preventiva enfocados en sistemas doble propósito. Indicadores clave y métricas recomendadas.',
            date: new Date().toISOString()
        },
        {
            id: 'p3',
            title: 'Manejo de suelos: pH y fertilización',
            category: 'Agronomía',
            image: 'IMG/IMG4.jpeg',
            excerpt: 'Cómo interpretar el pH del suelo y ajustar la fertilización...',
            content: 'Conceptos de pH y CICE, correcciones con cal dolomita, recomendaciones de fertilización balanceada según análisis, y prevención de lixiviación. Incluye tabla orientativa y recursos técnicos.',
            date: new Date().toISOString()
        }
    ];
}

function robotsArticlePost() {
    const title = 'Robots aplicados a la producción animal: innovación, eficiencia y el futuro de la ganadería intensiva';
    const category = 'Zootecnia';
    const image = 'IMG/p.webp';
    const content = `Robots aplicados a la producción animal: innovación, eficiencia y el futuro de la ganadería intensiva

La automatización y la robótica se han convertido en pilares fundamentales de la agricultura moderna, especialmente en la producción animal intensiva. Durante las últimas dos décadas, el uso de robots en porcicultura, avicultura y ganadería bovina ha pasado de ser una herramienta experimental a convertirse en un componente esencial para mejorar la eficiencia productiva, optimizar el uso de recursos y elevar el bienestar animal. La creciente necesidad de sistemas ganaderos capaces de producir más con menos —menos mano de obra, menos agua, menos alimento, menor huella ambiental— ha impulsado el desarrollo de tecnologías robóticas que hoy transforman el manejo, la alimentación, la limpieza, la ordeña y la monitorización animal. Este proceso, que forma parte de la llamada Ganadería 4.0, integra robótica, inteligencia artificial, sensores ambientales, automatización avanzada e Internet de las Cosas (IoT) para crear granjas más inteligentes y sostenibles.

La demanda global de proteína animal continúa aumentando a medida que crece la población humana, especialmente en países en desarrollo. Para 2050 se estima que la producción de carne deberá aumentar entre un 60 y un 80% con respecto a los niveles actuales (FAO, 2021). Esta presión exige que los sistemas ganaderos mejoren sus índices de conversión alimenticia, reduzcan enfermedades, aumenten la productividad por animal y minimicen pérdidas. En este contexto, la robótica ha emergido como una solución capaz de cubrir varias de estas necesidades de forma simultánea. Robots de alimentación, robots de limpieza en granjas porcinas, robots de desinfección en avicultura, robots ordeñadores para ganado bovino, vehículos autónomos de distribución de alimento (AGV), sistemas de selección automática, sensores biométricos y robots de inspección ambiental forman parte del nuevo arsenal tecnológico.

En las granjas porcinas modernas, uno de los principales desafíos es mantener la uniformidad de crecimiento y la higiene dentro de corrales de alta densidad. Las variaciones en la distribución del alimento, la presencia de heces acumuladas, las diferencias en el comportamiento alimentario y la limitada disponibilidad de mano de obra han generado la necesidad de automatizar procesos clave. Los robots alimentadores permiten distribuir concentrado de manera uniforme, programada y según las necesidades específicas del lote o de cada cerdo cuando existe identificación electrónica individual. Estudios demuestran que los robots alimentadores reducen la variabilidad de peso entre cerdos y disminuyen el desperdicio de alimento hasta en un 15%, al evitar derrames y competencia excesiva.

Además, los robots móviles de limpieza han surgido como una herramienta indispensable para mantener la higiene y reducir la concentración de gases nocivos como amoníaco y sulfuro de hidrógeno. Estos robots utilizan sensores ultrasónicos, cámaras y algoritmos de navegación para recorrer los pasillos de la granja y retirar las deyecciones de forma automatizada. La acumulación de excretas no solo reduce el bienestar animal, sino que también eleva la carga de patógenos y compromete el sistema respiratorio del cerdo, afectando la ganancia diaria de peso. En ensayos controlados, los robots de limpieza han demostrado una reducción del 30–40% en la concentración de amoníaco en galpones porcinos, mejorando la salud de los animales e incluso aumentando la productividad.

La limpieza automatizada también permite disminuir la mano de obra necesaria en granjas intensivas. La disminución global de trabajadores rurales ha sido uno de los motores más importantes de la robotización agrícola. La capacidad de los robots para trabajar 24/7, sin pausas ni fatiga, genera un ahorro significativo en costos operativos y asegura la consistencia en el mantenimiento de la granja. Estos sistemas pueden programarse para realizar múltiples rondas de limpieza al día, algo imposible de mantener con mano de obra humana en granjas de alta capacidad.

Otro avance importante es la integración de robots equipados con visión artificial para monitorear el comportamiento de los animales. Estos robots son capaces de identificar signos tempranos de enfermedad, cojera, heridas por peleas o patrones anormales de desplazamiento. Mediante algoritmos de aprendizaje profundo, el sistema puede reconocer un cerdo letárgico, un animal que dejó de comer o un incremento en las agresiones. Se ha demostrado que el monitoreo robótico reduce el tiempo de detección de signos clínicos en un 40%, lo cual es crucial en enfermedades de rápido progreso.

En los sistemas avícolas, los robots han comenzado a desempeñar un papel esencial en la inspección de naves de broilers y ponedoras. La densidad poblacional en avicultura es mayor que en cualquier otro sistema pecuario intensivo, lo que significa que la detección temprana de problemas respiratorios, mortalidad, fallas en las líneas de agua o alimento, es fundamental para evitar pérdidas masivas. Robots equipados con cámaras térmicas, sensores ambientales y análisis de comportamiento recorren la nave, detectan aves enfermas, dispersan grupos para estimular movimiento y ayudan a prevenir el amontonamiento. Se evidencia que estos robots reducen el estrés social y mejoran la uniformidad del lote al mantener una distribución más equilibrada de las aves dentro del galpón.

Además, los robots avícolas pueden ayudar en la recolección de huevos, clasificación y desinfección. Sistemas de desinfección autónoma con luz UV-C también se están implementando para reducir la carga bacteriana en ambientes avícolas sin necesidad de químicos, lo cual mejora la bioseguridad y reduce la resistencia antimicrobiana.

En el caso de los bovinos, especialmente en sistemas lecheros intensivos, el robot ordeñador representa quizá la tecnología robótica más desarrollada y adoptada a nivel mundial. Los sistemas de ordeño automático permiten que las vacas acudan voluntariamente a la unidad de ordeño cuando sienten la necesidad fisiológica, mientras el robot realiza todo el proceso: limpieza de pezones, detección óptica del pezón, colocación de pezoneras mediante brazos robóticos, ordeño controlado por sensores y monitoreo en tiempo real del flujo, volumen y composición de la leche. Los robots ordeñadores incrementan la producción de leche entre un 5 y 12% debido a una mayor frecuencia de ordeño y reducen la carga laboral del personal en un 60–70%.

La precisión del robot ordeñador ha avanzado gracias al uso de láseres y cámaras 3D capaces de detectar el pezón con exactitud incluso cuando la vaca se mueve. Las plataformas más modernas incluyen sensores de mastitis basados en conductividad eléctrica, análisis colorimétrico y recuento celular automatizado, lo que permite identificar infecciones subclínicas antes de que afecten la producción. Además, los robots recolectan datos individuales sobre consumo de alimento, tiempo en el comedero, rumiación, comportamiento de descanso y patrones de locomoción, información que se utiliza para predecir enfermedades metabólicas.

A pesar de las ventajas, los sistemas de ordeño robotizado tienen un costo inicial elevado. Sin embargo, el rendimiento económico es generalmente positivo, con recuperación de inversión promedio entre 5 y 8 años, dependiendo de tamaño del hato, precio de la leche, costos de energía y eficiencia de la mano de obra. También permiten aumentar el tamaño del hato sin incrementar proporcionalmente la mano de obra.

En sistemas de engorde de bovinos y en ganadería semiintensiva están empezando a usarse robots alimentadores autónomos capaces de distribuir ensilaje, forraje picado, raciones TMR y concentrado de forma precisa. Estos robots pueden ajustar la cantidad de alimento según el consumo del día previo, mejorando la conversión alimenticia y reduciendo pérdidas, con incrementos reportados del 4–6% en ganancia diaria de peso.

La automatización también se ha extendido al manejo del estiércol. Robots rascadores autónomos en establos de vacas de leche mantienen las camas y pasillos limpios, reduciendo el riesgo de mastitis asociada a contaminación ambiental. La higiene del piso tiene una relación directa con la salud podal; los sistemas robotizados disminuyen la incidencia de cojeras hasta en un 20%.

El futuro de la automatización en la producción animal apunta hacia sistemas totalmente integrados. Granjas con robots interconectados, sensores ambientales, IA predictiva y plataformas de gestión centralizada podrán funcionar con una mínima intervención humana, optimizando decisiones sobre alimentación, sanidad, reproducción y logística. La selección automática mediante robots equipados con RFID permitirá separar animales enfermos, vacas en celo, cerdos listos para mercado o aves que requieran atención sin necesidad de esfuerzo humano.

La tecnología también permite la trazabilidad completa desde el nacimiento hasta el sacrificio. Robots lectores de microchips, cámaras térmicas y sistemas de biometría animal generarán grandes volúmenes de datos para mejorar decisiones estratégicas. Con el avance de la inteligencia artificial, la capacidad de predecir brotes sanitarios antes de que se manifiesten clínicamente será cada vez más común.

La robótica también está promoviendo la sostenibilidad. Robots ambientales capaces de medir gases, controlar ventilación y ajustar microclimas reducirán la huella de carbono y las emisiones de amoníaco. Las normativas ambientales y de bienestar animal están acelerando la adopción, y se espera que América Latina se incorpore a esta tendencia.

Conclusión: los robots aplicados a la producción animal representan una transformación profunda de las granjas. La automatización eleva la eficiencia, reduce costos, mejora el bienestar animal y hace que la ganadería sea más sostenible y competitiva.

Referencias:
Cook, N. B., Hess, J. P., Foy, M. R., Bennett, T. B., & Brotzman, R. L. (2018). Journal of Dairy Science, 101(1), 709–720. https://doi.org/10.3168/jds.2017-13351
Mathieu, C., Robert, P., & Pomar, C. (2021). Animal, 15(3), 100143. https://doi.org/10.1016/j.animal.2021.100143
Mendes, R., Carvalho, G., & Garbossa, G. (2020). Livestock Science, 233, 103962. https://doi.org/10.1016/j.livsci.2020.103962
Pszczolkowski, R., Nielsen, B. H., & Kristensen, T. (2022). Animal Feed Science and Technology, 284, 115169. https://doi.org/10.1016/j.anifeedsci.2022.115169
Rosen, J., Xu, S., & Donovan, T. (2022). Computers and Electronics in Agriculture, 198, 107059. https://doi.org/10.1016/j.compag.2022.107059
Steeneveld, W., Tauer, L. W., Hogeveen, H., & Oude-Lansink, A. (2021). Journal of Dairy Science, 104(3), 3031–3045. https://doi.org/10.3168/jds.2020-19088
Tahamtani, F. M., Pedersen, I., Riber, A. B., & Forkman, B. (2020). Poultry Science, 99(9), 4413–4422. https://doi.org/10.1016/j.psj.2020.05.004
Tremblay, M., Pellerin, D., & Charbonneau, E. (2020). Journal of Dairy Science, 103(6), 5501–5515. https://doi.org/10.3168/jds.2019-17482
Zhang, S., Wang, K., & Li, X. (2019). Environmental Research, 176, 108533. https://doi.org/10.1016/j.envres.2019.108533`;
    const excerpt = 'Robótica y automatización en ganadería intensiva: eficiencia, bienestar e integración con IA, sensores e IoT para granjas inteligentes.';
    return { id: 'p_robotica_produccion_animal', title, category, image, excerpt, content, date: new Date().toISOString() };
}

function cruzamientosArticlePost() {
    const title = 'Cruzamientos bovinos en clima cálido: Brahman × Holstein, Girolando y Simbrah';
    const category = 'Zootecnia';
    const image = 'IMG/fia.jpeg';
    const parts = [];
    parts.push('El cruzamiento bovino en zonas tropicales cálidas se ha consolidado como una estrategia eficiente para incrementar la productividad y rentabilidad de los sistemas ganaderos. Las combinaciones genéticas entre razas cebuínas, como el Brahman, y razas taurinas lecheras o doble propósito, como Holstein, Gyr y Simmental, han demostrado mejoras en producción de leche, crecimiento y resistencia al estrés térmico. En este contexto, los cruzamientos Brahman × Holstein, Girolando y Simbrah representan alternativas ampliamente implementadas en América Latina debido a su capacidad para adaptarse a ambientes tropicales y mantener niveles productivos elevados.');
    parts.push('');
    parts.push('Los sistemas ganaderos en clima cálido enfrentan retos asociados al estrés térmico, la baja calidad de los forrajes, el parasitismo y la variación estacional en la disponibilidad de nutrientes, factores que afectan especialmente a razas europeas puras, cuyo desempeño disminuye bajo temperaturas superiores a 30 °C. Por ello, el vigor híbrido que resulta del cruzamiento permite aprovechar la rusticidad del Brahman y el potencial productivo de razas como Holstein, Gyr o Simmental, mejorando características como eficiencia alimentaria, fertilidad, longevidad y resistencia climática.');
    parts.push('');
    parts.push('En el caso del cruce Brahman × Holstein, se observa un equilibrio notable entre rusticidad y producción de leche. Los estudios indican producciones entre 10 y 14 litros diarios en sistemas doble propósito, acompañadas de mayor resistencia a parásitos y menor susceptibilidad a enfermedades metabólicas. Desde el punto de vista económico, estos animales reducen los costos asociados a tratamientos veterinarios y presentan mayor longevidad reproductiva, lo que mejora la rentabilidad general del sistema.');
    parts.push('');
    parts.push('El Girolando, producto del cruce Holstein × Gyr, es considerado uno de los biotipos más eficientes para regiones tropicales debido a que puede producir entre 12 y 18 litros diarios con buena tolerancia al calor y menor incidencia de mastitis. Además, el costo de producción por litro de leche suele ser hasta 25 % menor que en animales Holstein puros, lo que se traduce en un incremento de la rentabilidad entre 22 y 35 %, dependiendo del tipo de manejo y sistema utilizado.');
    parts.push('');
    parts.push('Por su parte, el Simbrah, resultado del cruce Simmental × Brahman, se destaca en sistemas doble propósito orientados a carne por su elevada ganancia diaria de peso, generalmente entre 800 y 1200 gramos, así como por su eficiencia en pastoreo y su mayor valor en canal comparado con animales cebuínos puros. Estos factores permiten un incremento de la rentabilidad entre 18 y 28 %, especialmente en sistemas de ceba donde el crecimiento acelerado y el rendimiento en canal son prioritarios.');
    parts.push('');
    parts.push('Cuando se comparan los tres cruzamientos, se observa que sus ventajas económicas se explican por la reducción de costos veterinarios, una mejor eficiencia alimentaria bajo condiciones de baja calidad forrajera, mayor fertilidad, intervalos entre partos más cortos y un mayor valor económico de las crías híbridas. En conjunto, estos beneficios contribuyen a retornos económicos superiores respecto a razas puras, cuyos costos de mantenimiento y problemas de adaptación climática reducen su eficiencia productiva.');
    parts.push('');
    parts.push('En conclusión, los cruzamientos Brahman × Holstein, Girolando y Simbrah representan alternativas altamente rentables para la producción bovina en clima cálido. El Girolando destaca como el biotipo más equilibrado para sistemas doble propósito con enfoque lechero; el Simbrah como una opción sobresaliente para carne y crecimiento; y el Brahman × Holstein como un cruce versátil que reduce costos operativos y mantiene buenos niveles productivos. La implementación de programas de cruzamiento dirigidos, acompañados de una adecuada nutrición y manejo, puede incrementar significativamente la productividad y la rentabilidad en los sistemas ganaderos tropicales.');
    parts.push('');
    parts.push('Referencias');
    parts.push('');
    parts.push('Arthur, P. F., Moghaddar, N., & Herd, R. (2019). Crossbreeding strategies for tropical beef production systems. Animal Production Science, 59(8), 1351–1362.');
    parts.push('Faria, F. J., Verneque, R. S., Peixoto, M. G. C. D., & Machado, M. A. (2020). Performance of Girolando cattle under tropical conditions: Milk yield, adaptability and genetic progress. Tropical Animal Health and Production, 52(3), 1453–1462.');
    parts.push('González, H., & Rivera, J. (2018). Productive performance of Simbrah cattle in tropical dual-purpose systems. Revista Colombiana de Zootecnia, 11(2), 45–56.');
    parts.push('Martínez, L., Pérez, J., & Gómez, R. (2021). Evaluación productiva del cruce Brahman × Holstein en sistemas doble propósito. Revista Agropecuaria de Colombia, 29(1), 23–34.');
    parts.push('Muñoz, D., & Restrepo, A. (2022). Rentabilidad del doble propósito en clima cálido: Comparación entre razas puras y cruzamientos. Economía Ganadera, 17(4), 77–89.');
    parts.push('Silva, R., & Pedreira, M. S. (2019). Costos de producción y eficiencia en sistemas Girolando vs. Holstein en el trópico. Journal of Tropical Dairy Science, 14(2), 98–109.');
    parts.push('Zhang, Y., Collier, R., & Harner, J. (2020). Heat stress and dairy cattle: Impacts on production and physiology. Journal of Dairy Science, 103(9), 8593–8608.');
    const content = parts.join('\n');
    const excerpt = 'Cruzamientos Brahman × Holstein, Girolando y Simbrah: productividad, adaptación y rentabilidad en clima cálido.';
    return { id: 'p_cruzamientos', title, category, image, excerpt, content, date: new Date().toISOString() };
}
function mastitisArticlePost() {
    const title = 'Aplicación de inteligencia artificial en el diagnóstico de mastitis bovina: visión computacional y aprendizaje automático para detección temprana';
    const category = 'Veterinaria';
    const image = 'IMG/IMG11.jpeg';
    const parts = [];
    parts.push('La mastitis bovina continúa siendo una de las enfermedades más comunes y costosas dentro de la producción lechera, no solo por su impacto directo en la salud del animal, sino también por la disminución de la calidad de la leche y las pérdidas económicas que genera en tratamientos, descarte y reducción en la eficiencia productiva. Tradicionalmente, su diagnóstico se ha basado en recuentos de células somáticas, mediciones de conductividad eléctrica o inspecciones clínicas, métodos que, aunque útiles, suelen aplicarse de manera tardía o con poca frecuencia, lo que limita la detección temprana (Menezes et al., 2024).');
    parts.push('');
    parts.push('En este contexto, las herramientas de inteligencia artificial, como el aprendizaje automático y la visión computacional, han surgido como alternativas prometedoras para mejorar el diagnóstico de la enfermedad de manera más rápida, precisa y no invasiva. El desarrollo de cámaras térmicas, sensores, análisis de patrones en imágenes y modelos capaces de aprender a partir de grandes volúmenes de datos ha permitido que la detección de anomalías en la ubre o cambios en parámetros fisiológicos sea cada vez más eficiente. Estudios recientes reportan precisiones superiores al 85 %, lo cual evidencia el potencial de estas tecnologías en la identificación temprana de mastitis bovina (Wang et al., 2022).');
    parts.push('');
    parts.push('El uso de inteligencia artificial en el diagnóstico veterinario se sustenta en su capacidad para procesar grandes cantidades de datos y generar predicciones basadas en patrones que podrían pasar desapercibidos para el ojo humano. Técnicas como machine learning y deep learning permiten analizar parámetros de comportamiento, datos clínicos e incluso imágenes térmicas para identificar animales enfermos con altos niveles de exactitud (Kour et al., 2022). La visión computacional, en particular, desempeña un papel clave, puesto que facilita el análisis automático de imágenes o vídeo, permitiendo detectar variaciones térmicas en la ubre, cambios en su tamaño o asimetrías que reflejan procesos inflamatorios antes de que los signos clínicos sean evidentes (Tassinari et al., 2021).');
    parts.push('');
    parts.push('Wang et al. (2022) emplearon imágenes infrarrojas combinadas con YOLOv5, logrando una sensibilidad del 96,3 %. Chu et al. (2023) fusionaron temperatura y tamaño de ubre y alcanzaron 83,3 % de precisión y 92,3 % de sensibilidad. Mitsunaga (2024) reportó un crecimiento marcado en publicaciones sobre IA y mastitis, reflejando interés científico.');
    parts.push('');
    parts.push('Retos: calidad y cantidad de datos, validación local, infraestructura de cámaras térmicas y almacenamiento, y capacitación para interpretación. Integración en rutina de ordeño exige organización, calibración y modelos adaptados al entorno.');
    parts.push('');
    parts.push('Oportunidades: sistemas robustos al integrar imágenes térmicas, parámetros de leche, CCS y comportamiento, con alertas en tiempo real para reducir antibióticos y mejorar bienestar. La adopción multimodal y la IA predictiva potenciarán detección temprana y control en producción lechera.');
    const content = parts.join('\n');
    const excerpt = 'IA para detección temprana de mastitis bovina: visión computacional, sensores y modelos.';
    return { id: 'p_mastitis_ia', title, category, image, excerpt, content, date: new Date().toISOString() };
}
function acuiculturaArticlePost() {
    const title = 'Guía de Alimentación y Manejo Nutricional en la Producción Acuícola de Mojarra y Cachama';
    const category = 'Acuicultura';
    const image = 'IMG/IMG9.jpeg';
    const parts = [];
    parts.push('La acuicultura se ha consolidado como uno de los sectores pecuarios de mayor crecimiento en Colombia, especialmente en la producción de mojarra roja y cachama. Un manejo nutricional adecuado garantiza peces sanos y buena calidad de carne.');
    parts.push('');
    parts.push('Mojarra: alevinos 32–40 % de proteína; engorde 28–30 %. Suplementación con vitaminas, minerales y lípidos, alimentación fraccionada y consumo en 10–15 minutos.');
    parts.push('');
    parts.push('Cachama: alevinos 32–36 % de proteína; engorde 22–28 %. Mejor con alimentos flotantes para evaluar consumo y reducir desperdicio.');
    parts.push('');
    parts.push('Factores ambientales: temperatura óptima 26–30 °C (mojarra) y 28–32 °C (cachama); O2 > 5 mg/L; pH 6.5–8.5; controlar amonio y densidad de siembra.');
    parts.push('');
    parts.push('Estrategias: probióticos/prebióticos, alimentación mixta controlada, elección flotantes/hundidos por especie y etapa.');
    parts.push('');
    parts.push('Problemas nutricionales: deficiencias proteicas (crecimiento lento), exceso de alimento (turbidez, amonio), deficiencias vitamínicas (curvaturas, hemorragias).');
    parts.push('');
    parts.push('Rentabilidad: marcas reconocidas, conservación del concentrado, ICA controlado (1.5–2.0 mojarra; 1.8–2.5 cachama), registros y muestreos quincenales.');
    const content = parts.join('\n');
    const excerpt = 'Guía nutricional para mojarra y cachama: requerimientos, manejo y eficiencia.';
    return { id: 'p_acuicultura_mojarra_cachama', title, category, image, excerpt, content, date: new Date().toISOString() };
}
function petsNutritionArticlePost() {
    const title = 'Guía Completa de Alimentación Saludable Para Perros y Gatos';
    const category = 'Veterinaria';
    const image = 'IMG/IMG1.jpeg';
    const parts = [];
    parts.push('La alimentación es un pilar de la salud en perros y gatos. Una dieta equilibrada mejora inmunidad, pelaje, condición corporal y longevidad.');
    parts.push('');
    parts.push('Perros: proteína de calidad, grasas, carbohidratos digestibles, vitaminas y minerales. Mejor concentrados premium/super premium. Dietas caseras/BARF solo con formulación profesional. Frecuencia: cachorros 3–4/día, adultos 1–2/día, geriatras porciones pequeñas. Evitar chocolate, cebolla, ajo, uvas, alcohol, cafeína, xilitol y huesos cocidos.');
    parts.push('');
    parts.push('Gatos: carnívoros estrictos, requieren taurina, araquidónico, vitamina A preformada, proteína animal alta y pocos cereales. Hidratación clave; complementar con alimento húmedo. Evitar cebolla, ajo, chocolate, leche de vaca, pescado crudo y restos humanos.');
    parts.push('');
    parts.push('Obesidad: controlar porciones, limitar premios, actividad diaria y alimento acorde a edad/condición corporal.');
    parts.push('');
    parts.push('Consultar veterinario ante cambios de apetito, vómito/diarrea recurrente, variaciones de peso, problemas de piel o cambio de dieta.');
    parts.push('');
    parts.push('Veterinaria Online 24/7 brinda acompañamiento en nutrición, interpretación de exámenes y selección del plan alimenticio ideal.');
    const content = parts.join('\n');
    const excerpt = 'Guía práctica de nutrición para perros y gatos: qué dar, qué evitar y cómo cuidar.';
    return { id: 'p_guia_perros_gatos', title, category, image, excerpt, content, date: new Date().toISOString() };
}
function bathingDogArticlePost() {
    const title = 'Bañar correctamente a un perro según su tipo de piel: guía práctica';
    const category = 'Veterinaria';
    const image = 'IMG/BAÑAR PERRO.jpg';
    const parts = [];
    parts.push('Bañar correctamente a un perro requiere comprender las características de su piel y pelaje, ya que cada tipo de piel responde de manera diferente a los productos, la frecuencia y las técnicas de higiene. La piel canina es más delicada que la humana y tiene un pH diferente, por lo que un baño inadecuado puede provocar irritación, resequedad, infecciones cutáneas o pérdida de la barrera protectora natural. Para garantizar un baño seguro y beneficioso, es indispensable seleccionar productos formulados para perros y ajustarlos según las necesidades dermatológicas específicas de cada uno.');
    parts.push('Los perros con piel normal y sin antecedentes dermatológicos suelen tolerar bien los baños cada tres a cuatro semanas con un shampoo neutro para uso veterinario. Este tipo de piel mantiene un equilibrio adecuado entre producción de sebo y humedad, por lo que no requiere productos medicados. El baño debe acompañarse de un cepillado previo para eliminar pelo muerto y permitir que el shampoo actúe de forma uniforme, lo cual mejora la salud del pelaje y evita la formación de nudos (Miller et al., 2022).');
    parts.push('En los perros con piel seca o sensible, la prioridad es mantener la hidratación cutánea. Estos animales presentan descamación, resequedad y en ocasiones prurito leve. En estos casos se recomiendan shampoos hidratantes con avena coloidal, ácidos grasos esenciales o ceramidas, los cuales ayudan a restablecer la barrera epidérmica. Además, es aconsejable espaciar los baños a intervalos de cuatro a seis semanas, ya que el exceso de lavado puede empeorar la resequedad y eliminar lípidos esenciales (White & Hensel, 2020). Secar con toalla suave y evitar el aire caliente directo ayuda a prevenir irritaciones posteriores.');
    parts.push('Los perros con piel grasa requieren un manejo diferente, ya que suelen presentar exceso de sebo, mal olor o sensación aceitosa en el pelaje. Estos casos se benefician de shampoos seborreguladores con ingredientes como ácido salicílico o peróxido de benzoilo, utilizados bajo recomendación veterinaria. Sin embargo, un uso excesivo puede irritar la piel, por lo que la frecuencia debe ser controlada y ajustada según respuesta clínica. Un cepillado constante y una correcta alimentación también contribuyen a equilibrar la producción sebácea (Moriello, 2018).');
    parts.push('Los perros con piel atópica, alérgica o con antecedentes dermatológicos requieren cuidados especiales. Los baños terapéuticos con shampoos medicados (antipruriginosos, antialérgicos o antimicrobianos) pueden reducir la carga de alérgenos en el pelaje y mejorar la sintomatología. Estos productos deben dejarse actuar entre 5 y 10 minutos antes de enjuagar para garantizar su eficacia. Es fundamental seguir las indicaciones del médico veterinario, ya que el uso incorrecto podría interferir con tratamientos tópicos u orales. Los perros atópicos suelen beneficiarse de baños semanales, ya que contribuyen a disminuir la inflamación y restaurar la barrera cutánea (Olivry & Bizikova, 2019).');
    parts.push('El proceso de baño debe realizarse con agua tibia, evitando temperaturas extremas que puedan causar estrés o dañar la piel. El enjuague debe ser meticuloso, ya que los residuos de shampoo pueden provocar irritación. Secar adecuadamente es esencial para prevenir infecciones, especialmente en razas con pliegues o con abundante subpelo. El uso de acondicionadores formulados para perros puede mejorar la hidratación del pelaje y facilitar el cepillado posterior. Además, es importante mantener una rutina regular de revisiones veterinarias para identificar problemas dermatológicos antes de que evolucionen a condiciones más graves.');
    parts.push('Bañar correctamente a un perro según su tipo de piel no solo favorece la salud dermatológica, sino que también fortalece el vínculo entre el animal y su familia, reduce el riesgo de infecciones y mejora el bienestar general. Adaptar la técnica, los productos y la frecuencia a las características individuales de cada mascota es una práctica fundamental dentro del cuidado responsable y la medicina preventiva.');
    parts.push('Referencias (APA 7)');
    parts.push('Miller, W. H., Griffin, C. E., & Campbell, K. L. (2022). Muller & Kirk\'s small animal dermatology (8th ed.). Elsevier.');
    parts.push('Moriello, K. A. (2018). Topical therapy for canine seborrhea: Evidence and practice. Veterinary Dermatology, 29(1), 45–52. https://doi.org/10.1111/vde.12531');
    parts.push('Olivry, T., & Bizikova, P. (2019). Important concepts in the diagnosis and management of canine atopic dermatitis. Veterinary Clinics of North America: Small Animal Practice, 49(1), 1–15. https://doi.org/10.1016/j.cvsm.2018.08.001');
    parts.push('White, S. D., & Hensel, P. (2020). Management of dry and sensitive skin in dogs. Journal of Veterinary Dermatology, 31(4), 253–260. https://doi.org/10.1111/vde.12800');
    const content = parts.join('\n');
    const excerpt = 'Cómo bañar perros según tipo de piel: productos, frecuencia y cuidado dermatológico.';
    return { id: 'p_banar_perro', title, category, image, excerpt, content, date: new Date().toISOString() };
}
function fishDiseasesArticlePost() {
    const title = 'Enfermedades más comunes en mojarra y cachama y cómo prevenirlas';
    const category = 'Acuicultura';
    const image = 'IMG/TILAPIA VIRUS.jpg';
    const parts = [];
    parts.push('La mojarra (Oreochromis spp.) y la cachama (Colossoma macropomum y Piaractus brachypomus) son dos de las especies de peces más cultivadas en sistemas de producción piscícola en clima cálido debido a su rápido crecimiento, rusticidad y buena aceptación en el mercado. Sin embargo, su rentabilidad puede verse afectada por la aparición de enfermedades asociadas a patógenos, fallas en la calidad del agua, manejo inadecuado o desequilibrios nutricionales. El reconocimiento oportuno de los signos clínicos y la implementación de un manejo sanitario integrado son fundamentales para prevenir pérdidas económicas en los sistemas piscícolas.');
    parts.push('Una de las enfermedades más frecuentes en mojarra y cachama es la estreptococosis, causada principalmente por Streptococcus agalactiae y Streptococcus iniae. Esta patología genera signos como nado errático, exoftalmia, hemorragias y septicemia, y suele presentarse con mayor intensidad cuando la temperatura del agua supera los 28 °C y existen altas densidades de población. Estudios han demostrado que los brotes están estrechamente relacionados con el estrés y la inmunosupresión, especialmente en estanques mal oxigenados o con acumulación de materia orgánica. La prevención se basa en el mantenimiento de una adecuada calidad del agua, la reducción del hacinamiento, la implementación de protocolos de bioseguridad y, en algunos sistemas intensivos, el uso de vacunas comerciales donde estén disponibles (Amal & Zamri-Saad, 2011).');
    parts.push('Otra enfermedad de importancia es la columnaris, causada por Flavobacterium columnare, común en aguas cálidas y con baja calidad microbiológica. Este agente produce lesiones en piel, aletas y branquias, conocidas como “podredumbre de aletas”, y puede generar mortalidades rápidas si no se controla oportunamente. La infección es favorecida por altos niveles de amonio, nitritos o sólidos suspendidos, así como por el estrés generado durante el manejo. La prevención incluye el uso de sistemas de filtración adecuados, la reducción de la carga orgánica, la desinfección de estanques antes de iniciar cada ciclo de producción y el uso de sales no yodadas en tratamientos preventivos en algunos casos (Declercq et al., 2013).');
    parts.push('Las enfermedades parasitarias también son altamente recurrentes. La ichthyophthiriasis, causada por Ichthyophthirius multifiliis, se caracteriza por la presencia de puntos blancos en piel y aletas, además de un comportamiento de rascado contra superficies. Este protozoario se multiplica rápidamente en ambientes cálidos y con alto contenido orgánico, lo que facilita los brotes. Asimismo, en la cachama son comunes los parásitos branquiales como Dactylogyrus y Gyrodactylus, los cuales generan dificultad respiratoria, letargo y disminución del consumo de alimento. El control depende de la cuarentena de nuevos ingresos, la desinfección de equipos y el uso de baños terapéuticos con productos aprobados por la autoridad sanitaria (Woo & Buchmann, 2012).');
    parts.push('Además, las infecciones fúngicas como la saprolegniasis son frecuentes en peces debilitados o en etapas tempranas de la producción, especialmente durante el manejo de huevos y larvas. Esta enfermedad se manifiesta como crecimiento algodonoso blanco sobre la piel y suele estar asociada a lesiones previas o deficiencias inmunológicas. La prevención debe enfocarse en minimizar el estrés, manipular adecuadamente los reproductores y utilizar desinfectantes permitidos en bajas concentraciones durante la fase de incubación (Bruno & Noga, 2009).');
    parts.push('La prevención integral de enfermedades en mojarra y cachama requiere un enfoque basado en la gestión adecuada de la calidad del agua, la nutrición balanceada, el monitoreo constante del comportamiento de los peces y la implementación de estrictas medidas de bioseguridad. La alimentación deficiente puede generar inmunosupresión y hacer a los peces más susceptibles a infecciones bacterianas y parasitarias, por lo que el uso de dietas formuladas según la etapa productiva es esencial. Del mismo modo, evitar el ingreso de patógenos mediante cuarentenas, desinfección de materiales y control del movimiento de animales contribuye a mantener la salud de la población piscícola y asegurar la productividad del sistema. Un programa sanitario bien estructurado, complementado con asistencia técnica profesional, permite disminuir riesgos y garantizar la sostenibilidad económica en los cultivos de mojarra y cachama en clima cálido.');
    parts.push('Referencias');
    parts.push('Amal, M. N. A., & Zamri-Saad, M. (2011). Streptococcosis in tilapia: A review. Aquaculture, 315(1), 1–12.');
    parts.push('Bruno, D. W., & Noga, E. J. (2009). Diseases of fish. In E. J. Noga (Ed.), Fish disease: Diagnosis and treatment (2nd ed., pp. 149–230). Wiley-Blackwell.');
    parts.push('Declercq, A. M., Haesebrouck, F., Van den Broeck, W., Bossier, P., & Decostere, A. (2013). Columnaris disease in fish: A review with emphasis on bacterium-host interactions. Veterinary Research, 44(1), 1–17.');
    parts.push('Woo, P. T. K., & Buchmann, K. (2012). Fish parasites: Pathobiology and protection. CABI Publishing.');
    const content = parts.join('\n');
    const excerpt = 'Mojarra y cachama: enfermedades frecuentes, signos, prevención y manejo sanitario.';
    return { id: 'p_enfermedades_mojarra_cachama', title, category, image, excerpt, content, date: new Date().toISOString() };
}
function swineFeedEfficiencyArticlePost() {
    const title = 'Cómo mejorar la conversión alimenticia en porcinos';
    const category = 'Zootecnia';
    const image = 'IMG/CERDOS COMIENDO.jpg';
    const parts = [];
    parts.push('La conversión alimenticia (CA), entendida como la cantidad de alimento necesaria para producir un kilogramo de ganancia de peso vivo, es uno de los indicadores económicos más relevantes en la producción porcina moderna. Un sistema con buena eficiencia alimentaria no solo reduce costos, sino que mejora la competitividad, la sostenibilidad y la capacidad productiva de la granja. Alcanzar mejoras reales en este parámetro implica comprender que la CA no depende de un solo factor, sino de la interacción compleja entre genética, nutrición, ambiente, sanidad, bienestar y manejo. Por ello, los programas destinados a optimizarla deben abordar el sistema de producción de forma integral, basada en evidencia científica reciente y en estrategias comprobadas por la industria.');
    parts.push('Una de las principales variables que determina la conversión alimenticia es la nutrición. Las dietas deben formularse considerando los requerimientos específicos de cada etapa fisiológica, especialmente energía metabolizable, aminoácidos digestibles, minerales y vitaminas esenciales. Investigaciones han demostrado que dietas con ajuste preciso de aminoácidos como la lisina, metionina, treonina y triptófano mejoran la síntesis proteica y reducen el gasto energético asociado al metabolismo del exceso de nutrientes. Asimismo, la correcta relación energía-proteína es clave: dietas con energía insuficiente elevan el consumo sin mejorar el crecimiento, mientras que dietas excesivamente energéticas favorecen la deposición grasa, lo cual compromete la eficiencia. El uso de aditivos como fitasas, proteasas, carbohidrasas, probióticos, prebióticos, ácidos orgánicos y promotores naturales del crecimiento mejora la digestibilidad, reduce inflamación intestinal y optimiza el aprovechamiento del alimento, contribuyendo de forma directa a una mejor CA (Kiarie et al., 2013). También se ha demostrado que el tamaño óptimo de partícula del alimento, entre 600 y 700 micras, aumenta el área de superficie disponible para las enzimas digestivas y favorece una mayor disponibilidad de nutrientes.');
    parts.push('La genética representa otro pilar determinante en la eficiencia alimenticia. Las líneas modernas utilizadas en producción global, como Pietrain, Duroc, Landrace y Yorkshire, han sido seleccionadas por su capacidad de crecimiento acelerado, su eficiencia metabólica y su mayor proporción de tejido magro. Los híbridos comerciales resultantes presentan mejoras significativas en conversión alimenticia cuando se mantienen bajo condiciones adecuadas de nutrición y manejo. Estudios indican que los cerdos de crecimiento magro tienen menor requerimiento energético para deposición proteica comparado con animales con tendencia a acumular grasa, lo cual se traduce en una reducción del alimento requerido por kilogramo producido (López-Vergé et al., 2018). Sin embargo, el potencial genético solo se expresa por completo si el ambiente es adecuado, por lo que sin un manejo sanitario y nutricional correcto, las mejoras genéticas no se reflejan en la CA.');
    parts.push('El componente sanitario también tiene un impacto profundo y, a menudo, subestimado. Enfermedades entéricas como ileítis, colibacilosis o coccidiosis, respiratorias como Mycoplasma hyopneumoniae o influenza porcina, y parasitismos internos generan una disminución del consumo, un aumento del gasto energético debido a la respuesta inmunitaria y un deterioro general en la absorción de nutrientes. Esto afecta la eficiencia incluso sin la presencia de signos clínicos evidentes. Programas sanitarios preventivos con vacunaciones actualizadas, desparasitaciones estratégicas, estrictos protocolos de bioseguridad y manejo “todo adentro – todo afuera” permiten reducir la presión infecciosa y mejorar la salud intestinal, lo que se refleja directamente en una mejor conversión. Adicionalmente, la calidad del agua es un factor determinante; la presencia de microorganismos patógenos, biofilm o altos niveles de sólidos totales disueltos afecta el rendimiento y la biodisponibilidad de nutrientes. Por ello, mantener sistemas de agua limpios, clorados y monitorizados es fundamental para asegurar un óptimo consumo y prevenir trastornos digestivos.');
    parts.push('Las condiciones ambientales juegan un papel crítico en la eficiencia alimenticia, especialmente en climas tropicales o en épocas de altas temperaturas. El estrés calórico reduce el consumo voluntario y obliga al animal a desviar energía hacia mecanismos fisiológicos de termorregulación como el jadeo y la vasodilatación periférica. Esto compromete el crecimiento y aumenta la CA. Por ello, es indispensable contar con sistemas adecuados de ventilación, sombras, aislamiento térmico, corrientes de aire, nebulización controlada y disponibilidad constante de agua fresca. Además, el manejo de la densidad animal es clave: hacinamiento produce estrés, competencia por alimento y recurso hídrico, disminución de consumo y aumento en comportamientos agresivos. Los cerdos deben contar con suficiente espacio por animal, comederos bien dimensionados y un flujo de alimento continuo o controlado según la fase productiva. Las instalaciones deben minimizar el estrés, evitar pisos resbalosos o abrasivos y mantener un ambiente limpio y seco, eliminando factores que incrementan el riesgo de enfermedades.');
    parts.push('El bienestar animal influye notablemente en el desempeño alimenticio. El estrés crónico eleva niveles de cortisol, altera el metabolismo energético, reduce el consumo y disminuye la eficiencia de conversión. Prácticas como el establecimiento de grupos homogéneos por peso, la reducción de peleas mediante un adecuado diseño de corrales, la minimización de movimientos y el manejo calmado de los animales contribuyen a un comportamiento natural y un consumo constante. El enriquecimiento ambiental también ayuda a reducir estrés y comportamientos anormales, facilitando un crecimiento más eficiente.');
    parts.push('Finalmente, el monitoreo y análisis de datos es una herramienta indispensable para mejorar la conversión alimenticia de forma sostenida. Registrar el consumo de alimento, la ganancia diaria de peso, el índice de mortalidad, condiciones ambientales y eventos sanitarios permite identificar fallas en tiempo real y ajustar estrategias. Hoy en día existen tecnologías como sensores, básculas automáticas, software de gestión y sistemas inteligentes de alimentación que permiten un control preciso del desempeño productivo. La toma de decisiones basada en datos facilita la detección temprana de desviaciones, mejora la trazabilidad del proceso y fortalece la eficiencia global del sistema.');
    parts.push('En síntesis, mejorar la conversión alimenticia en porcinos requiere un abordaje integral en el que convergen nutrición de precisión, genética avanzada, programas sanitarios estrictos, ambientes óptimos, bienestar animal y monitoreo constante. Cuando estos factores se gestionan de manera articulada, la granja puede alcanzar incrementos notables en eficiencia productiva, reducción de costos y sostenibilidad, consolidando un sistema porcino más rentable y competitivo.');
    parts.push('Referencias (APA 7.ª edición)');
    parts.push('Kiarie, E., Bhandari, S. K., Scott, M., & Krause, D. O. (2013). Feeding strategies to improve feed efficiency in swine. Journal of Animal Science and Biotechnology, 4(1), 1–11. https://doi.org/10.1186/2049-1891-4-27');
    parts.push('López-Vergé, S., Gasa, J., Soldevila, M., Coma, J., & Bonet, J. (2018). Factors affecting feed efficiency in growing pigs: A review. Animals, 8(11), 1–16. https://doi.org/10.3390/ani8110181');
    parts.push('Renaudeau, D., Gourdine, J. L., & St-Pierre, N. R. (2011). A meta-analysis of the effects of high ambient temperature on growth performance of growing-finishing pigs. Journal of Animal Science, 89(7), 2220–2230. https://doi.org/10.2527/jas.2010-3329');
    parts.push('Patience, J. F. (2017). Meeting energy requirements in swine nutrition. Animal Feed Science and Technology, 233, 31–40. https://doi.org/10.1016/j.anifeedsci.2016.05.028');
    parts.push('Pluske, J. R., Turpin, D. L., & Kim, J. C. (2018). Gastrointestinal tract (gut) health in the young pig. Animal Nutrition, 4(2), 187–196. https://doi.org/10.1016/j.aninu.2017.12.004');
    const content = parts.join('\n');
    const excerpt = 'Conversión alimenticia en porcinos: nutrición, genética, ambiente, sanidad y manejo.';
    return { id: 'p_conversion_porcinos', title, category, image, excerpt, content, date: new Date().toISOString() };
}
function policultivosArticlePost() {
    const title = 'Policultivos y sistemas silvopastoriles en Colombia: una estrategia hacia la sostenibilidad agropecuaria';
    const category = 'Agronomía';
    const image = 'IMG/IMG14.jpeg';
    const parts = [];
    parts.push('Los policultivos y sistemas silvopastoriles diversifican la producción, mejoran servicios ecosistémicos y restauran suelos, aumentando competitividad y resiliencia.');
    parts.push('');
    parts.push('Policultivos: siembra de múltiples especies, estabilidad productiva, menor incidencia de plagas y mejor aprovechamiento de nutrientes.');
    parts.push('');
    parts.push('Silvopastoriles: integran árboles, arbustos forrajeros, pasturas y animales, aportan sombra, microclima, regulación hídrica y fertilidad. Experiencias exitosas en Colombia (CIPAV).');
    parts.push('');
    parts.push('Beneficios: mejor estructura del suelo, más materia orgánica, menor erosión, mayor biodiversidad y secuestro de carbono; alta resiliencia ante eventos extremos.');
    const content = parts.join('\n');
    const excerpt = 'Alternativas agropecuarias sostenibles: policultivos y silvopastoriles en Colombia.';
    return { id: 'p_policultivos_silvopastoriles', title, category, image, excerpt, content, date: new Date().toISOString() };
}
function dronesArticlePost() {
    const title = 'Drones en Ganadería: La Nueva Era de la Vigilancia, Bienestar Animal y Productividad';
    const category = 'Zootecnia';
    const image = 'IMG/IMG12 (2).jpeg';
    const parts = [];
    parts.push('Los drones mejoran vigilancia de potreros, conteo de animales, detección de estrés y monitoreo de infraestructura, reduciendo costos y aumentando bienestar.');
    parts.push('');
    parts.push('Aplicaciones: termografía para detectar calor corporal anómalo, seguimiento de desplazamientos, inspección de cercas y bebederos, apoyo en emergencias y logística.');
    const content = parts.join('\n');
    const excerpt = 'Drones aplicados a la ganadería: vigilancia, bienestar y productividad.';
    return { id: 'p_drones_ganaderia', title, category, image, excerpt, content, date: new Date().toISOString() };
}

function placeholderUnamePosts() {
    const build = (n) => ({
        id: 'p_uname_' + n,
        title: 'uname',
        category: 'Más',
        image: 'IMG/IMG7.jpeg',
        excerpt: 'Información próximamente.',
        content: 'Información próximamente.',
        date: new Date().toISOString()
    });
    return [build(1), build(2), build(3)];
}

/* removed uname extra placeholders */

function resolveBlogPosts() {
    try {
        const saved = localStorage.getItem('blog_posts');
        if (saved) {
            const parsed = JSON.parse(saved);
            const removalTitles = [
                'Cuidados postoperatorios en mascotas',
                'Bienestar animal en sistemas de doble propósito',
                'Manejo de suelos: pH y fertilización',
                'Rentabilidad del cruzamiento bovino en clima cálido: análisis productivo y económico de Brahman × Holstein, Girolando y Simbrah',
                'Drones en Ganadería: La Nueva Era de la Vigilancia, Bienestar Animal y Productividad'
            ];
            for (let i = parsed.length - 1; i >= 0; i--) {
                const t = (parsed[i].title || '').trim();
                const ex = (parsed[i].excerpt || '').trim();
                const badExcerpt = ex.includes('Cruzamientos Brahman × Holstein, Girolando y Simbrah en clima cálido: productividad, eficiencia y rentabilidad con evidencia científica.');
                if (removalTitles.includes(t) || badExcerpt) {
                    parsed.splice(i, 1);
                }
            }
            const allowedUnameIds = new Set(['p_uname_1','p_uname_2','p_uname_3']);
            for (let i = parsed.length - 1; i >= 0; i--) {
                const titleLower = (parsed[i].title || '').trim().toLowerCase();
                const pid = parsed[i].id || '';
                if (titleLower === 'uname' || (/^p_uname_\d+$/.test(pid) && !allowedUnameIds.has(pid))) {
                    parsed.splice(i, 1);
                }
            }
            if (Array.isArray(parsed) && parsed.length) {
                const robotsPost = robotsArticlePost();
                const exists = parsed.some(p => p.id === robotsPost.id);
                if (!exists) {
                    parsed.unshift(robotsPost);
                }
                const robotsItem = parsed.find(p => p.id === 'p_robotica_produccion_animal');
                if (robotsItem) robotsItem.image = 'IMG/ganaeria-3.jpg';
                const cruz = cruzamientosArticlePost();
                const cruzExists = parsed.some(p => p.id === cruz.id);
                if (!cruzExists) {
                    parsed.splice(1, 0, cruz);
                }
                const ensure = (post) => { const ex = parsed.some(p => p.id === post.id); if (!ex) parsed.push(post); };
                ensure(mastitisArticlePost());
                ensure(acuiculturaArticlePost());
                ensure(petsNutritionArticlePost());
                ensure(policultivosArticlePost());
                ensure(bathingDogArticlePost());
                ensure(fishDiseasesArticlePost());
                ensure(swineFeedEfficiencyArticlePost());
                const unamePosts = placeholderUnamePosts();
                unamePosts.forEach(up => { const ex = parsed.some(p => p.id === up.id); if (!ex) parsed.push(up); });
                const uname1 = parsed.find(p => p.id === 'p_uname_1');
                if (uname1) {
                    uname1.title = 'Enfermedades más comunes en perros y gatos y cómo prevenirlas';
                    uname1.category = 'Veterinaria';
                    uname1.content = `La salud preventiva es uno de los pilares más importantes en la medicina veterinaria. Perros y gatos, sin importar su raza, edad o tamaño, están expuestos a una variedad de enfermedades que pueden afectar su bienestar y su expectativa de vida. La clave para mantenerlos sanos es conocer los riesgos más frecuentes y actuar a tiempo mediante vacunación, desparasitación, controles periódicos y un adecuado manejo ambiental. Una rutina preventiva bien organizada puede evitar gastos futuros y prolongar la vida de nuestras mascotas de manera significativa.

En los perros, una de las enfermedades más comunes es el parvovirus, una infección viral altamente contagiosa que afecta principalmente a cachorros y produce vómito, diarrea hemorrágica, deshidratación y muerte en pocas horas si no se trata. Otra enfermedad frecuente es el moquillo, un virus que compromete el sistema respiratorio y neurológico. Las enfermedades respiratorias como la traqueobronquitis y las infecciones por parásitos gastrointestinales también están entre las afecciones más vistas en la clínica diaria. La vacunación anual, la higiene adecuada y evitar el contacto con animales enfermos son medidas esenciales para prevenirlas.

En los gatos, la rinotraqueítis viral felina y el calicivirus son responsables de la mayoría de los cuadros respiratorios. Además, la leucemia felina y la inmunodeficiencia son enfermedades virales de importancia que se transmiten por contacto entre gatos, especialmente en aquellos que viven en exteriores. Los parásitos como las pulgas y los ácaros también son muy comunes y pueden desencadenar alergias, anemia y otros problemas de piel. Mantener un calendario de vacunación estricto, la desparasitación interna y externa periódica y el control del entorno reducen drásticamente estos riesgos.

Una correcta nutrición, chequeos veterinarios anuales, limpieza del hogar y un ambiente libre de estrés ayudan a fortalecer el sistema inmunológico. La observación diaria, como cambios en apetito, conducta o eliminación, permite detectar enfermedades en etapas tempranas. La medicina preventiva es siempre la mejor inversión y garantiza una vida más larga, activa y saludable para perros y gatos.`;
                    uname1.excerpt = 'Salud preventiva en perros y gatos: riesgos frecuentes, vacunación y controles.';
                    uname1.image = 'IMG/IMG19.jpg';
                }
                const uname2 = parsed.find(p => p.id === 'p_uname_2');
                if (uname2) {
                    uname2.title = 'Claves para manejar correctamente la reproducción en hembras y machos';
                    uname2.category = 'Veterinaria';
                    uname2.content = `La reproducción en las mascotas debe manejarse con responsabilidad, ya que afecta directamente la salud, el comportamiento y el bienestar tanto de hembras como de machos. Un adecuado manejo reproductivo previene complicaciones médicas, evita camadas no deseadas y contribuye al control poblacional. Comprender los ciclos, las señales de fertilidad y las opciones de control reproductivo permite tomar decisiones informadas y seguras para cada animal.

En las hembras, el celo es un proceso fisiológico que aparece cada seis a ocho meses, dependiendo de la especie y la raza. Durante esta etapa, la hembra puede mostrar cambios de conducta como inquietud, sangrado vaginal y atracción hacia los machos. Es importante evitar la monta accidental, ya que los embarazos no planificados aumentan el riesgo de distocias, abortos y problemas metabólicos. La esterilización es uno de los métodos más recomendados porque reduce la incidencia de tumores mamarios, elimina el riesgo de infecciones uterinas como la piómetra y controla totalmente la reproducción.

En los machos, el comportamiento reproductivo puede desencadenar conductas indeseadas como marcaje excesivo, agresividad territorial y búsqueda permanente de hembras. La castración ayuda a disminuir estas conductas y reduce la probabilidad de tumores testiculares y problemas de próstata. Para aquellos animales destinados a reproducción, el seguimiento debe ser realizado por un veterinario, garantizando que sean individuos sanos, libres de enfermedades hereditarias y con un historial clínico adecuado.

El control reproductivo también incluye la suplementación nutricional, el manejo del peso corporal, la prevención de infecciones y el monitoreo durante la gestación. Las ecografías y revisiones periódicas permiten detectar a tiempo problemas fetales o alteraciones en el desarrollo. La planificación adecuada no solo mejora la salud de los padres, sino también la calidad de vida de las crías. La reproducción controlada es una herramienta que protege a las mascotas y evita complicaciones futuras.`;
                    uname2.excerpt = 'Reproducción responsable: ciclos, esterilización, castración y control.';
                    uname2.image = 'IMG/IMG20.jpg';
                }

                const uname3 = parsed.find(p => p.id === 'p_uname_3');
                if (uname3) {
                    uname3.title = 'Cómo reducir el estrés en perros y gatos para mejorar su bienestar';
                    uname3.category = 'Veterinaria';
                    uname3.content = `El estrés es una condición cada vez más común en perros y gatos, especialmente en animales que viven en entornos urbanos o que pasan largos periodos solos. Aunque muchas veces pasa desapercibido, el estrés afecta directamente el comportamiento, el sistema inmunológico y la salud general. Identificar sus causas y aplicar estrategias para reducirlo puede transformar la calidad de vida de nuestras mascotas y fortalecer el vínculo con sus cuidadores.

En los perros, el estrés suele manifestarse mediante ladridos excesivos, destrucción de objetos, jadeo constante, ansiedad por separación y comportamientos compulsivos. Estos signos pueden aparecer por falta de ejercicio, socialización insuficiente, cambios en la rutina o estímulos fuertes como ruidos de pólvora. Proporcionar actividad física diaria, juguetes interactivos, rutinas estables y entrenamiento positivo ayuda a disminuir de forma significativa la ansiedad. El enriquecimiento ambiental y los paseos regulares son indispensables para mantenerlos equilibrados.

En los gatos, el estrés se manifiesta a través de cambios en el apetito, agresividad, marcaje urinario y escondite prolongado. Como son animales territoriales, cualquier alteración en su entorno, como mudanzas, visitas nuevas o la llegada de otra mascota, puede desencadenar ansiedad. Para reducirla es fundamental ofrecer lugares altos, rascadores, zonas seguras, bandejas de arena limpias y acceso a escondites donde se sientan protegidos. Los juegos con plumas o luces también son una excelente estrategia para liberar tensión.

La música relajante, la feromonoterapia, los suplementos naturales y la interacción diaria con sus cuidadores contribuyen al bienestar emocional. La observación constante y la detección temprana de signos de estrés permiten intervenir antes de que evolucionen a problemas médicos o de conducta. Cuidar el equilibrio emocional de perros y gatos es una forma esencial de mejorar su salud integral y asegurarles una vida más tranquila y feliz.`;
                    uname3.excerpt = 'Reducir estrés en perros y gatos: señales y estrategias prácticas.';
                    uname3.image = 'IMG/IMG21.webp';
                }

                
                const cruzItem = parsed.find(p => p.id === 'p_cruzamientos');
                if (cruzItem) cruzItem.image = 'IMG/fia.jpeg';
                const thirdItem = parsed.find(p => p.id === 'p3');
                if (thirdItem) thirdItem.image = 'IMG/IMG15.jpeg';
                
                const mastitisTitleExact = 'Aplicación de inteligencia artificial en el diagnóstico de mastitis bovina: visión computacional y aprendizaje automático para detección temprana';
                const mastitisIdx = parsed.findIndex(p => (p.title || '').trim().toLowerCase() === mastitisTitleExact.toLowerCase());
                if (mastitisIdx !== -1) {
                    parsed[mastitisIdx].content = 'La mastitis bovina continúa siendo una de las enfermedades más comunes y costosas dentro de la producción lechera, no solo por su impacto directo en la salud del animal, sino también por la disminución de la calidad de la leche y las pérdidas económicas que genera en tratamientos, descarte y reducción en la eficiencia productiva. Tradicionalmente, su diagnóstico se ha basado en recuentos de células somáticas, mediciones de conductividad eléctrica o inspecciones clínicas, métodos que, aunque útiles, suelen aplicarse de manera tardía o con poca frecuencia, lo que limita la detección temprana (Menezes et al., 2024).\n\nEn este contexto, las herramientas de inteligencia artificial, como el aprendizaje automático y la visión computacional, han surgido como alternativas prometedoras para mejorar el diagnóstico de la enfermedad de manera más rápida, precisa y no invasiva. El desarrollo de cámaras térmicas, sensores, análisis de patrones en imágenes y modelos capaces de aprender a partir de grandes volúmenes de datos ha permitido que la detección de anomalías en la ubre o cambios en parámetros fisiológicos sea cada vez más eficiente. Estudios recientes reportan precisiones superiores al 85 %, lo cual evidencia el potencial de estas tecnologías en la identificación temprana de mastitis bovina (Wang et al., 2022).\n\nEl uso de inteligencia artificial en el diagnóstico veterinario se sustenta en su capacidad para procesar grandes cantidades de datos y generar predicciones basadas en patrones que podrían pasar desapercibidos para el ojo humano. Técnicas como machine learning y deep learning permiten analizar parámetros de comportamiento, datos clínicos e incluso imágenes térmicas para identificar animales enfermos con altos niveles de exactitud (Kour et al., 2022). La visión computacional, en particular, desempeña un papel clave, puesto que facilita el análisis automático de imágenes o vídeo, permitiendo detectar variaciones térmicas en la ubre, cambios en su tamaño o asimetrías que reflejan procesos inflamatorios antes de que los signos clínicos sean evidentes (Tassinari et al., 2021).\n\nLos avances en la detección automática de mastitis se han reflejado en múltiples investigaciones. Wang et al. (2022), por ejemplo, emplearon imágenes infrarrojas combinadas con un modelo de deep learning basado en YOLOv5, logrando identificar áreas térmicas anormales con una sensibilidad del 96,3 %. De forma complementaria, Chu et al. (2023) trabajaron con modelos que fusionaron información de temperatura y tamaño de la ubre, obteniendo una precisión del 83,3 % y una sensibilidad del 92,3 %. A nivel bibliométrico, Mitsunaga (2024) reportó un incremento significativo en las publicaciones relacionadas con IA y mastitis, lo que refleja el creciente interés científico en estas aplicaciones. Estos resultados confirman que el diagnóstico no invasivo, el monitoreo continuo del hato y la detección temprana del proceso inflamatorio representan beneficios concretos para la producción lechera.\n\nPese a su potencial, la adopción práctica de estas herramientas enfrenta retos importantes. La calidad y cantidad de datos disponibles es uno de los factores más determinantes: los modelos requieren bases de datos amplias, diversas y bien anotadas para poder generalizar a diferentes razas, ambientes y sistemas productivos. Además, muchos modelos desarrollados en condiciones específicas presentan limitaciones al aplicarse en regiones o fincas con características distintas, lo que hace necesaria una validación local antes de su implementación real. A estos desafíos se suman las exigencias de infraestructura, como cámaras térmicas o sistemas avanzados de almacenamiento de datos, y la necesidad de que los profesionales comprendan, al menos de manera básica, cómo se generan las predicciones para poder interpretarlas y confiar en ellas.\n\nA nivel operativo, la integración de sistemas basados en IA dentro de las rutinas de ordeño y manejo representa un reto adicional. La instalación, calibración, mantenimiento y alimentación continua de datos requieren organización y capacitación del personal. Este proceso implica evaluar las condiciones del entorno, el tipo de ordeño utilizado, el clima, la raza predominante y el estado sanitario del hato. También se requiere entrenar modelos adaptados a las condiciones locales, validar sus métricas de desempeño en campo y establecer sistemas de alerta que permitan actuar antes de que la enfermedad progrese y afecte la producción.\n\nA pesar de estas limitaciones, la inteligencia artificial ofrece oportunidades notables para mejorar la gestión de la salud mamaria y reducir pérdidas económicas asociadas a la mastitis. La integración de información proveniente de imágenes térmicas, parámetros de leche, recuento de células somáticas y comportamiento animal abre la puerta a sistemas de diagnóstico mucho más robustos. Asimismo, la automatización de alertas en tiempo real permite actuar con rapidez, reduciendo el uso excesivo de antibióticos, mejorando la calidad de la leche y favoreciendo el bienestar animal. A largo plazo, estos beneficios pueden traducirse en un retorno de inversión importante para las fincas lecheras.\n\nEn conjunto, la evidencia científica muestra que las aplicaciones de inteligencia artificial tienen el potencial de transformar por completo el diagnóstico y manejo de la mastitis bovina, al proporcionar métodos más rápidos, precisos y accesibles. Sin embargo, su adopción requiere superar barreras relacionadas con datos, infraestructura, validación y formación del personal. A medida que estas tecnologías sigan integrando diferentes tipos de información, como genética, sensores de actividad o datos de ordeño automatizado, es probable que los sistemas multimodales de IA mejoren aún más la detección temprana y el control de enfermedades dentro de la producción lechera moderna.\n\nReferencias\n\nChu, M., Li, Q., Wang, Y., Zeng, X., Si, Y., & Liu, G. (2023). Fusion of udder temperature and size features for the automatic detection of dairy cow mastitis using deep learning. Computers and Electronics in Agriculture, 212, 108131. https://doi.org/10.1016/j.compag.2023.108131\n\nKour, S., Agrawal, R., Sharma, N., Tikoo, A., Pande, N., & Sawhney, A. (2022). Artificial intelligence and its application in animal disease diagnosis. Journal of Animal Research, 12(1), 1–10. https://doi.org/10.30954/2277-940X.01.2022.1\n\nMenezes, G. L., Mazon, G., Ferreira, R. E. P., Cabrera, V. E., & Dórea, J. R. R. (2024). Artificial intelligence for livestock: A narrative review of the applications of computer vision systems and large language models for animal farming. Animal Frontiers, 14(6), 42–53. https://doi.org/10.1093/af/vfae048\n\nMitsunaga, T. M. (2024). Current trends in artificial intelligence and bovine mastitis: A bibliometric review (2011–2021). Animals, 14(14), 2023. https://doi.org/10.3390/ani14142023\n\nTassinari, P., Bovo, M., Benni, S., Franzoni, S., Poggi, M., Mammi, L. M. E., Mattoccia, S., & Di Stefano, L. (2021). A computer vision approach based on deep learning for the detection of dairy cows in free stall barn. Computers and Electronics in Agriculture, 182, 106030. https://doi.org/10.1016/j.compag.2021.106030\n\nWang, Y., Kang, X., He, Z, Feng, Y., & Liu, G. (2022). Accurate detection of dairy cow mastitis with deep learning technology: A new and comprehensive detection method based on infrared thermal images. Animal, 16(10), 100646. https://doi.org/10.1016/j.animal.2022.100646';
                    parsed[mastitisIdx].excerpt = 'IA para detección temprana de mastitis bovina: visión computacional, sensores y modelos.';
                    parsed[mastitisIdx].category = parsed[mastitisIdx].category || 'Veterinaria';
                    parsed[mastitisIdx].image = 'IMG/IMG14.jpeg';
                }
                const precisionTitleExact = 'ALIMENTACIÓN DE PRECISIÓN CON TECNOLOGÍA 4.0 EN CERDOS Y AVES: REVOLUCIÓN DIGITAL EN NUTRICIÓN MONOGÁSTRICA, EFICIENCIA PRODUCTIVA Y SOSTENIBILIDAD';
                const precisionIdx = parsed.findIndex(p => (p.title || '').trim().toLowerCase() === precisionTitleExact.toLowerCase());
                if (precisionIdx !== -1) {
                    const precisionContent = `La alimentación de precisión, unida a los avances de la Tecnología 4.0, se ha convertido en una de las herramientas más revolucionarias dentro de la producción animal moderna, especialmente en las cadenas porcina y avícola. En un sector que durante décadas se manejó con raciones estandarizadas y decisiones basadas en la experiencia, la incorporación de sensores digitales, inteligencia artificial, sistemas ciberfísicos, plataformas IoT y análisis masivo de datos está marcando un antes y un después. Estos avances han permitido pasar de modelos nutricionales generalizados a esquemas mucho más exactos y dinámicos, ajustados prácticamente a cada animal o a pequeños grupos con características semejantes. El propósito de esta revisión es presentar, de manera amplia y argumentada, los fundamentos científicos, los avances tecnológicos y el impacto real que tiene la alimentación de precisión en monogástricos, haciendo énfasis en su aplicabilidad en los sistemas productivos de América Latina.

Tradicionalmente, la alimentación de cerdos y aves se ha basado en la formulación por fases—como iniciación, crecimiento y finalización—pensando en satisfacer al “animal promedio”. Este enfoque, aunque práctico, genera importantes ineficiencias: unos animales reciben menos nutrientes de los que requieren, mientras que otros reciben más de lo necesario. Como consecuencia, aparecen problemas como desperdicio de alimento, exceso de nitrógeno y fósforo en las excretas, mayor variabilidad en el crecimiento y costos innecesarios en la producción. Las tecnologías actuales buscan corregir esas brechas nutricionales ajustando la dieta de acuerdo con el peso, la etapa fisiológica, el ambiente térmico, los patrones de consumo e incluso factores genéticos de cada individuo (Pomar & Remus, 2019).

La integración de herramientas propias de la Ganadería 4.0 ha permitido desarrollar estaciones de alimentación inteligentes, comederos automáticos capaces de reconocer al animal, sistemas con sensores ambientales, cámaras en 3D, algoritmos de predicción y plataformas IoT que procesan datos en tiempo real. Estos sistemas no solo registran peso, temperatura o consumo, sino que también generan recomendaciones automáticas o ejecutan ajustes inmediatos sobre la dieta. Dado que el alimento representa cerca del 60–70% de los costos totales en porcicultura y avicultura, la posibilidad de afinar la nutrición de manera continua tiene un impacto directo sobre la eficiencia y la rentabilidad del sistema.

El objetivo central de la alimentación de precisión es reducir lo más posible la distancia entre lo que el animal realmente necesita y lo que recibe en su comedero. La variabilidad dentro de un mismo lote puede ser muy amplia, tanto en peso como en velocidad de crecimiento o en sensibilidad al estrés calórico. Para compensar esto, los sistemas tradicionales suelen formular dietas “por encima” de lo necesario, lo que genera sobreoferta de proteína y aminoácidos esenciales. Estudios recientes han mostrado que, mediante modelos matemáticos y sensores que registran el peso corporal de forma continua, es posible reducir el aporte proteico entre un 25% y un 40% sin afectar el desempeño (Pomar et al., 2022). Esto es especialmente útil en ambientes cálidos, donde los animales reducen su consumo voluntario. Renaudeau et al. (2019), por ejemplo, demostraron que los cerdos sometidos a altas temperaturas pueden comer hasta un 20% menos, lo que subraya la importancia de ajustar las dietas de manera más fina.

El despliegue de la Tecnología 4.0 en nutrición animal involucra sensores IoT, sistemas de monitoreo de consumo, estaciones de alimentación inteligentes, balanzas automáticas, cámaras térmicas y tridimensionales, dispositivos RFID para identificar animales de forma individual, algoritmos de inteligencia artificial, visión por computadora, robótica e incluso sistemas ciberfísicos que centralizan toda la información. Gracias a estos dispositivos, hoy es posible monitorear un lote de aves o cerdos minuto a minuto, registrando desde comportamiento hasta variaciones en el peso. Tal como señalan Pomar y Remus (2019), la producción dejó de basarse en el “promedio del rebaño” para orientarse hacia el individuo, lo cual aumenta notablemente la precisión nutricional.

En porcicultura, los sistemas automáticos han ganado terreno, sobre todo en las etapas de crecimiento y finalización. Las estaciones con RFID identifican al cerdo, registran su ingreso al comedero y calculan su peso para ajustar en ese mismo momento la composición de la dieta. Los comederos inteligentes permiten controlar el consumo real de cada animal y ofrecen exactamente la cantidad de alimento que necesita según su curva de crecimiento. Incluso existen sistemas de alimentación líquida que pueden ajustar la composición de la dieta día a día, una ventaja en climas cálidos donde el alimento húmedo mejora el confort y el consumo. Gerrits et al. (2020) demostraron que estos sistemas reducen el costo por kilogramo de carne entre un 8% y un 12%, principalmente por la mejora en la conversión alimenticia y la menor variabilidad entre animales.

En aves, donde las poblaciones son mucho más grandes y la precisión debe ser inmediata, las tecnologías han evolucionado hacia tolvas inteligentes, cámaras de visión artificial y robots alimentadores. Las tolvas con sensores controlan el llenado automático y ajustan la densidad nutricional según la edad del lote o condiciones ambientales. La visión por computadora permite estimar el peso corporal de forma grupal sin necesidad de manipular a las aves, y los robots garantizan una distribución más uniforme del alimento. Zuidhof et al. (2017) encontraron mejoras en la conversión alimenticia del 3–5%, una uniformidad superior al 90% y reducciones en la mortalidad del 7–10%.

Uno de los grandes beneficios de los sistemas de precisión es su capacidad para ajustar la dieta según el clima, el peso y la etapa productiva. El estrés térmico obliga a reformular las dietas, aumentando la concentración energética y modificando la relación de electrolitos para evitar pérdidas de productividad. Las diferencias de peso dentro de un lote, que pueden superar el 25%, también justifican ajustes diarios, sobre todo en sistemas de crecimiento intensivo. Además, las transiciones nutricionales se vuelven más suaves, lo que mejora la deposición muscular y reduce problemas metabólicos.

La reducción del desperdicio es otro punto clave. Los comederos automáticos disminuyen las pérdidas por derrame hasta en un 15% y evitan la sobreoferta nutricional. Esto, sumado a la mejora en la conversión alimenticia, representa un ahorro considerable al final de cada ciclo productivo. Desde el punto de vista ambiental, la excreción de nitrógeno y fósforo puede reducirse entre un 20% y un 40%, lo que convierte a la alimentación de precisión en una estrategia también favorable para la sostenibilidad.

Por supuesto, la implementación de estas tecnologías no está libre de desafíos. Los costos iniciales pueden ser altos, la conectividad es un factor crítico, el personal debe capacitarse para interpretar los datos y los sistemas requieren mantenimiento constante. Sin embargo, la evidencia indica que el retorno económico suele obtenerse entre 12 y 24 meses después de la inversión.

Mirando hacia el futuro, se espera que la alimentación de precisión avance hacia sistemas aún más autónomos y predictivos. El uso de inteligencia artificial para estimar requerimientos individuales, drones capaces de monitorear actividad desde el aire, robots que suministren alimento animal por animal y los llamados gemelos digitales, que simulan escenarios productivos antes de aplicarlos, apuntan a una automatización casi completa. Todo indica que las granjas evolucionarán hacia ecosistemas inteligentes donde los animales estarán monitoreados las 24 horas del día y las decisiones nutricionales se ejecutarán de manera automática e inmediata.`;
                    parsed[precisionIdx].content = precisionContent;
                    parsed[precisionIdx].excerpt = 'Alimentación de precisión con Tecnología 4.0 en cerdos y aves: nutrición ajustada, eficiencia y sostenibilidad.';
                    parsed[precisionIdx].category = 'Zootecnia';
                }
                const policTitleExact = 'Policultivos y sistemas silvopastoriles en Colombia: una estrategia hacia la sostenibilidad agropecuaria';
                const policIdx = parsed.findIndex(p => (p.title || '').trim().toLowerCase() === policTitleExact.toLowerCase());
                if (policIdx !== -1) {
                    const policParts = [];
                    policParts.push('En el contexto colombiano, los modelos convencionales de producción agrícola y ganadera han mostrado crecientes limitaciones en términos de sostenibilidad ambiental, eficiencia productiva y resiliencia frente al cambio climático. En este sentido, los policultivos y los sistemas silvopastoriles se presentan como alternativas integrales para diversificar la producción, mejorar los servicios ecosistémicos, restaurar suelos degradados y aumentar la competitividad de las fincas. Estas estrategias permiten combinar eficiencia productiva con conservación ambiental, y se perfilan como herramientas clave para transformar los sistemas agropecuarios hacia modelos más sostenibles. La evidencia disponible muestra que, aunque su adopción ha avanzado en algunos territorios, todavía existen brechas en conocimiento, apoyo institucional y escalabilidad que limitan su implementación plena en Colombia.');
                    policParts.push('');
                    policParts.push('La agricultura y la ganadería en el país han sido históricamente motores del desarrollo rural, pero al mismo tiempo han generado impactos negativos como deforestación, degradación de suelos y disminución de biodiversidad. Este fenómeno es particularmente evidente en zonas de ganadería extensiva como la Orinoquia, los Llanos Orientales y ciertas áreas andinas, donde la productividad por hectárea continúa siendo baja y la presión sobre el territorio es alta. Conforme lo plantea Bueno (2012), los sistemas extensivos han contribuido a la pérdida de cobertura vegetal y al aumento de emisiones de gases de efecto invernadero, lo que refuerza la urgencia de implementar alternativas sostenibles. En este escenario, los policultivos y los sistemas silvopastoriles ofrecen una vía para integrar producción, restauración y conservación en una misma unidad productiva.');
                    policParts.push('');
                    policParts.push('Los policultivos, entendidos como la siembra simultánea o secuencial de dos o más especies en la misma parcela, permiten optimizar el uso del espacio y promover la diversidad biológica del sistema. Rodríguez-Morán (2010) afirma que esta práctica mejora la estabilidad productiva, reduce la incidencia de plagas y contribuye a un mejor aprovechamiento de los nutrientes del suelo. En Colombia, los policultivos han sido utilizados en diversos contextos agrícolas, especialmente en sistemas agroecológicos donde se busca combinar cultivos alimentarios, forrajes y especies arbóreas o arbustivas fijadoras de nitrógeno, lo que mejora la productividad por unidad de área y la resiliencia frente a variaciones climáticas.');
                    policParts.push('');
                    policParts.push('Por su parte, los sistemas silvopastoriles integran árboles, arbustos forrajeros, pasturas y animales en una sola unidad de producción, generando interacciones benéficas entre los componentes del sistema. Según Rosero Montero (2008), estos sistemas aportan múltiples ventajas como la provisión de sombra, la mejora del microclima, la regulación hídrica, el aumento de la fertilidad del suelo y la diversificación de productos. En Colombia, la Fundación CIPAV ha documentado desde los años noventa experiencias exitosas, como los sistemas basados en leucaena en el Valle del Cauca, que han demostrado aumentos significativos en bienestar animal, producción de leche y conservación del suelo.');
                    policParts.push('');
                    policParts.push('La aplicación de policultivos y sistemas silvopastoriles en el territorio nacional ha mostrado avances importantes. Investigaciones como las de Grisales (2018) evidencian que estos modelos pueden adaptarse incluso a regiones de bosque seco tropical, un ecosistema altamente vulnerable, lo que demuestra su versatilidad y potencial de restauración. De igual forma, estudios como el de Bueno (2012) destacan que en la Orinoquia colombiana la integración de árboles multipropósito en la ganadería aumenta la disponibilidad de biomasa, mejora el manejo del agua, reduce la estacionalidad forrajera y fortalece la sostenibilidad ambiental. En el caso de los policultivos, aunque la literatura es menos abundante, los módulos académicos y experiencias de campo reflejan su creciente adopción en sistemas agroecológicos, especialmente en zonas donde la diversificación es una estrategia de seguridad alimentaria.');
                    policParts.push('');
                    policParts.push('Los beneficios de estas prácticas son amplios y abarcan aspectos ecológicos, productivos y socioeconómicos. En términos ecosistémicos, los policultivos y los sistemas silvopastoriles mejoran la estructura del suelo, aumentan la cantidad de materia orgánica, reducen la erosión y elevan la biodiversidad funcional del sistema. Las raíces profundas de los árboles contribuyen a romper capas compactadas y facilitar la infiltración de agua, mientras que la hojarasca aporta nutrientes de forma constante. Rosero Montero (2008) y Bueno (2012) coinciden en que estos sistemas incrementan la resiliencia ante eventos climáticos extremos, como sequías o lluvias intensas, y aportan significativamente al secuestro de carbono, posicionándolos como estrategias clave frente al cambio climático.');
                    policParts.push('');
                    policParts.push('Desde el punto de vista productivo y económico, los policultivos permiten diversificar la oferta de productos agrícolas y reducir los riesgos asociados a monocultivos. En los sistemas silvopastoriles, la integración de árboles y arbustos forrajeros mejora la calidad nutricional del forraje, aumenta la eficiencia del uso del agua y contribuye al bienestar animal al proveer sombra y microclimas más frescos. Esto se traduce en mayores niveles de productividad y menor estacionalidad en la oferta de alimento. Además, la combinación de productos —como carne, leche, madera, frutos o biomasa forrajera— reduce la dependencia de un solo rubro y aumenta la estabilidad económica del productor.');
                    policParts.push('');
                    policParts.push('A pesar de estos beneficios, la adopción de policultivos y sistemas silvopastoriles enfrenta múltiples desafíos. Muchos productores perciben estos modelos como complejos y costosos en su fase inicial, lo que genera barreras de entrada. La falta de capacitación técnica, la escasa disponibilidad de materiales vegetales adecuados y la ausencia de incentivos económicos limitan la expansión de estos sistemas en varias regiones del país. Asimismo, Rosero Montero (2008) señala que el diseño de los sistemas debe adaptarse estrictamente a las condiciones locales de suelo, clima y manejo, lo que exige planificación rigurosa y acompañamiento técnico especializado. Otro reto importante es la falta de mecanismos estandarizados para cuantificar los servicios ecosistémicos generados, lo cual dificulta la valoración económica del aporte ambiental de estos sistemas y limita su acceso a pagos por servicios ambientales u otros incentivos.');
                    policParts.push('');
                    policParts.push('A pesar de estas limitaciones, la evidencia indica que los policultivos y los sistemas silvopastoriles representan estrategias prometedoras para transformar el agro colombiano hacia modelos más sostenibles, productivos y resilientes. Para lograr una adopción masiva, se requiere fortalecer las políticas públicas orientadas a incentivar la transición agroecológica mediante programas de capacitación, subsidios, pagos por servicios ambientales y certificación de buenas prácticas. La investigación aplicada debe centrarse en desarrollar guías adaptadas a las diversas regiones agroecológicas, cuantificar los servicios ecosistémicos y evaluar económicamente los modelos productivos basados en estas estrategias. Igualmente, es fundamental articular las cadenas productivas de modo que la diversificación derive en valor agregado para los productores, así como promover modelos de negocio que demuestren la viabilidad económica de estos sistemas a mediano y largo plazo. Finalmente, la transferencia tecnológica y la educación rural deben fortalecerse a través de alianzas público-privadas, programas de extensión y demostraciones en campo.');
                    policParts.push('');
                    policParts.push('En conjunto, aunque los desafíos son significativos, la integración de policultivos y sistemas silvopastoriles constituye una de las rutas más coherentes y eficientes para avanzar hacia una agricultura y una ganadería colombiana más competitiva, sostenible y alineada con las exigencias ambientales y productivas del siglo XXI.');
                    policParts.push('');
                    policParts.push('Referencias (APA 7):');
                    policParts.push('');
                    policParts.push('Bueno, G. A. (2012). Sistemas silvopastoriles, arreglos y usos. Revista Sistemas de Producción Agroecológicos, 3(2), 56–83. https://doi.org/10.22579/22484817.604');
                    policParts.push('Grisales, D. O. (2018). Sistemas silvopastoriles para zona de bosque seco (Trabajo de grado). Centro de Formación Agroindustrial La Angostura.');
                    policParts.push('Rosero Montero, L. H. (2008). Los sistemas silvopastoriles y su impacto sobre la relación suelo-planta-animal y hombre en Colombia. Universidad de Nariño.');
                    policParts.push('Rodríguez-Morán, S. S. (2010). Policultivos y sistemas silvopastoriles [Módulo de estudio]. UNIMINUTO.');
                    policParts.push('Fundación CIPAV. (2016). Sistemas silvopastoriles: aspectos teóricos y prácticos');
                    const policContent = policParts.join('\n');
                    parsed[policIdx].content = policContent;
                    parsed[policIdx].excerpt = 'Policultivos y sistemas silvopastoriles en Colombia: sostenibilidad, productividad y restauración de suelos.';
                    parsed[policIdx].category = parsed[policIdx].category || 'Agronomía';
                    parsed[policIdx].image = 'IMG/IMG18.jpg';
                }
                const aquaTitleExact = 'Guía de Alimentación y Manejo Nutricional en la Producción Acuícola de Mojarra y Cachama';
                const aquaIdx = parsed.findIndex(p => (p.title || '').trim().toLowerCase() === aquaTitleExact.toLowerCase());
                if (aquaIdx !== -1) {
                    const aquaParts = [];
                    aquaParts.push('La acuicultura se ha consolidado como uno de los sectores pecuarios de mayor crecimiento en Colombia, especialmente en la producción de mojarra roja y cachama, dos especies ampliamente reconocidas por su adaptabilidad, eficiencia productiva y alta aceptación comercial. Un manejo nutricional adecuado es fundamental para garantizar peces sanos, buen desempeño zootécnico y una calidad de carne que cumpla con los estándares del mercado. El suministro apropiado de alimento, la selección de concentrados de calidad, el control de factores ambientales y la prevención de enfermedades nutricionales permiten maximizar la rentabilidad de los sistemas piscícolas, particularmente en unidades productivas de pequeña y mediana escala.');
                    aquaParts.push('');
                    aquaParts.push('La mojarra roja, perteneciente al género Oreochromis, es una especie omnívora con tendencia a la herbivoría, capaz de aprovechar eficientemente dietas basadas en carbohidratos de origen vegetal y concentrados balanceados de niveles intermedios de proteína. En las primeras etapas de desarrollo, los alevinos requieren dietas entre 32 % y 40 % de proteína para garantizar un crecimiento acelerado y eficiente, mientras que en la fase de engorde los requerimientos disminuyen a 28–30 %. La suplementación con vitaminas, minerales y niveles adecuados de lípidos contribuye al fortalecimiento del sistema inmune y a una mejor conversión alimenticia. Para lograr resultados óptimos, los peces deben alimentarse varias veces al día según la etapa productiva, asegurando que el consumo se realice en un periodo máximo de 10 a 15 minutos para evitar desperdicios y deterioro de la calidad del agua.');
                    aquaParts.push('');
                    aquaParts.push('En el caso de la cachama, especies pertenecientes a los géneros Colossoma y Piaractus, se trata de peces omnívoros con preferencia frugívora, altamente eficientes en el aprovechamiento de dietas vegetales y con requerimientos proteicos más bajos que la mojarra. Los alevinos deben consumir alimentos con 32–36 % de proteína, mientras que en el engorde se recomiendan valores entre 22 % y 28 %. Esta especie presenta mejores respuestas productivas cuando se utilizan alimentos flotantes, ya que permiten evaluar el consumo real y reducir el desperdicio. Tal como sucede con la mojarra, la frecuencia de alimentación disminuye progresivamente a medida que avanza la etapa productiva, garantizando un suministro suficiente para evitar competencias y estrés.');
                    aquaParts.push('');
                    aquaParts.push('El desempeño nutricional de mojarra y cachama está fuertemente influenciado por factores ambientales. La temperatura del agua condiciona el metabolismo y el apetito, siendo óptimos los rangos entre 26–30 °C para mojarra y 28–32 °C para cachama. Temperaturas inferiores disminuyen el consumo, aumentan la susceptibilidad a enfermedades y afectan la ganancia de peso. La calidad del agua es otro factor crítico, pues niveles de oxígeno disuelto inferiores a 5 mg/L, pH fuera del rango 6.5–8.5 o concentraciones elevadas de amonio generan estrés, anorexia, inmunodepresión y mortalidad, además de aumentar el índice de conversión alimenticia. La densidad de siembra también influye en la eficiencia del sistema; densidades excesivas incrementan la competencia por alimento, reducen el crecimiento y deterioran las condiciones fisicoquímicas del agua.');
                    aquaParts.push('');
                    aquaParts.push('Las estrategias complementarias de alimentación, como el uso de probióticos y prebióticos, pueden mejorar la conversión alimenticia, favorecer el equilibrio de la microbiota intestinal y fortalecer la salud general de los peces. De igual forma, algunos sistemas integran de manera controlada la alimentación mixta con forrajes verdes, subproductos agrícolas o harinas vegetales, aunque estos deben emplearse con precaución para evitar fermentaciones indeseadas y contaminación del agua. La elección entre alimentos flotantes o hundidos depende de la especie y la etapa productiva, siendo los primeros ideales para la cachama y los segundos útiles en etapas tempranas de la mojarra.');
                    aquaParts.push('');
                    aquaParts.push('Los problemas nutricionales pueden manifestarse de diversas formas. Las deficiencias proteicas provocan crecimiento lento, palidez y deterioro de aletas; el exceso de alimento genera turbidez en el agua, aumento del amonio y episodios de hipoxia nocturna; y las deficiencias vitamínicas se reflejan en curvaturas de columna, hemorragias y trastornos neuromusculares. Para evitar estas alteraciones, la nutrición debe complementarse con un buen manejo sanitario, controles constantes y ajustes en la dieta según la respuesta de los peces.');
                    aquaParts.push('');
                    aquaParts.push('La rentabilidad del sistema puede incrementarse mediante la compra de alimentos de marcas reconocidas y con etiquetado nutricional claro, la adecuada conservación del concentrado en condiciones secas y libres de plagas, y el monitoreo continuo del índice de conversión alimenticia, que idealmente debe mantenerse entre 1.5 y 2.0 en mojarra y entre 1.8 y 2.5 en cachama. La implementación de registros productivos y muestreos de peso cada dos semanas permite ajustar estrategias de manejo y prever posibles problemas, mejorando la eficiencia global del sistema productivo.');
                    aquaParts.push('');
                    aquaParts.push('Referencias (APA 7)');
                    aquaParts.push('');
                    aquaParts.push('El-Sayed, A. F. M. (2020). Tilapia culture. Academic Press.');
                    aquaParts.push('Furuya, W. M., & Furuya, V. R. B. (2010). Nutritional requirements and feeding of omnivorous fish: Tilapia and pacu. Revista Brasileira de Zootecnia, 39(Suppl.), 68–78.');
                    aquaParts.push('Lima, A. F., Val, A. L., & Almeida-Val, V. M. F. (2019). Nutrition and feeding practices for native Amazonian fish species. Aquaculture Research, 50(3), 713–726.');
                    aquaParts.push('Martínez-Cárdenas, L., & Leung, J. S. (2018). Tilapia feeding strategies in tropical aquaculture systems. Aquaculture International, 26(4), 1101–1114.');
                    aquaParts.push('Teixeira-de Mello, F., Iglesias, C., & Borteiro, C. (2012). Feeding ecology and nutritional biology of Colossoma and Piaractus species. Neotropical Ichthyology, 10(2), 265–276.');
                    aquaParts.push('Turchini, G. M., & Francis, D. S. (2021). Fish nutrition and feed formulation for sustainable aquaculture. Reviews in Aquaculture, 13(1), 234–260.');
                    const aquaContent = aquaParts.join('\n');
                    parsed[aquaIdx].content = aquaContent;
                    parsed[aquaIdx].excerpt = 'Guía nutricional para mojarra y cachama: requerimientos, manejo y eficiencia en acuicultura.';
                    parsed[aquaIdx].category = parsed[aquaIdx].category || 'Acuicultura';
                    parsed[aquaIdx].image = 'IMG/IMG8.jpeg';
                }
                const petsTitleExact = 'Guía Completa de Alimentación Saludable Para Perros y Gatos';
                const petsIdx = parsed.findIndex(p => (p.title || '').trim().toLowerCase() === petsTitleExact.toLowerCase());
                if (petsIdx !== -1) {
                    const petsParts = [];
                    petsParts.push('La alimentación es uno de los pilares fundamentales para la salud de los animales de compañía. En perros y gatos, una dieta equilibrada contribuye a un sistema inmunológico fuerte, un pelaje saludable, una buena condición corporal y una vida más larga y de mejor calidad. Cada especie tiene necesidades nutricionales particulares, por lo que es importante conocerlas para brindar un cuidado verdaderamente responsable. Una nutrición adecuada empieza por entender qué requiere cada mascota según su especie, edad, tamaño y nivel de actividad.');
                    petsParts.push('');
                    petsParts.push('En los perros, que son omnívoros facultativos, la dieta debe incluir proteínas de calidad para mantener la masa muscular y las funciones metabólicas, grasas como principal fuente de energía, carbohidratos de fácil digestión, vitaminas, minerales y acceso permanente a agua fresca. La opción más recomendada es el concentrado comercial de buena calidad, ya sea premium o super premium, porque garantiza un balance adecuado de nutrientes. Es mejor evitar los concentrados económicos, que suelen contener subproductos y exceso de carbohidratos. Las dietas caseras o BARF solo deben ofrecerse si están formuladas por un médico veterinario, ya que pueden causar deficiencias o excesos nutricionales. En cuanto a la frecuencia, los cachorros deben comer de tres a cuatro veces al día, los adultos una o dos veces, y los perros mayores pueden requerir porciones más pequeñas si tienen dificultades digestivas. Siempre debe evitarse el chocolate, la cebolla, el ajo, las uvas, el alcohol, la cafeína, el xilitol y los huesos cocidos, ya que representan un riesgo grave para su salud.');
                    petsParts.push('');
                    petsParts.push('En los gatos, la alimentación requiere aún más precisión debido a que son carnívoros estrictos y dependen de nutrientes exclusivos de origen animal, como la taurina, el ácido araquidónico, la vitamina A preformada y proteínas de alta calidad. No metabolizan bien los carbohidratos, por lo que estos deben ser mínimos en su dieta. El alimento recomendado es el concentrado premium o super premium para gatos, con alto contenido de proteína animal y bajo en cereales. Las dietas caseras o BARF deben ser formuladas por un profesional, ya que una mínima deficiencia puede causar problemas graves, como cardiomiopatías o ceguera. La hidratación es fundamental porque los gatos suelen beber poca agua, lo que aumenta el riesgo de enfermedad renal, cistitis y formación de cristales urinarios. Por eso es útil complementar el concentrado seco con alimento húmedo varias veces por semana y mantener agua fresca disponible. Deben evitarse alimentos como cebolla, ajo, chocolate, leche de vaca, pescado crudo y restos de comida humana.');
                    petsParts.push('');
                    petsParts.push('Mantener un peso adecuado es una parte esencial del bienestar. La obesidad es uno de los problemas médicos más comunes en perros y gatos, y puede conducir a enfermedades como diabetes, problemas articulares, alteraciones cardíacas y dificultad respiratoria. Para prevenirla, es necesario controlar porciones, limitar los premios, fomentar la actividad física diaria y elegir un alimento adecuado según la edad y la condición corporal de cada mascota.');
                    petsParts.push('');
                    petsParts.push('Siempre es recomendable consultar a un veterinario cuando ocurren cambios en el apetito, vómito o diarrea recurrente, pérdidas o aumentos de peso inexplicables, problemas de piel o alergias, o cuando se desea cambiar a una dieta casera o natural. También es fundamental contar con asesoría profesional en cachorros, animales adultos mayores o mascotas con enfermedades crónicas.');
                    petsParts.push('');
                    petsParts.push('En Veterinaria Online 24/7 ofrecemos acompañamiento especializado en nutrición animal, interpretación de exámenes y selección del plan alimenticio ideal para que cada mascota reciba exactamente lo que necesita para mantenerse sana y feliz.');
                    const petsContent = petsParts.join('\n');
                    parsed[petsIdx].content = petsContent;
                    parsed[petsIdx].excerpt = 'Guía práctica de nutrición para perros y gatos: qué dar, qué evitar y cómo cuidar.';
                    parsed[petsIdx].category = parsed[petsIdx].category || 'Veterinaria';
                    parsed[petsIdx].image = 'IMG/IMG17.jpg';
                }
                try { localStorage.setItem('blog_posts', JSON.stringify(parsed)); } catch (e) {}
                return parsed;
            }
        }
    } catch (e) {}
    let defaults = defaultBlogPosts();
    const removalTitles = [
        'Cuidados postoperatorios en mascotas',
        'Bienestar animal en sistemas de doble propósito',
        'Manejo de suelos: pH y fertilización',
        'Rentabilidad del cruzamiento bovino en clima cálido: análisis productivo y económico de Brahman × Holstein, Girolando y Simbrah',
        'Drones en Ganadería: La Nueva Era de la Vigilancia, Bienestar Animal y Productividad'
    ];
    defaults = defaults.filter(p => !removalTitles.includes((p.title || '').trim()) && p.id !== 'p_drones_ganaderia' && ((p.title||'').trim().toLowerCase() !== 'uname') && (!(/^p_uname_\d+$/.test(p.id)) || ['p_uname_1','p_uname_2','p_uname_3'].includes(p.id)));
    const base = [robotsArticlePost(), cruzamientosArticlePost(), mastitisArticlePost(), acuiculturaArticlePost(), petsNutritionArticlePost(), policultivosArticlePost()];
    base.forEach(b => { const ex = defaults.some(p => p.id === b.id); if (!ex) defaults.push(b); });
    const banar = bathingDogArticlePost();
    { const ex = defaults.some(p => p.id === banar.id); if (!ex) defaults.push(banar); }
    const fish = fishDiseasesArticlePost();
    { const ex = defaults.some(p => p.id === fish.id); if (!ex) defaults.push(fish); }
    const swine = swineFeedEfficiencyArticlePost();
    { const ex = defaults.some(p => p.id === swine.id); if (!ex) defaults.push(swine); }
    const unameDefaults = placeholderUnamePosts();
    unameDefaults.forEach(up => { const ex = defaults.some(p => p.id === up.id); if (!ex) defaults.push(up); });
    const unameDef1 = defaults.find(p => p.id === 'p_uname_1');
    if (unameDef1) {
        unameDef1.title = 'Enfermedades más comunes en perros y gatos y cómo prevenirlas';
        unameDef1.category = 'Veterinaria';
        unameDef1.content = `La salud preventiva es uno de los pilares más importantes en la medicina veterinaria. Perros y gatos, sin importar su raza, edad o tamaño, están expuestos a una variedad de enfermedades que pueden afectar su bienestar y su expectativa de vida. La clave para mantenerlos sanos es conocer los riesgos más frecuentes y actuar a tiempo mediante vacunación, desparasitación, controles periódicos y un adecuado manejo ambiental. Una rutina preventiva bien organizada puede evitar gastos futuros y prolongar la vida de nuestras mascotas de manera significativa.

En los perros, una de las enfermedades más comunes es el parvovirus, una infección viral altamente contagiosa que afecta principalmente a cachorros y produce vómito, diarrea hemorrágica, deshidratación y muerte en pocas horas si no se trata. Otra enfermedad frecuente es el moquillo, un virus que compromete el sistema respiratorio y neurológico. Las enfermedades respiratorias como la traqueobronquitis y las infecciones por parásitos gastrointestinales también están entre las afecciones más vistas en la clínica diaria. La vacunación anual, la higiene adecuada y evitar el contacto con animales enfermos son medidas esenciales para prevenirlas.

En los gatos, la rinotraqueítis viral felina y el calicivirus son responsables de la mayoría de los cuadros respiratorios. Además, la leucemia felina y la inmunodeficiencia son enfermedades virales de importancia que se transmiten por contacto entre gatos, especialmente en aquellos que viven en exteriores. Los parásitos como las pulgas y los ácaros también son muy comunes y pueden desencadenar alergias, anemia y otros problemas de piel. Mantener un calendario de vacunación estricto, la desparasitación interna y externa periódica y el control del entorno reducen drásticamente estos riesgos.

Una correcta nutrición, chequeos veterinarios anuales, limpieza del hogar y un ambiente libre de estrés ayudan a fortalecer el sistema inmunológico. La observación diaria, como cambios en apetito, conducta o eliminación, permite detectar enfermedades en etapas tempranas. La medicina preventiva es siempre la mejor inversión y garantiza una vida más larga, activa y saludable para perros y gatos.`;
        unameDef1.excerpt = 'Salud preventiva en perros y gatos: riesgos frecuentes, vacunación y controles.';
        unameDef1.image = 'IMG/IMG19.jpg';
    }
    const unameDef2 = defaults.find(p => p.id === 'p_uname_2');
    if (unameDef2) {
        unameDef2.title = 'Claves para manejar correctamente la reproducción en hembras y machos';
        unameDef2.category = 'Veterinaria';
        unameDef2.content = `La reproducción en las mascotas debe manejarse con responsabilidad, ya que afecta directamente la salud, el comportamiento y el bienestar tanto de hembras como de machos. Un adecuado manejo reproductivo previene complicaciones médicas, evita camadas no deseadas y contribuye al control poblacional. Comprender los ciclos, las señales de fertilidad y las opciones de control reproductivo permite tomar decisiones informadas y seguras para cada animal.

En las hembras, el celo es un proceso fisiológico que aparece cada seis a ocho meses, dependiendo de la especie y la raza. Durante esta etapa, la hembra puede mostrar cambios de conducta como inquietud, sangrado vaginal y atracción hacia los machos. Es importante evitar la monta accidental, ya que los embarazos no planificados aumentan el riesgo de distocias, abortos y problemas metabólicos. La esterilización es uno de los métodos más recomendados porque reduce la incidencia de tumores mamarios, elimina el riesgo de infecciones uterinas como la piómetra y controla totalmente la reproducción.

En los machos, el comportamiento reproductivo puede desencadenar conductas indeseadas como marcaje excesivo, agresividad territorial y búsqueda permanente de hembras. La castración ayuda a disminuir estas conductas y reduce la probabilidad de tumores testiculares y problemas de próstata. Para aquellos animales destinados a reproducción, el seguimiento debe ser realizado por un veterinario, garantizando que sean individuos sanos, libres de enfermedades hereditarias y con un historial clínico adecuado.

El control reproductivo también incluye la suplementación nutricional, el manejo del peso corporal, la prevención de infecciones y el monitoreo durante la gestación. Las ecografías y revisiones periódicas permiten detectar a tiempo problemas fetales o alteraciones en el desarrollo. La planificación adecuada no solo mejora la salud de los padres, sino también la calidad de vida de las crías. La reproducción controlada es una herramienta que protege a las mascotas y evita complicaciones futuras.`;
        unameDef2.excerpt = 'Reproducción responsable: ciclos, esterilización, castración y control.';
        unameDef2.image = 'IMG/IMG20.jpg';
    }
    const unameDef3 = defaults.find(p => p.id === 'p_uname_3');
    if (unameDef3) {
        unameDef3.title = 'Cómo reducir el estrés en perros y gatos para mejorar su bienestar';
        unameDef3.category = 'Veterinaria';
        unameDef3.content = `El estrés es una condición cada vez más común en perros y gatos, especialmente en animales que viven en entornos urbanos o que pasan largos periodos solos. Aunque muchas veces pasa desapercibido, el estrés afecta directamente el comportamiento, el sistema inmunológico y la salud general. Identificar sus causas y aplicar estrategias para reducirlo puede transformar la calidad de vida de nuestras mascotas y fortalecer el vínculo con sus cuidadores.

En los perros, el estrés suele manifestarse mediante ladridos excesivos, destrucción de objetos, jadeo constante, ansiedad por separación y comportamientos compulsivos. Estos signos pueden aparecer por falta de ejercicio, socialización insuficiente, cambios en la rutina o estímulos fuertes como ruidos de pólvora. Proporcionar actividad física diaria, juguetes interactivos, rutinas estables y entrenamiento positivo ayuda a disminuir de forma significativa la ansiedad. El enriquecimiento ambiental y los paseos regulares son indispensables para mantenerlos equilibrados.

En los gatos, el estrés se manifiesta a través de cambios en el apetito, agresividad, marcaje urinario y escondite prolongado. Como son animales territoriales, cualquier alteración en su entorno, como mudanzas, visitas nuevas o la llegada de otra mascota, puede desencadenar ansiedad. Para reducirla es fundamental ofrecer lugares altos, rascadores, zonas seguras, bandejas de arena limpias y acceso a escondites donde se sientan protegidos. Los juegos con plumas o luces también son una excelente estrategia para liberar tensión.

La música relajante, la feromonoterapia, los suplementos naturales y la interacción diaria con sus cuidadores contribuyen al bienestar emocional. La observación constante y la detección temprana de signos de estrés permiten intervenir antes de que evolucionen a problemas médicos o de conducta. Cuidar el equilibrio emocional de perros y gatos es una forma esencial de mejorar su salud integral y asegurarles una vida más tranquila y feliz.`;
        unameDef3.excerpt = 'Reducir estrés en perros y gatos: señales y estrategias prácticas.';
        unameDef3.image = 'IMG/IMG21.webp';
    }
    
    const robotsItem = defaults.find(p => p.id === 'p_robotica_produccion_animal');
    if (robotsItem) robotsItem.image = 'IMG/ganaeria-3.jpg';
    const cruzItem = defaults.find(p => p.id === 'p_cruzamientos');
    if (cruzItem) cruzItem.image = 'IMG/fia.jpeg';
    const thirdItem = defaults.find(p => p.id === 'p3');
    if (thirdItem) thirdItem.image = 'IMG/IMG15.jpeg';
    const mastitisItem = defaults.find(p => p.id === 'p_mastitis_ia');
    if (mastitisItem) mastitisItem.image = 'IMG/IMG14.jpeg';
    const aquaItem = defaults.find(p => p.id === 'p_acuicultura_mojarra_cachama');
    if (aquaItem) aquaItem.image = 'IMG/IMG8.jpeg';
    const policItem = defaults.find(p => p.id === 'p_policultivos_silvopastoriles');
    if (policItem) policItem.image = 'IMG/IMG18.jpg';
    const petsItem = defaults.find(p => p.id === 'p_guia_perros_gatos');
    if (petsItem) petsItem.image = 'IMG/IMG17.jpg';
    try { localStorage.setItem('blog_posts', JSON.stringify(defaults)); } catch (e) {}
    return defaults;
}

function openArticlePage(postId) {
    const url = 'article.html?id=' + encodeURIComponent(postId);
    window.location.href = url;
}

function openWhatsAppConsultation(plan, price, features = []) {
    const number = '3102069446';
    const lines = [];
    lines.push(`Hola, me interesa el plan: ${plan}`);
    if (price) lines.push(`Precio: COP ${price}`);
    if (features.length) {
        lines.push('Características:');
        features.forEach(f => lines.push(`- ${f}`));
    }
    lines.push('¿Podemos agendar por WhatsApp?');
    const msg = lines.join('\n');
    const url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(msg);
    window.location.href = url;
}

// Gestor de Blog
class BlogManager {
    constructor() {
        this.grid = document.querySelector('#blog .blog-grid');
        this.filters = document.querySelectorAll('#blog .filter-btn');
        this.addBtn = document.querySelector('#blog .blog-add-btn');
        this.posts = this.loadPosts();
        this.activeFilter = 'todos';
    }

    loadPosts() {
        return resolveBlogPosts();
    }

    savePosts() {
        try { localStorage.setItem('blog_posts', JSON.stringify(this.posts)); } catch (e) {}
    }

    init() {
        if (!this.grid) return;
        this.render();
        this.setupFilters();
        this.setupAddButton();
    }

    setupFilters() {
        this.filters.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeFilter = btn.dataset.filter;
                this.render();
            });
        });
    }

    setupAddButton() {
        if (!this.addBtn) return;
        this.addBtn.addEventListener('click', () => this.showAddModal());
    }

    filteredPosts() {
        if (this.activeFilter === 'todos') return this.posts;
        return this.posts.filter(p => p.category === this.activeFilter);
    }

    render() {
        const posts = this.filteredPosts();
        if (!posts.length) {
            this.grid.innerHTML = '<p class="pricing-note">No hay artículos aún. Usa “Añadir Artículo”.</p>';
            return;
        }
        this.grid.innerHTML = posts.map(p => `
            <article class="blog-card" data-id="${p.id}" data-category="${p.category}">
                <div class="blog-image">
                    <img src="${p.image}" alt="${p.title}">
                </div>
                <div class="blog-content">
                    <h3 class="blog-title">${p.title}</h3>
                    <div class="blog-meta">
                        <span class="blog-tag">${p.category}</span>
                        <span><i class="far fa-calendar"></i> ${new Date(p.date).toLocaleDateString()}</span>
                    </div>
                    <p class="blog-excerpt">${p.excerpt}</p>
                    <button class="blog-btn" data-action="read">
                        <i class="far fa-file-alt"></i> Leer artículo
                    </button>
                </div>
            </article>
        `).join('');

        // Enlazar acciones
        this.grid.querySelectorAll('.blog-btn[data-action="read"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.currentTarget.closest('.blog-card');
                const id = card.dataset.id;
                try { window.location.hash = '#blog'; } catch(e) {}
                openArticlePage(id);
            });
        });

        // Fallback de imágenes si falta el archivo
        this.grid.querySelectorAll('.blog-card .blog-image img').forEach(img => {
            let tries = 0;
            const alts = ['IMG/p.webp', 'IMG/ganaeria-3.jpg', 'IMG/fia.jpg', 'IMG/fia.jpeg', 'IMG/fia.png', 'IMG/IMG12 (2).jpeg', 'IMG/IMG7.jpeg'];
            img.addEventListener('error', () => {
                if (tries < alts.length) {
                    img.src = alts[tries++];
                }
            }, { once: false });
        });
    }

    showAddModal() {
        const modal = createModal('Nuevo Artículo', `
            <div class="pricing-form">
                <form id="blogForm">
                    <div class="form-group">
                        <label for="blogTitle">Título</label>
                        <input type="text" id="blogTitle" name="blogTitle" required>
                    </div>
                    <div class="form-group">
                        <label for="blogCategory">Categoría</label>
                        <select id="blogCategory" name="blogCategory" required>
                            <option value="">Seleccionar...</option>
                            <option value="Veterinaria">Veterinaria</option>
                            <option value="Zootecnia">Zootecnia</option>
                            <option value="Agronomía">Agronomía</option>
                            <option value="Más">Más</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="blogImageUrl">Imagen (URL)</label>
                        <input type="url" id="blogImageUrl" name="blogImageUrl" placeholder="https://...">
                    </div>
                    <div class="form-group">
                        <label for="blogImageFile">Imagen (archivo)</label>
                        <input type="file" id="blogImageFile" name="blogImageFile" accept="image/*">
                    </div>
                    <div class="form-group">
                        <label for="blogContent">Contenido</label>
                        <textarea id="blogContent" name="blogContent" rows="6" required></textarea>
                    </div>
                    <button type="submit" class="submit-btn">
                        <i class="fas fa-save"></i>
                        Guardar Artículo
                    </button>
                </form>
            </div>
        `);

        const form = modal.querySelector('#blogForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = form.blogTitle.value.trim();
            const category = form.blogCategory.value;
            const content = form.blogContent.value.trim();

            let image = form.blogImageUrl.value.trim();
            const file = form.blogImageFile.files[0];
            if (!image && file) {
                image = await this.fileToDataUrl(file);
            }
            if (!image) image = 'IMG/IMG1.jpeg';

            const excerpt = content.length > 160 ? content.slice(0, 160) + '…' : content;
            const post = {
                id: 'p' + Date.now(),
                title, category, image, content,
                excerpt,
                date: new Date().toISOString()
            };

            this.posts.unshift(post);
            this.savePosts();
            this.render();
            showNotification('Artículo guardado correctamente', 'success');
            modal.remove();
        });
    }

    async fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // La lectura se hace en article.html
}

document.addEventListener('DOMContentLoaded', function() {
    const blog = new BlogManager();
    blog.init();
});

// Render de la página de artículo si corresponde
document.addEventListener('DOMContentLoaded', function() {
    const articleEl = document.getElementById('article-page');
    if (!articleEl) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const posts = resolveBlogPosts();
    const post = posts.find(p => p.id === id) || posts[0];

    const titleEl = document.getElementById('article-title');
    const catEl = document.getElementById('article-category');
    const dateEl = document.getElementById('article-date');
    const imgEl = document.getElementById('article-image');
    const bodyEl = document.getElementById('article-body');

    if (post) {
        titleEl.textContent = post.title;
        catEl.textContent = post.category;
        dateEl.innerHTML = `<i class="far fa-calendar"></i> ${new Date(post.date).toLocaleDateString()}`;
        imgEl.src = post.image;
        imgEl.alt = post.title;
        bodyEl.innerHTML = post.content.replace(/\n/g, '<br>');
    } else {
        titleEl.textContent = 'Artículo no encontrado';
        bodyEl.innerHTML = '<p>El artículo solicitado no está disponible.</p>';
    }
});

// ===== Chatbot: UI y conexión a OpenAI =====
class ChatbotAssistant {
    constructor() {
        this.root = document.getElementById('chatbot');
        if (!this.root) return;
        this.toggleBtn = this.root.querySelector('.chatbot-toggle');
        this.panel = this.root.querySelector('.chatbot-panel');
        this.closeBtn = this.root.querySelector('.chatbot-close');
        this.settingsBtn = this.root.querySelector('.chatbot-settings');
        this.settingsPanel = this.root.querySelector('.chatbot-settings-panel');
        this.messagesEl = this.root.querySelector('.chatbot-messages');
        this.form = this.root.querySelector('.chatbot-input');
        this.textarea = this.root.querySelector('.chatbot-textarea');
        this.conversation = [];
        try { localStorage.removeItem('chatbot_conversation'); } catch (e) {}
        this.apiKey = '';
        this.useAI = false;
        this.pageKB = this.buildPageKB();
    }

    init() {
        if (!this.root) return;
        this.toggleBtn.addEventListener('click', () => this.open());
        this.closeBtn.addEventListener('click', () => this.close());
        
        const qa = this.root.querySelector('.chatbot-quick-actions');
        if (qa) {
            qa.addEventListener('click', (e) => {
                const btn = e.target.closest('.quick-btn');
                if (!btn) return;
                const act = btn.dataset.action;
                if (act === 'precios') {
                    const kb = this.pageKB;
                    const list = (kb.pricing||[]).map(p => `${p.plan}: ${p.price||'Consultar'}`).join('\n');
                    this.addBotMessage(list ? ('Planes disponibles:\n' + list) : 'Consulta la sección Precios y Servicios.');
                } else if (act === 'contacto') {
                    const kb = this.pageKB;
                    const parts = [];
                    if (kb?.contact?.email) parts.push('Email: ' + kb.contact.email);
                    parts.push('WhatsApp: https://wa.me/3102069446');
                    this.addBotMessage(parts.join('\n'));
                } else if (act === 'whatsapp') {
                    const url = 'https://wa.me/3102069446?text=' + encodeURIComponent('Hola, deseo agendar una consulta.');
                    window.open(url, '_blank');
                } else if (act === 'redes') {
                    const lines = [
                        'Instagram: https://www.instagram.com/veterinariaonline24_7/',
                        'TikTok: https://www.tiktok.com/@veterinariaonline247',
                        'YouTube: https://www.youtube.com/@veterinariaonline247',
                        'LinkedIn: https://www.linkedin.com/in/miguel-angel-s%C3%A1nchez-amaya-31ab4417a/'
                    ];
                    this.addBotMessage(lines.join('\n'));
                } else if (act === 'ayuda') {
                    this.addBotMessage('Puedo ayudarte con Precios, Contacto, WhatsApp y redes sociales. ¿Qué necesitas?');
                }
            });
        }

        this.form.addEventListener('submit', (e) => this.onSubmit(e));

        // Mensaje de bienvenida (sin historial)
        this.messagesEl.innerHTML = '';
        this.addBotMessage('Hola, soy Miguel AI 360. Respondo con información de esta página: precios y planes, contacto, blog, plataformas y Quiénes Somos.');
    }

    open() { this.root.classList.add('open'); this.panel.style.display = 'flex'; this.textarea.focus(); }
    close() { this.root.classList.remove('open'); this.panel.style.display = 'none'; }
    toggleSettings() {
        const hidden = this.settingsPanel.hasAttribute('hidden');
        if (hidden) this.settingsPanel.removeAttribute('hidden'); else this.settingsPanel.setAttribute('hidden','');
    }

    onSubmit(e) {
        e.preventDefault();
        const text = this.textarea.value.trim();
        if (!text) return;
        const userMsg = { role: 'user', content: text };
        this.conversation.push(userMsg);
        this.renderMessage(userMsg);
        this.textarea.value = '';
        this.scrollToBottom();
        // historial desactivado

        // Primero intentar responder con información de la página
        const localReply = this.answerFromPage(text);
        if (localReply) {
            this.addBotMessage(localReply);
            return;
        }
        const fallback = this.answerFallback(text);
        if (fallback) {
            this.addBotMessage(fallback);
        }
    }

    renderMessage(msg) {
        const el = document.createElement('div');
        el.className = 'chat-msg ' + (msg.role === 'user' ? 'user' : 'bot');
        el.innerHTML = this.escapeHtml(msg.content).replace(/\n/g, '<br>');
        this.messagesEl.appendChild(el);
        this.scrollToBottom();
    }

    addBotMessage(text) { this.renderMessage({ role: 'assistant', content: text }); }
    scrollToBottom() { this.messagesEl.scrollTop = this.messagesEl.scrollHeight; }
    saveConversation() { /* historial desactivado */ }
    loadConversation() { return []; }
    escapeHtml(str) { return str.replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s])); }

    collectPageContext() {
        const parts = [];
        const title = document.title || '';
        parts.push('Título: ' + title);
        document.querySelectorAll('.section-title').forEach(el => parts.push('Sección: ' + el.textContent.trim()));
        document.querySelectorAll('#pricing .pricing-card h3').forEach(el => parts.push('Plan: ' + el.textContent.trim()));
        document.querySelectorAll('#blog .blog-title').forEach(el => parts.push('Artículo: ' + el.textContent.trim()));
        const context = parts.join('\n');
        return context.slice(0, 1800);
    }

    buildPageKB() {
        const kb = { services: [], pricing: [], contact: {}, blog: [], platforms: [], meta: {}, about: {}, headerLinks: [] };
        // Meta
        const brand = document.querySelector('.footer-section h3, .footer-section h4');
        kb.meta.tagline = brand ? brand.textContent.trim() : '';

        // Servicios
        document.querySelectorAll('#services .service-card').forEach(card => {
            const title = card.querySelector('h3')?.textContent.trim();
            const desc = card.querySelector('p')?.textContent.trim();
            if (title) kb.services.push({ title, desc });
        });

        // Precios (usar id #precios)
        document.querySelectorAll('#precios .pricing-card').forEach(card => {
            const plan = card.querySelector('h3')?.textContent.trim();
            const priceEl = card.querySelector('.price');
            let price = priceEl ? priceEl.textContent.trim() : '';
            if (!price) {
                // Buscar posibles Cop dentro del texto
                const text = card.textContent.trim();
                const m = text.match(/COP[^\d]*(\d[\d.,]*)/i);
                if (m) price = 'COP ' + m[1];
            }
            if (plan) kb.pricing.push({ plan, price });
        });

        // Header (menú de navegación)
        document.querySelectorAll('.nav-menu .nav-link').forEach(a => {
            const text = a.textContent.trim();
            const href = a.getAttribute('href') || '';
            kb.headerLinks.push({ text, href });
        });

        // Contacto (footer)
        const emailEl = document.querySelector('.footer-section i.fa-envelope')?.parentElement;
        const phoneEl = document.querySelector('.footer-section i.fa-phone')?.parentElement;
        kb.contact.email = emailEl ? emailEl.textContent.replace(/^[^\w]+/,'').trim() : '';
        kb.contact.phone = phoneEl ? phoneEl.textContent.replace(/^[^\d+]+/,'').trim() : '';
        const waEl = document.querySelector('.social-sidebar a.whatsapp');
        kb.contact.whatsapp = waEl ? waEl.getAttribute('href') : '';

        // Blog
        document.querySelectorAll('#blog .blog-card').forEach(card => {
            const title = card.querySelector('.blog-title')?.textContent.trim();
            const cat = card.querySelector('.blog-tag')?.textContent.trim();
            if (title) kb.blog.push({ title, category: cat });
        });

        // Plataformas
        document.querySelectorAll('.platform-card h3').forEach(el => kb.platforms.push(el.textContent.trim()));
        const aboutEl = document.querySelector('#quienes-somos .founder-details');
        if (aboutEl) {
            const name = aboutEl.querySelector('h3')?.textContent.trim() || '';
            const title = aboutEl.querySelector('.founder-title')?.textContent.trim() || '';
            const bioEls = aboutEl.querySelectorAll('.founder-bio');
            const bio = Array.from(bioEls).map(el => el.textContent.trim()).join(' ');
            const mission = document.querySelector('#quienes-somos .mission p')?.textContent.trim() || '';
            const vision = document.querySelector('#quienes-somos .vision p')?.textContent.trim() || '';
            kb.about = { name, title, bio, mission, vision };
        }
        return kb;
    }

    normalize(text) {
        return text.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9áéíóúñ\s]/gi, '');
    }

    answerFromPage(question) {
        const q = this.normalize(question);
        const kb = this.pageKB;

        // Ayuda general
        if (q.includes('ayuda') || q.includes('que puedes hacer') || q.includes('como funcionas')) {
            return 'Puedo responder sobre: precios y planes, servicios, contacto, artículos del blog, y plataformas de consulta. Pregunta, por ejemplo: "precio de Consulta Virtual Express", "servicios", "contacto", "artículos del blog".';
        }

        // Construir respuesta por múltiples palabras clave
        const sections = this.composeSections(q, kb);
        if (sections) return sections;

        // Servicios
        if (q.includes('servicios') || q.includes('que ofrecen') || q.includes('servicio')) {
            if (kb.services.length) {
                const list = kb.services.map(s => `• ${s.title}`).join('\n');
                return 'Ofrecemos los siguientes servicios:\n' + list + '\nSi deseas detalles de alguno, menciónalo.';
            }
        }

        // Contacto
        if (q.includes('contacto') || q.includes('telefono') || q.includes('teléfono') || q.includes('email') || q.includes('correo') || q.includes('whatsapp')) {
            const parts = [];
            if (kb.contact.email) parts.push('Email: ' + kb.contact.email);
            if (kb.contact.phone) parts.push('Teléfono: ' + kb.contact.phone);
            if (kb.contact.whatsapp) parts.push('WhatsApp: ' + kb.contact.whatsapp);
            return parts.length ? ('Datos de contacto:\n' + parts.join('\n')) : 'No encuentro datos de contacto en esta página.';
        }

        // Blog
        if (q.includes('blog') || q.includes('articulo') || q.includes('artículos') || q.includes('articulos')) {
            if (kb.blog.length) {
                const list = kb.blog.slice(0,6).map(b => `• ${b.title} (${b.category || 'General'})`).join('\n');
                return 'Artículos recientes en el blog:\n' + list + '\nPuedes abrirlos desde la sección Blog.';
            }
        }

        // Plataformas
        if (q.includes('plataforma') || q.includes('modalidad') || q.includes('como atienden') || q.includes('videollamada')) {
            if (kb.platforms.length) return 'Atendemos por: ' + kb.platforms.join(', ') + '.';
        }

        // Horarios
        if (q.includes('horario') || q.includes('cuando atienden') || q.includes('24/7')) {
            const tagline = kb.meta.tagline || '';
            if (tagline.toLowerCase().includes('24/7')) return 'Brindamos atención 24/7.';
            return 'Consulta nuestros horarios en la sección de contacto.';
        }

        // Quiénes Somos
        if (q.includes('quienes') || q.includes('nosotros') || q.includes('biografia') || q.includes('biografía')) {
            const a = kb.about || {};
            const lines = [];
            if (a.name) lines.push(a.name);
            if (a.title) lines.push(a.title);
            if (a.bio) lines.push(a.bio);
            if (a.mission) lines.push('Misión: ' + a.mission);
            if (a.vision) lines.push('Visión: ' + a.vision);
            if (lines.length) return lines.join('\n');
        }

        // Búsqueda por coincidencias de plan
        const planGuess = kb.pricing.find(p => q.includes(this.normalize(p.plan)));
        if (planGuess) {
            return `${planGuess.plan}: ${planGuess.price || 'Solicitar cotización'}`;
        }

        return '';
    }

    answerFallback(question) {
        const kb = this.pageKB;
        const q = this.normalize(question);
        const sections = this.composeSections(q, kb);
        if (sections) return sections;
        // Si no hay coincidencias, devolver ayuda
        return 'Puedo ayudarte con precios, servicios, contacto, plataformas y blog. Pregunta por cualquiera de estas secciones.';
    }

    composeSections(q, kb) {
        const wantPrices = q.includes('precio') || q.includes('precios') || q.includes('costo') || q.includes('cop') || q.includes('planes');
        const wantBlog = q.includes('blog') || q.includes('articulo') || q.includes('artículos') || q.includes('articulos');
        const wantPlatforms = q.includes('plataforma') || q.includes('plataformas') || q.includes('videollamada');
        const wantHeader = q.includes('menu') || q.includes('menú') || q.includes('header') || q.includes('navegacion') || q.includes('navegación');
        const wantContact = q.includes('contacto') || q.includes('telefono') || q.includes('teléfono') || q.includes('email') || q.includes('correo') || q.includes('whatsapp');

        const out = [];
        if (wantPrices && kb.pricing.length) {
            const list = kb.pricing.map(p => `${p.plan}: ${p.price || 'Consultar'}`).join('\n');
            out.push('Precios y planes:\n' + list);
        }
        if (wantBlog && kb.blog.length) {
            const list = kb.blog.slice(0,6).map(b => `• ${b.title} (${b.category || 'General'})`).join('\n');
            out.push('Blog reciente:\n' + list);
        }
        if (wantPlatforms && kb.platforms.length) {
            out.push('Plataformas: ' + kb.platforms.join(', '));
        }
        if (wantHeader && kb.headerLinks.length) {
            const list = kb.headerLinks.map(l => `• ${l.text} (${l.href})`).join('\n');
            out.push('Menú de navegación:\n' + list);
        }
        if (wantContact) {
            out.push('Email: veterinariaonline247@gmail.com\nWhatsApp: https://wa.me/3102069446');
        }
        return out.length ? out.join('\n\n') : '';
    }

    async callOpenAI(conversation) {
        const context = this.collectPageContext();
        const messages = [
            { role: 'system', content: 'Eres el asistente profesional Miguel AI 360. Respondes en español de forma clara y útil. Usa el contexto de la página cuando aplique y puedes responder también preguntas generales.' },
            { role: 'system', content: 'Contexto de la página:\n' + context },
            ...conversation
        ];
        const body = {
            model: 'gpt-4o-mini',
            messages,
            temperature: 0.3
        };
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.apiKey
            },
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            const txt = await res.text();
            throw new Error('OpenAI error: ' + res.status + ' ' + txt);
        }
        const data = await res.json();
        return data.choices?.[0]?.message?.content || 'No se obtuvo respuesta.';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const bot = new ChatbotAssistant();
    bot.init();
});
