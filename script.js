/* ============================================================
   Saddam Hussain — 3D Portfolio interactions
   Three.js particle depth-field + wireframe geometry,
   3D tilt cards, magnetic buttons, custom cursor
   ============================================================ */

import * as THREE from 'three';

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

/* ============ 3D BACKGROUND ============ */
(() => {
    if (prefersReduced) return;
    const canvas = document.getElementById('bg3d');
    if (!canvas) return;

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (e) {
        canvas.remove();
        return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x10141f, 0.05);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 11);

    /* ---- Particle depth field ---- */
    const COUNT = isTouch ? 900 : 2200;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const cLime = new THREE.Color(0xcdf655);
    const cCyan = new THREE.Color(0x43e8d2);
    const cViolet = new THREE.Color(0x948bff);
    const cDim = new THREE.Color(0x4a5468);

    for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 46;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 34;

        const r = Math.random();
        const col = r < 0.72 ? cDim : r < 0.84 ? cLime : r < 0.94 ? cCyan : cViolet;
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
        size: 0.055,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    /* ---- Wireframe hero geometry ---- */
    const knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(2.1, 0.62, 140, 18, 2, 3),
        new THREE.MeshBasicMaterial({
            color: 0x43e8d2,
            wireframe: true,
            transparent: true,
            opacity: 0.09,
        })
    );
    knot.position.set(5.4, 0.6, -3);
    scene.add(knot);

    const ico = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.35, 1),
        new THREE.MeshBasicMaterial({
            color: 0xcdf655,
            wireframe: true,
            transparent: true,
            opacity: 0.11,
        })
    );
    ico.position.set(-6.2, -2.4, -4);
    scene.add(ico);

    /* ---- Interaction state ---- */
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let scrollRatio = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    window.addEventListener('scroll', () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        scrollRatio = h > 0 ? window.scrollY / h : 0;
    }, { passive: true });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* ---- Render loop (paused when tab hidden) ---- */
    const clock = new THREE.Clock();
    let running = true;
    document.addEventListener('visibilitychange', () => {
        running = !document.hidden;
        if (running) animate();
    });

    function animate() {
        if (!running) return;
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // smooth mouse parallax
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;

        points.rotation.y = t * 0.024 + targetX * 0.18;
        points.rotation.x = targetY * 0.12 + scrollRatio * 0.55;
        points.position.y = scrollRatio * 4.5;

        knot.rotation.x = t * 0.14;
        knot.rotation.y = t * 0.2;
        knot.position.y = 0.6 + Math.sin(t * 0.5) * 0.35 - scrollRatio * 7;

        ico.rotation.x = -t * 0.18;
        ico.rotation.z = t * 0.12;
        ico.position.y = -2.4 + Math.cos(t * 0.6) * 0.3 + scrollRatio * 5;

        camera.position.x += (targetX * 0.7 - camera.position.x) * 0.03;
        camera.position.y += (-targetY * 0.5 - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }
    animate();
})();

/* ============ DOM INTERACTIONS ============ */
document.addEventListener('DOMContentLoaded', () => {

    /* ---- Year ---- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---- Navbar + scroll progress ---- */
    const navbar = document.getElementById('navbar');
    const progress = document.getElementById('scrollProgress');

    const onScroll = () => {
        const y = window.scrollY;
        navbar?.classList.toggle('scrolled', y > 24);
        if (progress) {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.width = h > 0 ? `${(y / h) * 100}%` : '0%';
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---- Mobile menu ---- */
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');

    const closeMenu = () => {
        toggle?.classList.remove('open');
        menu?.classList.remove('open');
        toggle?.setAttribute('aria-expanded', 'false');
    };

    toggle?.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
    });

    menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    /* ---- Custom cursor ---- */
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');

    if (!isTouch && !prefersReduced && dot && ring) {
        let rx = -100, ry = -100;
        let dx = -100, dy = -100;

        window.addEventListener('mousemove', (e) => {
            dx = e.clientX;
            dy = e.clientY;
            dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
        }, { passive: true });

        (function followRing() {
            rx += (dx - rx) * 0.16;
            ry += (dy - ry) * 0.16;
            ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
            requestAnimationFrame(followRing);
        })();

        document.querySelectorAll('[data-hover], a, button').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
        });
    } else {
        dot?.remove();
        ring?.remove();
    }

    /* ---- Scroll reveal ---- */
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !prefersReduced) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = `${Math.min(i * 70, 240)}ms`;
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(el => io.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('visible'));
    }

    /* ---- Animated counters ---- */
    const counters = document.querySelectorAll('.stat-num');
    const animateCount = (el) => {
        const target = parseInt(el.dataset.target, 10) || 0;
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();

        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window && counters.length && !prefersReduced) {
        const co = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    co.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(el => co.observe(el));
    } else {
        counters.forEach(el => el.textContent = (el.dataset.target || '') + (el.dataset.suffix || ''));
    }

    /* ---- 3D tilt cards ---- */
    if (!isTouch && !prefersReduced) {
        document.querySelectorAll('.tilt').forEach(card => {
            const strength = card.classList.contains('card-feature') ? 4 : 7;

            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                const rotY = (px - 0.5) * strength;
                const rotX = (0.5 - py) * strength;
                card.style.transform =
                    `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;

                // move the glow to cursor
                const glow = card.querySelector('.card-glow');
                if (glow) {
                    glow.style.setProperty('--gx', `${e.clientX - r.left}px`);
                    glow.style.setProperty('--gy', `${e.clientY - r.top}px`);
                    glow.style.left = `${e.clientX - r.left}px`;
                    glow.style.top = `${e.clientY - r.top}px`;
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
            });
        });

        /* ---- Hero photo tilt ---- */
        const stage = document.getElementById('photoStage');
        const photoCard = document.getElementById('photoCard');
        if (stage && photoCard) {
            stage.addEventListener('mousemove', (e) => {
                const r = stage.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                photoCard.style.transform =
                    `rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 12}deg)`;
            });
            stage.addEventListener('mouseleave', () => {
                photoCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
            });
        }

        /* ---- Magnetic buttons ---- */
        document.querySelectorAll('.magnet').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                btn.style.transform = `translate(${x * 0.18}px, ${y * 0.24}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }
});
