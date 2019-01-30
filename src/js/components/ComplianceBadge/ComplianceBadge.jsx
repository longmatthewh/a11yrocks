import React, { Component } from 'react';

export default class ComplianceBadge extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const badgeText = this.props.badgeText;

        return (
            <li class="badge">{badgeText}</li>
        );
    }
}