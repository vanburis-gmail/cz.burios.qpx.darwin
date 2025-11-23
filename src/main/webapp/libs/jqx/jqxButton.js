(function($) {
	var pluginName = "jqxButton";

	// Defaultní nastavení
	var defaults = {
		text: "Click me",
		onClick: null
	};

	// Metody pluginu
	var methods = {
		init: function(options) {
			var settings = $.extend({}, defaults, options);

			return this.each(function() {
				var $btn = $(this);

				// Pokud není button, vytvoříme ho
				if (!$btn.is("button")) {
					$btn = $("<button type='button'></button>").appendTo($(this));
				}

				// Uložíme options do data
				$btn.data(pluginName, settings);

				// Nastavíme text
				$btn.text(settings.text);

				// Odstraníme předchozí handler
				$btn.off("click." + pluginName);

				// Přidáme click handler
				if (typeof settings.onClick === "function") {
					$btn.on("click." + pluginName, function(e) {
						settings.onClick.call(this, e);
					});
				}
			});
		},

		getOptions: function() {
			var $btn = $(this);
			return $btn.data(pluginName);
		},

		setOptions: function(newOptions) {
			return this.each(function() {
				var $btn = $(this);
				var current = $btn.data(pluginName) || {};
				var updated = $.extend({}, current, newOptions);

				$btn.data(pluginName, updated);

				// Aktualizace textu pokud je změněn
				if (updated.text) {
					$btn.text(updated.text);
				}

				// Přeregistrujeme click handler
				$btn.off("click." + pluginName);
				if (typeof updated.onClick === "function") {
					$btn.on("click." + pluginName, function(e) {
						updated.onClick.call(this, e);
					});
				}
			});
		}
	};

	// Registrace pluginu
	$.fn[pluginName] = function(methodOrOptions) {
		if (methods[methodOrOptions]) {
			return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof methodOrOptions === "object" || !methodOrOptions) {
			return methods.init.apply(this, arguments);
		} else {
			$.error("Metoda " + methodOrOptions + " neexistuje pro " + pluginName);
		}
	};

	// Autodetekce podle data-role
	$(function() {
		$("[data-role='" + pluginName + "']").each(function() {
			var $el = $(this);
			$el[pluginName]({
				text: $el.data("text") || defaults.text,
				onClick: function() {
					alert("Autodetect click!");
				}
			});
		});
	});
})(jQuery);
