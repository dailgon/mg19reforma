var windowLoaded=!1;Event.observe(window,"load",function(){windowLoaded=!0}),Product.Config.prototype.fillSelect=function(t){},Product.Config.prototype.resetChildren=function(t){},Product.Config.prototype.configureForValues=function(){},Product.Config.prototype.origInitialize=Product.Config.prototype.initialize,Product.Config.prototype.initialize=function(t){this.origInitialize(t),this.configureObservers=[],this.loadOptions()},Product.Config.prototype.handleSelectChange=function(t){this.configureElement(t),this.configureObservers.each(function(e){e(t)})},Product.Config.prototype.origConfigure=Product.Config.prototype.configure,Product.Config.prototype.configure=function(t){this.origConfigure(t);var e=Event.element(t);this.configureObservers.each(function(t){t(e)})},Product.Config.prototype.configureSubscribe=function(t){this.configureObservers.push(t)},Product.Config.prototype.loadOptions=function(){this.settings.each(function(t){t.disabled=!1,t.options[0]=new Option(this.config.chooseText,"");var e=t.id.replace(/[a-z]*/,""),i=this.getAttributeOptions(e);if(i)for(var n=1,o=0;o<i.length;o++)i[o].allowedProducts=i[o].products.clone(),t.options[n]=new Option(this.getOptionLabel(i[o],i[o].price),i[o].id),void 0!==i[o].price&&t.options[n].setAttribute("price",i[o].price),t.options[n].setAttribute("data-label",i[o].label.toLowerCase()),t.options[n].config=i[o],n++;this.reloadOptionLabels(t)}.bind(this))},Product.ConfigurableSwatches=Class.create(),Product.ConfigurableSwatches.prototype={productConfig:!1,configurableAttributes:{},_O:{selectFirstOption:!1},_F:{currentAction:!1,firstOptionSelected:!1,nativeSelectChange:!0},_N:{resetTimeout:!1},_E:{cartBtn:{btn:!1,txt:["Add to Cart"],onclick:function(){return!1}},availability:!1,optionOver:!1,optionOut:!1,_last:{optionOver:!1},activeConfigurableOptions:[],allConfigurableOptions:[]},initialize:function(t,e){e&&"object"==typeof e&&this.setConfig(e),this.productConfig=t;var i=[];for(var n in t.config.attributes)i.push(t.config.attributes[n]);return this.configurableAttributes=i,this.run(),this},setConfig:function(t){this._O=Object.extend(this._O,t)},run:function(){return this._F.hasPresetValues="undefined"!=typeof spConfig&&void 0!==spConfig.values,this.setStockData(),this.configurableAttributes.each(function(t,e){this.setAttrData(t,e),t.options.each(function(e,i){this.setOptData(e,t,i),this._E.allConfigurableOptions.push(e),this.attachOptEvents(e)}.bind(this))}.bind(this)),this.productConfig.configureSubscribe(this.onSelectChange.bind(this)),this._F.hasPresetValues?(this.values=spConfig.values,this.configurableAttributes.each(function(t){var e=this.values[t.id],i={};try{t.options.each(function(t){if(e==t.id)throw this.selectOption(t),i}.bind(this))}catch(t){}}.bind(this)),this._F.presetValuesSelected=!0):this._O.selectFirstOption&&this.selectFirstOption(),this},setStockData:function(){var t=$$(".add-to-cart button.button");this._E.cartBtn={btn:t,txt:t.invoke("readAttribute","title"),onclick:t.length?t[0].getAttribute("onclick"):""},this._E.availability=$$("p.availability"),this._E.cartBtn.btn.invoke("up").invoke("observe","mouseenter",function(){clearTimeout(this._N.resetTimeout),this.resetAvailableOptions()}.bind(this))},setAttrData:function(t,e){var i=$("attribute"+t.id);return t._f={},t._f.isCustomOption=!1,t._f.isSwatch=i.hasClassName("swatch-select"),t._e={optionSelect:i,attrLabel:this._u.getAttrLabelElement(t.code),selectedOption:!1,_last:{selectedOption:!1}},t._e.optionSelect.attr=t,t._f.isSwatch&&(t._e.ul=$("configurable_swatch_"+t.code)),t},setOptData:function(t,e,i){return t.attr=e,t._f={isSwatch:e._f.isSwatch,enabled:!0,active:!1},t._e={option:this._u.getOptionElement(t,e,i)},t._e.option.opt=t,e._f.isSwatch&&(t._e.a=$("swatch"+t.id),t._e.li=$("option"+t.id),t._e.ul=e._e.ul),t},attachOptEvents:function(t){var e=t.attr;t._f.isSwatch&&t._e.a.observe("click",function(i){return Event.stop(i),this._F.currentAction="click",e._e._last.selectedOption=e._e.selectedOption,e._e.selectedOption=t,this.onOptionClick(e),!1}.bind(this)).observe("mouseenter",function(){this._F.currentAction="over-swatch",this._E.optionOver=t,this.onOptionOver(),this._E._last.optionOver=this._E.optionOver}.bind(this)).observe("mouseleave",function(){this._F.currentAction="out-swatch",this._E.optionOut=t,this.onOptionOut()}.bind(this))},selectFirstOption:function(){if(this.configurableAttributes.length){var t=this.configurableAttributes[0];if(t.options.length){var e=t.options[0];this.selectOption(e)}}},selectOption:function(t){var e=t.attr;this._F.currentAction="click",e._e._last.selectedOption=e._e.selectedOption,e._e.selectedOption=t,this.onOptionClick(e)},onSelectChange:function(t){var e=t.attr;if(this._F.nativeSelectChange){this._F.currentAction="change";var i,n=t.options[t.selectedIndex];if(n.opt)e._e._last.selectedOption=e._e.selectedOption,e._e.selectedOption=n.opt,e._e._last.selectedOption&&(e._e._last.selectedOption._f.active=!1),n.opt._f.active=!0,-1!==(i=this._E.activeConfigurableOptions.indexOf(e._e._last.selectedOption))&&this._E.activeConfigurableOptions.splice(i,1),this._E.activeConfigurableOptions.push(n.opt);else-1!==(i=this._E.activeConfigurableOptions.indexOf(e._e._last.selectedOption))&&this._E.activeConfigurableOptions.splice(i,1),e._e._last.selectedOption&&(e._e._last.selectedOption._f.active=!1);this.setAvailableOptions(),this.checkStockStatus()}},onOptionClick:function(t){var e=t._e.selectedOption;if(e){if(e!=t._e._last.selectedOption){if(t._e.attrLabel.innerHTML=this.getOptionLabel(e),e._f.isSwatch){e._e.ul.select("li").invoke("removeClassName","selected"),e._e.li.addClassName("selected");var i=t._e.optionSelect.up();i.hasClassName("validation-error")&&(i.removeClassName("validation-error"),i.down(".validation-advice").remove())}var n;t._e._last.selectedOption&&(t._e._last.selectedOption._f.active=!1),e._f.active=!0,-1!==(n=this._E.activeConfigurableOptions.indexOf(t._e._last.selectedOption))&&this._E.activeConfigurableOptions.splice(n,1),this._E.activeConfigurableOptions.push(e),this.setAvailableOptions(),e._f.isSwatch&&!t._f.isCustomOption&&this._F.firstOptionSelected&&this.previewAvailableOptions()}}else-1!==(n=this._E.activeConfigurableOptions.indexOf(t._e._last.selectedOption))&&this._E.activeConfigurableOptions.splice(n,1),t._e._last.selectedOption&&(t._e._last.selectedOption._f.active=!1),this.setAvailableOptions();this.checkStockStatus(),this._E.activeConfigurableOptions.each(function(t){var e=t._e.option.disabled;t._e.option.disabled=!1,t._e.option.selected=!0,t._e.option.disabled=e}),this._O.selectFirstOption&&!this._F.firstOptionSelected||this._F.hasPresetValues&&!this._F.presetValuesSelected||!windowLoaded?Event.observe(window,"load",function(){window.setTimeout(function(){this.updateSelect(t),this._F.firstOptionSelected=!0}.bind(this),200)}.bind(this)):(this.updateSelect(t),this._F.firstOptionSelected=!0)},onOptionOver:function(){if(PointerManager.getPointer()!=PointerManager.TOUCH_POINTER_TYPE){var t=this._E.optionOver,e=t.attr,i=this._E._last.optionOver;if(clearTimeout(this._N.resetTimeout),i&&i._f.isSwatch&&i._e.li.removeClassName("hover"),t._f.isSwatch&&t._e.li.addClassName("hover"),e._e.attrLabel.innerHTML=this.getOptionLabel(t),i&&i.attr.id!=t.attr.id&&(this.setAvailableOptions(),i.attr._e.attrLabel.innerHTML=i.attr._e.selectedOption?this.getOptionLabel(i.attr._e.selectedOption):""),!e._f.isCustomOption){this.previewAvailableOptions();var n=this._E.activeConfigurableOptions;t._f.active||(n=n.without(e._e.selectedOption)).push(t),this.checkStockStatus(n)}}},onOptionOut:function(){if(PointerManager.getPointer()!=PointerManager.TOUCH_POINTER_TYPE){var t=this._E.optionOver;this._N.resetTimeout=setTimeout(function(){this.resetAvailableOptions()}.bind(this),300),t&&t._f.isSwatch&&t._e.li.removeClassName("hover")}},setAvailableOptions:function(){var t=arguments;(t.length?t[0]:this._E.allConfigurableOptions).each(function(t){var e=[t.products];t.attr._e.selectedOption?this._E.activeConfigurableOptions.without(t.attr._e.selectedOption).each(function(t){e.push(t.products)}):this._E.activeConfigurableOptions.each(function(t){e.push(t.products)});var i=this._u.intersectAll(e);this.setOptionStatus(t,i.length)}.bind(this))},previewAvailableOptions:function(){var t=this._E.optionOver;if(t){var e=t.attr;this._E.allConfigurableOptions.each(function(i,n){var o=[i.products,t.products];if(e.id!=i.attr.id){i.attr._e.selectedOption||this._E.activeConfigurableOptions.each(function(e){e.attr.id!=t.attr.id&&o.push(e.products)});var s=this._u.intersectAll(o);this.setOptionStatus(i,s.length)}}.bind(this))}},resetAvailableOptions:function(){var t=this._E.optionOver;if(t){var e=t.attr;e._e.attrLabel.innerHTML=e._e.selectedOption?this.getOptionLabel(e._e.selectedOption):"",this._F.currentAction=!1,e._f.isCustomOption||(this.setAvailableOptions(),this.checkStockStatus()),this._E._last.optionOver=!1}},checkStockStatus:function(){var t=!0;(arguments.length?arguments[0]:this._E.activeConfigurableOptions).each(function(e){if(!e._f.enabled)throw t=!1,$break}),this.setStockStatus(t)},setStockStatus:function(t){t?(this._E.availability.each(function(t){(t=$(t)).addClassName("in-stock").removeClassName("out-of-stock"),t.select("span").invoke("update",Translator.translate("In Stock"))}),this._E.cartBtn.btn.each(function(t,e){(t=$(t)).disabled=!1,t.removeClassName("out-of-stock"),t.writeAttribute("onclick",this._E.cartBtn.onclick),t.title=""+Translator.translate(this._E.cartBtn.txt[e]),t.select("span span").invoke("update",Translator.translate(this._E.cartBtn.txt[e]))}.bind(this))):(this._E.availability.each(function(t){(t=$(t)).addClassName("out-of-stock").removeClassName("in-stock"),t.select("span").invoke("update",Translator.translate("Out of Stock"))}),this._E.cartBtn.btn.each(function(t){(t=$(t)).addClassName("out-of-stock"),t.disabled=!0,t.removeAttribute("onclick"),t.observe("click",function(t){return Event.stop(t),!1}),t.writeAttribute("title",Translator.translate("Out of Stock")),t.select("span span").invoke("update",Translator.translate("Out of Stock"))}))},setOptionStatus:function(t,e){t.attr,e=e>0;if(t._f.enabled=e,t._f.isSwatch){var i=e?"removeClassName":"addClassName";t._e.li[i]("not-available")}else if("click"==this._F.currentAction||"change"==this._F.currentAction){var n=e?"removeAttribute":"writeAttribute";$(t._e.option)[n]("disabled")}return e},updateSelect:function(t){!1!==t._e.selectedOption&&t._e.optionSelect&&(this._F.nativeSelectChange=!1,ConfigurableMediaImages.updateImage(t._e.optionSelect),this.productConfig.handleSelectChange(t._e.optionSelect),this._F.nativeSelectChange=!0)},getOptionLabel:function(t){return this.productConfig.getOptionLabel(t,t.price)},_u:{getAttrLabelElement:function(t){var e=$$("#select_label_"+t);if(e.length)return e[0];var i=$$("#"+t+"_label");return!!i.length&&i[0].insert({bottom:' <span id="select_label_'+t+'" class="select-label"></span>'}).select("span.select-label")[0]},getOptionElement:function(t,e,i){var n=e._e.optionSelect.options[i+1];if(n&&n.value==t.id)return n;for(var o,s=!1,a=e._e.optionSelect.options.length,r=0;r<a;r++)if((o=e._e.optionSelect.options[r]).value==t.id)throw s=o,$break;return s},intersectAll:function(t){if(0==t.length)return[];if(1==t.length)return t[0];for(var e=t[0],i=1;i<t.length&&e.length;i++)e=e.intersect(t[i]);return e}}};