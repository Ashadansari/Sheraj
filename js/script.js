(() => {
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".scroll-progress");
  const menuButton = document.querySelector(".nav-more");
  const overflowMenu = document.querySelector("#nav-overflow");
  const year = document.querySelector("#year");
  const contactForm = document.querySelector("#contact-form");
  const formNote = document.querySelector("#form-note");
  const navLinks = [...document.querySelectorAll("[data-nav]")];
  const projectFilters = [...document.querySelectorAll("[data-filter]")];
  const projectItems = [...document.querySelectorAll(".project-item[data-category]")];
  const skillTrack = document.querySelector("#skill-track");
  const skillProgress = document.querySelector(".carousel-progress span");

  year.textContent = String(new Date().getFullYear());

  function clearContactForm() {
    contactForm.reset();
    formNote.textContent = "";
  }

  clearContactForm();
  window.addEventListener("pageshow", clearContactForm);

  function updateScrollState() {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${range > 0 ? window.scrollY / range : 0})`;
    header.classList.toggle("site-header--solid", window.scrollY > 35);
  }

  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", updateScrollState);

  document.querySelectorAll("[data-skill-scroll]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.skillScroll === "next" ? 1 : -1;
      skillTrack.scrollBy({ left: direction * Math.max(skillTrack.clientWidth * 0.76, 240), behavior: "smooth" });
    });
  });

  function updateSkillProgress() {
    const maxScroll = skillTrack.scrollWidth - skillTrack.clientWidth;
    const progress = maxScroll > 0 ? skillTrack.scrollLeft / maxScroll : 0;
    const visibleRatio = skillTrack.scrollWidth > 0 ? skillTrack.clientWidth / skillTrack.scrollWidth : 1;
    const thumbRatio = Math.max(visibleRatio, 0.14);
    skillProgress.style.width = `${thumbRatio * 100}%`;
    skillProgress.style.transform = `translateX(${progress * ((1 - thumbRatio) / thumbRatio) * 100}%)`;
  }

  skillTrack.addEventListener("scroll", updateSkillProgress, { passive: true });
  window.addEventListener("resize", updateSkillProgress);
  updateSkillProgress();

  projectFilters.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.filter;
      projectFilters.forEach((filter) => {
        const active = filter === button;
        filter.classList.toggle("is-active", active);
        filter.setAttribute("aria-pressed", String(active));
      });
      projectItems.forEach((item) => {
        item.hidden = selectedCategory !== "all" && item.dataset.category !== selectedCategory;
      });
    });
  });

  function closeMenu({ restoreFocus = false } = {}) {
    if (menuButton.getAttribute("aria-expanded") !== "true") return;
    menuButton.setAttribute("aria-expanded", "false");
    overflowMenu.hidden = true;
    if (restoreFocus) menuButton.focus();
  }

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    overflowMenu.hidden = !open;
    if (open) overflowMenu.querySelector("a[href]").focus();
  });
  navLinks.forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });
  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
    }
  });

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.dataset.nav === entry.target.id;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-32% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));
  } else {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(contactForm);
    const name = String(values.get("name") || "").trim();
    const email = String(values.get("email") || "").trim();
    const message = String(values.get("message") || "").trim();
    const requiredFields = [...contactForm.querySelectorAll("[required]")];
    const emptyField = requiredFields.find((field) => !field.value.trim());
    if (emptyField) {
      formNote.textContent = "Please complete each field before continuing.";
      emptyField.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formNote.textContent = "Please enter a valid email address.";
      contactForm.querySelector("#email").focus();
      return;
    }

    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    formNote.textContent = "Opening your email app. Review the message and send it there.";
    window.location.href = `mailto:Sherajalam028@gmail.com?subject=${subject}&body=${body}`;
  });

  contactForm.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      formNote.textContent = "";
    });
  });
})();
