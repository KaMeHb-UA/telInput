window.telInput = (function(){
    return class{
        constructor(input, inputTpl, exportTpl){
            if (!document.getElementById('telInputStyle')) document.getElementsByTagName('head')[0].appendChild((function(a){a.setAttribute('id','telInputStyle');a.innerHTML = '[_data-telInput-placed-to]{border:0;padding:0;margin:0;width:0.5em;font:inherit;background:transparent;text-align:center}[_data-telInput-placed-to]:focus{outline-width:0}';return a})(document.createElement('style')));
            var div = document.createElement('div'), rect = input.getBoundingClientRect(), body = document.getElementsByTagName('body')[0], preg = /(\$\{\d+\})/;
            input.style.color = 'transparent';
            input.onfocus = function(){
                (function b(a){
                    if (a){
                        if(a.nodeName.toLowerCase() == 'input' && a.value == '') a.focus();
                        else b(a.nextSibling || (a.focus(), false))
                    }
                })(document.querySelector('[_data-telInput-placed-to]'))
            };
            // обрабатываем шаблоны
            var elements = [];
            inputTpl.split(preg).forEach(function(e){
                if (e.length != 0){
                    if(preg.test(e)){
                        elements.push((function(a){
                            var internalVal = '';
                            a.setAttribute('_data-telInput-placed-to', e);
                            a.setAttribute('maxlength', '1');
                            a.filled = function(){
                                (function b(a){
                                    if (a.nextSibling){
                                        if(a.nextSibling.nodeName.toLowerCase() == 'input' && a.nextSibling.value == '') a.nextSibling.focus();
                                        else b(a.nextSibling)
                                    }
                                })(a)
                            };
                            a.cleared = function(){
                                (function b(a){
                                    if (a.previousSibling){
                                        if(a.previousSibling.nodeName.toLowerCase() == 'input' && a.previousSibling.value != '') a.previousSibling.focus();
                                        else b(a.previousSibling)
                                    }
                                })(a)
                            };
                            a.onkeydown = function(){
                                var key = event.keyCode || event.charCode;
                                if((key == 8 || key == 46) && a.value == ''){
                                    a.cleared();
                                    return true
                                } else if(key != 8 && key != 46 && a.value != ''){
                                    a.filled();
                                    return true
                                }
                            };
                            setInterval(function(){
                                if (a.value != internalVal){
                                    // если изменено
                                    internalVal = a.value;
                                    input.value = exportTpl.replace((function(a){return new RegExp(preg.source,'g')})(preg), function(match){
                                        return document.querySelector('[_data-telInput-placed-to="' + match + '"]').value;
                                    });
                                    if (internalVal == '') a.cleared(); else a.filled();
                                }
                            }, 14);
                            return a;
                        })(document.createElement('input')));
                    } else {
                        elements.push((function(a){
                            return a.innerHTML = e, a;
                        })(document.createElement('span')));
                    }
                    div.appendChild(elements[elements.length - 1]);
                }
            });
            // готово
            div.style.position = 'absolute';
            div.style.top = rect.top + 1;
            div.style.left = rect.left + 3;
            div.style.pointerEvents = 'none';
            body.appendChild(div);
        }
    }
})();
