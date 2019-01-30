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

    function calcCompliance(color1, color2) {
        var complianceBadges = [];
        var compliance = colora11y.calcContrastCompliance(color1, color2);
        createComplianceBadge(compliance.aa, AA_COMPLIANCE_PREFIX, complianceBadges);
        createComplianceBadge(compliance.aaa, AAA_COMPLIANCE_PREFIX, complianceBadges);
        return complianceBadges;
    }

    function definePaletteColorSet(color1, color2) {
        var paletteColorSet = {
            color1: color1,
            color2:color2,
            compliance: {
                badges: calcCompliance(color1, color2),
                ratio: colora11y.calcContrastCompliance(color1, color2).ratio
            }
        };
        return paletteColorSet;
    }

    function defineA11yPalette(colors) {
        colors.push(formatHex('#000'), formatHex('#FFF'));

        var colorPalette = {
            colorsSets: [],
            invalidColorSets: []
        };

        var uniqueColors = [];
        for (var idx = 0; idx < colors.length; idx++) {
            var color = colors[idx].trim();
            if (isColor(color)) {
                color = formatHex(color);
                if (uniqueColors.indexOf(color) === -1) {
                    uniqueColors.push(color);
                }
            }
        }

        for (var i = 0; i < uniqueColors.length-1; i++) {
            for (var j = i+1; j < uniqueColors.length; j++) {
                var color1 = uniqueColors[i];
                var color2 = uniqueColors[j];
                var colorSet = definePaletteColorSet(color1, color2);
                colorPalette.colorsSets.push(colorSet);
            }
        }

        colorPalette.colorsSets.sort(sortSets);
        return colorPalette;
    }

    
    function sortSets(set1, set2) {
        var ratio1 = parseFloat(set1.compliance.ratio.split(':')[0]);
        var ratio2 = parseFloat(set2.compliance.ratio.split(':')[0]);
        if (ratio1 > ratio2) {
            return -1;
        } else if (ratio1 < ratio2) {
            return 1;
        } else {
            return 0;
        }
    }

    return {
        defineA11yPalette : defineA11yPalette
    };

})();

var a11yColorPaletteUI = (function() {
    const COLOR_CHART_TEMPLATE_ID = 'color-chart-template';
    const COLOR_CHART_ID = 'color-chart';

    function clearExistingChart() {
        var existingColorChart = document.getElementById(COLOR_CHART_ID);
        if (existingColorChart) {
            document.querySelector('main').removeChild(existingColorChart);
        }
    }

    function buildColors() {
        return document.getElementById('bg-colors').value.split(',');
    }

    function drawColors() {
        var colors = buildColors();
        trackEvent('create palette clicked', colors.length);
        clearExistingChart();

        var source = document.getElementById(COLOR_CHART_TEMPLATE_ID).innerHTML;
        var template = Handlebars.compile(source);
        var templateDiv = document.createElement('div');
        templateDiv.innerHTML = template(a11yColorPalette.defineA11yPalette(colors)).trim();
        document.body.querySelector('main').appendChild(templateDiv.firstChild);
    }

    function trackEvent(action, label) {
        try {
            ga('send', 'event', 'user interaction', action, label);
        } catch(error) {}
    }

    function initPalette() {
        document.getElementById('load-colors').addEventListener('click', drawColors);
    }

    return {
        initPalette : initPalette
    };
})( );