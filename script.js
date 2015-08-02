
function main() {
  var board=document.getElementById("board");
  var screen=document.getElementById("screen");
  var transform = mat2d.create();

  var updateTransform = function() {
    board.style.transform = "matrix("+Array.prototype.join.call(transform, ",")+")";
  };

  screen.onmousemove = function(e) {
    if(e.buttons === 1) {
      var translation = mat2d.create();
      mat2d.fromTranslation(translation, vec2.fromValues(e.movementX, e.movementY));
      mat2d.multiply(transform, translation, transform);
      updateTransform();
    }
    e.preventDefault();
  }
  window.onmousedown = function(e) {
    e.preventDefault();
  }
  window.onmousewheel = function(e) {
    var scaleDelta = Math.pow(1.5, e.wheelDelta/120);
    mat2d.scale(transform, transform, vec2.fromValues(scaleDelta, scaleDelta));
    updateTransform();
    e.preventDefault();
  }
}
