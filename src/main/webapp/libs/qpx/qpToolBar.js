/* ============================================================================
 * PLUGIN: qpWidhet
 * ============================================================================
 */
(function($) {
	$.fn.qpWidget = function(options) {
		var defaults = {
			elementAttr: {},   // např. { "data-role": "qpWidget" }
			height: null,      // číslo → px, string → CSS
			width: null,       // číslo → px, string → CSS
			hint: null,        // text nápovědy
			tabIndex: null,    // pořadí pro klávesovou navigaci
			visible: true,     // defaultně viditelné
			wrapper: null
		};

		var settings = $.extend(true, {}, defaults, options);

		return this.each(function() {
			var $element = $(this);
			var $wrapper = settings.wrapper ? $(settings.wrapper) : $element;

			// aplikace defaultních vlastností
			if (settings.elementAttr) {
				$.each(settings.elementAttr, function(attr, val) {
					$element.attr(attr, val);
				});
			}

			if (settings.height !== null) {
				if (typeof settings.height === "number") {
					$element.css("height", settings.height + "px");
				} else if (typeof settings.height === "string") {
					$element.css("height", settings.height);
				}
			}

			if (settings.width !== null) {
				if (typeof settings.width === "number") {
					$element.css("width", settings.width + "px");
				} else if (typeof settings.width === "string") {
					$element.css("width", settings.width);
				}
			}

			if (settings.hint) {
				$element.attr("title", settings.hint);
			}

			if (settings.tabIndex !== null) {
				$element.attr("tabindex", settings.tabIndex);
			}

			if (!settings.visible) {
				$element.hide();
			}

			var widget = {
				element: $element,
				wrapper: $wrapper,
				options: settings,

				bind: function(event, handler) {
					this.element.on(event, handler);
				},
				unbind: function(event) {
					this.element.off(event);
				},
				trigger: function(event, data) {
					this.element.trigger(event, data);
				},
				resize: function() {
					var h = this.element.outerHeight();
					this.wrapper.css("height", h + "px");
				},
				destroy: function() {
					this.unbind();
					this.element.removeData("qpWidget");
					this.element.empty();
				},
				setOptions: function(newOptions) {
					this.options = $.extend(true, this.options, newOptions);
					// re-aplikace nových options
					this.element.qpWidget(this.options);
				}
			};

			$element.data("qpWidget", widget);
		});
	};
})(jQuery);

/* ============================================================================
 * PLUGIN: qpToolbar
 * ============================================================================
 */
(function($) {
	$.fn.qpToolbar = function(optionsOrMethod) {
		return this.each(function() {
			var $el = $(this);

			var defaults = {
				items: [],       // [{ html:"<button>OK</button>" }, { widget: {...} }]
				responsive: false
			};

			var settings = $.extend(true, {}, defaults, optionsOrMethod);
			$el.data("qpToolbar", settings);

			function init() {
				$el.addClass("qp-toolbar").css({
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					position: "relative",
					width: "100%"
				});

				var $items = [];
				settings.items.forEach(function(item) {
					var $cell = $("<div>").addClass("qp-toolbar-item");

					if (item.html) {
						$cell.html(item.html);
					}
					if (item.widget) {
						// inicializace widgetu
						$cell.qpWidget(item.widget);
					}

					$el.append($cell);
					$items.push($cell);
				});

				// popup button + popup
				var $popupBtn = $("<button>").addClass("qp-toolbar-popup-btn").html("&#8942;").hide();
				var $popup = $("<div>").addClass("qp-toolbar-popup");
				$("body").append($popup); // plovoucí div mimo toolbar
				$el.append($popupBtn);

				$popupBtn.on("click", function(e) {
					e.stopPropagation();
					var offset = $el.offset();
					$popup.css({
						top: offset.top + $el.outerHeight(),
						left: offset.left,
						minWidth: $el.outerWidth()
					}).toggle();
				});

				$(document).on("click", function() {
					$popup.hide();
				});

				if (settings.responsive) {
					var ro = new ResizeObserver(function() {
						var availableWidth = $el.width() - $popupBtn.outerWidth();
						var usedWidth = 0;

						$popup.empty();
						$items.forEach(function($c) { $c.show(); });

						settings.items.forEach(function(item, idx) {
							var $c = $items[idx];
							var w = $c.outerWidth(true);
							if (usedWidth + w <= availableWidth) {
								usedWidth += w;
							} else {
								$c.hide();
								var $clone = $c.clone(true, true);
								$clone.css({
									display: "flex",
									width: "100%",
									justifyContent: "flex-start"
								});
								$popup.append($clone);
							}
						});

						if ($popup.children().length > 0) {
							$popupBtn.show();
						} else {
							$popupBtn.hide();
							$popup.hide();
						}
					});
					ro.observe($el[0]);
				}
			}

			init();
		});
	};
})(jQuery);

/* ============================================================================
 * PLUGIN: qpDataGridRow
 * ============================================================================
 */
(function($) {
	$.fn.qpDataGridRow = function(options) {
		return this.each(function() {
			$(this).qpWidget(options);
			var widget = $(this).data("qpWidget");
			var $el = widget.element;
			var defaults = {
				columns: [],
				data: {},
				responsive: false
			};
			var settings = $.extend(true, {}, defaults, widget.options );
			$el.data("qpDataGridRow", settings);
			/*
			*/
			function init() {
				$el.addClass("qp-datagrid-row");
				var $cells = [];
				settings.columns.forEach(function(col) {
					var $cell = $("<div>").addClass("qp-datagrid-cell");

					if (col.width) {
						if (col.width.indexOf("px") > -1) {
							$cell.css({ width: col.width, flex: "0 0 " + col.width });
						} else if (col.width.indexOf("%") > -1) {
							$cell.css({ width: col.width, flex: "0 0 " + col.width });
						} else {
							$cell.css({ flex: "0 0 auto" });
						}
					} else {
						$cell.css({ flex: "0 0 auto" });
					}
					var val = settings.data[col.field] || "";
					$cell.text(val);
					$el.append($cell);
					$cells.push($cell);
				});
				if ($el.find(".qp-datagrid-cell-filler").length === 0) {
					var $filler = $("<div>").addClass("qp-datagrid-cell-filler");
					$el.append($filler);
				}
				if ($el.find(".qp-datagrid-popup-btn").length === 0) {
					var $popupBtn = $("<button>").addClass("qp-datagrid-popup-btn").html("&#8942;").hide();
					var $popup = $("<div>").addClass("qp-datagrid-popup");
					$el.append($popupBtn);
					$popupBtn.on("click", function() {
						$popup.toggle();
					});
					$el.after($popup);
				}
				
				if (settings.responsive) {
					var ro = new ResizeObserver(function() {
						var availableWidth = $el.width() - $popupBtn.outerWidth();
						var usedWidth = 0;

						$popup.empty();
						$cells.forEach(function($c) { $c.show(); });

						// znovu spočítáme
						settings.columns.forEach(function(col, idx) {
							var $c = $cells[idx];
							var w = $c.outerWidth(true);
							if (usedWidth + w <= availableWidth) {
								usedWidth += w;
							} else {
								$c.hide();
							}
						});
						// naplníme popup podle pořadí columns
						settings.columns.forEach(function(col, idx) {
							var $c = $cells[idx];
							if ($c.is(":hidden")) {
								var val = settings.data[col.field] || "";
								var $popupItem = $("<div>").addClass("qp-datagrid-popup-item");
								if (col.label) {
									var $label = $("<div>").addClass("qp-datagrid-popup-label").text(col.label);
									$popupItem.append($label);
								}

								var $value = $("<div>").addClass("qp-datagrid-popup-value").text(val);
								$popupItem.append($value);

								$popup.append($popupItem);
							}
						});
						if ($popup.children().length > 0) {
							$popupBtn.show();
						} else {
							$popupBtn.hide();
							$popup.hide();
						}

						// aktualizace min-height popupu podle výšky řádku
						var rowHeight = $el.outerHeight();
						$popup.css("--row-height", rowHeight + "px");
					});
					ro.observe($el[0]);
				}
			}
			init();
		});
	};
	/*
	 */
	$(function() {
		$("[data-role='qpDataGridRow']").qpDataGridRow();
	});
})(jQuery);

/* ============================================================================
 * PLUGIN: qpDataGrid
 * ============================================================================
 */
(function($) {

	$.fn.qpDataGrid = function(options) {
		return this.each(function() {
			$(this).qpWidget(options);
			var widget = $(this).data("qpWidget");
			var $el = widget.element;

			var defaults = {
				columns: [],
				dataSource: { data: [], fetch: null },
				height: 300,
				responsive: false,
				pageSize: 20
			};
			var settings = $.extend(true, {}, defaults, widget.options );
			$el.data("qpDataGrid", settings);

			var currentPage = 0;
			var $body, $overlay;
			//
			function renderHeader() {
				var $headerWrapper = $("<div>").addClass("qp-datagrid-header-wrapper");
				var $header = $("<div>").addClass("qp-datagrid-header");
				$headerWrapper.append($header);
				$el.append($headerWrapper);

				settings.columns.forEach(function(col) {
					var $hcell = $("<div>").addClass("qp-datagrid-header-cell");
					$hcell.text(col.label || col.field);
					if (col.width) {
						if (col.width.indexOf("px") > -1) {
							$hcell.css({ width: col.width, flex: "0 0 " + col.width });
						} else if (col.width.indexOf("%") > -1) {
							$hcell.css({ width: col.width, flex: "0 0 " + col.width });
						} else {
							$hcell.css({ flex: "0 0 auto" });
						}
					} else {
						$hcell.css({ flex: "0 0 auto" });
					}
					$header.append($hcell);
				});
				return $headerWrapper;
			}

			function renderBody() {
				$body = $("<div>").addClass("qp-datagrid-body");
				$el.append($body);

				// overlay pro loading
				$overlay = $("<div>")
					.addClass("qp-datagrid-overlay")
					.css({
						position: "absolute",
						top: $body.position().top,
						left: $body.position().left,
						width: "100%",
						height: settings.height - $body.position().top,
						background: "#fff",
						opacity: 0.5,
						display: "none",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 100
					})
					.text("Loading...");
				$el.append($overlay);

				if (!settings.responsive) {
					$body.addClass("scroll-x");
				}
				return $body;
			}

			function showOverlay() { $overlay.show(); }
			function hideOverlay() { $overlay.hide(); }

			async function loadRows() {
				let rowsBatch = [];

				if (settings.dataSource.fetch) {
					showOverlay();
					try {
						rowsBatch = await settings.dataSource.fetch(currentPage, settings.pageSize);
					} catch (e) {
						console.error("Data fetch error", e);
					}
					hideOverlay();
				} else if (settings.dataSource.data) {
					// pokud je dataSource.data JSON pole objektů
					if (Array.isArray(settings.dataSource.data)) {
						rowsBatch = settings.dataSource.data.slice(
							currentPage * settings.pageSize,
							(currentPage + 1) * settings.pageSize
						);
					} else {
						console.error("dataSource.data musí být pole objektů (JSON).");
					}
				}

				rowsBatch.forEach(function(rowData) {
					var $row = $("<div>").attr("data-role", "qpDataGridRow");
					$body.append($row);
					$row.qpDataGridRow({
						columns: settings.columns,
						data: rowData,
						responsive: settings.responsive
					});
				});

				if (rowsBatch.length > 0) {
					currentPage++;
				}
			}

			function init() {
				$el.addClass("qp-datagrid").css({ height: settings.height, position: "relative" });
				var $headerWrapper = renderHeader();
				renderBody();

				// první dávka řádků
				loadRows();

				// lazy load při scrollování
				$body.on("scroll", async function() {
					if ($body.scrollTop() + $body.innerHeight() >= $body[0].scrollHeight - 10) {
						await loadRows();
					}
				});

				// synchronizace horizontálního scrollu (responsive:false)
				if (!settings.responsive) {
					$body.on("scroll", function() {
						$headerWrapper.scrollLeft($body.scrollLeft());
					});
				}
			}

			init();
		});
	};

})(jQuery);

/*
(function($) {
	$.fn.qpDataGrid = function(options) {
		return this.each(function() {
			// var $el = $(this);
			$(this).qpWidget(options);
			var widget = $(this).data("qpWidget");
			var $el = widget.element;
			var defaults = {
				columns: [],
				data: [],
				height: null,
				responsive: false
			};
			var settings = $.extend(true, {}, defaults, widget.options );
			$el.data("qpDataGrid", settings);
			//
			function init() {
				$el.addClass("qp-datagrid");
				if (settings.height !== null) {
					if (typeof settings.height === "number") {
						// číslo → px
						$el.css("height", settings.height + "px");
					} else if (typeof settings.height === "string") {
						// string → přímo CSS hodnota
						$el.css("height", settings.height);
					}
				}
				// header
				var $header = $("<div>").addClass("qp-datagrid-header");
				settings.columns.forEach(function(col) {
					var $hcell = $("<div>").addClass("qp-datagrid-header-cell");
					$hcell.text(col.label || col.field);
					if (col.width) {
						if (col.width.indexOf("px") > -1) {
							$hcell.css({ width: col.width, flex: "0 0 " + col.width });
						} else if (col.width.indexOf("%") > -1) {
							$hcell.css({ width: col.width, flex: "0 0 " + col.width });
						} else {
							$hcell.css({ flex: "0 0 auto" });
						}
					} else {
						$hcell.css({ flex: "0 0 auto" });
					}
					$header.append($hcell);
				});
				$el.append($header);

				// body
				var $body = $("<div>").addClass("qp-datagrid-body");
				$el.append($body);
				if (!settings.respoksile) {
					widget.wrapper.css({
						"overflow-x": "aotu"
					});
				}
				settings.data.forEach(function(rowData) {
					var $row = $("<div>").attr("data-role", "qpDataGridRow");
					$body.append($row);
					$row.qpDataGridRow({
						columns: settings.columns,
						data: rowData,
						responsive: settings.responsive
					});
				});
				// pokud není responsive → horizontální scroll
				if (!settings.responsive) {
					$body.addClass("scroll-x");
				}
			}
			init();
		});
	};

	$(function() {
		$("[data-role='qpDataGridRow']").qpDataGridRow();
	});
})(jQuery);
*/

/* ============================================================================
 * PLUGIN: qpTabs
 * ============================================================================
 */
(function($) {
	$.fn.qpTabs = function(options) {
		return this.each(function() {
			// inicializace jako qpWidget → propíše defaultní vlastnosti
			$(this).qpWidget(options);
			var widget = $(this).data("qpWidget");

			var settings = $.extend({
				items: [],
				onSelect: null,
				onClose: null,
				onInitWidget: null
			}, widget.options);

			var $container = widget.element.addClass("qp-tabs");

			// výška/šířka/hint/tabIndex/visible už aplikoval qpWidget
			// takže tady jen doplníme logiku záložek

			var $tabHeader = $("<ul>").addClass("qp-tabs-header");
			var $tabContent = $("<div>").addClass("qp-tabs-content");

			$.each(settings.items, function(index, item) {
				var $tab = $("<li>")
					.addClass("qp-tab")
					.text(item.label);

				if (item.closable) {
					var $close = $("<span>")
						.addClass("qp-tab-close")
						.html("&times;")
						.on("click", function(e) {
							e.stopPropagation();
							$tab.remove();
							$tabContent.children().eq(index).remove();
							if (typeof settings.onClose === "function") {
								settings.onClose(index, item);
							}
						});
					$tab.append($close);
				}

				$tab.on("click", function() {
					$tabHeader.find(".active").removeClass("active");
					$(this).addClass("active");
					$tabContent.children().hide().eq(index).show();
					if (typeof settings.onSelect === "function") {
						settings.onSelect(index, item);
					}
				});

				$tabHeader.append($tab);

				var $content = $("<div>")
					.addClass("qp-tab-body")
					.attr("id", item.content.id || ("tab-content-" + index))
					.hide();

				if (item.content.type === "html") {
					$content.html(item.content.html || "");
				} else if (item.content.type === "widget") {
					var $widgetDiv = $("<div>")
						.attr("id", item.content.id)
						.attr("data-role", item.content.role);

					$content.append($widgetDiv);

					if (item.content.role === "qpDataGrid" && typeof $widgetDiv.qpDataGrid === "function") {
						$widgetDiv.qpDataGrid(item.content.options || {});
					}

					if (typeof settings.onInitWidget === "function") {
						settings.onInitWidget(index, item, $widgetDiv);
					}
				}

				$tabContent.append($content);
			});

			$tabHeader.find("li").first().addClass("active");
			$tabContent.children().first().show();

			$container.append($tabHeader).append($tabContent);
		});
	};
})(jQuery);

