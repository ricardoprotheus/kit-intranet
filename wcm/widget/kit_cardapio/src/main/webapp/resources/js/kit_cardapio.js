var WidgetCardapio = SuperWidget.extend({
	COURSES: null,
	LIMIT: 2,
	OFFSET: 0,
	numberOfRecords: null,

	bindings: {
		local: {
			'load-more': ['click_loadMore'],
			'show-detail': ['click_showDetail'],
			'number-of-records': ['change_checkNumberOfRecords', 'keyup_checkNumberOfRecords'],
			'save-settings': ['click_saveSettings']
		},
		global: {}
	},

	init: function() {
		// remove o título da widget no slot.
		this.DOM.parents('.wcm_corpo_widget_single').siblings('.wcm_title_widget').remove();

		if (this.isEditMode) {
			this.serviceGetSettings();
		} else {
			this.serviceGetCourses();
		}
	},

	serviceGetSettings: function() {
		var _this = this, settings = {
			url: '/api/public/ecm/document/getDocumentByDatasetName/kit_cardapio',
			type: "GET",
			cache: false
		};
		FLUIGC.ajax(settings, function(error, data) {
			if (!error) {
				var formLink = WCMAPI.getServerURL() + WCMAPI.getProtectedContextPath() + '/' + WCMAPI.getTenantCode()
					+ "/ecmnavigation?app_ecm_navigation_doc=" + data.content.id;
				$('[data-form-link]', _this.DOM).attr('href', formLink).text(formLink);
			}
		});
	},

	serviceGetCourses: function() {
		var _this = this, courses = [], constraintActive = DatasetFactory.createConstraint('metadata#active', true,
			true, ConstraintType.MUST), constraints = [constraintActive], callback = {
			success: function(data) {
				_this.COURSES = _this.reorderCourses(data);
				_this.loadCourses();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('[data-row-load-more]', _this.DOM).addClass('fs-display-none');
			}
		};
		DatasetFactory.getDataset('kit_cardapio', null, constraints, ['id;desc'], callback);
	},

	reorderCourses: function(courses) {
		var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'], today = new Date()
			.getDay(), prevCourses = [], _this = this;

		for (i = 0; i < courses.values.length; i++) {
			courses.values[i].day = days.indexOf(courses.values[i].dayOfTheWeek);
			courses.values[i].mealDescMin = (courses.values[i].mealDesc.length > 100) ? courses.values[i].mealDesc
				.substr(0, 100).concat('...') : courses.values[i].mealDesc;
			if (courses.values[i].day == today) {
				courses.values[i].isToday = true;
				$('[data-has-not-today]', _this.DOM).addClass('fs-display-none');
			} else {
				courses.values[i].isToday = false;
			}
			courses.values[i].imgUrl = '/webdesk/streamcontrol/padrao.png?WDCompanyId=' + WCMAPI.getTenantId()
				+ '&WDNrDocto=' + courses.values[i]['metadata#id'] + '&WDNrVersao='
				+ courses.values[i]['metadata#version'];
			switch (courses.values[i].dayOfTheWeek) {
				case 'sunday':
					courses.values[i].dayOfTheWeek = '${i18n.getTranslation("kit_cardapio.sunday")}';
					break;
				case 'monday':
					courses.values[i].dayOfTheWeek = '${i18n.getTranslation("kit_cardapio.monday")}';
					break;
				case 'tuesday':
					courses.values[i].dayOfTheWeek = '${i18n.getTranslation("kit_cardapio.tuesday")}';
					break;
				case 'wednesday':
					courses.values[i].dayOfTheWeek = '${i18n.getTranslation("kit_cardapio.wednesday")}';
					break;
				case 'thursday':
					courses.values[i].dayOfTheWeek = '${i18n.getTranslation("kit_cardapio.thursday")}';
					break;
				case 'friday':
					courses.values[i].dayOfTheWeek = '${i18n.getTranslation("kit_cardapio.friday")}';
					break;
				case 'saturday':
					courses.values[i].dayOfTheWeek = '${i18n.getTranslation("kit_cardapio.saturday")}';
					break;
			}
		}

		prevCourses = courses.values.filter(function(element, index, array) {
			return (element.day < today) ? true : false;
		});

		prevCourses.sort(function(a, b) {
			return a.day - b.day;
		});

		courses.values = courses.values.filter(function(element, index, array) {
			return (element.day >= today) ? true : false;
		});

		courses.values.sort(function(a, b) {
			return a.day - b.day;
		});

		courses.values = courses.values.concat(prevCourses);

		courses.values.splice(this.numberOfRecords, courses.values.length - this.numberOfRecords);
		return courses;
	},

	loadCourses: function() {
		var html;

		if (this.COURSES.values.length - this.OFFSET > 1) {
			for (i = this.OFFSET; i < this.OFFSET + this.LIMIT; i++) {
				this.COURSES.values[i].arrayPosition = i;
				html = Mustache.render(this.templates['template-courses'], this.COURSES.values[i]);
				$('[data-list-courses]', this.DOM).append(html);
			}
		} else if (this.COURSES.values.length - this.OFFSET == 1) {
			this.COURSES.values[i].arrayPosition = this.OFFSET;
			html = Mustache.render(this.templates['template-courses'], this.COURSES.values[this.OFFSET]);
			$('[data-list-courses]', this.DOM).append(html);
			$('[data-row-load-more]', this.DOM).addClass('fs-display-none');
		} else {
			$('[data-row-load-more]', this.DOM).addClass('fs-display-none');
		}
	},

	// Bindings
	loadMore: function(el, ev) {
		this.OFFSET = this.OFFSET + this.LIMIT;
		this.loadCourses();
	},

	showDetail: function(el, ev) {
		var arrayPosition = $(el).data('array-position'), myModal = FLUIGC.modal({
			title: this.COURSES.values[arrayPosition].dayOfTheWeek,
			content: Mustache.render(this.templates['template-course-detail'], this.COURSES.values[arrayPosition]),
			id: 'fluig-modal_' + this.instanceId
		});
		myModal.show();
	},

	checkNumberOfRecords: function(el, ev) {
		var $el = $(el), $formGroup = $el.parents('.form-group:first'), $saveSettings = $('[data-save-settings]',
			this.DOM), numberOfRecords = parseInt($el.val());

		if (numberOfRecords <= 0) {
			$saveSettings.attr('disabled', 'disabled');
			$formGroup.addClass('has-error');
		} else if (isNaN(numberOfRecords)) {
			$el.val('');
		} else {
			$saveSettings.removeAttr('disabled');
			$formGroup.removeClass('has-error');
		}
	},

	saveSettings: function(el, ev) {
		var settings = {
			numberOfRecords: $('[data-number-of-records]', this.DOM).val()
		};
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
					title: '${i18n.getTranslation("kit_cardapio.error.saving.preferences")}',
					message: errorData.message,
					type: 'warning'
				});
			}
		}, this.instanceId, settings);
	}
});