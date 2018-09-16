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

    var selectedMetric = this.workspace.qualitySensor.selectedQualityMetric;
    // You can do it more generically
    var gradienteRGB = 'linear-gradient(to left, #6be585 0%, #dd3e54 100%)';

    if (selectedMetric === 'completude') {
      beginRGB = [255, 130, 53];
      finalRGB = [48, 232, 191];
      gradienteRGB = 'linear-gradient(to left, #22c1c3 0%, #fdbb2d 100%)';
    }
    var gradient = document.createElement('div');
    var text = document.createElement('LABEL');
    var t = document.createTextNode(selectedMetric);

    text.appendChild(t);

    gradient.id = 'quality-gradient';
    gradient.style.position = 'relative';
    gradient.style.marginTop = '10%';
    gradient.style.marginBottom = '100%';
    gradient.style.left = '10%';
    gradient.style.width = '80%';
    gradient.style.height = '30px';
    // Change color gradient according to selected metric
    gradient.style.background = gradienteRGB;

    text.style.fontSize = '15px';
    text.style.position = 'relative';
    text.style.left = '30%';

    // Show quality summary

    $(this.el).html(this.template());

    // Show selected Metric Name
    $(this.el)
      .find('.fields_list_body')
      .append(text);

    // Show color gradient
    $(this.el)
      .find('.fields_list_body')
      .append(gradient);

    $(this.workspace.el)
      .find('.workspace_editor')
      .append($(this.el));

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
