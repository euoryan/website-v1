const items = document.querySelectorAll('.item');
const progressContainer = document.querySelector('.progress');
let currentIndex = 0;
let touchstartX = 0;
let touchendX = 0;
let isSwiping = false;
let startTime = 0;
let endTime = 0;

// Criar pontos de progresso
items.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('progress-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    progressContainer.appendChild(dot);
});

const progressDots = document.querySelectorAll('.progress-dot');

function updateActiveStates() {
    items.forEach((item, index) => {
        item.classList.remove('active');
        if (index === currentIndex) {
            item.classList.add('active');
        }
    });

    progressDots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentIndex) {
            dot.classList.add('active');
        }
    });
}

function goToSlide(index) {
    if (isSwiping) return;
    currentIndex = index;
    updateActiveStates();
}

function nextSlide() {
    if (isSwiping) return;
    currentIndex = (currentIndex + 1) % items.length;
    updateActiveStates();
}

function prevSlide() {
    if (isSwiping) return;
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateActiveStates();
}

// Event listeners
document.querySelector('.next').addEventListener('click', nextSlide);
document.querySelector('.prev').addEventListener('click', prevSlide);

// Melhor suporte para gestos de touch com prevenção de scroll acidental
document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
    startTime = new Date().getTime();
    isSwiping = true;
}, { passive: true });

document.addEventListener('touchmove', e => {
    if (!isSwiping) return;
    const currentX = e.changedTouches[0].screenX;
    const diffX = Math.abs(currentX - touchstartX);
    
    // Previne scroll apenas se o movimento horizontal for significativo
    if (diffX > 10) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchend', e => {
    if (!isSwiping) return;
    touchendX = e.changedTouches[0].screenX;
    endTime = new Date().getTime();
    handleSwipe();
    isSwiping = false;
});

function handleSwipe() {
    const swipeDistance = touchendX - touchstartX;
    const swipeTime = endTime - startTime;
    const velocity = Math.abs(swipeDistance) / swipeTime;
    
    // Ajusta o threshold baseado na velocidade do swipe
    const swipeThreshold = velocity > 0.5 ? 30 : 50;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            prevSlide();
        } else {
            nextSlide();
        }
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
});

// Adicionar indicador de swipe para mobile
if ('ontouchstart' in window) {
    const container = document.querySelector('.container');
    container.classList.add('touch-device');
}

// Previne zoom em dispositivos móveis
document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
});