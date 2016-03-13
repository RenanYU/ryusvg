/*
    Plugin: RYUSVG;
    author: RenanYU;
    jQuery version required: 1.11.1 or above. Not tested with previous ones;
    version: 0.0.1
    description: Free to use, just give me credits when you use this
*/
(function ( $ ) {
 
	if ( typeof $ == "undefined" ) { 
		console.error("jQuery was not found!!");
		alert("jQuery was not found!!");
		return false;
	}

    $.fn.ryusvg = (function(config, filter, callback) {
       
        var PROPERTIES = {};

        if ( config.store != undefined ){
            PROPERTIES.store = config.store;
        }

        var fns = {
            CtoF:function(v){
                return Math.round(v * 1.8 + 32);
            },
            FtoC:function(v){
                return Math.round(( v - 32)  / 1.8 );
            },
            MHtoKH:function(v){
                return Math.round(v * 1.6);
            },
            KHtoMH:function(v){
                return Math.round(v * 0.62);
            }
        }

        var ryusvgcount = 1;

        var _this = $(this);

       	var getSize = (function(object){
       		if ( typeof object == "object") {
       			return Object.keys(object).length;
       		}
       	});

    	var SVGElements = {
    		paths:{},
    		texts:{},
    	};

    	var createElement = (function(type){
    		return document.createElementNS('http://www.w3.org/2000/svg',type);
    	});

        var setAttributes = (function(type, attributes){
            var el = createElement(type);
            $.each(attributes, function(index, data){
                el.setAttributeNS(null, index, data);
            });
            el.setAttributeNS(null,'data-ryusvg-id','ryusvg-'+ryusvgcount);
            ryusvgcount++;
            return el;

        });

        var attributeCalculated = (function(object, attributes){
            $.each(attributes, function(i,d){

                var array = [];

                $.each(PROPERTIES.store, function(index, data){
                    d.calculation(index, data, array, fns);
                });

                if ( typeof d.endCalculation == "function" ) d.endCalculation(array, fns);

                object.setAttributeNS(null,d.attribute, array.join(" "));

            });
            return object;
        });

    	var addPATH = (function(object){
            var newPATH = setAttributes('path', object.attributes);
            if ( object.attributecalculated != undefined ) newPATH = attributeCalculated(newPATH, object.attributecalculated);
    		SVGElements.paths[getSize(SVGElements.paths)] = newPATH;
    	});

    	var addTEXT = (function(object){
            var newTEXT = null;
            if ( object.doLoop == undefined ) {
                newTEXT = setAttributes('text', object.attributes);
                if ( object.attributecalculated != undefined ) newTEXT = attributeCalculated(newTEXT, object.attributecalculated);
                SVGElements.texts[getSize(SVGElements.texts)] = newTEXT;
                
            } else {
                $.each(PROPERTIES.store, function (i, d){
                    newTEXT = setAttributes('text', object.attributes);
                    $.each(object.attributecalculated, function(inn, da){
                        var array = [];
                        if ( object.attributecalculated != undefined ) {
                            da.calculation(i, d, array, fns);
                            if ( typeof da.endCalculation == "function") {
                                da.endCalculation(array, fns);
                            }
                        }
                        newTEXT.setAttributeNS(null, da.attribute, array.join(" "));

                        if ( object.convertContentText != undefined && object.convertContentText == true ){

                            newTEXT.textContent = fns[object.convertContentTextfn](d[object.attributes.textContentIndex]);

                        } else {
                            newTEXT.textContent = d[object.attributes.textContentIndex];
                        }

                        if ( object.attributes.textContentExtra != undefined ) newTEXT.textContent += object.attributes.textContentExtra;


                    });
                    SVGElements.texts[getSize(SVGElements.texts)] = newTEXT;
                    if ( object.listeners != undefined ){
                        $.each(object.listeners, function(index, data){
                            switch(index.toLowerCase()){
                                case 'click':
                                    $(newTEXT).on('click', function(){
                                        object.listeners.click(_this, this, i, d, object, fns);
                                    });
                                    break;
                            }
                        });
                    }
                });
            }
    	});


        var Append = (function(){
            $.each(SVGElements.paths, function(){
                _this.append(this);
            });

            $.each(SVGElements.texts, function(){
                _this.append(this);
            });

        });

    	var __callMethod = (function(method, filter, callback){

    		switch(method.toLowerCase()){
    			case 'getpath':
                    break;
                case 'gettext':
                    break;
                case 'allpaths':
                    break;
                case 'alltexts':
                    break;
                case 'getelements':
                    callback(_this.find(filter));
                    break;
    		}

    	});

    	var __construct = (function(config, filter, callback){

    		if ( typeof config == "object" ) {

    			if ( config.elements.length > 0 ) {

    				$.each(config.elements, function(){

    					switch(this.type.toLowerCase()){
    						case 'path':
    							addPATH(this);
    							break;
    						case 'text':
    							addTEXT(this);
    							break;
    					}

    				});

                    Append();
    			}

    		} else {
                if (typeof callback == "undefined" ){
                    console.error("You called a method of the plugin ryusvg, but you haven't declared a third parameter as callback function!");
                    return false;
                }
    			__callMethod(config, filter, callback);
    		}

    	});

    	__construct(config, filter, callback);

    });
 
}( jQuery ));