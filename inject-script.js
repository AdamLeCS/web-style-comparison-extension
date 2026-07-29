// this script is meant to be injected into the opened html file when the server starts
// it handles reloading the server, switching between stylesheets

// add the box in the top right corner
const styleInfo = document.createElement("p");
styleInfo.textContent = "original";
Object.assign(styleInfo.style, {
  color: "white",
  backgroundColor: "gray",
  fontSize: "20px",
  position: "fixed",
  top: "20px",
  right: "20px",
  width: "auto",
  height: "auto",
  padding: "5px",
  zIndex: "10",
  border: "2px solid black",
});

const thisScript = document.getElementById("inject-script");
thisScript.after(styleInfo);

// get names of original and copy stylesheets
let cssFileNames;
async function createCopies() {
  cssFileNames = await fetch("/create-css-copy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      htmlFilePath: "index.html"
    })
  });
  cssFileNames = await cssFileNames.json();
  window.alert(cssFileNames);
}

createCopies();

// get link element
const linkElement = document.querySelector("link");

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    styleInfo.textContent = "copy";
    linkElement.href = cssFileNames.copy;
  } else if (event.key === "ArrowLeft") {
    styleInfo.textContent = "original";
    linkElement.href = cssFileNames.original;
  }
});