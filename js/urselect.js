// urSelect 1.1.2 | MIT (2014-01-15)
;(function ($) {
    var UrSelect = function (element, options) {
        var elem = $(element),
            obj = this,
            customSelect, customOptions, wdw = $(window),
            dcm = $(document),
            bdy = $('body'),
            settings = $.extend({
                customizedClass: 'customizedElement',
                selectBody: '<div class="bg-select-left"></div><div class="disabled"></div><div class="bg-select-center">{text}</div><a href="javascript:void(0);"></a>',
                selectTextHolder: 'div.bg-select-center',
                selectOptionList: '<div><ul>{list}</ul></div>',
                selectOptionItem: '<li><a href="#" data-value="{value}">{text}</a></li>',
                selectClass: 'customSelect',
                selectDisabledClass: 'disabled-select',
                optionsClass: 'customOptions',
                optionsHiddenClass: 'customOptionsHidden',
                selectActiveClass: 'customSelectActive',
                height: false,
                flexible: false,
                selectImplemented: false,
                attr: false,
                showSelectedAttr: false,
                data: 'urSelect',
                customScroll: false,
                optionsMaxHeight: 150
            }, options || {});
        elem.options = $('option', elem);

        function _echo(mssg) {
            if (typeof window.console !== 'undefined') console.log(mssg)
        };

        function _hideOptions() {
            customOptions.addClass(settings.optionsHiddenClass);
            customSelect.removeClass(settings.selectActiveClass)
        };

        function _showOptions() {
            if ( settings.selectActiveClass.indexOf(' ') === -1 ) {
                $('div.' + settings.selectActiveClass).removeClass(settings.selectActiveClass);
            } else {
                var selClassArr = settings.selectActiveClass.split(' ');
                for (var i = 0, n = selClassArr.length; i < n; i++) {
                    $('div.' + selClassArr).removeClass(settings.selectActiveClass);
                }                
            }
            if ( settings.optionsClass.indexOf(' ') === -1 ) {
                $('div.' + settings.optionsClass).addClass(settings.optionsHiddenClass);
            } else {
                var optClassArr = settings.optionsClass.split(' ');
                for (var i = 0, n = optClassArr.length; i < n; i++) {
                    $('div.' + optClassArr).addClass(settings.optionsHiddenClass);
                }
            }
            var selectHeight = settings.height ? settings.height : customSelect.height();
            customOptions.css({
                left: customSelect.offset().left,
                top: customSelect.offset().top + selectHeight,
                width: customSelect.outerWidth()
            }).removeClass(settings.optionsHiddenClass);
            customSelect.addClass(settings.selectActiveClass);
        };

        function _tpl(obj, tpl) {
            return obj.replace(/{([^{}]*)}/g, function (a, b) {
                var r = tpl[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a
            })
        };

        function _bindClickOption() {
            customOptions.on('click.urselect', function (e) {
                var target = $(e.target);
                if (target.parents('a').length) {
                    target = target.closest('a')
                }
                if (!target.is('a')) {
                    return;
                }
                var customOptionsLink = target,
                    currentValue = customOptionsLink.attr('data-value'),
                    prevValue = elem.val();
                if (settings.appendSelectedAttr) {
                    elem.customSelectText.html(customOptionsLink.html())
                } else {
                    elem.customSelectText.text(customOptionsLink.text())
                }
                elem.options.each(function () {
                    if (currentValue === $(this).attr('value')) {
                        $(this).prop('selected', true)
                    } else {
                        $(this).prop('selected', false)
                    }
                });
                if (currentValue !== prevValue && prevValue !== false) {
                    elem.trigger('change')
                }
                _hideOptions();
                return false
            })
        };
        obj.render = function () {
            customOptions.off('click.urselect').remove();
            var customOptionsHTML = {
                list: ''
            };
            elem.options = $('option', elem);
            if ( elem.prop('disabled') ) {
                customSelect.addClass(settings.selectDisabledClass);
            } else {
                customSelect.removeClass(settings.selectDisabledClass);
            }
            elem.options.each(function () {
                var optionData = {
                    value: $(this).attr('value'),
                    text: $(this).text(),
                    attr: (settings.attr) ? $(this).attr(settings.attr) : ''
                };
                customOptionsHTML.list += _tpl(settings.selectOptionItem, optionData)
            });
            customOptions = $(_tpl(settings.selectOptionList, customOptionsHTML)).addClass(settings.optionsClass);
            bdy.append(customOptions);
            if (settings.customScroll && settings.optionsMaxHeight) {
                var scrollUl = $(settings.customScroll, customOptions),
                    maxScroll = settings.optionsMaxHeight ? settings.optionsMaxHeight : 150;
                if (scrollUl.outerHeight() > maxScroll) {
                    scrollUl
                        .css('height', maxScroll)
                        .jScrollPane();
                }
            }
            customOptions.addClass(settings.optionsHiddenClass);
            var customSelectAttr = false;
            if (settings.attr) {
                customSelectAttr = elem.options.filter(':selected').length ? elem.options.filter(':selected').attr(settings.attr) : elem.options.eq(0).attr(settings.attr)
            } else {
                customSelectAttr = ''
            }
            var selectData = {
                text: elem.options.filter(':selected').length ? elem.options.filter(':selected').text() : elem.options.eq(0).text(),
                attr: (settings.appendSelectedAttr) ? customSelectAttr : ''
            };
            customSelect.html(_tpl(settings.selectBody, selectData));
            elem.customSelectText = $(settings.selectTextHolder, customSelect);
            _bindClickOption()
        };
        obj.destroy = function () {
            dcm.off('click.urselect');
            wdw.off('resize.urselect');
            wdw.off('scroll.urselect');
            elem.removeClass(settings.customizedClass);
            customSelect.off('click.urselect').remove();
            $('a', customOptions).off('click.urselect');
            customOptions.remove();
            elem.removeData('customSelect')
        };
        obj.initialize = function () {
            var customSelectText = elem.options.filter(':selected').length ? elem.options.filter(':selected').text() : elem.options.eq(0).text(),
                customSelectAttr = false;
            if (settings.attr) {
                customSelectAttr = elem.options.filter(':selected').length ? elem.options.filter(':selected').attr(settings.attr) : elem.options.eq(0).attr(settings.attr)
            } else {
                customSelectAttr = ''
            }
            customSelect = $('<div class="' + settings.selectClass + '"></div>').css({
                width: settings.flexible ? '100%' : 'auto'
            });
            if ( elem.prop('disabled') ) {
                customSelect.addClass(settings.selectDisabledClass);
            }
            var selectData = {
                text: customSelectText,
                attr: (settings.appendSelectedAttr) ? customSelectAttr : ''
            };
            customSelect.html(_tpl(settings.selectBody, selectData));
            if ( elem.attr('placeholder') ) {
                $('.disabled', customSelect).text( elem.attr('placeholder') );
            }
            customSelect.insertAfter(elem);
            elem.customSelectText = $(settings.selectTextHolder, customSelect);
            var customOptionsHTML = {
                list: ''
            };
            elem.options = $('option', elem);
            elem.options.each(function () {
                var optionData = {
                    value: $(this).attr('value'),
                    text: $(this).text(),
                    attr: (settings.attr) ? $(this).attr(settings.attr) : ''
                };
                customOptionsHTML.list += _tpl(settings.selectOptionItem, optionData)
            });
            customOptions = $(_tpl(settings.selectOptionList, customOptionsHTML)).addClass(settings.optionsClass);
            bdy.append(customOptions);
            if (settings.customScroll && typeof $.fn.jScrollPane !== 'undefined' && settings.optionsMaxHeight) {
                var scrollUl = $(settings.customScroll, customOptions),
                    maxScroll = settings.optionsMaxHeight ? settings.optionsMaxHeight : 150;
                if (scrollUl.outerHeight() > maxScroll) {
                    scrollUl
                        .css('height', maxScroll)
                        .jScrollPane();
                }
            } else {
                settings.customScroll = false;
            }
            customOptions.addClass(settings.optionsHiddenClass);
            _bindClickOption();
            customSelect.on('click.urselect', function () {
                if (!customSelect.hasClass(settings.selectDisabledClass)) {
                    if (customSelect.hasClass(settings.selectActiveClass)) {
                        _hideOptions()
                    } else {
                        _showOptions()
                    }
                }
            });
            wdw.on('resize.urselect', function () {
                if (customSelect.hasClass(settings.selectActiveClass)) {
                    _hideOptions()
                }
            }).on('scroll.urselect', function (e) {
                var target = $(e.target);
                if (customSelect.hasClass(settings.selectActiveClass) && !target.hasClass('jspScrollable') && target.parents('div.jspVerticalBar').length === 0) {
                    _hideOptions()
                }
            });
            dcm.on('click.urselect', function (e) {
                var _target = $(e.target);
                if (_target.parents('div.' + settings.selectActiveClass).length) {
                    _target = _target.closest('div.' + settings.selectActiveClass)
                }
                if (!_target.hasClass(settings.selectActiveClass)  && !_target.hasClass('jspScrollable') && _target.parents('div.jspVerticalBar').length === 0) {
                    _hideOptions()
                }
            });
            elem.addClass(settings.customizedClass);
            if (settings.selectImplemented) settings.selectImplemented.apply(obj)
        }()
    };
    $.fn.urSelect = function (options) {
        return this.each(function () {
            var element = $(this);
            if (element.data('customSelect')) return;
            var urSelect = new UrSelect(this, options);
            element.data('customSelect', urSelect)
        })
    }
})(jQuery);