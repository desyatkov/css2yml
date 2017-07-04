const postcss = require('postcss');
const resolvedNestedSelector = require('postcss-resolve-nested-selector');
const yaml = require('js-yaml');
const fs   = require('fs');
const R = require('ramda');
const _ = require('lodash');

const rulesObject = []
const default_css_attributes = {}
const css_form = []
const newList = [];
module.exports = postcss.plugin('sass2yaml', function sass2yaml(options) {
    return function (css) {
        options = options || {};
            css.walkRules(function(rule) {

                rule.selectors.forEach(function(selector) {
                    rule.nodes.forEach(function(node){
                        const rules = resolvedNestedSelector(selector, rule);
                        if( node.prop, node.value) {
                            const object = {type: 'dimension'}
                            
                            let selector = R.pipe(
                                R.replace( /\s+/g,'-' ),
                                R.replace('.','_cl_' ),
                                R.replace('#','_id_' )
                            )(rules[0]);
                            
                            const key = `${selector}---${node.prop}`;

                            object.key = key;
                            object.value = node.value;
                            object.label = R.replace( /-+/g,' ', key )
                            rulesObject.push(object);
                            node.prop = `$${key}`
                        }
                    })
                });
        });
        
        const byGroup = R.groupBy(function(cat) {
            const selector = cat.key;
            const key = R.uniq(R.match(/(cl|id)_.*?(?=-)/g, selector));
            return  key.length ? R.last(key) : "other" 
        });

        const reduse = v => newList.push(R.pick(['key', 'label','type'], v))
        const erList = R.forEachObjIndexed(reduse, rulesObject)
        const er = byGroup( newList );
        R.map(e => {  default_css_attributes[e.key] = e.value }, rulesObject);
        
        _.map(er, (v,k) => { 
            const obj = { type: 'group',  label: k, children: v };
            css_form.push(obj)
        });
               
        const fileContent = yaml.dump({default_css_attributes, css_form}, {
            styles: {
                '!!int'  : 'hexadecimal',
                '!!null' : 'camelcase'
            }
        });

        const filepath = "./dest/file.yml";

        fs.writeFile(filepath, fileContent, (err) => {
            if (err) throw err;
            console.log("YML was succesfully saved!");
        }); 
    }
});