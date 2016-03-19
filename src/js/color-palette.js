var a11yColorPalette = (function() {
    const NORMAL_TEXT = 'normal', LARGE_TEXT = 'large';
    const AA_COMPLIANCE_PREFIX = 'AA', AAA_COMPLIANCE_PREFIX = 'AAA';

    function isColor(color) {
        return color.match(/^#(?:[0-9a-f]{3}){1,2}$/i);
    }

    function formatHex(hexColor) {
        var formattedHex = hexColor;
        if (formattedHex.length === 4) {
            let [,r,g,b] = formattedHex;
            formattedHex = '#' + r + r + g + g + b + b;
        }
        return formattedHex.toUpperCase();
    }

    function createComplianceBadge(compliance, badgePrefix, complianceBadges) {
        var complianceText = [];
        if (compliance.normal.pass) {
            complianceText.push(NORMAL_TEXT);
        }

        if (compliance.large.pass) {
            complianceText.push(LARGE_TEXT);
        }

        if (complianceText.length > 0) {
            complianceBadges.push(badgePrefix + ' ' + complianceText.join(' / '));
        }
    }

    function calcCompliance(bgColor, fgColor) {
        var complianceBadges = [];
        var compliance = colora11y.calcContrastCompliance(fgColor, bgColor);
        createComplianceBadge(compliance.aa, AA_COMPLIANCE_PREFIX, complianceBadges);
        createComplianceBadge(compliance.aaa, AAA_COMPLIANCE_PREFIX, complianceBadges);
        return complianceBadges;
    }

    function definePaletteFgColor(bgColor, fgColor) {
        var paletteFgColor = {
            color: fgColor,
            compliance: {
                badges: calcCompliance(bgColor, fgColor)
            }
        };
        return paletteFgColor;
    }

    function definePaletteFgColors(fgColors, bgColor) {
        var paletteFgColors = [];

        for (var idx = 0; idx < fgColors.length; idx++) {
            var fgColor = fgColors[idx].trim();
            if (isColor(fgColor)) {
                fgColor = formatHex(fgColor);
                paletteFgColors.push(definePaletteFgColor(bgColor, fgColor));
            }
        }

        return paletteFgColors;
    }

    function definePaletteColor(bgColor, fgColors) {
        var paletteColor = {
            color: bgColor,
            fgColors: definePaletteFgColors(fgColors, bgColor)
        };
        return paletteColor;
    }

    function defineA11yPalette(colors) {
        var colorPalette = {
            colors: []
        };

        for (var idx = 0; idx < colors.bgColors.length; idx++) {
            var bgColor = colors.bgColors[idx].trim();
            if (isColor(bgColor)) {
                bgColor = formatHex(bgColor);
                colorPalette.colors.push(definePaletteColor(bgColor, colors.fgColors));
            }
        }
        return colorPalette;
    }

    return {
        defineA11yPalette : defineA11yPalette
    };

})();

var a11yColorPaletteUI = (function() {
    const HIDE_WCAG_CLASS = 'hide-wcag-labels', SHOW_WCAG_CLASS = 'show-wcag-labels';
    const HIDE_BG_COLOR_CLASS = 'hide-bg-colors', SHOW_BG_COLOR_CLASS = 'show-bg-colors';
    const FG_COLOR_TEMPLATE_ID = 'color-chart-fg-color-template', COLOR_CHART_TEMPLATE_ID = 'color-chart-template';
    const COLOR_CHART_ID = 'color-chart';

    function clearExistingChart() {
        var existingColorChart = document.getElementById(COLOR_CHART_ID);
        if (existingColorChart) {
            document.querySelector('main').removeChild(existingColorChart);
        }
    }

    function buildColors() {
        return {
            bgColors: document.getElementById('bg-colors').value.split(','),
            fgColors: document.getElementById('fg-colors').value.split(',')
        };
    }

    function drawColors() {
        var colors = buildColors();
        trackEvent('create palette clicked', [colors.bgColors.length, colors.fgColors.length].join('|'));
        clearExistingChart();
        enableCheckboxes();
        var fgColorsSource = document.getElementById(FG_COLOR_TEMPLATE_ID);
        Handlebars.registerPartial('paletteFgColors', fgColorsSource.innerHTML);

        var source = document.getElementById(COLOR_CHART_TEMPLATE_ID).innerHTML;
        var template = Handlebars.compile(source);
        var templateDiv = document.createElement('div');
        templateDiv.innerHTML = template(a11yColorPalette.defineA11yPalette(colors)).trim();
        document.body.querySelector('main').appendChild(templateDiv.firstChild);
    }

    function enableCheckboxes() {
        var showWCAG = document.getElementById('show-wcag');
        var showBgColors = document.getElementById('show-bg-colors');

        showWCAG.disabled = false;
        showWCAG.checked = true;
        showBgColors.disabled = false;
        showBgColors.checked = false;
    }

    function showHide(addClass, removeClass) {
        var colorChart = document.getElementById(COLOR_CHART_ID);
        if (colorChart) {
            colorChart.classList.remove(removeClass);
            colorChart.classList.add(addClass);
        }
    }

    function trackEvent(action, label) {
        try {
            ga('send', 'event', 'user interaction', action, label);
        } catch(error) {}
    }

    function toggleProp(toggleCheckbox, hideClass, showClass, trackHide, trackShow) {
        if (!toggleCheckbox.checked) {
            trackHide();
            showHide(hideClass, showClass);
        } else {
            trackShow();
            showHide(showClass, hideClass);
        }
    }

    function toggleWCAG(showWCAGCheckbox) {
        toggleProp(
            showWCAGCheckbox,
            HIDE_WCAG_CLASS,
            SHOW_WCAG_CLASS,
            function() {
                trackEvent('wcag toggle clicked', 'hide');
            },
            function() {
                trackEvent('wcag toggle clicked', 'show');
            }
        );
    }

    function toggleBgColor(showBgColorCheckbox) {
        toggleProp(
            showBgColorCheckbox,
            HIDE_BG_COLOR_CLASS,
            SHOW_BG_COLOR_CLASS,
            function() {
                trackEvent('bgColor toggle clicked', 'hide');
            },
            function() {
                trackEvent('bgColor toggle clicked', 'show');
            }
        );
    }

    function initPalette() {
        document.getElementById('load-colors').addEventListener('click', drawColors);
        document.getElementById('show-wcag').addEventListener('change', function () {
            toggleWCAG(this);
        });
        document.getElementById('show-bg-colors').addEventListener('change', function () {
            toggleBgColor(this);
        });
    }

    return {
        initPalette : initPalette
    };
})( );