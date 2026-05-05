import type { SkillContent } from '@/types'

const nginx: SkillContent = {
  tagline: "Reverse proxy e web server de alta performance — onipresente como entrada de trafego.",
  why: "Nginx aparece em quase toda arquitetura web: ingress de K8s, reverse proxy, TLS termination, load balancer L7. Senior precisa configurar upstream, cache, rate limit, gzip, headers de segurança.",
  summary: "Nginx e servidor web event-driven (epoll/kqueue), super eficiente. Funções principais: reverse proxy pra app backend, load balancer L7 (round robin, least conn, ip hash), TLS termination, static file serving, cache HTTP, rate limiting. Configuração em arquivos nginx.conf com blocos http -> server -> location. Em K8s, vira ingress controller.",
  keypoints: [
    { title: "Reverse proxy", body: "proxy_pass http://backend repassa request pro upstream. Ajuste proxy_set_header Host $host e X-Forwarded-For pra app saber IP real." },
    { title: "Upstream e load balancing", body: "upstream backend { server a:8080; server b:8080; }. Algoritmos: round robin (default), least_conn, ip_hash (sticky), random. max_fails + fail_timeout pra circuit breaker básico." },
    { title: "TLS termination", body: "Termina HTTPS no nginx, fala HTTP com app interno. ssl_certificate, ssl_protocols TLSv1.2 TLSv1.3, ssl_ciphers com lista forte (Mozilla SSL Config Generator). HSTS via add_header Strict-Transport-Security." },
    { title: "Rate limiting", body: "limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s e limit_req zone=api burst=20. Defesa básica contra abuso/DDoS L7." },
    { title: "Headers de segurança", body: "add_header X-Frame-Options DENY, X-Content-Type-Options nosniff, Content-Security-Policy, Referrer-Policy strict-origin-when-cross-origin. Defesa em camadas no proxy." },
  ],
  gotchas: [
    "Esquecer proxy_set_header Host $host — backend ve Host: backend:8080, quebra rotas baseadas em host.",
    "worker_connections baixo — em alta carga vira too many open files. Default 1024, sobe pra 10240+ e ajusta ulimit -n do SO.",
    "Cache sem chave certa — guarda response com Authorization e serve pra outro user.",
    "Rate limit no IP atras de proxy/CDN — todo trafego vem do mesmo IP. Use X-Forwarded-For via real_ip_module.",
    "Esquecer client_max_body_size — upload grande (>1MB default) volta 413.",
  ],
  interview: [
    { q: "Como diagnostica 502 Bad Gateway no nginx?", a: "<p>502 = nginx falou com upstream e o upstream falhou. Roteiro:</p><ul><li>tail -f /var/log/nginx/error.log — mensagem exata (connection refused, timed out, reset by peer)</li><li>Upstream está de pé? curl http://backend:8080 direto do host do nginx</li><li>Rede: firewall/security group bloqueando?</li><li>proxy_read_timeout baixo? App lenta vai dar 504; instavel da 502</li><li>Em K8s: kubectl get endpoints svc — service tem pod ready?</li></ul><p>502 = upstream falhou, 504 = upstream demorou, 499 = cliente desistiu antes do upstream responder.</p>" },
  ],
  resources: [
    { title: "Nginx Documentation", url: "https://nginx.org/en/docs/", kind: "docs" },
    { title: "Mozilla SSL Config Generator", url: "https://ssl-config.mozilla.org/", kind: "pratica" },
  ],
}

export default nginx
