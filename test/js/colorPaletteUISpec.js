describe('a11yColorPaletteUI', function() {

    var defineA11yPaletteSpy, handlebarsRegisterPartialSpy, handlebarsCompileSpy, gaSpy;

    var originalGa = window.ga;

    var pageHtml =
        '<input type="checkbox" id="show-wcag">' +
        '<input type="checkbox" id="show-bg-colors">' +
        '<button id="load-colors">load</button>' +
        '<input type="text" id="bg-colors" value="#000,#111,#222">' +
        '<input type="text" id="fg-colors" value="#333,#444,#555">' +
        '<div id="color-chart-template">chart template</div>' +
        '<div id="color-chart-fg-color-template">fg color template</div>' +
        '<div id="color-chart"></div>' +
        '<main></main>';

    beforeEach(function() {
        var wrapper = document.createElement('div');
        wrapper.setAttribute('id', 'jasmine-wrapper');
        wrapper.innerHTML = pageHtml;
        document.body.appendChild(wrapper);
        window.ga = function() {};
        gaSpy = spyOn(window, 'ga');
    });

    afterEach(function() {
        document.getElementById('jasmine-wrapper').remove();
        window.ga = originalGa;
    });

    it('has a checkbox to toggle badges', function() {
        a11yColorPaletteUI.initPalette();
        document.getElementById('show-wcag').click();
        document.getElementById('show-wcag').checked = true;

        expect(gaSpy).toHaveBeenCalledWith('send', 'event', 'user interaction', 'wcag toggle clicked', 'show');
        expect(document.getElementById('color-chart').classList).toEqual(jasmine.arrayContaining(['show-wcag-labels']));
        expect(document.getElementById('color-chart').classList).not.toEqual(jasmine.arrayContaining(['hide-wcag-labels']));

        document.getElementById('show-wcag').click();
        document.getElementById('show-wcag').checked = false;

        expect(gaSpy).toHaveBeenCalledWith('send', 'event', 'user interaction', 'wcag toggle clicked', 'hide');
        expect(document.getElementById('color-chart').classList).toEqual(jasmine.arrayContaining(['hide-wcag-labels']));
        expect(document.getElementById('color-chart').classList).not.toEqual(jasmine.arrayContaining(['show-wcag-labels']));

    });

    it('has a checkbox to toggle background colors', function() {
        a11yColorPaletteUI.initPalette();
        document.getElementById('show-bg-colors').click();
        document.getElementById('show-bg-colors').checked = true;

        expect(gaSpy).toHaveBeenCalledWith('send', 'event', 'user interaction', 'bgColor toggle clicked', 'show');
        expect(document.getElementById('color-chart').classList).toEqual(jasmine.arrayContaining(['show-bg-colors']));
        expect(document.getElementById('color-chart').classList).not.toEqual(jasmine.arrayContaining(['hide-bg-colors']));

        document.getElementById('show-bg-colors').click();
        document.getElementById('show-bg-colors').checked = false;

        expect(gaSpy).toHaveBeenCalledWith('send', 'event', 'user interaction', 'bgColor toggle clicked', 'hide');
        expect(document.getElementById('color-chart').classList).toEqual(jasmine.arrayContaining(['hide-bg-colors']));
        expect(document.getElementById('color-chart').classList).not.toEqual(jasmine.arrayContaining(['show-bg-colors']));

    });

    it('generates and resets palette from bg and fg color text fields', function() {
        var templateSpy = jasmine.createSpy('template').and.returnValue(' <div id="template-str"></div> ');
        defineA11yPaletteSpy = spyOn(a11yColorPalette, 'defineA11yPalette').and.returnValue('palette');
        handlebarsRegisterPartialSpy = spyOn(Handlebars, 'registerPartial');
        handlebarsCompileSpy = spyOn(Handlebars, 'compile').and.returnValue(templateSpy);
        document.getElementById('show-wcag').disabled = true;
        document.getElementById('show-bg-colors').disabled = true;

        a11yColorPaletteUI.initPalette();

        expect(document.getElementById('show-wcag').disabled).toBe(true);
        expect(document.getElementById('show-bg-colors').disabled).toBe(true);

        document.getElementById('load-colors').click();

        expect(gaSpy).toHaveBeenCalledWith('send', 'event', 'user interaction', 'create palette clicked', '3|3');
        expect(defineA11yPaletteSpy).toHaveBeenCalledWith({
            bgColors: [ '#000', '#111', '#222' ],
            fgColors: [ '#333', '#444', '#555' ] }
        );

        expect(handlebarsRegisterPartialSpy).toHaveBeenCalledWith('paletteFgColors', 'fg color template');
        expect(handlebarsCompileSpy).toHaveBeenCalledWith('chart template');
        expect(document.getElementById('color-chart')).toBeNull();
        expect(templateSpy).toHaveBeenCalledWith('palette');
        expect(document.querySelector('main').innerHTML).toBe('<div id="template-str"></div>');

        expect(document.getElementById('show-wcag').disabled).toBe(false);
        expect(document.getElementById('show-bg-colors').disabled).toBe(false);
    });

});