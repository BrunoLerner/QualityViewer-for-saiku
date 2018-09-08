var QualityModal = Modal.extend({
  type: 'quality',

  buttons: [{ text: 'Ok', method: 'ok' }, { text: 'Cancel', method: 'close' }],

  events: {
    'click .add_role': 'add_role',
    'click .remove_acl': 'remove_acl',
    'submit form': 'add_role',
    'click a': 'call',
    'click input.private': 'keep_private'
  },

  addQualityMetricsTemplate: _.template(
    "<div class='fields_list details_fields' title='DETAILS'>" +
			"<div class='fields_list_header measure_fields disabled_toolbar'><span class='i18n'>Measures</span><span class='dropdown'></span></div>" +
			"<div class='fields_list_body details'>" +
			"<ul class='connectable'></ul>" +
			'</div>' +
			"<span class='clear_axis i18n hide' title='Clear Axis'></span>" +
			"<div class='clear'></div>" +
			'</div>' +
			// Or this
			"<form id='quality_metrics_form'>" +
			"<table border='0px'>" +
			"<tr><td class='col0 i18n'>Name:</td>" +
			"<td class='col1'><input type='text' class='measure_name' value='Measure Name'></input></td></tr>" +
			"<tr><td class='col0 i18n'>Measure:</td>" +
			"<td class='col1'>" +
			"<select id='Measures' name='MeasuresId'> " +
			"    <option value='' selected='selected'>--select an existing measure--</option> " +
			'    <% _(measures).each(function(m) { %> ' +
			"      <option value='<%= m.uniqueName %>'><%= m.name %></option> " +
			'    <% }); %> ' +
			'</select> ' +
			'</td></tr>' +
			"<tr><td class='col0 i18n'>Formula:</td>" +
			"<td class='col1'><textarea class='measureFormula auto-hint' placeholder='Start writing a calculated measure or use the dropdown list'></textarea></td></tr>" +
			"<tr> <td class='col0'> </td>" +
			"<td class='col1'>" +
			" <form> <input type='button' class='form_button mathBtn' style='padding-bottom: 18px;' value='+' id='plusBtn' >  </input>   " +
			" <input type='button' class='form_button mathBtn' style='padding-bottom: 18px;' value='-' id='minusBtn' > </input>  " +
			" <input type='button' class='form_button mathBtn' style='padding-bottom: 18px;' value='*' id='multiplyBtn' >  </input>  " +
			" <input type='button' class='form_button mathBtn' style='padding-bottom: 18px;' value='/' id='divisionBtn' >  </input> " +
			" <input type='button' class='form_button mathBtn' style='padding-bottom: 18px;' value='(' id='leftBracketBtn' >  </input> " +
			" <input type='button' class='form_button mathBtn' style='padding-bottom: 18px;' value=')' id='rightBracketBtn' >  </input> " +
			'</form> </td>' +
			'</tr>' +
			"<tr><td class='col0 i18n'>Format:</td>" +
			"<td class='col1'><input class='measure_format' type='text' value='#,##0.00'></input></td></tr>" +
			'</table></form>'
  ),

  selectedQualityMetric: null,

  qualityMetrics: [],

  initialize: function(args) {
    var self = this;

    this.workspace = args.workspace;
    this.qualityMetric = args.qualityMetric;

    // var selectedHierarchies = this.workspace.query.helper
    //   .model()
    //   .queryModel.axes.ROWS.hierarchies.concat(this.workspace.query.helper.model().queryModel.axes.COLUMNS.hierarchies);

    // this.selectedDimensions = this.extractDimensionChoices(selectedHierarchies);
    // this.selectedRowDimensions = this.extractDimensionChoices(
    //   this.workspace.query.helper.model().queryModel.axes.ROWS.hierarchies
    // );
    // this.selectedColumnDimensions = this.extractDimensionChoices(
    //   this.workspace.query.helper.model().queryModel.axes.COLUMNS.hierarchies
    // );
    // this.selectedMeasures = this.workspace.query.helper.model().queryModel.details.measures;

    // var cube = this.workspace.selected_cube;

    // this.measures = Saiku.session.sessionworkspace.cube[cube].get('data').measures;

    // _.bindAll(this, 'save', 'openGrowthModal', 'openFormatModal');

    // this.options.title = 'Calculated Measure';

    // if (this.measure) {
    //   _.extend(this.options, {
    //     title: 'Custom Filter for ' + this.axis
    //   });
    // }

    // this.bind('open', function() {
    //   if (self.measure) {
    //   }
    // });

    // // fix event listening in IE < 9
    // if (isIE && isIE < 9) {
    //   $(this.el)
    //     .find('form')
    //     .on('submit', this.save);
    // }
    // // Load template
    // this.message = this.addMeasureTemplate({
    //   measures: this.measures,
    //   mdxFunctions: this.mdxFunctions
    // });
  }

  //   save: function(event) {
  //     event.preventDefault();
  //     var self = this;
  //     var measure_name = $(this.el)
  //       .find('.measure_name')
  //       .val();
  //     var measure_formula = $(this.el)
  //       .find('.measureFormula')
  //       .val();
  //     var measure_format = $(this.el)
  //       .find('.measure_format')
  //       .val();

  //     var alert_msg = '';

  //     if (typeof measure_name === 'undefined' || !measure_name) {
  //       alert_msg += 'You have to enter a name for the measure! ';
  //     }
  //     if (typeof measure_formula === 'undefined' || !measure_formula || measure_formula === '') {
  //       alert_msg += 'You have to enter a MDX formula for the calculated measure! ';
  //     }
  //     if (alert_msg !== '') {
  //       alert(alert_msg);
  //     }
  //     else {
  //       var m = {
  //         name: measure_name,
  //         formula: measure_formula,
  //         properties: {},
  //         uniqueName: '[Measures].' + measure_name
  //       };

  //       if (measure_format) {
  //         m.properties.FORMAT_STRING = measure_format;
  //       }
  //       self.workspace.query.helper.addCalculatedMeasure(m);
  //       self.workspace.sync_query();
  //       this.close();
  //     }

  //     return false;
  //   }
});
