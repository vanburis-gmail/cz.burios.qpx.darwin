(function($) {
	$.fn.bqPhoto = function(options) {
		var defaults = {
			loadUrl: null,   // adresa pro načtení obrázku
			uploadUrl: null, // adresa pro upload
			onUpload: null   // callback po uploadu
		};

		this.each(function() {
			var $container = $(this);

			// Pokud už plugin existuje, jen update options
			var existing = $container.data("bqPhoto");
			if (existing) {
				var newOptions = $.extend({}, existing.getOptions(), options);
				existing.setOptions(newOptions);
				existing.reload();
				return;
			}

			var settings = $.extend({}, defaults, options);

			$container.css({
				width: "160px",
				height: "160px",
				border: "1px solid #ccc",
				position: "relative",
				overflow: "hidden",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "#f9f9f9"
			});

			var $img = $("<img style='max-width:100%; max-height:100%; display:none;' />").appendTo($container);
			var $fileInput = $("<input type='file' style='display:none;' />").appendTo($container);
			var $btnSelect = $("<button type='button' style='position:absolute; bottom:5px; left:5px;'>Vybrat</button>").appendTo($container);
			var $btnUpload = $("<button type='button' style='position:absolute; bottom:5px; right:5px;' disabled>Odeslat</button>").appendTo($container);

			function render() {
				if (settings.loadUrl) {
					$img.attr("src", settings.loadUrl).show();
				} else {
					$img.hide();
				}
			}

			// výběr souboru
			$btnSelect.on("click", function() {
				$fileInput.trigger("click");
			});

			$fileInput.on("change", function() {
				if (this.files.length > 0) {
					$btnUpload.prop("disabled", false);
				} else {
					$btnUpload.prop("disabled", true);
				}
			});

			// upload souboru
			$btnUpload.on("click", async function() {
				if ($fileInput[0].files.length === 0) return;
				var file = $fileInput[0].files[0];
				var formData = new FormData();
				formData.append("file", file);

				try {
					/*
					let resp = await fetch(settings.uploadUrl, {
						method: "POST",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
						body: formData
					});
					*/
					let resp = await $.ajax({ 
					    method: "POST",
					    url: "" + settings.uploadUrl,
					    data: formData,
					    contentType: false,
					    processData: false,
					    cache: false,
						dataType: "json" 
					});  
					if (!resp.ok) throw new Error("Upload failed");

					// očekáváme JSON s novou adresou obrázku
					let data = await resp.json();
					if (data.url) {
						settings.loadUrl = data.url;
						render();
					}

					if (typeof settings.onUpload === "function") {
						settings.onUpload(file, resp, data);
					}
					$btnUpload.prop("disabled", true);
					$fileInput.val("");
				} catch (err) {
					alert("Chyba při uploadu: " + err.message);
				}
			});

			// API
			var api = {
				getOptions: function() { return $.extend({}, settings); },
				setOptions: function(newOptions) { settings = $.extend(settings, newOptions); },
				reload: function() { render(); }
			};

			$container.data("bqPhoto", api);
			render();
		});

		return this;
	};

	// Autodetekce
	$(function() {
		$("[data-role='bqPhoto']").each(function() {
			$(this).bqPhoto();
		});
	});
})(jQuery);