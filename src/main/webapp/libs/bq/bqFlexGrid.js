(function($) {
	$.fn.bqFlexGrid = function(options) {
		var defaults = {
			// data je povinné: pole uzlů (row/col/content)
			data: [],
			// defaultní styly pro každý row / col
			defaultRow: { gap: 0, align: "stretch", justify: "flex-start", wrap: false },
			defaultCol: { gap: 0, align: "stretch", justify: "flex-start", wrap: false },
			// class prefixy pro snazší stylování
			classes: {
				row: "bq-row",
				col: "bq-col",
				content: "bq-content"
			}
		};

		function toBool(v) { return v === true || v === "true"; }
		function applyFlexStyles($el, type, props) {
			// společné flex styly
			$el.css("display", "flex");

			// řádek vs sloupec
			if (type === "row") {
				$el.css("flex-direction", "row");
			} else if (type === "col") {
				$el.css("flex-direction", "column");
			}

			// gap (pomocný – použijeme margin na dětech)
			if (props.gap != null) {
				var g = Number(props.gap) || 0;
				// reset marginů
				$el.children().css({ margin: 0 });
				// aplikace gapu: horizontálně/vertikálně podle direction
				if (type === "row") {
					$el.children().not(":last-child").css("margin-right", g + "px");
				} else {
					$el.children().not(":last-child").css("margin-bottom", g + "px");
				}
			}

			// align-items
			if (props.align) $el.css("align-items", props.align);
			// justify-content
			if (props.justify) $el.css("justify-content", props.justify);
			// flex-wrap
			if (props.wrap != null) $el.css("flex-wrap", toBool(props.wrap) ? "wrap" : "nowrap");

			// rozměry
			if (props.width) $el.css("width", props.width);
			if (props.height) $el.css("height", props.height);

			// flex parametry (pro uzel fungující jako item v rodiči)
			var flexParts = [];
			if (props.grow != null) flexParts[0] = props.grow;
			if (props.shrink != null) flexParts[1] = props.shrink;
			if (props.basis != null) flexParts[2] = props.basis;
			if (flexParts.length) {
				var grow = flexParts[0] != null ? flexParts[0] : 0;
				var shrink = flexParts[1] != null ? flexParts[1] : 1;
				var basis = flexParts[2] != null ? flexParts[2] : "auto";
				$el.css("flex", grow + " " + shrink + " " + basis);
			}

			// custom class / inline style
			if (props.class) $el.addClass(props.class);
			if (props.style) $el.attr("style", $el.attr("style") + ";" + props.style);
		}

		function createNode(node, classes, defaults) {
			var type = node.type;
			var props = node.props || {};

			if (type === "row" || type === "col") {
				// ... původní logika ...
			}

			if (type === "content") {
				// ... původní logika ...
			}

			if (type === "plugin") {
				// vytvoříme wrapper element
				var $pluginEl = $("<div></div>").addClass("bq-plugin");
				if (node.tag) {
					$pluginEl = $("<" + node.tag + "></" + node.tag + ">");
				}
				// inicializace pluginu
				if ($.fn[node.plugin]) {
					$pluginEl[node.plugin](node.options || {});
				} else {
					$pluginEl.text("Plugin '" + node.plugin + "' není dostupný.");
				}
				return $pluginEl;
			}

			return $("<div></div>").text("Unknown type: " + type);
		}

		this.each(function() {
			var $container = $(this);

			// načtení options z data-* (autodetekce)
			var dataOptions = {};
			var attrData = $container.data("grid"); // očekáváme JSON nebo objekt
			if (attrData) dataOptions.data = attrData;

			// inicializace nebo update
			var existing = $container.data("bqFlexGrid");
			if (existing) {
				var merged = $.extend({}, existing.getOptions(), dataOptions, options);
				existing.setOptions(merged);
				existing.render();
				return;
			}

			var settings = $.extend(true, {}, defaults, dataOptions, options);

			// API
			var api = {
				render: function() {
					$container.empty();
					// container jako sloupec, aby řádky šly pod sebe (volitelně)
					$container.css({ display: "flex", flexDirection: "column" });
					if (Array.isArray(settings.data)) {
						settings.data.forEach(function(node) {
							var $node = createNode(node, settings.classes, settings);
							$container.append($node);
						});
					}
				},
				setData: function(newData) {
					settings.data = Array.isArray(newData) ? newData : [];
				},
				getData: function() {
					return settings.data;
				},
				setOptions: function(newOptions) {
					settings = $.extend(true, settings, newOptions);
				},
				getOptions: function() {
					return $.extend(true, {}, settings);
				}
			};

			$container.data("bqFlexGrid", api);
			api.render();
		});

		return this;
	};

	// Autodetekce
	$(function() {
		$("[data-role='bqFlexGrid']").each(function() {
			$(this).bqFlexGrid();
		});
	});
})(jQuery);