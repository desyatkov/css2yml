const postcss = require('postcss');
const resolvedNestedSelector = require('postcss-resolve-nested-selector');
const yaml = require('js-yaml');
const fs = require('fs');
const R = require('ramda');
const _ = require('lodash');
const types = require('./types.js');
var username = require('git-user-name');

const rulesObject = []
const newList = [];

module.exports = postcss.plugin('sass2yaml', function sass2yaml(options) {
    return function (css) {
        options = options || {};
            css.walkRules(function(rule) {

                rule.selectors.forEach(function(selector) {
                    rule.nodes.forEach(function(node){
                        const rules = resolvedNestedSelector(selector, rule);
                        if( node.prop, node.value) {
                            
                            const object = {}

                            let selector = R.pipe(
                                R.replace( /\s+/g,'-' ),
                                R.replace('.','_cl_' ),
                                R.replace('#','_id_' )
                            )(rules[0]);
                            
                            const key = `${selector}---${node.prop}`;
                            
                            const newType = types.getType(node.prop);
                            object.type = newType ? newType.type : 'undefined';
                            if(object.type === 'select') {
                                object.options = newType.options
                            }
                            object.key = key;
                            object.value = node.value;
                            object.label = R.replace( /-+/g,' ', key )
                            rulesObject.push(object);
                            node.value = `$${key}`
                        }
                    })
                });
        });
        
        const groupLogic = (cat) => {
            const key = R.uniq(R.match(/(cl|id)_.*?(?=-)/g, cat.key));
            return key.length ? R.last(key) : "other"
        }
        const addF = (a) => {
           return { type: 'group',  label: a[0], children: a[1] };
        }
        const transform = R.pipe(
            R.map((o) => R.pick(['key', 'label', 'type', 'options'], o)),
            R.filter((a) => a.type !== 'undefined'),
            R.groupBy(groupLogic),
            R.toPairs,
            R.map( (o) => addF(o) )
        )

           
        const default_css_attributes = R.zipObj( 
                                            R.pluck('key', rulesObject),
                                            R.pluck('value',rulesObject)
                                        );
        const css_form = transform(rulesObject);

        const fileContent = yaml.dump( {default_css_attributes, css_form }, {
            flowLevel: 5,
            styles: {
                '!!int'  : 'hexadecimal',
                '!!null' : 'camelcase'
            }
        });

        const filepath = "./dest/file.yml";

        fs.writeFile(filepath, fileContent, (err) => {
            if (err) throw err;
            console.log(`🎸 ${username().split(' ')[0]} your YML was succesfully saved! path: ${filepath}`);
        }); 
    }
});