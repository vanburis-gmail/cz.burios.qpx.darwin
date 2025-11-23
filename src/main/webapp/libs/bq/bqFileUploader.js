(function($) {
	$.fn.bqFileUploader = function(options) {
		
		var defaults = {
			buttonText: "Vybrat soubor",
			uploadText: "Odeslat",
			accept: null,
			multi: false,       // default single
			showSubmit: false,  // default tlačítko odeslat není vidět
			uploadUrl: null,    // defaultní URL pro upload
			onChange: null,
			onSubmit: null      // vlastní async funkce
		};

		this.each(function() {
			var $container = $(this);

			var dataOptions = {
				buttonText: $container.data("button-text"),
				uploadText: $container.data("upload-text"),
				accept: $container.data("accept"),
				multi: $container.data("multi") === true || $container.data("multi") === "true",
				showSubmit: $container.data("show-submit") === true || $container.data("show-submit") === "true",
				uploadUrl: $container.data("upload-url")
			};

			// Pokud už plugin existuje, jen aktualizujeme options
			var existing = $container.data("bqFileUploader");
			if (existing) {
				var newOptions = $.extend(existing.getOptions(), dataOptions, options);
				existing.setOptions(newOptions);
				return;
			}

			// --- První inicializace ---
			var settings = $.extend({}, defaults, dataOptions, options);			
			
			$container.css({
				display: "flex",
				height: "25px",
				position: "relative",
				alignItems: "center"
			});

			// readonly input
			var $textInput = $("<input type='text' readonly style='flex:1; cursor:pointer;' />").appendTo($container);

			// tlačítko šipka (jen pokud multi)
			var $toggleBtn = null;
			if (settings.multi) {
				$toggleBtn = $("<button type='button' style='width:8px; padding:0; margin-left:2px;'>▼</button>").appendTo($container);
			}

			// tlačítko výběru souboru
			var $button = $("<button type='button' style='margin-left:5px;'>" + settings.buttonText + "</button>").appendTo($container);

			// tlačítko odeslání (jen pokud showSubmit)
			var $submitBtn = null;
			if (settings.showSubmit) {
				$submitBtn = $("<button type='button' style='margin-left:5px;'>" + settings.uploadText + "</button>").appendTo($container);
			}

			// hidden file input
			var $fileInput = $("<input type='file' style='display:none;' />").appendTo($container);
			if (settings.accept) {
				$fileInput.attr("accept", settings.accept);
			}
			if (settings.multi) {
				$fileInput.attr("multiple", "multiple");
			}

			// popup seznam souborů
			var $popup = $("<div class='bqFilePopup' style='display:none; position:absolute; top:100%; left:0; right:0; background:#fff; border:1px solid #ccc; max-height:150px; overflow:auto; z-index:1000;'></div>").appendTo($container);

			var filesArray = [];

			// kliknutí na textInput otevře file dialog
			$textInput.on("click", function() {
				$fileInput.trigger("click");
			});

			// kliknutí na toggleBtn otevře/zavře popup (jen pokud multi)
			if ($toggleBtn) {
				$toggleBtn.on("click", function() {
					$popup.toggle();
				});
			}

			// kliknutí na button otevře file dialog
			$button.on("click", function() {
				$fileInput.trigger("click");
			});

			// kliknutí na submitBtn
			if ($submitBtn) {
				$submitBtn.on("click", async function() {
					if (typeof settings.onSubmit === "function") {
						await settings.onSubmit(filesArray);
					} else if (settings.uploadUrl) {
						var formData = new FormData();
						filesArray.forEach(function(file) {
							formData.append("files[]", file);
						});
						try {
							let resp = await fetch(settings.uploadUrl, {
								method: "POST",
								body: formData
							});
							if (!resp.ok) throw new Error("Upload failed");
							alert("Upload hotov!");
						} catch (err) {
							alert("Chyba při uploadu: " + err.message);
						}
					} else {
						alert("Není definována funkce onSubmit ani uploadUrl.");
					}
				});
			}

			// po výběru souborů
			$fileInput.on("change", function() {
				var newFiles = Array.from(this.files);
				if (settings.multi) {
					newFiles.forEach(function(f) {
						filesArray.push(f);
					});
					renderList();
				} else {
					filesArray = newFiles.slice(0, 1);
					$textInput.val(filesArray.length ? filesArray[0].name : "");
				}
				if (typeof settings.onChange === "function") {
					settings.onChange(filesArray);
				}
				$fileInput.val(""); // reset inputu
			});

			// vykreslení seznamu do popupu
			function renderList() {
				$popup.empty();
				if (filesArray.length === 0) {
					$textInput.val("");
					return;
				}
				$textInput.val(filesArray.map(f => f.name).join(", "));
				filesArray.forEach(function(file, index) {
					var $row = $("<div style='display:flex; align-items:center; padding:2px 5px;'></div>");
					var $name = $("<span style='flex:1;'>" + file.name + "</span>");
					var $remove = $("<button type='button' style='margin-left:5px;'>×</button>");
					$remove.on("click", function() {
						filesArray.splice(index, 1);
						renderList();
						if (typeof settings.onChange === "function") {
							settings.onChange(filesArray);
						}
					});
					$row.append($name).append($remove);
					$popup.append($row);
				});
			}

			// API
			var api = {
				getFiles: function() {
					return filesArray;
				},
				clearFiles: function() {
					filesArray = [];
					renderList();
					$textInput.val("");
				},
				getOptions: function() {
					return $.extend({}, settings);
				},
				setOptions: function(newOptions) {
					settings = $.extend(settings, newOptions);
					$button.text(settings.buttonText);
					if ($submitBtn) {
						$submitBtn.text(settings.uploadText);
						if (!settings.showSubmit) {
							$submitBtn.hide();
						} else {
							$submitBtn.show();
						}
					}
					if (settings.accept) {
						$fileInput.attr("accept", settings.accept);
					} else {
						$fileInput.removeAttr("accept");
					}
					if (settings.multi) {
						$fileInput.attr("multiple", "multiple");
						if (!$toggleBtn) {
							$toggleBtn = $("<button type='button' style='width:8px; padding:0; margin-left:2px;'>▼</button>").insertAfter($textInput);
							$toggleBtn.on("click", function() { $popup.toggle(); });
						}
						$toggleBtn.show();
					} else {
						$fileInput.removeAttr("multiple");
						if ($toggleBtn) $toggleBtn.hide();
						$popup.hide();
					}
				}
			};

			$container.data("bqFileUploader", api);
		});

		return this;
	};

	// Autodetekce přes data-role
	$(function() {
		$("[data-role='bqFileUploader']").each(function() {
			$(this).bqFileUploader();
		});
	});
})(jQuery);