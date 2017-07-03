var postcss = require('postcss');
var resolvedNestedSelector = require('postcss-resolve-nested-selector');

module.exports = postcss.plugin('sass2yaml', function sass2yaml(options) {
 
    return function (css) {
 
        options = options || {};
            css.walkRules(function(rule) {
            rule.selectors.forEach(function(selector) {
                
                rule.nodes.forEach(function(node){

                    const rules = resolvedNestedSelector(selector, rule);
                    if( node.prop, node.value) {
                        console.log(rules, node.prop, node.value);
                    }
                })
            });
        });
    }
});