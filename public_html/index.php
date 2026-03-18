<?php
$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : '';
$prod = isset($_REQUEST['prod']) ? $_REQUEST['prod'] : '';

$action = htmlspecialchars(stripslashes($action));
$prod = htmlspecialchars(stripslashes($prod));

$content = 'about.php';

if ($action === 'catalog') {
    $products = array(
        'tegola','ct','braas','roben','jacobi','tondach','saimaa',
        'slanec','dranka','dorken','tyvek','plfakro','sves','sneg','fason',
        'rockwool','paroc','ekovata','aquasystem','fakro','abc'
    );
    if (in_array($prod, $products)) {
        $content = $prod . '.php';
    } else {
        $content = 'catalog.php';
    }
} elseif ($action === 'uslugi') {
    $content = 'uslugi.php';
} elseif ($action === 'price') {
    $content = 'price.php';
} elseif ($action === 'contacts') {
    $content = 'contacts.php';
} elseif ($action === 'calc') {
    $content = 'calc.php';
}

$isHome = ($content === 'about.php');
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="БауМастер — кровельные материалы европейского качества в Санкт-Петербурге. Черепица, теплоизоляция, водостоки, мансардные окна.">
    <title>БауМастер — кровельные материалы</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="shortcut icon" href="img/icon.ico" type="image/x-icon">
</head>
<body>

<!-- Header -->
<header class="site-header">
    <div class="header-top">
        <a href="index.php" class="logo">
            <img src="logo.jpg" alt="БауМастер">
            <div class="logo-text">Бау<span>Мастер</span></div>
        </a>
        <a href="tel:+78123132003" class="header-phone">
            <svg viewBox="0 0 24 24"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1.003 1.003 0 011.01-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.07 21 3 13.93 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.01l-2.21 2.21z"/></svg>
            +7(812)313-20-03
        </a>
        <button class="burger" aria-label="Меню">
            <span></span><span></span><span></span>
        </button>
    </div>

    <!-- Navigation -->
    <nav class="main-nav">
        <div class="nav-container">
            <ul class="nav-menu">
                <li<?php if ($isHome) echo ' class="active"'; ?>><a href="index.php">Главная</a></li>
                <li class="nav-catalog<?php if ($action === 'catalog') echo ' active'; ?>">
                    <a href="index.php?action=catalog">Каталог</a>
                    <div class="mega-menu">
                        <div class="mega-menu-group">
                            <h5>Кровля</h5>
                            <ul>
                                <li><a href="index.php?action=catalog&amp;prod=tegola">Tegola <span class="country">(Италия)</span></a></li>
                                <li><a href="index.php?action=catalog&amp;prod=ct">CertainTeed <span class="country">(США)</span></a></li>
                                <li><a href="index.php?action=catalog&amp;prod=braas">BRAAS <span class="country">(Германия)</span></a></li>
                                <li><a href="index.php?action=catalog&amp;prod=roben">Roben <span class="country">(Польша)</span></a></li>
                                <li><a href="index.php?action=catalog&amp;prod=jacobi">Jacobi <span class="country">(Германия)</span></a></li>
                                <li><a href="index.php?action=catalog&amp;prod=tondach">Tondach <span class="country">(Австрия)</span></a></li>
                                <li><a href="index.php?action=catalog&amp;prod=saimaa">Saimaa <span class="country">(Финляндия)</span></a></li>
                                <li><a href="index.php?action=catalog&amp;prod=slanec">Сланец</a></li>
                                <li><a href="index.php?action=catalog&amp;prod=dranka">Дранка</a></li>
                            </ul>
                        </div>
                        <div class="mega-menu-group">
                            <h5>Аксессуары</h5>
                            <ul>
                                <li><a href="index.php?action=catalog&amp;prod=dorken">DORKEN <span class="country">(Германия)</span></a></li>
                                <li><a href="index.php?action=catalog&amp;prod=tyvek">Tyvek</a></li>
                                <li><a href="index.php?action=catalog&amp;prod=plfakro">Fakro (плёнки)</a></li>
                                <li><a href="index.php?action=catalog&amp;prod=sves">Свес</a></li>
                                <li><a href="index.php?action=catalog&amp;prod=sneg">Снегозадержание</a></li>
                                <li><a href="index.php?action=catalog&amp;prod=fason">Фасонные элементы</a></li>
                            </ul>
                        </div>
                        <div class="mega-menu-group">
                            <h5>Материалы и системы</h5>
                            <ul>
                                <li><a href="index.php?action=catalog&amp;prod=rockwool">Rockwool</a></li>
                                <li><a href="index.php?action=catalog&amp;prod=paroc">Paroc</a></li>
                                <li><a href="index.php?action=catalog&amp;prod=ekovata">Эковата</a></li>
                                <li><a href="index.php?action=catalog&amp;prod=aquasystem">Аквасистем</a></li>
                                <li><a href="index.php?action=catalog&amp;prod=fakro">Fakro (окна)</a></li>
                                <li><a href="index.php?action=catalog&amp;prod=abc">ABC-Klinkergruppe</a></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li<?php if ($action === 'calc') echo ' class="active"'; ?>><a href="index.php?action=calc">Калькулятор</a></li>
                <li<?php if ($action === 'uslugi') echo ' class="active"'; ?>><a href="index.php?action=uslugi">Услуги</a></li>
                <li<?php if ($action === 'price') echo ' class="active"'; ?>><a href="index.php?action=price">Прайс</a></li>
                <li<?php if ($action === 'contacts') echo ' class="active"'; ?>><a href="index.php?action=contacts">Контакты</a></li>
            </ul>
        </div>
    </nav>
</header>

<!-- Main Content -->
<main class="site-main">
    <?php include_once($content); ?>
</main>

<!-- Footer -->
<footer class="site-footer">
    <div class="footer-content">
        <div class="footer-section">
            <h5>БауМастер</h5>
            <p>Кровельные материалы европейского качества</p>
            <p>г. Санкт-Петербург, Выборгское шоссе, 212</p>
            <p>Выставка «Коттеджи в Озерках», павильон 9с</p>
            <p><a href="tel:+78123132003">+7(812)313-20-03</a></p>
            <p><a href="mailto:baumasterspb@mail.ru">baumasterspb@mail.ru</a></p>
        </div>
        <div class="footer-section">
            <h5>Навигация</h5>
            <ul class="footer-nav">
                <li><a href="index.php">Главная</a></li>
                <li><a href="index.php?action=catalog">Каталог</a></li>
                <li><a href="index.php?action=calc">Калькулятор кровли</a></li>
                <li><a href="index.php?action=uslugi">Услуги</a></li>
                <li><a href="index.php?action=price">Прайс</a></li>
                <li><a href="index.php?action=contacts">Контакты</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h5>Популярные бренды</h5>
            <ul class="footer-nav">
                <li><a href="index.php?action=catalog&amp;prod=tegola">Tegola</a></li>
                <li><a href="index.php?action=catalog&amp;prod=braas">BRAAS</a></li>
                <li><a href="index.php?action=catalog&amp;prod=rockwool">Rockwool</a></li>
                <li><a href="index.php?action=catalog&amp;prod=fakro">Fakro</a></li>
                <li><a href="index.php?action=catalog&amp;prod=aquasystem">Aquasystem</a></li>
            </ul>
        </div>
    </div>
    <div class="footer-bottom">
        &copy; <?php echo date('Y'); ?> ООО &laquo;БауМастер&raquo;. Все права защищены.
    </div>
</footer>

<script src="script.js"></script>
</body>
</html>
