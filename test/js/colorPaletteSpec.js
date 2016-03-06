describe('a11yColorPalette', function() {

    var colors, palette, colorA11yContrastSpy;

    beforeEach(function() {
        colors =  {
            bgColors: ['#FF0','#EFEFEF'],
            fgColors: ['#FFF','#000000']
        };
    });

    it('converts 3 char hex to 6', function() {
        palette = a11yColorPalette.defineA11yPalette(colors);

        var color1 = palette.colors[0];
        var color2 = palette.colors[1];

        expect(color1.color).toBe('#FFFF00');
        expect(color1.fgColors[0].color).toBe('#FFFFFF');
        expect(color1.fgColors[1].color).toBe('#000000');
        expect(color2.color).toBe('#EFEFEF');
    });

    it('excludes strings that are not allowed formats', function() {
        colors.bgColors.push('#1234', 'yellow');
        colors.fgColors.push('#1234', 'yellow');

        palette = a11yColorPalette.defineA11yPalette(colors);

        expect(palette.colors.length).toBe(2);

        var color1 = palette.colors[0];
        var color2 = palette.colors[1];

        expect(color1.fgColors.length).toBe(2);
        expect(color2.fgColors.length).toBe(2);
    });

    it('remove white space from valid colors', function() {
        colors.bgColors.push(' #333 ');
        colors.fgColors.push(' #444 ');

        palette = a11yColorPalette.defineA11yPalette(colors);
        expect(palette.colors.length).toBe(3);

        var color3 = palette.colors[2];

        expect(color3.color).toBe('#333333');
        expect(color3.fgColors.length).toBe(3);
        expect(color3.fgColors[2].color).toBe('#444444');
    });

    it('contains empty badges when color is not compliance', function() {
        colorA11yContrastSpy = spyOn(colora11y, 'calcContrastCompliance').and.returnValue(emptyCompliance());
        palette = a11yColorPalette.defineA11yPalette(colors);

        var color1 = palette.colors[0];
        expect(color1.fgColors[0].compliance.badges.length).toBe(0);
        expect(color1.fgColors[1].compliance.badges.length).toBe(0);
    });

    it('creates badges for compliant contrast', function() {
        colorA11yContrastSpy = spyOn(colora11y, 'calcContrastCompliance').and.callFake(function(fgColor, bgColor) {
            var wcagCompliance = emptyCompliance();
            if (bgColor === '#FFFF00') {
                wcagCompliance.aa.large.pass = true;
                wcagCompliance.aaa.normal.pass = true;
                wcagCompliance.aaa.large.pass = true;
                return wcagCompliance;
            } else {
                wcagCompliance.aaa.normal.pass = true;
                wcagCompliance.aaa.large.pass = true;
            }
            return wcagCompliance;
        });

        palette = a11yColorPalette.defineA11yPalette(colors);

        var color1 = palette.colors[0];
        expect(color1.fgColors[0].compliance.badges.length).toBe(2);
        expect(color1.fgColors[0].compliance.badges[0]).toBe('AA large');
        expect(color1.fgColors[0].compliance.badges[1]).toBe('AAA normal / large');

        var color2 = palette.colors[1];
        expect(color2.fgColors[0].compliance.badges.length).toBe(1);
        expect(color2.fgColors[0].compliance.badges[0]).toBe('AAA normal / large');
    });

    function emptyCompliance() {
        return {
            aa: {
                normal: {},
                large: {}
            },
            aaa: {
                normal: {},
                large: {}
            }
        };
    }

});