(function($) {
	// Název pluginu byl změněn na 'jqxDropdown'
	var pluginName = 'jqxDropdown';
	var dataKey = 'plugin_' + pluginName;

	// 1. Defaultní možnosti
	var defaults = {
		data: [], // Pole objektů: [{ value: '1', text: 'Option 1' }]
		selectedValue: null,
		placeholder: 'Vyberte položku',
		onChange: function(value, text) { } // Callback funkce
	};

	// 2. Konstruktor pluginu
	function Plugin(element, options) {
		this.element = element;
		this.$element = $(element);
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	// Prototyp s logikou a metodami pluginu
	Plugin.prototype = {
		init: function() {
			this.buildDropdown();
			this.bindEvents();
			this.setSelectedValue(this.options.selectedValue);
		},

		buildDropdown: function() {
			var $container = this.$element;
			// Používáme třídu specifickou pro jqxDropdown, aby nedošlo ke kolizi stylů
			$container.addClass('jqx-dropdown-container');
			$container.html('<span class="selected-text">' + this.options.placeholder + '</span><ul class="jqx-dropdown-list"></ul>');

			var $list = $container.find('.jqx-dropdown-list');
			if (this.options.data && this.options.data.length > 0) {
				$.each(this.options.data, function(i, item) {
					$('<li data-value="' + item.value + '">' + item.text + '</li>').appendTo($list);
				});
			}
		},

		bindEvents: function() {
			var plugin = this;
			plugin.$element.on('click.' + pluginName, function(e) {
				e.stopPropagation();
				plugin.$element.find('.jqx-dropdown-list').slideToggle(100);
			});

			plugin.$element.on('click.' + pluginName, '.jqx-dropdown-list li', function(e) {
				e.stopPropagation();
				var $li = $(this);
				plugin.setSelectedValue($li.data('value'), $li.text());
				plugin.$element.find('.jqx-dropdown-list').hide();
			});

			$(document).on('click.' + pluginName, function() {
				$('.jqx-dropdown-list').hide();
			});
		},

		setValue: function(value, text) {
			var $selectedText = this.$element.find('.selected-text');
			var selectedTextToDisplay = text || (value === null ? this.options.placeholder : 'Neznámá položka');

			$selectedText.text(selectedTextToDisplay);
			this.options.selectedValue = value;
			this.options.onChange.call(this.element, value, selectedTextToDisplay);
		},

		getValue: function() {
			return this.options.selectedValue;
		}
	};

	// Obalová funkce pluginu (standardní jQuery wrapper)
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, dataKey)) {
				$.data(this, dataKey, new Plugin(this, options));
			}
		});
	};

	// --- ČÁST PRO PŘIDÁNÍ METOD PŘÍMO DO $.fn ---

	function callPluginMethod(methodName) {
		var instance = this.data(dataKey);
		if (instance && typeof instance[methodName] === 'function') {
			return instance[methodName].apply(instance, Array.prototype.slice.call(arguments, 1));
		}
		console.error('Metoda ' + methodName + ' neexistuje nebo plugin jqxDropdown není inicializován.');
	}

	// Přidání specifických metod přímo do $.fn
	$.fn.getSeletedItem = function() {
		return callPluginMethod.call(this, 'getValue');
	};

	$.fn.setSeletedItem = function(value) {
		return callPluginMethod.call(this, "setValue", value);
	};

	// 3. Autodetekce a automatická inicializace při načtení stránky
	$(function() {
		// Inicializuje všechny elementy, které mají atribut data-role="jqx-dropdown"
		$('[data-role="jqx-dropdown"]').jqxDropdown();
	});

})(jQuery);