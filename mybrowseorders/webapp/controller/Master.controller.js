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
			var oModel = this.getOwnerComponent().getModel();
			this.getView().setModel(oModel);
		
			// Create a JSON model to hold the view properties
			var oViewModel = new JSONModel({
				titleCount: 0 // Initialize titleCount to 0
			});
			this.getView().setModel(oViewModel, "masterViewModel");
			this.omasterViewModel=this.getView().getModel("masterViewModel");
		
			// oModel.metadataLoaded().then(function() { ... }.bind(this));: We attach an event handler to the metadataLoaded event of the OData model.
			// The metadataLoaded event is triggered when the metadata of the OData service has been loaded.
			oModel.metadataLoaded().then(function() {
				// Get the count of orders
				this._getOrdersCount();
			}.bind(this));


			this._router=this.getOwnerComponent().getRouter();
		},

		/*
		 .bind(this): The bind method is used to set the value of this inside the anonymous callback function. 
		 When we define a function inside another function (as in this case), the inner function gets its own this context,
		 which may not be the same as the outer function's this.
		 By using bind(this), we ensure that the this inside the callback function refers to the same value as the outer function's this.

		In JavaScript, the value of this depends on how a function is called. 
		By default, when a function is called as a method of an object, this refers to that object. 
		However, when a function is called as a standalone function (not a method of an object) or inside a nested function,
		this may refer to the global object or be undefined (in strict mode). To preserve the correct this context,
		we use bind(this) to bind the this value of the outer function to the inner function, 
		ensuring that we can access the properties and methods of the outer function using this.

		In this case, we use bind(this) to make sure that this._getOrdersCount() is called with the correct this context, 
		allowing it to access the OData model and update the view model with the count of orders.
		*/
		
		_getOrdersCount: function() {
			var sPath = "/Orders/$count";
			var oModel = this.getView().getModel();	
			var that=this;			

			oModel.read(sPath, {
				success: function(iCount) {					 
					that.omasterViewModel.setProperty("/titleCount", iCount);
				}.bind(this),
				error: function() {
					// Handle error if required
				}
			});
		},

			//oModel.read(sPath, { ... });: We use the read method of the OData model to make a request to the backend to get the count of orders. 
			//The read method takes the URL path and a configuration object as parameters.

			/*success: function(iCount) { ... }.bind(this): If the request is successful, the success callback function is executed. 
			The count of orders is passed as the iCount parameter.
			*/
			/*oViewModel.setProperty("/titleCount", iCount);:
			 Finally, we update the "titleCount" property in the "masterView" model with the value of iCount, which represents the count of orders.
			 */
		  

    
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
			this.getOwnerComponent().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this._router.navTo("objectPage", {
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
