import PropTypes from "prop-types";
import React from "react";
import {VictoryContainer} from "victory-core";
import CursorHelpers from './cursor-helpers';

export const customCursorContainerMixin = (base) => class CustomCursorContainer extends base {
  static displayName = "CustomCursorContainer";
  static propTypes = {
    ...VictoryContainer.propTypes,
    onCursorChange: PropTypes.func,
    onCursorLeave: PropTypes.func
  };
  static defaultProps = {
    ...VictoryContainer.defaultProps
  };

  static defaultEvents = (props) => {
    return [{
      target: "parent",
      eventHandlers: {
        onMouseLeave: () => {
          if (props.onCursorLeave) props.onCursorLeave();
          return [];
        },
        onTouchCancel: () => {
          return [];
        },
        onMouseMove: (evt, targetProps) => {
          return props.disable ? {} : CursorHelpers.onMouseMove(evt, targetProps);
        },
        onTouchMove: (evt, targetProps) => {
          return props.disable ? {} : CursorHelpers.onMouseMove(evt, targetProps);
        }
      }
    }];
  };

  getChildren(props) {
    return [...React.Children.toArray(props.children)];
  }
};

export default customCursorContainerMixin(VictoryContainer);