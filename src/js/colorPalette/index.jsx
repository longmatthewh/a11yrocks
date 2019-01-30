import React from 'react';
import {render} from 'react-dom';
import ColorPalette from '../components/ColorPalette/ColorPalette.jsx';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    render () {

        return (
            <React.Fragment>
                <ColorPalette/>
            </React.Fragment>
        );
    }
}
render(<App/>, document.getElementById('app'));