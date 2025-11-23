(function($) {
	var pluginName = 'bqNumberEditor';
	var dataKey = 'plugin_' + pluginName;

	var defaults = {
		decimalPlaces: 2,      // Počet desetinných míst (z `data-decimal-places`)
		allowNegative: true,   // Povolit záporná čísla (z `data-allow-negative`)
		defaultValue: 0
	};

	function Plugin(element, options) {
		this.element = element;
		this.$element = $(element);
		this.options = $.extend({}, defaults, options);
		this.init();
	}

	Plugin.prototype = {
		init: function() {
			// Přepsání options z data atributů, pokud existují
			if (this.$element.data('decimal-places') !== undefined) {
				this.options.decimalPlaces = parseInt(this.$element.data('decimal-places'), 10);
			}
			if (this.$element.data('allow-negative') !== undefined) {
				this.options.allowNegative = (this.$element.data('allow-negative') === true || this.$element.data('allow-negative') === 'true');
			}

			this.bindEvents();
			this.formatValue();
		},
		bindEvents: function() {
			var plugin = this;
			plugin.$element.on('input.' + pluginName + ' change.' + pluginName, function() {
				plugin.formatValue();
			});
			// Omezení vstupu na povolené znaky
			plugin.$element.on('keydown.' + pluginName, function(e) {
				// Povoluje: Backspace, Delete, Tab, Escape, Enter
				if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
					// Povoluje: Ctrl+A, Command+A
					(e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
					// Povoluje: Home, End, Left, Right, Down, Up
					(e.keyCode >= 35 && e.keyCode <= 40)) {
					return; // Ponechá výchozí chování
				}
				// Zajišťuje, že se jedná o číslo nebo povolený znak tečky/čárky/mínus
				if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
					(e.keyCode < 96 || e.keyCode > 105) &&
					e.keyCode !== 110 && e.keyCode !== 190 && // Tečka/čárka
					e.keyCode !== 109 && e.keyCode !== 189 && // Znak mínus
					e.keyCode !== 188) { // Čárka (pro evropské formáty)
					e.preventDefault();
				}

				// Omezí vícenásobné tečky/čárky
				var currentValue = $(this).val();
				if ((e.keyCode === 110 || e.keyCode === 190 || e.keyCode === 188) && currentValue.indexOf('.') > -1) {
					e.preventDefault();
				}
				// Omezí vícenásobné mínus nebo mínus uprostřed textu
				if ((e.keyCode === 109 || e.keyCode === 189) && (currentValue.indexOf('-') > -1 || currentValue.length > 0)) {
					e.preventDefault();
				}
			});
		},

		formatValue: function() {
			var val = this.$element.val();
			// Nahradí evropskou čárku za tečku pro JS parsování
			val = val.replace(',', '.');

			if (!this.options.allowNegative) {
				val = val.replace('-', '');
			}

			var num = parseFloat(val);
			if (isNaN(num)) {
				// Neformátujeme, dokud uživatel píše, jen omezujeme vstup
				return;
			}

			// Můžeme nechat finální formátování na change/blur eventu pro lepší UX při psaní
			// var formatted = num.toFixed(this.options.decimalPlaces);
			// this.$element.val(formatted);
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, dataKey)) {
				$.data(this, dataKey, new Plugin(this, options));
			}
		});
	};

	// Autodetekce
	$(function() {
		$('[data-role="bq-number-editor"]').bqNumberEditor();
	});

})(jQuery);