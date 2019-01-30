import React, { Component } from 'react';
import ColorSet from '../ColorSet/ColorSet.jsx'

export default class ColorPaletteColors extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const colorSets = this.props.colorSets;

        return (
            <ul id="color-chart">
                {
                    colorSets.map((colorSet) => {
                        return (
                            <ColorSet colors={colorSet}/>
                        )
                    })
                }
            </ul>
        );
    }
}