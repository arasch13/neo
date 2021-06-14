import CalendarsContainer from './CalendarsContainer.mjs';
import Container          from '../../container/Base.mjs';
import DateSelector       from '../../component/DateSelector.mjs';
import DateUtil           from '../../util/Date.mjs';
import DayComponent       from './DayComponent.mjs';
import EditEventContainer from './EditEventContainer.mjs';
import MainContainerModel from './MainContainerModel.mjs';
import MonthComponent     from './month/Component.mjs';
import SettingsContainer  from './SettingsContainer.mjs';
import Toolbar            from '../../container/Toolbar.mjs';
import WeekComponent      from './week/Component.mjs';
import YearComponent      from './YearComponent.mjs';

const todayDate = new Date();

/**
 * @class Neo.calendar.view.MainContainer
 * @extends Neo.container.Base
 */
class MainContainer extends Container {
    static getStaticConfig() {return {
        /**
         * Valid entries for the views config
         * @member {String[]} validViews=['day','week','month','year']
         * @static
         */
        validViews: ['day', 'week', 'month', 'year']
    }}

    static getConfig() {return {
        /**
         * @member {String} className='Neo.calendar.view.MainContainer'
         * @protected
         */
        className: 'Neo.calendar.view.MainContainer',
        /**
         * @member {String} ntype='calendar-maincontainer'
         * @protected
         */
        ntype: 'calendar-maincontainer',
        /**
         * The currently active view. Must be a value included inside the views config.
         * valid values: 'day', 'week', 'month', 'year'
         * @member {String} activeView_='week'
         */
        activeView_: 'week',
        /**
         * Scale the calendar with using s different base font-size
         * @member {Number|null} baseFontSize_=null
         */
        baseFontSize_: null,
        /**
         * @member {Neo.calendar.view.CalendarsContainer|null} calendarsContainer=null
         */
        calendarsContainer: null,
        /**
         * @member {Object|null} calendarStoreConfig_=null
         */
        calendarStoreConfig_: null,
        /**
         * @member {String[]} cls=['neo-container']
         */
        cls: ['neo-calendar-maincontainer', 'neo-container'],
        /**
         * The currently active date inside all views
         * @member {Date} currentDate_=new Date()
         */
        currentDate_: todayDate,
        /**
         * @member {Neo.component.DateSelector|null} dateSelector=null
         */
        dateSelector: null,
        /**
         * @member {Object|null} dateSelectorConfig=null
         */
        dateSelectorConfig: null,
        /**
         * @member {Neo.calendar.view.DayComponent|null} dayComponent=null
         */
        dayComponent: null,
        /**
         * @member {Object|null} dayComponentConfig=null
         */
        dayComponentConfig: null,
        /**
         * Read only
         * @member {Neo.calendar.view.EditEventContainer|null} editEventContainer_=null
         */
        editEventContainer_: null,
        /**
         * @member {Object|null} editEventContainerConfig=null
         */
        editEventContainerConfig: null,
        /**
         * Only full hours are valid for now
         * format: 'hh:mm'
         * @member {String} endTime_='24:00'
         */
        endTime_: '24:00',
        /**
         * @member {Object|null} eventStoreConfig_=null
         */
        eventStoreConfig_: null,
        /**
         * @member {Intl.DateTimeFormat|null} intlFormat_time=null
         * @protected
         */
        intlFormat_time: null,
        /**
         * @member {Object} layout={ntype:'vbox',align:'stretch'}
         * @protected
         */
        layout: {ntype: 'vbox', align: 'stretch'},
        /**
         * @member {String} locale_=Neo.config.locale
         */
        locale_: Neo.config.locale,
        /**
         * Time in minutes
         * @member {Number} minimumEventDuration_=30
         */
        minimumEventDuration_: 30,
        /**
         * @member {Neo.calendar.view.MainContainerModel} model=MainContainerModel
         */
        model: MainContainerModel,
        /**
         * @member {Neo.calendar.view.Component|null} monthComponent=null
         */
        monthComponent: null,
        /**
         * @member {Object|null} monthComponentConfig=null
         */
        monthComponentConfig: null,
        /**
         * True to only keep the active view inside the DOM
         * @member {Boolean} removeInactiveCards=true
         */
        removeInactiveCards: true,
        /**
         * True to scroll new years in from the top
         * @member {Boolean} scrollNewYearFromTop_=false
         */
        scrollNewYearFromTop_: false,
        /**
         * @member {Object|null} settingsContainerConfig=null
         */
        settingsContainerConfig: null,
        /**
         * @member {Number} settingsContainerWidth=300
         */
        settingsContainerWidth: 310,
        /**
         * @member {Boolean} settingsExpanded_=false
         */
        settingsExpanded_: false,
        /**
         * @member {Boolean} showWeekends_=true
         */
        showWeekends_: true,
        /**
         * @member {Boolean} sideBarExpanded_=true
         */
        sideBarExpanded_: true,
        /**
         * @member {Number} sideBarWidth=220
         */
        sideBarWidth: 220,
        /**
         * Only full hours are valid for now
         * format: 'hh:mm'
         * @member {String} startTime_='00:00'
         */
        startTime_: '00:00',
        /**
         * @member {Object} timeFormat_={hour:'2-digit',minute:'2-digit'}
         */
        timeFormat_: {hour: '2-digit', minute: '2-digit'},
        /**
         * @member {Boolean} useSettingsContainer_=true
         */
        useSettingsContainer_: true,
        /**
         * Any combination and order of 'day', 'week', 'month', 'year'
         * @member {String[]} views_=['day', 'week', 'month', 'year']
         */
        views_: ['day', 'week', 'month', 'year'],
        /**
         * @member {Neo.calendar.view.Component|null} weekComponent=null
         */
        weekComponent: null,
        /**
         * @member {Object|null} weekComponentConfig=null
         */
        weekComponentConfig: null,
        /**
         * 0-6 => Sun-Sat
         * @member {Number} weekStartDay_=0
         */
        weekStartDay_: 0,
        /**
         * @member {Neo.calendar.view.YearComponent|null} yearComponent=null
         */
        yearComponent: null,
        /**
         * @member {Object|null} yearComponentConfig=null
         */
        yearComponentConfig: null
    }}

    /**
     *
     * @param {Object} config
     */
    constructor(config) {
        super(config);

        let me = this;

        me.createItemsContent();

        if (!me.sideBarExpanded) {
            me.afterSetSideBarExpanded(false, true);
        }
    }

    /**
     * Triggered after the baseFontSize config got changed
     * @param {String} value
     * @param {String} oldValue
     * @protected
     */
    afterSetBaseFontSize(value, oldValue) {
        if (oldValue !== undefined) {
            let style = this.style || {};

            if (!value) {
                delete style.fontSize;
            } else {
                style.fontSize = `${value}px`;
            }

            this.style = style;
        }
    }

    /**
     * Triggered after the currentDate config got changed
     * todo: Only update the active view, adjust the state on card change
     * @param {Date} value
     * @param {Date} oldValue
     * @protected
     */
    afterSetCurrentDate(value, oldValue) {
        if (oldValue !== undefined) {
            let me = this;

            me.weekComponent.currentDate = value;
            me.yearComponent.currentDate = value;
            me.dateSelector .value       = DateUtil.convertToyyyymmdd(value);
        }
    }

    /**
     * Triggered after the endTime config got changed
     * @param {String} value
     * @param {String} oldValue
     * @protected
     */
    afterSetEndTime(value, oldValue) {
        if (oldValue !== undefined) {
            this.down({ntype: 'calendar-timeaxis'}, false).forEach(item => {
                item.endTime = value;
            });
        }
    }

    /**
     * Triggered after the locale config got changed
     * @param {String} value
     * @param {String} oldValue
     * @protected
     */
    afterSetLocale(value, oldValue) {
        if (oldValue !== undefined) {
            let me = this;

            me.intlFormat_time = new Intl.DateTimeFormat(value, me.timeFormat);
            me.setViewConfig('locale', value);
        }
    }

    /**
     * Triggered after the minimumEventDuration config got changed
     * @param {Number} value
     * @param {Number} oldValue
     * @protected
     */
    afterSetMinimumEventDuration(value, oldValue) {
        if (oldValue !== undefined) {
            this.weekComponent.minimumEventDuration = value;
        }
    }

    /**
     * Triggered after the scrollNewYearFromTop config got changed
     * @param {String} value
     * @param {String} oldValue
     * @protected
     */
    afterSetScrollNewYearFromTop(value, oldValue) {
        if (oldValue !== undefined) {
            this.dateSelector .scrollNewYearFromTop = value;
            this.yearComponent.scrollNewYearFromTop = value;
        }
    }

    /**
     * Triggered after the settingsExpanded config got changed
     * @param {Boolean} value
     * @param {Boolean} oldValue
     * @protected
     */
    afterSetSettingsExpanded(value, oldValue) {
        if (Neo.isBoolean(oldValue)) {
            let me                = this,
                settingsContainer = me.items[1].items[2];

            if (value) {
                settingsContainer.expand();
            } else {
                settingsContainer.collapse(me.settingsContainerWidth);
            }
        }
    }

    /**
     * Triggered after the showWeekends config got changed
     * @param {Boolean} value
     * @param {Boolean} oldValue
     * @protected
     */
    afterSetShowWeekends(value, oldValue) {
        if (oldValue !== undefined) {
            this.setViewConfig('showWeekends', value);
        }
    }

    /**
     * Triggered after the sideBarExpanded config got changed
     * @param {Boolean} value
     * @param {Boolean} oldValue
     * @protected
     */
    afterSetSideBarExpanded(value, oldValue) {
        if (oldValue !== undefined) {
            let me      = this,
                sideBar = me.items[1].items[0],
                style   = sideBar.style || {},
                vdom;

            if (value) {
                delete sideBar.vdom.removeDom;

                me.promiseVdomUpdate().then(() => {
                    sideBar.mounted = true;

                    setTimeout(() => {
                        style.marginLeft = '0px';
                        sideBar.style = style;
                    }, 50);
                });
            } else {
                style.marginLeft    = `-${me.sideBarWidth}px`;
                sideBar._style      = style; // silent update
                sideBar._vdom.style = style; // silent update

                me.promiseVdomUpdate().then(() => {
                    setTimeout(() => {
                        vdom = sideBar.vdom;
                        vdom.removeDom = true;
                        sideBar.vdom = vdom;
                    }, 400);
                });
            }
        }
    }

    /**
     * Triggered after the startTime config got changed
     * @param {String} value
     * @param {String} oldValue
     * @protected
     */
    afterSetStartTime(value, oldValue) {
        if (oldValue !== undefined) {
            this.down({ntype: 'calendar-timeaxis'}, false).forEach(item => {
                item.startTime = value;
            });
        }
    }

    /**
     * Triggered after the timeFormat config got changed
     * @param {Object} value
     * @param {Object} oldValue
     * @protected
     */
    afterSetTimeFormat(value, oldValue) {
        this.intlFormat_time = new Intl.DateTimeFormat(this.locale, value);
    }

    /**
     * Triggered after the weekStartDay config got changed
     * @param {Number} value
     * @param {Number} oldValue
     * @protected
     */
    afterSetWeekStartDay(value, oldValue) {
        if (oldValue !== undefined) {
            this.setViewConfig('weekStartDay', value);
        }
    }

    /**
     * Gets triggered before getting the value of the editEventContainer config
     * @param {Neo.calendar.view.EditEventContainer|null} value
     * @returns {Neo.calendar.view.EditEventContainer}
     */
    beforeGetEditEventContainer(value) {
        if (!value) {
            let me = this;

            me._editEventContainer = value = Neo.create({
                module : EditEventContainer,
                appName: me.appName,
                owner  : me,
                width  : 250,
                ...me.editEventContainerConfig || {}
            });
        }

        return value;
    }

    /**
     * Triggered before the views config gets changed.
     * @param {String[]} value
     * @param {String[]} oldValue
     * @protected
     */
    beforeSetViews(value, oldValue) {
        let validViews = this.getStaticConfig('validViews');

        value.forEach(view => {
            if (!validViews.includes(view)) {
                console.error(view, 'is not a valid entry for views. Stick to:', validViews);
                return oldValue;
            }
        });

        return value;
    }

    /**
     *
     * @param {String} interval
     * @protected
     */
    changeTimeInterval(interval) {
        let me = this;

        me.items[1].items[1].layout.activeIndex = me.views.indexOf(interval);

        me.items[0].items[1].items.forEach(item => {
            if (item.toggleGroup === 'timeInterval') {
                item.pressed = item.value === interval;
            }
        });

        me.activeView = interval;
    }

    /**
     *
     * @returns {Object[]}
     */
    createHeaderItems() {
        let me    = this,
            items = [{
            module: Toolbar,
            cls   : ['neo-calendar-header-toolbar', 'neo-left', 'neo-toolbar'],
            width : me.sideBarWidth,
            items : [{
                handler: me.toggleSidebar.bind(me),
                iconCls: 'fa fa-bars'
            }, '->', {
                handler: me.onPreviousIntervalButtonClick.bind(me),
                iconCls: 'fa fa-chevron-left',
            }, {
                handler: me.onTodayButtonClick.bind(me),
                height : 24,
                text   : 'Today'
            }, {
                handler: me.onNextIntervalButtonClick.bind(me),
                iconCls: 'fa fa-chevron-right'
            }]
        }, {
            module: Toolbar,
            cls   : ['neo-calendar-header-toolbar', 'neo-toolbar'],
            items : ['->', ...me.createViewHeaderButtons()]
        }];

        if (me.useSettingsContainer) {
            items[1].items.push({
                handler: me.toggleSettings.bind(me),
                iconCls: 'fa fa-cog',
                style  : {marginLeft: '10px'}
            });
        }

        return items;
    }

    /**
     *
     * @protected
     */
    createItemsContent() {
        let me = this;

        me.calendarsContainer = Neo.create({
            module: CalendarsContainer,
            flex  : 1
        });

        me.dateSelector = Neo.create({
            module              : DateSelector,
            flex                : 'none',
            height              : me.sideBarWidth,
            listeners           : {change: me.onDateSelectorChange, scope: me},
            locale              : me.locale,
            scrollNewYearFromTop: me.scrollNewYearFromTop,
            showWeekends        : me.showWeekends,
            value               : DateUtil.convertToyyyymmdd(me.currentDate),
            weekStartDay        : me.weekStartDay,
            ...me.dateSelectorConfig || {}
        });

        me.items = [{
            module: Container,
            flex  : 'none',
            layout: {ntype: 'hbox', align: 'stretch'},
            items : me.createHeaderItems()
        }, {
            module: Container,
            flex  : 1,
            layout: {ntype: 'hbox', align: 'stretch'},
            items : [{
                module: Container,
                cls   : ['neo-calendar-sidebar', 'neo-container'],
                layout: {ntype: 'vbox', align: 'stretch'},
                width : me.sideBarWidth,
                items : [me.dateSelector, me.calendarsContainer]
            }, {
                module: Container,
                flex  : 1,
                items : me.createViews(),
                layout: {
                    ntype              : 'card',
                    activeIndex        : me.views.indexOf(me.activeView),
                    removeInactiveCards: me.removeInactiveCards
                }
            }]
        }];

        if (me.useSettingsContainer) {
            me.items[1].items.push({
                module: SettingsContainer,
                removeInactiveCards: me.removeInactiveCards,
                style              : {marginRight: me.settingsExpanded ? '0' : `-${me.settingsContainerWidth}px`},
                width              : me.settingsContainerWidth,
                ...me.settingsContainerConfig
            });
        }
    }

    /**
     *
     * @returns {Object[]}
     */
    createViewHeaderButtons() {
        let me          = this,
            activeIndex = me.views.indexOf(me.activeView),
            buttons     = [];

        me.views.forEach((view, index) => {
            buttons.push({
                handler    : me.changeTimeInterval.bind(me, view),
                height     : 24,
                pressed    : activeIndex === index,
                text       : Neo.capitalize(view),
                toggleGroup: 'timeInterval',
                value      : view
            });
        });

        return buttons;
    }

    /**
     *
     * @returns {Neo.component.Base[]}
     */
    createViews() {
        let me    = this,
            cards = [],
            cmp;

        const defaultConfig = {
            appName     : me.appName,
            currentDate : me.currentDate,
            locale      : me.locale,
            owner       : me,
            parentId    : me.id,
            showWeekends: me.showWeekends,
            weekStartDay: me.weekStartDay
        };

        const map = {
            day: {
                module: DayComponent,
                style : {padding: '20px'},
                ...defaultConfig,
                ...me.dayComponentConfig || {}
            },
            month: {
                module: MonthComponent,
                ...defaultConfig,
                ...me.monthComponentConfig || {}
            },
            week: {
                module: WeekComponent,
                minimumEventDuration: me.minimumEventDuration,
                ...defaultConfig,
                ...me.weekComponentConfig || {}
            },
            year: {
                module              : YearComponent,
                scrollNewYearFromTop: me.scrollNewYearFromTop,
                ...defaultConfig,
                ...me.yearComponentConfig || {}
            }
        }

        me.views.forEach(view => {
            me[view + 'Component'] = cmp = Neo.create(map[view]);
            cards.push(cmp);
        });

        return cards;
    }

    /**
     *
     */
    destroy(...args) {
        let me = this;

        // remove references, the super call will remove component tree based instances
        me.calendarsContainer = null;
        me.dateSelector       = null;
        me.dayComponent       = null;
        me.monthComponent     = null;
        me.weekComponent      = null;
        me.yearComponent      = null;

        super.destroy(...args);
    }

    /**
     *
     * @param {Object[]} data
     */
    onCalendarStoreLoad(data) {
        console.log('onCalendarStoreLoad', data);
        this.calendarsContainer.onStoreLoad(data);
    }

    /**
     *
     * @param {Object} opts
     * @param {String} opts.oldValue
     * @param {String} opts.value
     */
    onDateSelectorChange(opts) {
        if (opts.oldValue !== undefined) {
            this.currentDate = new Date(opts.value);
        }
    }

    /**
     *
     * @param data
     */
    onNextIntervalButtonClick(data) {
        this.switchInterval(1);
    }

    /**
     *
     * @param data
     */
    onPreviousIntervalButtonClick(data) {
        this.switchInterval(-1);
    }

    /**
     *
     * @param data
     */
    onTodayButtonClick(data) {
        this.currentDate = todayDate;
    }

    /**
     * Sets a config for the DateSelector and all views (cards)
     * @param {String} key
     * @param {*} value
     */
    setViewConfig(key, value) {
        let me = this;

        me.dateSelector[key] = value;

        me.views.forEach(view => {
            me[`${view}Component`][key] = value;
        });
    }

    /**
     *
     * @protected
     */
    toggleSettings() {
        this.settingsExpanded = !this.settingsExpanded;
    }

    /**
     *
     * @protected
     */
    toggleSidebar() {
        this.sideBarExpanded = !this.sideBarExpanded;
    }

    /**
     *
     * @param {Number} multiplier
     */
    switchInterval(multiplier) {
        let me          = this,
            currentDate = me.currentDate; // cloned

        const map = {
            day  : () => {currentDate.setDate(    currentDate.getDate()     + multiplier)},
            month: () => {currentDate.setMonth(   currentDate.getMonth()    + multiplier)},
            week : () => {currentDate.setDate(    currentDate.getDate() + 7 * multiplier)},
            year : () => {currentDate.setFullYear(currentDate.getFullYear() + multiplier)}
        };

        map[me.activeView]();
        me.currentDate = currentDate;
    }
}

Neo.applyClassConfig(MainContainer);

export {MainContainer as default};
