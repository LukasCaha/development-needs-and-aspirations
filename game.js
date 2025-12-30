// API Configuration
// Get your free TMDB API key from: https://www.themoviedb.org/settings/api
const TMDB_API_KEY = "b8081d1470e19b5ea9da3c822a211195"; // Add your API key here

// LogoKit API Configuration (replacement for discontinued Clearbit Logo API)
// Get your free API token from: https://logokit.com/
const LOGOKIT_TOKEN = "pk_fra1edb3c6772478b1e5c3"; // Add your LogoKit API token here

// OpenGraph.io API Configuration (for reliable OG image fetching)
// Get your free app ID from: https://www.opengraph.io/ (100 requests/day free)
const OPENGRAPH_IO_APP_ID = ""; // Add your OpenGraph.io app ID here (optional - will use simplified approach if empty)

// Game State
let gameState = {
  currentPhase: "welcome", // 'welcome', 'step1', 'step2', 'step3', 'result'
  choices: {
    step1: null, // 'A', 'B', or 'C' (internal codes)
    step2: null, // '1', '2', or '3' (internal codes)
    step3: null, // 'X', 'Y', or 'Z' (internal codes)
  },
};

// Helper function to convert markdown-style italics to HTML
function formatMarkdown(text) {
  return text.replace(/_([^_]+)_/g, "<em>$1</em>");
}

// API Functions
// Helper to clean movie title by removing parenthetical information
function cleanMovieTitle(title) {
  // Remove anything in parentheses (including the parentheses)
  return title.replace(/\s*\([^)]*\)\s*/g, "").trim();
}

async function fetchMoviePoster(movieTitle) {
  if (!TMDB_API_KEY) {
    return null;
  }

  // Clean the title by removing parenthetical information
  const cleanTitle = cleanMovieTitle(movieTitle);

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        cleanTitle
      )}`
    );
    const data = await response.json();

    if (
      data.results &&
      data.results.length > 0 &&
      data.results[0].poster_path
    ) {
      return `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching poster for ${movieTitle}:`, error);
    return null;
  }
}

function getBookCoverUrl(isbn) {
  if (!isbn) return null;
  // Open Library Covers API - no key needed
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
}

// Helper to get book title and ISBN from book entry (supports both string and object formats)
function getBookInfo(bookEntry) {
  if (typeof bookEntry === "string") {
    return { title: bookEntry, isbn: null };
  }
  return { title: bookEntry.title || bookEntry, isbn: bookEntry.isbn || null };
}

// Article URL mapping - maps article titles to their URLs
const articleUrls = {
  "Paul Graham: 'Do Things that Don't Scale' (Counter-intuitive origin)":
    "http://paulgraham.com/dsf.html",
  "Mark Zuckerberg's Letter to Investors (2012)":
    "https://www.sec.gov/Archives/edgar/data/1326801/000119312512034517/d287954ds1.htm",
  "Jan Koum's sticky note: 'No Ads! No Games! No Gimmicks!'":
    "https://www.whatsapp.com/about/",
  "Paul Graham: 'Startup = Growth'": "http://paulgraham.com/growth.html",
  "Evan Spiegel's leaked emails":
    "https://www.businessinsider.com/snapchat-ceo-evan-spiegel-leaked-emails-2014-5",
  "The rise and fall of HQ Trivia":
    "https://www.theverge.com/2020/2/14/21138201/hq-trivia-shut-down-shutting-down-app",
  "Andrew Chen: 'Growth Hacker is the new VP Marketing'":
    "https://andrewchen.com/growth-hacker-is-the-new-vp-marketing/",
  "Booking.com design blog (Experimentation culture)":
    "https://booking.design/",
  "Vanity Fair: 'Tinder and the Dawn of the Dating Apocalypse'":
    "https://www.vanityfair.com/culture/2015/08/tinder-hook-up-culture-end-of-dating",
  "Whitney Wolfe Herd on 'Make the First Move'":
    "https://www.bumble.com/en-us/the-buzz/make-the-first-move",
  "The Verge: 'BeReal and the end of the curated feed'":
    "https://www.theverge.com/2022/8/8/23296518/bereal-app-gen-z-instagram-tiktok-social-media",
  "Essays on 'Vibe Capital'": "https://www.vibecapital.com/",
  "Bill Gurley: 'The Run on the Bank' (Benchmark vs Travis)":
    "https://abovethecrowd.com/2017/06/20/the-run-on-the-bank/",
  "NYT: 'How Uber Deceives the Authorities Worldwide' (Greyball)":
    "https://www.nytimes.com/2017/03/03/technology/uber-greyball-program-evade-authorities.html",
  "DoorDash Blog: 'The Dash'": "https://blog.doordash.com/",
  "Instacart's initial pivot stories": "https://www.instacart.com/",
  "Matt Levine (Money Stuff) on WeWork":
    "https://www.bloomberg.com/opinion/articles/2019-10-23/wework-is-worthless",
  "Vanity Fair on Adam Neumann":
    "https://www.vanityfair.com/news/2019/10/the-meteoric-rise-and-imminent-fall-of-adam-neumann",
  "Jeff Dean: 'Google infrastructure for deep learning'":
    "https://ai.googleblog.com/",
  "The Google PageRank Paper":
    "https://infolab.stanford.edu/~backrub/google.html",
  "Moxie Marlinspike Blog": "https://moxie.org/",
  "The ProtonMail Manifesto": "https://proton.me/blog/protonmail-manifesto",
  "The Linear Method": "https://linear.app/method",
  "Notion's Design Philosophy": "https://www.notion.so/design",
  "Patrick Collison's Reading List": "https://patrickcollison.com/bookshelf",
  "Netflix Tech Blog: 'Artwork Personalization'":
    "https://netflixtechblog.com/artwork-personalization-c589f074ad76",
  "Spotify Engineering: 'Discover Weekly'":
    "https://engineering.atspotify.com/2015/09/machine-learning-spotify-discover-weekly/",
  "Brian Chesky: '7 Star Design'":
    "https://www.lennysnewsletter.com/p/airbnbs-brian-chesky-on-7-star-design",
  "Paul Graham: 'Do things that don't scale' (Airbnb story)":
    "http://paulgraham.com/ds.html",
  "Jony Ive interviews in Vanity Fair":
    "https://www.vanityfair.com/news/2018/06/jony-ive-apple-interview",
  "Apple's Human Interface Guidelines":
    "https://developer.apple.com/design/human-interface-guidelines/",
  "Jeff Bezos 1997 Shareholder Letter":
    "https://www.sec.gov/Archives/edgar/data/1018724/000119312513151836/d511111dex991.htm",
  "The Amazon Flywheel": "https://www.amazon.jobs/en/principles",
  "Intercom on Product Management":
    "https://www.intercom.com/blog/product-management/",
  "Zappos Culture Book": "https://www.zappos.com/about/culture",
  "Rahul Vohra on Superhuman's Game Design":
    "https://blog.superhuman.com/how-to-build-product-engines/",
  "Kevin Kelly: '1000 True Fans'": "https://kk.org/thetechnium/1000-true-fans/",
  "Sahil Lavingia: 'Reflecting on My Failure to Build a Billion-Dollar Company'":
    "https://sahillavingia.com/reflecting",
  "Pieter Levels' Blog": "https://levels.io/",
  "The GNU Manifesto": "https://www.gnu.org/gnu/manifesto.en.html",
  "Eric S. Raymond essays": "http://www.catb.org/~esr/writings/",
  "John Carreyrou WSJ Exposes":
    "https://www.wsj.com/articles/theranos-has-struggled-with-blood-tests-1444881901",
  "CoffeeZilla Investigations": "https://www.youtube.com/@coffeezilla",
  "Melanie Perkins: 'The goal is to empower the world to design'":
    "https://www.canva.com/learn/",
  "Webflow's No-Code Manifesto": "https://webflow.com/blog/no-code-manifesto",
  "Craig Newmark on why Craigslist hasn't changed":
    "https://www.craigslist.org/about/",
  "Joel Spolsky Blog": "https://www.joelonsoftware.com/",
  "Signal v. Noise (Basecamp Blog)": "https://signalvnoise.com/",
  "Mailchimp's 'Fail Harder'": "https://mailchimp.com/about/",
  "Wired: 'The Long Tail'": "https://www.wired.com/2004/10/tail/",
  "Kevin Kelly: 'Better Than Free'":
    "https://kk.org/thetechnium/better-than-fre/",
  "Aaron Swartz's Guerilla Open Access Manifesto":
    "https://archive.org/stream/GuerillaOpenAccessManifesto/Goamjuly2008_djvu.txt",
  "Bill Gates on Khan Academy":
    "https://www.gatesnotes.com/Education/Khan-Academy",
  "Ryan Reynolds on 'Fastvertising'": "https://www.mintmobile.com/",
};

// Helper to get article info (title and URL)
function getArticleInfo(articleEntry) {
  if (typeof articleEntry === "string") {
    return { title: articleEntry, url: articleUrls[articleEntry] || null };
  }
  return {
    title: articleEntry.title || articleEntry,
    url: articleEntry.url || articleUrls[articleEntry.title] || null,
  };
}

// Brand name to domain mapping for edge cases
const brandDomainMap = {
  TikTok: "tiktok.com",
  OpenAI: "openai.com",
  "Uber (Algorithm/Matching)": "uber.com",
  "Google (Early Search)": "google.com",
  Palantir: "palantir.com",
  "Jane Street (Trading)": "janestreet.com",
  "Renaissance Technologies": "rentec.com",
  "Netflix (Recommendation Engine)": "netflix.com",
  "Facebook (The News Feed)": "facebook.com",
  ByteDance: "bytedance.com",
  WhatsApp: "whatsapp.com",
  Telegram: "telegram.org",
  Zoom: "zoom.us",
  Discord: "discord.com",
  Skype: "skype.com",
  Dropbox: "dropbox.com",
  Slack: "slack.com",
  WeChat: "wechat.com",
  Messenger: "messenger.com",
  Signal: "signal.org",
  Snapchat: "snapchat.com",
  Meerkat: "meerkat.com",
  Vine: "vine.co",
  "Booking.com": "booking.com",
  Zynga: "zynga.com",
  Temu: "temu.com",
  Tinder: "tinder.com",
  Bumble: "bumble.com",
  Hinge: "hinge.co",
  BeReal: "bereal.com",
  Clubhouse: "clubhouse.com",
  Poparazzi: "poparazzi.com",
  "Uber (Early)": "uber.com",
  Lyft: "lyft.com",
  Lime: "li.me",
  DoorDash: "doordash.com",
  Instacart: "instacart.com",
  TaskRabbit: "taskrabbit.com",
  WeWork: "wework.com",
  Juicero: "juicero.com",
  "Fyre Media": "fyrefestival.com",
  "Google (DeepMind/Search)": "google.com",
  NVIDIA: "nvidia.com",
  Intel: "intel.com",
  "1Password": "1password.com",
  ProtonMail: "proton.me",
  Linear: "linear.app",
  Notion: "notion.so",
  Raycast: "raycast.com",
  Vercel: "vercel.com",
  "Stripe (Dev Experience)": "stripe.com",
  "Arc (The Browser Company)": "arc.net",
  Panic: "panic.com",
  "Things 3 (Cultured Code)": "culturedcode.com",
  Framer: "framer.com",
  Superhuman: "superhuman.com",
  Spotify: "spotify.com",
  Netflix: "netflix.com",
  Pinterest: "pinterest.com",
  Airbnb: "airbnb.com",
  Etsy: "etsy.com",
  Patreon: "patreon.com",
  Apple: "apple.com",
  Tesla: "tesla.com",
  Peloton: "onepeloton.com",
  Amazon: "amazon.com",
  FedEx: "fedex.com",
  DHL: "dhl.com",
  Zendesk: "zendesk.com",
  Intercom: "intercom.com",
  Zappos: "zappos.com",
  "Clubhouse (Early)": "clubhouse.com",
  "Product Hunt": "producthunt.com",
  "The League": "theleague.com",
  "Stripe (Early)": "stripe.com",
  Gumroad: "gumroad.com",
  "Levels.fyi": "levels.fyi",
  Linux: "linux.org",
  Wikipedia: "wikipedia.org",
  Mozilla: "mozilla.org",
  Theranos: "theranos.com",
  Nikola: "nikolamotor.com",
  FTX: "ftx.com",
  Canva: "canva.com",
  Wix: "wix.com",
  Squarespace: "squarespace.com",
  Reddit: "reddit.com",
  Craigslist: "craigslist.org",
  Mailchimp: "mailchimp.com",
  "Basecamp (37Signals)": "basecamp.com",
  "Cards Against Humanity": "cardsagainsthumanity.com",
  eBay: "ebay.com",
  "Amazon Marketplace": "amazon.com",
  Thrasio: "thrasio.com",
  "Archive.org": "archive.org",
  Duolingo: "duolingo.com",
  Grammarly: "grammarly.com",
  "Dollar Shave Club": "dollarshaveclub.com",
};

// Extract domain from brand name
function extractBrandDomain(brandName) {
  // Check mapping first
  if (brandDomainMap[brandName]) {
    return brandDomainMap[brandName];
  }

  // Try to extract domain from brand name
  // Remove parenthetical information
  const cleanName = brandName.replace(/\s*\([^)]*\)\s*/g, "").trim();

  // Convert to lowercase and replace spaces with nothing
  const domain = cleanName.toLowerCase().replace(/\s+/g, "");

  // Add common TLDs
  return `${domain}.com`;
}

async function fetchBrandLogo(brandName) {
  if (!brandName) return null;

  const domain = extractBrandDomain(brandName);

  // Use LogoKit API (replacement for discontinued Clearbit Logo API)
  // LogoKit requires a token for full functionality
  // Get your free token from: https://logokit.com/
  if (LOGOKIT_TOKEN) {
    return `https://img.logokit.com/${domain}?token=${LOGOKIT_TOKEN}`;
  } else {
    // Without token, LogoKit may return placeholders or errors
    // The carousel will handle errors gracefully with fallback placeholders
    return `https://img.logokit.com/${domain}`;
  }
}

// Extract person name from founder string (e.g., "Sam Altman (OpenAI)" -> "Sam Altman")
function extractFounderName(founderString) {
  if (!founderString) return "";

  // Remove parenthetical company name (same trick as brand names)
  let cleaned = founderString.replace(/\s*\([^)]*\)\s*/g, "").trim();

  // Also handle cases with multiple parentheticals or extra info
  // Remove any trailing parentheticals that might remain
  cleaned = cleaned.replace(/\s*\([^)]*\)\s*$/, "").trim();

  return cleaned;
}

async function fetchFounderHeadshot(founderName) {
  if (!founderName) return null;

  const personName = extractFounderName(founderName);

  try {
    // Wikipedia REST API - no key needed
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        personName
      )}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Check if there's a thumbnail image
    if (data.thumbnail && data.thumbnail.source) {
      // Use larger image if available (replace /thumb/ with original)
      return data.thumbnail.source.replace(/\/\d+px-/, "/800px-");
    }

    return null;
  } catch (error) {
    console.error(`Error fetching headshot for ${founderName}:`, error);
    return null;
  }
}

async function fetchArticleOGImage(url) {
  if (!url) return null;

  // Use OpenGraph.io API if available (more reliable)
  if (OPENGRAPH_IO_APP_ID) {
    try {
      const apiUrl = `https://opengraph.io/api/1.1/site/${encodeURIComponent(
        url
      )}?app_id=${OPENGRAPH_IO_APP_ID}`;

      // Add timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      // OpenGraph.io returns data in hierarchicalOpenGraph structure
      if (data.hierarchicalOpenGraph && data.hierarchicalOpenGraph.og_image) {
        const ogImage = data.hierarchicalOpenGraph.og_image;
        if (ogImage.url) {
          return ogImage.url;
        }
      }

      // Fallback to simple og_image if available
      if (data.ogImage && data.ogImage.url) {
        return data.ogImage.url;
      }

      return null;
    } catch (error) {
      if (error.name === "AbortError") {
        console.error(`Timeout fetching OG image for ${url}`);
      } else {
        console.error(`Error fetching OG image for ${url}:`, error);
      }
      return null;
    }
  }

  // Fallback: Simplified approach - return null to show placeholder
  // This avoids slow/unreliable CORS proxy issues
  // Articles will still be clickable, just without preview images
  return null;
}

// Phase Management
function showPhase(phaseName) {
  const phases = ["welcome-screen", "step-1", "step-2", "step-3", "result"];
  phases.forEach((phase) => {
    const element = document.getElementById(phase);
    if (element) {
      element.classList.remove("active");
    }
  });

  const targetPhase =
    phaseName === "welcome"
      ? "welcome-screen"
      : phaseName === "step1"
      ? "step-1"
      : phaseName === "step2"
      ? "step-2"
      : phaseName === "step3"
      ? "step-3"
      : "result";

  const element = document.getElementById(targetPhase);
  if (element) {
    element.classList.add("active");
  }

  gameState.currentPhase = phaseName;
}

// Start Game
function startGame() {
  gameState.currentPhase = "step1";
  gameState.choices = { step1: null, step2: null, step3: null };
  renderStep1();
}

// Render Step 1
function renderStep1() {
  showPhase("step1");

  const promptEl = document.getElementById("step1-prompt");
  const optionsEl = document.getElementById("step1-options");
  const responseEl = document.getElementById("step1-response");

  promptEl.textContent = step1Prompt;
  responseEl.style.display = "none";
  optionsEl.style.display = "flex"; // Make sure options are visible

  optionsEl.innerHTML = "";

  Object.keys(step1Options).forEach((key) => {
    const option = step1Options[key];
    const optionDiv = document.createElement("div");
    optionDiv.className = "option";
    optionDiv.dataset.key = key;
    optionDiv.onclick = () => selectStep1(key);

    optionDiv.innerHTML = `
            <div class="option-title">${option.title} (${option.shortLabel})</div>
            <div class="option-subtitle">${option.subtitle}</div>
            <div class="option-description">${option.description}</div>
        `;

    optionsEl.appendChild(optionDiv);
  });

  // Setup keyboard listeners for step 1 (S/Q/C map to A/B/C)
  setupKeyboardListeners("step1", { S: "A", Q: "B", C: "C" }, selectStep1);
}

// Select Step 1 Choice
function selectStep1(choice) {
  gameState.choices.step1 = choice;

  const responseEl = document.getElementById("step1-response");
  const stepContainer = responseEl.parentElement;

  // Remove any existing continue button
  const existingBtn = stepContainer.querySelector("#step1-continue-btn");
  if (existingBtn) existingBtn.remove();

  responseEl.innerHTML = formatMarkdown(step1Responses[choice]);
  responseEl.style.display = "block";

  // Hide options
  document.getElementById("step1-options").style.display = "none";

  // Remove keyboard listeners
  removeKeyboardListeners();

  // Add continue button outside the response box
  const continueBtn = document.createElement("button");
  continueBtn.id = "step1-continue-btn";
  continueBtn.textContent = "Continue";
  continueBtn.style.marginTop = "15px";
  continueBtn.onclick = () => {
    responseEl.style.display = "none";
    continueBtn.remove();
    renderStep2();
  };
  stepContainer.appendChild(continueBtn);
}

// Render Step 2
function renderStep2() {
  showPhase("step2");

  const promptEl = document.getElementById("step2-prompt");
  const optionsEl = document.getElementById("step2-options");
  const responseEl = document.getElementById("step2-response");

  promptEl.textContent = getStep2Prompt(gameState.choices.step1);
  responseEl.style.display = "none";
  optionsEl.style.display = "flex"; // Make sure options are visible

  optionsEl.innerHTML = "";

  const options = getStep2Options(gameState.choices.step1);

  Object.keys(options).forEach((key) => {
    const option = options[key];
    const optionDiv = document.createElement("div");
    optionDiv.className = "option";
    optionDiv.dataset.key = key;
    optionDiv.onclick = () => selectStep2(key);

    optionDiv.innerHTML = `
            <div class="option-title">${option.title} (${option.shortLabel})</div>
            <div class="option-subtitle">${option.subtitle}</div>
            <div class="option-description">${option.vibe}</div>
            <div class="option-focus">Focus: ${option.focus}</div>
        `;

    optionsEl.appendChild(optionDiv);
  });

  // Setup keyboard listeners for step 2 (E/D/O map to 1/2/3)
  setupKeyboardListeners("step2", { E: "1", D: "2", O: "3" }, selectStep2);
}

// Select Step 2 Choice
function selectStep2(choice) {
  gameState.choices.step2 = choice;

  const responseEl = document.getElementById("step2-response");
  const stepContainer = responseEl.parentElement;

  // Remove any existing continue button
  const existingBtn = stepContainer.querySelector("#step2-continue-btn");
  if (existingBtn) existingBtn.remove();

  responseEl.innerHTML = formatMarkdown(
    getStep2Response(gameState.choices.step1, choice)
  );
  responseEl.style.display = "block";

  // Hide options
  document.getElementById("step2-options").style.display = "none";

  // Remove keyboard listeners
  removeKeyboardListeners();

  // Add continue button outside the response box
  const continueBtn = document.createElement("button");
  continueBtn.id = "step2-continue-btn";
  continueBtn.textContent = "Continue";
  continueBtn.style.marginTop = "15px";
  continueBtn.onclick = () => {
    responseEl.style.display = "none";
    continueBtn.remove();
    renderStep3();
  };
  stepContainer.appendChild(continueBtn);
}

// Render Step 3
function renderStep3() {
  showPhase("step3");

  const promptEl = document.getElementById("step3-prompt");
  const optionsEl = document.getElementById("step3-options");
  const responseEl = document.getElementById("step3-response");

  promptEl.textContent = getStep3Prompt(
    gameState.choices.step1,
    gameState.choices.step2
  );
  responseEl.style.display = "none";
  optionsEl.style.display = "flex"; // Make sure options are visible

  optionsEl.innerHTML = "";

  const options = getStep3Options(
    gameState.choices.step1,
    gameState.choices.step2
  );

  Object.keys(options).forEach((key) => {
    const option = options[key];
    const optionDiv = document.createElement("div");
    optionDiv.className = "option";
    optionDiv.dataset.key = key;
    optionDiv.onclick = () => selectStep3(key);

    optionDiv.innerHTML = `
            <div class="option-title">${option.title} (${option.shortLabel})</div>
            <div class="option-subtitle">${option.subtitle}</div>
            <div class="option-description">${option.pitch}</div>
            <div class="option-focus">Mechanism: ${option.mechanism}</div>
        `;

    optionsEl.appendChild(optionDiv);
  });

  // Setup keyboard listeners for step 3 (D/C/B map to X/Y/Z)
  setupKeyboardListeners("step3", { D: "X", C: "Y", B: "Z" }, selectStep3);
}

// Select Step 3 Choice
function selectStep3(choice) {
  gameState.choices.step3 = choice;

  const responseEl = document.getElementById("step3-response");
  const stepContainer = responseEl.parentElement;

  // Remove any existing continue button
  const existingBtn = stepContainer.querySelector("#step3-continue-btn");
  if (existingBtn) existingBtn.remove();

  responseEl.innerHTML = formatMarkdown(
    getStep3Response(gameState.choices.step1, gameState.choices.step2, choice)
  );
  responseEl.style.display = "block";

  // Hide options
  document.getElementById("step3-options").style.display = "none";

  // Remove keyboard listeners
  removeKeyboardListeners();

  // Add continue button outside the response box
  const continueBtn = document.createElement("button");
  continueBtn.id = "step3-continue-btn";
  continueBtn.textContent = "Continue";
  continueBtn.style.marginTop = "15px";
  continueBtn.onclick = () => {
    responseEl.style.display = "none";
    continueBtn.remove();
    calculateResult();
  };
  stepContainer.appendChild(continueBtn);
}

// Helper function to find path for an archetype name
function findArchetypePath(archetypeName) {
  for (const [path, arch] of Object.entries(archetypes)) {
    if (arch.name === archetypeName) {
      return path;
    }
  }
  return null;
}

// View an archetype by name (for summary navigation)
async function viewArchetype(archetypeName) {
  const path = findArchetypePath(archetypeName);
  if (!path) {
    console.error("Archetype not found:", archetypeName);
    return;
  }

  // Parse path to get choices
  const [step1, step2, step3] = path.split("-");
  gameState.choices = { step1, step2, step3 };

  // Get the archetype
  const archetype = archetypes[path];
  if (!archetype) {
    console.error("Archetype not found for path:", path);
    return;
  }

  // Render the result (don't track stats for viewing other archetypes)
  await renderResult(archetype, path);

  // Scroll to top to show the result
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Calculate Result
async function calculateResult() {
  const path = `${gameState.choices.step1}-${gameState.choices.step2}-${gameState.choices.step3}`;
  const archetype = archetypes[path];

  if (!archetype) {
    console.error("Archetype not found for path:", path);
    return;
  }

  // Track statistics - wait for it to complete before rendering results
  if (typeof trackQuizResult === "function") {
    try {
      await trackQuizResult(gameState.choices, archetype, path);
      // Small delay to ensure database has updated
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (err) {
      // Continue even if tracking fails
      console.error("Failed to track stats, continuing anyway:", err);
    }
  }

  renderResult(archetype, path);
}

// Render Result
async function renderResult(archetype, path) {
  showPhase("result");

  const resultContent = document.getElementById("result-content");

  // Get human-readable path labels
  const step1Label = step1Options[gameState.choices.step1].label;
  const step2Options = getStep2Options(gameState.choices.step1);
  const step2Label = step2Options[gameState.choices.step2].label;
  const step3Options = getStep3Options(
    gameState.choices.step1,
    gameState.choices.step2
  );
  const step3Label = step3Options[gameState.choices.step3].label;

  // Generate result description based on path
  let resultDescription = "";
  if (
    gameState.choices.step1 === "B" &&
    gameState.choices.step2 === "2" &&
    gameState.choices.step3 === "X"
  ) {
    resultDescription =
      "You built a system that feels human but thinks like a supercomputer.";
  } else {
    resultDescription = `You've built something unique by combining ${step1Label.toLowerCase()}, ${step2Label.toLowerCase()}, and ${step3Label.toLowerCase()}.`;
  }

  // Fetch statistics
  const stats =
    typeof getStatistics === "function" ? await getStatistics() : null;

  // Build statistics HTML
  let statsHTML = "";
  if (stats && stats.total > 0) {
    const userArchetypeCount =
      stats.archetypes.find((a) => a.archetype === archetype.name)?.count || 0;
    const userArchetypePercent = (
      (userArchetypeCount / stats.total) *
      100
    ).toFixed(1);

    statsHTML = `
      <div class="result-section" style="margin-top: 30px; padding-top: 30px; border-top: 2px solid #eee;">
        <h3>Community Statistics</h3>
        <p style="margin-bottom: 15px; padding: 10px; background: #fff3cd; border-left: 4px solid #ffc107; color: #856404; font-size: 0.9em; border-radius: 4px;">
          <strong>Note:</strong> Only your first submission counts towards these statistics. Subsequent attempts are discarded, but you can try again to explore different options.
        </p>
        <p style="margin-bottom: 15px; color: #666;">
          <strong>${stats.total}</strong> ${
      stats.total === 1 ? "person has" : "people have"
    } taken this quiz.
        </p>
        <p style="margin-bottom: 20px;">
          <strong>${userArchetypeCount}</strong> ${
      userArchetypeCount === 1 ? "person" : "people"
    } (${userArchetypePercent}%) got the same result as you: <strong>${
      archetype.name
    }</strong>
        </p>
        
        <div style="margin-top: 20px;">
          <h4 style="font-size: 1em; margin-bottom: 10px; color: #444;">All Archetypes:</h4>
          <ul style="list-style: none; padding: 0;">
            ${(() => {
              // Get all archetype names from the archetypes object
              const allArchetypeNames = Object.values(archetypes).map(
                (a) => a.name
              );

              // Create a map of archetype name to count from stats
              const statsMap = new Map();
              stats.archetypes.forEach((a) => {
                statsMap.set(a.archetype, a.count);
              });

              // Create complete list with all archetypes, including 0 counts
              const completeList = allArchetypeNames.map((name) => ({
                archetype: name,
                count: statsMap.get(name) || 0,
              }));

              // Sort by count (descending), then by name (ascending)
              completeList.sort((a, b) => {
                if (b.count !== a.count) {
                  return b.count - a.count;
                }
                return a.archetype.localeCompare(b.archetype);
              });

              return completeList
                .map((a) => {
                  const percent =
                    stats.total > 0
                      ? ((a.count / stats.total) * 100).toFixed(1)
                      : "0.0";
                  const isUser = a.archetype === archetype.name;
                  return `<li style="margin: 8px 0; padding: 8px; background: ${
                    isUser ? "#e8f5e9" : "#f9f9f9"
                  }; border-left: 3px solid ${
                    isUser ? "#4caf50" : "#ddd"
                  }; display: flex; justify-content: space-between; align-items: center;">
                <span><strong>${a.archetype}</strong> - ${a.count} ${
                    a.count === 1 ? "vote" : "votes"
                  } (${percent}%)</span>
                <button onclick="viewArchetype('${a.archetype.replace(
                  /'/g,
                  "\\'"
                )}')" onmouseover="this.style.background='#357abd'" onmouseout="this.style.background='#4a90e2'" style="padding: 6px 12px; font-size: 0.85em; background: #4a90e2; color: white; border: none; border-radius: 4px; cursor: pointer; transition: background 0.2s;">View</button>
              </li>`;
                })
                .join("");
            })()}
          </ul>
        </div>
      </div>
    `;
  }

  // Helper function to render array fields
  const renderArrayField = (items, isQuotes = false) => {
    if (!items || items.length === 0) return "";
    return items
      .map((item) => `<li>${isQuotes ? `<em>"${item}"</em>` : item}</li>`)
      .join("");
  };

  // Render movie carousel (synchronous HTML, async image loading)
  const renderMovieCarousel = (movies) => {
    if (!movies || movies.length === 0) return "";

    const carouselId = `movie-carousel-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    let carouselHTML = `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 0.95em; margin-bottom: 8px; color: #666;">Movies</h4>
        <div id="${carouselId}" class="carousel-container">
    `;

    // Create placeholder items
    movies.forEach((movieTitle, index) => {
      carouselHTML += `
        <div class="carousel-item" data-movie-index="${index}">
          <div class="item-loading">Loading...</div>
          <div class="item-title">${movieTitle}</div>
        </div>
      `;
    });

    carouselHTML += `</div></div>`;

    // Store movies array for async loading
    window[`movies_${carouselId}`] = movies;

    // Load images asynchronously after HTML is inserted
    setTimeout(async () => {
      const container = document.getElementById(carouselId);
      const moviesArray = window[`movies_${carouselId}`];
      if (!container || !moviesArray) return;

      for (let i = 0; i < moviesArray.length; i++) {
        const item = container.querySelector(`[data-movie-index="${i}"]`);
        if (!item) continue;

        const movieTitle = moviesArray[i];
        const posterUrl = await fetchMoviePoster(movieTitle);

        if (posterUrl) {
          item.innerHTML = `
            <img src="${posterUrl}" alt="${movieTitle}" onerror="this.parentElement.innerHTML='<div class=\\'item-placeholder\\'>${movieTitle}</div><div class=\\'item-title\\'>${movieTitle}</div>'">
            <div class="item-title">${movieTitle}</div>
          `;
        } else {
          item.innerHTML = `
            <div class="item-placeholder">${movieTitle}</div>
            <div class="item-title">${movieTitle}</div>
          `;
        }
      }

      // Clean up
      delete window[`movies_${carouselId}`];
    }, 100);

    return carouselHTML;
  };

  // Render book carousel
  const renderBookCarousel = (books) => {
    if (!books || books.length === 0) return "";

    let carouselHTML = `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 0.95em; margin-bottom: 8px; color: #666;">Books</h4>
        <div class="carousel-container">
    `;

    books.forEach((bookEntry) => {
      const bookInfo = getBookInfo(bookEntry);
      const coverUrl = getBookCoverUrl(bookInfo.isbn);

      if (coverUrl) {
        carouselHTML += `
          <div class="carousel-item">
            <img src="${coverUrl}" alt="${bookInfo.title}" onerror="this.parentElement.innerHTML='<div class=\\'item-placeholder\\'>${bookInfo.title}</div><div class=\\'item-title\\'>${bookInfo.title}</div>'">
            <div class="item-title">${bookInfo.title}</div>
          </div>
        `;
      } else {
        carouselHTML += `
          <div class="carousel-item">
            <div class="item-placeholder">${bookInfo.title}</div>
            <div class="item-title">${bookInfo.title}</div>
          </div>
        `;
      }
    });

    carouselHTML += `</div></div>`;
    return carouselHTML;
  };

  // Render brand carousel
  const renderBrandCarousel = (brands) => {
    if (!brands || brands.length === 0) return "";

    const carouselId = `brand-carousel-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    let carouselHTML = `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 0.95em; margin-bottom: 8px; color: #666;">Real World Parallels</h4>
        <div id="${carouselId}" class="carousel-container">
    `;

    // Create placeholder items
    brands.forEach((brandName, index) => {
      carouselHTML += `
        <div class="carousel-item" data-brand-index="${index}" style="width: 80px;">
          <div class="item-loading" style="height: 80px; border-radius: 8px;">Loading...</div>
          <div class="item-title">${brandName}</div>
        </div>
      `;
    });

    carouselHTML += `</div></div>`;

    // Store brands array for async loading
    window[`brands_${carouselId}`] = brands;

    // Load images asynchronously after HTML is inserted
    setTimeout(async () => {
      const container = document.getElementById(carouselId);
      const brandsArray = window[`brands_${carouselId}`];
      if (!container || !brandsArray) return;

      for (let i = 0; i < brandsArray.length; i++) {
        const item = container.querySelector(`[data-brand-index="${i}"]`);
        if (!item) continue;

        const brandName = brandsArray[i];
        const logoUrl = await fetchBrandLogo(brandName);

        if (logoUrl) {
          item.innerHTML = `
            <img src="${logoUrl}" alt="${brandName}" style="width: 100%; height: 80px; object-fit: contain; background: white; padding: 8px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);" onerror="this.parentElement.innerHTML='<div class=\\'item-placeholder\\' style=\\'height: 80px; border-radius: 8px;\\'>${brandName}</div><div class=\\'item-title\\'>${brandName}</div>'">
            <div class="item-title">${brandName}</div>
          `;
        } else {
          item.innerHTML = `
            <div class="item-placeholder" style="height: 80px; border-radius: 8px;">${brandName}</div>
            <div class="item-title">${brandName}</div>
          `;
        }
      }

      // Clean up
      delete window[`brands_${carouselId}`];
    }, 100);

    return carouselHTML;
  };

  // Render founder carousel
  const renderFounderCarousel = (founders) => {
    if (!founders || founders.length === 0) return "";

    const carouselId = `founder-carousel-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    let carouselHTML = `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 0.95em; margin-bottom: 8px; color: #666;">Founders Who Exemplify This</h4>
        <div id="${carouselId}" class="carousel-container">
    `;

    // Create placeholder items
    founders.forEach((founderName, index) => {
      carouselHTML += `
        <div class="carousel-item" data-founder-index="${index}" style="width: 150px;">
          <div class="item-loading" style="height: 150px; border-radius: 50%;">Loading...</div>
          <div class="item-title">${founderName}</div>
        </div>
      `;
    });

    carouselHTML += `</div></div>`;

    // Store founders array for async loading
    window[`founders_${carouselId}`] = founders;

    // Load images asynchronously after HTML is inserted
    setTimeout(async () => {
      const container = document.getElementById(carouselId);
      const foundersArray = window[`founders_${carouselId}`];
      if (!container || !foundersArray) return;

      for (let i = 0; i < foundersArray.length; i++) {
        const item = container.querySelector(`[data-founder-index="${i}"]`);
        if (!item) continue;

        const founderName = foundersArray[i];
        const headshotUrl = await fetchFounderHeadshot(founderName);

        if (headshotUrl) {
          item.innerHTML = `
            <img src="${headshotUrl}" alt="${founderName}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 50%; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);" onerror="this.parentElement.innerHTML='<div class=\\'item-placeholder\\' style=\\'height: 150px; border-radius: 50%;\\'>${founderName}</div><div class=\\'item-title\\'>${founderName}</div>'">
            <div class="item-title">${founderName}</div>
          `;
        } else {
          item.innerHTML = `
            <div class="item-placeholder" style="height: 150px; border-radius: 50%;">${founderName}</div>
            <div class="item-title">${founderName}</div>
          `;
        }
      }

      // Clean up
      delete window[`founders_${carouselId}`];
    }, 100);

    return carouselHTML;
  };

  // Render article carousel
  const renderArticleCarousel = (articles) => {
    if (!articles || articles.length === 0) return "";

    const carouselId = `article-carousel-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    let carouselHTML = `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 0.95em; margin-bottom: 8px; color: #666;">Articles</h4>
        <div id="${carouselId}" class="carousel-container">
    `;

    // Create placeholder items
    articles.forEach((articleEntry, index) => {
      const articleInfo = getArticleInfo(articleEntry);
      carouselHTML += `
        <div class="carousel-item" data-article-index="${index}" style="width: 200px;">
          <div class="item-loading" style="height: 150px; border-radius: 6px;">Loading...</div>
          <div class="item-title">${articleInfo.title}</div>
        </div>
      `;
    });

    carouselHTML += `</div></div>`;

    // Store articles array for async loading
    window[`articles_${carouselId}`] = articles;

    // Load images asynchronously after HTML is inserted
    setTimeout(async () => {
      const container = document.getElementById(carouselId);
      const articlesArray = window[`articles_${carouselId}`];
      if (!container || !articlesArray) return;

      for (let i = 0; i < articlesArray.length; i++) {
        const item = container.querySelector(`[data-article-index="${i}"]`);
        if (!item) continue;

        const articleEntry = articlesArray[i];
        const articleInfo = getArticleInfo(articleEntry);
        const ogImageUrl = articleInfo.url
          ? await fetchArticleOGImage(articleInfo.url)
          : null;

        if (ogImageUrl) {
          const linkClass = articleInfo.url ? "article-link" : "";
          const linkAttr = articleInfo.url
            ? `onclick="window.open('${articleInfo.url}', '_blank')"`
            : "";
          item.innerHTML = `
            <div class="${linkClass}" ${linkAttr}>
              <img src="${ogImageUrl}" alt="${articleInfo.title}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 6px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);" onerror="this.parentElement.innerHTML='<div class=\\'item-placeholder\\' style=\\'height: 150px; border-radius: 6px;\\'>${articleInfo.title}</div><div class=\\'item-title\\'>${articleInfo.title}</div>'">
            </div>
            <div class="item-title">${articleInfo.title}</div>
          `;
        } else {
          const linkClass = articleInfo.url ? "article-link" : "";
          const linkAttr = articleInfo.url
            ? `onclick="window.open('${articleInfo.url}', '_blank')"`
            : "";
          item.innerHTML = `
            <div class="${linkClass}" ${linkAttr}>
              <div class="item-placeholder" style="height: 150px; border-radius: 6px;">${articleInfo.title}</div>
            </div>
            <div class="item-title">${articleInfo.title}</div>
          `;
        }
      }

      // Clean up
      delete window[`articles_${carouselId}`];
    }, 100);

    return carouselHTML;
  };

  // Build analogs section (using carousel)
  const analogsHTML =
    archetype.analogs && archetype.analogs.length > 0
      ? `<div class="result-section">
        ${renderBrandCarousel(archetype.analogs)}
      </div>`
      : "";

  // Build founders section (using carousel)
  const foundersHTML =
    archetype.founders && archetype.founders.length > 0
      ? `<div class="result-section">
        ${renderFounderCarousel(archetype.founders)}
      </div>`
      : "";

  // Build media & culture section
  let mediaHTML = "";
  const hasMedia =
    (archetype.media_mentions && archetype.media_mentions.length > 0) ||
    (archetype.movies && archetype.movies.length > 0) ||
    (archetype.books && archetype.books.length > 0) ||
    (archetype.articles && archetype.articles.length > 0) ||
    (archetype.other_sources && archetype.other_sources.length > 0);

  if (hasMedia) {
    mediaHTML = `<div class="result-section">
      <h3>Media & Culture</h3>`;

    if (archetype.media_mentions && archetype.media_mentions.length > 0) {
      mediaHTML += `
        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 0.95em; margin-bottom: 8px; color: #666;">Media Mentions</h4>
          <ul class="team-roster" style="margin-bottom: 0;">
            ${renderArrayField(archetype.media_mentions, true)}
          </ul>
        </div>`;
    }

    if (archetype.movies && archetype.movies.length > 0) {
      mediaHTML += renderMovieCarousel(archetype.movies);
    }

    if (archetype.books && archetype.books.length > 0) {
      mediaHTML += renderBookCarousel(archetype.books);
    }

    if (archetype.articles && archetype.articles.length > 0) {
      mediaHTML += renderArticleCarousel(archetype.articles);
    }

    if (archetype.other_sources && archetype.other_sources.length > 0) {
      mediaHTML += `
        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 0.95em; margin-bottom: 8px; color: #666;">Other Sources</h4>
          <ul class="team-roster" style="margin-bottom: 0;">
            ${renderArrayField(archetype.other_sources)}
          </ul>
        </div>`;
    }

    mediaHTML += `</div>`;
  }

  resultContent.innerHTML = `
        <div class="result-card">
            <p style="margin-bottom: 15px;">Analyzing your DNA path: <strong>${step1Label}</strong> → <strong>${step2Label}</strong> → <strong>${step3Label}</strong>.</p>
            <p style="margin-bottom: 20px; font-style: italic;">${resultDescription}</p>
            
            <div class="result-title">You Built: ${archetype.name}</div>
            <div class="result-path">(Archetype ${path})</div>
            
            ${analogsHTML}
            
            <div class="result-section">
                <h3>Your Concept</h3>
                <p>${archetype.description}</p>
            </div>
            
            <div class="result-section">
                <h3>Your Motto</h3>
                <p><em>"${archetype.motto}"</em></p>
            </div>
            
            <div class="result-section">
                <h3>The Team Roster</h3>
                <ul class="team-roster">
                    ${archetype.teamRoster
                      .map((persona) => `<li>${persona}</li>`)
                      .join("")}
                </ul>
            </div>
            
            ${foundersHTML}
            
            <div class="result-section">
                <div class="superpower">
                    <h3>Your Superpower</h3>
                    <p><strong>${archetype.superpower}</strong></p>
                </div>
            </div>
            
            <div class="result-section">
                <div class="fatal-flaw">
                    <h3>Your Fatal Flaw</h3>
                    <p><strong>${archetype.fatalFlaw}</strong></p>
                </div>
            </div>
            
            ${mediaHTML}
            
            ${statsHTML}
        </div>
    `;
}

// Keyboard event handler
let keyboardHandler = null;

function setupKeyboardListeners(step, keyMap, callback) {
  removeKeyboardListeners();

  keyboardHandler = (e) => {
    const key = e.key.toUpperCase();
    // keyMap is an object mapping displayed keys to internal codes
    // e.g., { 'S': 'A', 'Q': 'B', 'C': 'C' } for step 1
    if (keyMap[key]) {
      callback(keyMap[key]);
    }
  };

  document.addEventListener("keydown", keyboardHandler);
}

function removeKeyboardListeners() {
  if (keyboardHandler) {
    document.removeEventListener("keydown", keyboardHandler);
    keyboardHandler = null;
  }
}

// Restart Game
function restartGame() {
  gameState.currentPhase = "welcome";
  gameState.choices = { step1: null, step2: null, step3: null };

  // Clean up any response buttons
  ["step1-continue-btn", "step2-continue-btn", "step3-continue-btn"].forEach(
    (id) => {
      const btn = document.getElementById(id);
      if (btn) btn.remove();
    }
  );

  ["step1-response", "step2-response", "step3-response"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = "none";
    }
  });

  // Make sure options are visible
  ["step1-options", "step2-options", "step3-options"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = "flex";
    }
  });

  removeKeyboardListeners();
  showPhase("welcome");
}
