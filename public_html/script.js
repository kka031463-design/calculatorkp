/* ===== БауМастер — script.js ===== */

document.addEventListener('DOMContentLoaded', function () {

  /* --- Burger Menu --- */
  const burger = document.querySelector('.burger');
  const navMenu = document.querySelector('.nav-menu');
  const catalogItem = document.querySelector('.nav-catalog');

  if (burger && navMenu) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Mobile: toggle mega-menu on tap
  if (catalogItem) {
    const catalogLink = catalogItem.querySelector(':scope > a');
    if (catalogLink) {
      catalogLink.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          catalogItem.classList.toggle('mega-open');
        }
      });
    }
  }

  // Close menu when clicking a link (mobile)
  document.querySelectorAll('.nav-menu a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768 && !link.parentElement.classList.contains('nav-catalog')) {
        if (burger) burger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  /* --- Roof Calculator --- */
  initCalculator('calc-full');
  initCalculator('calc-widget');

  function initCalculator(prefix) {
    var form = document.getElementById(prefix + '-form');
    if (!form) return;

    var angleSlider = form.querySelector('.calc-angle-slider');
    var angleValue = form.querySelector('.calc-angle-value');

    if (angleSlider && angleValue) {
      angleSlider.addEventListener('input', function () {
        angleValue.textContent = this.value + '\u00b0';
      });
    }

    var calcBtn = form.querySelector('.btn-calc');
    if (calcBtn) {
      calcBtn.addEventListener('click', function (e) {
        e.preventDefault();
        calculateRoof(prefix);
      });
    }
  }

  function calculateRoof(prefix) {
    var form = document.getElementById(prefix + '-form');
    if (!form) return;

    var roofType = form.querySelector('[name="roof_type"]').value;
    var length = parseFloat(form.querySelector('[name="length"]').value) || 0;
    var width = parseFloat(form.querySelector('[name="width"]').value) || 0;
    var angle = parseFloat(form.querySelector('[name="angle"]').value) || 30;
    var material = form.querySelector('[name="material"]').value;

    if (length <= 0 || width <= 0) {
      alert('Пожалуйста, введите корректные размеры дома.');
      return;
    }

    // Calculate roof area based on type
    var angleRad = angle * Math.PI / 180;
    var cosAngle = Math.cos(angleRad);
    var roofArea = 0;

    switch (roofType) {
      case 'gable': // двускатная
        // Two rectangular slopes
        roofArea = 2 * (length * (width / 2) / cosAngle);
        break;
      case 'hip': // четырёхскатная (вальмовая)
        // Two trapezoidal + two triangular slopes
        var ridgeLength = length - width;
        if (ridgeLength < 0) ridgeLength = 0;
        roofArea = 2 * ((ridgeLength + length) / 2 * (width / 2) / cosAngle) +
                   2 * (0.5 * width * (width / 2) / cosAngle);
        // Simplified: approximate as rectangle adjusted
        roofArea = length * width / cosAngle;
        break;
      case 'mansard': // мансардная
        // Lower part steeper (60°), upper part at specified angle
        var lowerAngle = 60 * Math.PI / 180;
        var upperHeight = (width / 4); // upper section is half of half-width
        var lowerHeight = (width / 4);
        roofArea = 2 * (length * lowerHeight / Math.cos(lowerAngle)) +
                   2 * (length * upperHeight / cosAngle);
        break;
      case 'shed': // односкатная
        roofArea = length * width / cosAngle;
        break;
      default:
        roofArea = length * width / cosAngle;
    }

    roofArea = Math.round(roofArea * 100) / 100;

    // Material with 10% reserve
    var materialArea = Math.round(roofArea * 1.1 * 100) / 100;

    // Approximate cost per m²
    var pricePerSqm = 0;
    switch (material) {
      case 'bitumen':
        pricePerSqm = 850;
        break;
      case 'ceramic':
        pricePerSqm = 1800;
        break;
      case 'metal':
        pricePerSqm = 650;
        break;
    }

    var totalCost = Math.round(materialArea * pricePerSqm);

    // Display results
    displayResults(prefix, roofArea, materialArea, totalCost);
  }

  function displayResults(prefix, area, materialArea, cost) {
    if (prefix === 'calc-full') {
      // Full page calculator
      var resultsInner = document.querySelector('.calc-results-inner');
      var placeholder = document.querySelector('.calc-placeholder');

      if (placeholder) placeholder.style.display = 'none';
      if (resultsInner) {
        resultsInner.style.display = 'block';
        document.getElementById('result-area').textContent = area.toFixed(1);
        document.getElementById('result-material').textContent = materialArea.toFixed(1);
        document.getElementById('result-cost').textContent = formatNumber(cost);

        // Animate
        setTimeout(function () {
          resultsInner.classList.add('visible');
        }, 50);
      }
    } else {
      // Widget
      var results = document.querySelectorAll('#' + prefix + '-form .calc-mini-result');
      var areaEl = document.getElementById('widget-result-area');
      var matEl = document.getElementById('widget-result-material');
      var costEl = document.getElementById('widget-result-cost');

      if (areaEl) areaEl.textContent = area.toFixed(1) + ' м\u00b2';
      if (matEl) matEl.textContent = materialArea.toFixed(1) + ' м\u00b2';
      if (costEl) costEl.textContent = formatNumber(cost) + ' \u20bd';

      // Show widget results section
      var widgetResults = document.querySelector('.calc-widget-results');
      if (widgetResults) widgetResults.style.display = 'block';

      // Animate cards
      results.forEach(function (card, i) {
        setTimeout(function () {
          card.classList.add('visible');
        }, i * 150);
      });
    }
  }

  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

});
