// Statistics tracking - sends results to PHP backend
const STATS_API_URL = "stats.php"; // Update if your PHP file is in a different location

// Cache CSRF token
let csrfToken = null;
let tokenFetchPromise = null;

// Fetch CSRF token
async function fetchCsrfToken() {
  if (csrfToken) {
    return csrfToken;
  }
  
  if (tokenFetchPromise) {
    return tokenFetchPromise;
  }
  
  tokenFetchPromise = fetch(`${STATS_API_URL}?csrf_token=1`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch CSRF token: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      csrfToken = data.csrf_token;
      tokenFetchPromise = null;
      return csrfToken;
    })
    .catch((err) => {
      tokenFetchPromise = null;
      console.error("Failed to fetch CSRF token:", err);
      throw err;
    });
  
  return tokenFetchPromise;
}

async function trackQuizResult(choices, archetype, path) {
  // Validate input client-side as first line of defense
  if (!choices || !choices.step1 || !choices.step2 || !choices.step3) {
    console.error("Invalid choices data");
    return Promise.reject(new Error("Invalid choices data"));
  }
  
  if (!archetype || !archetype.name) {
    console.error("Invalid archetype data");
    return Promise.reject(new Error("Invalid archetype data"));
  }
  
  if (!path || !/^[ABC]-[123]-[XYZ]$/.test(path)) {
    console.error("Invalid path format");
    return Promise.reject(new Error("Invalid path format"));
  }

  // Fetch CSRF token and then submit
  try {
    const token = await fetchCsrfToken();
    const data = {
      save: "1",
      csrf_token: token,
      step1: choices.step1,
      step2: choices.step2,
      step3: choices.step3,
      path: path,
      archetype: archetype.name,
      analog: archetype.analog,
    };

    // Use form-encoded POST
    const formData = new URLSearchParams();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    const response = await fetch(STATS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Handle specific error codes
      if (response.status === 429) {
        console.warn("Rate limit exceeded. Please wait before submitting again.");
        throw new Error("Rate limit exceeded");
      } else if (response.status === 403) {
        console.warn("Security token expired. Retrying...");
        // Reset token and retry once
        csrfToken = null;
        return trackQuizResult(choices, archetype, path);
      } else if (response.status === 409) {
        console.warn("Duplicate submission detected.");
        throw new Error("Duplicate submission");
      } else {
        throw new Error(`HTTP ${response.status}: ${errorData.error || 'Unknown error'}`);
      }
    }

    const result = await response.json();
    if (result && result.success) {
      console.log("Stats saved successfully");
    }
    return result;
  } catch (err) {
    console.error("Failed to track stats:", err);
    throw err;
  }
}

// Fetch statistics from PHP backend
async function getStatistics() {
  try {
    const response = await fetch(STATS_API_URL);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
