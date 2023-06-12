document
  .getElementById("grammarRadio")
  .addEventListener("change", function () {
    document.getElementById("grammarForm").style.display = "block";
    document.getElementById("replaceForm").style.display = "none";
    document.getElementById("correctedTextTitle").style.display = "none";
    document.getElementById("output_text").style.display = "none";
  });

document
  .getElementById("replaceRadio")
  .addEventListener("change", function () {
    document.getElementById("replaceForm").style.display = "block";
    document.getElementById("grammarForm").style.display = "none";
    document.getElementById("correctedTextTitle").style.display = "none";
    document.getElementById("output_text").style.display = "none";
  });

document
  .getElementById("grammarForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const inputText = document.getElementById("inputText").value;

    if (inputText.trim() === "") {
      document.getElementById("correctedTextTitle").style.display =
        "block";
      document.getElementById("output_text").style.display = "block";
      document.getElementById("output_text").value =
        "Error: Input text is empty";
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
  });