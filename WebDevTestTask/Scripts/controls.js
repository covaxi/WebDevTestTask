class Point extends React.Component {
    constructor(props) {
        super(props);
        this.state = { x: this.props.x, y: this.props.y };
    }

    render() {
        return React.DOM.div({
                style: {
                    left: this.props.x,
                    top: this.props.y,
                    width: 2 * constants.DotRadius,
                    height: 2 * constants.DotRadius,
                    position: "absolute",
                }
            }, React.DOM.svg({
            style: {
                left: 0,
                top: 0,
                width: 2 * constants.DotRadius,
                height: 2 * constants.DotRadius
            },
            className: "circle",
        }, React.DOM.circle({ cx: constants.DotRadius, cy: constants.DotRadius, r: constants.DotRadius })));
    }

    componentDidMount() {
        var node = ReactDOM.findDOMNode(this);
        jQuery(node).draggable({
            appendTo: "body",
            scroll: false,
            cursorAt: { left: constants.DotRadius, top: constants.DotRadius },
            containment: "parent",
            start: function (event, ui) {
                $(this).draggable('instance').offset.click = {
                    left: Math.floor(ui.helper.width() / 2),
                    top: Math.floor(ui.helper.height() / 2)
                };
            },
            drag: this.props.drag
        });
    }
}

class Line extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var x1 = Math.min(this.props.x1, this.props.x2);
        var x2 = Math.max(this.props.x1, this.props.x2);
        var y1 = Math.min(this.props.y1, this.props.y2);
        var y2 = Math.max(this.props.y1, this.props.y2);
        var width = x2 - x1;
        var height = y2 - y1;
        return React.DOM.svg({ style: { width: width, height: height, left: x1, top: y1 }, className: "line" },
            React.DOM.line({
                style: {
                    stroke: this.props.color, strokeWidth: 2
                },
                x1: this.props.x1 - x1,
                y1: this.props.y1 - y1,
                x2: this.props.x2 - x1,
                y2: this.props.y2 - y1
            }));
    }

    positionChanged(state) {
        this.setState(state);
    }
}

class Rectangle extends React.Component {
    constructor(props) {
        super(props);
        this.state = { x1: 80, y1: 80, x2: 200, y2: 150, color: "red", loading: false }
    }

    render() {
        return React.DOM.div({ className: "rectangle", style: { width: constants.Width, height: constants.Height, borderRadius: constants.Radius } },
            React.createElement(Point, { x: this.state.x1 - constants.DotRadius, y: this.state.y1 - constants.DotRadius, drag: this.handlePoint.bind(this, 1) }),
            React.createElement(Point, { x: this.state.x2 - constants.DotRadius, y: this.state.y2 - constants.DotRadius, drag: this.handlePoint.bind(this, 2) }),
            React.createElement(Line, { x1: this.state.x1, y1: this.state.y1, x2: this.state.x2, y2: this.state.y2, color: this.state.color }),
            React.DOM.a({ href: '#', className: 'update-label', onClick: this.handleUpdate.bind(this) }, 'Update segment'),
            React.DOM.a({ href: '#', className: 'save-label', onClick: this.handleSave.bind(this) }, 'Save segment'),
            React.DOM.label({ className: 'label1' }, `first point: ${this.state.x1}, ${this.state.y1}`),
            React.DOM.label({ className: 'label2' }, `second point: ${this.state.x2}, ${this.state.y2}`),
            React.DOM.div({ className: 'loading', style: { display: this.state.loading ? 'block' : 'none' }}, 'Loading...'));
    }

    handleAjax(action, data, callback)
    {
        this.loading(true);
        $.ajax({
            url: '/api/Json/' + action,
            data: data,
            async: true,
            success: callback,
            type: 'POST',
            contentType: 'application/json',
            complete: function () {
                this.loading(false);
            }.bind(this)
        });
    }

    handleUpdate() {
        this.handleAjax("Update", null, function (result) {
            this.setState({
                x1: result.X1,
                y1: result.Y1,
                x2: result.X2,
                y2: result.Y2,
                color: result.Color
            })
        }.bind(this));
    }

    handleSave() {
        this.handleAjax("Save", JSON.stringify({ 
            X1: this.state.x1,
            Y1: this.state.y1,
            X2: this.state.x2,
            Y2: this.state.y2,
            Color: this.state.color
        }), function (result) {
        }.bind(this));
    }

    handlePoint(id, e, ui) {
        var x = ui.position.left + constants.DotRadius;
        var y = ui.position.top + constants.DotRadius;
        var centerX, centerY;

        if (x < constants.Radius) {
            centerX = constants.Radius;
        } else if (x > constants.Width - constants.Radius) {
            centerX = constants.Width - constants.Radius;
        }

        if (y < constants.Radius) {
            centerY = constants.Radius;
        } else if (y > constants.Height - constants.Radius) {
            centerY = constants.Height - constants.Radius
        }

        if (centerX && centerY) {
            var dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            if (dist > constants.Radius - constants.DotRadius) {
                var radians = Math.atan2(y - centerY, x - centerX);
                x = centerX + (constants.Radius - constants.DotRadius) * Math.cos(radians) - constants.DotRadius;
                y = centerY + (constants.Radius - constants.DotRadius) * Math.sin(radians) - constants.DotRadius;

                ui.position.left = x;
                ui.position.top = y;
            }
        }

        var state = {
            x1: id == 1 ? x : this.state.x1,
            y1: id == 1 ? y : this.state.y1,
            x2: id == 2 ? x : this.state.x2,
            y2: id == 2 ? y : this.state.y2,
            color: this.state.color
        }


        this.setState(state);
    }


    loading(busy) {
        this.setState({
            x1: this.state.x1,
            y1: this.state.y1,
            x2: this.state.x2,
            y2: this.state.y2,
            color: this.state.color,
            loading: busy
        })
    }
}

ReactDOM.render(React.createElement(Rectangle),
    document.getElementById("content"));
