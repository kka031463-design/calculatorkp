<!-- Hero Section -->
<section class="hero">
    <div class="hero-content">
        <h1>Кровельные материалы европейского качества</h1>
        <p>Более 20 лет поставляем лучшие кровельные материалы от ведущих европейских производителей в Санкт-Петербурге</p>
        <a href="index.php?action=catalog" class="btn btn-primary">Смотреть каталог</a>
        <a href="index.php?action=calc" class="btn btn-outline" style="margin-left:12px">Рассчитать кровлю</a>
    </div>
</section>

<!-- Advantages -->
<section class="advantages">
    <div class="container">
        <h2>Почему выбирают нас</h2>
        <div class="advantages-grid">
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
                <h4>Европейское качество</h4>
                <p>Сертифицированная продукция от ведущих производителей Германии, Италии, Финляндии и Австрии</p>
            </div>
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>
                </div>
                <h4>Профессиональный монтаж</h4>
                <p>Опытные специалисты с многолетним стажем обеспечат качественный монтаж любой сложности</p>
            </div>
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                </div>
                <h4>Гарантия</h4>
                <p>Официальная гарантия от производителей на все виды кровельных материалов</p>
            </div>
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
                </div>
                <h4>Консультация бесплатно</h4>
                <p>Поможем подобрать оптимальное решение для вашего проекта и рассчитаем стоимость</p>
            </div>
        </div>
    </div>
</section>

<!-- Brands -->
<section class="brands-section">
    <div class="container">
        <h2>Популярные бренды</h2>
        <div class="brands-grid">
            <a href="index.php?action=catalog&amp;prod=tegola" class="brand-card">
                <div class="brand-type">Битумная черепица</div>
                <h4>Tegola</h4>
                <p>Италия-Россия</p>
            </a>
            <a href="index.php?action=catalog&amp;prod=braas" class="brand-card">
                <div class="brand-type">Керамическая черепица</div>
                <h4>BRAAS</h4>
                <p>Германия-Россия</p>
            </a>
            <a href="index.php?action=catalog&amp;prod=saimaa" class="brand-card">
                <div class="brand-type">Металлочерепица</div>
                <h4>Saimaa</h4>
                <p>Финляндия</p>
            </a>
            <a href="index.php?action=catalog&amp;prod=rockwool" class="brand-card">
                <div class="brand-type">Теплоизоляция</div>
                <h4>Rockwool</h4>
                <p>Дания</p>
            </a>
            <a href="index.php?action=catalog&amp;prod=dorken" class="brand-card">
                <div class="brand-type">Кровельные плёнки</div>
                <h4>DORKEN</h4>
                <p>Германия</p>
            </a>
            <a href="index.php?action=catalog&amp;prod=aquasystem" class="brand-card">
                <div class="brand-type">Водостоки</div>
                <h4>Aquasystem</h4>
                <p>Россия</p>
            </a>
            <a href="index.php?action=catalog&amp;prod=fakro" class="brand-card">
                <div class="brand-type">Мансардные окна</div>
                <h4>Fakro</h4>
                <p>Польша</p>
            </a>
            <a href="index.php?action=catalog&amp;prod=abc" class="brand-card">
                <div class="brand-type">Фасадные термопанели</div>
                <h4>ABC-Klinkergruppe</h4>
                <p>Германия</p>
            </a>
        </div>
    </div>
</section>

<!-- Calculator Widget -->
<section class="calc-widget">
    <div class="container">
        <h2>Калькулятор кровли</h2>
        <p class="section-subtitle">Быстро рассчитайте примерную стоимость кровельных материалов</p>
        <div class="calc-widget-inner" id="calc-widget-form">
            <div class="calc-widget-grid">
                <div class="form-group">
                    <label>Тип кровли</label>
                    <select name="roof_type">
                        <option value="gable">Двускатная</option>
                        <option value="hip">Четырёхскатная (вальмовая)</option>
                        <option value="mansard">Мансардная</option>
                        <option value="shed">Односкатная</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Тип покрытия</label>
                    <select name="material">
                        <option value="bitumen">Битумная черепица (~850 руб/м2)</option>
                        <option value="ceramic">Керамическая черепица (~1800 руб/м2)</option>
                        <option value="metal">Металлочерепица (~650 руб/м2)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Длина дома (м)</label>
                    <input type="number" name="length" placeholder="10" min="1" max="100" step="0.1">
                </div>
                <div class="form-group">
                    <label>Ширина дома (м)</label>
                    <input type="number" name="width" placeholder="8" min="1" max="100" step="0.1">
                </div>
            </div>
            <div class="form-group">
                <label>Угол наклона крыши</label>
                <div class="range-wrapper">
                    <span>15&deg;</span>
                    <input type="range" name="angle" min="15" max="45" value="30" class="calc-angle-slider">
                    <span class="calc-angle-value">30&deg;</span>
                    <span>45&deg;</span>
                </div>
            </div>
            <button class="btn-calc">Рассчитать</button>

            <div class="calc-widget-results" style="display:none">
                <div class="calc-widget-results-grid">
                    <div class="calc-mini-result">
                        <div class="label">Площадь кровли</div>
                        <div class="value" id="widget-result-area">&mdash;</div>
                    </div>
                    <div class="calc-mini-result">
                        <div class="label">Материал (с запасом 10%)</div>
                        <div class="value" id="widget-result-material">&mdash;</div>
                    </div>
                    <div class="calc-mini-result highlight">
                        <div class="label">Примерная стоимость</div>
                        <div class="value" id="widget-result-cost">&mdash;</div>
                    </div>
                </div>
                <div class="calc-widget-actions">
                    <a href="index.php?action=calc" class="btn btn-primary">Подробный расчёт</a>
                    <a href="index.php?action=contacts" class="btn btn-outline" style="border-color:var(--color-accent);color:var(--color-accent)">Получить точный расчёт</a>
                </div>
            </div>
        </div>
    </div>
</section>
