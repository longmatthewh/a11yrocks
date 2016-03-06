document.getElementById('colors').addEventListener('blur', drawColors);

document.getElementById('foreground-color').addEventListener('blur', function() {
});

function createBadge(badgeText) {
    var badgeDiv = document.createElement('div');
    badgeDiv.setAttribute('class','badge');
    badgeDiv.innerHTML = badgeText;
    return badgeDiv;
}

function addFgColor(fgColor, bgColor) {
    var compliance = colora11y.calcContrastCompliance(fgColor, bgColor);
    var fgColorDiv = document.createElement('div');
    fgColorDiv.setAttribute('class','fg-color');
    fgColorDiv.setAttribute('style', 'color:' + fgColor);
    fgColorDiv.innerHTML = fgColor.toUpperCase();


    var aaText = [];
    if (compliance.aa.normal.pass) {
        aaText.push('normal');
    }
    if (compliance.aa.large.pass) {
        aaText.push('large');
    }

    if (aaText.length > 0) {
        fgColorDiv.appendChild(createBadge('AA ' + aaText.join(' / ')));
    }


    var aaaText = [];
    if (compliance.aaa.normal.pass) {
        aaaText.push('normal');
    }
    if (compliance.aaa.large.pass) {
        aaaText.push('large');
    }

    if (aaaText.length > 0) {
        fgColorDiv.appendChild(createBadge('AAA ' + aaaText.join(' / ')));
    }

    return fgColorDiv;
}

function drawColor(bgColor, fgColors, colorChart) {
    var bgColorDiv = document.createElement('pallette-color');
    bgColorDiv.setAttribute('bg-color',bgColor);

    bgColorDiv.setAttribute('fg-colors',JSON.stringify(fgColors));
    colorChart.appendChild(bgColorDiv);
}



function drawColors() {
    var colorChart = document.getElementById('color-chart');
    var bgColors = document.getElementById('colors').value.split(',');
    var fgColors = document.getElementById('foreground-color').value.split(',');

    colorChart.innerHTML = '';

    (function nextColor(i) {
        setTimeout(function () {
            if (i < bgColors.length) {
                drawColor(bgColors[i].trim(), fgColors, colorChart);
                i++;
                nextColor(i);
            }

        }, 100);
    })(0);
}