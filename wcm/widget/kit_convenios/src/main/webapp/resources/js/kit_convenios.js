var WidgetConvenios = SuperWidget
	.extend({

		APPLICATION_CODE: 'kit_convenios',
		DEFAULT_IMAGE_PATH: '/webdesk/streamcontrol/padrao.png',
		TENANTID_QUERYPARAM: 'WDCompanyId',
		FORMID_QUERYPARAM: 'WDNrDocto',
		VERSION_QUERYPARAM: 'WDNrVersao',
		DOCSNAVIGATION_PATH: '/ecmnavigation?app_ecm_navigation_doc=',

		formID: null,
		numberOfRecords: null,
		partnersData: {},
		limit: 2,
		offset: 0,

		bindings: {
			local: {
				'save-preferences': ['click_savePreferences'],
				'more-partners': ['click_showMorePartners'],
				'open-partner': ['click_openPartnerDetails']
			}
		},

		init: function() {
			// remove o título da widget no slot.
			this.DOM.parents('.wcm_corpo_widget_single').siblings('.wcm_title_widget').remove();

			this.getDocumentByDatasetName();
		},

		showMorePartners: function(el, ev) {
			var limit = this.limit, offset = this.offset;

			this.listPartners(limit, offset);
		},

		openPartnerDetails: function(el, ev) {
			var documentId = $(el).data('open-partner'), partnerData = this.partnersData[documentId], content;

			partnerData.isPartnerDetails = true;

			content = Mustache.render(this.templates['partner-template'], partnerData);

			FLUIGC.modal({
				title: '${i18n.getTranslation("kit_convenios.partners.details")}',
				content: content,
				id: 'partner-' + documentId,
				size: 'large'
			});
		},

		getDocumentByDatasetName: function() {
			var that = this, limit = this.limit, offset = this.offset;

			this.serviceGetDocumentByDatasetName(function(err, data) {
				if (err)
					return false;

				that.formID = data.content.id;

				if (!that.isEditMode) {
					that.startLoadingAnimation();
					that.listPartners(limit, offset);
				} else {
					that.setupFormLink();
				}
			});
		},

		startLoadingAnimation: function() {
			var $loading = $('#loading_' + this.instanceId), animation = FLUIGC.loading($loading);

			$loading.show();
			animation.show();
		},

		stopLoadingAnimation: function() {
			var $loading = $('#loading_' + this.instanceId), animation = FLUIGC.loading($loading);

			$loading.hide();
			animation.hide();
		},

		listPartners: function(limit, offset) {
			var that = this, constraintActive = DatasetFactory.createConstraint('metadata#active', true, true,
				ConstraintType.MUST), constraintLimit = DatasetFactory.createConstraint('sqlLimit',
				this.numberOfRecords, this.numberOfRecords, ConstraintType.MUST), constraints = [constraintActive,
				constraintLimit], dataset = DatasetFactory.getDataset(this.APPLICATION_CODE, null, constraints,
				['id;desc']);

			if (dataset != null && dataset.values.length > 0) {
				var docId = dataset.values[0]['metadata#id'];

				if (docId == null || docId.length == 0) {
					this.displayNoDataFoundMessage();
					this.hideMorePartnerButton();
				} else {
					var partners = [];

					dataset.values = this.normalizeDatasetValues(dataset.values);

					var len = limit + offset <= dataset.values.length ? limit + offset : dataset.values.length;

					for (var i = offset; i < len; i++) {
						if (dataset.values[i].id !== null) {
							var item = that.getPartnerParams(dataset.values[i]);
							that.partnersData[item.documentId] = item;
							partners.push(item);
						}
					}
					if(partners.length < limit){
						this.hideMorePartnerButton();
					}
					
					if (partners.length) {
						this.appendDatasetRecords(partners);
					} else if (!$('[data-partner-item]', this.DOM).length) {
						this.displayNoDataFoundMessage();
						this.hideMorePartnerButton();
					} else {
						this.hideMorePartnerButton();
					}
				}
			} else {
				this.displayNoDataFoundMessage();
			}

			this.stopLoadingAnimation();
		},

		appendDatasetRecords: function(partners) {
			var html = Mustache.render(this.templates['partners-template'], partners, {
				partner: this.templates['partner-template']
			});

			this.offset += partners.length;

			$('#convenios-wrapper_' + this.instanceId).append(html);
		},

		displayNoDataFoundMessage: function() {
			this.displayMessageIntoWidget('${i18n.getTranslation("kit_convenios.noitems")}');
		},

		displayMessageIntoWidget: function(message) {
			var $msg = $('<div>').addClass('alert alert-info');

			$msg.attr('style', 'role: info;');
			$msg.text(message);
			$msg.appendTo($('#convenios-wrapper_' + this.instanceId));
		},

		normalizeDatasetValues: function(values) {
			for (var i = 0; i < values.length; i++) {
				values[i].image = this.getImageURL(values[i]);
				values[i].partner = values[i].partner ? values[i].partner : values[i].PARTNER;
				values[i].partnerBenefits = values[i].partnerBenefits ? values[i].partnerBenefits
					: values[i].PARTNERBENEFITS;
			}

			return values;
		},

		setupFormLink: function() {
			var url = this.getFormURL(), $link = $('#conveniosDataSetLink_' + this.instanceId);

			$link.text(url);
			$link.attr('href', url);
		},

		getFormURL: function() {
			return WCMAPI.getServerURL() + WCMAPI.getProtectedContextPath() + '/' + WCMAPI.getTenantCode()
				+ this.DOCSNAVIGATION_PATH + this.formID;
		},

		hasInvalidFields: function() {
			var hasError = false;

			this.clearHighlight();

			if (this.numberOfRecords == null || this.numberOfRecords == '' || isNaN(this.numberOfRecords)
				|| this.numberOfRecords < 1) {
				this.highlightFields('${i18n.getTranslation("kitintranet.news.error.numberofarticles")}',
					'numberOfArticles');
				hasError = true;
			}

			return hasError;
		},

		getPreferences: function() {
			this.numberOfRecords = $('#conveniosNumberOfRecords_' + this.instanceId, this.DOM).val();

			var preferences = {
				dataset: $('conveniosDataSetLink_' + this.instanceId, this.DOM).val(),
				numberOfRecords: this.numberOfRecords
			};

			return preferences;
		},

		savePreferences: function() {
			var preferences = this.getPreferences();

			if (this.hasInvalidFields()) {
				this.showErrorMessage('', '${i18n.getTranslation("kit_convenios.error.numberofarticles")}');
			} else {
				WCMSpaceAPI.PageService.UPDATEPREFERENCES({
					async: true,
					success: function(data) {
						FLUIGC.toast({
							title: data.message,
							message: '',
							type: 'success'
						});
					},
					fail: function(xhr, message, errorData) {
						FLUIGC.toast({
							title: '${i18n.getTranslation("application.preferences.error")}',
							message: errorData.message,
							type: 'warning'
						});
					}
				}, this.instanceId, preferences);
			}
		},

		getPartnerParams: function(partner) {
			var params = {
				title: partner.partner,
				imgURL: this.getImageURL(partner),
				content: partner.partnerBenefits,
				documentId: partner['metadata#id'],
				cutContent: this.cropMessage(partner.partnerBenefits)
			};

			return params;
		},

		getImageURL: function(item) {
			return WCMAPI.getServerURL() + this.DEFAULT_IMAGE_PATH + '?' + this.TENANTID_QUERYPARAM + '='
				+ WCMAPI.getTenantId() + '&' + this.FORMID_QUERYPARAM + '=' + item['metadata#id'] + '&'
				+ this.VERSION_QUERYPARAM + '=' + item['metadata#version'];
		},

		highlightFields: function(message, field) {
			if (this.isEditMode) {
				$('#' + field + 'Div_' + this.instanceId).addClass('has-error');
				$('#' + field + '_' + this.instanceId).attr('data-toggle', 'tooltip');
				$('#' + field + '_' + this.instanceId).attr('placement', 'top');
				$('#' + field + '_' + this.instanceId).attr('title', message);
			}
		},

		clearHighlight: function() {
			var fields = ['numberOfArticles'];

			if (this.isEditMode) {
				for ( var i in fields) {
					$('#' + fields[i] + 'Div_' + this.instanceId).removeClass('has-error');
					$('#' + fields[i] + '_' + this.instanceId).removeAttr('data-toggle');
					$('#' + fields[i] + '_' + this.instanceId).removeAttr('placement');
					$('#' + fields[i] + '_' + this.instanceId).removeAttr('title');
				}
			}
		},

		showErrorMessage: function(titleMsg, msg) {
			FLUIGC.toast({
				title: titleMsg,
				message: msg,
				type: 'danger'
			});
		},

		cropMessage: function(message) {
			var croppedMessage = '';

			if (message.length > 100) {
				croppedMessage = message.substring(0, 100);
				croppedMessage = croppedMessage.concat('...');
			} else {
				croppedMessage = message;
			}

			return croppedMessage;
		},

		hideMorePartnerButton: function() {
			$('[data-more-partners]', this.DOM).hide();
		},

		serviceGetDocumentByDatasetName: function(cb) {
			var options = {
				url: '/api/public/ecm/document/getDocumentByDatasetName/' + this.APPLICATION_CODE
			};

			FLUIGC.ajax(options, cb);
		}

	});
