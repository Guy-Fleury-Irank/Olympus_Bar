const docReady = (fn) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
};

docReady(() => {
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const navToggle = qs('.nav-toggle');
  const navList = qs('.nav-list');
  const navLinks = qsa('.nav-list a');
  const preloader = document.getElementById('preloader');
  const progressBar = qs('.evening-progress');

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      navList.classList.toggle('nav-list--open');
      document.body.classList.toggle('nav-open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navList.classList.remove('nav-list--open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      });
    });
  }

  const updateProgress = () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const value = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0;
    progressBar.value = value;
  };

  const sections = qsa('main section[id]');
  const setActiveLink = () => {
    const scrollPos = window.scrollY + 200;
    sections.forEach((section) => {
      const id = section.getAttribute('id');
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const isActive = scrollPos >= top && scrollPos < top + height;
      if (!id) return;
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${id}`) {
          if (isActive) {
            link.setAttribute('aria-current', 'page');
          } else {
            link.removeAttribute('aria-current');
          }
        }
      });
    });
  };

  window.addEventListener('scroll', () => {
    updateProgress();
    setActiveLink();
  });
  updateProgress();
  setActiveLink();

  const tabButtons = qsa('[data-tab]');
  const tabPanels = qsa('[data-panel]');
  const activateTab = (id) => {
    tabButtons.forEach((btn) => {
      const isActive = btn.dataset.tab === id;
      btn.setAttribute('aria-selected', String(isActive));
    });
    tabPanels.forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.panel === id);
    });
  };

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => activateTab(button.dataset.tab));
  });

  const searchInput = document.getElementById('menu-search');
  const searchClear = document.getElementById('menu-search-clear');
  const menuCards = qsa('.menu-card');

  const filterMenu = () => {
    if (!searchInput) return;
    const term = searchInput.value.trim().toLowerCase();
    menuCards.forEach((card) => {
      const haystack = `${card.dataset.name} ${card.dataset.tags}`.toLowerCase();
      const showCard = !term || haystack.includes(term);
      card.hidden = !showCard;
      card.classList.toggle('is-dimmed', term && !showCard);
    });
  };

  searchInput?.addEventListener('input', filterMenu);
  searchClear?.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = '';
      filterMenu();
      searchInput.focus();
    }
  });

  const galleryItems = qsa('.gallery__item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxCaption = lightbox ? lightbox.querySelector('.lightbox__caption') : null;

  const openLightbox = (item) => {
    if (!lightbox || !lightboxImg || !lightboxCaption) return;
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = item.querySelector('img')?.alt || '';
    lightboxCaption.textContent = item.dataset.caption || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  };

  galleryItems.forEach((item) => item.addEventListener('click', () => openLightbox(item)));
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox || event.target.classList.contains('lightbox__close')) {
      closeLightbox();
    }
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
      if (navList?.classList.contains('nav-list--open')) {
        navList.classList.remove('nav-list--open');
        navToggle?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    }
  });

  const bookingBtn = document.getElementById('bookingSubmit');
  const bookingSuccess = qs('.booking__success');
  bookingBtn?.addEventListener('click', () => {
    if (!bookingSuccess) return;
    bookingSuccess.textContent = "Thanks! We'll reach out soon via email.";
    bookingSuccess.classList.add('is-visible');
    setTimeout(() => bookingSuccess.classList.remove('is-visible'), 2000);
  });

  const animateItems = qsa('[data-animate]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    animateItems.forEach((el) => observer.observe(el));
  } else {
    animateItems.forEach((el) => el.classList.add('is-visible'));
  }

  // Translations object (French by default)
  const translations = {
    fr: {
      'skip': 'Passer au contenu',
      'preloader': "Préparation de l'expérience du Mont...",
      'nav-home': 'Accueil',
      'nav-about': 'À propos',
      'nav-menu': 'Menu',
      'nav-gallery': 'Galerie',
      'nav-booking': 'Réserver',
      'nav-contact': 'Contact',
      'cta-book': 'Réserver maintenant',
      'hero-title': "Montez vers l'Olympe",
      'hero-subtitle': 'Cocktails sophistiqués et bouchées conviviales avec vue sur les lumières de la ville.',
      'btn-explore': 'Découvrir le menu',
      'btn-book': 'Réserver une table',
      'footer-updated': 'Restez informé',
      'footer-toggle': 'Basculer le mode sombre ou rejoindre les réseaux sociaux.',
      'theme-toggle': 'Mode sombre',
      'lang-en': 'EN',
      'lang-fr': 'FR',
      'theme-dark': '☾',
      'theme-light': '☀',
      // Menu item translations (French)
      'menu-elysian-desc': 'Gin, miel de sorgho, brume de safran, fumée d\'agrumes.',
      'menu-elysian-notes': '<span class="text-bold">Notes :</span> herbes des prés, finition soyeuse.',
      'menu-ambrosia-desc': 'Gin élevé en fûts, vermouth à l\'hibiscus, bitters au cacao.',
      'menu-ambrosia-notes': '<span class="text-bold">Notes :</span> éclat rubis, amertume veloutée.',
      'menu-zephyr-desc': 'Whisky fumé, soda tamarin, vapeur de combava.',
      'menu-zephyr-notes': '<span class="text-bold">Notes :</span> effervescent, touche d\'épices.',
      'menu-nile-desc': 'Bao au sésame, tempura de sambaza, hibiscus mariné.',
      'menu-nile-note': '<span class="text-bold">Texture :</span> croustillant + moelleux.',
      'menu-ember-desc': 'Fromage de chèvre fumé, chips de plantain, noix épicées.',
      'menu-ember-note': '<span class="text-bold">Accord :</span> Zephyr Highball.',
      'menu-tartlet-desc': 'Curd de maracuja, chantilly à la vanille, éclats de cacao.',
      'menu-tartlet-note': '<span class="text-bold">Finition :</span> satinée et douce.',
      'menu-olympus-desc': 'Assortiment trois services de bouchées et boissons aux infusions limitées.',
      'menu-olympus-note': '<span class="text-bold">Limité :</span> 12 couverts par soir.',
      'menu-mocktail-desc': 'Trio sans alcool au nectar de baobab, tonic cardamome, brume de sauge.',
      'menu-mocktail-note': '<span class="text-bold">Ambiance :</span> réconfortant et apaisant.'
      ,
      // About section
      'about-eyebrow': 'Sanctuaire Mythique',
      'about-title': 'Un havre au-dessus de la ville',
      'about-lede': 'Perché sur la crête de Kiriri, Olympus Bar marie <span class="text-italic">mythos</span> et confort moderne — cocktails lumineux, banquettes en velours et vues panoramiques encadrées de lauriers.',
      'about-paragraph': 'Nous mettons en lumière les botanicals burundais, des bitters fumés en fût et des petites assiettes inspirées des jardins de la région. Attendez-vous à des hôtes attentifs, une sélection vinyle et des brises parfumées au pin et aux agrumes.',
      'about-list': '<li>Atlas de cocktails curatés revisitant les ingrédients patrimoniaux.</li><li>Bouchées du coucher — des tostadas de sambaza aux cigares de plantain épicés.</li><li>Rituels golden hour animés par des conteurs hôtes.</li>',
      'chef-title': 'Promesse du Chef',
      'chef-desc': 'Chaque assiette quitte le passe avec une <span class="text-bold">floraison dorée</span> et repose dans un cadre en porcelaine arrondi pour conserver chaleur et arômes.',
      'about-learnmore': 'En savoir plus · glisser vers le menu',

  // Booking section
  'booking-eyebrow': 'Réservez votre trône',
  'booking-title': 'Réserver une table',
  'booking-desc': 'Les heures de pointe se remplissent rapidement; une tenue smart casual préserve l\'atmosphère. Appuyez sur « Envoyer la demande » puis confirmez via WhatsApp ou email.',
  'booking-submit': 'Envoyer la demande',
  'booking-note': 'Contactez-nous via WhatsApp ou email pour confirmer.',

      // Menu extras / tasting
      'tasting-title': 'Odyssée en trois gorgées',
      'tasting-step-1': 'Commencez par un shot amuse-bouche refroidi au gingembre kono.',
      'tasting-step-2': 'Poursuivez avec l\'Ambrosia Negroni servi à table avec encens.',
      'tasting-step-3': 'Concluez avec un espresso martini fumé couronné de cacao.',
      'download-text': '<strong class="text-bold">Full spread :</strong> Téléchargez le PDF saisonnier pour planifier votre table.',
      'download-cta': 'Voir le menu complet (PDF)'
    },
    en: {
      'skip': 'Skip to content',
      'preloader': 'Preparing the Mountaintop experience...',
      'nav-home': 'Home',
      'nav-about': 'About',
      'nav-menu': 'Menu',
      'nav-gallery': 'Gallery',
      'nav-booking': 'Book a Table',
      'nav-contact': 'Contact',
      'cta-book': 'Book Now',
      'hero-title': 'Ascend to Olympus',
      'hero-subtitle': 'Fancy cocktails & cozy bites overlooking the city lights.',
      'btn-explore': 'Explore Menu',
      'btn-book': 'Book Table',
      'footer-updated': 'Stay Updated',
      'footer-toggle': 'Toggle dark mode or hop to socials.',
      'theme-toggle': 'Toggle Dark Mode',
      'lang-en': 'EN',
      'lang-fr': 'FR',
      'theme-dark': '☾',
      'theme-light': '☀',
      // Menu item translations (English)
      'menu-elysian-desc': 'Gin, sorghum honey, saffron mist, citrus smoke.',
      'menu-elysian-notes': '<span class="text-bold">Notes:</span> meadow herbs, silk finish.',
      'menu-ambrosia-desc': 'Barrel-rested gin, hibiscus vermouth, cacao bitters.',
      'menu-ambrosia-notes': '<span class="text-bold">Notes:</span> ruby glow, velvety bitters.',
      'menu-zephyr-desc': 'Smoky whisky, tamarind soda, kaffir lime vapor.',
      'menu-zephyr-notes': '<span class="text-bold">Notes:</span> effervescent, spice-kissed.',
      'menu-nile-desc': 'Sesame bao, sambaza tempura, pickled hibiscus.',
      'menu-nile-note': '<span class="text-bold">Texture:</span> crisp + pillowy.',
      'menu-ember-desc': 'Smoked goat cheese, plantain crisps, spiced nuts.',
      'menu-ember-note': '<span class="text-bold">Pairing:</span> Zephyr Highball.',
      'menu-tartlet-desc': 'Maracuja curd, vanilla chantilly, cacao nib dust.',
      'menu-tartlet-note': '<span class="text-bold">Finish:</span> satin-smooth.',
      'menu-olympus-desc': 'Three-course sip & bite pairing featuring limited infusions.',
      'menu-olympus-note': '<span class="text-bold">Limited:</span> 12 seats nightly.',
      'menu-mocktail-desc': 'Zero-proof trio with baobab nectar, cardamom tonic, sage mist.',
      'menu-mocktail-note': '<span class="text-bold">Mood:</span> uplifting & calm.'
      ,
      // About section
      'about-eyebrow': 'Mythical Sanctuary',
      'about-title': 'A Haven Above the City',
      'about-lede': 'Perched on Kiriri’s crest, Olympus Bar marries <span class="text-italic">mythos</span> and modern comfort — glowing cocktails, velvet banquettes, and skyline vistas framed by laurel wreaths.',
      'about-paragraph': 'We spotlight Burundian botanicals, barrel-smoked bitters, and small plates inspired by the region’s gardens. Expect attentive hosts, a curated vinyl soundtrack, and breezes that smell like pine and citrus.',
      'about-list': '<li>Curated cocktail atlas shaking up heritage ingredients.</li><li>Sunset bites—from sambaza tostadas to spiced plantain cigars.</li><li>Golden hour rituals with storytelling hosts.</li>',
      'chef-title': 'Chef\'s Promise',
      'chef-desc': 'Every plate leaves the pass with a <span class="text-bold">gilded flourish</span> and rests inside a rounded porcelain frame to keep warmth swirling.',
      'about-learnmore': 'Learn More · glide to menu',

  // Booking section
  'booking-eyebrow': 'Reserve Your Throne',
  'booking-title': 'Book a Table',
  'booking-desc': 'Peak hours fill quickly; smart casual attire keeps the glow refined. Tap “Send Inquiry” then message us on WhatsApp or email to confirm.',
  'booking-submit': 'Send Inquiry',
  'booking-note': 'Contact us via WhatsApp or email to confirm.',

      // Menu extras / tasting
      'tasting-title': 'Three-Sip Odyssey',
      'tasting-step-1': 'Begin with a chilled amuse-bouche shot of ginger kono.',
      'tasting-step-2': 'Glide into the Ambrosia Negroni served tableside with incense.',
      'tasting-step-3': 'Conclude with a smoky espresso martini crowned in cacao.',
      'download-text': '<strong class="text-bold">Full spread:</strong> Download the season\'s PDF to plan your table.',
      'download-cta': 'View Full Menu (PDF)'
    }
  };

  // Language toggle functionality
  let currentLang = localStorage.getItem('olympus-lang') || 'fr';
  document.documentElement.lang = currentLang;

  const applyTranslations = (lang) => {
    const elements = qsa('[data-i18n]');
    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        // Use innerHTML so small inline markup (e.g., <span class="text-bold">) can be preserved
        el.innerHTML = translations[lang][key];
      }
    });

    // Update lang toggle display
    const langEnSpans = qsa('[data-i18n="lang-en"]');
    const langFrSpans = qsa('[data-i18n="lang-fr"]');
    const themeDarkSpans = qsa('[data-i18n="theme-dark"]');
    const themeLightSpans = qsa('[data-i18n="theme-light"]');
    
    if (lang === 'fr') {
      langEnSpans.forEach(span => span.style.display = 'inline');
      langFrSpans.forEach(span => span.style.display = 'none');
    } else {
      langEnSpans.forEach(span => span.style.display = 'none');
      langFrSpans.forEach(span => span.style.display = 'inline');
    }
  };

  applyTranslations(currentLang);

  const langToggle = document.getElementById('langToggle');
  langToggle?.addEventListener('click', () => {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    document.documentElement.lang = currentLang;
    localStorage.setItem('olympus-lang', currentLang);
    applyTranslations(currentLang);
    langToggle.setAttribute('aria-pressed', String(currentLang === 'en'));
  });

  // Background audio control
  const backgroundAudio = document.getElementById('backgroundAudio');
  const audioToggle = document.getElementById('audioToggle');
  let isAudioPlaying = false;

  const toggleAudio = () => {
    if (!backgroundAudio || !audioToggle) return;
    
    if (isAudioPlaying) {
      backgroundAudio.pause();
      audioToggle.classList.remove('is-playing');
      audioToggle.setAttribute('aria-pressed', 'false');
      isAudioPlaying = false;
    } else {
      backgroundAudio.play().catch(err => {
        console.warn('Audio autoplay prevented:', err);
      });
      audioToggle.classList.add('is-playing');
      audioToggle.setAttribute('aria-pressed', 'true');
      isAudioPlaying = true;
    }
  };

  audioToggle?.addEventListener('click', toggleAudio);

  // Theme toggle functionality (enhanced)
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleNav = document.getElementById('themeToggleNav');
  const root = document.documentElement;
  const storedTheme = window.localStorage.getItem('olympus-theme');

  const applyTheme = (theme) => {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      const themeDarkSpans = qsa('[data-i18n="theme-dark"]');
      const themeLightSpans = qsa('[data-i18n="theme-light"]');
      themeDarkSpans.forEach(span => span.style.display = 'none');
      themeLightSpans.forEach(span => span.style.display = 'inline');
    } else {
      root.removeAttribute('data-theme');
      const themeDarkSpans = qsa('[data-i18n="theme-dark"]');
      const themeLightSpans = qsa('[data-i18n="theme-light"]');
      themeDarkSpans.forEach(span => span.style.display = 'inline');
      themeLightSpans.forEach(span => span.style.display = 'none');
    }
    const isLight = theme === 'light';
    themeToggle?.setAttribute('aria-pressed', String(isLight));
    themeToggleNav?.setAttribute('aria-pressed', String(isLight));
  };

  const handleThemeToggle = () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    const newTheme = isLight ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('olympus-theme', newTheme);
  };

  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    applyTheme('dark'); // Default to dark
  }

  themeToggle?.addEventListener('click', handleThemeToggle);
  themeToggleNav?.addEventListener('click', handleThemeToggle);

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const surveyForm = document.getElementById('survey-form');
  const surveyMessage = qs('.survey__message');

  surveyForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (surveyMessage) {
      surveyMessage.textContent = 'Preferences received! Expect a tailored reply soon.';
    }
  });

  surveyForm?.addEventListener('reset', () => {
    if (surveyMessage) {
      surveyMessage.textContent = '';
    }
  });

  window.setTimeout(() => {
    if (preloader) {
      preloader.style.opacity = '0';
      preloader.style.pointerEvents = 'none';
      preloader.addEventListener('transitionend', () => preloader.remove());
    }
  }, 1200);

  // About carousel (JS-driven): show one slide at a time and loop without blank gap
  (function initAboutCarousel() {
    const aboutTrack = qs('.about__carousel .carousel-track');
    if (!aboutTrack) return;
    const slides = qsa('figure', aboutTrack);
    if (!slides.length) return;

    const track = aboutTrack;
    const slideCount = slides.length;

    // Set sizing so each figure occupies the carousel viewport and the track spans all slides
    track.style.width = `${slideCount * 100}%`;
    slides.forEach((s) => (s.style.width = `${100 / slideCount}%`));

    track.style.transition = track.style.transition || 'transform 600ms ease';

    let currentIndex = 0;
    let intervalId = null;

    const goTo = (index) => {
      // translate by percentage relative to track width
      track.style.transform = `translateX(-${(index * 100) / slideCount}%)`;
      currentIndex = index;
    };

    const next = () => goTo((currentIndex + 1) % slideCount);

    const start = (ms = 4000) => {
      stop();
      intervalId = setInterval(next, ms);
    };

    const stop = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const carouselEl = qs('.about__carousel');
    // Pause on hover/focus for better UX and accessibility
    carouselEl?.addEventListener('mouseenter', stop);
    carouselEl?.addEventListener('mouseleave', () => start(3500));
    carouselEl?.addEventListener('focusin', stop);
    carouselEl?.addEventListener('focusout', () => start(3500));

    // Initialize and start auto-play
    goTo(0);
    start(3500);

    // Minimal live region to announce slide changes to assistive tech
    const live = document.createElement('div');
    live.setAttribute('aria-live', 'polite');
    live.style.position = 'absolute';
    live.style.left = '-9999px';
    live.style.width = '1px';
    live.style.height = '1px';
    carouselEl?.appendChild(live);

    const updateLive = () => {
      live.textContent = `${currentIndex + 1} of ${slideCount}`;
    };

    // Observe transform changes and update the live text
    const observerForLive = new MutationObserver(updateLive);
    observerForLive.observe(track, { attributes: true, attributeFilter: ['style'] });
    updateLive();
  })();

  // Image fallbacks: replace broken images with placeholder and warn in console
  (function attachImageFallbacks() {
    const placeholder = 'assets/images/placeholder.svg';

    const setFallback = (img, original) => {
      if (!img) return;
      // Avoid infinite loop if placeholder is missing
      if (img.dataset._placeholderApplied) return;
      img.dataset._placeholderApplied = '1';
      console.warn(`Image failed to load: ${original} — replacing with placeholder.`);
      img.src = placeholder;
      img.alt = img.alt || 'Image unavailable';
    };

    // Attach to <img> elements
    const imgs = Array.from(document.querySelectorAll('img'));
    imgs.forEach((img) => {
      // if image already loaded fine, still attach handler
      img.addEventListener('error', () => setFallback(img, img.src));
      // If src is empty or missing file, proactively check
      if (img.complete && img.naturalWidth === 0) {
        setFallback(img, img.src || '(no src)');
      }
    });

    // Also handle gallery buttons with data-full
    const galleryBtns = Array.from(document.querySelectorAll('.gallery__item'));
    galleryBtns.forEach((btn) => {
      const full = btn.dataset.full;
      if (!full) return;
      // create an Image object to pre-load and detect missing assets
      const test = new Image();
      test.addEventListener('error', () => {
        console.warn(`Gallery image missing: ${full} — replacing with placeholder.`);
        btn.dataset.full = placeholder;
        const childImg = btn.querySelector('img');
        if (childImg) childImg.src = placeholder;
      });
      test.src = full;
    });
  })();

});
