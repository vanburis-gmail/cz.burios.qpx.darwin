(function($){
    $.fn.bqNumberEditor = function(options){
		var defaults = {
			decimals: 2,
			negative: true,
			format: true,
			maxLength: 15,
			onBlur: null,
			onChange: null
		};
		
        this.each(function(){
            var $input = $(this);

            // Pokud je element input[type=text], vytvoříme obalový div
            var $container;
            if($input.is("input[type='text']")){
                $container = $("<div class='bqNumberEditorContainer'></div>").css("display","flex");
                $input.after($container);
                $container.append($input);
            } else {
                $container = $input;
                $input = $container.find("input[type='text']");
                if($input.length === 0){
                    $input = $("<input type='text' />").appendTo($container);
                }
            }

            // Načtení options z data-*
            var dataOptions = {
                decimals: $input.data("decimals") || $container.data("decimals"),
                negative: $input.data("negative") || $container.data("negative"),
                format: $input.data("format") || $container.data("format"),
                maxLength: $input.data("maxlength") || $container.data("maxlength")
            };

            // Defaultní nastavení
            var settings = $.extend(defaults, dataOptions, options);

            // Hidden input
            var $hidden = $container.find("input[type='hidden']");
            if($hidden.length === 0){
                $hidden = $("<input type='hidden' />").appendTo($container);
            }

            // Formátování pro editor (s mezerami)
            function formatNumberDisplay(value){
                if(isNaN(value)) return "";
                var parts = value.toFixed(settings.decimals).split(".");
                var intPart = parts[0];
                var decPart = parts[1] ? "." + parts[1] : "";
                intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                return intPart + decPart;
            }

            // Formátování pro hidden (bez mezer)
            function formatNumberHidden(value){
                if(isNaN(value)) return "";
                return value.toFixed(settings.decimals);
            }

            // Aplikace maxLength
            function applyMaxLength(num){
                var str = num.toFixed(settings.decimals);
                if(str.length > settings.maxLength){
                    var parts = str.split(".");
                    var intPart = parts[0];
                    var decPart = parts[1] || "";
                    var allowedIntLength = settings.maxLength - (settings.decimals > 0 ? (settings.decimals + 1) : 0);
                    if(intPart.length > allowedIntLength){
                        intPart = intPart.substring(intPart.length - allowedIntLength);
                    }
                    str = intPart + (settings.decimals > 0 ? "." + decPart : "");
                }
                return parseFloat(str);
            }

            // Aktualizace hodnoty
            async function updateValue(val, formatDisplay){
                val = (""+val).replace(/\s+/g,"").replace(",",".");
                var firstDotIndex = val.indexOf(".");
                if(firstDotIndex !== -1){
                    val = val.substring(0, firstDotIndex+1) + val.substring(firstDotIndex+1).replace(/\./g,"");
                }

                var num = parseFloat(val);
                if(!settings.negative && num < 0){
                    num = Math.abs(num);
                }
                if(isNaN(num)) num = 0;

                num = applyMaxLength(num);
                $hidden.val(formatNumberHidden(num));

                if(formatDisplay){
                    $input.val(settings.format ? formatNumberDisplay(num) : num.toFixed(settings.decimals));
                }

                if(typeof settings.onChange === "function"){
                    await settings.onChange(num);
                }
            }

            // Odstraníme staré handlery
            $input.off(".bq");

            // Reálné formátování při psaní
            $input.on("input.bq", function(){
                var caretPos = this.selectionStart;
                var oldLength = $(this).val().length;

                updateValue($(this).val(), true);

                var newLength = $(this).val().length;
                var diff = newLength - oldLength;
                var newPos = caretPos + diff;
                if(newPos < 0) newPos = 0;
                if(newPos > newLength) newPos = newLength;

                this.setSelectionRange(newPos, newPos);
            });

            // Blur – doplnění 0.00 pokud prázdné
            $input.on("blur.bq", async function(){
                var val = $(this).val();
                if(val.trim() === ""){
                    updateValue(0, true);
                } else {
                    updateValue(val, true);
                }
                if(typeof settings.onBlur === "function"){
                    await settings.onBlur(parseFloat($hidden.val()));
                }
            });

            // Paste
            $input.on("paste.bq", function(e){
                e.preventDefault();
                var pasted = (e.originalEvent.clipboardData || window.clipboardData).getData("text");
                updateValue(pasted, true);
            });

            // API
            var api = {
                setValue: function(val){ updateValue(val, true); },
                getValue: function(){ return parseFloat($hidden.val()); },
                getOptions: function(){ return $.extend({}, settings); },
                setOptions: function(newOptions){
                    settings = $.extend(settings, newOptions);
                    // po změně nastavení znovu naformátujeme aktuální hodnotu
                    updateValue($hidden.val(), true);
                }
            };
            $container.data("bqNumberEditor", api);
            $input.data("bqNumberEditor", api);

            // Inicializace hodnoty z $input.val()
            var initVal = $input.val();
            if(initVal){
                updateValue(initVal, true);
            } else {
                updateValue(0, true);
            }
        });
        return this;
    };

    // Autodetekce přes data-role
    $(function(){
        $("[data-role='bqNumberEditor']").each(function(){
            $(this).bqNumberEditor();
        });
    });
})(jQuery);