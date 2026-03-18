<div class="content-wrapper">
    <section class="calculator-section">
        <h2>Калькулятор кровли</h2>
        <p class="section-subtitle">Рассчитайте примерную площадь кровли и стоимость материалов для вашего дома</p>

        <div class="calc-container">
            <div class="calc-form" id="calc-full-form">
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
                    <label>Длина дома (м)</label>
                    <input type="number" name="length" placeholder="Например: 12" min="1" max="100" step="0.1">
                </div>

                <div class="form-group">
                    <label>Ширина дома (м)</label>
                    <input type="number" name="width" placeholder="Например: 10" min="1" max="100" step="0.1">
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

                <div class="form-group">
                    <label>Тип покрытия</label>
                    <select name="material">
                        <option value="bitumen">Битумная черепица (~850 руб/м2)</option>
                        <option value="ceramic">Керамическая черепица (~1800 руб/м2)</option>
                        <option value="metal">Металлочерепица (~650 руб/м2)</option>
                    </select>
                </div>

                <button class="btn-calc">Рассчитать</button>
            </div>

            <div class="calc-results">
                <div class="calc-placeholder">
                    <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>
                    <p>Заполните параметры слева и нажмите «Рассчитать»</p>
                </div>

                <div class="calc-results-inner" style="display:none">
                    <div class="calc-result-item">
                        <div class="calc-result-label">Площадь кровли</div>
                        <div class="calc-result-value"><span id="result-area">0</span> <span>м&sup2;</span></div>
                    </div>
                    <div class="calc-result-item">
                        <div class="calc-result-label">Количество материала (с запасом 10%)</div>
                        <div class="calc-result-value"><span id="result-material">0</span> <span>м&sup2;</span></div>
                    </div>
                    <div class="calc-result-item total">
                        <div class="calc-result-label">Примерная стоимость</div>
                        <div class="calc-result-value"><span id="result-cost">0</span> <span>руб.</span></div>
                    </div>
                    <a href="index.php?action=contacts" class="btn-contact-calc">Получить точный расчёт</a>
                </div>
            </div>
        </div>

        <div class="page-content mt-3">
            <h3>Как работает калькулятор</h3>
            <p>Калькулятор рассчитывает примерную площадь кровли на основе размеров вашего дома, типа крыши и угла наклона. Стоимость материалов рассчитывается с учётом 10% запаса на подрезку и отходы.</p>
            <h4>Типы кровли:</h4>
            <ul style="padding-left:20px;margin-bottom:16px">
                <li><strong>Двускатная</strong> — классический тип с двумя скатами. Наиболее распространённый вариант.</li>
                <li><strong>Четырёхскатная (вальмовая)</strong> — четыре ската, обеспечивает равномерный сход осадков.</li>
                <li><strong>Мансардная</strong> — ломаная крыша с крутым нижним и пологим верхним скатом. Увеличивает жилое пространство.</li>
                <li><strong>Односкатная</strong> — один скат, подходит для пристроек и современных проектов.</li>
            </ul>
            <p><strong>Обратите внимание:</strong> это ориентировочный расчёт. Для точной стоимости с учётом всех элементов (конёк, ендовы, примыкания) свяжитесь с нами по телефону <a href="tel:+78123132003">+7(812)313-20-03</a>.</p>
        </div>
    </section>
</div>
