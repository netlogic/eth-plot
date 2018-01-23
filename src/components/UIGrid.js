import React, { Component } from 'react';
import PropTypes from 'prop-types';

import GridPlot from './GridPlot';
import PurchasePlot from './PurchasePlot';

import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  root: {
    padding: 24,
    width: '100%',
    height: '100%',
    overflow: 'scroll'
  }
});


class UIGrid extends Component {
  mouseOut() {
    // Reset the hover once the mouse leaves this area
    this.props.actions.hoverOverPlot(-1);
  }

  render() {
    const scale = this.props.scale;

    const plots = this.props.plots.map((plot, index) => {
      return (<GridPlot scale={scale} plot={plot} index={index} isHovered={this.props.hoveredIndex === index} hoverAction={this.props.actions.hoverOverPlot} key={index} />);
    });

    const marginLeft = `calc(calc(100vw - ${this.props.gridInfo.width * scale}px) / 2)`;
    const gridStyle = {
      width: this.props.gridInfo.width * scale,
      height: this.props.gridInfo.height * scale,
      marginLeft: marginLeft,
      position: 'absolute'
    };

    let overlay = null;
    if (this.props.inPurchaseMode && this.props.imageToPurchase) {
      const overlayStyle = {
        width: this.props.gridInfo.width * scale,
        height: this.props.gridInfo.height * scale,
        marginLeft: marginLeft,
        position: 'absolute',
        cursor: 'crosshair'
      };

      let purchasePlotRect = null;
      if (this.props.dragRectCurr && this.props.dragRectStart) {
        purchasePlotRect = {
          x: Math.min(this.props.dragRectCurr.x, this.props.dragRectStart.x),
          y: Math.min(this.props.dragRectCurr.y, this.props.dragRectStart.y),
          w: Math.abs(this.props.dragRectCurr.x - this.props.dragRectStart.x),
          h: Math.abs(this.props.dragRectCurr.y - this.props.dragRectStart.y)
        };

        purchasePlotRect.x2 = purchasePlotRect.x + purchasePlotRect.w;
        purchasePlotRect.y2 = purchasePlotRect.y + purchasePlotRect.h;

        if (!this.props.isDraggingRect && purchasePlotRect.w === 0 && purchasePlotRect.h === 0) {
          purchasePlotRect = null;
        }
      }

      overlay = (
        <div className="gridOverlay" style={overlayStyle}>
            <PurchasePlot 
            rect={this.props.rectToPurchase}
            scale={scale} 
            //  src={this.props.imageToPurchase.fileData}
             />
          {/* {
            purchasePlotRect ? <PurchasePlot
              startPurchase={this.props.actions.showPurchaseDialog}
              scale={scale}
              rect={purchasePlotRect} /> : null
          } */}
        </div>);
    }

    return (
      <div className={this.props.classes.root}>
        <div style={gridStyle} className="grid" onMouseOut={this.mouseOut.bind(this)}>
          {plots}
        </div>
        {overlay}
      </div>
    );
  }
}

UIGrid.propTypes = {
  plots: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  inPurchaseMode: PropTypes.bool.isRequired,
  imageToPurchase: PropTypes.object.isRequired
};

export default withStyles(styles)(UIGrid);
