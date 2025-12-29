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

// Calculate Result
function calculateResult() {
  const path = `${gameState.choices.step1}-${gameState.choices.step2}-${gameState.choices.step3}`;
  const archetype = archetypes[path];

  if (!archetype) {
    console.error("Archetype not found for path:", path);
    return;
  }

  renderResult(archetype, path);
}

// Render Result
function renderResult(archetype, path) {
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

  resultContent.innerHTML = `
        <div class="result-card">
            <p style="margin-bottom: 15px;">Analyzing your DNA path: <strong>${step1Label}</strong> → <strong>${step2Label}</strong> → <strong>${step3Label}</strong>.</p>
            <p style="margin-bottom: 20px; font-style: italic;">${resultDescription}</p>
            
            <div class="result-title">You Built: ${archetype.name}</div>
            <div class="result-path">(Archetype ${path})</div>
            
            <div class="result-section">
                <h3>Real World Parallel</h3>
                <p><strong>${archetype.analog}</strong></p>
            </div>
            
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
