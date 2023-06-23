const inputText = document.querySelector("textarea[name='input_text']");
const inputTypeUrl = document.getElementById("input_type_url");
const inputTypeText = document.getElementById("input_type_text");
const summarizeButton = document.querySelector("input[type='submit']");
const outputSummary = document.getElementById("output_summary");
const summaryHeader = document.querySelector(".ioTemplateOutput header");

summaryHeader.style.display = "none";

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

inputText.addEventListener("input", () => {
  hideOutputSummary();
  showSummarizeButton();
  clearError();
});

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

function hideOutputSummary() {
  outputSummary.value = "";
  outputSummary.style.display = "none";
  summaryHeader.style.display = "none";
}

function showSummarizeButton() {
  summarizeButton.style.display = "block";
}

function hideSummarizeButton() {
  summarizeButton.style.display = "none";
}

function showError(errorMessage) {
  const errorElement = document.createElement("p");
  errorElement.classList.add("error");
  errorElement.textContent = errorMessage;
  inputText.insertAdjacentElement("afterend", errorElement);
}

function clearError() {
  const errorElement = document.querySelector(".error");
  if (errorElement) {
    errorElement.remove();
  }
}
