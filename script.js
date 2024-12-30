function analyzePassword() {
    const password = document.getElementById("password").value;
    const strengthMessage = document.getElementById("strengthMessage");
    const radialMeter = document.getElementById("radialMeter");
    const crackTime = document.getElementById("crackTime");
    const suggestionsList = document.getElementById("suggestionsList");
    const strengthBar = document.getElementById("strengthBar");
  
    const charTypes = [
      /[a-z]/.test(password), 
      /[A-Z]/.test(password), 
      /[0-9]/.test(password), 
      /[^a-zA-Z0-9]/.test(password)
    ];
    const charDiversity = charTypes.filter(Boolean).length;
    const length = password.length;
    const entropy = length * (Math.log2(26 * charDiversity) || 0);
  
    const timeToCrackInSeconds = Math.pow(2, entropy) / 1e9; // 1 billion guesses/sec
    const feedback = [
      { text: "Very Weak", color: "#d32f2f" },
      { text: "Weak", color: "#fbc02d" },
      { text: "Moderate", color: "#ffeb3b" },
      { text: "Strong", color: "#4caf50" },
      { text: "Very Strong", color: "#388e3c" }
    ];
    const scoreIndex = Math.min(Math.floor(entropy / 20), feedback.length - 1);
  
    // Update UI elements
    strengthMessage.textContent = feedback[scoreIndex].text;
    radialMeter.style.background = feedback[scoreIndex].color;
    strengthBar.style.width = `${(scoreIndex + 1) * 20}%`;
    strengthBar.style.background = feedback[scoreIndex].color;
    document.getElementById("strengthScore").textContent = `${Math.round((scoreIndex + 1) * 20)}%`;
  
    // Time to crack
    crackTime.textContent =
      timeToCrackInSeconds > 1e6
        ? `~${(timeToCrackInSeconds / 1e6).toFixed(2)} million years`
        : timeToCrackInSeconds > 60
        ? `~${Math.round(timeToCrackInSeconds / 60)} minutes`
        : `${Math.round(timeToCrackInSeconds)} seconds`;
  
    // Suggestions
    const suggestions = [];
    if (length < 12) suggestions.push("Use at least 12 characters.");
    if (charDiversity < 3) suggestions.push("Add uppercase, numbers, or symbols.");
    suggestionsList.innerHTML = suggestions.map((s) => `<li>${s}</li>`).join("");
  
    // Character Diversity
    const charTypesUsed = document.getElementById("charTypesUsed");
    const charTypesText = [
      charTypes[0] ? "Lowercase" : "",
      charTypes[1] ? "Uppercase" : "",
      charTypes[2] ? "Numbers" : "",
      charTypes[3] ? "Symbols" : ""
    ].filter(Boolean).join(", ");
    charTypesUsed.textContent = charTypesText || "None";
  }
  
  function generatePassword() {
    const length = parseInt(document.getElementById("passwordLength").value, 10);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    document.getElementById("generatedPassword").value = password;
  }
  
  async function checkBreach() {
    const password = document.getElementById("password").value;
    const breachStatus = document.getElementById("breachStatus");
  
    const hashedPassword = await sha1(password); // Convert to SHA1
    const response = await fetch(`https://api.pwnedpasswords.com/range/${hashedPassword.substring(0, 5)}`);
    const data = await response.text();
  
    const suffix = hashedPassword.substring(5).toUpperCase();
    const isBreached = data.includes(suffix);
    breachStatus.textContent = isBreached ? "Password found in data breaches!" : "No breaches found for this password.";
  }
  
  function sha1(str) {
    return crypto.subtle.digest("SHA-1", new TextEncoder().encode(str))
      .then(hash => Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0")).join(""));
  }
  
  function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  }
  
  function copyToClipboard() {
    const generatedPassword = document.getElementById("generatedPassword").value;
    navigator.clipboard.writeText(generatedPassword).then(() => {
      alert("Password copied to clipboard!");
    });
  }
  