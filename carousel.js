// Lightweight Instagram-style carousel. No dependencies.
// Markup: <div class="carousel"><div class="carousel__track">…slides…</div></div>
// Arrows and dots are generated automatically.
(function () {
  function initCarousel(root) {
    var track = root.querySelector('.carousel__track');
    if (!track) return;
    var slides = Array.prototype.slice.call(track.children);
    if (slides.length <= 1) return; // nothing to swipe

    // --- Build controls ---
    var prev = document.createElement('button');
    prev.className = 'carousel__btn carousel__btn--prev';
    prev.setAttribute('aria-label', 'Previous');
    prev.innerHTML = '‹';

    var next = document.createElement('button');
    next.className = 'carousel__btn carousel__btn--next';
    next.setAttribute('aria-label', 'Next');
    next.innerHTML = '›';

    var dots = document.createElement('div');
    dots.className = 'carousel__dots';
    slides.forEach(function (_, i) {
      var d = document.createElement('button');
      d.className = 'carousel__dot';
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      d.addEventListener('click', function () { go(i); });
      dots.appendChild(d);
    });

    root.appendChild(prev);
    root.appendChild(next);
    root.appendChild(dots);
    var dotEls = Array.prototype.slice.call(dots.children);

    function current() {
      var sl = track.scrollLeft, best = 0, bestDist = Infinity;
      slides.forEach(function (s, i) {
        var d = Math.abs(s.offsetLeft - sl);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    }
    function go(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: slides[i].offsetLeft, behavior: 'smooth' });
    }
    function update() {
      var i = current();
      dotEls.forEach(function (d, j) {
        d.classList.toggle('is-active', j === i);
      });
      prev.disabled = i === 0;
      next.disabled = i === slides.length - 1;
    }

    prev.addEventListener('click', function () { go(current() - 1); });
    next.addEventListener('click', function () { go(current() + 1); });

    var ticking;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    });
    window.addEventListener('resize', function () { go(current()); });

    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.carousel').forEach(initCarousel);
  });
})();
