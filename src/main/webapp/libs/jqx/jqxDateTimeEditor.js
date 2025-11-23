(function($) {
	var pluginName = 'bqDateTimeEditor';
	var dataKey = 'plugin_' + pluginName;

	var defaults = {
		displayFormat: 'yyyy.MM.dd HH:mm:ss',
		submitFormat: 'yyyy-MM-dd HH:mm:ss',
		// Výchozí hodnota může být předána i přes data-initial-value
		initialValue: ''
	};

	function Plugin(element, options) {
		this.element = element;
		this.$element = $(element);
		this.options = $.extend({}, defaults, options);
		this.init();
	}

	Plugin.prototype = {
		init: function() {
			// Přepsání options z data atributů
			if (this.$element.data('initial-value') !== undefined) {
				this.options.initialValue = this.$element.data('initial-value');
			}

			this.buildInputs();
			this.bindEvents();
			this.setDateTime(this.options.initialValue || new Date().toISOString());
		},

		buildInputs: function() {
			this.$element.addClass('bq-datetime-container');
			// Viditelný input pro editaci
			this.$displayInput = $('<input type="text" class="bq-datetime-display" />').appendTo(this.$element);
			// Skrytý input pro hodnotu formuláře (submit format)
			this.$hiddenInput = $('<input type="hidden" class="bq-datetime-hidden" name="' + (this.$element.attr('id') || 'datetime') + '" />').appendTo(this.$element);
		},

		bindEvents: function() {
			var plugin = this;
			// Detekce změn ve viditelném inputu v reálném čase
			plugin.$displayInput.on('input.' + pluginName + ' change.' + pluginName, function() {
				plugin.updateHiddenValueFromDisplay($(this).val());
			});
		},

		// Helper funkce pro jednoduché (ale omezené) formátování data
		formatDate: function(date, format) {
			if (!date instanceof Date || isNaN(date.getTime())) return '';
			var o = {
				"M+": date.getMonth() + 1, // month
				"d+": date.getDate(),      // day
				"H+": date.getHours(),     // hour
				"m+": date.getMinutes(),   // minute
				"s+": date.getSeconds()    // second
			};
			// Rok
			if (/(y+)/.test(format)) {
				format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
			// Ostatní části data
			for (var k in o) {
				if (new RegExp("(" + k + ")").test(format)) {
					format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
				}
			}
			return format;
		},

		// Převede formát zobrazení na interní Date objekt a aktualizuje skrytý input
		updateHiddenValueFromDisplay: function(displayValue) {
			// Složitější parsování specifického formátu yyyy.MM.dd HH:mm:ss by vyžadovalo regex nebo knihovnu.
			// Zde předpokládáme, že uživatel zadává platný formát, nebo použijeme Date.parse (omezené)

			// Základní pokus o parsování formátu yyyy.MM.dd HH:mm:ss
			var parts = displayValue.match(/(\d{4})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
			var dateObj;
			if (parts && parts.length === 7) {
				// Měsíce v JS jsou 0-indexované (parts[2] je MM)
				dateObj = new Date(parts[1], parts[2] - 1, parts[3], parts[4], parts[5], parts[6]);
			} else {
				// Pokus o standardní parsování, pokud se náš formát nepovedl
				dateObj = new Date(displayValue);
			}

			if (dateObj && !isNaN(dateObj.getTime())) {
				var submitValue = this.formatDate(dateObj, this.options.submitFormat);
				this.$hiddenInput.val(submitValue);
			} else {
				this.$hiddenInput.val(''); // Neplatné datum
			}
		},

		// Nastaví hodnotu z externího zdroje (při inicializaci nebo z JS volání)
		setDateTime: function(value) {
			var dateObj = new Date(value);
			if (dateObj && !isNaN(dateObj.getTime())) {
				var displayValue = this.formatDate(dateObj, this.options.displayFormat);
				var submitValue = this.formatDate(dateObj, this.options.submitFormat);

				this.$displayInput.val(displayValue);
				this.$hiddenInput.val(submitValue);
			}
		},

		// Veřejná metoda pro získání hodnoty pro odeslání formuláře
		getValue: function() {
			return this.$hiddenInput.val();
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
		$('[data-role="bq-datetime-editor"]').bqDateTimeEditor();
	});

})(jQuery);