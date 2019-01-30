import React, { Component, Fragment } from 'react';
import ComplianceBadges from '../ComplianceBadges/ComplianceBadges.jsx'

export default class ColorSet extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { color1, color2, ratio, compliance } = this.props.colors;

        var div1Style = {
            color: color2,
            backgroundColor: color1
        };

        var div2Style = {
            color: color1,
            backgroundColor: color2
        };

        return (
            <li class="color-set">
                <div class="color-set-color color-set-color1" style={div1Style}>
                    <h3>{color2}<span class="offscreen"> and {color1}</span></h3>
                    <span class="ratio"><span class="offscreen">contrast ratio: </span>{ratio}</span>
                    <h4 class="offscreen">level of compliance</h4>
                    <ComplianceBadges compliance={compliance}/>

                    {
                        (compliance.badges.length > 0) ? (
                            <Fragment>
                                <div>foo</div>
                                <div>foo2</div>
                            </Fragment>
                        ) : (
                            <div>bar</div>
                        )
                    }
                </div>
                <div class="color-set-color color-set-color2" aria-hidden="true" style={div2Style}>
                    <h3>{color1}</h3>
                    <span class="ratio"><span class="offscreen">contrast ratio: </span>{ratio}</span>
                    <h4 class="offscreen">level of compliance</h4>
                    <ComplianceBadges compliance={compliance}/>
                </div>
            </li>
        );
    }
}