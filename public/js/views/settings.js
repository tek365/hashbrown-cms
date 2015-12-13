"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
            }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        function appropriateIssue(issue) {
            // Updating issue milestones requires a number only
            if (issue.milestone) {
                issue.milestone = issue.milestone.number;
            }

            // Updating issue assignees requires a login name only
            if (issue.assignee) {
                issue.assignee = issue.assignee.login;
            }

            // Updating issue labels requires a string only
            if (issue.labels) {
                for (var i in issue.labels) {
                    issue.labels[i] = issue.labels[i].name;
                }
            }

            return issue;
        }

        window.api = {
            call: function call(url, callback, data) {
                data = data || {};

                data.token = localStorage.getItem('gh-oauth-token');

                $.post(url, data, function (res) {
                    if (res.err) {
                        console.log(res.data);
                        alert('(' + res.mode + ') ' + res.url + ': ' + res.err.json.message);
                    } else if (callback) {
                        callback(res);
                    }
                });
            },

            repos: function repos(callback) {
                api.call('/api/' + req.params.user + '/repos/', callback);
            },

            compare: function compare(base, head, callback) {
                api.call('/api/' + req.params.user + '/' + req.params.repo + '/compare/' + base + '/' + head, callback);
            },

            merge: function merge(base, head, callback) {
                api.call('/api/' + req.params.user + '/' + req.params.repo + '/merge', callback, { base: base, head: head });
            },

            file: {
                fetch: function fetch(path, callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/fetch/file' + path, callback);
                },

                update: function update(data, path, callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/update/file' + path, callback, data);
                },

                create: function create(data, path, callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/create/file' + path, callback, data);
                }
            },

            tree: {
                fetch: function fetch(callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/' + req.params.branch + '/fetch/tree', callback);
                }
            },

            issues: {
                fetch: function fetch(callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/fetch/issues', callback);
                },

                create: function create(data, callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/create/issues', callback, appropriateIssue(data));
                },

                update: function update(data, callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/update/issues', callback, appropriateIssue(data));
                }
            },

            labels: {
                fetch: function fetch(callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/fetch/labels', callback);
                },

                create: function create(data, callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/create/labels', callback, data);
                }
            },

            issueColumns: function issueColumns(callback) {
                env.get(function (json) {
                    var columns = json.putaitu.issues.columns;

                    columns.unshift('backlog');
                    columns.push('done');

                    callback(columns);
                });
            },

            milestones: function milestones(callback) {
                api.call('/api/' + req.params.user + '/' + req.params.repo + '/milestones', callback);
            },

            collaborators: function collaborators(callback) {
                api.call('/api/' + req.params.user + '/' + req.params.repo + '/collaborators', callback);
            },

            repo: function repo(callback) {
                api.call('/api/' + req.params.user + '/' + req.params.repo, callback);
            },

            branches: {
                get: function get(callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/branches/', function (branches) {
                        branches.sort(function (a, b) {
                            if (a.name < b.name) {
                                return -1;
                            } else if (a.name > b.name) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });

                        callback(branches);
                    });
                }
            }
        };
    }, {}], 2: [function (require, module, exports) {
        require('./core/Templating');
        require('./core/View');

        require('./helper');
        require('./api');

        window.env = {
            json: null,
            sha: null,

            get: function get(callback) {
                if (env.json) {
                    callback(env.json);
                } else {
                    api.file.fetch('/env.json', function (contents) {
                        var json = '{}';

                        try {
                            json = atob(contents.content);
                        } catch (e) {
                            console.log(e);
                            console.log(contents);
                        }

                        json = JSON.parse(json) || {};
                        json.putaitu = json.putaitu || {};
                        json.putaitu.issues = json.putaitu.issues || {};
                        json.putaitu.issues.columns = json.putaitu.issues.columns || [];

                        env.json = json;
                        env.sha = contents.sha;

                        callback(env.json);
                    });
                }
            },

            set: function set(json, callback) {
                json = json || env.json;

                var contents = {
                    content: btoa(JSON.stringify(json)),
                    sha: env.sha,
                    comment: 'Updating env.json'
                };

                api.file.create(contents, '/env.json', function () {
                    env.json = json;

                    if (callback) {
                        callback();
                    }
                });
            }
        };
    }, { "./api": 1, "./core/Templating": 3, "./core/View": 4, "./helper": 5 }], 3: [function (require, module, exports) {
        var Templating = {};

        function append(el, content) {
            if (Object.prototype.toString.call(content) === '[object Array]') {
                for (var i in content) {
                    append(el, content[i]);
                }
            } else if (content) {
                el.append(content);
            }
        }

        function create(tag, attr, content) {
            var el = $('<' + tag + '></' + tag + '>');

            // If the attribute parameter fails, it's probably an element or a string
            try {
                for (var k in attr) {
                    el.attr(k, attr[k]);
                }
            } catch (err) {
                content = attr;
            }

            append(el, content);

            return el;
        }

        function declareMethod(type) {
            Templating[type] = function (attr, content) {
                return create(type, attr, content);
            };
        }

        function declareBootstrapMethod(type) {
            var tagName = 'div';

            if (type.indexOf('|') > -1) {
                tagName = type.split('|')[1];
                type = type.split('|')[0];
            }

            var functionName = type.replace(/-/g, '_');

            Templating[functionName] = function (attr, content) {
                return create(tagName, attr, content).addClass(type);
            };
        }

        var elementTypes = [
        // Block elements
        'div', 'section', 'nav', 'hr', 'label', 'textarea', 'audio', 'video', 'canvas', 'iframe',

        // Inline elements
        'img',

        // Table elements
        'table', 'thead', 'tbody', 'th', 'td', 'tr',

        // Select
        'select', 'option', 'input',

        // Headings
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',

        // Body text
        'span', 'p', 'strong', 'b',

        // Action buttons
        'a', 'button',

        // List
        'ol', 'ul', 'li',

        // Forms
        'form', 'input'];

        var bootstrapTypes = ['row', 'col', 'col-xs-1', 'col-xs-2', 'col-xs-3', 'col-xs-4', 'col-xs-5', 'col-xs-6', 'col-xs-7', 'col-xs-8', 'col-xs-9', 'col-xs-10', 'col-xs-11', 'col-xs-12', 'col-sm-1', 'col-sm-2', 'col-sm-3', 'col-sm-4', 'col-sm-5', 'col-sm-6', 'col-sm-7', 'col-sm-8', 'col-sm-9', 'col-sm-10', 'col-sm-11', 'col-sm-12', 'col-md-1', 'col-md-2', 'col-md-3', 'col-md-4', 'col-md-5', 'col-md-6', 'col-md-7', 'col-md-8', 'col-md-9', 'col-md-10', 'col-md-11', 'col-md-12', 'col-lg-1', 'col-lg-2', 'col-lg-3', 'col-lg-4', 'col-lg-5', 'col-lg-6', 'col-lg-7', 'col-lg-8', 'col-lg-9', 'col-lg-10', 'col-lg-11', 'col-lg-12', 'jumbotron', 'container', 'panel', 'panel-heading', 'panel-footer', 'panel-collapse', 'panel-body', 'navbar|nav', 'navbar-nav|ul', 'collapse', 'glyphicon|span', 'btn|button', 'btn-group', 'list-group', 'list-group-item', 'input-group', 'input-group-btn|span', 'input-group-addon|span', 'form-control|input'];

        for (var i in elementTypes) {
            declareMethod(elementTypes[i]);
        }

        for (var i in bootstrapTypes) {
            declareBootstrapMethod(bootstrapTypes[i]);
        }

        Templating.each = function (array, callback) {
            var elements = [];

            for (var i in array) {
                var element = callback(i, array[i]);

                if (element) {
                    elements.push(element);
                }
            }

            return elements;
        };

        window._ = Templating;
    }, {}], 4: [function (require, module, exports) {
        'use strict'

        /**
         *  jQuery extension
         */
        ;
        (function ($) {
            $.event.special.destroyed = {
                remove: function remove(o) {
                    if (o.handler) {
                        o.handler();
                    }
                }
            };
        })(jQuery);

        /**
         * GUID
         */
        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }

        /**
         * Helper
         */
        var instances = [];

        var ViewHelper = (function () {
            function ViewHelper() {
                _classCallCheck(this, ViewHelper);
            }

            _createClass(ViewHelper, null, [{
                key: "getAll",
                value: function getAll(type) {
                    var results = [];

                    if (type) {
                        for (var i in instances) {
                            var instance = instances[i];
                            var name = instance.constructor.name;

                            if (name == type) {
                                results.push(instance);
                            }
                        }
                    } else {
                        results = instances;
                    }

                    return results;
                }
            }, {
                key: "get",
                value: function get(type) {
                    var results = ViewHelper.getAll(type);

                    return results.length > 0 ? results[0] : null;
                }
            }, {
                key: "clear",
                value: function clear(type) {
                    for (var _guid in instances) {
                        var instance = instances[_guid];
                        var name = instance.constructor.name;

                        if (!type || name == type) {
                            instance.remove();
                        }
                    }
                }
            }, {
                key: "remove",
                value: function remove(timeout) {
                    var view = this;

                    setTimeout(function () {
                        view.trigger('remove');

                        if (view.$element && view.$element.length > 0) {
                            view.$element.remove();
                        }

                        delete instances[view.guid];
                    }, timeout || 0);
                }
            }]);

            return ViewHelper;
        })();

        window.ViewHelper = ViewHelper;

        /**
         * Class
         */

        var View = (function () {
            /**
             * Init
             */

            function View(args) {
                _classCallCheck(this, View);

                this.name = this.getName();
                this.guid = guid();
                this.events = {};

                this.adopt(args);

                instances[this.guid] = this;
            }

            _createClass(View, [{
                key: "getName",
                value: function getName() {
                    var name = constructor.toString();
                    name = name.substring('function '.length);
                    name = name.substring(0, name.indexOf('('));

                    return name;
                }
            }, {
                key: "init",
                value: function init() {
                    this.prerender();
                    this.render();
                    this.postrender();

                    if (this.$element) {
                        this.element = this.$element[0];
                        this.$element.data('view', this);
                        this.$element.bind('destroyed', function () {
                            $(this).data('view').remove();
                        });
                    }
                }

                // Adopt values

            }, {
                key: "adopt",
                value: function adopt(args) {
                    for (var k in args) {
                        this[k] = args[k];
                    }

                    return this;
                }

                /**
                 * Rendering
                 */

            }, {
                key: "prerender",
                value: function prerender() {}
            }, {
                key: "render",
                value: function render() {}
            }, {
                key: "postrender",
                value: function postrender() {}

                /**
                 * Events
                 */
                // Destroy

            }, {
                key: "destroy",
                value: function destroy() {
                    if (this.$element) {
                        this.$element.remove();
                    }

                    instances.splice(this.guid, 1);

                    delete this;
                }

                // Call an event (for internal use)

            }, {
                key: "call",
                value: function call(callback, data, ui) {
                    callback(data, ui, this);
                }

                // Trigger an event

            }, {
                key: "trigger",
                value: function trigger(e, obj) {
                    if (this.events[e]) {
                        if (this.events[e].length) {
                            for (var i in this.events[e]) {
                                if (this.events[e][i]) {
                                    this.events[e][i](obj);
                                }
                            }
                        } else {
                            this.events[e](obj);
                        }
                    }
                }

                // Bind an event

            }, {
                key: "on",
                value: function on(e, callback) {
                    var view = this;

                    // No events registered, register this as the only event
                    if (!this.events[e]) {
                        this.events[e] = function (data) {
                            view.call(callback, data, this);
                        };

                        // Events have already been registered, add to callback array
                    } else {
                            // Only one event is registered, so convert from a single reference to an array
                            if (!this.events[e].length) {
                                this.events[e] = [this.events[e]];
                            }

                            // Insert the event call into the array
                            this.events[e].push(function (data) {
                                view.call(callback, data, this);
                            });
                        }
                }

                // Check if event exists

            }, {
                key: "hasEvent",
                value: function hasEvent(name) {
                    for (var k in this.events) {
                        if (k == name) {
                            return true;
                        }
                    }

                    return false;
                }

                /**
                 * Fetch
                 */

            }, {
                key: "fetch",
                value: function fetch() {
                    var view = this;

                    function getModel() {
                        // Get model from URL
                        if (!view.model && typeof view.modelUrl === 'string') {
                            $.getJSON(view.modelUrl, function (data) {
                                view.model = data;

                                view.init();
                            });

                            // Get model with function
                        } else if (!view.model && typeof view.modelFunction === 'function') {
                                view.modelFunction(function (data) {
                                    view.model = data;

                                    view.init();
                                });

                                // Just perform the initialisation
                            } else {
                                    view.init();
                                }
                    }

                    // Get rendered content from URL
                    if (typeof view.renderUrl === 'string') {
                        $.get(view.renderUrl, function (html) {
                            if (view.$element) {
                                view.$element.append(html);
                            } else {
                                view.$element = $(html);
                            }

                            // And then get the model
                            getModel();
                        });

                        // If no render url is defined, just get the model
                    } else {
                            getModel();
                        }
                }
            }]);

            return View;
        })();

        window.View = View;
    }, {}], 5: [function (require, module, exports) {
        var Helper = (function () {
            function Helper() {
                _classCallCheck(this, Helper);
            }

            _createClass(Helper, null, [{
                key: "formatDate",
                value: function formatDate(input) {
                    var date = new Date(input);
                    var output = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

                    return output;
                }
            }, {
                key: "basename",
                value: function basename(path, extension) {
                    var base = new String(path).substring(path.lastIndexOf('/') + 1);

                    if (extension) {
                        base = base.replace(extension, '');
                    }

                    return base;
                }
            }, {
                key: "basedir",
                value: function basedir(path) {
                    var base = new String(path).substring(0, path.lastIndexOf('/'));

                    return base;
                }
            }, {
                key: "truncate",
                value: function truncate(string, max, addDots) {
                    var output = string;

                    if (output.length > max) {
                        output = output.substring(0, max);

                        if (addDots) {
                            output += '...';
                        }
                    }

                    return output;
                }
            }]);

            return Helper;
        })();

        window.helper = Helper;
    }, {}], 6: [function (require, module, exports) {
        require('../client');
        require('./partials/navbar');

        var Settings = (function (_View) {
            _inherits(Settings, _View);

            function Settings(args) {
                _classCallCheck(this, Settings);

                // Register events

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Settings).call(this, args));

                _this.on('clickSave', _this.onClickSave);
                _this.on('clickAddLabel', _this.onClickAddLabel);

                var view = _this;

                env.get(function (config) {
                    api.labels.fetch(function (labels) {
                        view.config = config;
                        view.labels = labels;

                        view.init();
                    });
                });
                return _this;
            }

            _createClass(Settings, [{
                key: "onClickAddLabel",
                value: function onClickAddLabel(e, element, view) {
                    var label = {
                        name: 'new label',
                        color: 'cccccc'
                    };

                    var occurrences = 0;

                    for (var i in labels) {
                        occurrences += labels[i].name == 'new label' ? 1 : 0;
                    }

                    if (occurrences < 1) {
                        labels.push(label);

                        view.render();
                    }
                }
            }, {
                key: "onClickSave",
                value: function onClickSave(e, element, view) {
                    var $btn = $(element);
                    $btn.toggleClass('disabled', true);
                    $btn.html('Saving...');

                    env.set(config, function () {
                        $btn.toggleClass('disabled', false);
                        $btn.html(['Save ', _.span({ class: 'glyphicon glyphicon-floppy-disk' })]);
                    });
                    /*
                            if(labels.length > 0) {
                                let processed = 0;
                    
                                function process() {
                                    api.labels.set(labels[processed], function(res) {
                                        processed++;
                    
                                        if(processed < labels.length - 1) {
                                            process();
                                        } else {
                                            $btn.toggleClass('disabled', false);
                                            $btn.html([
                                                'Save ',
                                                _.span({class: 'glyphicon glyphicon-floppy-disk'})
                                            ]);
                                        } 
                                    });
                                }
                    
                                process();
                            }
                    */
                }
            }, {
                key: "render",
                value: function render() {
                    var view = this;

                    $('.page-content').html(_.div({ class: 'container' }, [_.button({ class: 'btn btn-success pull-right' }, ['Save ', _.span({ class: 'glyphicon glyphicon-floppy-disk' })]).click(view.events.clickSave), _.ul({ class: 'nav nav-tabs', role: 'tablist' }, [_.li({ role: 'presentation', class: 'active' }, _.a({ href: '#issues', 'aria-controls': 'home', role: 'tab', 'data-toggle': 'tab' }, 'Issues'))]), _.div({ class: 'tab-content' }, [_.div({ role: 'tabpanel', class: 'tab-pane active', id: 'issues' }, [_.div({ class: 'row' }, [_.div({ class: 'col-xs-6' }, [_.h4('Columns'), _.ul({ class: 'list-group' }, [_.li({ class: 'list-group-item' }, 'backlog'), _.each(view.config.putaitu.issues.columns, function (i, column) {
                        var $li = _.li({ class: 'list-group-item', 'data-name': column }, [_.span({ class: 'name' }, column), _.button({ class: 'btn close' }, _.span({ class: 'glyphicon glyphicon-remove' })).click(onClickRemove)]);

                        function onClickRemove() {
                            view.config.putaitu.issues.columns.splice(i, 1);
                            $li.remove();
                        }

                        return $li;
                    }), _.li({ class: 'list-group-item' }, 'done')])]), _.div({ class: 'col-xs-6' }, [_.h4('Labels'), _.ul({ class: 'list-group' }, [_.each(view.labels, function (i, label) {
                        var $li = _.li({ class: 'list-group-item' }, _.div({ class: 'input-group' }, [_.div({ class: 'input-group-btn' }, _.button({ class: 'btn btn-primary' }, _.span({ class: 'glyphicon glyphicon-arrow-left' })).click(onClickAdd)), _.input({ type: 'text', class: 'form-control', value: label.name }).bind('change keyup propertychange paste', onChangeName), _.div({ class: 'input-group-btn' }, [_.input({ type: 'color', class: 'btn btn-default', value: '#' + label.color }).bind('change keyup propertychange paste', onChangeColor), _.button({ class: 'btn btn-danger' }, _.span({ class: 'glyphicon glyphicon-remove' })).click(onClickRemove)])]));

                        function onChangeColor() {
                            label.color = $(this).val().replace('#', '');
                        }

                        function onChangeName() {
                            var oldName = label.name;
                            var newName = $(this).val();
                            var index = view.config.putaitu.issues.columns.indexOf(oldName);

                            label.name = newName;

                            if (index > -1) {
                                view.config.putaitu.issues.columns[index] = newName;

                                $('li[data-name="' + oldName + '"]').each(function (i) {
                                    $(this).attr('data-name', newName);
                                    $(this).children('.name').html(newName);
                                });
                            }
                        }

                        function onClickAdd() {
                            var index = view.config.putaitu.issues.columns.indexOf(label.name);

                            if (index < 0) {
                                view.config.putaitu.issues.columns.push(label.name);
                                view.render();
                            }
                        }

                        function onClickRemove() {
                            view.labels.splice(i, 1);

                            var index = view.config.putaitu.issues.columns.indexOf(label.name);

                            if (index > -1) {
                                view.config.putaitu.issues.columns.splice(index, 1);
                            }

                            view.render();
                        }

                        return $li;
                    }), _.li({ class: 'list-group-item' }, _.button({ class: 'btn btn-primary center-block' }, ['Add label ', _.span({ class: 'glyphicon glyphicon-plus' })]).click(view.events.clickAddLabel))])])])])])]));
                }
            }]);

            return Settings;
        })(View);

        new Settings();
    }, { "../client": 2, "./partials/navbar": 7 }], 7: [function (require, module, exports) {
        var Navbar = (function (_View2) {
            _inherits(Navbar, _View2);

            function Navbar(args) {
                _classCallCheck(this, Navbar);

                var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Navbar).call(this, args));

                var view = _this2;

                api.repo(function (repo) {
                    view.repo = repo;

                    view.init();
                });
                return _this2;
            }

            _createClass(Navbar, [{
                key: "render",
                value: function render() {
                    var view = this;

                    $('.navbar-content').html(_.div({ class: 'navbar navbar-default' }, _.div({ class: 'container' }, [_.ul({ class: 'nav navbar-nav' }, [_.li(_.a({ href: '/repos/' + req.params.user }, [_.span({ class: 'glyphicon glyphicon-arrow-left' }), ' Repos'])), _.li(_.a({ href: '/repos/' + req.params.user + '/' + req.params.repo + '/deployment/' }, [_.span({ class: 'glyphicon glyphicon-upload' }), ' Deployment'])), _.li(_.a({ href: '/repos/' + req.params.user + '/' + req.params.repo + '/collaborators/' }, [_.span({ class: 'glyphicon glyphicon-user' }), ' Collaborators'])), _.li(_.a({ href: '/repos/' + req.params.user + '/' + req.params.repo + '/issues/' }, [_.span({ class: 'glyphicon glyphicon-exclamation-sign' }), ' Issues'])), _.li(_.a({ href: '/repos/' + req.params.user + '/' + req.params.repo + '/settings/' }, [_.span({ class: 'glyphicon glyphicon-cog' }), ' Settings']))]), _.ul({ class: 'nav navbar-nav navbar-right' }, _.li({ class: 'navbar-btn' }, _.div({ class: 'input-group' }, [_.span({ class: 'input-group-addon' }, 'git'), function () {
                        var element = _.input({ class: 'form-control', type: 'text', value: '' });

                        element.attr('value', view.repo.cloneUrl);

                        return element;
                    }])))])));

                    // Set active navigation button
                    $('.navbar-content .navbar-nav li').each(function (i) {
                        var a = $(this).children('a');
                        var isActive = location.pathname == a.attr('href') || location.pathname + '/' == a.attr('href');

                        $(this).toggleClass('active', isActive);
                    });
                }
            }]);

            return Navbar;
        })(View);

        new Navbar();
    }, {}] }, {}, [6]);