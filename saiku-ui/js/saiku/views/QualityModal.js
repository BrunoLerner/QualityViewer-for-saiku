var QualityModal = Modal.extend({
  type: 'quality',
  options: {
    autoOpen: false,
    modal: true,
    title: 'Choose a quality metric',
    resizable: false,
    draggable: true,
    close: function(event, ui) {
      // bugfix: https://github.com/OSBI/saiku/issues/628
      // The defer function fixed the error:
      // Cannot call methods on dialog prior to initialization; attempted to call method 'close'
      _.defer(function() {
        $(event.target)
          .closest('.ui-dialog')
          .remove();
      });
    }
  },

  buttons: [{ text: 'Ok', method: 'save' }, { text: 'Cancel', method: 'close' }],

  events: {
    'change #quality_metric': 'type_quality_metrics'
  },

  /**
	 * Property with main template of modal
	 *
	 * @property template_modal
	 * @type {String}
	 * @private
	 */
  template_modal: _.template(
    '<div class="cms-container-form">' +
			'<form class="form-group-inline" data-action="cad">' +
			'<div style="padding-bottom:10px;"><label for="quality_metric" class="i18n">Avaiable quality metrics:</label>' +
			'<select id="quality_metric" class="form-control" style="width:365px">' +
			'<option class="i18n" value="" selected>-- Select an existing metric --</option>' +
			'<% if (measures.length > 0) { %>' +
			'<% _(measures).each(function(measure) { %>' +
			'<option value="<%= measure %>" data-type="calcmeasure"><%= measure %></option>' +
			'<% }); %>' +
			'<% } %>' +
			'</form>' +
			'</div>' +
			'</div>'
  ),

  selectedQualityMetric: null,

  initialize: function(args) {
    var self = this;

    this.workspace = args.workspace;

    var cubeQuality = this.workspace.selected_cube_quality;
    var qualityMeasures = Saiku.session.sessionworkspace.cube[cubeQuality].get('data').measures;
    var dimensions = Saiku.session.sessionworkspace.cube[cubeQuality].get('data').dimensions;

    // filter qualityMeasures
    var uniqueMeasures = new Map();

    qualityMeasures.forEach(function(measure) {
      var parts = measure.name.split('_');

      if (uniqueMeasures.get(parts[1]) === undefined) {
        uniqueMeasures.set(parts[0], true);
      }
    });
    var uniqueMeasuresArray = Array.from(uniqueMeasures.keys());

    console.log(this.workspace.quality_summary);
    this.workspace.quality_summary.render();
    // Load template
    this.message = this.template_modal({
      measures: uniqueMeasuresArray,
      dimensions: dimensions
    });
    this.bind('open', function() {
      this.$el.find('.dialog_icon').remove();
    });
  },
  /**
	 * Type quality measure
	 *
	 * @method type_quality_metrics
	 * @private
	 * @param {Object} event The Event interface represents any event of the DOM
	 */
  type_quality_metrics: function(event) {
    var qualityMetric = this.$el.find('#quality_metric option:selected')[0].text;

    // You dont need to set it in 2 places
    this.workspace.qualitySensor.selectedQualityMetric = qualityMetric;
    this.selectedQualityMetric = qualityMetric;
    this.save(event);
  },
  save: function(event) {
    // Generate dimension name from selectedDataMeasures and selectedQualityMetric
    var selectedDataMeasures = this.workspace.query.helper.model().queryModel.details.measures;
    var qualityMeasure = this.selectedQualityMetric + '_' + selectedDataMeasures[0].name;
    var gradient = document.createElement('div');
    var text = document.createElement('LABEL');
    var t = document.createTextNode(this.selectedQualityMetric);

    this.workspace.quality_summary.render();
    text.appendChild(t);

    gradient.id = 'quality-gradient';
    gradient.style.width = '350px';
    gradient.style.height = '30px';
    gradient.style.background = 'linear-gradient(to left, #dd3e54 0%, #6be585 100%)';
    gradient.style.color = 'white';
    // gradient.innerHTML = this.selectedQualityMetric;
    gradient.style.position = 'relative';
    gradient.style.left = '700px';
    gradient.style.bottom = '700px';

    text.style.position = 'relative';
    text.style.left = '700px';
    text.style.bottom = '700px';
    text.style.font = 'normal 12px courier';

    document.getElementById('tab_panel').insertBefore(text, document.getElementById('quality-gradient'));

    document.getElementById('tab_panel').appendChild(gradient);

    // botar o nome da métrica que o usuário deseja ver
    var measure_quality = {
      name: qualityMeasure,
      type: 'EXACT'
    };

    this.workspace.query_quality.helper.includeMeasure(measure_quality);
    this.workspace.sync_query();
    this.workspace.query_quality.run();
    var self = this;

    setTimeout(function() {
      self.workspace.table.render({ data: self.workspace.query.result.lastresult() });
      self.close();
    }, 500);
    // this.renderTableWithQuality(this);
  }

  // renderTableWithQuality: function(self) {
  //   console.log(self.workspace.query_quality.result.hasRun());
  //   if (self.workspace.query_quality.result.hasRun()) {
  //     self.workspace.table.render({ data: self.workspace.query.result.lastresult() });
  //     return;
  //   }
  //   setTimeout(this.renderTableWithQuality(self), 50);
  // }
});
