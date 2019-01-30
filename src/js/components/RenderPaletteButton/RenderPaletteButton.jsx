import React, { Component } from 'react';

export default class RenderPaletteButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <button id="load-colors" type="submit">Create Palette</button>
        );
    }
}