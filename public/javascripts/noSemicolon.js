const noSemicolons = document.getElementsByClassName("noSemicolon");
for (let i = 0; i < noSemicolons.length; i++) {
  const prior = noSemicolons[i].onkeydown;
  noSemicolons[i].onkeydown = function (e) {
    if (prior) {
      const bool = prior(e);
      if (!bool) return false;
    }
    if (e.keyCode === 188) {
      noSemicolons[i].style.color = "red";
      return false;
    } else {
      noSemicolons[i].style.color = "black";
      return true;
    }
  };
}
