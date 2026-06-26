/* ==========================================
   Hussain Portfolio
   Modern Interactive JavaScript
========================================== */

// ==========================================
// Navbar Background on Scroll
// ==========================================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        navbar.style.background = "rgba(5,8,22,.95)";
        navbar.style.boxShadow = "0 10px 35px rgba(0,0,0,.35)";

    } else {

        navbar.style.background = "rgba(5,8,22,.85)";
        navbar.style.boxShadow = "none";

    }

});

// ==========================================
// Smooth Navigation
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (!target) return;

        target.scrollIntoView({

            behavior: "smooth"

        });

    });

});

// ==========================================
// Fade In Animation
// ==========================================

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {

    threshold: 0.15

});

document.querySelectorAll("section, .card, .skill").forEach(el => {

    el.classList.add("hidden");

    observer.observe(el);

});

// ==========================================
// Typing Animation
// ==========================================

const heroTitle = document.querySelector(".hero h1");

if (heroTitle) {

    const originalText = heroTitle.innerHTML;

    heroTitle.innerHTML = "";

    let i = 0;

    function typeWriter() {

        if (i < originalText.length) {

            heroTitle.innerHTML += originalText.charAt(i);

            i++;

            setTimeout(typeWriter, 18);

        }

    }

    window.addEventListener("load", typeWriter);

}

// ==========================================
// Active Navigation Link
// ==========================================

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar ul li a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const top = section.offsetTop - 150;

        const height = section.clientHeight;

        if (pageYOffset >= top) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});

// ==========================================
// Counter Animation
// ==========================================

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const counter = entry.target;

        const target = Number(counter.dataset.target);

        let current = 0;

        const increment = Math.ceil(target / 80);

        function update() {

            current += increment;

            if (current >= target) {

                counter.innerText = target;

            } else {

                counter.innerText = current;

                requestAnimationFrame(update);

            }

        }

        update();

        counterObserver.unobserve(counter);

    });

});

counters.forEach(counter => {

    counterObserver.observe(counter);

});

// ==========================================
// Back To Top Button
// ==========================================

const topButton = document.createElement("button");

topButton.innerHTML = "↑";

topButton.className = "top-btn";

document.body.appendChild(topButton);

topButton.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        topButton.classList.add("show-top");

    } else {

        topButton.classList.remove("show-top");

    }

});

// ==========================================
// Current Year
// ==========================================

const footer = document.querySelector("footer");

if (footer) {

    footer.innerHTML = footer.innerHTML.replace(
        "2026",
        new Date().getFullYear()
    );

}

// ==========================================
// Console Easter Egg
// ==========================================

console.log("%cWelcome 👋", "font-size:28px;font-weight:bold;color:#00E5FF;");
console.log("%cInterested in AI? Let's build something amazing!", "font-size:14px;color:#ffffff;");