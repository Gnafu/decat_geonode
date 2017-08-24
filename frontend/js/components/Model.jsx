/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const {Grid, Row, Col, Panel, ButtonGroup, Button} = require('react-bootstrap');
const LocaleUtils = require('../../MapStore2/web/client/utils/LocaleUtils');
const PropTypes = require('prop-types');
const AlertsUtils = require('../utils/AlertsUtils');
const Message = require('../../MapStore2/web/client/components/I18N/Message');
const PaginationToolbar = require('../../MapStore2/web/client/components/misc/PaginationToolbar');
const ConfirmDialog = require('../../MapStore2/web/client/components/misc/ConfirmDialog');
const Portal = require('../../MapStore2/web/client/components/misc/Portal');
const Run = require('./Run');
const FilesUpload = require('./FilesUpload');


class Model extends React.Component {
    static propTypes = {
          className: PropTypes.string,
          run: PropTypes.object,
          height: PropTypes.number,
          currentModel: PropTypes.object,
          hazards: PropTypes.array,
          onSave: PropTypes.func,
          onClose: PropTypes.func,
          status: PropTypes.object,
          pageSize: PropTypes.number,
          runs: PropTypes.array,
          page: PropTypes.number,
          total: PropTypes.number,
          loadRuns: PropTypes.func,
          addRun: PropTypes.func,
          mode: PropTypes.string,
          toggleMode: PropTypes.func,
          onUploadFiles: PropTypes.func,
          uploading: PropTypes.bool,
          uploadingErrors: PropTypes.object
      };

      static contextTypes = {
          messages: PropTypes.object
      };
      static defaultProps = {
          mode: '',
          className: 'd-hazard',
          pageSize: 10,
          page: 0,
          total: 0,
          runs: [],
          onSave: () => {},
          onClose: () => {},
          addRun: () => {},
          loadRuns: () => {},
          toggleMode: () => {},
          height: 100,
          status: {
              saving: false,
              saveError: null
          }
      };
      state = {
          showConfirm: false,
          showPromoteConfirm: false
      }
    getHazard = (type) => {
        return AlertsUtils.getHazardIcon(this.props.hazards, type);
    }
    renderHeader = () => {
        const {title} = this.props && this.props.currentModel && this.props.currentModel.properties || {};
        return (
            <Grid fluid>
                <Row style={{height: 56}}>
                    <Col xs={11} className="text-center" >
                    <h4>{title}</h4>
                    </Col>
                    <Col xs={1}>
                    <h5 className="glyphicon glyphicon-1-close close-hazard-icon" onClick={this.props.onClose}></h5>
                     </Col>
                </Row>
            </Grid>
            );
    }
    renderRuns = () => {
        const {runs = [], currentModel = {}} = this.props;
        const {runnable} = currentModel.properties;
        return runs.map((ass, idx) => <Run run={ass} key={idx} onUpload={this.handleUpload} runnable={runnable}/>);
    }
    renderInputOutput = (fields = []) => {
        return fields.map((f) => <li className="list-group-item" key={f.id}><span style={{color: '#ff8f31', marginRight: 4 }}>{f.label}</span>{f.description}</li>);
    };
    renderBody = () => {
        const {description, hazard_type: hazardType, inputs = [], outputs = []} = this.props && this.props.currentModel && this.props.currentModel.properties || {};
        return (
            <Grid fluid>
                <div style={{overflow: 'auto', height: this.props.height - (30 + 40 + 60 + 132 )}}>
                    <Row className="hazard-info">
                        <Panel header={LocaleUtils.getMessageById(this.context.messages, "decatassessment.modelinfo")} eventKey="1" collapsible>
                            <Row>
                                <Col xs={12} className="model-description">
                                    {description}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <span>Hazard:</span>&nbsp;&nbsp;
                                    <span className={`fa icon-${this.getHazard(hazardType)}`}></span>&nbsp;
                                    <strong style={{textTransform: 'capitalize'}}>{hazardType}</strong>
                                </Col>
                            </Row>
                            <Row >
                                <Col xs={12} className="model-in_output_desc">
                                    <strong>Input</strong>
                                </Col>
                            </Row>
                            <Row >
                                <Col xs={12}>
                                    <ul className="list-group">
                                        {this.renderInputOutput(inputs)}
                                    </ul>
                                </Col>
                            </Row>
                            <Row >
                                <Col xs={12} className="model-in_output_desc">
                                    <strong>Output</strong>
                                </Col>
                            </Row>
                            <Row >
                                <Col xs={12}>
                                    <ul className="list-group">
                                        {this.renderInputOutput(outputs)}
                                    </ul>
                                </Col>
                            </Row>
                        </Panel>
                    </Row>
                    {this.renderRuns()}
                </div>
            </Grid>
            );
    }
    render() {
        const { runs, pageSize, page, total, height, onClose, currentModel, mode, run, onUploadFiles, uploading, uploadingErrors} = this.props || {};

        return (
            <div className="hazard-container" style={{overflow: 'auto', height: height - 40}}>
                {this.renderHeader()}
                {this.renderBody()}
                <Grid fluid>
                    <Row>
                        <Col xs={12} className="text-center">
                        <PaginationToolbar items={runs} pageSize={pageSize} page={page} total={total} onSelect={this.handlePageChange}/>
                    </Col>
                    </Row>
                    <Row>
                        <Col className="text-center" xs={12}>
                            <ButtonGroup className="event-editor-bottom-group">
                                <Button bsSize="sm" onClick={onClose}><Message msgId="eventeditor.cancel"/></Button>
                                <Button bsSize="sm" onClick={this.handleAdd}><Message msgId="decatassessment.addRun"/></Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Grid>
                {mode === 'NEW_RUN' ? <Portal>
                            <ConfirmDialog onConfirm={this.handleConfirm} onClose={this.handleClose} show title={<Message msgId="decatassessment.addnewassessmentTitle" />} >
                                <Message msgId={this.state.showConfirm === 'add' && "decatassessment.addnewassessment" || "decatassessment.editassessment" }/>
                            </ConfirmDialog>
                        </Portal> : null}
                {mode === 'UPLOAD_RUN_FILES' ? <Portal>
                                    <FilesUpload uploadingErrors={uploadingErrors} uploading={uploading} onUploadFiles={onUploadFiles} run={run} model={currentModel} onClose={this.handleCloseUpload}/>
                                </Portal> : null}
            </div>);
    }
    handlePageChange = (page) => {
        this.props.loadRuns(undefined, page);
    }
    handleAdd = () => {
        this.props.toggleMode('NEW_RUN');
    };
    handleClose = () => {
        this.setState({ showConfirm: false});
    };
    handleConfirm = () => {
        this.setState({ showConfirm: false});
        // this.props.addRun(this.state.mapId);
    };
    handleUpload = (run) => {
        this.props.toggleMode('UPLOAD_RUN_FILES', run);
    }
    handleCloseUpload = () => {
        this.props.toggleMode('');
    };
}

module.exports = Model;
