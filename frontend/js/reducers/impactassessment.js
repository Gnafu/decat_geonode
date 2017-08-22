/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const assign = require('object-assign');

const {SHOW_HAZARD, TOGGLE_IMPACT_MODE, ASSESSMENTS_LOADED, ASSESSMENTS_LOADING_ERROR, ASSESSMENTS_LOADING,
    ADD_ASSESSMENT, CANCEL_ADD_ASSESSMENT, ASSESSMENT_PROMOTED, MODELS_LOADED, TOGGLE_HAZARD_VALUE, TOGGLE_HAZARDS,
    SHOW_MODEL, RUNS_LOADED} = require('../actions/impactassessment');
const {DATA_LOADED} = require('../actions/alerts');

function impactassessment(state = null, action) {
    switch (action.type) {
        case SHOW_HAZARD: {
            const {hazard_type: hazardType} = action.hazard && action.hazard.properties || {};
            const hazards = state.hazards.map((hazard) => hazard.name === hazardType ? assign({}, hazard, {selected: true}) : hazard);
            return assign({}, state, {mode: 'HAZARD', currentHazard: action.hazard, assessments: [], assessmentsInfo: {}, hazards});
        }
        case SHOW_MODEL: {
            return assign({}, state, {mode: 'MODEL', currentModel: action.model, runs: [], runsInfo: {}});
        }
        case TOGGLE_IMPACT_MODE:
            return assign({}, state, {mode: action.mode});
        case ASSESSMENTS_LOADING:
            return assign({}, state, {assessmentsLoading: action.loading});
        case ASSESSMENTS_LOADING_ERROR:
            return assign({}, state, {assessmentsError: action.e});
        case ASSESSMENTS_LOADED: {
            return assign({}, state, {
                assessments: action.assessments,
                assessmentsInfo: {
                    page: action.page || 0,
                    total: action.total || 0,
                    pageSize: action.pageSize || 5
                }
            });
        }
        case ADD_ASSESSMENT:
            return assign({}, state, {newAssessment: {}, mode: 'NEW_ASSESSMENT'});
        case CANCEL_ADD_ASSESSMENT:
            return assign({}, state, {newAssessment: undefined, mode: 'HAZARDS'});
        case ASSESSMENT_PROMOTED:
            return assign({}, state, { assessments: state.assessments.map((ass) => ass.id === action.ass.id && assign({}, ass, {properties: assign({}, ass.properties, {promoted: true, promoted_at: action.ass.properties.promoted_at})}) || ass)});
        case MODELS_LOADED:
            return assign({}, state, {
                models: action.models,
                modelsInfo: {
                    page: action.page || 0,
                    total: action.total || 0,
                    pageSize: action.pageSize || 5,
                    filter: action.filter
                }
            });
        case RUNS_LOADED:
            return assign({}, state, {
                runs: action.runs,
                runsInfo: {
                    page: action.page || 0,
                    total: action.total || 0,
                    pageSize: action.pageSize || 5
                }
            });
        case DATA_LOADED: {
            return action.entity === 'hazards' ? assign({}, state, {hazards: action.data}) : state;
        }
        case TOGGLE_HAZARD_VALUE: {
            const entities = state.hazards.map((en, idx) => {
                return idx === action.entityIdx ? assign({}, en, {selected: action.checked}) : en;
            });
            return assign({}, state, {hazards: entities});
        }
        case TOGGLE_HAZARDS: {
            return assign({}, state, {hazards: state.hazards.map((en) => (assign({}, en, {selected: action.checked})))});
        }
        default: return state;
    }
}

module.exports = impactassessment;