const lines = 3;

const threeLines = document.getElementsByClassName("threeLines");
for (let i = 0; i < threeLines.length; i++) {
  const prior = threeLines.onkeydown;
  threeLines[i].onkeydown = function (e) {
    if (prior) {
      const bool = prior(e);
      if (!bool) return false;
    }
    const newLines = threeLines[i].value.split("\n").length;
    if (e.keyCode === 13 && newLines >= lines) {
      threeLines[i].style.color = "red";
      return false;
    } else {
      threeLines[i].style.color = "black";
      return true;
    }
  };
}
