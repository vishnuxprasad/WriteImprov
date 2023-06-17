document
  .querySelector("form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const inputType = document.querySelector(
      "input[name='input_type']:checked"
    ).value;
    const inputText = document.querySelector(
      "textarea[name='input_text']"
    ).value;

    const response = await fetch("/text-summarization", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input_type: inputType,
        input_text: inputText,
      }),
    });

    const data = await response.json();
    document.getElementById("output_summary").value = data.summary;
  });
