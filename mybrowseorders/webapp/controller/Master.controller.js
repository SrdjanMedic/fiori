sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"sap/ui/core/Fragment",
	"../model/formatter",
	"sap/ui/core/format/DateFormat"
], function (Controller,JSONModel, Filter, FilterOperator, Sorter, GroupHeaderListItem, Device, Fragment, formatter, DateFormat) {
    "use strict";

    return Controller.extend("mynamespace.mybrowseorders.controller.Master", {

              
		onInit: function() {

            var oModel = this.getOwnerComponent().getModel("");
            this.getView().setModel(oModel);
            // Create a JSON model to hold the view properties
            var oViewModel = new JSONModel({
                titleCount: 0 // Initialize titleCount to 0
            });
            this.getView().setModel(oViewModel, "masterView");
        },

        onUpdateFinished: function(oEvent) {
            // Get the List control
            var oList = oEvent.getSource();

            // Get the number of items in the list
            var iItemCount = oList.getItems().length;

            // Update the titleCount in the view model
            var oViewModel = this.getView().getModel("masterView");
            oViewModel.setProperty("/titleCount", iItemCount);
        },

		createGroupHeader : function (oGroup) {
			console.log("Group text" + oGroup.text);
			return new GroupHeaderListItem({
				title : oGroup.text,
				upperCase : false
				
			});
			
		},

		onSearch : function (oEvent) {
			

			var sQuery = oEvent.getParameter("query");

			var sSearchTerm = oEvent.getParameter("query");
            var oList = this.byId("list");
            var oBinding = oList.getBinding("items");

            if (oBinding) {
				
                var oFilter = new sap.ui.model.Filter("OrderID", sap.ui.model.FilterOperator.EQ, sSearchTerm);
                oBinding.filter([oFilter]);
            } else {
				oBinding.filter([]);
			}

		},
        /**
		 * Shows the selected item on the detail page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showDetail : function (oItem) {
			var bReplace = !Device.system.phone;
			// set the layout property of FCL control to show two columns
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("object", {
				objectId : oItem.getBindingContext().getProperty("OrderID")
			}, bReplace);
		},


        onSelectionChange : function (oEvent) {
			var oList = oEvent.getSource(),
				bSelected = oEvent.getParameter("selected");

			// skip navigation when deselecting an item in multi selection mode
			if (!(oList.getMode() === "MultiSelect" && !bSelected)) {
				// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			}
		}

	

		

        
    });
});
