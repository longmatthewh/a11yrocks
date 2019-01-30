import React, { Component } from 'react';

export default class PaletteColorsInput extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onColorChange(e.target.value);
    }

    render() {
        const paletteColors = this.props.paletteColors;

        return (
            <div>
                <label for="bg-colors">Colors (comma separated HEX)</label>
                <input type="text" id="bg-colors" value={paletteColors} onChange={this.handleChange}/>
            </div>
        );
    }
}