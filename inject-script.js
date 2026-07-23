// this script is meant to be injected into the opened html file when the server starts
// it handles reloading the server, switching between stylesheets

const styleInfo = document.createElement('p');
styleInfo.textContent = "original";
Object.assign(styleInfo.style, {
    color: 'white',
    backgroundColor: 'gray',
    fontSize: '20px',
    position: 'fixed',
    top: '20px',
    right: '20px',
    width: 'auto',
    height: 'auto',
    padding: '5px',
    zIndex: '10',
    border: '2px solid black'
});

const thisScript = document.getElementById("inject-script");
thisScript.after(styleInfo);

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        styleInfo.textContent = "copy";
    } else if (event.key === 'ArrowLeft') {
        styleInfo.textContent = "original";
    }
});

window.alert('hi');