var QualitySensor = Backbone.Model.extend({
  initialize: function(args) {
    this.workspace = args.workspace;
    this.workspace.showQuality = false;
    this.modal = undefined;
    // Add quality sensor button
    if (document && document['addEventListener']) {
      this.add_button();
    }
  },
  add_button: function() {
    var button = $(
      '<a href="#qualitySensor" id="search_icon" class="i18n qualitySensor button sprite i18n_failed i18n_translated" title="Quality Sensor"></a>'
    ).css({
      'background-image': "url('js/saiku/plugins/qualitySensor/search.png')",
      'background-repeat': 'no-repeat',
      'background-position': '50% 50%',
      'background-size': '16px'
    });
    var li = $('<li class="seperator"></li>').append(button);

    $(this.workspace.toolbar.el)
      .find('ul')
      .append(li);
    this.workspace.toolbar.qualitySensor = this.onClickedButton;
  },
  onClickedButton: function() {
    // Change flag
    this.workspace.showQuality = !this.workspace.showQuality;

    if (this.modal == undefined) {
      this.modal = new QualityModal({
        workspace: this.workspace,
        qualityMetric: 'alfafa'
      });
      this.modal.render().open();
    }
    else if (this.workspace.showQuality) {
      this.modal.render().open();
    }
    // Criar caixa onde o usuário vai selecionar a métrica que deseja ver
    if (this.workspace.showQuality) {
      Saiku.events.trigger('qualitySensor:openModal', { workspace: this.workspace });
    }
    // Populate dimensions and measure on Query object
    // Run queries

    // Change style of button

    // Render table again
    this.workspace.table.render({ data: this.workspace.query.result.lastresult() });
  }
});

Saiku.events.bind('session:new', function(session) {
  function new_workspace(args) {
    if (typeof args.workspace.qualitySensor === 'undefined') {
      args.workspace.qualitySensor = new QualitySensor({ workspace: args.workspace });
    }
  }

  for (var i = 0, len = Saiku.tabs._tabs.length; i < len; i++) {
    var tab = Saiku.tabs._tabs[i];

    new_workspace({
      workspace: tab.content
    });
  }

  Saiku.session.bind('workspace:new', new_workspace);
});

Saiku.events.bind('qualitySensor:openModal', function(workspace) {});
