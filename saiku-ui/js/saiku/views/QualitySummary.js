/*
 *   Copyright 2012 OSBI Ltd
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

/**
 * Sets up workspace quality summary zones for understanding quality data view
 */
var QualitySummary = Backbone.View.extend({
  template: function() {
    var template = $('#template-quality-summary').html() || '';

    console.log(template);
    return _.template(template)();
  },

  events: {},

  initialize: function(args) {
    // Keep track of parent workspace
    this.workspace = args.workspace;

    // Maintain `this` in jQuery event handlers
    // _.bindAll(this, 'clear_axis', 'set_measures');
  },

  render: function() {
    var self = this;
    // Generate drop zones from template

    console.log('vou renderizar');
    console.log(this.el);
    $(this.el).html(this.template());

    // Activate drop zones
    // $(this.el)
    //   .find('.fields_list_body.details ul.connectable')
    //   .sortable({
    //     items: '> li',
    //     opacityg: 0.6,
    //     placeholder: 'placeholder',
    //     tolerance: 'pointer',
    //     containment: $(self.workspace.el),
    //     start: function(event, ui) {
    //       ui.placeholder.text(ui.helper.text());
    //     }
    //   });

    // $(this.el)
    //   .find('.axis_fields ul.connectable')
    //   .sortable({
    //     connectWith: $(self.el).find('.axis_fields ul.connectable'),
    //     forcePlaceholderSize: false,
    //     forceHelperSize: true,
    //     items: 'li.selection',
    //     opacity: 0.6,
    //     placeholder: 'placeholder',
    //     tolerance: 'touch',
    //     cursorAt: { top: 10, left: 60 },
    //     containment: $(self.workspace.el),
    //     start: function(event, ui) {
    //       var hierarchy = $(ui.helper)
    //         .find('a')
    //         .parent()
    //         .parent()
    //         .attr('hierarchycaption');

    //       ui.placeholder.text(hierarchy);
    //       $(ui.helper).css({ width: 'auto', height: 'auto' });
    //       $(self.el)
    //         .find('.axis_fields ul.hierarchy li.d_level:visible')
    //         .addClass('temphide')
    //         .hide();
    //     }
    //   });

    return this;
  },

  reset_dropzones: function() {
    var self = this;

    $(self.el)
      .find('.fields_list_body ul.connectable')
      .find('li.selection, li.d_measure')
      .remove();
    if (self.workspace.dimension_list != null) {
      $(self.workspace.dimension_list.el)
        .find('li.ui-draggable-disabled')
        .draggable('enable');
    }

    $(self.el)
      .find('.fields_list[title="ROWS"] .limit')
      .removeClass('on');
    $(self.el)
      .find('.fields_list[title="COLUMNS"] .limit')
      .removeClass('on');
    $(this.workspace.el)
      .find('.fields_list_body .clear_axis')
      .addClass('hide');
  },

  update_dropzones: function() {
    $(this.workspace.el)
      .find('.fields_list_body')
      .each(function(idx, ael) {
        var $axis = $(ael);

        if ($axis.find('ul.connectable li.selection, ul.connectable li.d_measure').length === 0) {
          $axis.siblings('.clear_axis').addClass('hide');
        }
        else {
          $axis.siblings('.clear_axis').removeClass('hide');
        }
      });
  }
});
