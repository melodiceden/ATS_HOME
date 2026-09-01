document.addEventListener('DOMContentLoaded', () => {
    // 스크롤 시 상단 바 배경 전환
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // 화면에 들어올 때 등장
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach((el) => revealObserver.observe(el));

    // 앵커 부드럽게 이동
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            e.preventDefault();
            window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
        });
    });

    // [2026-09-01] 종전의 PWA 설치 코드를 제거했다.
    //   beforeinstallprompt 를 preventDefault 로 가로채 놓고 그 뒤 아무것도 하지 않아,
    //   브라우저의 기본 설치 안내까지 막으면서 대체 UI 는 없는 상태였다.
    // 아래 등록은 **남은 워커를 지우기 위한 것**이다. sw.js 는 이제 자기 자신을
    //   등록 해제하는 묘비 워커다 — 이 등록을 지우면 옛 워커가 그대로 살아남는다.
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').catch(() => { });
        });
    }
});
