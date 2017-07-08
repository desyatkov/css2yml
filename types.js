const R = require('ramda');
const _ = require('lodash');

module.exports = {
    getType: function (prop) {
            const typesArr = [{
                type: 'dimension',
                units: ['background-size','width', 'height', 'left', 'right', 'top', 'bottom', 'size', 'outset', 'radius', 'margin', 'padding']
            },
            {
                type: 'fontWeight', units: ['font-weight']
            },
            {
                type: 'borderStyle', units: ['border-style']
            },
            {
                type: 'color', units: ['color']
            },
            {
                type: 'fontFamily', units: ['font-family']
            },
            {
                type: 'fontSize', units: ['font-size']
            },
            {
                type: 'fontWeight', units: ['font-weight']
            },
            {
                type: 'image', units: ['image']
            },
            {
                type: 'position', units: ['position']
            },
            {
                type: 'textAlign', units: ['text-align']
            },
            {
                type: 'textDecoration', units: ['text-decoration']
            },
            {
                type: 'textDecoration', units: ['text-decoration']
            },
            {
                type: 'select',
                units: ['text-transform'],
                options: ['none','capitalize','uppercase','lowercase','initial','inherit;']
            },
            {
                type: 'undefined', units: ['transform']
            }
        ];

        const reg = new RegExp(prop,'gi')
        const e = _.findLastKey(typesArr, (obj) => { 
            return _.find(obj.units, (o) => reg.test(o) );
        });

        return typesArr[e];
    }
}