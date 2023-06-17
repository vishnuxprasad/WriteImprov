const inputText = document.querySelector("textarea[name='input_text']");
const inputTypeUrl = document.getElementById("input_type_url");
const inputTypeText = document.getElementById("input_type_text");
const summarizeButton = document.querySelector("input[type='submit']");
const outputSummary = document.getElementById("output_summary");
const summaryHeader = document.querySelector(".ioTemplateOutput header");

// Hide the summary header initially
summaryHeader.style.display = "none";

// Event listeners for radio button change
inputTypeUrl.addEventListener("change", () => {
  inputText.placeholder = "Enter a valid URL of an article.";
  hideOutputSummary();
  showSummarizeButton();
  clearError();
});

inputTypeText.addEventListener("change", () => {
  inputText.placeholder = "Enter the text/paragraphs to find summary.";
  hideOutputSummary();
  showSummarizeButton();
  clearError();
});

// Event listener for input text change
inputText.addEventListener("input", () => {
  hideOutputSummary();
  showSummarizeButton();
  clearError();
});

// Event listener for form submission
document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const inputType = document.querySelector(
    "input[name='input_type']:checked"
  ).value;
  const inputTextValue = inputText.value.trim();

  if (inputTextValue === "") {
    showError("Error! Input field is empty!");
    hideSummarizeButton();
    return;
  }

  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "Please wait! Summary is being generated.";
  summarizeButton.insertAdjacentElement("afterend", loadingMessage);
  summarizeButton.style.display = "none";

  const response = await fetch("/text-summarization", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input_type: inputType,
      input_text: inputTextValue,
    }),
  });

  const data = await response.json();

  loadingMessage.remove();
  summarizeButton.style.display = "none";
  outputSummary.value = data.summary;
  outputSummary.style.display = "block";
  summaryHeader.style.display = "block";
  outputSummary.scrollIntoView({ behavior: "smooth" });
});

// Function to hide the output summary
function hideOutputSummary() {
  outputSummary.value = "";
  outputSummary.style.display = "none";
  summaryHeader.style.display = "none";
}

// Function to show the summarize button
function showSummarizeButton() {
  summarizeButton.style.display = "block";
}

// Function to hide the summarize button
function hideSummarizeButton() {
  summarizeButton.style.display = "none";
}

// Function to show an error message
function showError(errorMessage) {
  const errorElement = document.createElement("p");
  errorElement.classList.add("error");
  errorElement.textContent = errorMessage;
  inputText.insertAdjacentElement("afterend", errorElement);
}

// Function to clear the error message
function clearError() {
  const errorElement = document.querySelector(".error");
  if (errorElement) {
    errorElement.remove();
  }
}
