var Organograma = SuperWidget.extend({
	instanceId: null,
	widgetVersion: null,
	serviceLink: null,
	login: null,
	password: null,
	userHead: null,
	loading: null,
	usersList: null,
	totalUsers: 0,
	parameters: null,
	mapAttrs: {
		HEAD_USER_ID: 1,
		APPLICATION_CODE: 'kit_organograma',
	},

	bindings: {
		local: {
			'save-preferences': ['click_savePreferences']
		},
		global: {}
	},

	init: function() {
		var that = this;

		// remove o título da widget no slot.
		this.DOM.parents('.wcm_corpo_widget_single').siblings('.wcm_title_widget').remove();

		that.loading = FLUIGC.loading('#organizationChartContainer_' + that.instanceId);

		if (!that.isEditMode) {
			var preferences = that.definePreferences();
			that.processTemplate('template_organization_chart', preferences, '#Organograma_' + that.instanceId,
				function() {
					that.viewMode();
				});
		}
	},

	savePreferences: function() {
		var that = this;
		that.getInputData();
		if (!that.hasInvalidFields()) {
			that.save(that.getPreferences());
		} else {
			that.showMessageError('${i18n.getTranslation("kit_organograma.preferences.error")}',
				'${i18n.getTranslation("kit_organograma.preferences.error.invalidfields")}');
		}
	},

	definePreferences: function() {
		var that = this, preferences = {
			instanceId: that.instanceId,
			serviceLink: that.serviceLink,
			login: that.login,
			password: that.password,
			userHead: that.userHead,
			userOrgId: that.userOrgId
		};
		return preferences;
	},

	getInputData: function() {
		this.serviceLink = $("#serviceLink_" + this.instanceId).val();
		this.login = $("#login_" + this.instanceId).val();
		this.password = $("#password_" + this.instanceId).val();
		this.userHead = $("#userHead_" + this.instanceId).val();
		this.userOrgId = $("#userOrgId_" + this.instanceId).val();
	},

	processTemplate: function(templateName, data, target, callback) {
		var that = this;
		var html = Mustache.render(that.templates[templateName], data);
		$(target).html(html);
		if (callback) {
			callback();
		}
	},

	getPreferences: function() {
		return {
			serviceLink: this.serviceLink,
			login: this.login,
			password: this.password,
			userHead: this.userHead,
			userOrgId: this.userOrgId
		};
	},

	save: function(preferences) {
		var that = this;
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
				that.showMessage('${i18n.getTranslation("kit_organograma.edit.save.error")}', 'danger', '\n'
					+ errorData.message);
			}
		}, this.instanceId, preferences);
	},

	viewMode: function() {
		/*
		TODO: exibir mensagem amigável quando a widget já foi configurada
		if (!this.hasInvalidFields()) {
			this.showMessage('', 'danger', '${i18n.getTranslation("kit_organograma.error.configuration")}');
		} else {
			this.getSettings(this.userHead);
		}
		*/
		if (!this.hasInvalidFields()) {
			this.getSettings(this.userHead);
		}
	},

	buildOrganizationChart: function(userOrgId, settings) {
		var that = this, organizationChart;
		if (settings) {
			organizationChart = FLUIGC.orgChart('#organizationChart_' + that.instanceId, {
				data: settings
			});
			that.getOrganizationChart(that.mapAttrs.HEAD_USER_ID, userOrgId, organizationChart);
		}
	},

	getSettings: function(userTag) {
		var that = this;
		var userId = that.userOrgId;
		that.loading.show();
		that.serviceOrganizationchartSettings(userTag, function(err, settings) {
			if (err) {
				that.showMessage('', err.type, err.message);
				that.loading.hide();
				return false;
			}
			that.buildOrganizationChart(userId, settings);
			that.loading.hide();
		});
	},

	serviceOrganizationchartSettings: function(userTag, callback) {
		var that = this;
		var settings = null;
		var serviceUrl = '/' + that.mapAttrs.APPLICATION_CODE + '/rest/organizationchart/birthday?code=' + userTag
			+ '&user=' + that.login + '&password=' + that.password + '&url=' + that.normalizeURL();
		WCMAPI.Read({
			url: serviceUrl,
			timeout: 30000,
			success: function(data) {
				if (data) {
					settings = [{
						id: that.mapAttrs.HEAD_USER_ID,
						img: that.getUserImage(data),
						name: data.name,
						parent: 0,
						rmTag: userTag
					}];
					callback(null, settings);
				} else {
					callback({
						type: 'info',
						message: '${i18n.getTranslation("kit_organograma.error.nothingfound")}'
					});
				}
			},
			error: function(xhr, message, errorData) {
				callback({
					type: 'danger',
					message: '${i18n.getTranslation("kit_organograma.error.webservice")}'
				});
			}
		});
	},

	getOrganizationChart: function(userId, userOrgId, organizationChart) {
		var that = this, serviceUrl;
		that.loading.show();
		that.usersList = [];
		serviceUrl = '/' + that.mapAttrs.APPLICATION_CODE + '/rest/organizationchart/chart?code=' + userOrgId
			+ '&user=' + that.login + '&password=' + that.password + '&url=' + that.normalizeURL();
		WCMAPI.Read({
			url: serviceUrl,
			timeout: 30000,
			success: function(data) {
				if (data && data.length > 0) {
					that.totalUsers = data.length;
					for ( var i in data) {
						that.getUserInfo(userId, data[i], organizationChart);
					}
				} else {
					that.loading.hide();
				}
			},
			error: function(xhr, message, errorData) {
				that.showMessage('', 'danger', '${i18n.getTranslation("kit_organograma.error.webservice")}');
				that.loading.hide();
			}
		});
	},

	getUserInfo: function(userId, teamInfo, organizationChart) {
		var that = this;
		var serviceUrl = '/' + that.mapAttrs.APPLICATION_CODE + '/rest/organizationchart/birthday?code='
			+ teamInfo.userCode + '&user=' + that.login + '&password=' + that.password + '&url=' + that.normalizeURL();
		WCMAPI.Read({
			url: serviceUrl,
			timeout: 30000,
			success: function(data) {
				if (data) {
					that.appendChild(userId, data, teamInfo.tag, organizationChart);
				}
			},
			error: function(xhr, message, errorData) {
				if (!$('.organizationChartError').length) {
					that.showMessage('', 'danger', '${i18n.getTranslation("kit_organograma.error.webservice")} ');
				}
				that.loading.hide();
			}
		});
	},

	appendChild: function(parentId, user, tag, organizationChart) {
		this.usersList.push({
			id: Date.now(),
			img: this.getUserImage(user),
			name: user.name,
			parent: parentId,
			rmCode: user.userCode,
			rmTag: tag
		});
		if (this.usersList.length === this.totalUsers) {
			organizationChart.addNodes(this.usersList);
			this.loading.hide();
		}
	},

	getUserImage: function(user) {
		var url = '/api/public/social/image/';
		var userConstraint = DatasetFactory.createConstraint('mail', user.email, user.email, ConstraintType.MUST);
		var dataset = DatasetFactory.getDataset('colleague', null, [userConstraint], null);
		return dataset !== null && dataset.values.length > 0 && dataset.values[0]['colleaguePK.colleagueId'] !== null
			? url + dataset.values[0]['colleaguePK.colleagueId'] : this.getDefaultImage();
	},

	getDefaultImage: function() {
		return '/' + this.mapAttrs.APPLICATION_CODE + '/resources/images/user.png';
	},

	isAValidURL: function(url) {
		var myRegExpURL = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9_\-]+)+\.([a-zA-Z]{2,4})(?:\.([a-zA-Z]{2,4}))?\/?(.*)$/;
		var myRegExpIP = /[http|https]+\:\/\/[\w\d\.\-]+\:\d+/i;
		return (myRegExpURL.test(url) || myRegExpIP.test(url));
	},

	normalizeURL: function() {
		var url = this.serviceLink;
		if (url.charAt(url.length - 1) === '/') {
			url = url.substr(0, url.length - 1);
		}
		return encodeURIComponent(url);
	},

	hasInvalidFields: function() {
		var hasError = false;
		this.clearHighlight();
		if (!this.serviceLink) {
			this.highlightFields('${i18n.getTranslation("kit_organograma.error.invalidservicelink")}', 'serviceLink');
			hasError = true;
		}
		if ((this.serviceLink) && !this.isAValidURL(this.serviceLink)) {
			this.highlightFields('${i18n.getTranslation("kit_organograma.error.invalidservicelink")}', 'serviceLink');
			hasError = true;
		}
		if (!this.login) {
			this.highlightFields('${i18n.getTranslation("kit_organograma.error.login")}', 'login');
			hasError = true;
		}
		if (!this.password) {
			this.highlightFields('${i18n.getTranslation("kit_organograma.error.password")}', 'password');
			hasError = true;
		}
		if (!this.userHead) {
			this.highlightFields('${i18n.getTranslation("kit_organograma.error.userhead")}', 'userHead');
			hasError = true;
		}
		if (!this.userOrgId) {
			this.highlightFields('${i18n.getTranslation("kit_organograma.error.userOrgId")}', 'userOrgId');
			hasError = true;
		}
		return hasError;
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
		if (this.isEditMode) {
			var fields = ['serviceLink', 'login', 'password', 'userHead', 'userOrgId'];
			for ( var i in fields) {
				$('#' + fields[i] + 'Div_' + this.instanceId).removeClass('has-error');
				$('#' + fields[i] + '_' + this.instanceId).removeAttr('data-toggle');
				$('#' + fields[i] + '_' + this.instanceId).removeAttr('placement');
				$('#' + fields[i] + '_' + this.instanceId).removeAttr('title');
			}
		}
	},

	showMessageError: function(title, error) {
		this.showMessage(title, 'danger', error);
	},

	showMessage: function(title, type, message) {
		FLUIGC.toast({
			title: title,
			type: type,
			message: message
		});
	}

});