const wrapper = document.querySelector(".wrapper"),
  searchInput = wrapper.querySelector("input"),
  volume = wrapper.querySelector(".word i"),
  infoText = wrapper.querySelector(".info-text"),
  synonyms = wrapper.querySelector(".synonyms .list"),
  removeIcon = wrapper.querySelector(".search span");
let audio;

function data(result, word) {
  if (result.length === 0 || result[0].title === "No Definitions Found") {
    infoText.innerHTML = `Sorry! Can't find the meaning of <span>"${word}"</span>. Try searching for another word.`;
    wrapper.classList.remove("active");
    return;
  }

  wrapper.classList.add("active");

  document.querySelector(".word p").innerText = "";
  document.querySelector(".word span").innerText = "";
  document.querySelector(".meaning span").innerText = "";
  document.querySelector(".example span").innerText = "";
  synonyms.parentElement.style.display = "none";
  synonyms.innerHTML = "";

  for (let i = 0; i < result.length; i++) {
    const meanings = result[i].meanings;

    for (let j = 0; j < meanings.length; j++) {
      const definitions = meanings[j].definitions;

      let foundDefinition = false;

      for (let k = 0; k < definitions.length; k++) {
        const definition = definitions[k];

        const partOfSpeech = meanings[j].partOfSpeech;

        if (!foundDefinition && definition.definition) {
          document.querySelector(".word p").innerText = result[i].word;
          document.querySelector(".word span").innerText = `${partOfSpeech} ${
            result[i].phonetics[0]?.text || ""
          }`;
          document.querySelector(".meaning span").innerText =
            definition.definition;
          document.querySelector(".meaning").style.display = "block";
          foundDefinition = true;
        }

        if (definition.example) {
          document.querySelector(".example span").innerText =
            definition.example;
          document.querySelector(".example").style.display = "block";
          break;
        } else {
          document.querySelector(".example").style.display = "none";
        }
      }

      if (foundDefinition) {
        const synonymsList = meanings[j].definitions
          .flatMap((def) => def.synonyms || [])
          .filter((syn) => syn !== word);

        if (synonymsList.length > 0) {
          synonyms.parentElement.style.display = "block";
          synonyms.innerHTML = "";

          for (let l = 0; l < synonymsList.length; l++) {
            const synonym = synonymsList[l];
            const tag = `<span onclick="search('${synonym}')">${synonym}</span>${
              l !== synonymsList.length - 1 ? "," : ""
            }`;
            synonyms.insertAdjacentHTML("beforeend", tag);
            if (l === 4) break;
          }
        } else {
          synonyms.parentElement.style.display = "none";
        }

        if (result[i].phonetics[0]?.audio) {
          volume.style.display = "inline-block";
          audio = new Audio(result[i].phonetics[0].audio);
        } else {
          volume.style.display = "none";
          audio = null;
        }

        return;
      }
    }
  }
}

function search(word) {
  fetchApi(word);
  searchInput.value = word;
}

function fetchApi(word) {
  word = word.trim();

  if (word === "") {
    infoText.style.color = "#9A9A9A";
    infoText.innerHTML = "Please enter a word and enter search.";
    return;
  }
  wrapper.classList.remove("active");
  infoText.style.color = "#000";
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => data(result, word))
    .catch(() => {
      infoText.innerHTML = `Sorry! Can't find the meaning of <span>"${word}"</span>. Try searching for another word.`;
    });
}

searchInput.addEventListener("keyup", (e) => {
  let word = e.target.value.replace(/\s+/g, " ");
  if (e.key == "Enter" && word) {
    fetchApi(word);
  }
});

volume.addEventListener("click", () => {
  volume.style.color = "#4D59FB";
  audio.play();
  setTimeout(() => {
    volume.style.color = "#999";
  }, 800);
});

removeIcon.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  wrapper.classList.remove("active");
  infoText.style.color = "#9A9A9A";
  infoText.innerHTML =
    "Type any existing word and press enter to get meaning, example, synonyms etc.";
});
