const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const form = document.querySelector("[data-form]");
const formMessage = document.querySelector("[data-form-message]");
const modelSelect = document.querySelector("[data-investment-model]");
const ndaCheckbox = document.querySelector("[data-nda-checkbox]");

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeMenu() {
  header?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Menüyü aç");
}

function scrollToTarget(selector) {
  const target = document.querySelector(selector);
  if (!target) return;
  closeMenu();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuToggle?.addEventListener("click", () => {
  const open = !header.classList.contains("is-open");
  header.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
});

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    scrollToTarget(button.getAttribute("data-scroll"));
  });
});

document.querySelectorAll("[data-model]").forEach((button) => {
  button.addEventListener("click", () => {
    if (modelSelect) {
      modelSelect.value = button.getAttribute("data-model");
    }
    scrollToTarget("#iletisim");
  });
});

document.querySelector("[data-nda]")?.addEventListener("click", () => {
  if (ndaCheckbox) {
    ndaCheckbox.checked = true;
  }
  scrollToTarget("#iletisim");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.getAttribute("data-counter"));
      const suffix = element.getAttribute("data-suffix") || "";
      const startTime = performance.now();
      const duration = 900;

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(element);
    });
  },
  { threshold: 0.35 }
);

document.querySelectorAll("[data-counter]").forEach((element) => counterObserver.observe(element));

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    formMessage.hidden = false;
    formMessage.classList.add("is-error");
    formMessage.textContent = "Lütfen zorunlu alanları kontrol edin ve geçerli bir e-posta adresi girin.";
    form.reportValidity();
    return;
  }

  formMessage.hidden = false;
  formMessage.classList.remove("is-error");
  formMessage.textContent =
    "Talebiniz yerel statik sürümde kaydedilmedi. Canlı başvuru almak için bu formu bir e-posta servisi veya CRM entegrasyonuna bağlayın.";
});
