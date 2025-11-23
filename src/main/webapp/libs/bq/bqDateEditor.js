(function($) {
	$.fn.bqDateEditor = function(options) {
		var defaults = {
			name: "dateValue",
			value: null,
			onChange: null // uživatelský callback
		};

		return this.each(function() {
			var $container = $(this);

			var dataOptions = {
				name: $container.data("name"),
				value: $container.data("value")
			};

			var settings = $.extend({}, defaults, dataOptions, options);
			$container.data("bqDateEditor", settings);

			$container.empty();
			$container.addClass("bq-date-editor");

			var $input = $("<input type='text' class='bq-date-input' maxlength='10' />");
			var $hidden = $("<input type='hidden' />").attr("name", settings.name);

			// Inicializace hodnoty
			var initVal = settings.value;
			if (initVal && /^\d{4}-\d{2}-\d{2}$/.test(initVal)) {
				$input.val(initVal.replace(/-/g, "."));
				$hidden.val(initVal);
			} else if (initVal && /^\d{4}\.\d{2}\.\d{2}$/.test(initVal)) {
				$input.val(initVal);
				$hidden.val(initVal.replace(/\./g, "-"));
			} else {
				$input.val("0000.00.00");
				$hidden.val("");
			}

			// uložíme původní hodnotu pro porovnání
			var originalValue = $hidden.val();

			$container.append($input).append($hidden);

			// Povolit jen čísla, tečky jsou pevné
			$input.on("keydown", function(e) {
				var pos = $input[0].selectionStart;
				if ((e.key === "Backspace" || e.key === "Delete")) {
					var charAtPos = $input.val().charAt(pos - (e.key === "Backspace" ? 1 : 0));
					if (charAtPos === ".") {
						e.preventDefault();
						return;
					}
				}
				if (!/[0-9]/.test(e.key) &&
					!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Backspace", "Delete", "Tab", "Control", "v"].includes(e.key)) {
					e.preventDefault();
				}
			});

			// Podpora Ctrl+V
			$input.on("paste", function(e) {
				e.preventDefault();
				var pasted = (e.originalEvent.clipboardData || window.clipboardData).getData("text").trim();
				handleValue(pasted);
			});

			// Validace při psaní
			$input.on("input", function() {
				handleValue($input.val());
			});

			// Šipky nahoru/dolů
			$input.on("keydown", function(e) {
				var val = $input.val();
				var parts = parseDate(val);
				if (!parts) return;
				var start = $input[0].selectionStart;
				var end = $input[0].selectionEnd;
				if (e.key === "ArrowUp" || e.key === "ArrowDown") {
					e.preventDefault();
					var step = (e.key === "ArrowUp") ? 1 : -1;
					if (start <= 4) {
						parts.year = clamp(parts.year + step, 1900, 2100);
					} else if (start <= 7) {
						parts.month = clamp(parts.month + step, 1, 12);
					} else {
						var maxDay = daysInMonth(parts.year, parts.month);
						parts.day = clamp(parts.day + step, 1, maxDay);
					}
					var newVal = formatVisible(parts);
					$input.val(newVal);
					$hidden.val(formatHidden(parts));
					$input[0].setSelectionRange(start, end);
				}
			});

			// Spuštění uživatelského callbacku při blur jen pokud se hodnota změnila
			$input.on("blur", function() {
				var currentVal = $hidden.val();
				if (currentVal !== originalValue) {
					originalValue = currentVal; // aktualizujeme pro další porovnání
					if (typeof settings.onChange === "function") {
						settings.onChange.call($container[0], currentVal);
					}
				}
			});

			// Funkce pro zpracování hodnoty
			function handleValue(val) {
				var parts;
				if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
					parts = parseDate(val.replace(/-/g, "."));
				} else if (/^\d{4}\.\d{2}\.\d{2}$/.test(val)) {
					parts = parseDate(val);
				}
				if (parts) {
					if (parts.month > 12) parts.month = 12;
					if (parts.month < 1) parts.month = 1;
					var maxDay = daysInMonth(parts.year, parts.month);
					if (parts.day > maxDay) parts.day = maxDay;
					if (parts.day < 1) parts.day = 1;
					var visibleVal = formatVisible(parts);
					var hiddenVal = formatHidden(parts);
					$input.val(visibleVal);
					$hidden.val(hiddenVal);
					$input.removeClass("invalid").addClass("valid");
				} else {
					$input.removeClass("valid").addClass("invalid");
				}
			}

			// Pomocné funkce
			function parseDate(str) {
				var m = str.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
				if (!m) return null;
				return { year: +m[1], month: +m[2], day: +m[3] };
			}
			function formatVisible(p) {
				return p.year.toString().padStart(4, "0") + "." + String(p.month).padStart(2, "0") + "." + String(p.day).padStart(2, "0");
			}
			function formatHidden(p) {
				return p.year.toString().padStart(4, "0") + "-" + String(p.month).padStart(2, "0") + "-" + String(p.day).padStart(2, "0");
			}
			function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }
			function daysInMonth(y, m) { return new Date(y, m, 0).getDate(); }
		});
	};

	$.fn.setSeletedValue = function(value) {
		return this.each(function() {
			var $container = $(this);
			var $input = $container.find(".bq-date-input");
			var $hidden = $container.find("input[type=hidden]");
			if ($input && $hidden) {
				if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
					$input.val(value.replace(/-/g, "."));
					$hidden.val(value);
				} else if (/^\d{4}\.\d{2}\.\d{2}$/.test(value)) {
					$input.val(value);
					$hidden.val(value.replace(/\./g, "-"));
				}
			}
		});
	};
	$.fn.getSeletedValue = function() {
		var $container = this.first();
		var $hidden = $container.find("input[type=hidden]");
		return $hidden ? $hidden.val() : null;
	};

	$(function() {
		$("[data-role='bqDateEditor']").bqDateEditor();
	});
})(jQuery);