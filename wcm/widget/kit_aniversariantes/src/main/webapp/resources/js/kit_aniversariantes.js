var WdgtAniversarios = SuperWidget.extend({
	instanceId: null,
	birthdayList: null,
	formID: '',
	sourceType: null,
	formLink: null,
	rmLink: null,
	rmUser: null,
	rmPass: null,
	limit: 2,
	offset: 0,
	birthdaysData: {},
	rmData: [],
	mapAttrs: {
		FORMULARIO: 'form',
		RM: 'rm',
		APPLICATION_CODE: 'kit_aniversariantes',
	},
	bindings: {
		local: {
			'option-form': ['click_formChosen'],
			'option-rm': ['click_rmChosen'],
			'save-preferences': ['click_savePreferences'],
			'more-birthdays': ['click_showMoreBirthdays']
		},
		global: {}
	},

	init: function() {
		// remove o título da widget no slot.
		this.DOM.parents('.wcm_corpo_widget_single').siblings('.wcm_title_widget').remove();

		this.getDocumentByDatasetName();
	},

	showMoreBirthdays: function(el, ev) {
		var limit = this.limit, offset = this.offset;
		this.hideMoreBirthdaysButton();
		this.startLoadingAnimation();
		if (this.sourceType === this.mapAttrs.FORMULARIO) {
			this.listDatasetBirthdays(limit, offset);
		} else {
			this.listRMBirthdays(limit, offset);
		}
	},

	getDocumentByDatasetName: function() {
		var that = this, limit = this.limit, offset = this.offset;
		this.hideMoreBirthdaysButton();
		this.serviceGetDocumentByDatasetName(function(err, data) {
			if (err) {
				return false;
			}
			that.formID = data.content.id;
			if (!that.isEditMode) {
				$('#birthdayMonth_' + that.instanceId).append(' ' + that.getCurrentMonth());
				that.startLoadingAnimation();
				if (that.sourceType === that.mapAttrs.FORMULARIO) {
					that.listDatasetBirthdays(limit, offset);
				} else {
					that.listRMBirthdays(limit, offset);
				}
				that.validateImage();
			} else {
				that.editMode();
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

	listDatasetBirthdays: function(limit, offset) {
		var that = this, constraint = [], dataset;
		constraint.push(DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST));

		dataset = DatasetFactory.getDataset(this.mapAttrs.APPLICATION_CODE, null, constraint, this.getSortingFields());

		if (dataset !== null && dataset.values.length > 0) {
			var docId = dataset.values[0]['metadata#id'];

			if (docId === null || docId.length === 0 || !that.hasBirthdayCurrentMonth(dataset.values)) {
				this.displayNoDataFoundMessage();
			} else {
				var birthdays = [];
				dataset.values = this.normalizeDatasetValues(dataset.values);

				var sortedBirthdays = that.appendValues(dataset.values);

				var len = limit + offset <= sortedBirthdays.length ? limit + offset : sortedBirthdays.length;

				for (var i = offset; i < len; i++) {
					if (sortedBirthdays[i].id !== null) {
						var item = sortedBirthdays[i];
						that.birthdaysData[item.documentId] = item;
						if (this.isBirthdayToday(sortedBirthdays[i].birthMonth, sortedBirthdays[i].birthDay)) {
							item.isToday = true;
						}
						birthdays.push(item);
					}
				}

				if (birthdays.length) {
					that.appendRecords(birthdays);
					if (birthdays.length < that.limit || sortedBirthdays.length == len) {
						that.hideMoreBirthdaysButton();
					}
				} else {
					that.hideMoreBirthdaysButton();
				}
			}
		} else {
			that.displayMessageIntoWidget('${i18n.getTranslation("kit_aniversariantes.noitens")}');
		}

		this.stopLoadingAnimation();
	},

	getBirthdaysRMParams: function(birthdays) {
		var params, birthday;
		if (!birthdays.birthMonth && !birthdays.birthDay) {
			birthday = birthdays.birthday.split('/');
			birthdays.birthDay = birthday[0];
			birthdays.birthMonth = birthday[1];
		}
		params = {
			documentId: birthdays.documentId,
			name: birthdays.name,
			birthday: this.normalizeBirthday(birthdays.birthMonth, birthdays.birthDay),
			imgURL: this.getImageURL(birthdays),
			isToday: birthdays.isToday,
			email: birthdays.email
		};
		return params;
	},

	getBirthdaysParams: function(birthdays) {
		var params, birthday;
		if (!birthdays.birthMonth && !birthdays.birthDay) {
			birthday = birthdays.birthday.split('/');
			birthdays.birthDay = birthday[0];
			birthdays.birthMonth = birthday[1];
		}
		params = {
			documentId: birthdays.documentid,
			name: birthdays.name,
			birthday: this.normalizeBirthday(birthdays.birthMonth, birthdays.birthDay),
			imgURL: this.getImageURL(birthdays),
			isToday: birthdays.isToday,
		};
		return params;
	},

	showMoreBirthdaysButton: function() {
		$('[data-more-birthdays]', this.DOM).show();
	},

	hideMoreBirthdaysButton: function() {
		$('[data-more-birthdays]', this.DOM).hide();
	},

	appendRecords: function(birthdays) {
		var html = Mustache.render(this.templates['birthdays-template'], birthdays, {
			birthdays: this.templates['birthday-template']
		});
		this.offset += birthdays.length;
		$('#birthdays-wrapper_' + this.instanceId).append(html);
		this.showMoreBirthdaysButton();
	},

	definePreferences: function() {
		var view = (this.isEditMode) ? '' : 'View';
		var $sourceType = $('#sourceType' + view + '_' + this.instanceId).val();
		if ($sourceType) {
			this.sourceType = $sourceType;
		} else {
			this.sourceType = 'form';
		}
		this.formLink = $('#formLink' + view + '_' + this.instanceId).val();
		this.rmLink = $('#rmLink' + view + '_' + this.instanceId).val();
		this.rmUser = $('#rmUser' + view + '_' + this.instanceId).val();
		this.rmPass = $('#rmPass' + view + '_' + this.instanceId).val();
	},

	normalizeDatasetValues: function(values) {
		for (var i = 0; i < values.length; i++) {
			values[i].birthDay = values[i].birthDay ? values[i].birthDay : values[i].BIRTHDAY;
			values[i].birthMonth = values[i].birthMonth ? values[i].birthMonth : values[i].BIRTHMONTH;
			values[i].fullName = values[i].fullName ? values[i].fullName : values[i].FULLNAME;
		}
		return values;
	},

	listRMBirthdays: function(limit, offset) {
		var that = this, response, ret;
		var month = new Date().getUTCMonth() + 1;
		if (that.rmData.length) {
			that.renderBirthday(that, limit, offset);
		} else {
			that.getBirthdays(month, function(err, data) {
				if (err) {
					that.showMessageError('', '${i18n.getTranslation("kit_aniversariantes.error.rm")}');
					that.hideMoreBirthdaysButton();
					that.stopLoadingAnimation();
					return false;
				}
				response = that.getFormattedData(data);
				if (response.length === 0) {
					that.displayNoDataFoundMessage();
				} else {
					/*
					 * Foi utilizada a estratégia de buscar dados no RM e paginar manipulando esse array retornado. Para
					 * Casos em que há um número muito grande de registros, deve-se usar uma estratégia diferente de
					 * acordo com a fonte de dados.
					 */
					if (that.rmData.length === 0) {
						that.rmData = that.appendValues(response);
					}

					if (that.rmData.length) {
						that.renderBirthday(that, limit, offset);
					} else {
						that.displayMessageIntoWidget('${i18n.getTranslation("kit_aniversariantes.noitens")}');
					}
				}
			});

		}
	},

	renderBirthday: function(that, limit, offset) {
		var birthdays = [];
		var len = limit + offset <= that.rmData.length ? limit + offset : that.rmData.length;

		for (var i = offset; i < len; i++) {
			if (that.rmData[i].documentId !== null) {
				var item = that.getBirthdaysRMParams(that.rmData[i]);
				that.birthdaysData[item.documentId] = item;
				if (that.isBirthdayToday(that.rmData[i].birthMonth, that.rmData[i].birthDay)) {
					item.isToday = true;
				}
				birthdays.push(item);
			}
		}

		if (birthdays.length) {
			that.appendRecords(birthdays);
			if (birthdays.length < that.limit || that.rmData.length == len) {
				that.hideMoreBirthdaysButton();
			}
		} else {
			that.hideMoreBirthdaysButton();
		}
	},

	getFormattedData: function(birthdays) {
		birthdays = birthdays.ReadViewResponse.ReadViewResult.NewDataSet.PPESSOA;
		if ($.isArray(birthdays) == false) {
		    birthdays = [birthdays];
		}
		var formattedData = [];
		birthdays.forEach(function(item) {
			if (item.FUNCIONARIO == 1) {
				var date = new Date(item.DTNASCIMENTO);
				formattedData.push({
					fullName: item.NOME,
					birthDay: date.getUTCDate(),
					birthMonth: date.getUTCMonth() + 1,
					cod: item.CODIGO,
					email: item.EMAIL,
					id: item.ID
				});
			}

		});
		return formattedData;
	},

	appendDatasetBirthday: function(user, last) {
		var params = {
			documentId: user.cod,
			name: user.fullName,
			birthday: this.normalizeBirthday(user.birthMonth, user.birthDay),
			imgURL: this.getImageURL(user),
			isToday: user.isToday,
			isLast: last,
			email: user.email
		};
		return params;
	},

	displayNoDataFoundMessage: function() {
		this.displayMessageIntoWidget('${i18n.getTranslation("kit_aniversariantes.noitens.toshow")}' + ' '
			+ this.getCurrentMonth() + '.');
	},

	displayMessageIntoWidget: function(message) {
		var $msg = $('<div>').addClass('alert alert-info');
		$msg.attr('style', 'role: info;');
		$msg.text(message);
		$('#birthdays-wrapper_' + this.instanceId).prepend($msg);
	},

	displayErrorMessage: function() {
		var $msg = $('<div>').addClass('alert alert-danger');
		$msg.attr('style', 'role: info;');
		$msg.text('${i18n.getTranslation("kit_aniversariantes.error.rm")}');
		$('#birthdays-wrapper_' + this.instanceId).html($msg);
	},

	editMode: function() {
		if (this.sourceType === this.mapAttrs.RM) {
			this.rmChosen();
		} else {
			this.formChosen();
		}
	},

	getFormURL: function() {
		return WCMAPI.getServerURL() + WCMAPI.getProtectedContextPath() + '/' + WCMAPI.getTenantCode()
			+ '/ecmnavigation?app_ecm_navigation_doc=' + this.formID;
	},

	getImageURL: function(item) {
		return this.sourceType === this.mapAttrs.FORMULARIO ? this.getImageFromForm(item) : this.getImageFromRM(item);
	},

	getImageFromForm: function(item) {
		return WCMAPI.getServerURL() + '/webdesk/streamcontrol/padrao.png?' + 'WDCompanyId=' + WCMAPI.getTenantId()
			+ '&' + 'WDNrDocto=' + item['metadata#id'] + '&' + 'WDNrVersao=' + item['metadata#version'];
	},

	getImageFromRM: function(item) {
		return this.getIdByEmail(item.email);
	},

	getIdByEmail: function(email) {
        var url = '/api/public/profile/image/';
        if (email) {
               var constraint = DatasetFactory.createConstraint('mail', email, email, ConstraintType.MUST);
               var dataset = DatasetFactory.getDataset('colleague', null, [constraint], null);
               if (dataset && dataset.values.length > 0 && dataset.values[0].mail) {
                   url = url + dataset.values[0]["login"] + '/DEFAULT_PICTURE';
               }
        }
        return url;
    },

	getSortingFields: function() {
		var sortingFields = [];
		sortingFields.push('birthMonth');
		sortingFields.push('birthDay');
		return sortingFields;
	},

	formChosen: function() {
		this.chooseSourceType(this.mapAttrs.FORMULARIO);
		var url = this.getFormURL();
		var $link = $('#formLink_' + this.instanceId);
		$link.text(url);
		$link.attr('href', url);
	},

	rmChosen: function() {
		this.chooseSourceType(this.mapAttrs.RM);
	},

	chooseSourceType: function(type) {
		var $optionButton = $('#sourceTypeButton_' + this.instanceId);
		var displayFormData = null;
		var displayRMData = null;
		$('#sourceType_' + this.instanceId).val(type);
		this.sourceType = type;
		if (type === this.mapAttrs.RM) {
			$optionButton.text('${i18n.getTranslation("kit_aniversariantes.opt.rm")}' + ' ');
			displayFormData = 'none';
			displayRMData = '';
		} else {
			$optionButton.text('${i18n.getTranslation("kit_aniversariantes.opt.form")}' + ' ');
			displayFormData = '';
			displayRMData = 'none';
		}

		$('#buttonLoadForms_' + this.instanceId).attr('style', 'display: ' + displayFormData + ';');
		$('#formForm_' + this.instanceId).attr('style', 'display: ' + displayFormData + ';');
		$('#formRM_' + this.instanceId).attr('style', 'display: ' + displayRMData + ';');
		$('<span>').addClass('caret').appendTo($optionButton);
	},

	savePreferences: function() {
		var preferences = this.getPreferencesFromScreen();
		if (!this.hasInvalidFields()) {
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
						title: '${i18n.getTranslation("kit_aniversariantes.preferences.error")}',
						message: errorData.message,
						type: 'warning'
					});
				}
			}, this.instanceId, preferences);
		} else {
			this.showMessageError('${i18n.getTranslation("kit_aniversariantes.preferences.error")}',
				'${i18n.getTranslation("kit_aniversariantes.preferences.error.invalidfields")}');
		}
	},

	getPreferencesFromScreen: function() {
		this.definePreferences();
		return {
			sourceType: this.sourceType,
			formLink: this.formLink,
			rmLink: this.rmLink,
			rmUser: this.rmUser,
			rmPass: this.rmPass
		};
	},

	getBirthdays: function(month, callback) {
		this.serviceGetBirthdays(month, function(err, data) {
			if (err) {
				callback(err);
				return false;
			}
			callback(null, data);
		});
	},

	sortBirthdays: function(values) {
		this.birthdayList = [];
		this.thisMonthBirthdays = [];

		var todayBirthdays = [];
		var upcomingBirthdaysThisMonth = [];
		var currentDate = new Date();

		for (var i = 0; i < values.length; i++) {
			var x = values[i];
			x.isToday = false;
			x.documentId = values[i].cod;
			this.birthdayList.push(x);

			if (this.isBirthdayToday(x.birthMonth, x.birthDay)) {
				x.isToday = true;
				todayBirthdays.push(x);
			} else if ((x.birthMonth == (currentDate.getUTCMonth() + 1)) && x.birthDay > currentDate.getUTCDate()) {
				upcomingBirthdaysThisMonth.push(x);
			}
		}

		this.birthdayList = this.getSortedBirthdays(this.birthdayList);
		this.thisMonthBirthdays = this.getSortedBirthdays(upcomingBirthdaysThisMonth);
		this.thisMonthBirthdays = todayBirthdays.concat(this.thisMonthBirthdays);
	},

	appendValues: function(values) {
		this.sortBirthdays(values);
		var items = [];
		for (var i = 0; i < this.thisMonthBirthdays.length; i++) {
			items.push(this.appendDatasetBirthday(this.thisMonthBirthdays[i], false));
		}
		return items;
	},

	isAValidURL: function(url) {
		var myRegExpURL = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9_\-]+)+\.([a-zA-Z]{2,4})(?:\.([a-zA-Z]{2,4}))?\/?(.*)$/;
		var myRegExpIP = /[http|https]+\:\/\/[\w\d\.\-]+\:\d+/i;
		return (myRegExpURL.test(url) || myRegExpIP.test(url));
	},

	validateImage: function() {
		var imgURL = '/social/api/rest/social/image/profile/';
		$('.userImage').load(function() {
			if (this.naturalWidth === 1 && this.naturalHeight === 1) {
				$(this).attr('src', imgURL);
			}
		});
	},

	normalizeBirthday: function(month, day) {
		var result = '';

		month = !isNaN(month) && parseInt(month, 10) < 10 ? '0' + parseInt(month, 10) : month;
		day = !isNaN(day) && parseInt(day, 10) < 10 ? '0' + parseInt(day, 10) : day;

		if (WCMAPI.getLocale() === 'en_US') {
			result = month + '/' + day;
		} else {
			result = day + '/' + month;
		}
		return result;
	},

	isBirthdayToday: function(month, day) {
		var today = new Date();
		return !isNaN(month) && !isNaN(day) && today.getDate() === parseInt(day)
			&& today.getMonth() === (parseInt(month) - 1);
	},

	showMessageError: function(titleErr, error) {
		FLUIGC.toast({
			title: titleErr,
			message: error,
			type: 'danger'
		});
	},

	hasInvalidFields: function() {
		var hasError = false;
		this.clearHighlight();
		if ((!this.rmLink) && this.sourceType === 'rm') {
			this.highlightFields('${i18n.getTranslation("kit_aniversariantes.error.invalidlink")}', 'rmLink');
			hasError = true;
		}
		if ((this.rmLink) && !this.isAValidURL(this.rmLink) && this.sourceType === 'rm') {
			this.highlightFields('${i18n.getTranslation("kit_aniversariantes.error.invalidlink")}', 'rmLink');
			hasError = true;
		}
		if ((!this.rmUser) && this.sourceType === 'rm') {
			this.highlightFields('${i18n.getTranslation("kit_aniversariantes.error.login")}', 'rmUser');
			hasError = true;
		}
		if ((!this.rmPass) && this.sourceType === 'rm') {
			this.highlightFields('${i18n.getTranslation("kit_aniversariantes.error.password")}', 'rmPass');
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
			var fields = ['rmLink', 'rmUser', 'rmPass'];
			for ( var i in fields) {
				$('#' + fields[i] + 'Div_' + this.instanceId).removeClass('has-error');
				$('#' + fields[i] + '_' + this.instanceId).removeAttr('data-toggle');
				$('#' + fields[i] + '_' + this.instanceId).removeAttr('placement');
				$('#' + fields[i] + '_' + this.instanceId).removeAttr('title');
			}
		}
	},

	getCurrentMonth: function() {
		var currentDate = new Date();
		var MONTHS = ['${i18n.getTranslation("kit_aniversariantes.months.jan")}',
			'${i18n.getTranslation("kit_aniversariantes.months.feb")}',
			'${i18n.getTranslation("kit_aniversariantes.months.mar")}',
			'${i18n.getTranslation("kit_aniversariantes.months.apr")}',
			'${i18n.getTranslation("kit_aniversariantes.months.may")}',
			'${i18n.getTranslation("kit_aniversariantes.months.jun")}',
			'${i18n.getTranslation("kit_aniversariantes.months.jul")}',
			'${i18n.getTranslation("kit_aniversariantes.months.aug")}',
			'${i18n.getTranslation("kit_aniversariantes.months.sep")}',
			'${i18n.getTranslation("kit_aniversariantes.months.oct")}',
			'${i18n.getTranslation("kit_aniversariantes.months.nov")}',
			'${i18n.getTranslation("kit_aniversariantes.months.dec")}'];
		return MONTHS[currentDate.getMonth()];
	},

	getSortedBirthdays: function(datasetValues) {
		var currentDate = new Date();
		var currentMonth = currentDate.getUTCMonth() + 1;
		var currentMonthBirthdays = [];
		datasetValues.forEach(function(data) {
			if (data.birthMonth == currentMonth) {
				currentMonthBirthdays.push(data);
			}
		});
		currentMonthBirthdays.sort(this.compareBirthdays);

		return currentMonthBirthdays;
	},

	compareBirthdays: function(a, b) {
		if (parseInt(a.birthDay) < parseInt(b.birthDay)) {
			return -1;
		}
		if (parseInt(a.birthDay) > parseInt(b.birthDay)) {
			return 1;
		}
		return 0;
	},

	serviceGetDocumentByDatasetName: function(cb) {
		var options = {
			url: '/api/public/ecm/document/getDocumentByDatasetName/' + this.mapAttrs.APPLICATION_CODE
		};
		FLUIGC.ajax(options, cb);
	},

	serviceGetBirthdays: function(month, cb) {
		var options = {
			url: '/' + this.mapAttrs.APPLICATION_CODE + '/api/rest/birthdays/today?month=' + month + '&instanceId='
				+ this.instanceId,
			timeout: 30000
		};
		FLUIGC.ajax(options, cb);
	},

	hasBirthdayCurrentMonth: function(datasetValues) {
		var currentDate = new Date();
		var currentMonthHasBirthday = false;
		datasetValues.forEach(function(data, index) {
			var birthDay = parseInt(datasetValues[index].birthDay);
			if (currentDate.getUTCMonth() + 1 == data.birthMonth && currentDate.getUTCDate() <= birthDay) {
				currentMonthHasBirthday = true;
			}
		});

		return currentMonthHasBirthday;
	}

});
