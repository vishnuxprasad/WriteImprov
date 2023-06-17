document.getElementById("grammarRadio").addEventListener("change", function () {
  document.getElementById("grammarForm").style.display = "block";
  document.getElementById("replaceForm").style.display = "none";
  document.getElementById("correctedTextTitle").style.display = "none";
  document.getElementById("output_text").style.display = "none";
  document.getElementById("checkGrammarBtn").style.display = "block";
  document.getElementById("error_message").textContent = ""; // Clear error message
});

document.getElementById("replaceRadio").addEventListener("change", function () {
  document.getElementById("replaceForm").style.display = "block";
  document.getElementById("grammarForm").style.display = "none";
  document.getElementById("correctedTextTitle").style.display = "none";
  document.getElementById("output_text").style.display = "none";
  document.getElementById("checkGrammarBtn").style.display = "block";
  document.getElementById("error_message").textContent = ""; // Clear error message
});

document
  .getElementById("grammarForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const inputText = document.getElementById("inputText").value.trim();

    if (inputText === "") {
      document.getElementById("correctedTextTitle").style.display = "none";
      document.getElementById("output_text").style.display = "none";
      document.getElementById("checkGrammarBtn").style.display = "none";
      document.getElementById("error_message").textContent =
        "Error! Input text is empty";
      return;
    }

    const response = await fetch("/grammar-correction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input_text: inputText }),
    });

    const data = await response.json();
    document.getElementById("correctedTextTitle").style.display = "block";
    document.getElementById("output_text").style.display = "block";
    document.getElementById("output_text").value = data.corrected_text;
    document.getElementById("checkGrammarBtn").style.display = "none";
    document.getElementById("error_message").textContent = "";

    // Scroll to view the corrected text
    document
      .getElementById("output_text")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  });

document.getElementById("inputText").addEventListener("input", function () {
  document.getElementById("checkGrammarBtn").style.display = "block";
  document.getElementById("correctedTextTitle").style.display = "none";
  document.getElementById("output_text").style.display = "none";
  document.getElementById("error_message").textContent = "";
});
