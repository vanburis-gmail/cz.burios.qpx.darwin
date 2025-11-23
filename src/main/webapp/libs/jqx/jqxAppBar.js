(function($) {
    // Definice pluginu
    $.fn.appBar = function(options) {
        // Defaultní nastavení
        var defaults = {
            color: "blue",
            text: "Hello World",
            size: "16px"
        };

        // Sloučení defaultů s uživatelskými options
        var settings = $.extend({}, defaults, options);

        // Inicializace pro každý prvek
        return this.each(function() {
            var $this = $(this);

            // Uložíme data do elementu
            $this.data("appBar", settings);

            // Init funkce – aplikace stylu a textu
            $this.css({
                "color": settings.color,
                "font-size": settings.size
            });
            $this.text(settings.text);
        });
    };

    // Veřejná funkce pro čtení dat
    $.fn.getAppBarData = function() {
        var $this = $(this);
        return $this.data("appBar");
    };

    // Autodetekce podle data-role
    $(function() {
        $("[data-role='appBar']").each(function() {
            var $this = $(this);

            // Načtení options z data-* atributů
            var options = {
                color: $this.data("color"),
                text: $this.data("text"),
                size: $this.data("size")
            };

            // Inicializace pluginu
            $this.appBar(options);
        });
    });

})(jQuery);