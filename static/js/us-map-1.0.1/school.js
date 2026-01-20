(function(e, t, n, r, i) {
    function s(e, t, n, r) {
        r = r instanceof Array ? r : [];
        var i = {};
        for (var s = 0; s < r.length; s++) {
            i[r[s]] = true
        }
        var o = function(e) {
            this.element = e
        };
        o.prototype = n;
        e.fn[t] = function() {
            var n = arguments;
            var r = this;
            this.each(function() {
                var s = e(this);
                var u = s.data("plugin-" + t);
                if (!u) {
                    u = new o(s);
                    s.data("plugin-" + t, u);
                    if (u._init) {
                        u._init.apply(u, n)
                    }
                } else if (typeof n[0] == "string" && n[0].charAt(0) != "_" && typeof u[n[0]] == "function") {
                    var a = Array.prototype.slice.call(n, 1);
                    var f = u[n[0]].apply(u, a);
                    if (n[0] in i) {
                        r = f
                    }
                }
            });
            return r
        }
    }
    var o = 900,
        u = 595,
        a = 50;
    var f = {
        stateStyles: {
            fill: "#333",
            stroke: "#666",
            "stroke-width": 1,
            "stroke-linejoin": "round",
            scale: [1, 1]
        },
        stateHoverStyles: {
            fill: "#33c",
            stroke: "#000",
            scale: [1.1, 1.1]
        },
        stateHoverAnimation: 500,
        stateSpecificStyles: {},
        stateSpecificHoverStyles: {},
        click: null,
        mouseover: null,
        mouseout: null,
        clickState: {},
        mouseoverState: {},
        mouseoutState: {},
        showLabels: true,
        labelWidth: 20,
        labelHeight: 15,
        labelGap: 6,
        labelRadius: 3,
        labelBackingStyles: {
            fill: "#333",
            stroke: "#666",
            "stroke-width": 1,
            "stroke-linejoin": "round",
            scale: [1, 1]
        },
        labelBackingHoverStyles: {
            fill: "#33c",
            stroke: "#000"
        },
        stateSpecificLabelBackingStyles: {},
        stateSpecificLabelBackingHoverStyles: {},
        labelTextStyles: {
            fill: "#fff",
            stroke: "none",
            "font-weight": 300,
            "stroke-width": 0,
            "font-size": "10px"
        },
        labelTextHoverStyles: {},
        stateSpecificLabelTextStyles: {},
        stateSpecificLabelTextHoverStyles: {}
    };
    var l = {
        _init: function(t) {
            this.options = {};
            e.extend(this.options, f, t);
            var n = this.element.width();
            var i = this.element.height();
            var s = this.element.width() / o;
            var l = this.element.height() / u;
            this.scale = Math.min(s, l);
            this.labelAreaWidth = Math.ceil(a / this.scale);
            var c = o + Math.max(0, this.labelAreaWidth - a);
            this.paper = r(this.element.get(0), c, u);
            this.paper.setSize(n, i);
            this.paper.setViewBox(0, 0, c, u, false);
            this.stateHitAreas = {};
            this.stateShapes = {};
            this.topShape = null;
            this._initCreateStates();
            this.labelShapes = {};
            this.labelTexts = {};
            this.labelHitAreas = {};
            if (this.options.showLabels) {
                this._initCreateLabels()
            }
        },
        _initCreateStates: function() {
            var t = this.options.stateStyles;
            var n = this.paper;
            var r = {
                メインホール: "M 206.3622,272.12598H 596.40944V 920.69293H 206.3622Z",
                玄関: "M 342.4252,909.35431H 478.48819V 1000.063H 342.4252Z",
                体育館: "M 217.70079,95.244095H 582.80315V 292.53543H 217.70079Z",
                トイレ: "M 585.07086,317.48032H 766.48819V 498.89764H 585.07086Z",
                職員室: "M 54.425198,315.21259H 222.23622V 628.15747H 54.425198Z",
                教室: "M 22.677166,632.69293H 235.84253V 913.88977H 22.677166Z"
            };
            var i = {};
            var t = {};

            startTime = performance.now(); 

            const stateShapes = new Array(Object.keys(r).length);
            const stateHitAreas = new Array(Object.keys(r).length);

            for (const s of Object.keys(r)) {
                const pathdat = r[s]
                if (!this.options.stateSpecificStyles[s]) {
                    continue;
                }

                e.extend(i, t, this.options.stateSpecificStyles[s]);

                stateShapes[s] = n.path(pathdat).attr(i);
                this.topShape = stateShapes[s];
                stateHitAreas[s] = n.path(pathdat).attr({
                    fill: "#000",
                    "stroke-width": 0,
                    opacity: 0,
                    cursor: "pointer",
                });
                stateHitAreas[s].node.dataState = s;
            }

            this.stateShapes = stateShapes;
            this.stateHitAreas = stateHitAreas;

              
            endTime = performance.now();
            //console.log("Creating statesc took " + (endTime - startTime) + " milliseconds.");   


            this._onClickProxy = e.proxy(this, "_onClick");
            this._onMouseOverProxy = e.proxy(this, "_onMouseOver"), this._onMouseOutProxy = e.proxy(this, "_onMouseOut");
            for (var s in this.stateHitAreas) {
                this.stateHitAreas[s].toFront();
                e(this.stateHitAreas[s].node).bind("mouseout", this._onMouseOutProxy);
                e(this.stateHitAreas[s].node).bind("click", this._onClickProxy);
                e(this.stateHitAreas[s].node).bind("mouseover", this._onMouseOverProxy)
            }
        },
        _getStateFromEvent: function(e) {
            var t = e.target && e.target.dataState || e.dataState;
            return this._getState(t)
        },
        _getState: function(e) {
            var t = this.stateShapes[e];
            var n = this.stateHitAreas[e];
            var r = this.labelShapes[e];
            var i = this.labelTexts[e];
            var s = this.labelHitAreas[e];
            return {
                shape: t,
                hitArea: n,
                name: e,
                labelBacking: r,
                labelText: i,
                labelHitArea: s
            }
        },
        _onMouseOut: function(e) {
            var t = this._getStateFromEvent(e);
            if (!t.hitArea) {
                return
            }
            return !this._triggerEvent("mouseout", e, t)
        },
        _defaultMouseOutAction: function(t) {
            var n = {};
            if (this.options.stateSpecificStyles[t.name]) {
                e.extend(n, this.options.stateStyles, this.options.stateSpecificStyles[t.name])
            } else {
                n = this.options.stateStyles
            }
            t.shape.animate(n, this.options.stateHoverAnimation);
            if (t.labelBacking) {
                var n = {};
                if (this.options.stateSpecificLabelBackingStyles[t.name]) {
                    e.extend(n, this.options.labelBackingStyles, this.options.stateSpecificLabelBackingStyles[t.name])
                } else {
                    n = this.options.labelBackingStyles
                }
                t.labelBacking.animate(n, this.options.stateHoverAnimation)
            }
        },
        _onClick: function(e) {
            var t = this._getStateFromEvent(e);
            if (!t.hitArea) {
                return
            }
            return !this._triggerEvent("click", e, t)
        },
        _onMouseOver: function(e) {
            var t = this._getStateFromEvent(e);
            if (!t.hitArea) {
                return
            }
            return !this._triggerEvent("mouseover", e, t)
        },
        _defaultMouseOverAction: function(t) {
            this.bringShapeToFront(t.shape);
            this.paper.safari();
            var n = {};
            if (this.options.stateSpecificHoverStyles[t.name]) {
                e.extend(n, this.options.stateHoverStyles, this.options.stateSpecificHoverStyles[t.name])
            } else {
                n = this.options.stateHoverStyles
            }
            t.shape.animate(n, this.options.stateHoverAnimation);
            if (t.labelBacking) {
                var n = {};
                if (this.options.stateSpecificLabelBackingHoverStyles[t.name]) {
                    e.extend(n, this.options.labelBackingHoverStyles, this.options.stateSpecificLabelBackingHoverStyles[t.name])
                } else {
                    n = this.options.labelBackingHoverStyles
                }
                t.labelBacking.animate(n, this.options.stateHoverAnimation)
            }
        },
        _triggerEvent: function(t, n, r) {
            var i = r.name;
            var s = false;
            var o = e.Event("usmap" + t + i);
            o.originalEvent = n;
            if (this.options[t + "State"][i]) {
                s = this.options[t + "State"][i](o, r) === false
            }
            if (o.isPropagationStopped()) {
                this.element.trigger(o, [r]);
                s = s || o.isDefaultPrevented()
            }
            if (!o.isPropagationStopped()) {
                var u = e.Event("usmap" + t);
                u.originalEvent = n;
                if (this.options[t]) {
                    s = this.options[t](u, r) === false || s
                }
                if (!u.isPropagationStopped()) {
                    this.element.trigger(u, [r]);
                    s = s || u.isDefaultPrevented()
                }
            }
            if (!s) {
                switch (t) {
                    case "mouseover":
                        this._defaultMouseOverAction(r);
                        break;
                    case "mouseout":
                        this._defaultMouseOutAction(r);
                        break
                }
            }
            return !s
        },
        trigger: function(e, t, n) {
            t = t.replace("usmap", "");
            e = e.toUpperCase();
            var r = this._getState(e);
            this._triggerEvent(t, n, r)
        },
        bringShapeToFront: function(e) {
            if (this.topShape) {
                e.insertAfter(this.topShape)
            }
            this.topShape = e
        }
    };
    var c = [];
    s(e, "usmap", l, c)
})(jQuery, document, window, Raphael)