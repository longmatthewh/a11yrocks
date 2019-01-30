import React, { Component } from 'react';
import RenderPaletteButton from '../RenderPaletteButton/RenderPaletteButton.jsx'
import PaletteColorsInput from '../PaletteColorsInput/PaletteColorsInput.jsx'

export default class ColorPaletteForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colors:this.props.paletteColors
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
    }

    handleColorChange(paletteColors) {
        const colors = paletteColors.split(',');
        this.setState({colors});
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('submitted');
        this.props.onPaletteChange(this.state.colors);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h2 class="offscreen">Define Palette Colors</h2>
                <PaletteColorsInput paletteColors={this.state.colors} onColorChange={this.handleColorChange}/>
                <RenderPaletteButton/>
            </form>
        );
    }
}