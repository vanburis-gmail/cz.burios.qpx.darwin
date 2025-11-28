(function($){
  $.fn.qpToolBar = function(options){
    const settings = $.extend({
      sections: {
        left: [],
        center: [],
        right: [],
        sidebar: []
      },
      widths: { // default rovnoměrné rozložení
        left: "1",
        center: "1",
        right: "1"
      }
    }, options);

    return this.each(function(){
      const $toolbar = $(this).addClass("qp-toolbar");

      const $left = $("<div>").addClass("qp-toolbar-left").css("flex", settings.widths.left).appendTo($toolbar);
      const $center = $("<div>").addClass("qp-toolbar-center").css("flex", settings.widths.center).appendTo($toolbar);
      const $right = $("<div>").addClass("qp-toolbar-right").css("flex", settings.widths.right).appendTo($toolbar);
      const $toggle = $("<button>").addClass("qp-toolbar-toggle").html("☰").appendTo($toolbar);
      const $sidebar = $("<div>").addClass("qp-toolbar-sidebar").appendTo($toolbar);

      // render items
      const renderItems = (items, $container) => {
        items.forEach(item => {
          if(typeof item === "string"){
            $container.append(item);
          } else if(item.html){
            $container.append(item.html);
          } else {
            const $el = $("<" + (item.tag || "button") + ">");
            if(item.class) $el.addClass(item.class);
            if(item.text) $el.text(item.text);
            if(item.click) $el.on("click", item.click);
            $container.append($el);
          }
        });
      };

      renderItems(settings.sections.left, $left);
      renderItems(settings.sections.center, $center);
      renderItems(settings.sections.right, $right);
      renderItems(settings.sections.sidebar, $sidebar);

      // toggle sidebar
      $toggle.on("click", function(){
        $sidebar.toggleClass("open");
      });

      // kontrola přetečení – přesouvá jen prvky, které se nevejdou
      const adjustRightSection = () => {
        const rightChildren = $right.children().toArray();
        let availableWidth = $right.width();
        let usedWidth = 0;

        // přesunout přetékající prvky do sidebaru
        rightChildren.forEach(el => {
          const $el = $(el);
          const elWidth = $el.outerWidth(true);
          if(usedWidth + elWidth <= availableWidth){
            usedWidth += elWidth;
          } else {
            $sidebar.append($el);
          }
        });

        // pokusit se vrátit prvky ze sidebaru zpět, pokud je místo
        $sidebar.children().toArray().forEach(el => {
          const $el = $(el);
          const elWidth = $el.outerWidth(true);
          if(usedWidth + elWidth <= availableWidth){
            $right.append($el);
            usedWidth += elWidth;
          }
        });

        // toggle button viditelný jen pokud sidebar má obsah
        if($sidebar.children().length > 0){
          $toggle.show();
        } else {
          $toggle.hide();
          $sidebar.removeClass("open");
        }
      };

      $(window).on("resize", adjustRightSection);
      adjustRightSection();
    });
  };
})(jQuery);
