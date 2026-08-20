(function () {
  const site = window.SITE;
  if (!site) return;

  const waUrl =
    "https://wa.me/" +
    site.whatsappNumber +
    "?text=" +
    encodeURIComponent("Hello " + site.companyName + ", I would like to discuss an advisory project.");

  function text(el, value) {
    if (el && value != null) el.textContent = value;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  document.querySelectorAll("[data-bind]").forEach(function (el) {
    const key = el.getAttribute("data-bind");
    if (site[key] != null) text(el, site[key]);
  });

  const logoMark = document.querySelector(".logo-mark");
  if (logoMark) logoMark.textContent = (site.shortName || site.companyName).charAt(0).toUpperCase();

  document.querySelectorAll("[data-bind-href]").forEach(function (el) {
    const type = el.getAttribute("data-bind-href");
    if (type === "tel") el.href = "tel:" + site.phoneHref;
    if (type === "mailto") el.href = "mailto:" + site.email;
    if (type === "whatsapp") el.href = waUrl;
    if (type === "linkedin") el.href = site.linkedinUrl;
  });

  const title = site.companyName + " — " + site.tagline;
  document.title = title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", site.description);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogTitle) ogTitle.setAttribute("content", site.companyName);
  if (ogDesc) ogDesc.setAttribute("content", site.tagline + " " + site.description);

  const aboutBody = document.getElementById("about-body");
  if (aboutBody) {
    aboutBody.innerHTML = site.aboutBody.map(function (p) {
      return "<p>" + escapeHtml(p) + "</p>";
    }).join("");
  }

  const stats = document.getElementById("stats");
  if (stats) {
    stats.innerHTML = site.stats
      .map(function (item) {
        return (
          '<div class="stat"><strong>' +
          escapeHtml(item.value) +
          "</strong><span>" +
          escapeHtml(item.label) +
          "</span></div>"
        );
      })
      .join("");
  }

  const services = document.getElementById("services-grid");
  if (services) {
    services.innerHTML = site.services
      .map(function (item) {
        return (
          '<article class="card reveal"><h3>' +
          escapeHtml(item.title) +
          "</h3><p>" +
          escapeHtml(item.text) +
          "</p></article>"
        );
      })
      .join("");
  }

  const reasons = document.getElementById("reasons-grid");
  if (reasons) {
    reasons.innerHTML = site.reasons
      .map(function (item) {
        return (
          '<article class="reason reveal"><h3>' +
          escapeHtml(item.title) +
          "</h3><p>" +
          escapeHtml(item.text) +
          "</p></article>"
        );
      })
      .join("");
  }

  const process = document.getElementById("process-list");
  if (process) {
    process.innerHTML = site.process
      .map(function (item) {
        return (
          '<li class="process-item reveal"><span class="step">' +
          escapeHtml(item.step) +
          "</span><h3>" +
          escapeHtml(item.title) +
          "</h3><p>" +
          escapeHtml(item.text) +
          "</p></li>"
        );
      })
      .join("");
  }

  const address = document.getElementById("address");
  if (address) {
    address.innerHTML = site.addressLines.map(escapeHtml).join("<br />");
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const select = document.getElementById("service-select");
  if (select) {
    site.services.forEach(function (item) {
      const option = document.createElement("option");
      option.value = item.title;
      option.textContent = item.title;
      select.appendChild(option);
    });
  }

  const map = document.getElementById("map");
  if (map) {
    if (site.mapsEmbedUrl) {
      map.innerHTML =
        '<iframe title="Office location map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="' +
        escapeHtml(site.mapsEmbedUrl) +
        '"></iframe>';
    } else {
      map.innerHTML =
        "<p><strong>Google Maps placeholder</strong><br />Add your embed URL in <code>js/config.js</code> as <code>mapsEmbedUrl</code>.<br />" +
        escapeHtml(site.addressLines.join(", ")) +
        "</p>";
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.companyName,
    description: site.description,
    telephone: site.phoneDisplay,
    email: site.email,
    url: window.location.origin + window.location.pathname,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.addressLines[0],
      addressLocality: site.addressLines[1] || "",
      addressCountry: "IN",
    },
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const phone = (data.get("phone") || "").toString().trim();
      const service = (data.get("service") || "").toString().trim();
      const message = (data.get("message") || "").toString().trim();

      if (!name || !email || !message) {
        if (status) status.textContent = "Please complete name, email, and message.";
        return;
      }

      const body = [
        "Name: " + name,
        "Email: " + email,
        "Phone: " + phone,
        "Service: " + service,
        "",
        message,
      ].join("\n");

      const mailto =
        "mailto:" +
        site.email +
        "?subject=" +
        encodeURIComponent("Website enquiry — " + site.companyName) +
        "&body=" +
        encodeURIComponent(body);

      window.location.href = mailto;
      if (status) {
        status.textContent = "Your email app should open with the message. If it does not, write to " + site.email + ".";
      }
    });
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".section, .hero-panel, .reveal").forEach(function (el) {
    el.classList.add("reveal");
    observer.observe(el);
  });

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".site-nav a");
  function setActiveNav() {
    let current = "home";
    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - 120) current = section.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();
})();
