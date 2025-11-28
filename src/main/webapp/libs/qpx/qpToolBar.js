(function($){

  // Základní předek: qpWidget
  $.fn.qpWidget = function(optionsOrMethod){
    return this.each(function(){
      var $el = $(this);

      if(typeof optionsOrMethod === "string"){
        var method  = optionsOrMethod;
        var settings = $el.data("qpWidget");

        if(method === "destroy"){
          var ro = $el.data("qpWidgetResizeObserver");
          if(ro){ ro.disconnect(); $el.removeData("qpWidgetResizeObserver"); }
          $el.removeData("qpWidget");
          $el.removeClass(function(i, cls){
            return (cls.match(/(^|\s)qp-widget-\S+/g) || []).join(' ');
          });
        }
        return;
      }

      var defaults = {
        enabled: true,
        theme: "default",
        onResize: null
      };
      var settings = $.extend({}, defaults, $el.data(), optionsOrMethod);

      settings.getOptions = function(){ return settings; };
      settings.getOption  = function(name){ return settings[name]; };
      settings.setOption  = function(name, value){ settings[name] = value; };

      $el.data("qpWidget", settings);

      function init(){
        if(settings.enabled){
          $el.addClass("qp-widget qp-widget-" + settings.theme);
        }
        if(typeof settings.onResize === "function"){
          var ro = new ResizeObserver(function(entries){
            entries.forEach(function(entry){
              settings.onResize.call($el, entry.contentRect);
            });
          });
          ro.observe($el[0]);
          $el.data("qpWidgetResizeObserver", ro);
        }
      }
      init();
    });
  };

  // Autodetekce
  $(function(){
    // $("[data-role='qpToolBar']").qpToolBar();
    $("[data-role='qpWidget']").qpWidget();
  });

})(jQuery);

// ============================================================================
// PLUGIN
// ============================================================================
(function($){

    $.fn.qpDataGridRow = function(optionsOrMethod){
        return this.each(function(){
            var $el = $(this);

            var defaults = {
                columns: [],
                data: {},
                responsive: false
            };

            var settings = $.extend(true, {}, defaults, optionsOrMethod);
            $el.data("qpDataGridRow", settings);

            function init(){
                $el.addClass("qp-datagrid-row");

                var $cells = [];
                settings.columns.forEach(function(col){
                    var $cell = $("<div>").addClass("qp-datagrid-cell");

                    if(col.width){
                        if(col.width.indexOf("px")>-1){
                            $cell.css({ width: col.width, flex:"0 0 "+col.width });
                        } else if(col.width.indexOf("%")>-1){
                            $cell.css({ width: col.width, flex:"0 0 "+col.width });
                        } else {
                            $cell.css({ flex:"0 0 auto" });
                        }
                    } else {
                        $cell.css({ flex:"0 0 auto" });
                    }

                    var val = settings.data[col.field] || "";
                    $cell.text(val);

                    $el.append($cell);
                    $cells.push($cell);
                });

                var $filler = $("<div>").addClass("qp-datagrid-cell-filler");
                $el.append($filler);

                var $popupBtn = $("<button>").addClass("qp-datagrid-popup-btn").html("&#8942;").hide();
                var $popup = $("<div>").addClass("qp-datagrid-popup");
                $el.append($popupBtn).append($popup);

                $popupBtn.on("click", function(){
                    $popup.toggle();
                });

                if(settings.responsive){
                    var ro = new ResizeObserver(function(){
                        var availableWidth = $el.width() - $popupBtn.outerWidth();
                        var usedWidth = 0;

                        $popup.empty();
                        $cells.forEach(function($c){ $c.show(); });

                        // znovu spočítáme
                        settings.columns.forEach(function(col, idx){
                            var $c = $cells[idx];
                            var w = $c.outerWidth(true);
                            if(usedWidth + w <= availableWidth){
                                usedWidth += w;
                            } else {
                                $c.hide();
                            }
                        });

                        // naplníme popup podle pořadí columns
                        settings.columns.forEach(function(col, idx){
                            var $c = $cells[idx];
                            if($c.is(":hidden")){
                                var val = settings.data[col.field] || "";
                                var $popupItem = $("<div>").addClass("qp-datagrid-popup-item");

                                if(col.label){
                                    var $label = $("<div>").addClass("qp-datagrid-popup-label").text(col.label);
                                    $popupItem.append($label);
                                }

                                var $value = $("<div>").addClass("qp-datagrid-popup-value").text(val);
                                $popupItem.append($value);

                                $popup.append($popupItem);
                            }
                        });

                        if($popup.children().length > 0){
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
	$(function(){
	  // $("[data-role='qpToolBar']").qpToolBar();
	  $("[data-role='qpWidget']").qpWidget();
	});
})(jQuery);	


// ============================================================================
//
// ============================================================================

(function($){

    $.fn.qpToolbar = function(optionsOrMethod){
        return this.each(function(){
            var $el = $(this);

            var defaults = {
                items: [],       // [{ html:"<button>OK</button>" }, { widget: {...} }]
                responsive: false
            };

            var settings = $.extend(true, {}, defaults, optionsOrMethod);
            $el.data("qpToolbar", settings);

            function init(){
                $el.addClass("qp-toolbar").css({
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    position: "relative",
                    width: "100%"
                });

                var $items = [];
                settings.items.forEach(function(item){
                    var $cell = $("<div>").addClass("qp-toolbar-item");

                    if(item.html){
                        $cell.html(item.html);
                    }
                    if(item.widget){
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

                $popupBtn.on("click", function(e){
                    e.stopPropagation();
                    var offset = $el.offset();
                    $popup.css({
                        top: offset.top + $el.outerHeight(),
                        left: offset.left,
                        minWidth: $el.outerWidth()
                    }).toggle();
                });

                $(document).on("click", function(){
                    $popup.hide();
                });

                if(settings.responsive){
                    var ro = new ResizeObserver(function(){
                        var availableWidth = $el.width() - $popupBtn.outerWidth();
                        var usedWidth = 0;

                        $popup.empty();
                        $items.forEach(function($c){ $c.show(); });

                        settings.items.forEach(function(item, idx){
                            var $c = $items[idx];
                            var w = $c.outerWidth(true);
                            if(usedWidth + w <= availableWidth){
                                usedWidth += w;
                            } else {
                                $c.hide();
                                var $clone = $c.clone(true,true);
                                $clone.css({
                                    display: "flex",
                                    width: "100%",
                                    justifyContent: "flex-start"
                                });
                                $popup.append($clone);
                            }
                        });

                        if($popup.children().length > 0){
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

// ============================================================================
// PLUGIN
// ============================================================================
(function($){

    $.fn.qpDataGrid = function(optionsOrMethod){
        return this.each(function(){
            var $el = $(this);

            var defaults = {
                columns: [],
                rows: [],
                height: 300,
                responsive: false
            };

            var settings = $.extend(true, {}, defaults, optionsOrMethod);
            $el.data("qpDataGrid", settings);

            function init(){
                $el.addClass("qp-datagrid").css({
                    height: settings.height
                });

                // header
                var $header = $("<div>").addClass("qp-datagrid-header");
                settings.columns.forEach(function(col){
                    var $hcell = $("<div>").addClass("qp-datagrid-header-cell");
                    $hcell.text(col.label || col.field);
                    if(col.width){
                        if(col.width.indexOf("px")>-1){
                            $hcell.css({ width: col.width, flex:"0 0 "+col.width });
                        } else if(col.width.indexOf("%")>-1){
                            $hcell.css({ width: col.width, flex:"0 0 "+col.width });
                        } else {
                            $hcell.css({ flex:"0 0 auto" });
                        }
                    } else {
                        $hcell.css({ flex:"0 0 auto" });
                    }
                    $header.append($hcell);
                });
                $el.append($header);

                // body
                var $body = $("<div>").addClass("qp-datagrid-body");
                $el.append($body);

                settings.rows.forEach(function(rowData){
                    var $row = $("<div>").attr("data-role","qpDataGridRow");
                    $body.append($row);
                    $row.qpDataGridRow({
                        columns: settings.columns,
                        data: rowData,
                        responsive: settings.responsive
                    });
                });

                // pokud není responsive → horizontální scroll
                if(!settings.responsive){
                    $body.addClass("scroll-x");
                }
            }

            init();
        });
    };

})(jQuery);
