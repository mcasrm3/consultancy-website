(function () {
  const site = window.SITE;
  if (!site) return;

  const waUrl =
    "https://wa.me/" +
    site.whatsappNumber +
    "?text=" +
    encodeURIComponent("Hello " + site.shortName + ", I would like to discuss a recruitment requirement.");

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
  if (logoMark) logoMark.textContent = "BQ";

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

  const profile = document.getElementById("profile-list");
  if (profile && site.profile) {
    profile.innerHTML = site.profile
      .map(function (item) {
        return (
          "<div><dt>" +
          escapeHtml(item.title) +
          "</dt><dd>" +
          escapeHtml(item.text) +
          "</dd></div>"
        );
      })
      .join("");
  }

  const directors = document.getElementById("director-list");
  if (directors && site.directors) {
    directors.innerHTML = site.directors
      .map(function (item) {
        return (
          '<article class="founder-card"><div class="founder-avatar" aria-hidden="true">' +
          escapeHtml(item.name.split(" ").map(function (part) { return part.charAt(0); }).join("")) +
          '</div><div><h3>' +
          escapeHtml(item.name) +
          "</h3><p>" +
          escapeHtml(item.role) +
          "</p></div></article>"
        );
      })
      .join("");
  }

  const compliance = document.getElementById("compliance-list");
  if (compliance && site.compliance) {
    compliance.innerHTML = site.compliance
      .map(function (item) {
        return (
          "<div><dt>" +
          escapeHtml(item.title) +
          "</dt><dd>" +
          escapeHtml(item.text) +
          "</dd></div>"
        );
      })
      .join("");
  }

  const services = document.getElementById("services-grid");
  if (services) {
    services.innerHTML = site.services
      .map(function (item) {
        const tags = (item.tags || []).map(function (tag) {
          return "<li>" + escapeHtml(tag) + "</li>";
        }).join("");
        return (
          '<article class="card reveal"><h3>' +
          escapeHtml(item.title) +
          "</h3><p>" +
          escapeHtml(item.text) +
          '</p><ul class="card-tags">' +
          tags +
          "</ul></article>"
        );
      })
      .join("");
  }

  const industries = document.getElementById("industries-grid");
  if (industries && site.industries) {
    industries.innerHTML = site.industries
      .map(function (item, index) {
        return (
          '<article class="industry-card reveal"><span>' +
          String(index + 1).padStart(2, "0") +
          "</span><h3>" +
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

  const jobCategories = document.getElementById("job-categories");
  if (jobCategories && site.jobCategories) {
    jobCategories.innerHTML = site.jobCategories.map(function (item) {
      return "<span>" + escapeHtml(item) + "</span>";
    }).join("");
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
    "@type": "EmploymentAgency",
    name: site.companyName,
    description: site.description,
    telephone: site.phoneDisplay,
    email: site.email,
    url: window.location.origin + window.location.pathname,
    address: {
      "@type": "PostalAddress",
      streetAddress: "H-187, Sector 63",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: "201307",
      addressCountry: "IN",
    },
    identifier: site.cin,
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

  function setupMailForm(formId, statusId, subject, requiredFields, fieldLabels) {
    const form = document.getElementById(formId);
    const status = document.getElementById(statusId);
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = new FormData(form);
      const missing = requiredFields.some(function (field) {
        return !(data.get(field) || "").toString().trim();
      });
      if (missing) {
        if (status) status.textContent = "Please complete all required fields.";
        return;
      }

      const body = Object.keys(fieldLabels).map(function (field) {
        const value = data.get(field);
        if (value instanceof File) {
          return fieldLabels[field] + ": " + (value.name || "Not selected");
        }
        return fieldLabels[field] + ": " + (value || "");
      }).join("\n");

      const mailto =
        "mailto:" +
        site.email +
        "?subject=" +
        encodeURIComponent(subject + " — " + site.shortName) +
        "&body=" +
        encodeURIComponent(body);

      window.location.href = mailto;
      if (status) {
        status.textContent = "Your email app should open. Attach any selected file before sending.";
      }
    });
  }

  setupMailForm(
    "contact-form",
    "form-status",
    "Website enquiry",
    ["name", "email", "message"],
    { name: "Name", email: "Email", phone: "Phone", service: "Interest", message: "Message" }
  );

  setupMailForm(
    "hire-form",
    "hire-status",
    "Hiring requirement",
    ["company", "name", "email", "phone", "requirement"],
    {
      company: "Company",
      name: "Contact Person",
      email: "Email",
      phone: "Mobile",
      industry: "Industry",
      positions: "Number of Positions",
      locations: "Locations",
      requirement: "Hiring Requirement",
      jobDescription: "Job Description file",
    }
  );

  setupMailForm(
    "career-form",
    "career-status",
    "Candidate application",
    ["name", "phone", "email", "preferredRole"],
    {
      name: "Name",
      phone: "Mobile",
      email: "Email",
      currentLocation: "Current Location",
      preferredLocation: "Preferred Location",
      experience: "Experience",
      qualification: "Qualification",
      preferredRole: "Preferred Role",
      resume: "Resume file",
    }
  );

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
