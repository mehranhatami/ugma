/*!
 * autoAdjust.js 1.0
 */
(function(ugma) {

    ugma.extend({

        autoAdjust: function(kompressor, options) {
            
            // Recursively merge properties of two objects 
            function mergeObj(obj1, obj2) {

                    for (var p in obj2) {
                        try {
                            // Property in destination object set; update its value.
                            if (obj2[p].constructor == Object) {
                                obj1[p] = MergeRecursive(obj1[p], obj2[p]);

                            } else {
                                obj1[p] = obj2[p];
                            }

                        } catch (e) {
                            // Property in destination object not set; create it and set its value.
                            obj1[p] = obj2[p];
                        }
                    }

                    return obj1;
                }
                // Setup options
            var compressor = kompressor || 1,
                settings = mergeObj({
                    'minFontSize': Number.NEGATIVE_INFINITY,
                    'maxFontSize': Number.POSITIVE_INFINITY
                }, options);

            var self = this;

            // Resizer() resizes items based on the object width divided by the compressor * 10
            var resizer = function() {
                self.css('font-size', Math.max(Math.min(self.width() / (compressor * 10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
            };

            // Call once to set.
            resizer();

            // Call on resize. Opera debounces their resize by default.
            window.addEventListener('resize', resizer);
            window.addEventListener('orientationchange', resizer);
        }
    });

})(window.ugma);