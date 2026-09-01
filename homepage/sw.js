// [2026-09-01] 이 파일은 **스스로를 없애는 역할만** 한다.
//
// 종전 버전은 '/homepage/index.html' 같은 경로를 캐시하려 했는데 배포본에서는 그 경로가
// 404 라(Vercel 이 homepage/ 를 루트로 서빙한다) cache.addAll 이 거부되고 설치가 실패했다.
// 즉 오프라인 기능은 처음부터 동작한 적이 없다.
//
// 더 나쁜 쪽은 '만약 성공했다면' 이었다 — 캐시 우선(cache-first)에 캐시 이름이 고정이고
// 오래된 캐시를 지우는 activate 처리도 없어서, 한 번 받아 간 방문자에게 **옛 페이지가 영구히
// 고정**됐을 것이다. 안내를 고쳐 올려도 그 사람에게는 안 보인다.
//
// 소개 페이지에 오프라인 캐시는 필요 없다. 그래서 기능을 되살리는 대신 제거하되,
// 과거에 설치된 워커가 남아 있을 가능성에 대비해 **등록 해제 + 캐시 삭제**를 하는
// 묘비(tombstone) 워커를 둔다. 이걸 지우기만 하면 옛 워커가 그대로 살아남는다.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const names = await caches.keys();
        await Promise.all(names.map((n) => caches.delete(n)));
        await self.registration.unregister();
        const clients = await self.clients.matchAll({ type: 'window' });
        clients.forEach((c) => c.navigate(c.url));
    })());
});
