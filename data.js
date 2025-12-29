// All 27 Startup Archetypes
const archetypes = {
  "A-1-X": {
    name: "The Algo-Racer",
    analog: "TikTok / OpenAI",
    description:
      "Ship algorithms fast. If it breaks, fix it later. Data rules all.",
    motto: "Ship fast, fix later",
    superpower:
      "You move at the speed of thought, shipping features before competitors even start planning.",
    fatalFlaw:
      "Technical debt accumulates like compound interest, and one day it will collapse.",
    teamRoster: [
      "The Hacker (Speed): Writes code at 3 AM, ships features daily, tests are optional.",
      "The Data Scientist (Logic): Builds recommendation engines that learn faster than humans can code.",
      "The Growth Engineer (Velocity): Optimizes for speed over stability, breaks things to learn faster.",
    ],
  },
  "A-1-Y": {
    name: "The Viral Utility",
    analog: "WhatsApp",
    description:
      "Fast engineering, low cost, massive scale via network effects.",
    motto: "Network effects win",
    superpower:
      "Every user makes your product more valuable. Growth compounds exponentially.",
    fatalFlaw:
      "You might scale so fast that infrastructure breaks, and trust erodes overnight.",
    teamRoster: [
      "The Hacker (Speed): Ships features that enable viral growth, code quality is secondary.",
      "The Community Builder (Trust): Focuses on making connections seamless and trustworthy.",
      "The Scale Engineer (Efficiency): Builds systems that handle millions with minimal cost.",
    ],
  },
  "A-1-Z": {
    name: "The Hype Rocket",
    analog: "Snapchat",
    description:
      "Features are disposable. It's about the cool factor and speed.",
    motto: "Cool factor first",
    superpower:
      "You capture attention and create cultural moments faster than anyone else.",
    fatalFlaw:
      "Trends fade. When the hype dies, you might have no substance to fall back on.",
    teamRoster: [
      "The Hacker (Speed): Ships features that feel magical, even if they break tomorrow.",
      "The Trendsetter (Brand): Understands what's cool before anyone else does.",
      "The Growth Hacker (Velocity): Creates viral loops that spread faster than news.",
    ],
  },
  "A-2-X": {
    name: "The Growth Hacker",
    analog: "Booking.com",
    description: "Design that is ugly but optimized by data to convert fast.",
    motto: "Data beats beauty",
    superpower:
      "You convert users at rates that make beautiful competitors cry. Every pixel is tested.",
    fatalFlaw:
      "You might optimize yourself into a soulless conversion machine that users hate.",
    teamRoster: [
      "The Prototyper (Speed): Sketches fast, tests faster, ships what converts.",
      "The Data Analyst (Logic): Knows exactly which button color increases revenue by 3%.",
      "The Conversion Optimizer (Velocity): A/B tests everything, even the logo.",
    ],
  },
  "A-2-Y": {
    name: "The Social Marketplace",
    analog: "Tinder",
    description: "Fast design iterations, purely focused on connecting people.",
    motto: "Connect people fast",
    superpower:
      "You create connections that change lives. Network effects make you unstoppable.",
    fatalFlaw:
      "You might move so fast that trust and safety become afterthoughts, leading to scandals.",
    teamRoster: [
      "The Prototyper (Speed): Designs interfaces that make connections feel instant.",
      "The Community Architect (Trust): Builds systems that make strangers trust each other.",
      "The Matchmaker (Velocity): Focuses on speed of connection over depth of experience.",
    ],
  },
  "A-2-Z": {
    name: "The Trendsetter",
    analog: "BeReal / Clubhouse",
    description: "Fast design, high vibe, rapid feature turnover.",
    motto: "Trends move fast",
    superpower:
      "You spot trends before they're trends and ship products before competitors notice.",
    fatalFlaw:
      "You might burn through trends so fast that you run out of ideas, or quality suffers.",
    teamRoster: [
      "The Prototyper (Speed): Ships features in days, not months.",
      "The Trend Spotter (Brand): Knows what's cool before influencers do.",
      "The Feature Velocity Engineer (Velocity): Ships new features weekly, polish is secondary.",
    ],
  },
  "A-3-X": {
    name: "The Ruthless Optimiser",
    analog: "Uber (Early)",
    description: "Aggressive ops, data-driven pricing, move fast, ignore laws.",
    motto: "Move fast, break rules",
    superpower:
      "You disrupt industries by moving faster than regulations can catch up.",
    fatalFlaw:
      "You might break so many rules that you face existential legal threats.",
    teamRoster: [
      "The Hustler (Speed): Moves fast, breaks things, asks for forgiveness later.",
      "The Data Scientist (Logic): Optimizes pricing and routes with ruthless efficiency.",
      "The Disruptor (Velocity): Ignores traditional boundaries, focuses on growth at all costs.",
    ],
  },
  "A-3-Y": {
    name: "The Gig-Scale",
    analog: "DoorDash",
    description: "Speed + Logistics + People. It's messy but it works.",
    motto: "Scale through people",
    superpower:
      "You leverage human networks to scale faster than pure tech companies.",
    fatalFlaw:
      "You might scale so fast that you can't maintain quality, and workers revolt.",
    teamRoster: [
      "The Hustler (Speed): Recruits workers faster than competitors can respond.",
      "The Community Builder (Trust): Makes strangers trust each other for deliveries.",
      "The Scale Operator (Velocity): Manages chaos at scale, fixes problems as they arise.",
    ],
  },
  "A-3-Z": {
    name: "The Influencer Brand",
    analog: "WeWork / Juicero",
    description: "All hype, fast sales, zero substance (Warning: High Risk).",
    motto: "Hype over substance",
    superpower:
      "You can sell anything with the right marketing and influencer network.",
    fatalFlaw:
      "When reality doesn't match the hype, everything collapses spectacularly.",
    teamRoster: [
      "The Hustler (Speed): Sells dreams faster than they can be delivered.",
      "The Influencer (Brand): Creates hype that makes people buy before thinking.",
      "The Growth Hacker (Velocity): Focuses on sales over delivery, consequences be damned.",
    ],
  },
  "B-1-X": {
    name: "The Deep Tech",
    analog: "Google (Early)",
    description:
      "Perfect engineering, massive data. Slow to ship, but works forever.",
    motto: "Perfect over fast",
    superpower:
      "Your technology is so robust that competitors can't catch up, even with years of effort.",
    fatalFlaw:
      "You might take so long to ship that faster competitors capture the market first.",
    teamRoster: [
      "The High-Stakes Architect (Stability): Writes bulletproof code that never breaks.",
      "The Data Scientist (Logic): Builds algorithms that work perfectly at massive scale.",
      "The Perfectionist Engineer (Quality): Refuses to ship until every edge case is handled.",
    ],
  },
  "B-1-Y": {
    name: "The Secure Vault",
    analog: "Signal / 1Password",
    description: "Quality code, total trust. No tolerance for bugs.",
    motto: "Trust through perfection",
    superpower:
      "Users trust you with their most sensitive data because you never fail.",
    fatalFlaw:
      "You might move so slowly that you miss market opportunities while perfecting features.",
    teamRoster: [
      "The High-Stakes Architect (Stability): Ensures security is bulletproof, no compromises.",
      "The Guardian (Trust): Builds systems that users trust with their lives.",
      "The Perfectionist Engineer (Quality): Tests every line of code until it's flawless.",
    ],
  },
  "B-1-Z": {
    name: "The Artisan Tool",
    analog: "Linear / Notion",
    description: "Engineering excellence meets aesthetic perfection.",
    motto: "Beauty in code",
    superpower:
      "Your product is so beautiful and well-built that users become evangelists.",
    fatalFlaw:
      "You might spend so long perfecting that competitors ship faster and capture market share.",
    teamRoster: [
      "The High-Stakes Architect (Stability): Writes code that's both powerful and elegant.",
      "The Aesthetic Engineer (Brand): Believes code should be as beautiful as the UI.",
      "The Perfectionist (Quality): Refuses to ship until every detail is perfect.",
    ],
  },
  "B-2-X": {
    name: "The Insight Engine",
    analog: "Spotify",
    description: "Quality design backed by deep data recommendation models.",
    motto: "It just works",
    superpower:
      "Users feel deeply understood. Your recommendations keep them hooked forever.",
    fatalFlaw:
      "You might be so obsessed with data and polish that you miss messy, viral social trends.",
    teamRoster: [
      "The Guardian (Stability): Ensures the music never buffers and the app never crashes.",
      "The Designer (Experience): Ensures the Play button is exactly where your thumb expects it.",
      "The Data Scientist (Logic): Built the Discover Weekly algorithm that keeps users subscribed forever.",
    ],
  },
  "B-2-Y": {
    name: "The Trust Platform",
    analog: "Airbnb",
    description: "Design builds trust between strangers. Quality is safety.",
    motto: "Trust through design",
    superpower:
      "You enable transactions between strangers that would be impossible without your platform.",
    fatalFlaw:
      "You might focus so much on perfect design that you miss operational issues that erode trust.",
    teamRoster: [
      "The Guardian (Stability): Ensures the platform never fails when trust is on the line.",
      "The Empathetic Artisan (Experience): Designs experiences that make strangers trust each other.",
      "The Trust Builder (Community): Creates systems that verify and protect users.",
    ],
  },
  "B-2-Z": {
    name: "The Luxury Brand",
    analog: "Apple",
    description: "Perfection in design and brand. High cost, high quality.",
    motto: "Perfection is standard",
    superpower:
      "Your brand commands premium prices because every detail is perfect.",
    fatalFlaw:
      "You might price yourself out of the market or move too slowly for fast-moving trends.",
    teamRoster: [
      "The Guardian (Stability): Ensures products work flawlessly, no exceptions.",
      "The Empathetic Artisan (Experience): Obsesses over every pixel until it's perfect.",
      "The Status Architect (Brand): Creates products that define what's desirable.",
    ],
  },
  "B-3-X": {
    name: "The Precision Logist",
    analog: "Amazon",
    description: 'Quality ops, data-driven. "The Everything Store."',
    motto: "Everything, perfectly",
    superpower:
      "You can deliver anything, anywhere, with precision that competitors can't match.",
    fatalFlaw:
      "You might become so focused on operational perfection that you lose human touch.",
    teamRoster: [
      "The Guardian (Stability): Ensures systems never fail, even at massive scale.",
      "The White-Glove Operator (Service): Delivers perfect service consistently.",
      "The Data Optimizer (Logic): Uses data to optimize every aspect of operations.",
    ],
  },
  "B-3-Y": {
    name: "The Service Standard",
    analog: "Zendesk / Intercom",
    description:
      "Operations focused on high-touch, high-quality customer support.",
    motto: "Service is everything",
    superpower:
      "Your service is so exceptional that customers become loyal for life.",
    fatalFlaw:
      "You might focus so much on service quality that you can't scale efficiently.",
    teamRoster: [
      "The Guardian (Stability): Ensures service never fails, even under pressure.",
      "The White-Glove Operator (Service): Delivers legendary support that customers remember.",
      "The Relationship Builder (Trust): Creates connections that last decades.",
    ],
  },
  "B-3-Z": {
    name: "The Exclusive Club",
    analog: "Clubhouse (Early) / Product Hunt",
    description: "Quality operations, high brand status, very exclusive.",
    motto: "Exclusivity is value",
    superpower:
      "Your exclusivity creates desire. People want what they can't have.",
    fatalFlaw:
      "You might become so exclusive that you limit growth, or lose relevance.",
    teamRoster: [
      "The Guardian (Stability): Ensures the experience is consistently perfect.",
      "The White-Glove Operator (Service): Delivers premium service that justifies exclusivity.",
      "The Gatekeeper (Brand): Controls access to maintain status and desirability.",
    ],
  },
  "C-1-X": {
    name: "The Indie Hacker",
    analog: "Stripe (Early) / Gumroad",
    description: "One person, low cost, automated data scripts.",
    motto: "Automate everything",
    superpower:
      "You can build and run a profitable business with minimal resources.",
    fatalFlaw:
      "You might stay too small to matter, or burn out trying to do everything alone.",
    teamRoster: [
      "The Pragmatist (Efficiency): Uses tools and libraries, never builds from scratch.",
      "The Solo Builder (Logic): Automates everything with scripts and data.",
      "The Bootstrap Engineer (Cost): Builds profitable products with zero budget.",
    ],
  },
  "C-1-Y": {
    name: "The Open Source",
    analog: "Linux / Wikipedia",
    description: "No money, pure engineering, community built.",
    motto: "Community builds",
    superpower:
      "You leverage community to build something no company could afford to build.",
    fatalFlaw:
      "You might struggle to monetize, or lose control as the community grows.",
    teamRoster: [
      "The Pragmatist (Efficiency): Uses open source tools and contributes back.",
      "The Community Builder (Trust): Inspires volunteers to contribute their best work.",
      "The Idealist Engineer (Cost): Believes great software should be free and open.",
    ],
  },
  "C-1-Z": {
    name: "The Vaporware",
    analog: "Theranos",
    description: "Low cost (fake tech), high brand claim. (Failure Mode).",
    motto: "Fake it till...",
    superpower:
      "You can raise money and generate hype with minimal actual product.",
    fatalFlaw:
      "When reality catches up, everything collapses. This is a warning, not a strategy.",
    teamRoster: [
      "The Pragmatist (Efficiency): Uses smoke and mirrors instead of real tech.",
      "The Hype Builder (Brand): Creates compelling narratives without substance.",
      "The Fake Engineer (Cost): Promises the impossible, delivers nothing.",
    ],
  },
  "C-2-X": {
    name: "The Template King",
    analog: "Canva / Wix",
    description: "Cheap to make, data-driven design tools for masses.",
    motto: "Templates for all",
    superpower:
      "You democratize design, making professional tools accessible to everyone.",
    fatalFlaw:
      "You might become so focused on templates that you limit creativity and innovation.",
    teamRoster: [
      "The Minimalist (Efficiency): Uses standard UI kits, believes boring is profitable.",
      "The Template Builder (Logic): Creates tools that make design accessible through data.",
      "The Mass Market Designer (Cost): Focuses on volume over customization.",
    ],
  },
  "C-2-Y": {
    name: "The Community Forum",
    analog: "Reddit / Discord",
    description: "Ugly design, low cost, massive human connection.",
    motto: "Function over form",
    superpower:
      "You create communities that become essential to people's lives, despite the design.",
    fatalFlaw:
      "You might stay ugly for so long that better-designed competitors steal your users.",
    teamRoster: [
      "The Minimalist (Efficiency): Uses basic design, focuses on functionality.",
      "The Community Architect (Trust): Builds spaces where people form real connections.",
      "The Bootstrap Designer (Cost): Creates value through community, not expensive design.",
    ],
  },
  "C-2-Z": {
    name: "The Bootstrap Brand",
    analog: "Mailchimp / Basecamp",
    description: "Simple design, high vibe, low cost to produce.",
    motto: "Vibe over budget",
    superpower:
      "You create products with personality that people love, without expensive production.",
    fatalFlaw:
      "You might stay too small or struggle to scale beyond your initial audience.",
    teamRoster: [
      "The Minimalist (Efficiency): Creates simple designs that punch above their weight.",
      "The Vibe Creator (Brand): Understands what makes products feel authentic.",
      "The Bootstrap Builder (Cost): Builds brands on personality, not budget.",
    ],
  },
  "C-3-X": {
    name: "The Arbitrageur",
    analog: "eBay / Amazon Marketplace",
    description: "Low cost, ops heavy, data-driven margins.",
    motto: "Margin is king",
    superpower:
      "You can find and exploit inefficiencies that others miss, with minimal capital.",
    fatalFlaw:
      "You might become too dependent on arbitrage opportunities that eventually disappear.",
    teamRoster: [
      "The Pragmatist (Efficiency): Finds ways to make money with minimal investment.",
      "The Data Optimizer (Logic): Uses data to find profitable opportunities.",
      "The Hustler Operator (Cost): Manages operations that maximize margins.",
    ],
  },
  "C-3-Y": {
    name: "The Public Utility",
    analog: "Craigslist",
    description: "Ugly, free, community-run, zero innovation, infinite value.",
    motto: "Simple and free",
    superpower:
      "You provide so much value that you become essential, even without innovation.",
    fatalFlaw:
      "You might become so complacent that better-designed competitors eventually replace you.",
    teamRoster: [
      "The Pragmatist (Efficiency): Keeps things simple and free, no frills.",
      "The Community Steward (Trust): Maintains a platform that serves the community.",
      "The Minimalist Operator (Cost): Runs operations with near-zero cost.",
    ],
  },
  "C-3-Z": {
    name: "The Guerilla Marketer",
    analog: "Duolingo / Grammarly",
    description: "Commodity product, low cost ops, 100% brand/marketing.",
    motto: "Brand is product",
    superpower:
      "You can turn a commodity into a cult brand through pure marketing genius.",
    fatalFlaw:
      "You might become so dependent on marketing that you can't sustain growth when trends shift.",
    teamRoster: [
      "The Pragmatist (Efficiency): Uses commodity products, focuses on margins.",
      "The Brand Hustler (Brand): Creates marketing that makes commodities feel special.",
      "The Guerilla Operator (Cost): Runs lean operations, spends on marketing.",
    ],
  },
};

// Step 1 Options (Static)
const step1Options = {
  A: {
    label: "Speed",
    shortLabel: "S",
    title: "Speed",
    subtitle: "Velocity",
    description: "If we are not first, we are dead. Ship it now, fix it later.",
  },
  B: {
    label: "Quality",
    shortLabel: "Q",
    title: "Quality",
    subtitle: "Stability",
    description:
      "If it is not perfect, it does not exist. We do not ship bugs.",
  },
  C: {
    label: "Cost",
    shortLabel: "C",
    title: "Cost",
    subtitle: "Efficiency",
    description:
      "We must survive. Do not spend a dollar unless it returns two.",
  },
};

// Step 1 Prompt
const step1Prompt =
  "In the heat of a launch, when everything is breaking, what is the ONE thing you refuse to compromise on?";

// Step 1 Responses
const step1Responses = {
  A: "Understood. You have chosen speed. You move fast, break things, and fix them later. Your team ships features daily, and competitors can't keep up.\n\n_Current Team DNA: The Speed Demon._",
  B: "Understood. You have chosen the hard path. You are not building a toy; you are building a monument. Your team will sleep less, but they will be proud of every pixel.\n\n_Current Team DNA: The Perfectionist._",
  C: "Understood. You have chosen survival. Every dollar counts, every resource is precious. You will do more with less, and that constraint will make you stronger.\n\n_Current Team DNA: The Scrapper._",
};

// Step 2 Options (Dynamic based on Step 1)
function getStep2Options(step1Choice) {
  const options = {
    1: { label: "Engineering", shortLabel: "E" },
    2: { label: "Design", shortLabel: "D" },
    3: { label: "Operations", shortLabel: "O" },
  };

  if (step1Choice === "A") {
    // Speed/Velocity flavored
    options["1"] = {
      ...options["1"],
      title: "The Hacker",
      subtitle: "Engineering-Led",
      vibe: "Writes code at 3 AM. Does not write tests. Ships features daily.",
      focus: "Speed, features, and breaking things to learn faster.",
    };
    options["2"] = {
      ...options["2"],
      title: "The Prototyper",
      subtitle: "Design-Led",
      vibe: 'Sketches on napkins. Cares about "Wow" factor, not consistency.',
      focus: "Fast iterations, viral moments, and rapid experimentation.",
    };
    options["3"] = {
      ...options["3"],
      title: "The Hustler",
      subtitle: "Operations-Led",
      vibe: "Moves fast, breaks things, asks for forgiveness later.",
      focus: "Speed, scale, and aggressive growth at all costs.",
    };
  } else if (step1Choice === "B") {
    // Quality/Stability flavored
    options["1"] = {
      ...options["1"],
      title: "The High-Stakes Architect",
      subtitle: "Engineering-Led",
      vibe: "The code must be bulletproof.",
      focus: "Uptime, security, and zero latency.",
    };
    options["2"] = {
      ...options["2"],
      title: "The Empathetic Artisan",
      subtitle: "Design-Led",
      vibe: "The experience must be seamless.",
      focus: "Intuition, flow, and user delight.",
    };
    options["3"] = {
      ...options["3"],
      title: "The White-Glove Operator",
      subtitle: "Operations-Led",
      vibe: "The service must be legendary.",
      focus: "Customer support and premium handling.",
    };
  } else if (step1Choice === "C") {
    // Efficiency/Cost flavored
    options["1"] = {
      ...options["1"],
      title: "The Pragmatist",
      subtitle: "Engineering-Led",
      vibe: 'Uses "No-Code" tools and pre-made libraries. Never builds from scratch.',
      focus: "Efficiency, cost, and leveraging existing solutions.",
    };
    options["2"] = {
      ...options["2"],
      title: "The Minimalist",
      subtitle: "Design-Led",
      vibe: 'Uses standard UI kits. Believes "Boring is profitable".',
      focus: "Simplicity, cost-effectiveness, and functional design.",
    };
    options["3"] = {
      ...options["3"],
      title: "The Bootstrap Operator",
      subtitle: "Operations-Led",
      vibe: "Does more with less. Every dollar counts.",
      focus: "Efficiency, margins, and lean operations.",
    };
  }

  return options;
}

// Step 2 Prompts (Dynamic)
function getStep2Prompt(step1Choice) {
  if (step1Choice === "A") {
    return "You value speed above all. To move this fast, who sits in the captain's chair? Who has the final veto on what gets shipped?";
  } else if (step1Choice === "B") {
    return "You value perfection above all. To achieve this excellence, who sits in the captain's chair? Who has the final veto on the product roadmap?";
  } else if (step1Choice === "C") {
    return "You value efficiency above all. To survive with minimal resources, who leads the execution? Who decides what gets built?";
  }
}

// Step 2 Responses (Dynamic)
function getStep2Response(step1Choice, step2Choice) {
  const step1Label =
    step1Choice === "A" ? "Speed" : step1Choice === "B" ? "Quality" : "Cost";
  const step2Label =
    step2Choice === "1"
      ? "Engineering"
      : step2Choice === "2"
      ? "Design"
      : "Operations";

  if (step1Choice === "A" && step2Choice === "2") {
    return 'A fascinating choice. You move fast, but you lead with design and emotion. You are building a "Viral Machine"—beautiful, fast, and addictive.\n\n_Current Team DNA: The Speed Demon + The Prototyper._';
  } else if (step1Choice === "B" && step2Choice === "2") {
    return 'A fascinating choice. You demand high stability, but you are leading with emotion and design. You are building a "Walled Garden"—beautiful, safe, and controlled.\n\n_Current Team DNA: The Perfectionist + The Artisan._';
  } else if (step1Choice === "C" && step2Choice === "2") {
    return 'A smart choice. You value efficiency, but you understand that design matters. You are building a "Bootstrap Beauty"—simple, effective, and affordable.\n\n_Current Team DNA: The Scrapper + The Minimalist._';
  } else {
    return `Interesting. You've chosen ${step1Label} as your foundation, and ${step2Label} as your driver. This combination will shape everything.\n\n_Current Team DNA: The ${
      step1Choice === "A"
        ? "Speed Demon"
        : step1Choice === "B"
        ? "Perfectionist"
        : "Scrapper"
    } + The ${
      step2Choice === "1"
        ? "Engineer"
        : step2Choice === "2"
        ? "Designer"
        : "Operator"
    }._`;
  }
}

// Step 3 Options (Dynamic based on Step 1 + Step 2)
function getStep3Options(step1Choice, step2Choice) {
  const options = {
    X: { label: "Data & Logic", shortLabel: "D" },
    Y: { label: "Community & Trust", shortLabel: "C" },
    Z: { label: "Brand & Vibe", shortLabel: "B" },
  };

  const path = step1Choice + "-" + step2Choice;

  // Generate dynamic descriptions based on the path
  if (path === "A-1") {
    // Speed + Engineering
    options["X"] = {
      ...options["X"],
      title: "The Algorithm",
      subtitle: "Data & Logic",
      pitch: "Ship algorithms that learn faster than competitors can code.",
      mechanism: "AI and data pipelines that optimize themselves.",
    };
    options["Y"] = {
      ...options["Y"],
      title: "The Network",
      subtitle: "Community & Trust",
      pitch: "Build products that get better with every user.",
      mechanism: "Viral loops and network effects that compound.",
    };
    options["Z"] = {
      ...options["Z"],
      title: "The Hype",
      subtitle: "Brand & Vibe",
      pitch: "Create moments that everyone talks about.",
      mechanism: "Features that feel magical, even if they break tomorrow.",
    };
  } else if (path === "A-2") {
    // Speed + Design
    options["X"] = {
      ...options["X"],
      title: "The Conversion Engine",
      subtitle: "Data & Logic",
      pitch: "Design that converts, tested by data.",
      mechanism: "A/B testing every pixel until conversion is perfect.",
    };
    options["Y"] = {
      ...options["Y"],
      title: "The Social Connector",
      subtitle: "Community & Trust",
      pitch: "Fast design that connects people instantly.",
      mechanism: "Interfaces that make connections feel effortless.",
    };
    options["Z"] = {
      ...options["Z"],
      title: "The Trend Machine",
      subtitle: "Brand & Vibe",
      pitch: "Design that defines what's cool.",
      mechanism: "Fast iterations that capture cultural moments.",
    };
  } else if (path === "A-3") {
    // Speed + Operations
    options["X"] = {
      ...options["X"],
      title: "The Optimizer",
      subtitle: "Data & Logic",
      pitch: "Data-driven operations that move faster than regulations.",
      mechanism: "Algorithms that optimize pricing, routes, and margins.",
    };
    options["Y"] = {
      ...options["Y"],
      title: "The Gig Network",
      subtitle: "Community & Trust",
      pitch: "Scale through people, fast.",
      mechanism: "Human networks that enable rapid growth.",
    };
    options["Z"] = {
      ...options["Z"],
      title: "The Hype Machine",
      subtitle: "Brand & Vibe",
      pitch: "Operations that create hype and demand.",
      mechanism: "Marketing and logistics that generate buzz.",
    };
  } else if (path === "B-1") {
    // Quality + Engineering
    options["X"] = {
      ...options["X"],
      title: "The Deep Algorithm",
      subtitle: "Data & Logic",
      pitch: "Perfect algorithms that work forever.",
      mechanism: "Data systems built to last decades.",
    };
    options["Y"] = {
      ...options["Y"],
      title: "The Secure Foundation",
      subtitle: "Community & Trust",
      pitch: "Code so secure, users trust you with their lives.",
      mechanism: "Security and reliability that builds absolute trust.",
    };
    options["Z"] = {
      ...options["Z"],
      title: "The Artisan Code",
      subtitle: "Brand & Vibe",
      pitch: "Code that's as beautiful as the product.",
      mechanism: "Engineering excellence that becomes a brand.",
    };
  } else if (path === "B-2") {
    // Quality + Design
    options["X"] = {
      ...options["X"],
      title: "The Predictive Brain",
      subtitle: "Data & Logic",
      pitch: "We know what the user wants before they do.",
      mechanism:
        "Algorithms that learn from user taste to serve perfect content.",
    };
    options["Y"] = {
      ...options["Y"],
      title: "The Circle of Trust",
      subtitle: "Community & Trust",
      pitch: "We verify everyone.",
      mechanism: "Exclusive access and peer-to-peer reputation.",
    };
    options["Z"] = {
      ...options["Z"],
      title: "The Status Symbol",
      subtitle: "Brand & Vibe",
      pitch: "We are the cool kids' table.",
      mechanism: "High prices, exclusivity, and aesthetics.",
    };
  } else if (path === "B-3") {
    // Quality + Operations
    options["X"] = {
      ...options["X"],
      title: "The Precision System",
      subtitle: "Data & Logic",
      pitch: "Operations so precise, they feel like magic.",
      mechanism: "Data-driven logistics that never fail.",
    };
    options["Y"] = {
      ...options["Y"],
      title: "The Service Standard",
      subtitle: "Community & Trust",
      pitch: "Service so good, customers become evangelists.",
      mechanism: "High-touch operations that build lifelong loyalty.",
    };
    options["Z"] = {
      ...options["Z"],
      title: "The Exclusive Experience",
      subtitle: "Brand & Vibe",
      pitch: "Operations that create exclusivity and desire.",
      mechanism: "Premium service that justifies high status.",
    };
  } else if (path === "C-1") {
    // Cost + Engineering
    options["X"] = {
      ...options["X"],
      title: "The Automation Script",
      subtitle: "Data & Logic",
      pitch: "Automate everything with scripts and data.",
      mechanism: "Low-cost automation that scales without people.",
    };
    options["Y"] = {
      ...options["Y"],
      title: "The Open Community",
      subtitle: "Community & Trust",
      pitch: "Build with the community, for free.",
      mechanism: "Open source and community contributions.",
    };
    options["Z"] = {
      ...options["Z"],
      title: "The Fake Tech",
      subtitle: "Brand & Vibe",
      pitch: "Hype without substance (Warning: High Risk).",
      mechanism: "Marketing that promises more than you deliver.",
    };
  } else if (path === "C-2") {
    // Cost + Design
    options["X"] = {
      ...options["X"],
      title: "The Template Engine",
      subtitle: "Data & Logic",
      pitch: "Templates and tools that make design accessible.",
      mechanism: "Data-driven design tools for the masses.",
    };
    options["Y"] = {
      ...options["Y"],
      title: "The Community Space",
      subtitle: "Community & Trust",
      pitch: "Ugly design, but people love it.",
      mechanism: "Function over form, community over polish.",
    };
    options["Z"] = {
      ...options["Z"],
      title: "The Bootstrap Vibe",
      subtitle: "Brand & Vibe",
      pitch: "Simple design with big personality.",
      mechanism: "Authentic brand built on personality, not budget.",
    };
  } else if (path === "C-3") {
    // Cost + Operations
    options["X"] = {
      ...options["X"],
      title: "The Margin Optimizer",
      subtitle: "Data & Logic",
      pitch: "Find profitable opportunities with data.",
      mechanism: "Data-driven arbitrage and margin optimization.",
    };
    options["Y"] = {
      ...options["Y"],
      title: "The Public Utility",
      subtitle: "Community & Trust",
      pitch: "Free, simple, and essential.",
      mechanism: "Community-run operations with zero cost.",
    };
    options["Z"] = {
      ...options["Z"],
      title: "The Guerilla Brand",
      subtitle: "Brand & Vibe",
      pitch: "Turn commodities into cult brands.",
      mechanism: "Marketing genius that makes simple products feel special.",
    };
  }

  return options;
}

// Step 3 Prompts (Dynamic)
function getStep3Prompt(step1Choice, step2Choice) {
  const step1Label =
    step1Choice === "A" ? "Speed" : step1Choice === "B" ? "Quality" : "Cost";
  const step2Label =
    step2Choice === "1"
      ? "Engineering"
      : step2Choice === "2"
      ? "Design"
      : "Operations";

  if (step1Choice === "B" && step2Choice === "2") {
    return "You have a beautiful, stable product. But beauty alone does not scale. What is the hidden engine that makes this product addictive?";
  } else if (step1Choice === "A") {
    return `You move fast with ${step2Label.toLowerCase()} leading the way. But speed alone doesn't win. What is your secret weapon? What makes users choose you over competitors?`;
  } else if (step1Choice === "B") {
    return `You've built something perfect with ${step2Label.toLowerCase()} at the helm. But perfection alone doesn't scale. What is the hidden engine that makes this product unstoppable?`;
  } else {
    return `You've chosen ${step1Label.toLowerCase()} and ${step2Label.toLowerCase()}. But constraints alone don't create value. What is your secret sauce? What makes this product win?`;
  }
}

// Step 3 Responses (Dynamic)
function getStep3Response(step1Choice, step2Choice, step3Choice) {
  const step1Label =
    step1Choice === "A" ? "Speed" : step1Choice === "B" ? "Quality" : "Cost";
  const step2Label =
    step2Choice === "1"
      ? "Engineering"
      : step2Choice === "2"
      ? "Design"
      : "Operations";
  const step3Label =
    step3Choice === "X"
      ? "Data & Logic"
      : step3Choice === "Y"
      ? "Community & Trust"
      : "Brand & Vibe";

  return `Perfect. You've chosen ${step1Label} → ${step2Label} → ${step3Label}. Your startup DNA is complete.\n\n_Calculating your archetype..._`;
}
