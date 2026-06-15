/**
 * Adje Solutions - Main JavaScript
 * Professional coaching website functionality
 * Vanilla JS - No frameworks required
 */

document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  // 1. MOBILE NAVIGATION TOGGLE
  // =========================================================================

  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const header = document.querySelector("header");

  /** Close the mobile navigation */
  const closeMobileNav = () => {
    if (navToggle) navToggle.classList.remove("is-active");
    if (mobileNav) mobileNav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  };

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.classList.toggle("is-active");
      mobileNav.classList.toggle("is-open");
      document.body.classList.toggle("nav-open");

      // Toggle hamburger icon animation (three bars to X)
      navToggle.setAttribute("aria-expanded", isOpen);
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileNav();
      });
    });

    // Close mobile nav on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
        closeMobileNav();
      }
    });
  }

  // =========================================================================
  // 2. STICKY HEADER
  // =========================================================================

  if (header) {
    const SCROLL_THRESHOLD = 50;

    const handleHeaderScroll = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };

    // Check on load in case the page is already scrolled (e.g. after refresh)
    handleHeaderScroll();
    window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  }

  // =========================================================================
  // 3. LEAD MAGNET POPUP MODAL
  // =========================================================================

  const leadModal = document.querySelector(".modal-overlay.lead-modal") ||
                     document.querySelector(".lead-modal");

  if (leadModal) {
    const modalClose = leadModal.querySelector(".modal-close") ||
                       leadModal.querySelector(".lead-modal__close");
    const modalForm = leadModal.querySelector("form");
    const MODAL_DELAY_MS = 8000;
    const SCROLL_TRIGGER_PERCENT = 0.6;
    const STORAGE_KEY = "adjesolutions_lead_modal_shown";

    let modalShown = false;

    /** Show the lead magnet modal */
    const showModal = () => {
      if (modalShown || sessionStorage.getItem(STORAGE_KEY)) return;
      modalShown = true;
      sessionStorage.setItem(STORAGE_KEY, "true");

      leadModal.classList.add("is-visible");
      leadModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      // Focus the first input for accessibility
      const firstInput = leadModal.querySelector("input");
      if (firstInput) firstInput.focus();
    };

    /** Hide the lead magnet modal */
    const hideModal = () => {
      leadModal.classList.remove("is-visible");
      leadModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    // Trigger after 8 seconds
    const modalTimer = setTimeout(showModal, MODAL_DELAY_MS);

    // Trigger when user scrolls 60% of the page
    const handleScrollTrigger = () => {
      const scrollPercent =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPercent >= SCROLL_TRIGGER_PERCENT) {
        showModal();
        clearTimeout(modalTimer);
        window.removeEventListener("scroll", handleScrollTrigger);
      }
    };
    window.addEventListener("scroll", handleScrollTrigger, { passive: true });

    // Close button
    if (modalClose) {
      modalClose.addEventListener("click", hideModal);
    }

    // Click outside to close
    leadModal.addEventListener("click", (e) => {
      if (e.target === leadModal) hideModal();
    });

    // Escape key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && leadModal.classList.contains("is-visible")) {
        hideModal();
      }
    });

    // Manual trigger buttons (hero CTA and newsletter bar)
    const forceShowModal = () => {
      // Bypass the sessionStorage check so the user can always open manually
      leadModal.classList.add("is-visible");
      leadModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      const firstInput = leadModal.querySelector("input");
      if (firstInput) firstInput.focus();
    };

    const openLeadModalBtn = document.getElementById("openLeadModal");
    if (openLeadModalBtn) {
      openLeadModalBtn.addEventListener("click", (e) => {
        e.preventDefault();
        forceShowModal();
      });
    }

    const openLeadModalBarBtn = document.getElementById("openLeadModalBar");
    if (openLeadModalBarBtn) {
      openLeadModalBarBtn.addEventListener("click", (e) => {
        e.preventDefault();
        forceShowModal();
      });
    }

    // Modal form submission
    if (modalForm) {
      modalForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailInput = modalForm.querySelector('input[type="email"]');
        if (!emailInput || !isValidEmail(emailInput.value)) {
          showFieldError(emailInput, "Please enter a valid email address.");
          return;
        }

        // In production: send to ConvertKit/Kit API
        // Example: fetch('https://api.convertkit.com/v3/forms/FORM_ID/subscribe', { ... })

        modalForm.innerHTML = `
          <div class="modal-success">
            <h3>Thank you!</h3>
            <p>Check your inbox for your free resource. We're excited to help you on your leadership journey.</p>
          </div>
        `;

        // Auto-close the modal after a few seconds
        setTimeout(hideModal, 4000);
      });
    }
  }

  // =========================================================================
  // 4. NEWSLETTER FORM HANDLING
  // =========================================================================

  const newsletterForms = document.querySelectorAll(".newsletter-form");

  newsletterForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput || !isValidEmail(emailInput.value)) {
        showFieldError(emailInput, "Please enter a valid email address.");
        return;
      }

      // In production: connect to ConvertKit/Kit
      // fetch('https://api.convertkit.com/v3/forms/FORM_ID/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     api_key: 'YOUR_API_KEY',
      //     email: emailInput.value
      //   })
      // });

      // Show success message in place of the form
      const successMessage = document.createElement("div");
      successMessage.className = "newsletter-success";
      successMessage.innerHTML = `
        <p>You're in! Check your email to confirm your subscription.</p>
      `;
      form.parentNode.replaceChild(successMessage, form);
    });
  });

  // =========================================================================
  // 5. CONTACT FORM HANDLING
  // =========================================================================

  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearAllErrors(contactForm);

      // Gather field values
      const name = contactForm.querySelector('[name="name"]');
      const email = contactForm.querySelector('[name="email"]');
      const subject = contactForm.querySelector('[name="subject"]');
      const message = contactForm.querySelector('[name="message"]');

      let isValid = true;

      if (name && !name.value.trim()) {
        showFieldError(name, "Please enter your name.");
        isValid = false;
      }

      if (email && !isValidEmail(email.value)) {
        showFieldError(email, "Please enter a valid email address.");
        isValid = false;
      }

      if (subject && !subject.value.trim()) {
        showFieldError(subject, "Please select or enter a subject.");
        isValid = false;
      }

      if (message && !message.value.trim()) {
        showFieldError(message, "Please enter your message.");
        isValid = false;
      }

      if (!isValid) return;

      // In production: POST to Hostinger email endpoint or server-side handler
      // fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: name.value,
      //     email: email.value,
      //     subject: subject.value,
      //     message: message.value
      //   })
      // });

      // Show success state
      contactForm.innerHTML = `
        <div class="contact-success">
          <h3>Message Sent!</h3>
          <p>Thank you for reaching out. Adje will get back to you within 1-2 business days.</p>
        </div>
      `;
    });
  }

  // =========================================================================
  // 6. TESTIMONIAL CAROUSEL / SLIDER
  // =========================================================================

  const slider = document.querySelector(".testimonials__carousel") ||
                  document.querySelector(".testimonials__slider") ||
                  document.querySelector(".testimonial-slider");

  if (slider) {
    const slides = slider.querySelectorAll(".testimonials__slide") .length > 0
      ? slider.querySelectorAll(".testimonials__slide")
      : slider.querySelectorAll(".testimonial-slide");
    const dotsContainer = slider.querySelector(".testimonials__dots") ||
                          slider.querySelector(".testimonial-dots");
    const prevBtn = slider.querySelector(".testimonials__btn--prev") ||
                    slider.querySelector(".prev-btn");
    const nextBtn = slider.querySelector(".testimonials__btn--next") ||
                    slider.querySelector(".next-btn");

    let currentSlide = 0;
    let autoplayInterval = null;
    const AUTOPLAY_DELAY_MS = 6000;

    /** Navigate to a specific slide */
    const goToSlide = (index) => {
      // Wrap around
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === index);
        slide.setAttribute("aria-hidden", i !== index);
      });

      // Update dots
      if (dotsContainer) {
        dotsContainer.querySelectorAll(".testimonials__dot, .dot").forEach((dot, i) => {
          dot.classList.toggle("is-active", i === index);
          dot.setAttribute("aria-current", i === index);
        });
      }

      currentSlide = index;
    };

    // Build dot indicators
    if (dotsContainer && slides.length > 1) {
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = `testimonials__dot${i === 0 ? " is-active" : ""}`;
        dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
        dot.addEventListener("click", () => {
          goToSlide(i);
          resetAutoplay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    // Previous / Next buttons
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        goToSlide(currentSlide - 1);
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        goToSlide(currentSlide + 1);
        resetAutoplay();
      });
    }

    // Keyboard navigation within the slider
    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        goToSlide(currentSlide - 1);
        resetAutoplay();
      } else if (e.key === "ArrowRight") {
        goToSlide(currentSlide + 1);
        resetAutoplay();
      }
    });

    /** Start auto-rotation */
    const startAutoplay = () => {
      autoplayInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, AUTOPLAY_DELAY_MS);
    };

    /** Reset autoplay timer (e.g. after manual navigation) */
    const resetAutoplay = () => {
      clearInterval(autoplayInterval);
      startAutoplay();
    };

    // Pause autoplay on hover or focus for accessibility
    slider.addEventListener("mouseenter", () =>
      clearInterval(autoplayInterval)
    );
    slider.addEventListener("mouseleave", startAutoplay);
    slider.addEventListener("focusin", () => clearInterval(autoplayInterval));
    slider.addEventListener("focusout", startAutoplay);

    // Initialize
    goToSlide(0);
    startAutoplay();
  }

  // =========================================================================
  // 7. SCROLL ANIMATIONS (Intersection Observer)
  // =========================================================================

  const fadeElements = document.querySelectorAll(".fade-in, .fade-in-left, .fade-in-right, .fade-in-up");

  if (fadeElements.length > 0 && "IntersectionObserver" in window) {
    const observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animations by adding a small delay based on entry order
          const delay = index * 100; // 100ms stagger
          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, delay);

          // Stop observing once the element is visible
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach((el) => fadeObserver.observe(el));
  }

  // =========================================================================
  // 8. SMOOTH SCROLL FOR ANCHOR LINKS
  // =========================================================================

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#" || targetId === "") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // Account for sticky header height
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      // Update URL without triggering scroll
      history.pushState(null, "", targetId);

      // Set focus on target for accessibility
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  // =========================================================================
  // 9. BLOG CATEGORY TABS
  // =========================================================================

  const blogTabs = document.querySelectorAll(".blog-tab");
  const blogPosts = document.querySelectorAll(".blog-post");

  if (blogTabs.length > 0 && blogPosts.length > 0) {
    blogTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const category = tab.dataset.category;

        // Update active tab styling
        blogTabs.forEach((t) => {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");

        // Filter blog posts
        blogPosts.forEach((post) => {
          if (category === "all" || post.dataset.category === category) {
            post.style.display = "";
            post.classList.add("fade-in", "is-visible");
          } else {
            post.style.display = "none";
            post.classList.remove("is-visible");
          }
        });
      });
    });
  }

  // =========================================================================
  // 10. ACTIVE NAVIGATION HIGHLIGHTING
  // =========================================================================

  const currentPath = window.location.pathname;

  document.querySelectorAll(".nav__list a, .mobile-nav a").forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname;

    // Exact match or match for index pages
    const isActive =
      linkPath === currentPath ||
      (currentPath.endsWith("/") &&
        linkPath === currentPath + "index.html") ||
      (linkPath.endsWith("/") &&
        currentPath === linkPath + "index.html");

    if (isActive) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  // =========================================================================
  // 11. LEAD MAGNET DOWNLOAD GATE
  // =========================================================================

  const downloadGates = document.querySelectorAll(".download-gate");

  downloadGates.forEach((gate) => {
    const gateForm = gate.querySelector("form");
    const downloadArea = gate.querySelector(".download-area");
    const GATE_STORAGE_PREFIX = "adjesolutions_download_";

    // Determine a unique key for this resource
    const resourceId =
      gate.dataset.resource || gate.id || "default";
    const storageKey = GATE_STORAGE_PREFIX + resourceId;

    // If the user has already submitted their email, reveal the download
    if (localStorage.getItem(storageKey)) {
      revealDownload(gate, gateForm, downloadArea);
    }

    if (gateForm) {
      gateForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const emailInput = gateForm.querySelector('input[type="email"]');
        if (!emailInput || !isValidEmail(emailInput.value)) {
          showFieldError(emailInput, "Please enter a valid email address.");
          return;
        }

        // In production: add subscriber to ConvertKit/Kit and trigger
        // the resource delivery email
        // fetch('https://api.convertkit.com/v3/forms/FORM_ID/subscribe', { ... })

        localStorage.setItem(storageKey, "true");
        revealDownload(gate, gateForm, downloadArea);
      });
    }
  });

  /**
   * Reveal the download button and hide the email gate form.
   * @param {Element} gate - The .download-gate container
   * @param {Element} form - The gate's email form
   * @param {Element} downloadArea - The hidden download area to reveal
   */
  function revealDownload(gate, form, downloadArea) {
    if (form) form.style.display = "none";

    if (downloadArea) {
      downloadArea.style.display = "block";
      downloadArea.classList.add("is-visible");
    } else {
      // Fallback: inject a download area if one was not pre-built in HTML
      const fallback = document.createElement("div");
      fallback.className = "download-area is-visible";
      fallback.innerHTML = `
        <p>Thank you! Your download is ready.</p>
        <a href="${gate.dataset.file || "#"}" class="btn btn-primary download-btn" download>
          Download Free Resource (PDF)
        </a>
      `;
      gate.appendChild(fallback);
    }
  }

  // =========================================================================
  // 12. NEWSLETTER BAR CLOSE
  // =========================================================================

  const newsletterBarClose = document.querySelector(".newsletter-bar__close");
  const newsletterBar = document.querySelector(".newsletter-bar");

  if (newsletterBarClose && newsletterBar) {
    newsletterBarClose.addEventListener("click", () => {
      newsletterBar.classList.add("is-hidden");
    });
  }

  // =========================================================================
  // UTILITY FUNCTIONS
  // =========================================================================

  /**
   * Validate an email address format.
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmail(email) {
    if (!email || typeof email !== "string") return false;
    // Standard email regex - covers the vast majority of valid addresses
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  /**
   * Show an inline error message beneath a form field.
   * @param {Element} field - The input/select/textarea element
   * @param {string} message - Error message to display
   */
  function showFieldError(field, message) {
    if (!field) return;

    // Remove any existing error on this field first
    clearFieldError(field);

    field.classList.add("field-error");
    field.setAttribute("aria-invalid", "true");

    const errorEl = document.createElement("span");
    errorEl.className = "error-message";
    errorEl.setAttribute("role", "alert");
    errorEl.textContent = message;

    field.parentNode.insertBefore(errorEl, field.nextSibling);

    // Clear error on next input
    field.addEventListener(
      "input",
      () => clearFieldError(field),
      { once: true }
    );
  }

  /**
   * Clear the error state from a single form field.
   * @param {Element} field
   */
  function clearFieldError(field) {
    if (!field) return;
    field.classList.remove("field-error");
    field.removeAttribute("aria-invalid");

    const existing = field.parentNode.querySelector(".error-message");
    if (existing) existing.remove();
  }

  /**
   * Clear all error messages within a form.
   * @param {Element} form
   */
  function clearAllErrors(form) {
    form.querySelectorAll(".field-error").forEach((field) => {
      field.classList.remove("field-error");
      field.removeAttribute("aria-invalid");
    });
    form.querySelectorAll(".error-message").forEach((el) => el.remove());
  }
});
