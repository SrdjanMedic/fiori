sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("mynamespace.mybrowseorders.controller.Detail", {
        onInit: function () {
            var oView = this.getView();
            this._router=this.getOwnerComponent().getRouter();
            this._router.getRoute("objectPage").attachPatternMatched(this._routePatternMatched,this);
        },
/*
        _routePatternMatched: function (oEvent) {
          var sProductId = oEvent.getParameter("arguments").objectId;
    
          var sPath = "/Orders(" + sProductId + ")";
          var oView = this.getView();
    
          oView.bindElement({
            path: sPath,
            events: {
              dataRequested: function () {
                oView.setBusy(true);
              },
              dataReceived: function () {
                oView.setBusy(false);
              }
            }
          });
        }

        */

        _routePatternMatched : function (oEvent) {
          var oArguments = oEvent.getParameter("arguments");
          this._sObjectId = oArguments.objectId;
          // Don't show two columns when in full screen mode
          if (this.getModel("appView").getProperty("/layout") !== "MidColumnFullScreen") {
            this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
          }
          this.getModel().metadataLoaded().then( function() {
            var sObjectPath = this.getModel().createKey("Orders", {
              OrderID :  this._sObjectId
            });
            this._bindView("/" + sObjectPath);
          }.bind(this));
          var oQuery = oArguments["?query"];
          if (oQuery && this._aValidKeys.indexOf(oQuery.tab) >= 0){
            this.getView().getModel("detailView").setProperty("/selectedTab", oQuery.tab);
            this.getRouter().getTargets().display(oQuery.tab);
          } else {
            this.getRouter().navTo("object", {
              objectId: this._sObjectId,
              query: {
                tab: "shipping"
              }
            }, true);
          }
        },
        
      });
    }
  );