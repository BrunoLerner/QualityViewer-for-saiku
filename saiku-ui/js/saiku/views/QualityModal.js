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
    'change #quality_measures': 'type_quality_measures'
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
			'<div style="padding-bottom:10px;"><label for="quality_measures" class="i18n">Avaiable quality metrics:</label>' +
			'<select id="quality_measures" class="form-control" style="width:365px">' +
			'<option class="i18n" value="" selected>-- Select an existing metric --</option>' +
			'<% if (measures.length > 0) { %>' +
			'<% _(measures).each(function(measure) { %>' +
			'<option value="<%= measure.uniqueName %>" data-type="calcmeasure"><%= measure.name %></option>' +
			'<% }); %>' +
			'<% } %>' +
			'</form>' +
			'</div>' +
			'</div>'
  ),

  selectedQualityMeasure: null,

  initialize: function(args) {
    var self = this;

    this.workspace = args.workspace;

    // if (!this.workspace.selected_cube_quality) {
    //   this.workspace.create_new_quality_query(this.workspace);
    // }

    var cubeQuality = this.workspace.selected_cube_quality;
    var qualityMeasures = Saiku.session.sessionworkspace.cube[cubeQuality].get('data').measures;
    var dimensions = Saiku.session.sessionworkspace.cube[cubeQuality].get('data').dimensions;
    var dataMeasures = {
      name: qualityMeasures ? qualityMeasures[0].dimensionUniqueName.replace(/[\[\]]/gi, '') : null,
      uniqueName: qualityMeasures ? qualityMeasures[0].hierarchyUniqueName : null
    };

    // Load template
    this.message = this.template_modal({
      measures: qualityMeasures,
      dataMeasures: dataMeasures,
      dimensions: dimensions
    });
    this.bind('open', function() {
      this.$el.find('.dialog_icon').remove();
    });
  },
  /**
	 * Type quality measure
	 *
	 * @method type_quality_measures
	 * @private
	 * @param {Object} event The Event interface represents any event of the DOM
	 */
  type_quality_measures: function(event) {
    var qualityMeasure = this.$el.find('#quality_measures option:selected')[0].text;

    this.selectedQualityMeasure = qualityMeasure;
    this.save(event);
  },

  save: function(event) {
    // botar o nome da métrica que o usuário deseja ver
    var measure_quality = {
      name: this.selectedQualityMeasure,
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
