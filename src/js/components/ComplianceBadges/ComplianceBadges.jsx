import React, { Component } from 'react';
import ComplianceBadge from '../ComplianceBadge/ComplianceBadge.jsx'

export default class ComplianceBadges extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {badges} = this.props.compliance;

        return (badges.length > 0 &&
            <ul>
                {
                    badges.map((badge) => {
                        return (
                            <ComplianceBadge badgeText={badge}/>
                        )
                    })
                }
            </ul>

        );
    }
}