const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.classList.toggle('active', open);
  menuButton.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuButton.classList.remove('active');
  menuButton.setAttribute('aria-expanded', 'false');
}));

// Scroll reveal
const revealTargets = document.querySelectorAll('.feature-card,.tariff-card,.console-block,.equipment-panel,.gallery-item,.booking-box,.contact-card');
revealTargets.forEach(el => el.classList.add('reveal'));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
revealTargets.forEach(el => observer.observe(el));

// Responsive photo carousel
const track = document.querySelector('.gallery-track');
const slides = [...document.querySelectorAll('.gallery-item')];
const count = document.querySelector('.gallery-count');
const prevBtn = document.querySelector('.gallery-prev');
const nextBtn = document.querySelector('.gallery-next');

let current = 0;

// Функция определяет, сколько фото показывать (1 на телефоне, 2 на компе)
function visibleSlides() { 
    return window.innerWidth <= 680 ? 1 : 2; 
}

function updateGallery() {
    // Если фотографий нет, ничего не делаем
    if (slides.length === 0) return; 

    const max = slides.length - visibleSlides();
    // Ограничиваем текущий индекс, чтобы не уехать за пределы
    current = Math.min(Math.max(current, 0), max);

    const gap = 18; // Отступ между фото
    const slideWidth = slides[0].getBoundingClientRect().width + gap;
    
    // Двигаем ленту
    track.style.transform = `translateX(-${current * slideWidth}px)`;
    
    // Обновляем счетчик (например, 01 / 05)
    if (count) {
        // Считаем, какое фото сейчас первое в видимой области
        const displayNum = current + 1;
        const totalToDisplay = slides.length;
        count.textContent = `${String(displayNum).padStart(2, '0')} / ${String(totalToDisplay).padStart(2, '0')}`;
    }
}

// Кнопка ВПЕРЕД
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        const max = slides.length - visibleSlides();
        if (current < max) {
            current++;
        } else {
            current = 0; // Возврат в начало, если дошли до конца
        }
        updateGallery();
    });
}

// Кнопка НАЗАД
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (current > 0) {
            current--;
        } else {
            current = slides.length - visibleSlides(); // Прыжок в конец
        }
        updateGallery();
    });
}

// Обновляем при изменении размера окна
window.addEventListener('resize', updateGallery);
updateGallery();

// Отправка формы в Telegram-бота
document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    const message = document.querySelector('.form-message');
    message.textContent = "Отправка...";
    message.style.color = "white";

    const webhookUrl = "https://megabyteadmin-bot.onrender.com/webhook";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal
    })
    .then(() => {
        message.textContent = "Заявка отправлена! Мы скоро свяжемся.";
        message.style.color = "#a3ff00";
        event.target.reset(); 
    })
    .catch(() => {
        message.textContent = "Ошибка соединения.";
        message.style.color = "red";
    });
});

// Установка минимальной даты
const dateInput = document.querySelector('input[name="date"]');
if (dateInput) {
    const today = new Date();
    dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0,10);
}