/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {head, isObjectLike, isArray, keys, isString} = require('lodash');

const getHazard = (hazards, type) => {
    return head((hazards || []).filter(h => h.name === type));
};

const getLevel = (levels, name) => {
    return head((levels || []).filter(h => h.name === name));
};

function getRegionsCode(selectedRegions) {
    return selectedRegions.map((r) => r.code).join();
}
function getHazards(hazards) {
    return (hazards || []).filter((h) => h.selected).map((h) => h.name).join();
}
function getLevels(levels) {
    return (levels || []).filter((l) => l.selected).map((l) => l.name).join();
}
function _flatErrors(errors) {
    return keys(errors).reduce((res, e) => {
        return isObjectLike(errors[e]) && !isArray(errors[e]) ? res.concat(_flatErrors(errors[e], e)) : res.concat({title: e, text: errors[e]});
    }, []);
}
module.exports = {
    getHazardIcon: (hazards, type) => {
        const hazard = getHazard(hazards, type);
        return hazard && hazard.icon || 'eq';
    },
    getEvent: (state, event) => {
        return {
            id: event.id,
            point: {
                lat: event.geometry.coordinates[1],
                lng: event.geometry.coordinates[0]
            },
            regions: event.properties.regions,
            name: event.properties.title,
            hazard: getHazard(state.hazards, event.properties.hazard_type),
            level: getLevel(state.levels, event.properties.level),
            sourceName: event.properties.source.name,
            sourceType: event.properties.source.type,
            sourceUri: event.properties.source.uri,
            description: event.properties.description,
            created: event.properties.created_at,
            reported: event.properties.reported_at,
            updated: event.properties.updated_at
        };
    },
    createFilter: (hazards, levels, regions, interval, text, promoted = false, archived = false, role ='event-operator') => {
        let filter = '';
        switch (role) {
            case 'emergency-manager':
                filter = `&hazard_type__in=${getHazards(hazards)}&level__in=${getLevels(levels)}`;
                break;
            case 'impact-assessor':
                filter = `&promoted=true&archived=false&hazard_type__in=${getHazards(hazards)}&level__in=${getLevels(levels)}`;
                break;
            default:
                filter = `&promoted=${promoted}&archived=${archived}&hazard_type__in=${getHazards(hazards)}&level__in=${getLevels(levels)}`;
        }
        if (regions && regions.length > 0) {
            filter += `&regions__code__in=${getRegionsCode(regions)}`;
        }
        if (text) {
            filter += `&title__contains=${text}`;
        }
        if (interval) {
            filter += `&reported_at__gt=${interval}`;
        }
        return filter;
    },
    flatErrors: (errors) => {
        return isString(errors) ? [{title: "", text: errors}] : _flatErrors(errors);
    }
};
