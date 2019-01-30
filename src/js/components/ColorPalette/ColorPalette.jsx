import React, { Component } from 'react';
import ColorPaletteForm from '../ColorPaletteForm/ColorPaletteForm.jsx'
import ColorPaletteColors from '../ColorPaletteColors/ColorPaletteColors.jsx'
import colora11y from 'colora11y';

export default class ColorPalette extends Component {
    constructor(props) {
        const DEFAULT_COLORS = ['#F34A53','#FAE3B4','#AAC789','#437356','#1E4147'];
        super(props);
        this.onPaletteChange = this.onPaletteChange.bind(this);
        this.state = {
            colorPalette: {
               colorSets :  this.generateColorSets(DEFAULT_COLORS)
            }
        };
    }

    onPaletteChange(paletteColors) {
        this.setState({
            colorPalette: {
                colorSets :  this.generateColorSets(paletteColors)
            }
        });
    }

    formatHex(hexColor) {
        var formattedHex = hexColor;
        if (formattedHex.length === 4) {
            let [,r,g,b] = formattedHex;
            formattedHex = '#' + r + r + g + g + b + b;
        }
        return formattedHex.toUpperCase();
    }

    isColor(color) {
        return color.match(/^#(?:[0-9a-f]{3}){1,2}$/i);
    }

    definePaletteColorSet(color1, color2) {
        var paletteColorSet = {
            color1: color1,
            color2:color2,
            ratio: colora11y.calcContrastCompliance(color1, color2).ratio,
            compliance: {
                badges: this.calcCompliance(color1, color2),
            }
        };
        return paletteColorSet;
    }

    createComplianceBadge(compliance, badgePrefix, complianceBadges) {
        const NORMAL_TEXT = 'normal', LARGE_TEXT = 'large';
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

    calcCompliance(color1, color2) {
        const AA_COMPLIANCE_PREFIX = 'AA', AAA_COMPLIANCE_PREFIX = 'AAA';
        var complianceBadges = [];
        var compliance = colora11y.calcContrastCompliance(color1, color2);
        this.createComplianceBadge(compliance.aa, AA_COMPLIANCE_PREFIX, complianceBadges);
        this.createComplianceBadge(compliance.aaa, AAA_COMPLIANCE_PREFIX, complianceBadges);
        return complianceBadges;
    }

    generateColorSets(colors) {
        colors.push(this.formatHex('#000'), this.formatHex('#FFF'));

        var colorsSets = [];

        var uniqueColors = [];
        for (var idx = 0; idx < colors.length; idx++) {
            var color = colors[idx].trim();
            if (this.isColor(color)) {
                color = this.formatHex(color);
                if (uniqueColors.indexOf(color) === -1) {
                    uniqueColors.push(color);
                }
            }
        }

        for (var i = 0; i < uniqueColors.length-1; i++) {
            for (var j = i+1; j < uniqueColors.length; j++) {
                var color1 = uniqueColors[i];
                var color2 = uniqueColors[j];
                var colorSet = this.definePaletteColorSet(color1, color2);
                colorsSets.push(colorSet);
            }
        }

        colorsSets.sort(this.sortSets);
        return colorsSets;
    }

    sortSets(set1, set2) {
        var ratio1 = parseFloat(set1.ratio.split(':')[0]);
        var ratio2 = parseFloat(set2.ratio.split(':')[0]);
        if (ratio1 > ratio2) {
            return -1;
        } else if (ratio1 < ratio2) {
            return 1;
        } else {
            return 0;
        }
    }

    render() {
        const paletteColors = this.props.paletteColors;
        const colorSets = this.state.colorPalette.colorSets;
        return (
            <div>
                <ColorPaletteForm paletteColors={paletteColors} onPaletteChange={this.onPaletteChange}/>
                <ColorPaletteColors colorSets={colorSets}/>
            </div>
        );
    }
}