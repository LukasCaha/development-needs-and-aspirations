// Statistics tracking - sends results to PHP backend
const STATS_API_URL = "stats.php"; // Update if your PHP file is in a different location

function trackQuizResult(choices, archetype, path) {
  const data = {
    save: "1",
    step1: choices.step1,
    step2: choices.step2,
    step3: choices.step3,
    path: path,
    archetype: archetype.name,
    analog: archetype.analog,
  };

  // Use form-encoded POST instead of JSON (more reliable with dev servers)
  const formData = new URLSearchParams();
  Object.keys(data).forEach((key) => {
    if (data[key]) formData.append(key, data[key]);
  });

  fetch(STATS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(`HTTP ${response.status}: ${text}`);
        });
      }
      return response.json();
    })
    .then((result) => {
      if (result.success) {
        console.log("Stats saved:", result);
        if (result.debug) {
          console.log("Debug info:", result.debug);
        }
      } else if (result.total !== undefined) {
        console.warn("Save not detected, got stats instead:", result);
        console.warn(
          "This means POST data wasn't received. Check server configuration."
        );
      } else {
        console.error("Unexpected response:", result);
      }
    })
    .catch((err) => {
      console.error("Failed to track stats:", err);
    });
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
