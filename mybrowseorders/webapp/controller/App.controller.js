sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("mynamespace.mybrowseorders.controller.App", {
        onInit: function () {
          var oModel = this.getOwnerComponent().getModel();
          this.getView().setModel(oModel);
        }
        
      });
    }
  );
  