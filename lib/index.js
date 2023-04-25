"use strict"

exports.__esModule = true

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i]
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }
    return target
  }

var _templateObject = _taggedTemplateLiteralLoose(
  ["\n  width: 100%;\n  position: relative;\n"],
  ["\n  width: 100%;\n  position: relative;\n"]
)

var _propTypes = require("prop-types")

var _propTypes2 = _interopRequireDefault(_propTypes)

var _react = require("react")

var _react2 = _interopRequireDefault(_react)

var _styledComponents = require("styled-components")

var _styledComponents2 = _interopRequireDefault(_styledComponents)

var _List = require("./components/List")

var _List2 = _interopRequireDefault(_List)

var _utils = require("./utils")

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj}
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function")
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    )
  }
  return call && (typeof call === "object" || typeof call === "function")
    ? call
    : self
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
        typeof superClass
    )
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  })
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass)
}

function _taggedTemplateLiteralLoose(strings, raw) {
  strings.raw = raw
  return strings
} /* global document */

var Wrapper = _styledComponents2.default.div(_templateObject)

var GooglePlacesSuggest = (function(_React$Component) {
  _inherits(GooglePlacesSuggest, _React$Component)

  function GooglePlacesSuggest(props) {
    _classCallCheck(this, GooglePlacesSuggest)

    var _this = _possibleConstructorReturn(this, _React$Component.call(this))

    _this.hasFocus = false

    _this.state = {
      focusedPredictionIndex: 0,
      sessionToken: "",
      predictions: [],
      open: !!props.autocompletionRequest && props.autocompletionRequest.input,
    }

    _this.handleKeyDown = _this.handleKeyDown.bind(_this)
    _this.onFocusChange = _this.onFocusChange.bind(_this)
    _this.handleDOMClick = _this.handleDOMClick.bind(_this)
    return _this
  }

  GooglePlacesSuggest.prototype.UNSAFE_componentWillMount = function UNSAFE_componentWillMount() {
    this.updatePredictions(this.props.autocompletionRequest)
    document.addEventListener("click", this.handleDOMClick)
  }

  GooglePlacesSuggest.prototype.componentWillUnmount = function componentWillUnmount() {
    document.removeEventListener("click", this.handleDOMClick)
  }

  GooglePlacesSuggest.prototype.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(
    nextProps
  ) {
    if (
      !(0, _utils.deepEqual)(
        this.props.autocompletionRequest,
        nextProps.autocompletionRequest
      ) &&
      nextProps.autocompletionRequest
    ) {
      this.updatePredictions(nextProps.autocompletionRequest)
    }
  }

  GooglePlacesSuggest.prototype.handleSelectPrediction = function handleSelectPrediction(
    suggest
  ) {
    var _this2 = this

    var onSelectSuggest = this.props.onSelectSuggest

    this.setState(
      {
        open: false,
        predictions: [],
      },
      function() {
        _this2.hasFocus = false
        _this2.placesDetails(suggest.place_id, function(result) {
          onSelectSuggest(result, suggest)
        })
        _this2.setState({
          sessionToken: "",
        })
      }
    )
  }

  GooglePlacesSuggest.prototype.updatePredictions = function updatePredictions(
    autocompletionRequest
  ) {
    var _this3 = this

    var googleMaps = this.props.googleMaps

    var autocompleteService = new googleMaps.places.AutocompleteService()
    var sessionToken = this.state.sessionToken
    if (!sessionToken) {
      sessionToken = new googleMaps.places.AutocompleteSessionToken()
      this.setState({
        sessionToken: sessionToken,
      })
    }
    if (!autocompletionRequest || !autocompletionRequest.input) {
      this.setState(
        {
          open: false,
          predictions: [],
        },
        function() {
          return (_this3.hasFocus = false)
        }
      )
      return
    }

    autocompleteService.getPlacePredictions(
      _extends({}, autocompletionRequest, {
        // https://developers.google.com/maps/documentation/javascript/reference?hl=fr#AutocompletionRequest
        sessionToken: sessionToken,
      }),
      function(predictions, status) {
        _this3.props.onStatusUpdate(status)
        if (!predictions) {
          _this3.setState({open: true, predictions: []})
          return
        }
        _this3.setState({
          focusedPredictionIndex: 0,
          open: true,
          predictions: predictions,
        })
      }
    )
  }

  GooglePlacesSuggest.prototype.placesDetails = function placesDetails(
    placeId,
    callback
  ) {
    var googleMaps = this.props.googleMaps

    var map = new googleMaps.Map(document.createElement("map"))

    var placesService = new googleMaps.places.PlacesService(map)

    placesService.getDetails(
      {
        placeId: placeId,
        fields: [
          "geometry",
          "address_components",
          "types",
          "formatted_address",
        ],
        sessionToken: this.state.sessionToken,
      },
      function(result, status) {
        if (status === googleMaps.places.PlacesServiceStatus.OK) {
          callback(result)
        } else {
          // eslint-disable-next-line
          console.error("Places service error: " + status)
        }
      }
    )
  }

  GooglePlacesSuggest.prototype.handleKeyDown = function handleKeyDown(e) {
    var _state = this.state,
      focusedPredictionIndex = _state.focusedPredictionIndex,
      predictions = _state.predictions

    if (predictions.length > 0) {
      if (e.key === "Enter") {
        e.preventDefault()
        this.handleSelectPrediction(predictions[focusedPredictionIndex])
      } else if (e.key === "ArrowUp") {
        if (predictions.length > 0 && focusedPredictionIndex > 0) {
          this.focusPrediction(focusedPredictionIndex - 1)
        }
      } else if (e.key === "ArrowDown") {
        if (
          predictions.length > 0 &&
          focusedPredictionIndex < predictions.length - 1
        ) {
          this.focusPrediction(focusedPredictionIndex + 1)
        }
      }
    } else if (e.key === "Enter") {
      e.preventDefault()
      var onNoResult = this.props.onNoResult

      onNoResult()
    }
  }

  GooglePlacesSuggest.prototype.focusPrediction = function focusPrediction(
    index
  ) {
    this.setState({focusedPredictionIndex: index})
  }

  GooglePlacesSuggest.prototype.onFocusChange = function onFocusChange(val) {
    this.hasFocus = val
  }

  GooglePlacesSuggest.prototype.handleDOMClick = function handleDOMClick() {
    if (!this.hasFocus && this.state.open) {
      this.setState({open: false})
    }
  }

  GooglePlacesSuggest.prototype.render = function render() {
    var _this4 = this

    var _state2 = this.state,
      focusedPredictionIndex = _state2.focusedPredictionIndex,
      open = _state2.open,
      predictions = _state2.predictions
    var _props = this.props,
      children = _props.children,
      customContainerRender = _props.customContainerRender,
      customRender = _props.customRender,
      displayPoweredByGoogle = _props.displayPoweredByGoogle,
      textNoResults = _props.textNoResults

    return _react2.default.createElement(
      Wrapper,
      {onKeyDown: this.handleKeyDown},
      children,
      open &&
        _react2.default.createElement(_List2.default, {
          items: predictions,
          activeItemIndex: focusedPredictionIndex,
          customContainerRender: customContainerRender,
          customRender: customRender,
          displayPoweredByGoogle: displayPoweredByGoogle,
          onSelect: function onSelect(suggest) {
            return _this4.handleSelectPrediction(suggest)
          },
          textNoResults: textNoResults,
          onFocusChange: this.onFocusChange,
        })
    )
  }

  return GooglePlacesSuggest
})(_react2.default.Component)

GooglePlacesSuggest.propTypes =
  process.env.NODE_ENV !== "production"
    ? {
        children: _propTypes2.default.any.isRequired,
        googleMaps: _propTypes2.default.object.isRequired,
        onNoResult: _propTypes2.default.func,
        onSelectSuggest: _propTypes2.default.func,
        onStatusUpdate: _propTypes2.default.func,
        customContainerRender: _propTypes2.default.func,
        customRender: _propTypes2.default.func,
        displayPoweredByGoogle: _propTypes2.default.bool,
        autocompletionRequest: _propTypes2.default.shape({
          input: _propTypes2.default.string.isRequired,
        }).isRequired,
        textNoResults: _propTypes2.default.string,
      }
    : {}

GooglePlacesSuggest.defaultProps = {
  displayPoweredByGoogle: true,
  onNoResult: function onNoResult() {},
  onSelectSuggest: function onSelectSuggest() {},
  onStatusUpdate: function onStatusUpdate() {},
  textNoResults: "No results",
}

exports.default = GooglePlacesSuggest
module.exports = exports["default"]