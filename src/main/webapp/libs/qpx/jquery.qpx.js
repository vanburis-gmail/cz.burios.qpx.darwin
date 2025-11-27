/*!
 * qpx.js
 * Základní jQuery plugin architektura: qpWidget + potomci
 */
(function($) {

	// ==========================
	// PLUGIN: qpWidget
	// ==========================
	$.fn.qpWidget = function(options) {
		return this.each(function() {
			var $el = $(this);

			// Defaultní nastavení
			var defaults = {
				enabled: true,
				theme: "default"
			};

			// Sloučení s options z data-* atributů
			var dataOptions = $el.data();
			var settings = $.extend({}, defaults, dataOptions, options);

			// Uložení konfigurace do elementu
			$el.data("qpWidget", settings);

			// 🔹 Funkce init
			function init() {
				if (settings.enabled) {
					$el.addClass("qp-widget qp-widget-" + settings.theme);
				}
			}

			// Spuštění init
			init();
		});
	};

	// 🔹 Potomek: qpNumberEditor
	$.fn.qpNumberEditor = function(options) {
		return this.each(function() {
			var $el = $(this);

			// Defaultní nastavení pro NumberEditor
			var defaults = {
				min: 0,
				max: 100,
				step: 1
			};

			// Sloučení s options z data-* atributů
			var dataOptions = $el.data();
			var settings = $.extend({}, defaults, dataOptions, options);

			// Uložení konfigurace do elementu
			$el.data("qpNumberEditor", settings);

			// 🔹 Funkce init
			function init() {
				$el.attr("contenteditable", true)
					.addClass("qp-number-editor");

				// Validace při změně
				$el.on("input", function() {
					var val = parseFloat($el.text());
					if (isNaN(val)) return;
					if (val < settings.min) val = settings.min;
					if (val > settings.max) val = settings.max;
					$el.text(val);
				});
			}

			// Spuštění init
			init();
		});
	};

	// 🔹 Autodetekce
	$(function() {
		// $("[data-role='qpWidget']").qpWidget();
		$("[data-role='qpNumberEditor']").qpNumberEditor();
	});

	$.fn.qpx = function(options){
	    return this.each(function(){
	        var $container = $(this);

	        // 🔹 Defaultní nastavení
	        var defaults = {
	            direction: "row", // nebo "column"
	            gap: "5px",
	            data: [],          // pole s definicí obsahu
	            onresize: null     // callback při resize
	        };

	        var settings = $.extend({}, defaults, options);

	        // Nastavení CSS pro flex layout
	        $container.css({
	            display: "flex",
	            flexDirection: settings.direction,
	            gap: settings.gap,
	            flex: "1"
	        });

	        // 🔹 Funkce pro generování obsahu
	        function renderCell(cellData){
	            var $cell = $("<div>").css({
	                flex: cellData.flex || "1",
	                border: cellData.border || "1px solid #ccc",
	                padding: cellData.padding || "5px",
	                display: "flex",
	                flexDirection: "column"
	            });

	            if(cellData){
	                // HTML obsah
	                if(cellData.html){
	                    $cell.html(cellData.html);
	                }

	                // Plugin
	                if(cellData.plugin){
	                    var pluginName = cellData.plugin;
	                    var pluginOptions = cellData.options || {};
	                    if(typeof $cell[pluginName] === "function"){
	                        $cell[pluginName](pluginOptions);
	                    }
	                }

	                // Vnořený layout
	                if(cellData.layout){
	                    $cell.qpx(cellData.layout);
	                }
	            }

	            return $cell;
	        }

	        // 🔹 Generování obsahu z data[]
	        settings.data.forEach(function(cellData){
	            var $cell = renderCell(cellData);
	            $container.append($cell);
	        });

	        // 🔹 Event onresize
	        if(typeof settings.onresize === "function"){
	            $(window).on("resize.qpx", function(){
	                settings.onresize.call($container, $container);
	            });
	        }

	        // Uložení konfigurace do elementu
	        $container.data("qpx", settings);
	    });
	};

	/*
	$("#layout").qpx({
	    direction: "row",
	    gap: "10px",
	    data: [
	        { html: "<strong>Levý panel</strong>", flex: 1 },
	        { 
	            layout: {
	                direction: "column",
	                gap: "5px",
	                data: [
	                    { plugin: "qpWidget", options: { theme: "dark" }, flex: 1 },
	                    { plugin: "qpNumberEditor", options: { min: 5, max: 20 }, flex: 2 },
	                    { html: "<em>Spodní část</em>", flex: 1 }
	                ]
	            },
	            flex: 2
	        }
	    ],
	    onresize: function(container){
	        console.log("Layout byl změněn velikostí okna:", container.width(), container.height());
	    }
	});	
	*/
})(jQuery);