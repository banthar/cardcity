
function main() {
  var board=document.getElementById("board");
  board.onmousemove = function(e) {
    if(e.buttons === 1) {
      window.scrollBy(-e.movementX, -e.movementY);
    }
    e.preventDefault();
  }
  board.onmousedown = function(e) {
    e.preventDefault();
  }
  board.onmousewheel = function(e) {
    console.log(e);
    e.preventDefault();
  }
}
