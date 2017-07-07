/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const assign = require('object-assign');

const {Accordion, Panel} = require('react-bootstrap');

const LocaleUtils = require('../../MapStore2/web/client/utils/LocaleUtils');

const {connect} = require('react-redux');
const MultiValueFilter = require('../components/MultiValueFilter');
const LocationFilter = require('../components/LocationFilter');
const Events = require('../components/Events');

class EarlyWarning extends React.Component {
    static propTypes = {
        hazards: PropTypes.array,
        levels: PropTypes.array,
        regions: PropTypes.array,
        events: PropTypes.array,
        eventsInfo: PropTypes.object,
        height: PropTypes.number
    };

    static contextTypes = {
        messages: PropTypes.object
    };

    static defaultProps = {
        hazards: [],
        levels: [],
        regions: [],
        events: [],
        eventsInfo: {
            page: 0,
            total: 0
        },
        height: 798
    };

    render() {
        const accordionHeight = this.props.height - (50 + 41 + 52 + 5 + 52 + 5 + 72);
        return (
            <div id="decat-early-warning" className="decat-accordion" >
                <Accordion defaultActiveKey="1">
                    <Panel header={<span><div className="decat-panel-header">{LocaleUtils.getMessageById(this.context.messages, "decatwarning.alerts")}</div></span>} eventKey="1" collapsible>
                        <div style={{overflow: 'hidden', height: accordionHeight}}>
                            <Events events={this.props.events} {...this.props.eventsInfo} height={accordionHeight}/>
                        </div>
                    </Panel>
                    <Panel header={<span><div className="decat-panel-header">{LocaleUtils.getMessageById(this.context.messages, "decatwarning.filter")}</div></span>} eventKey="2" collapsible>
                        <div style={{overflow: 'auto', height: accordionHeight}}>
                            <LocationFilter title="decatwarning.regionsfilter" placeholder={LocaleUtils.getMessageById(this.context.messages, "decatwarning.locationplaceholder")} regions={this.props.regions}/>
                            <MultiValueFilter title="decatwarning.hazardsfilter" entities={this.props.hazards}/>
                            <MultiValueFilter title="decatwarning.levelsfilter" entities={this.props.levels}/>
                        </div>
                    </Panel>
                </Accordion>
            </div>
        );
    }
}

const EarlyWarningPlugin = connect((state) => ({
    hazards: state.alerts && state.alerts.hazards || [],
    levels: state.alerts && state.alerts.levels || [],
    regions: state.alerts && state.alerts.regions || [],
    events: state.alerts && state.alerts.events || [],
    eventsInfo: state.alerts && state.alerts.eventsInfo || {
        page: 0,
        total: 0
    },
    height: state.map && state.map.present && state.map.present.size && state.map.present.size.height || 798
}))(EarlyWarning);

module.exports = {
    EarlyWarningPlugin: assign(EarlyWarningPlugin,
    {
        DrawerMenu: {
            name: 'early-warning',
            position: 1,
            glyph: "flash",
            title: 'earlywarning',
            buttonConfig: {
                buttonClassName: "square-button no-border",
                tooltip: "earlywarning"
            },
            priority: 1
        }
    }),
    reducers: {
        alerts: require('../reducers/alerts')
    }
};