
(function(){/*


 @copyright
 Copyright (c) 2003-2014 Wolters Kluwer Technology B.V. and/or its affiliates. All Rights Reserved.

 This application source code (the "Software") is the confidential and proprietary information of
 Wolters Kluwer Technology BV and/or its affiliates. The Software contains trade secret information,
 and you may not reverse-engineer, decompile, disclose, copy, modify, upload, download, transmit,
 republish, or otherwise misappropriate the Software without the express written approval of
 Wolters Kluwer Technology BV and/or its affiliates. In addition, the Software is protected by U.S.
 and other applicable copyright laws. The Software is provided solely for the purpose of technical
 analysis within the scope of a single project, subject to applicable license requirements set forth
 by Wolters Kluwer Technology BV and/or its affiliates. All copies of this Software must be destroyed
 or otherwise removed from your system and any associated hardware when any applicable license terminates
 or expires.
*/
var namespace = function(namespace) {
  var parts = namespace.split(".");
  var ctx = window;
  parts.forEach(function(part) {
    if(!ctx[part]) {
      ctx[part] = {}
    }
    ctx = ctx[part]
  });
  return ctx
};
var vlv = namespace("vlv");
vlv.common = namespace("vlv.common");
vlv.rsi = namespace("vlv.rsi");
vlv.rsi.entities = namespace("vlv.rsi.entities");
vlv.rsi.entitySets = namespace("vlv.rsi.entitySets");
vlv.rsi.functions = namespace("vlv.rsi.functions");
vlv.rsi.params = namespace("vlv.rsi.params");
vlv.product = namespace("vlv.product");
vlv.product.entities = namespace("vlv.product.entities");
vlv.product.entitySets = namespace("vlv.product.entitySets");
vlv.product.functions = namespace("vlv.product.functions");
vlv.product.params = namespace("vlv.product.params");
vlv.identity = namespace("vlv.identity");
vlv.identity.entities = namespace("vlv.identity.entities");
vlv.identity.entitySets = namespace("vlv.identity.entitySets");
vlv.identity.functions = namespace("vlv.identity.functions");
vlv.identity.params = namespace("vlv.identity.params");
vlv.recording = namespace("vlv.recording");
vlv.recording.entities = namespace("vlv.recording.entities");
vlv.recording.entitySets = namespace("vlv.recording.entitySets");
vlv.recording.functions = namespace("vlv.recording.functions");
vlv.recording.params = namespace("vlv.recording.params");
var velvet = angular.module("velvet", ["ng", "ngResource"]);
vlv.common.odataParams = function() {
  this["$expand"] = "";
  this["$filter"] = "";
  this["$format"] = "";
  this["$inlinecount"] = "";
  this["$orderby"] = "";
  this["$select"] = "";
  this["$skip"] = "";
  this["$skiptoken"] = "";
  this["$top"] = ""
};
vlv.common.odataParams.prototype.$expand;
vlv.common.odataParams.prototype.$filter;
vlv.common.odataParams.prototype.$format;
vlv.common.odataParams.prototype.$inlinecount;
vlv.common.odataParams.prototype.$orderby;
vlv.common.odataParams.prototype.$select;
vlv.common.odataParams.prototype.$skip;
vlv.common.odataParams.prototype.$top;
vlv.common.odataParams.prototype.$skiptoken;
vlv.common.odataParams.prototype.asString = function() {
  var res = "";
  var params = [];
  for(var propertyName in this) {
    var val = this[propertyName];
    if(val && val != "") {
      params.push(propertyName + "=" + this[propertyName])
    }
  }
  if(params.length > 0) {
    res += "?";
    res += params.join("&")
  }
  return res
};
vlv.config = function() {
};
vlv.config.prototype.apikey;
vlv.config.prototype.host;
vlv.config.prototype.cpid;
vlv.config.prototype.accept;
velvet.provider("$velvetConfig", function() {
  var config = new vlv.config;
  config.accept = "application/json, text/plain, */*";
  return{"configure":function(congigurable) {
    config.host = congigurable.host;
    config.apikey = congigurable.apikey;
    config.cpid = congigurable.cpid
  }, "$get":function() {
    return config
  }}
});
vlv.common.getOneParams = function() {
  this.id = "";
  vlv.common.odataParams.call(this)
};
vlv.common.getOneParams.prototype = new vlv.common.odataParams;
vlv.common.getOneParams.prototype.constructor = vlv.common.getOneParams;
vlv.common.getOneParams.prototype.id;
vlv.common.toHttpPromise = function(promise) {
  var res = promise;
  res.success = function(fn) {
    promise.then(function(response) {
      fn(response)
    });
    return promise
  };
  res.error = function(fn) {
    promise.then(null, function(reason) {
      fn(reason)
    });
    return promise
  };
  return res
};
vlv.entityBase = function() {
};
vlv.entityBase.prototype.populate = function(entity, $http, jsonItem) {
  angular.forEach(jsonItem, function(property, propName) {
    if(propName in entity) {
      if(property != null && property["__deferred"]) {
        var url = property["__deferred"]["uri"];
        entity[propName] = function() {
          var promise = $http.get(url).then(function(response) {
            var foreignProperty = entity["_foreignProperties"][propName];
            if(foreignProperty.isArray) {
              var subItems = [];
              angular.forEach(response["data"]["d"]["results"], function(item) {
                var subItem = foreignProperty["type"].fromJson($http, item);
                subItems.push(subItem)
              });
              return subItems
            }else {
              return foreignProperty["type"].fromJson($http, response["data"]["d"])
            }
          });
          return vlv.common.toHttpPromise(promise)
        }
      }else {
        entity[propName] = jsonItem[propName]
      }
    }
  })
};
vlv.entityBase.prototype.isPropertyResolved = function(name) {
  if(name in this) {
    var serviceValue = this[name];
    if(serviceValue.length) {
      return serviceValue.length > 0
    }
    return this[name] != undefined
  }
  return null
};
vlv.svcbase = function(name, $velvetConfig, $http) {
  this.$velvetConfig = ($velvetConfig);
  this.$http = ($http);
  this.name = (name)
};
vlv.svcbase.prototype.name;
vlv.svcbase.prototype.serviceUrl;
vlv.svcbase.prototype.$http;
vlv.svcbase.prototype.$velvetConfig;
vlv.svcbase.prototype.transform;
vlv.svcbase.prototype.buildServiceUrl = function(url) {
  return this.$velvetConfig.host + "/" + this.name + ".svc" + "/" + url
};
vlv.svcbase.prototype.ajax = function(method, url, data) {
  var ajaxUrl = this.buildServiceUrl(url);
  var ajaxOptions = {"method":method, "data":data, "url":ajaxUrl, "headers":{"$format":"json"}};
  if(this.transform) {
    ajaxOptions.transformResponse = this.transform
  }
  return this.$http(ajaxOptions)
};
vlv.svcbase.prototype.get = function(query) {
  return this.ajax("GET", query, null)
};
vlv.svcbase.prototype.post = function(query, data) {
  return this.ajax("POST", query, data)
};
vlv.identity.entities.Preference = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Value"] = ""
};
vlv.identity.entities.Preference.prototype = new vlv.entityBase;
vlv.identity.entities.Preference.constructor = vlv.identity.entities.Preference;
vlv.identity.entities.Preference.prototype._foreignProperties = {};
vlv.identity.entities.Preference.prototype.Id;
vlv.identity.entities.Preference.prototype.Value;
vlv.identity.entities.Preference.fromJson = function($http, jsonItem) {
  var entity = new vlv.identity.entities.Preference;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.identity.entities.Product = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = ""
};
vlv.identity.entities.Product.prototype = new vlv.entityBase;
vlv.identity.entities.Product.constructor = vlv.identity.entities.Product;
vlv.identity.entities.Product.prototype._foreignProperties = {};
vlv.identity.entities.Product.prototype.Id;
vlv.identity.entities.Product.prototype.Title;
vlv.identity.entities.Product.fromJson = function($http, jsonItem) {
  var entity = new vlv.identity.entities.Product;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.identity.entities.UserProfile = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["UserKey"] = "";
  this["Password"] = "";
  this["PreferredLanguage"] = "";
  this["Email"] = "";
  this["FirstName"] = "";
  this["LastName"] = "";
  this["AuthenticationType"] = "";
  this["SessionTicket"] = "";
  this["ProductId"] = "";
  this["LoginId"] = ""
};
vlv.identity.entities.UserProfile.prototype = new vlv.entityBase;
vlv.identity.entities.UserProfile.constructor = vlv.identity.entities.UserProfile;
vlv.identity.entities.UserProfile.prototype._foreignProperties = {};
vlv.identity.entities.UserProfile.prototype.Id;
vlv.identity.entities.UserProfile.prototype.UserKey;
vlv.identity.entities.UserProfile.prototype.Password;
vlv.identity.entities.UserProfile.prototype.PreferredLanguage;
vlv.identity.entities.UserProfile.prototype.Email;
vlv.identity.entities.UserProfile.prototype.FirstName;
vlv.identity.entities.UserProfile.prototype.LastName;
vlv.identity.entities.UserProfile.prototype.AuthenticationType;
vlv.identity.entities.UserProfile.prototype.SessionTicket;
vlv.identity.entities.UserProfile.prototype.ProductId;
vlv.identity.entities.UserProfile.prototype.LoginId;
vlv.identity.entities.UserProfile.fromJson = function($http, jsonItem) {
  var entity = new vlv.identity.entities.UserProfile;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.identity.entitySets.Preferences = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "identity-v1", $velvetConfig, $http);
  this.path = "Preferences";
  this.$http = $http
};
vlv.identity.entitySets.Preferences.prototype = new vlv.svcbase;
vlv.identity.entitySets.Preferences.prototype.constructor = vlv.identity.entitySets.Preferences;
vlv.identity.entitySets.Preferences.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.identity.entitySets.Preferences.prototype.path;
vlv.identity.entitySets.Preferences.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.identity.entitySets.Preferences.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.identity.entitySets.Preferences["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvIdentityPreferences", vlv.identity.entitySets.Preferences);
vlv.identity.entitySets.Products = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "identity-v1", $velvetConfig, $http);
  this.path = "Products";
  this.$http = $http
};
vlv.identity.entitySets.Products.prototype = new vlv.svcbase;
vlv.identity.entitySets.Products.prototype.constructor = vlv.identity.entitySets.Products;
vlv.identity.entitySets.Products.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.identity.entitySets.Products.prototype.path;
vlv.identity.entitySets.Products.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.identity.entitySets.Products.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.identity.entitySets.Products["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvIdentityProducts", vlv.identity.entitySets.Products);
vlv.identity.entitySets.UserProfiles = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "identity-v1", $velvetConfig, $http);
  this.path = "UserProfiles";
  this.$http = $http
};
vlv.identity.entitySets.UserProfiles.prototype = new vlv.svcbase;
vlv.identity.entitySets.UserProfiles.prototype.constructor = vlv.identity.entitySets.UserProfiles;
vlv.identity.entitySets.UserProfiles.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.identity.entitySets.UserProfiles.prototype.path;
vlv.identity.entitySets.UserProfiles.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.identity.entitySets.UserProfiles.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.identity.entitySets.UserProfiles["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvIdentityUserProfiles", vlv.identity.entitySets.UserProfiles);
vlv.identity.functions.AccessToken = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "identity-v1", $velvetConfig, $http);
  this.path = "AccessToken";
  this.$http = $http
};
vlv.identity.functions.AccessToken.prototype = new vlv.svcbase;
vlv.identity.functions.AccessToken.prototype.constructor = vlv.identity.functions.AccessToken;
vlv.identity.functions.AccessToken.prototype.call = function(params) {
  params = params || new vlv.identity.params.AccessTokenParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.identity.functions.AccessToken["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvIdentityAccessTokenFunction", vlv.identity.functions.AccessToken);
vlv.identity.functions.ClearDefaultProduct = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "identity-v1", $velvetConfig, $http);
  this.path = "ClearDefaultProduct";
  this.$http = $http
};
vlv.identity.functions.ClearDefaultProduct.prototype = new vlv.svcbase;
vlv.identity.functions.ClearDefaultProduct.prototype.constructor = vlv.identity.functions.ClearDefaultProduct;
vlv.identity.functions.ClearDefaultProduct.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.identity.functions.ClearDefaultProduct["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvIdentityClearDefaultProductFunction", vlv.identity.functions.ClearDefaultProduct);
vlv.identity.functions.Credentials = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "identity-v1", $velvetConfig, $http);
  this.path = "Credentials";
  this.$http = $http
};
vlv.identity.functions.Credentials.prototype = new vlv.svcbase;
vlv.identity.functions.Credentials.prototype.constructor = vlv.identity.functions.Credentials;
vlv.identity.functions.Credentials.prototype.call = function(params) {
  params = params || new vlv.identity.params.CredentialsParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.identity.functions.Credentials["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvIdentityCredentialsFunction", vlv.identity.functions.Credentials);
vlv.identity.functions.DefaultProduct = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "identity-v1", $velvetConfig, $http);
  this.path = "DefaultProduct";
  this.$http = $http
};
vlv.identity.functions.DefaultProduct.prototype = new vlv.svcbase;
vlv.identity.functions.DefaultProduct.prototype.constructor = vlv.identity.functions.DefaultProduct;
vlv.identity.functions.DefaultProduct.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.identity.functions.DefaultProduct["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvIdentityDefaultProductFunction", vlv.identity.functions.DefaultProduct);
vlv.identity.functions.ForgotPassword = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "identity-v1", $velvetConfig, $http);
  this.path = "ForgotPassword";
  this.$http = $http
};
vlv.identity.functions.ForgotPassword.prototype = new vlv.svcbase;
vlv.identity.functions.ForgotPassword.prototype.constructor = vlv.identity.functions.ForgotPassword;
vlv.identity.functions.ForgotPassword.prototype.call = function(params) {
  params = params || new vlv.identity.params.ForgotPasswordParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.identity.functions.ForgotPassword["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvIdentityForgotPasswordFunction", vlv.identity.functions.ForgotPassword);
vlv.identity.functions.ForgotUsername = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "identity-v1", $velvetConfig, $http);
  this.path = "ForgotUsername";
  this.$http = $http
};
vlv.identity.functions.ForgotUsername.prototype = new vlv.svcbase;
vlv.identity.functions.ForgotUsername.prototype.constructor = vlv.identity.functions.ForgotUsername;
vlv.identity.functions.ForgotUsername.prototype.call = function(params) {
  params = params || new vlv.identity.params.ForgotUsernameParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.identity.functions.ForgotUsername["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvIdentityForgotUsernameFunction", vlv.identity.functions.ForgotUsername);
vlv.identity.functions.Logout = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "identity-v1", $velvetConfig, $http);
  this.path = "Logout";
  this.$http = $http
};
vlv.identity.functions.Logout.prototype = new vlv.svcbase;
vlv.identity.functions.Logout.prototype.constructor = vlv.identity.functions.Logout;
vlv.identity.functions.Logout.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.identity.functions.Logout["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvIdentityLogoutFunction", vlv.identity.functions.Logout);
vlv.identity.params.AccessTokenParams = function() {
  vlv.common.odataParams.call(this);
  this["type"] = ""
};
vlv.identity.params.AccessTokenParams.prototype = new vlv.common.odataParams;
vlv.identity.params.AccessTokenParams.prototype.constructor = vlv.identity.params.AccessTokenParams;
vlv.identity.params.AccessTokenParams.prototype.type;
vlv.identity.params.CredentialsParams = function() {
  vlv.common.odataParams.call(this);
  this["accessToken"] = ""
};
vlv.identity.params.CredentialsParams.prototype = new vlv.common.odataParams;
vlv.identity.params.CredentialsParams.prototype.constructor = vlv.identity.params.CredentialsParams;
vlv.identity.params.CredentialsParams.prototype.accessToken;
vlv.identity.params.ForgotPasswordParams = function() {
  vlv.common.odataParams.call(this);
  this["userId"] = "";
  this["generateNewPassword"] = ""
};
vlv.identity.params.ForgotPasswordParams.prototype = new vlv.common.odataParams;
vlv.identity.params.ForgotPasswordParams.prototype.constructor = vlv.identity.params.ForgotPasswordParams;
vlv.identity.params.ForgotPasswordParams.prototype.userId;
vlv.identity.params.ForgotPasswordParams.prototype.generateNewPassword;
vlv.identity.params.ForgotUsernameParams = function() {
  vlv.common.odataParams.call(this);
  this["email"] = ""
};
vlv.identity.params.ForgotUsernameParams.prototype = new vlv.common.odataParams;
vlv.identity.params.ForgotUsernameParams.prototype.constructor = vlv.identity.params.ForgotUsernameParams;
vlv.identity.params.ForgotUsernameParams.prototype.email;
vlv.identity.functions.Ping = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "identity-v1", $velvetConfig, $http);
  this.path = "Ping";
  this.$http = $http
};
vlv.identity.functions.Ping.prototype = new vlv.svcbase;
vlv.identity.functions.Ping.prototype.constructor = vlv.identity.functions.Ping;
vlv.identity.functions.Ping.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.identity.functions.Ping["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvIdentityPingFunction", vlv.identity.functions.Ping);
vlv.identity.functions.SetDefaultProduct = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "identity-v1", $velvetConfig, $http);
  this.path = "SetDefaultProduct";
  this.$http = $http
};
vlv.identity.functions.SetDefaultProduct.prototype = new vlv.svcbase;
vlv.identity.functions.SetDefaultProduct.prototype.constructor = vlv.identity.functions.SetDefaultProduct;
vlv.identity.functions.SetDefaultProduct.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.identity.functions.SetDefaultProduct["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvIdentitySetDefaultProductFunction", vlv.identity.functions.SetDefaultProduct);
vlv.product.entities.ApplicationInvocationRule = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Creator"] = "";
  this["Priority"] = 0;
  this["ProductId"] = "";
  this["ResourceUri"] = "";
  this["UsageContext"] = "";
  this["Comment"] = "";
  this["Modified"] = null;
  this["Qualifier"] = ""
};
vlv.product.entities.ApplicationInvocationRule.prototype = new vlv.entityBase;
vlv.product.entities.ApplicationInvocationRule.constructor = vlv.product.entities.ApplicationInvocationRule;
vlv.product.entities.ApplicationInvocationRule.prototype._foreignProperties = {};
vlv.product.entities.ApplicationInvocationRule.prototype.Id;
vlv.product.entities.ApplicationInvocationRule.prototype.Creator;
vlv.product.entities.ApplicationInvocationRule.prototype.Priority;
vlv.product.entities.ApplicationInvocationRule.prototype.ProductId;
vlv.product.entities.ApplicationInvocationRule.prototype.ResourceUri;
vlv.product.entities.ApplicationInvocationRule.prototype.UsageContext;
vlv.product.entities.ApplicationInvocationRule.prototype.Comment;
vlv.product.entities.ApplicationInvocationRule.prototype.Modified;
vlv.product.entities.ApplicationInvocationRule.prototype.Qualifier;
vlv.product.entities.ApplicationInvocationRule.fromJson = function($http, jsonItem) {
  var entity = new vlv.product.entities.ApplicationInvocationRule;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.product.entities.Product = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Description"] = "";
  this["ParendId"] = "";
  this["IsDeleting"] = false;
  this["IsDeleted"] = false;
  this._foreignProperties = {"Attributes":{"type":vlv.product.entities.ProductAttribute, "isArray":true}}
};
vlv.product.entities.Product.prototype = new vlv.entityBase;
vlv.product.entities.Product.constructor = vlv.product.entities.Product;
vlv.product.entities.Product.prototype._foreignProperties = {};
vlv.product.entities.Product.prototype.Id;
vlv.product.entities.Product.prototype.Title;
vlv.product.entities.Product.prototype.Description;
vlv.product.entities.Product.prototype.ParendId;
vlv.product.entities.Product.prototype.IsDeleting;
vlv.product.entities.Product.prototype.IsDeleted;
vlv.product.entities.Product.prototype.Attributes = function() {
};
vlv.product.entities.Product.fromJson = function($http, jsonItem) {
  var entity = new vlv.product.entities.Product;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.product.entities.ProductAttribute = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Value"] = "";
  this["Alias"] = "";
  this["IsDeprecated"] = false
};
vlv.product.entities.ProductAttribute.prototype = new vlv.entityBase;
vlv.product.entities.ProductAttribute.constructor = vlv.product.entities.ProductAttribute;
vlv.product.entities.ProductAttribute.prototype._foreignProperties = {};
vlv.product.entities.ProductAttribute.prototype.Id;
vlv.product.entities.ProductAttribute.prototype.Value;
vlv.product.entities.ProductAttribute.prototype.Alias;
vlv.product.entities.ProductAttribute.prototype.IsDeprecated;
vlv.product.entities.ProductAttribute.fromJson = function($http, jsonItem) {
  var entity = new vlv.product.entities.ProductAttribute;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.product.entities.ProductSelectionRule = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["ProductId"] = "";
  this["Priority"] = 0;
  this["ObfuscationType"] = "";
  this["Regexp"] = "";
  this["Comment"] = "";
  this["Creator"] = "";
  this["Qualifier"] = ""
};
vlv.product.entities.ProductSelectionRule.prototype = new vlv.entityBase;
vlv.product.entities.ProductSelectionRule.constructor = vlv.product.entities.ProductSelectionRule;
vlv.product.entities.ProductSelectionRule.prototype._foreignProperties = {};
vlv.product.entities.ProductSelectionRule.prototype.Id;
vlv.product.entities.ProductSelectionRule.prototype.ProductId;
vlv.product.entities.ProductSelectionRule.prototype.Priority;
vlv.product.entities.ProductSelectionRule.prototype.ObfuscationType;
vlv.product.entities.ProductSelectionRule.prototype.Regexp;
vlv.product.entities.ProductSelectionRule.prototype.Comment;
vlv.product.entities.ProductSelectionRule.prototype.Creator;
vlv.product.entities.ProductSelectionRule.prototype.Qualifier;
vlv.product.entities.ProductSelectionRule.fromJson = function($http, jsonItem) {
  var entity = new vlv.product.entities.ProductSelectionRule;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.product.entitySets.ApplicationInvocationRules = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "product-v1", $velvetConfig, $http);
  this.path = "ApplicationInvocationRules";
  this.$http = $http
};
vlv.product.entitySets.ApplicationInvocationRules.prototype = new vlv.svcbase;
vlv.product.entitySets.ApplicationInvocationRules.prototype.constructor = vlv.product.entitySets.ApplicationInvocationRules;
vlv.product.entitySets.ApplicationInvocationRules.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.product.entitySets.ApplicationInvocationRules.prototype.path;
vlv.product.entitySets.ApplicationInvocationRules.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.product.entitySets.ApplicationInvocationRules.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.product.entitySets.ApplicationInvocationRules["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvProductApplicationInvocationRules", vlv.product.entitySets.ApplicationInvocationRules);
vlv.product.entitySets.ProductAttributes = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "product-v1", $velvetConfig, $http);
  this.path = "ProductAttributes";
  this.$http = $http
};
vlv.product.entitySets.ProductAttributes.prototype = new vlv.svcbase;
vlv.product.entitySets.ProductAttributes.prototype.constructor = vlv.product.entitySets.ProductAttributes;
vlv.product.entitySets.ProductAttributes.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.product.entitySets.ProductAttributes.prototype.path;
vlv.product.entitySets.ProductAttributes.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.product.entitySets.ProductAttributes.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.product.entitySets.ProductAttributes["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvProductProductAttributes", vlv.product.entitySets.ProductAttributes);
vlv.product.entitySets.Products = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "product-v1", $velvetConfig, $http);
  this.path = "Products";
  this.$http = $http
};
vlv.product.entitySets.Products.prototype = new vlv.svcbase;
vlv.product.entitySets.Products.prototype.constructor = vlv.product.entitySets.Products;
vlv.product.entitySets.Products.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.product.entitySets.Products.prototype.path;
vlv.product.entitySets.Products.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.product.entitySets.Products.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.product.entitySets.Products["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvProductProducts", vlv.product.entitySets.Products);
vlv.product.entitySets.ProductSelectionRules = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "product-v1", $velvetConfig, $http);
  this.path = "ProductSelectionRules";
  this.$http = $http
};
vlv.product.entitySets.ProductSelectionRules.prototype = new vlv.svcbase;
vlv.product.entitySets.ProductSelectionRules.prototype.constructor = vlv.product.entitySets.ProductSelectionRules;
vlv.product.entitySets.ProductSelectionRules.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.product.entitySets.ProductSelectionRules.prototype.path;
vlv.product.entitySets.ProductSelectionRules.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.product.entitySets.ProductSelectionRules.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.product.entitySets.ProductSelectionRules["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvProductProductSelectionRules", vlv.product.entitySets.ProductSelectionRules);
vlv.product.functions.FilterAttributes = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "product-v1", $velvetConfig, $http);
  this.path = "FilterAttributes";
  this.$http = $http
};
vlv.product.functions.FilterAttributes.prototype = new vlv.svcbase;
vlv.product.functions.FilterAttributes.prototype.constructor = vlv.product.functions.FilterAttributes;
vlv.product.functions.FilterAttributes.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.product.functions.FilterAttributes["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvProductFilterAttributesFunction", vlv.product.functions.FilterAttributes);
vlv.product.functions.MatchingApplicationInvocationResource = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "product-v1", $velvetConfig, $http);
  this.path = "MatchingApplicationInvocationResource";
  this.$http = $http
};
vlv.product.functions.MatchingApplicationInvocationResource.prototype = new vlv.svcbase;
vlv.product.functions.MatchingApplicationInvocationResource.prototype.constructor = vlv.product.functions.MatchingApplicationInvocationResource;
vlv.product.functions.MatchingApplicationInvocationResource.prototype.call = function(params) {
  params = params || new vlv.product.params.MatchingApplicationInvocationResourceParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.product.functions.MatchingApplicationInvocationResource["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvProductMatchingApplicationInvocationResourceFunction", vlv.product.functions.MatchingApplicationInvocationResource);
vlv.product.functions.MatchingProducts = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "product-v1", $velvetConfig, $http);
  this.path = "MatchingProducts";
  this.$http = $http
};
vlv.product.functions.MatchingProducts.prototype = new vlv.svcbase;
vlv.product.functions.MatchingProducts.prototype.constructor = vlv.product.functions.MatchingProducts;
vlv.product.functions.MatchingProducts.prototype.call = function(params) {
  params = params || new vlv.product.params.MatchingProductsParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.product.functions.MatchingProducts["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvProductMatchingProductsFunction", vlv.product.functions.MatchingProducts);
vlv.product.params.MatchingApplicationInvocationResourceParams = function() {
  vlv.common.odataParams.call(this);
  this["context"] = "";
  this["productId"] = "";
  this["qualifier"] = ""
};
vlv.product.params.MatchingApplicationInvocationResourceParams.prototype = new vlv.common.odataParams;
vlv.product.params.MatchingApplicationInvocationResourceParams.prototype.constructor = vlv.product.params.MatchingApplicationInvocationResourceParams;
vlv.product.params.MatchingApplicationInvocationResourceParams.prototype.context;
vlv.product.params.MatchingApplicationInvocationResourceParams.prototype.productId;
vlv.product.params.MatchingApplicationInvocationResourceParams.prototype.qualifier;
vlv.product.params.MatchingProductsParams = function() {
  vlv.common.odataParams.call(this);
  this["context"] = "";
  this["qualifier"] = ""
};
vlv.product.params.MatchingProductsParams.prototype = new vlv.common.odataParams;
vlv.product.params.MatchingProductsParams.prototype.constructor = vlv.product.params.MatchingProductsParams;
vlv.product.params.MatchingProductsParams.prototype.context;
vlv.product.params.MatchingProductsParams.prototype.qualifier;
vlv.product.functions.Ping = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "product-v1", $velvetConfig, $http);
  this.path = "Ping";
  this.$http = $http
};
vlv.product.functions.Ping.prototype = new vlv.svcbase;
vlv.product.functions.Ping.prototype.constructor = vlv.product.functions.Ping;
vlv.product.functions.Ping.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.product.functions.Ping["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvProductPingFunction", vlv.product.functions.Ping);
vlv.product.functions.PostFilterAttributes = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "product-v1", $velvetConfig, $http);
  this.path = "PostFilterAttributes";
  this.$http = $http
};
vlv.product.functions.PostFilterAttributes.prototype = new vlv.svcbase;
vlv.product.functions.PostFilterAttributes.prototype.constructor = vlv.product.functions.PostFilterAttributes;
vlv.product.functions.PostFilterAttributes.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.product.functions.PostFilterAttributes["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvProductPostFilterAttributesFunction", vlv.product.functions.PostFilterAttributes);
vlv.product.functions.RemoveApplicationInvocationRules = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "product-v1", $velvetConfig, $http);
  this.path = "RemoveApplicationInvocationRules";
  this.$http = $http
};
vlv.product.functions.RemoveApplicationInvocationRules.prototype = new vlv.svcbase;
vlv.product.functions.RemoveApplicationInvocationRules.prototype.constructor = vlv.product.functions.RemoveApplicationInvocationRules;
vlv.product.functions.RemoveApplicationInvocationRules.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.product.functions.RemoveApplicationInvocationRules["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvProductRemoveApplicationInvocationRulesFunction", vlv.product.functions.RemoveApplicationInvocationRules);
vlv.product.functions.RemoveProductSelectionRules = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "product-v1", $velvetConfig, $http);
  this.path = "RemoveProductSelectionRules";
  this.$http = $http
};
vlv.product.functions.RemoveProductSelectionRules.prototype = new vlv.svcbase;
vlv.product.functions.RemoveProductSelectionRules.prototype.constructor = vlv.product.functions.RemoveProductSelectionRules;
vlv.product.functions.RemoveProductSelectionRules.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.product.functions.RemoveProductSelectionRules["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvProductRemoveProductSelectionRulesFunction", vlv.product.functions.RemoveProductSelectionRules);
vlv.recording.functions.AddEvent = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "recording-v1", $velvetConfig, $http);
  this.path = "AddEvent";
  this.$http = $http
};
vlv.recording.functions.AddEvent.prototype = new vlv.svcbase;
vlv.recording.functions.AddEvent.prototype.constructor = vlv.recording.functions.AddEvent;
vlv.recording.functions.AddEvent.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.recording.functions.AddEvent["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRecordingAddEventFunction", vlv.recording.functions.AddEvent);
vlv.recording.functions.AddExternalEvent = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "recording-v1", $velvetConfig, $http);
  this.path = "AddExternalEvent";
  this.$http = $http
};
vlv.recording.functions.AddExternalEvent.prototype = new vlv.svcbase;
vlv.recording.functions.AddExternalEvent.prototype.constructor = vlv.recording.functions.AddExternalEvent;
vlv.recording.functions.AddExternalEvent.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.recording.functions.AddExternalEvent["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRecordingAddExternalEventFunction", vlv.recording.functions.AddExternalEvent);
vlv.recording.functions.Ping = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "recording-v1", $velvetConfig, $http);
  this.path = "Ping";
  this.$http = $http
};
vlv.recording.functions.Ping.prototype = new vlv.svcbase;
vlv.recording.functions.Ping.prototype.constructor = vlv.recording.functions.Ping;
vlv.recording.functions.Ping.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.recording.functions.Ping["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRecordingPingFunction", vlv.recording.functions.Ping);
vlv.rsi.entities.Alert = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["ContentId"] = "";
  this["ContentType"] = "";
  this["Created"] = null;
  this["Expiration"] = null;
  this["Triggered"] = null;
  this["Name"] = "";
  this["ProductId"] = "";
  this["Updated"] = null;
  this["HasConfigurations"] = false;
  this._foreignProperties = {"Documents":{"type":vlv.rsi.entities.Document, "isArray":true}, "Configurations":{"type":vlv.rsi.entities.AlertConfiguration, "isArray":true}, "AlertSearchMetadata":{"type":vlv.rsi.entities.AlertSearchMetadata, "isArray":false}}
};
vlv.rsi.entities.Alert.prototype = new vlv.entityBase;
vlv.rsi.entities.Alert.constructor = vlv.rsi.entities.Alert;
vlv.rsi.entities.Alert.prototype._foreignProperties = {};
vlv.rsi.entities.Alert.prototype.Id;
vlv.rsi.entities.Alert.prototype.ContentId;
vlv.rsi.entities.Alert.prototype.ContentType;
vlv.rsi.entities.Alert.prototype.Created;
vlv.rsi.entities.Alert.prototype.Expiration;
vlv.rsi.entities.Alert.prototype.Triggered;
vlv.rsi.entities.Alert.prototype.Name;
vlv.rsi.entities.Alert.prototype.ProductId;
vlv.rsi.entities.Alert.prototype.Updated;
vlv.rsi.entities.Alert.prototype.HasConfigurations;
vlv.rsi.entities.Alert.prototype.Documents = function() {
};
vlv.rsi.entities.Alert.prototype.Configurations = function() {
};
vlv.rsi.entities.Alert.prototype.AlertSearchMetadata = function() {
};
vlv.rsi.entities.Alert.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.Alert;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.AlertConfiguration = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["DeliveryAddresses"] = "";
  this["DeliveryMethod"] = "";
  this["Greeting"] = "";
  this["Mimetype"] = "";
  this["ShowFullContent"] = false;
  this["ShowSummary"] = false;
  this["IsDefault"] = false;
  this["ScheduleDayOfMonth"] = 0;
  this["ScheduleDayOfWeek"] = "";
  this["ScheduleFrequency"] = "";
  this["ScheduleTimeOfDay"] = null
};
vlv.rsi.entities.AlertConfiguration.prototype = new vlv.entityBase;
vlv.rsi.entities.AlertConfiguration.constructor = vlv.rsi.entities.AlertConfiguration;
vlv.rsi.entities.AlertConfiguration.prototype._foreignProperties = {};
vlv.rsi.entities.AlertConfiguration.prototype.Id;
vlv.rsi.entities.AlertConfiguration.prototype.DeliveryAddresses;
vlv.rsi.entities.AlertConfiguration.prototype.DeliveryMethod;
vlv.rsi.entities.AlertConfiguration.prototype.Greeting;
vlv.rsi.entities.AlertConfiguration.prototype.Mimetype;
vlv.rsi.entities.AlertConfiguration.prototype.ShowFullContent;
vlv.rsi.entities.AlertConfiguration.prototype.ShowSummary;
vlv.rsi.entities.AlertConfiguration.prototype.IsDefault;
vlv.rsi.entities.AlertConfiguration.prototype.ScheduleDayOfMonth;
vlv.rsi.entities.AlertConfiguration.prototype.ScheduleDayOfWeek;
vlv.rsi.entities.AlertConfiguration.prototype.ScheduleFrequency;
vlv.rsi.entities.AlertConfiguration.prototype.ScheduleTimeOfDay;
vlv.rsi.entities.AlertConfiguration.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.AlertConfiguration;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.AlertProfile = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["AlertId"] = "";
  this["ConfigurationId"] = "";
  this["SavedSearchId"] = "";
  this._foreignProperties = {"Alert":{"type":vlv.rsi.entities.Alert, "isArray":false}, "SavedSearch":{"type":vlv.rsi.entities.SavedSearch, "isArray":false}}
};
vlv.rsi.entities.AlertProfile.prototype = new vlv.entityBase;
vlv.rsi.entities.AlertProfile.constructor = vlv.rsi.entities.AlertProfile;
vlv.rsi.entities.AlertProfile.prototype._foreignProperties = {};
vlv.rsi.entities.AlertProfile.prototype.Id;
vlv.rsi.entities.AlertProfile.prototype.AlertId;
vlv.rsi.entities.AlertProfile.prototype.ConfigurationId;
vlv.rsi.entities.AlertProfile.prototype.SavedSearchId;
vlv.rsi.entities.AlertProfile.prototype.AlertOptions = function() {
};
vlv.rsi.entities.AlertProfile.prototype.ConfigurationOptions = function() {
};
vlv.rsi.entities.AlertProfile.prototype.SearchOptions = function() {
};
vlv.rsi.entities.AlertProfile.prototype.Alert = function() {
};
vlv.rsi.entities.AlertProfile.prototype.SavedSearch = function() {
};
vlv.rsi.entities.AlertProfile.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.AlertProfile;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.AlertSearchMetadata = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["SearchId"] = "";
  this["Query"] = "";
  this["ThesaurusOn"] = false;
  this["DocumentCount"] = 0;
  this["WorkspaceId"] = "";
  this["WorkspaceName"] = "";
  this._foreignProperties = {"ContentModules":{"type":vlv.rsi.entities.ContentModule, "isArray":true}, "ContentTreeNodes":{"type":vlv.rsi.entities.ContentTreeNode, "isArray":true}, "FilterTreeNodes":{"type":vlv.rsi.entities.FilterTreeNode, "isArray":true}}
};
vlv.rsi.entities.AlertSearchMetadata.prototype = new vlv.entityBase;
vlv.rsi.entities.AlertSearchMetadata.constructor = vlv.rsi.entities.AlertSearchMetadata;
vlv.rsi.entities.AlertSearchMetadata.prototype._foreignProperties = {};
vlv.rsi.entities.AlertSearchMetadata.prototype.Id;
vlv.rsi.entities.AlertSearchMetadata.prototype.SearchId;
vlv.rsi.entities.AlertSearchMetadata.prototype.Query;
vlv.rsi.entities.AlertSearchMetadata.prototype.ThesaurusOn;
vlv.rsi.entities.AlertSearchMetadata.prototype.DocumentCount;
vlv.rsi.entities.AlertSearchMetadata.prototype.WorkspaceId;
vlv.rsi.entities.AlertSearchMetadata.prototype.WorkspaceName;
vlv.rsi.entities.AlertSearchMetadata.prototype.ContentModules = function() {
};
vlv.rsi.entities.AlertSearchMetadata.prototype.ContentTreeNodes = function() {
};
vlv.rsi.entities.AlertSearchMetadata.prototype.FilterTreeNodes = function() {
};
vlv.rsi.entities.AlertSearchMetadata.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.AlertSearchMetadata;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.ClusterSearchResultList = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Query"] = "";
  this["TotalResults"] = 0;
  this["TotalClusters"] = 0;
  this._foreignProperties = {"Clusters":{"type":vlv.rsi.entities.ClusterSearchResultListItem, "isArray":true}, "FilterTrees":{"type":vlv.rsi.entities.SearchFilterTree, "isArray":true}}
};
vlv.rsi.entities.ClusterSearchResultList.prototype = new vlv.entityBase;
vlv.rsi.entities.ClusterSearchResultList.constructor = vlv.rsi.entities.ClusterSearchResultList;
vlv.rsi.entities.ClusterSearchResultList.prototype._foreignProperties = {};
vlv.rsi.entities.ClusterSearchResultList.prototype.Id;
vlv.rsi.entities.ClusterSearchResultList.prototype.Title;
vlv.rsi.entities.ClusterSearchResultList.prototype.Query;
vlv.rsi.entities.ClusterSearchResultList.prototype.TotalResults;
vlv.rsi.entities.ClusterSearchResultList.prototype.TotalClusters;
vlv.rsi.entities.ClusterSearchResultList.prototype.Clusters = function() {
};
vlv.rsi.entities.ClusterSearchResultList.prototype.FilterTrees = function() {
};
vlv.rsi.entities.ClusterSearchResultList.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.ClusterSearchResultList;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.ClusterSearchResultListItem = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Index"] = 0;
  this["Title"] = "";
  this["TotalResults"] = 0;
  this["IsCitation"] = false;
  this._foreignProperties = {"Items":{"type":vlv.rsi.entities.SearchResultListItem, "isArray":true}, "AllItems":{"type":vlv.rsi.entities.SearchResultListItem, "isArray":true}, "FilterTrees":{"type":vlv.rsi.entities.SearchFilterTree, "isArray":true}}
};
vlv.rsi.entities.ClusterSearchResultListItem.prototype = new vlv.entityBase;
vlv.rsi.entities.ClusterSearchResultListItem.constructor = vlv.rsi.entities.ClusterSearchResultListItem;
vlv.rsi.entities.ClusterSearchResultListItem.prototype._foreignProperties = {};
vlv.rsi.entities.ClusterSearchResultListItem.prototype.Id;
vlv.rsi.entities.ClusterSearchResultListItem.prototype.Index;
vlv.rsi.entities.ClusterSearchResultListItem.prototype.Title;
vlv.rsi.entities.ClusterSearchResultListItem.prototype.TotalResults;
vlv.rsi.entities.ClusterSearchResultListItem.prototype.IsCitation;
vlv.rsi.entities.ClusterSearchResultListItem.prototype.Items = function() {
};
vlv.rsi.entities.ClusterSearchResultListItem.prototype.AllItems = function() {
};
vlv.rsi.entities.ClusterSearchResultListItem.prototype.FilterTrees = function() {
};
vlv.rsi.entities.ClusterSearchResultListItem.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.ClusterSearchResultListItem;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.ContentChannel = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Summary"] = "";
  this["ContentType"] = ""
};
vlv.rsi.entities.ContentChannel.prototype = new vlv.entityBase;
vlv.rsi.entities.ContentChannel.constructor = vlv.rsi.entities.ContentChannel;
vlv.rsi.entities.ContentChannel.prototype._foreignProperties = {};
vlv.rsi.entities.ContentChannel.prototype.Id;
vlv.rsi.entities.ContentChannel.prototype.Title;
vlv.rsi.entities.ContentChannel.prototype.Summary;
vlv.rsi.entities.ContentChannel.prototype.ContentType;
vlv.rsi.entities.ContentChannel.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.ContentChannel;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.ContentModule = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["NodeId"] = "";
  this["Title"] = "";
  this["Type"] = "";
  this["Index"] = 0;
  this._foreignProperties = {"Documents":{"type":vlv.rsi.entities.Document, "isArray":true}}
};
vlv.rsi.entities.ContentModule.prototype = new vlv.entityBase;
vlv.rsi.entities.ContentModule.constructor = vlv.rsi.entities.ContentModule;
vlv.rsi.entities.ContentModule.prototype._foreignProperties = {};
vlv.rsi.entities.ContentModule.prototype.Id;
vlv.rsi.entities.ContentModule.prototype.NodeId;
vlv.rsi.entities.ContentModule.prototype.Title;
vlv.rsi.entities.ContentModule.prototype.Type;
vlv.rsi.entities.ContentModule.prototype.Index;
vlv.rsi.entities.ContentModule.prototype.Documents = function() {
};
vlv.rsi.entities.ContentModule.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.ContentModule;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.ContentModuleAuthorization = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Authorized"] = false
};
vlv.rsi.entities.ContentModuleAuthorization.prototype = new vlv.entityBase;
vlv.rsi.entities.ContentModuleAuthorization.constructor = vlv.rsi.entities.ContentModuleAuthorization;
vlv.rsi.entities.ContentModuleAuthorization.prototype._foreignProperties = {};
vlv.rsi.entities.ContentModuleAuthorization.prototype.Id;
vlv.rsi.entities.ContentModuleAuthorization.prototype.Authorized;
vlv.rsi.entities.ContentModuleAuthorization.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.ContentModuleAuthorization;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.ContentTable = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = ""
};
vlv.rsi.entities.ContentTable.prototype = new vlv.entityBase;
vlv.rsi.entities.ContentTable.constructor = vlv.rsi.entities.ContentTable;
vlv.rsi.entities.ContentTable.prototype._foreignProperties = {};
vlv.rsi.entities.ContentTable.prototype.Id;
vlv.rsi.entities.ContentTable.prototype.Title;
vlv.rsi.entities.ContentTable.prototype.Document = function() {
};
vlv.rsi.entities.ContentTable.prototype.Root = function() {
};
vlv.rsi.entities.ContentTable.prototype.Children = function() {
};
vlv.rsi.entities.ContentTable.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.ContentTable;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.ContentTableItem = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["DocumentId"] = ""
};
vlv.rsi.entities.ContentTableItem.prototype = new vlv.entityBase;
vlv.rsi.entities.ContentTableItem.constructor = vlv.rsi.entities.ContentTableItem;
vlv.rsi.entities.ContentTableItem.prototype._foreignProperties = {};
vlv.rsi.entities.ContentTableItem.prototype.Id;
vlv.rsi.entities.ContentTableItem.prototype.Title;
vlv.rsi.entities.ContentTableItem.prototype.DocumentId;
vlv.rsi.entities.ContentTableItem.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.ContentTableItem;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.ContentTree = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this._foreignProperties = {"Root":{"type":vlv.rsi.entities.ContentTreeNode, "isArray":false}, "ToolsRoot":{"type":vlv.rsi.entities.ContentTreeNode, "isArray":false}}
};
vlv.rsi.entities.ContentTree.prototype = new vlv.entityBase;
vlv.rsi.entities.ContentTree.constructor = vlv.rsi.entities.ContentTree;
vlv.rsi.entities.ContentTree.prototype._foreignProperties = {};
vlv.rsi.entities.ContentTree.prototype.Id;
vlv.rsi.entities.ContentTree.prototype.Title;
vlv.rsi.entities.ContentTree.prototype.Root = function() {
};
vlv.rsi.entities.ContentTree.prototype.ToolsRoot = function() {
};
vlv.rsi.entities.ContentTree.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.ContentTree;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.ContentTreeNode = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["ImageUrl"] = "";
  this["Index"] = 0;
  this["PathIndex"] = 0;
  this["Launchable"] = false;
  this["IsLeaf"] = false;
  this["IsPersistent"] = false;
  this["IsSelectable"] = false;
  this["IsSelected"] = false;
  this["LeafChildrenCount"] = 0;
  this["LevelChildrenCount"] = 0;
  this["RootTitle"] = "";
  this._foreignProperties = {"ContentTree":{"type":vlv.rsi.entities.ContentTree, "isArray":false}, "Children":{"type":vlv.rsi.entities.ContentTreeNode, "isArray":true}, "Path":{"type":vlv.rsi.entities.ContentTreeNode, "isArray":true}, "Routes":{"type":vlv.rsi.entities.ContentTreeNodeRoute, "isArray":true}, "Documents":{"type":vlv.rsi.entities.Document, "isArray":true}, "ExtendedMetadata":{"type":vlv.rsi.entities.DocumentMetadataItem, "isArray":true}}
};
vlv.rsi.entities.ContentTreeNode.prototype = new vlv.entityBase;
vlv.rsi.entities.ContentTreeNode.constructor = vlv.rsi.entities.ContentTreeNode;
vlv.rsi.entities.ContentTreeNode.prototype._foreignProperties = {};
vlv.rsi.entities.ContentTreeNode.prototype.Id;
vlv.rsi.entities.ContentTreeNode.prototype.Title;
vlv.rsi.entities.ContentTreeNode.prototype.ContentTree = function() {
};
vlv.rsi.entities.ContentTreeNode.prototype.Children = function() {
};
vlv.rsi.entities.ContentTreeNode.prototype.Path = function() {
};
vlv.rsi.entities.ContentTreeNode.prototype.ImageUrl;
vlv.rsi.entities.ContentTreeNode.prototype.Index;
vlv.rsi.entities.ContentTreeNode.prototype.PathIndex;
vlv.rsi.entities.ContentTreeNode.prototype.Routes = function() {
};
vlv.rsi.entities.ContentTreeNode.prototype.Launchable;
vlv.rsi.entities.ContentTreeNode.prototype.IsLeaf;
vlv.rsi.entities.ContentTreeNode.prototype.IsPersistent;
vlv.rsi.entities.ContentTreeNode.prototype.IsSelectable;
vlv.rsi.entities.ContentTreeNode.prototype.IsSelected;
vlv.rsi.entities.ContentTreeNode.prototype.LeafChildrenCount;
vlv.rsi.entities.ContentTreeNode.prototype.LevelChildrenCount;
vlv.rsi.entities.ContentTreeNode.prototype.RootTitle;
vlv.rsi.entities.ContentTreeNode.prototype.Documents = function() {
};
vlv.rsi.entities.ContentTreeNode.prototype.ExtendedMetadata = function() {
};
vlv.rsi.entities.ContentTreeNode.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.ContentTreeNode;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.ContentTreeNodeAuthorization = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Authorized"] = false
};
vlv.rsi.entities.ContentTreeNodeAuthorization.prototype = new vlv.entityBase;
vlv.rsi.entities.ContentTreeNodeAuthorization.constructor = vlv.rsi.entities.ContentTreeNodeAuthorization;
vlv.rsi.entities.ContentTreeNodeAuthorization.prototype._foreignProperties = {};
vlv.rsi.entities.ContentTreeNodeAuthorization.prototype.Id;
vlv.rsi.entities.ContentTreeNodeAuthorization.prototype.Authorized;
vlv.rsi.entities.ContentTreeNodeAuthorization.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.ContentTreeNodeAuthorization;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.ContentTreeNodeRoute = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["ContentTreeNodeId"] = "";
  this["RouterId"] = "";
  this["Url"] = "";
  this._foreignProperties = {"ContentTreeNode":{"type":vlv.rsi.entities.ContentTreeNode, "isArray":false}, "Router":{"type":vlv.rsi.entities.Router, "isArray":false}}
};
vlv.rsi.entities.ContentTreeNodeRoute.prototype = new vlv.entityBase;
vlv.rsi.entities.ContentTreeNodeRoute.constructor = vlv.rsi.entities.ContentTreeNodeRoute;
vlv.rsi.entities.ContentTreeNodeRoute.prototype._foreignProperties = {};
vlv.rsi.entities.ContentTreeNodeRoute.prototype.Id;
vlv.rsi.entities.ContentTreeNodeRoute.prototype.ContentTreeNodeId;
vlv.rsi.entities.ContentTreeNodeRoute.prototype.RouterId;
vlv.rsi.entities.ContentTreeNodeRoute.prototype.Url;
vlv.rsi.entities.ContentTreeNodeRoute.prototype.ContentTreeNode = function() {
};
vlv.rsi.entities.ContentTreeNodeRoute.prototype.Router = function() {
};
vlv.rsi.entities.ContentTreeNodeRoute.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.ContentTreeNodeRoute;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.CustomBrowse = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["CshNodeId"] = "";
  this._foreignProperties = {"Sections":{"type":vlv.rsi.entities.CustomBrowseSection, "isArray":true}}
};
vlv.rsi.entities.CustomBrowse.prototype = new vlv.entityBase;
vlv.rsi.entities.CustomBrowse.constructor = vlv.rsi.entities.CustomBrowse;
vlv.rsi.entities.CustomBrowse.prototype._foreignProperties = {};
vlv.rsi.entities.CustomBrowse.prototype.Id;
vlv.rsi.entities.CustomBrowse.prototype.Title;
vlv.rsi.entities.CustomBrowse.prototype.CshNodeId;
vlv.rsi.entities.CustomBrowse.prototype.Sections = function() {
};
vlv.rsi.entities.CustomBrowse.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.CustomBrowse;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.CustomBrowseInfo = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Summary"] = "";
  this["Published"] = null;
  this["Updated"] = null;
  this["Author"] = ""
};
vlv.rsi.entities.CustomBrowseInfo.prototype = new vlv.entityBase;
vlv.rsi.entities.CustomBrowseInfo.constructor = vlv.rsi.entities.CustomBrowseInfo;
vlv.rsi.entities.CustomBrowseInfo.prototype._foreignProperties = {};
vlv.rsi.entities.CustomBrowseInfo.prototype.Id;
vlv.rsi.entities.CustomBrowseInfo.prototype.Title;
vlv.rsi.entities.CustomBrowseInfo.prototype.Summary;
vlv.rsi.entities.CustomBrowseInfo.prototype.Published;
vlv.rsi.entities.CustomBrowseInfo.prototype.Updated;
vlv.rsi.entities.CustomBrowseInfo.prototype.Author;
vlv.rsi.entities.CustomBrowseInfo.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.CustomBrowseInfo;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.CustomBrowseSection = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["CshNodeId"] = "";
  this._foreignProperties = {"DocumentAssemblies":{"type":vlv.rsi.entities.DocumentAssemblyLink, "isArray":true}}
};
vlv.rsi.entities.CustomBrowseSection.prototype = new vlv.entityBase;
vlv.rsi.entities.CustomBrowseSection.constructor = vlv.rsi.entities.CustomBrowseSection;
vlv.rsi.entities.CustomBrowseSection.prototype._foreignProperties = {};
vlv.rsi.entities.CustomBrowseSection.prototype.Id;
vlv.rsi.entities.CustomBrowseSection.prototype.Title;
vlv.rsi.entities.CustomBrowseSection.prototype.CshNodeId;
vlv.rsi.entities.CustomBrowseSection.prototype.DocumentAssemblies = function() {
};
vlv.rsi.entities.CustomBrowseSection.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.CustomBrowseSection;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.CustomBrowseStream = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Content"] = ""
};
vlv.rsi.entities.CustomBrowseStream.prototype = new vlv.entityBase;
vlv.rsi.entities.CustomBrowseStream.constructor = vlv.rsi.entities.CustomBrowseStream;
vlv.rsi.entities.CustomBrowseStream.prototype._foreignProperties = {};
vlv.rsi.entities.CustomBrowseStream.prototype.Id;
vlv.rsi.entities.CustomBrowseStream.prototype.Content;
vlv.rsi.entities.CustomBrowseStream.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.CustomBrowseStream;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.Document = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Index"] = 0;
  this["Title"] = "";
  this["Summary"] = "";
  this["SelfCitation"] = "";
  this["Published"] = null;
  this["Updated"] = null;
  this["Authorized"] = false;
  this["Type"] = "";
  this["Url"] = "";
  this["Launchable"] = false;
  this["Source"] = "";
  this["SourceType"] = "";
  this["ConstitutionalAmendment"] = "";
  this["UpdatedByDocument"] = "";
  this["Status"] = "";
  this["Isbn"] = "";
  this["InForceDate"] = null;
  this["InForceNote"] = "";
  this["CaseReference"] = "";
  this["DocumentReference"] = "";
  this["DecisionDate"] = null;
  this["DeliveryDate"] = null;
  this["Creator"] = "";
  this["Created"] = null;
  this["SubType"] = "";
  this["AdditionalFields"] = "";
  this["HasToc"] = false;
  this["HasExternalToc"] = false;
  this["Language"] = "";
  this._foreignProperties = {"Relations":{"type":vlv.rsi.entities.DocumentRelation, "isArray":true}, "References":{"type":vlv.rsi.entities.Document, "isArray":true}, "Routes":{"type":vlv.rsi.entities.DocumentRoute, "isArray":true}, "Path":{"type":vlv.rsi.entities.ContentTreeNode, "isArray":true}, "Paths":{"type":vlv.rsi.entities.ContentTreeNode, "isArray":true}, "Streams":{"type":vlv.rsi.entities.DocumentStream, "isArray":true}, "ContentTable":{"type":vlv.rsi.entities.ContentTable, "isArray":false}, 
  "ExternalContentTable":{"type":vlv.rsi.entities.ContentTable, "isArray":false}, "ExternalPath":{"type":vlv.rsi.entities.ContentTable, "isArray":false}, "NextDocument":{"type":vlv.rsi.entities.Document, "isArray":false}, "PreviousDocument":{"type":vlv.rsi.entities.Document, "isArray":false}, "Annotations":{"type":vlv.rsi.entities.DocumentAnnotation, "isArray":true}, "ExtendedMetadata":{"type":vlv.rsi.entities.DocumentMetadataItem, "isArray":true}}
};
vlv.rsi.entities.Document.prototype = new vlv.entityBase;
vlv.rsi.entities.Document.constructor = vlv.rsi.entities.Document;
vlv.rsi.entities.Document.prototype._foreignProperties = {};
vlv.rsi.entities.Document.prototype.Id;
vlv.rsi.entities.Document.prototype.Index;
vlv.rsi.entities.Document.prototype.Title;
vlv.rsi.entities.Document.prototype.Summary;
vlv.rsi.entities.Document.prototype.SelfCitation;
vlv.rsi.entities.Document.prototype.Published;
vlv.rsi.entities.Document.prototype.Updated;
vlv.rsi.entities.Document.prototype.Authorized;
vlv.rsi.entities.Document.prototype.Relations = function() {
};
vlv.rsi.entities.Document.prototype.References = function() {
};
vlv.rsi.entities.Document.prototype.Routes = function() {
};
vlv.rsi.entities.Document.prototype.Path = function() {
};
vlv.rsi.entities.Document.prototype.Paths = function() {
};
vlv.rsi.entities.Document.prototype.Streams = function() {
};
vlv.rsi.entities.Document.prototype.ContentTable = function() {
};
vlv.rsi.entities.Document.prototype.ExternalContentTable = function() {
};
vlv.rsi.entities.Document.prototype.ExternalPath = function() {
};
vlv.rsi.entities.Document.prototype.NextDocument = function() {
};
vlv.rsi.entities.Document.prototype.PreviousDocument = function() {
};
vlv.rsi.entities.Document.prototype.Type;
vlv.rsi.entities.Document.prototype.Url;
vlv.rsi.entities.Document.prototype.Launchable;
vlv.rsi.entities.Document.prototype.Annotations = function() {
};
vlv.rsi.entities.Document.prototype.ExtendedMetadata = function() {
};
vlv.rsi.entities.Document.prototype.Source;
vlv.rsi.entities.Document.prototype.SourceType;
vlv.rsi.entities.Document.prototype.ConstitutionalAmendment;
vlv.rsi.entities.Document.prototype.UpdatedByDocument;
vlv.rsi.entities.Document.prototype.Status;
vlv.rsi.entities.Document.prototype.Isbn;
vlv.rsi.entities.Document.prototype.InForceDate;
vlv.rsi.entities.Document.prototype.InForceNote;
vlv.rsi.entities.Document.prototype.CaseReference;
vlv.rsi.entities.Document.prototype.DocumentReference;
vlv.rsi.entities.Document.prototype.DecisionDate;
vlv.rsi.entities.Document.prototype.DeliveryDate;
vlv.rsi.entities.Document.prototype.Creator;
vlv.rsi.entities.Document.prototype.Created;
vlv.rsi.entities.Document.prototype.SubType;
vlv.rsi.entities.Document.prototype.AdditionalFields;
vlv.rsi.entities.Document.prototype.HasToc;
vlv.rsi.entities.Document.prototype.HasExternalToc;
vlv.rsi.entities.Document.prototype.Language;
vlv.rsi.entities.Document.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.Document;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.DocumentAnnotation = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Text"] = "";
  this["Notes"] = "";
  this["Color"] = "";
  this["StartOffset"] = 0;
  this["StartElementId"] = "";
  this["EndOffset"] = 0;
  this["EndElementId"] = "";
  this["Created"] = null;
  this["Updated"] = null;
  this["Editable"] = false;
  this["DocumentId"] = "";
  this["CreatorFirstName"] = "";
  this["CreatorLastName"] = "";
  this["CreatorUserName"] = "";
  this["CreatorEmail"] = "";
  this["UpdaterFirstName"] = "";
  this["UpdaterLastName"] = "";
  this["UpdaterUserName"] = "";
  this["UpdaterEmail"] = "";
  this["ContextId"] = "";
  this["ContextTitle"] = "";
  this["ContextShared"] = false;
  this._foreignProperties = {"Document":{"type":vlv.rsi.entities.Document, "isArray":false}}
};
vlv.rsi.entities.DocumentAnnotation.prototype = new vlv.entityBase;
vlv.rsi.entities.DocumentAnnotation.constructor = vlv.rsi.entities.DocumentAnnotation;
vlv.rsi.entities.DocumentAnnotation.prototype._foreignProperties = {};
vlv.rsi.entities.DocumentAnnotation.prototype.Id;
vlv.rsi.entities.DocumentAnnotation.prototype.Title;
vlv.rsi.entities.DocumentAnnotation.prototype.Text;
vlv.rsi.entities.DocumentAnnotation.prototype.Notes;
vlv.rsi.entities.DocumentAnnotation.prototype.Color;
vlv.rsi.entities.DocumentAnnotation.prototype.StartOffset;
vlv.rsi.entities.DocumentAnnotation.prototype.StartElementId;
vlv.rsi.entities.DocumentAnnotation.prototype.EndOffset;
vlv.rsi.entities.DocumentAnnotation.prototype.EndElementId;
vlv.rsi.entities.DocumentAnnotation.prototype.Created;
vlv.rsi.entities.DocumentAnnotation.prototype.Updated;
vlv.rsi.entities.DocumentAnnotation.prototype.Editable;
vlv.rsi.entities.DocumentAnnotation.prototype.DocumentId;
vlv.rsi.entities.DocumentAnnotation.prototype.Document = function() {
};
vlv.rsi.entities.DocumentAnnotation.prototype.CreatorFirstName;
vlv.rsi.entities.DocumentAnnotation.prototype.CreatorLastName;
vlv.rsi.entities.DocumentAnnotation.prototype.CreatorUserName;
vlv.rsi.entities.DocumentAnnotation.prototype.CreatorEmail;
vlv.rsi.entities.DocumentAnnotation.prototype.UpdaterFirstName;
vlv.rsi.entities.DocumentAnnotation.prototype.UpdaterLastName;
vlv.rsi.entities.DocumentAnnotation.prototype.UpdaterUserName;
vlv.rsi.entities.DocumentAnnotation.prototype.UpdaterEmail;
vlv.rsi.entities.DocumentAnnotation.prototype.ContextId;
vlv.rsi.entities.DocumentAnnotation.prototype.ContextTitle;
vlv.rsi.entities.DocumentAnnotation.prototype.ContextShared;
vlv.rsi.entities.DocumentAnnotation.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.DocumentAnnotation;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.DocumentAssemblyLink = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["DocumentAssemblyId"] = "";
  this["Title"] = "";
  this["CshNodeId"] = "";
  this._foreignProperties = {"Documents":{"type":vlv.rsi.entities.Document, "isArray":true}, "DocumentLites":{"type":vlv.rsi.entities.DocumentLite, "isArray":true}}
};
vlv.rsi.entities.DocumentAssemblyLink.prototype = new vlv.entityBase;
vlv.rsi.entities.DocumentAssemblyLink.constructor = vlv.rsi.entities.DocumentAssemblyLink;
vlv.rsi.entities.DocumentAssemblyLink.prototype._foreignProperties = {};
vlv.rsi.entities.DocumentAssemblyLink.prototype.Id;
vlv.rsi.entities.DocumentAssemblyLink.prototype.DocumentAssemblyId;
vlv.rsi.entities.DocumentAssemblyLink.prototype.Title;
vlv.rsi.entities.DocumentAssemblyLink.prototype.CshNodeId;
vlv.rsi.entities.DocumentAssemblyLink.prototype.Documents = function() {
};
vlv.rsi.entities.DocumentAssemblyLink.prototype.DocumentLites = function() {
};
vlv.rsi.entities.DocumentAssemblyLink.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.DocumentAssemblyLink;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.DocumentEmail = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Subject"] = "";
  this["Message"] = "";
  this["To"] = "";
  this["Cc"] = "";
  this["Bcc"] = "";
  this["From"] = "";
  this["DocumentContentFormatterId"] = "";
  this._foreignProperties = {"Format":{"type":vlv.rsi.entities.DocumentEmailFormat, "isArray":false}, "Documents":{"type":vlv.rsi.entities.Document, "isArray":true}}
};
vlv.rsi.entities.DocumentEmail.prototype = new vlv.entityBase;
vlv.rsi.entities.DocumentEmail.constructor = vlv.rsi.entities.DocumentEmail;
vlv.rsi.entities.DocumentEmail.prototype._foreignProperties = {};
vlv.rsi.entities.DocumentEmail.prototype.Id;
vlv.rsi.entities.DocumentEmail.prototype.Subject;
vlv.rsi.entities.DocumentEmail.prototype.Message;
vlv.rsi.entities.DocumentEmail.prototype.To;
vlv.rsi.entities.DocumentEmail.prototype.Cc;
vlv.rsi.entities.DocumentEmail.prototype.Bcc;
vlv.rsi.entities.DocumentEmail.prototype.From;
vlv.rsi.entities.DocumentEmail.prototype.DocumentContentFormatterId;
vlv.rsi.entities.DocumentEmail.prototype.Format = function() {
};
vlv.rsi.entities.DocumentEmail.prototype.Documents = function() {
};
vlv.rsi.entities.DocumentEmail.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.DocumentEmail;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.DocumentEmailFormat = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Summary"] = ""
};
vlv.rsi.entities.DocumentEmailFormat.prototype = new vlv.entityBase;
vlv.rsi.entities.DocumentEmailFormat.constructor = vlv.rsi.entities.DocumentEmailFormat;
vlv.rsi.entities.DocumentEmailFormat.prototype._foreignProperties = {};
vlv.rsi.entities.DocumentEmailFormat.prototype.Id;
vlv.rsi.entities.DocumentEmailFormat.prototype.Title;
vlv.rsi.entities.DocumentEmailFormat.prototype.Summary;
vlv.rsi.entities.DocumentEmailFormat.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.DocumentEmailFormat;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.DocumentFileFormat = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Summary"] = ""
};
vlv.rsi.entities.DocumentFileFormat.prototype = new vlv.entityBase;
vlv.rsi.entities.DocumentFileFormat.constructor = vlv.rsi.entities.DocumentFileFormat;
vlv.rsi.entities.DocumentFileFormat.prototype._foreignProperties = {};
vlv.rsi.entities.DocumentFileFormat.prototype.Id;
vlv.rsi.entities.DocumentFileFormat.prototype.Title;
vlv.rsi.entities.DocumentFileFormat.prototype.Summary;
vlv.rsi.entities.DocumentFileFormat.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.DocumentFileFormat;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.DocumentHistory = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Citation"] = "";
  this._foreignProperties = {"DocumentVersions":{"type":vlv.rsi.entities.DocumentVersion, "isArray":true}, "InForceState":{"type":vlv.rsi.entities.DocumentVersion, "isArray":true}, "OtherStates":{"type":vlv.rsi.entities.DocumentVersion, "isArray":true}, "PendingState":{"type":vlv.rsi.entities.DocumentVersion, "isArray":true}, "WithdrawnState":{"type":vlv.rsi.entities.DocumentVersion, "isArray":true}}
};
vlv.rsi.entities.DocumentHistory.prototype = new vlv.entityBase;
vlv.rsi.entities.DocumentHistory.constructor = vlv.rsi.entities.DocumentHistory;
vlv.rsi.entities.DocumentHistory.prototype._foreignProperties = {};
vlv.rsi.entities.DocumentHistory.prototype.Id;
vlv.rsi.entities.DocumentHistory.prototype.Citation;
vlv.rsi.entities.DocumentHistory.prototype.DocumentVersions = function() {
};
vlv.rsi.entities.DocumentHistory.prototype.InForceState = function() {
};
vlv.rsi.entities.DocumentHistory.prototype.OtherStates = function() {
};
vlv.rsi.entities.DocumentHistory.prototype.PendingState = function() {
};
vlv.rsi.entities.DocumentHistory.prototype.WithdrawnState = function() {
};
vlv.rsi.entities.DocumentHistory.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.DocumentHistory;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.DocumentLite = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Type"] = "";
  this["Created"] = null;
  this["Authorized"] = false
};
vlv.rsi.entities.DocumentLite.prototype = new vlv.entityBase;
vlv.rsi.entities.DocumentLite.constructor = vlv.rsi.entities.DocumentLite;
vlv.rsi.entities.DocumentLite.prototype._foreignProperties = {};
vlv.rsi.entities.DocumentLite.prototype.Id;
vlv.rsi.entities.DocumentLite.prototype.Title;
vlv.rsi.entities.DocumentLite.prototype.Type;
vlv.rsi.entities.DocumentLite.prototype.Created;
vlv.rsi.entities.DocumentLite.prototype.Authorized;
vlv.rsi.entities.DocumentLite.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.DocumentLite;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.DocumentMetadataItem = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["ElementId"] = "";
  this["Name"] = "";
  this["Value"] = "";
  this["AttributeKey"] = "";
  this["AttributeValue"] = "";
  this["DocumentId"] = "";
  this["GroupId"] = "";
  this["GroupName"] = "";
  this["ParentId"] = ""
};
vlv.rsi.entities.DocumentMetadataItem.prototype = new vlv.entityBase;
vlv.rsi.entities.DocumentMetadataItem.constructor = vlv.rsi.entities.DocumentMetadataItem;
vlv.rsi.entities.DocumentMetadataItem.prototype._foreignProperties = {};
vlv.rsi.entities.DocumentMetadataItem.prototype.Id;
vlv.rsi.entities.DocumentMetadataItem.prototype.ElementId;
vlv.rsi.entities.DocumentMetadataItem.prototype.Name;
vlv.rsi.entities.DocumentMetadataItem.prototype.Value;
vlv.rsi.entities.DocumentMetadataItem.prototype.AttributeKey;
vlv.rsi.entities.DocumentMetadataItem.prototype.AttributeValue;
vlv.rsi.entities.DocumentMetadataItem.prototype.DocumentId;
vlv.rsi.entities.DocumentMetadataItem.prototype.GroupId;
vlv.rsi.entities.DocumentMetadataItem.prototype.GroupName;
vlv.rsi.entities.DocumentMetadataItem.prototype.ParentId;
vlv.rsi.entities.DocumentMetadataItem.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.DocumentMetadataItem;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.DocumentRelation = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this._foreignProperties = {"Children":{"type":vlv.rsi.entities.DocumentRelation, "isArray":true}, "Documents":{"type":vlv.rsi.entities.Document, "isArray":true}}
};
vlv.rsi.entities.DocumentRelation.prototype = new vlv.entityBase;
vlv.rsi.entities.DocumentRelation.constructor = vlv.rsi.entities.DocumentRelation;
vlv.rsi.entities.DocumentRelation.prototype._foreignProperties = {};
vlv.rsi.entities.DocumentRelation.prototype.Id;
vlv.rsi.entities.DocumentRelation.prototype.Title;
vlv.rsi.entities.DocumentRelation.prototype.Children = function() {
};
vlv.rsi.entities.DocumentRelation.prototype.Documents = function() {
};
vlv.rsi.entities.DocumentRelation.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.DocumentRelation;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.DocumentRoute = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["DocumentId"] = "";
  this["RouterId"] = "";
  this["Url"] = "";
  this._foreignProperties = {"Document":{"type":vlv.rsi.entities.Document, "isArray":false}, "Router":{"type":vlv.rsi.entities.Router, "isArray":false}}
};
vlv.rsi.entities.DocumentRoute.prototype = new vlv.entityBase;
vlv.rsi.entities.DocumentRoute.constructor = vlv.rsi.entities.DocumentRoute;
vlv.rsi.entities.DocumentRoute.prototype._foreignProperties = {};
vlv.rsi.entities.DocumentRoute.prototype.Id;
vlv.rsi.entities.DocumentRoute.prototype.DocumentId;
vlv.rsi.entities.DocumentRoute.prototype.RouterId;
vlv.rsi.entities.DocumentRoute.prototype.Url;
vlv.rsi.entities.DocumentRoute.prototype.Document = function() {
};
vlv.rsi.entities.DocumentRoute.prototype.Router = function() {
};
vlv.rsi.entities.DocumentRoute.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.DocumentRoute;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.DocumentStream = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this._foreignProperties = {"Document":{"type":vlv.rsi.entities.Document, "isArray":false}, "Channel":{"type":vlv.rsi.entities.ContentChannel, "isArray":false}}
};
vlv.rsi.entities.DocumentStream.prototype = new vlv.entityBase;
vlv.rsi.entities.DocumentStream.constructor = vlv.rsi.entities.DocumentStream;
vlv.rsi.entities.DocumentStream.prototype._foreignProperties = {};
vlv.rsi.entities.DocumentStream.prototype.ResponseHeaders;
vlv.rsi.entities.DocumentStream.prototype.Id;
vlv.rsi.entities.DocumentStream.prototype.Document = function() {
};
vlv.rsi.entities.DocumentStream.prototype.Channel = function() {
};
vlv.rsi.entities.DocumentStream.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.DocumentStream;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.DocumentVersion = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["State"] = "";
  this["StartDate"] = null;
  this["EndDate"] = null
};
vlv.rsi.entities.DocumentVersion.prototype = new vlv.entityBase;
vlv.rsi.entities.DocumentVersion.constructor = vlv.rsi.entities.DocumentVersion;
vlv.rsi.entities.DocumentVersion.prototype._foreignProperties = {};
vlv.rsi.entities.DocumentVersion.prototype.Id;
vlv.rsi.entities.DocumentVersion.prototype.State;
vlv.rsi.entities.DocumentVersion.prototype.StartDate;
vlv.rsi.entities.DocumentVersion.prototype.EndDate;
vlv.rsi.entities.DocumentVersion.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.DocumentVersion;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.FavoriteItem = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["NodeId"] = "";
  this["Title"] = "";
  this["Created"] = null;
  this["Order"] = 0;
  this["Status"] = "";
  this["NodeType"] = "";
  this["IsTool"] = false
};
vlv.rsi.entities.FavoriteItem.prototype = new vlv.entityBase;
vlv.rsi.entities.FavoriteItem.constructor = vlv.rsi.entities.FavoriteItem;
vlv.rsi.entities.FavoriteItem.prototype._foreignProperties = {};
vlv.rsi.entities.FavoriteItem.prototype.Id;
vlv.rsi.entities.FavoriteItem.prototype.NodeId;
vlv.rsi.entities.FavoriteItem.prototype.Title;
vlv.rsi.entities.FavoriteItem.prototype.Created;
vlv.rsi.entities.FavoriteItem.prototype.Order;
vlv.rsi.entities.FavoriteItem.prototype.Status;
vlv.rsi.entities.FavoriteItem.prototype.NodeType;
vlv.rsi.entities.FavoriteItem.prototype.IsTool;
vlv.rsi.entities.FavoriteItem.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.FavoriteItem;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.FilterTree = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Description"] = "";
  this["Index"] = 0;
  this["AvailableForPresearch"] = false;
  this._foreignProperties = {"Root":{"type":vlv.rsi.entities.FilterTreeNode, "isArray":false}}
};
vlv.rsi.entities.FilterTree.prototype = new vlv.entityBase;
vlv.rsi.entities.FilterTree.constructor = vlv.rsi.entities.FilterTree;
vlv.rsi.entities.FilterTree.prototype._foreignProperties = {};
vlv.rsi.entities.FilterTree.prototype.Id;
vlv.rsi.entities.FilterTree.prototype.Title;
vlv.rsi.entities.FilterTree.prototype.Description;
vlv.rsi.entities.FilterTree.prototype.Index;
vlv.rsi.entities.FilterTree.prototype.AvailableForPresearch;
vlv.rsi.entities.FilterTree.prototype.Root = function() {
};
vlv.rsi.entities.FilterTree.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.FilterTree;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.FilterTreeNode = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Index"] = 0;
  this["ImageURL"] = "";
  this["ChildrenCount"] = 0;
  this["HasChildren"] = false;
  this["Selectable"] = false;
  this["MultiSelectAllowed"] = false;
  this._foreignProperties = {"FilterTree":{"type":vlv.rsi.entities.FilterTree, "isArray":false}, "Children":{"type":vlv.rsi.entities.FilterTreeNode, "isArray":true}, "Path":{"type":vlv.rsi.entities.FilterTreeNode, "isArray":true}}
};
vlv.rsi.entities.FilterTreeNode.prototype = new vlv.entityBase;
vlv.rsi.entities.FilterTreeNode.constructor = vlv.rsi.entities.FilterTreeNode;
vlv.rsi.entities.FilterTreeNode.prototype._foreignProperties = {};
vlv.rsi.entities.FilterTreeNode.prototype.Id;
vlv.rsi.entities.FilterTreeNode.prototype.Title;
vlv.rsi.entities.FilterTreeNode.prototype.Index;
vlv.rsi.entities.FilterTreeNode.prototype.FilterTree = function() {
};
vlv.rsi.entities.FilterTreeNode.prototype.Children = function() {
};
vlv.rsi.entities.FilterTreeNode.prototype.Path = function() {
};
vlv.rsi.entities.FilterTreeNode.prototype.ImageURL;
vlv.rsi.entities.FilterTreeNode.prototype.ChildrenCount;
vlv.rsi.entities.FilterTreeNode.prototype.HasChildren;
vlv.rsi.entities.FilterTreeNode.prototype.Selectable;
vlv.rsi.entities.FilterTreeNode.prototype.MultiSelectAllowed;
vlv.rsi.entities.FilterTreeNode.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.FilterTreeNode;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.Folder = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["ParentId"] = "";
  this["DocumentsCount"] = 0;
  this["Note"] = "";
  this["IsSystem"] = false;
  this["IsShared"] = false;
  this["IsHidden"] = false;
  this["AccessLevel"] = "";
  this["Owner"] = "";
  this["HasExpiredSharees"] = false;
  this._foreignProperties = {"Parent":{"type":vlv.rsi.entities.Folder, "isArray":false}, "Children":{"type":vlv.rsi.entities.Folder, "isArray":true}, "Documents":{"type":vlv.rsi.entities.FolderDocumentItem, "isArray":true}, "Routes":{"type":vlv.rsi.entities.FolderRoute, "isArray":true}, "SharingUsers":{"type":vlv.rsi.entities.SharingUser, "isArray":true}, "SharingGroups":{"type":vlv.rsi.entities.SharingGroup, "isArray":true}, "Items":{"type":vlv.rsi.entities.FolderItem, "isArray":true}}
};
vlv.rsi.entities.Folder.prototype = new vlv.entityBase;
vlv.rsi.entities.Folder.constructor = vlv.rsi.entities.Folder;
vlv.rsi.entities.Folder.prototype._foreignProperties = {};
vlv.rsi.entities.Folder.prototype.Id;
vlv.rsi.entities.Folder.prototype.Title;
vlv.rsi.entities.Folder.prototype.ParentId;
vlv.rsi.entities.Folder.prototype.Parent = function() {
};
vlv.rsi.entities.Folder.prototype.Children = function() {
};
vlv.rsi.entities.Folder.prototype.DocumentsCount;
vlv.rsi.entities.Folder.prototype.Documents = function() {
};
vlv.rsi.entities.Folder.prototype.Note;
vlv.rsi.entities.Folder.prototype.Routes = function() {
};
vlv.rsi.entities.Folder.prototype.IsSystem;
vlv.rsi.entities.Folder.prototype.IsShared;
vlv.rsi.entities.Folder.prototype.IsHidden;
vlv.rsi.entities.Folder.prototype.AccessLevel;
vlv.rsi.entities.Folder.prototype.Owner;
vlv.rsi.entities.Folder.prototype.HasExpiredSharees;
vlv.rsi.entities.Folder.prototype.SharingUsers = function() {
};
vlv.rsi.entities.Folder.prototype.SharingGroups = function() {
};
vlv.rsi.entities.Folder.prototype.Items = function() {
};
vlv.rsi.entities.Folder.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.Folder;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.FolderDocumentItem = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Note"] = "";
  this["FolderId"] = "";
  this["Index"] = 0;
  this["DocumentId"] = "";
  this["DocumentType"] = "";
  this["SavedBy"] = "";
  this["SavedOn"] = null;
  this["OwnerStatus"] = "";
  this._foreignProperties = {"Document":{"type":vlv.rsi.entities.Document, "isArray":false}, "Annotations":{"type":vlv.rsi.entities.DocumentAnnotation, "isArray":true}, "ExtendedMetadata":{"type":vlv.rsi.entities.DocumentMetadataItem, "isArray":true}}
};
vlv.rsi.entities.FolderDocumentItem.prototype = new vlv.entityBase;
vlv.rsi.entities.FolderDocumentItem.constructor = vlv.rsi.entities.FolderDocumentItem;
vlv.rsi.entities.FolderDocumentItem.prototype._foreignProperties = {};
vlv.rsi.entities.FolderDocumentItem.prototype.Id;
vlv.rsi.entities.FolderDocumentItem.prototype.Title;
vlv.rsi.entities.FolderDocumentItem.prototype.Note;
vlv.rsi.entities.FolderDocumentItem.prototype.FolderId;
vlv.rsi.entities.FolderDocumentItem.prototype.Index;
vlv.rsi.entities.FolderDocumentItem.prototype.DocumentId;
vlv.rsi.entities.FolderDocumentItem.prototype.DocumentType;
vlv.rsi.entities.FolderDocumentItem.prototype.Document = function() {
};
vlv.rsi.entities.FolderDocumentItem.prototype.SavedBy;
vlv.rsi.entities.FolderDocumentItem.prototype.SavedOn;
vlv.rsi.entities.FolderDocumentItem.prototype.OwnerStatus;
vlv.rsi.entities.FolderDocumentItem.prototype.Annotations = function() {
};
vlv.rsi.entities.FolderDocumentItem.prototype.ExtendedMetadata = function() {
};
vlv.rsi.entities.FolderDocumentItem.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.FolderDocumentItem;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.FolderItem = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Note"] = "";
  this["FolderId"] = "";
  this["Index"] = 0;
  this["SavedBy"] = "";
  this["SavedOn"] = null;
  this["OwnerStatus"] = ""
};
vlv.rsi.entities.FolderItem.prototype = new vlv.entityBase;
vlv.rsi.entities.FolderItem.constructor = vlv.rsi.entities.FolderItem;
vlv.rsi.entities.FolderItem.prototype._foreignProperties = {};
vlv.rsi.entities.FolderItem.prototype.Id;
vlv.rsi.entities.FolderItem.prototype.Title;
vlv.rsi.entities.FolderItem.prototype.Note;
vlv.rsi.entities.FolderItem.prototype.FolderId;
vlv.rsi.entities.FolderItem.prototype.Index;
vlv.rsi.entities.FolderItem.prototype.SavedBy;
vlv.rsi.entities.FolderItem.prototype.SavedOn;
vlv.rsi.entities.FolderItem.prototype.OwnerStatus;
vlv.rsi.entities.FolderItem.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.FolderItem;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.FolderRoute = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["FolderId"] = "";
  this["RouterId"] = "";
  this["Url"] = "";
  this._foreignProperties = {"Folder":{"type":vlv.rsi.entities.Folder, "isArray":false}, "Router":{"type":vlv.rsi.entities.Router, "isArray":false}}
};
vlv.rsi.entities.FolderRoute.prototype = new vlv.entityBase;
vlv.rsi.entities.FolderRoute.constructor = vlv.rsi.entities.FolderRoute;
vlv.rsi.entities.FolderRoute.prototype._foreignProperties = {};
vlv.rsi.entities.FolderRoute.prototype.Id;
vlv.rsi.entities.FolderRoute.prototype.FolderId;
vlv.rsi.entities.FolderRoute.prototype.RouterId;
vlv.rsi.entities.FolderRoute.prototype.Url;
vlv.rsi.entities.FolderRoute.prototype.Folder = function() {
};
vlv.rsi.entities.FolderRoute.prototype.Router = function() {
};
vlv.rsi.entities.FolderRoute.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.FolderRoute;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.HistoryItem = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Comment"] = "";
  this["Updated"] = null;
  this["Visible"] = false;
  this["Duration"] = 0;
  this["Title"] = "";
  this._foreignProperties = {"ExtendedMetadata":{"type":vlv.rsi.entities.DocumentMetadataItem, "isArray":true}}
};
vlv.rsi.entities.HistoryItem.prototype = new vlv.entityBase;
vlv.rsi.entities.HistoryItem.constructor = vlv.rsi.entities.HistoryItem;
vlv.rsi.entities.HistoryItem.prototype._foreignProperties = {};
vlv.rsi.entities.HistoryItem.prototype.Id;
vlv.rsi.entities.HistoryItem.prototype.Comment;
vlv.rsi.entities.HistoryItem.prototype.Updated;
vlv.rsi.entities.HistoryItem.prototype.Visible;
vlv.rsi.entities.HistoryItem.prototype.Duration;
vlv.rsi.entities.HistoryItem.prototype.Title;
vlv.rsi.entities.HistoryItem.prototype.ExtendedMetadata = function() {
};
vlv.rsi.entities.HistoryItem.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.HistoryItem;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.News = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Summary"] = "";
  this["DocumentId"] = "";
  this["DocumentType"] = "";
  this["Published"] = null;
  this["Updated"] = null;
  this["Index"] = 0;
  this._foreignProperties = {"Document":{"type":vlv.rsi.entities.Document, "isArray":false}, "Routes":{"type":vlv.rsi.entities.NewsRoute, "isArray":true}}
};
vlv.rsi.entities.News.prototype = new vlv.entityBase;
vlv.rsi.entities.News.constructor = vlv.rsi.entities.News;
vlv.rsi.entities.News.prototype._foreignProperties = {};
vlv.rsi.entities.News.prototype.Id;
vlv.rsi.entities.News.prototype.Title;
vlv.rsi.entities.News.prototype.Summary;
vlv.rsi.entities.News.prototype.DocumentId;
vlv.rsi.entities.News.prototype.DocumentType;
vlv.rsi.entities.News.prototype.Published;
vlv.rsi.entities.News.prototype.Updated;
vlv.rsi.entities.News.prototype.Index;
vlv.rsi.entities.News.prototype.Document = function() {
};
vlv.rsi.entities.News.prototype.Routes = function() {
};
vlv.rsi.entities.News.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.News;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.NewsRoute = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["NewsId"] = "";
  this["RouterId"] = "";
  this["Url"] = "";
  this._foreignProperties = {"News":{"type":vlv.rsi.entities.News, "isArray":false}, "Router":{"type":vlv.rsi.entities.Router, "isArray":false}}
};
vlv.rsi.entities.NewsRoute.prototype = new vlv.entityBase;
vlv.rsi.entities.NewsRoute.constructor = vlv.rsi.entities.NewsRoute;
vlv.rsi.entities.NewsRoute.prototype._foreignProperties = {};
vlv.rsi.entities.NewsRoute.prototype.Id;
vlv.rsi.entities.NewsRoute.prototype.NewsId;
vlv.rsi.entities.NewsRoute.prototype.RouterId;
vlv.rsi.entities.NewsRoute.prototype.Url;
vlv.rsi.entities.NewsRoute.prototype.News = function() {
};
vlv.rsi.entities.NewsRoute.prototype.Router = function() {
};
vlv.rsi.entities.NewsRoute.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.NewsRoute;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.OptionKeyValue = function() {
  vlv.entityBase.call(this);
  this["Key"] = "";
  this["Value"] = ""
};
vlv.rsi.entities.OptionKeyValue.prototype = new vlv.entityBase;
vlv.rsi.entities.OptionKeyValue.constructor = vlv.rsi.entities.OptionKeyValue;
vlv.rsi.entities.OptionKeyValue.prototype._foreignProperties = {};
vlv.rsi.entities.OptionKeyValue.prototype.Key;
vlv.rsi.entities.OptionKeyValue.prototype.Value;
vlv.rsi.entities.OptionKeyValue.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.OptionKeyValue;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.OsaRequest = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Name"] = "";
  this["ServiceRequestId"] = "";
  this["StartTime"] = 0;
  this["RsiTime"] = 0;
  this["WatchdogTime"] = 0;
  this["ResponseTime"] = 0;
  this["OverheadTime"] = 0;
  this["RequestFiltersTime"] = 0;
  this["ResponseFiltersTime"] = 0;
  this["RequestBody"] = "";
  this["ResponseBody"] = "";
  this["Comment"] = ""
};
vlv.rsi.entities.OsaRequest.prototype = new vlv.entityBase;
vlv.rsi.entities.OsaRequest.constructor = vlv.rsi.entities.OsaRequest;
vlv.rsi.entities.OsaRequest.prototype._foreignProperties = {};
vlv.rsi.entities.OsaRequest.prototype.Id;
vlv.rsi.entities.OsaRequest.prototype.Name;
vlv.rsi.entities.OsaRequest.prototype.ServiceRequestId;
vlv.rsi.entities.OsaRequest.prototype.StartTime;
vlv.rsi.entities.OsaRequest.prototype.RsiTime;
vlv.rsi.entities.OsaRequest.prototype.WatchdogTime;
vlv.rsi.entities.OsaRequest.prototype.ResponseTime;
vlv.rsi.entities.OsaRequest.prototype.OverheadTime;
vlv.rsi.entities.OsaRequest.prototype.RequestFiltersTime;
vlv.rsi.entities.OsaRequest.prototype.ResponseFiltersTime;
vlv.rsi.entities.OsaRequest.prototype.RequestBody;
vlv.rsi.entities.OsaRequest.prototype.ResponseBody;
vlv.rsi.entities.OsaRequest.prototype.Comment;
vlv.rsi.entities.OsaRequest.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.OsaRequest;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.PersonalItem = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Name"] = "";
  this["IsShared"] = false;
  this["IsNotExist"] = false;
  this._foreignProperties = {"SharingUsers":{"type":vlv.rsi.entities.SharingUser, "isArray":true}, "SharingGroups":{"type":vlv.rsi.entities.SharingGroup, "isArray":true}}
};
vlv.rsi.entities.PersonalItem.prototype = new vlv.entityBase;
vlv.rsi.entities.PersonalItem.constructor = vlv.rsi.entities.PersonalItem;
vlv.rsi.entities.PersonalItem.prototype._foreignProperties = {};
vlv.rsi.entities.PersonalItem.prototype.Id;
vlv.rsi.entities.PersonalItem.prototype.Name;
vlv.rsi.entities.PersonalItem.prototype.IsShared;
vlv.rsi.entities.PersonalItem.prototype.IsNotExist;
vlv.rsi.entities.PersonalItem.prototype.SharingUsers = function() {
};
vlv.rsi.entities.PersonalItem.prototype.SharingGroups = function() {
};
vlv.rsi.entities.PersonalItem.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.PersonalItem;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.Preference = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Value"] = "";
  this["ReadOnly"] = false;
  this["DefaultValue"] = ""
};
vlv.rsi.entities.Preference.prototype = new vlv.entityBase;
vlv.rsi.entities.Preference.constructor = vlv.rsi.entities.Preference;
vlv.rsi.entities.Preference.prototype._foreignProperties = {};
vlv.rsi.entities.Preference.prototype.Id;
vlv.rsi.entities.Preference.prototype.Value;
vlv.rsi.entities.Preference.prototype.ReadOnly;
vlv.rsi.entities.Preference.prototype.DefaultValue;
vlv.rsi.entities.Preference.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.Preference;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.Query = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this._foreignProperties = {"Routes":{"type":vlv.rsi.entities.QueryRoute, "isArray":true}}
};
vlv.rsi.entities.Query.prototype = new vlv.entityBase;
vlv.rsi.entities.Query.constructor = vlv.rsi.entities.Query;
vlv.rsi.entities.Query.prototype._foreignProperties = {};
vlv.rsi.entities.Query.prototype.Id;
vlv.rsi.entities.Query.prototype.ParseClauses = function() {
};
vlv.rsi.entities.Query.prototype.ParseClausesWithThesaurus = function() {
};
vlv.rsi.entities.Query.prototype.Routes = function() {
};
vlv.rsi.entities.Query.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.Query;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.QueryRoute = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["QueryId"] = "";
  this["RouterId"] = "";
  this["Url"] = "";
  this._foreignProperties = {"Query":{"type":vlv.rsi.entities.Query, "isArray":false}, "Router":{"type":vlv.rsi.entities.Router, "isArray":false}}
};
vlv.rsi.entities.QueryRoute.prototype = new vlv.entityBase;
vlv.rsi.entities.QueryRoute.constructor = vlv.rsi.entities.QueryRoute;
vlv.rsi.entities.QueryRoute.prototype._foreignProperties = {};
vlv.rsi.entities.QueryRoute.prototype.Id;
vlv.rsi.entities.QueryRoute.prototype.QueryId;
vlv.rsi.entities.QueryRoute.prototype.RouterId;
vlv.rsi.entities.QueryRoute.prototype.Url;
vlv.rsi.entities.QueryRoute.prototype.Query = function() {
};
vlv.rsi.entities.QueryRoute.prototype.Router = function() {
};
vlv.rsi.entities.QueryRoute.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.QueryRoute;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.Router = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = ""
};
vlv.rsi.entities.Router.prototype = new vlv.entityBase;
vlv.rsi.entities.Router.constructor = vlv.rsi.entities.Router;
vlv.rsi.entities.Router.prototype._foreignProperties = {};
vlv.rsi.entities.Router.prototype.Id;
vlv.rsi.entities.Router.prototype.Title;
vlv.rsi.entities.Router.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.Router;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.SavedSearch = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["DateTimeSaved"] = null;
  this["DateTimeRun"] = null;
  this["Query"] = "";
  this["SortOrder"] = "";
  this["SortDirection"] = "";
  this["WorkspaceId"] = "";
  this["WorkspaceName"] = "";
  this._foreignProperties = {"Search":{"type":vlv.rsi.entities.Search, "isArray":false}, "ContentModules":{"type":vlv.rsi.entities.ContentModule, "isArray":true}, "ContentTreeNodes":{"type":vlv.rsi.entities.ContentTreeNode, "isArray":true}, "FilterTreeNodes":{"type":vlv.rsi.entities.FilterTreeNode, "isArray":true}}
};
vlv.rsi.entities.SavedSearch.prototype = new vlv.entityBase;
vlv.rsi.entities.SavedSearch.constructor = vlv.rsi.entities.SavedSearch;
vlv.rsi.entities.SavedSearch.prototype._foreignProperties = {};
vlv.rsi.entities.SavedSearch.prototype.Id;
vlv.rsi.entities.SavedSearch.prototype.Title;
vlv.rsi.entities.SavedSearch.prototype.DateTimeSaved;
vlv.rsi.entities.SavedSearch.prototype.DateTimeRun;
vlv.rsi.entities.SavedSearch.prototype.Query;
vlv.rsi.entities.SavedSearch.prototype.SortOrder;
vlv.rsi.entities.SavedSearch.prototype.SortDirection;
vlv.rsi.entities.SavedSearch.prototype.WorkspaceId;
vlv.rsi.entities.SavedSearch.prototype.WorkspaceName;
vlv.rsi.entities.SavedSearch.prototype.Search = function() {
};
vlv.rsi.entities.SavedSearch.prototype.ContentModules = function() {
};
vlv.rsi.entities.SavedSearch.prototype.ContentTreeNodes = function() {
};
vlv.rsi.entities.SavedSearch.prototype.FilterTreeNodes = function() {
};
vlv.rsi.entities.SavedSearch.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.SavedSearch;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.Search = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Query"] = "";
  this["Clustered"] = false;
  this._foreignProperties = {"Configuration":{"type":vlv.rsi.entities.SearchConfiguration, "isArray":false}, "SingleResultList":{"type":vlv.rsi.entities.SearchResultList, "isArray":false}, "Result":{"type":vlv.rsi.entities.SearchResultList, "isArray":false}, "ClusterResult":{"type":vlv.rsi.entities.ClusterSearchResultList, "isArray":false}, "Routes":{"type":vlv.rsi.entities.SearchRoute, "isArray":true}}
};
vlv.rsi.entities.Search.prototype = new vlv.entityBase;
vlv.rsi.entities.Search.constructor = vlv.rsi.entities.Search;
vlv.rsi.entities.Search.prototype._foreignProperties = {};
vlv.rsi.entities.Search.prototype.Id;
vlv.rsi.entities.Search.prototype.Query;
vlv.rsi.entities.Search.prototype.Clustered;
vlv.rsi.entities.Search.prototype.Configuration = function() {
};
vlv.rsi.entities.Search.prototype.SingleResultList = function() {
};
vlv.rsi.entities.Search.prototype.Result = function() {
};
vlv.rsi.entities.Search.prototype.ClusterResult = function() {
};
vlv.rsi.entities.Search.prototype.Routes = function() {
};
vlv.rsi.entities.Search.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.Search;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.SearchConfiguration = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Summary"] = "";
  this["Type"] = ""
};
vlv.rsi.entities.SearchConfiguration.prototype = new vlv.entityBase;
vlv.rsi.entities.SearchConfiguration.constructor = vlv.rsi.entities.SearchConfiguration;
vlv.rsi.entities.SearchConfiguration.prototype._foreignProperties = {};
vlv.rsi.entities.SearchConfiguration.prototype.Id;
vlv.rsi.entities.SearchConfiguration.prototype.Title;
vlv.rsi.entities.SearchConfiguration.prototype.Summary;
vlv.rsi.entities.SearchConfiguration.prototype.Type;
vlv.rsi.entities.SearchConfiguration.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.SearchConfiguration;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.SearchFilterTree = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Index"] = 0;
  this._foreignProperties = {"Root":{"type":vlv.rsi.entities.SearchFilterTreeNode, "isArray":false}, "SearchResultList":{"type":vlv.rsi.entities.SearchResultList, "isArray":false}, "FilterTree":{"type":vlv.rsi.entities.FilterTree, "isArray":false}}
};
vlv.rsi.entities.SearchFilterTree.prototype = new vlv.entityBase;
vlv.rsi.entities.SearchFilterTree.constructor = vlv.rsi.entities.SearchFilterTree;
vlv.rsi.entities.SearchFilterTree.prototype._foreignProperties = {};
vlv.rsi.entities.SearchFilterTree.prototype.Id;
vlv.rsi.entities.SearchFilterTree.prototype.Title;
vlv.rsi.entities.SearchFilterTree.prototype.Index;
vlv.rsi.entities.SearchFilterTree.prototype.Root = function() {
};
vlv.rsi.entities.SearchFilterTree.prototype.SearchResultList = function() {
};
vlv.rsi.entities.SearchFilterTree.prototype.FilterTree = function() {
};
vlv.rsi.entities.SearchFilterTree.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.SearchFilterTree;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.SearchFilterTreeNode = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Index"] = 0;
  this["ImageURL"] = "";
  this["TotalResults"] = 0;
  this["HasChildren"] = false;
  this._foreignProperties = {"SearchFilterTree":{"type":vlv.rsi.entities.SearchFilterTree, "isArray":false}, "Children":{"type":vlv.rsi.entities.SearchFilterTreeNode, "isArray":true}, "Path":{"type":vlv.rsi.entities.SearchFilterTreeNode, "isArray":true}, "SearchResultList":{"type":vlv.rsi.entities.SearchResultList, "isArray":false}, "FilterTreeNode":{"type":vlv.rsi.entities.FilterTreeNode, "isArray":false}}
};
vlv.rsi.entities.SearchFilterTreeNode.prototype = new vlv.entityBase;
vlv.rsi.entities.SearchFilterTreeNode.constructor = vlv.rsi.entities.SearchFilterTreeNode;
vlv.rsi.entities.SearchFilterTreeNode.prototype._foreignProperties = {};
vlv.rsi.entities.SearchFilterTreeNode.prototype.Id;
vlv.rsi.entities.SearchFilterTreeNode.prototype.Title;
vlv.rsi.entities.SearchFilterTreeNode.prototype.Index;
vlv.rsi.entities.SearchFilterTreeNode.prototype.SearchFilterTree = function() {
};
vlv.rsi.entities.SearchFilterTreeNode.prototype.Children = function() {
};
vlv.rsi.entities.SearchFilterTreeNode.prototype.Path = function() {
};
vlv.rsi.entities.SearchFilterTreeNode.prototype.SearchResultList = function() {
};
vlv.rsi.entities.SearchFilterTreeNode.prototype.FilterTreeNode = function() {
};
vlv.rsi.entities.SearchFilterTreeNode.prototype.ImageURL;
vlv.rsi.entities.SearchFilterTreeNode.prototype.TotalResults;
vlv.rsi.entities.SearchFilterTreeNode.prototype.HasChildren;
vlv.rsi.entities.SearchFilterTreeNode.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.SearchFilterTreeNode;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.SearchResultList = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Query"] = "";
  this["TotalResults"] = 0;
  this._foreignProperties = {"Items":{"type":vlv.rsi.entities.SearchResultListItem, "isArray":true}, "FilterTrees":{"type":vlv.rsi.entities.SearchFilterTree, "isArray":true}, "Citations":{"type":vlv.rsi.entities.ClusterSearchResultListItem, "isArray":false}}
};
vlv.rsi.entities.SearchResultList.prototype = new vlv.entityBase;
vlv.rsi.entities.SearchResultList.constructor = vlv.rsi.entities.SearchResultList;
vlv.rsi.entities.SearchResultList.prototype._foreignProperties = {};
vlv.rsi.entities.SearchResultList.prototype.Id;
vlv.rsi.entities.SearchResultList.prototype.Title;
vlv.rsi.entities.SearchResultList.prototype.Query;
vlv.rsi.entities.SearchResultList.prototype.TotalResults;
vlv.rsi.entities.SearchResultList.prototype.Items = function() {
};
vlv.rsi.entities.SearchResultList.prototype.FilterTrees = function() {
};
vlv.rsi.entities.SearchResultList.prototype.Citations = function() {
};
vlv.rsi.entities.SearchResultList.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.SearchResultList;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.SearchResultListItem = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Index"] = 0;
  this["Title"] = "";
  this["Summary"] = "";
  this["Anchor"] = "";
  this["DocumentId"] = "";
  this["DocumentType"] = "";
  this["Launchable"] = false;
  this["Url"] = "";
  this._foreignProperties = {"Document":{"type":vlv.rsi.entities.Document, "isArray":false}, "Routes":{"type":vlv.rsi.entities.SearchResultListItemRoute, "isArray":true}, "Streams":{"type":vlv.rsi.entities.SearchResultListItemStream, "isArray":true}, "ExtendedMetadata":{"type":vlv.rsi.entities.DocumentMetadataItem, "isArray":true}}
};
vlv.rsi.entities.SearchResultListItem.prototype = new vlv.entityBase;
vlv.rsi.entities.SearchResultListItem.constructor = vlv.rsi.entities.SearchResultListItem;
vlv.rsi.entities.SearchResultListItem.prototype._foreignProperties = {};
vlv.rsi.entities.SearchResultListItem.prototype.Id;
vlv.rsi.entities.SearchResultListItem.prototype.Index;
vlv.rsi.entities.SearchResultListItem.prototype.Title;
vlv.rsi.entities.SearchResultListItem.prototype.Summary;
vlv.rsi.entities.SearchResultListItem.prototype.Anchor;
vlv.rsi.entities.SearchResultListItem.prototype.DocumentId;
vlv.rsi.entities.SearchResultListItem.prototype.DocumentType;
vlv.rsi.entities.SearchResultListItem.prototype.Document = function() {
};
vlv.rsi.entities.SearchResultListItem.prototype.Routes = function() {
};
vlv.rsi.entities.SearchResultListItem.prototype.Streams = function() {
};
vlv.rsi.entities.SearchResultListItem.prototype.ExtendedMetadata = function() {
};
vlv.rsi.entities.SearchResultListItem.prototype.Launchable;
vlv.rsi.entities.SearchResultListItem.prototype.Url;
vlv.rsi.entities.SearchResultListItem.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.SearchResultListItem;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.SearchResultListItemRoute = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["SearchResultListItemId"] = "";
  this["DocumentId"] = "";
  this["RouterId"] = "";
  this["Url"] = "";
  this._foreignProperties = {"SearchResultListItem":{"type":vlv.rsi.entities.SearchResultListItem, "isArray":false}, "Router":{"type":vlv.rsi.entities.Router, "isArray":false}}
};
vlv.rsi.entities.SearchResultListItemRoute.prototype = new vlv.entityBase;
vlv.rsi.entities.SearchResultListItemRoute.constructor = vlv.rsi.entities.SearchResultListItemRoute;
vlv.rsi.entities.SearchResultListItemRoute.prototype._foreignProperties = {};
vlv.rsi.entities.SearchResultListItemRoute.prototype.Id;
vlv.rsi.entities.SearchResultListItemRoute.prototype.SearchResultListItemId;
vlv.rsi.entities.SearchResultListItemRoute.prototype.DocumentId;
vlv.rsi.entities.SearchResultListItemRoute.prototype.RouterId;
vlv.rsi.entities.SearchResultListItemRoute.prototype.Url;
vlv.rsi.entities.SearchResultListItemRoute.prototype.SearchResultListItem = function() {
};
vlv.rsi.entities.SearchResultListItemRoute.prototype.Router = function() {
};
vlv.rsi.entities.SearchResultListItemRoute.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.SearchResultListItemRoute;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.SearchResultListItemStream = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this._foreignProperties = {"SearchResultList":{"type":vlv.rsi.entities.SearchResultList, "isArray":false}, "Channel":{"type":vlv.rsi.entities.ContentChannel, "isArray":false}}
};
vlv.rsi.entities.SearchResultListItemStream.prototype = new vlv.entityBase;
vlv.rsi.entities.SearchResultListItemStream.constructor = vlv.rsi.entities.SearchResultListItemStream;
vlv.rsi.entities.SearchResultListItemStream.prototype._foreignProperties = {};
vlv.rsi.entities.SearchResultListItemStream.prototype.Id;
vlv.rsi.entities.SearchResultListItemStream.prototype.SearchResultList = function() {
};
vlv.rsi.entities.SearchResultListItemStream.prototype.Channel = function() {
};
vlv.rsi.entities.SearchResultListItemStream.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.SearchResultListItemStream;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.SearchRoute = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["SearchId"] = "";
  this["RouterId"] = "";
  this["Url"] = "";
  this._foreignProperties = {"Search":{"type":vlv.rsi.entities.Search, "isArray":false}, "Router":{"type":vlv.rsi.entities.Router, "isArray":false}}
};
vlv.rsi.entities.SearchRoute.prototype = new vlv.entityBase;
vlv.rsi.entities.SearchRoute.constructor = vlv.rsi.entities.SearchRoute;
vlv.rsi.entities.SearchRoute.prototype._foreignProperties = {};
vlv.rsi.entities.SearchRoute.prototype.Id;
vlv.rsi.entities.SearchRoute.prototype.SearchId;
vlv.rsi.entities.SearchRoute.prototype.RouterId;
vlv.rsi.entities.SearchRoute.prototype.Url;
vlv.rsi.entities.SearchRoute.prototype.Search = function() {
};
vlv.rsi.entities.SearchRoute.prototype.Router = function() {
};
vlv.rsi.entities.SearchRoute.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.SearchRoute;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.SearchTemplate = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this._foreignProperties = {"Components":{"type":vlv.rsi.entities.SearchTemplateComponent, "isArray":true}, "Examples":{"type":vlv.rsi.entities.SearchTemplateExample, "isArray":true}}
};
vlv.rsi.entities.SearchTemplate.prototype = new vlv.entityBase;
vlv.rsi.entities.SearchTemplate.constructor = vlv.rsi.entities.SearchTemplate;
vlv.rsi.entities.SearchTemplate.prototype._foreignProperties = {};
vlv.rsi.entities.SearchTemplate.prototype.Id;
vlv.rsi.entities.SearchTemplate.prototype.Components = function() {
};
vlv.rsi.entities.SearchTemplate.prototype.Examples = function() {
};
vlv.rsi.entities.SearchTemplate.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.SearchTemplate;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.SearchTemplateComponent = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Type"] = "";
  this["Text"] = "";
  this["MaxLength"] = 0
};
vlv.rsi.entities.SearchTemplateComponent.prototype = new vlv.entityBase;
vlv.rsi.entities.SearchTemplateComponent.constructor = vlv.rsi.entities.SearchTemplateComponent;
vlv.rsi.entities.SearchTemplateComponent.prototype._foreignProperties = {};
vlv.rsi.entities.SearchTemplateComponent.prototype.Id;
vlv.rsi.entities.SearchTemplateComponent.prototype.Type;
vlv.rsi.entities.SearchTemplateComponent.prototype.Text;
vlv.rsi.entities.SearchTemplateComponent.prototype.MaxLength;
vlv.rsi.entities.SearchTemplateComponent.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.SearchTemplateComponent;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.SearchTemplateExample = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Value"] = ""
};
vlv.rsi.entities.SearchTemplateExample.prototype = new vlv.entityBase;
vlv.rsi.entities.SearchTemplateExample.constructor = vlv.rsi.entities.SearchTemplateExample;
vlv.rsi.entities.SearchTemplateExample.prototype._foreignProperties = {};
vlv.rsi.entities.SearchTemplateExample.prototype.Id;
vlv.rsi.entities.SearchTemplateExample.prototype.Value;
vlv.rsi.entities.SearchTemplateExample.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.SearchTemplateExample;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.SearchTemplateTree = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this._foreignProperties = {"Root":{"type":vlv.rsi.entities.SearchTemplateTreeNode, "isArray":false}}
};
vlv.rsi.entities.SearchTemplateTree.prototype = new vlv.entityBase;
vlv.rsi.entities.SearchTemplateTree.constructor = vlv.rsi.entities.SearchTemplateTree;
vlv.rsi.entities.SearchTemplateTree.prototype._foreignProperties = {};
vlv.rsi.entities.SearchTemplateTree.prototype.Id;
vlv.rsi.entities.SearchTemplateTree.prototype.Title;
vlv.rsi.entities.SearchTemplateTree.prototype.Root = function() {
};
vlv.rsi.entities.SearchTemplateTree.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.SearchTemplateTree;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.SearchTemplateTreeNode = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Index"] = 0;
  this._foreignProperties = {"Children":{"type":vlv.rsi.entities.SearchTemplateTreeNode, "isArray":true}, "Flattened":{"type":vlv.rsi.entities.SearchTemplateTreeNode, "isArray":true}, "Templates":{"type":vlv.rsi.entities.SearchTemplate, "isArray":true}}
};
vlv.rsi.entities.SearchTemplateTreeNode.prototype = new vlv.entityBase;
vlv.rsi.entities.SearchTemplateTreeNode.constructor = vlv.rsi.entities.SearchTemplateTreeNode;
vlv.rsi.entities.SearchTemplateTreeNode.prototype._foreignProperties = {};
vlv.rsi.entities.SearchTemplateTreeNode.prototype.Id;
vlv.rsi.entities.SearchTemplateTreeNode.prototype.Title;
vlv.rsi.entities.SearchTemplateTreeNode.prototype.Index;
vlv.rsi.entities.SearchTemplateTreeNode.prototype.Children = function() {
};
vlv.rsi.entities.SearchTemplateTreeNode.prototype.Flattened = function() {
};
vlv.rsi.entities.SearchTemplateTreeNode.prototype.Templates = function() {
};
vlv.rsi.entities.SearchTemplateTreeNode.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.SearchTemplateTreeNode;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.ServiceRequest = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Url"] = "";
  this["Method"] = "";
  this["StartTime"] = null;
  this["StopTime"] = null;
  this["OverallTime"] = 0;
  this["StatusCode"] = "";
  this["Metadata"] = "";
  this["Exception"] = "";
  this["Comment"] = "";
  this._foreignProperties = {"OsaRequests":{"type":vlv.rsi.entities.OsaRequest, "isArray":true}}
};
vlv.rsi.entities.ServiceRequest.prototype = new vlv.entityBase;
vlv.rsi.entities.ServiceRequest.constructor = vlv.rsi.entities.ServiceRequest;
vlv.rsi.entities.ServiceRequest.prototype._foreignProperties = {};
vlv.rsi.entities.ServiceRequest.prototype.Id;
vlv.rsi.entities.ServiceRequest.prototype.Url;
vlv.rsi.entities.ServiceRequest.prototype.Method;
vlv.rsi.entities.ServiceRequest.prototype.StartTime;
vlv.rsi.entities.ServiceRequest.prototype.StopTime;
vlv.rsi.entities.ServiceRequest.prototype.OverallTime;
vlv.rsi.entities.ServiceRequest.prototype.StatusCode;
vlv.rsi.entities.ServiceRequest.prototype.Metadata;
vlv.rsi.entities.ServiceRequest.prototype.Exception;
vlv.rsi.entities.ServiceRequest.prototype.Comment;
vlv.rsi.entities.ServiceRequest.prototype.OsaRequests = function() {
};
vlv.rsi.entities.ServiceRequest.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.ServiceRequest;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.SharingGroup = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Name"] = "";
  this["AccessLevel"] = "";
  this["Expiration"] = null;
  this._foreignProperties = {"Users":{"type":vlv.rsi.entities.SharingUser, "isArray":true}}
};
vlv.rsi.entities.SharingGroup.prototype = new vlv.entityBase;
vlv.rsi.entities.SharingGroup.constructor = vlv.rsi.entities.SharingGroup;
vlv.rsi.entities.SharingGroup.prototype._foreignProperties = {};
vlv.rsi.entities.SharingGroup.prototype.Id;
vlv.rsi.entities.SharingGroup.prototype.Name;
vlv.rsi.entities.SharingGroup.prototype.Users = function() {
};
vlv.rsi.entities.SharingGroup.prototype.AccessLevel;
vlv.rsi.entities.SharingGroup.prototype.Expiration;
vlv.rsi.entities.SharingGroup.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.SharingGroup;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.SharingUser = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Email"] = "";
  this["FirstName"] = "";
  this["LastName"] = "";
  this["Status"] = "";
  this["Username"] = "";
  this["AccessLevel"] = "";
  this["Expiration"] = null
};
vlv.rsi.entities.SharingUser.prototype = new vlv.entityBase;
vlv.rsi.entities.SharingUser.constructor = vlv.rsi.entities.SharingUser;
vlv.rsi.entities.SharingUser.prototype._foreignProperties = {};
vlv.rsi.entities.SharingUser.prototype.Id;
vlv.rsi.entities.SharingUser.prototype.Email;
vlv.rsi.entities.SharingUser.prototype.FirstName;
vlv.rsi.entities.SharingUser.prototype.LastName;
vlv.rsi.entities.SharingUser.prototype.Status;
vlv.rsi.entities.SharingUser.prototype.Username;
vlv.rsi.entities.SharingUser.prototype.AccessLevel;
vlv.rsi.entities.SharingUser.prototype.Expiration;
vlv.rsi.entities.SharingUser.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.SharingUser;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.Term = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Index"] = 0;
  this._foreignProperties = {"RelatedTerms":{"type":vlv.rsi.entities.Term, "isArray":true}, "ThesaurusTerms":{"type":vlv.rsi.entities.Term, "isArray":true}}
};
vlv.rsi.entities.Term.prototype = new vlv.entityBase;
vlv.rsi.entities.Term.constructor = vlv.rsi.entities.Term;
vlv.rsi.entities.Term.prototype._foreignProperties = {};
vlv.rsi.entities.Term.prototype.Id;
vlv.rsi.entities.Term.prototype.Index;
vlv.rsi.entities.Term.prototype.RelatedTerms = function() {
};
vlv.rsi.entities.Term.prototype.ThesaurusTerms = function() {
};
vlv.rsi.entities.Term.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.Term;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.ToolRoute = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["ToolLink"] = "";
  this["RouterId"] = "";
  this["Url"] = "";
  this._foreignProperties = {"Router":{"type":vlv.rsi.entities.Router, "isArray":false}}
};
vlv.rsi.entities.ToolRoute.prototype = new vlv.entityBase;
vlv.rsi.entities.ToolRoute.constructor = vlv.rsi.entities.ToolRoute;
vlv.rsi.entities.ToolRoute.prototype._foreignProperties = {};
vlv.rsi.entities.ToolRoute.prototype.Id;
vlv.rsi.entities.ToolRoute.prototype.ToolLink;
vlv.rsi.entities.ToolRoute.prototype.RouterId;
vlv.rsi.entities.ToolRoute.prototype.Url;
vlv.rsi.entities.ToolRoute.prototype.Router = function() {
};
vlv.rsi.entities.ToolRoute.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.ToolRoute;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.Topic = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Updated"] = null;
  this["IsTrending"] = false;
  this["Description"] = "";
  this["PrimaryKeyword"] = "";
  this["SecondaryKeyword"] = "";
  this["MetaDescription"] = "";
  this._foreignProperties = {"Sections":{"type":vlv.rsi.entities.TopicSection, "isArray":true}}
};
vlv.rsi.entities.Topic.prototype = new vlv.entityBase;
vlv.rsi.entities.Topic.constructor = vlv.rsi.entities.Topic;
vlv.rsi.entities.Topic.prototype._foreignProperties = {};
vlv.rsi.entities.Topic.prototype.Id;
vlv.rsi.entities.Topic.prototype.Title;
vlv.rsi.entities.Topic.prototype.Updated;
vlv.rsi.entities.Topic.prototype.IsTrending;
vlv.rsi.entities.Topic.prototype.Description;
vlv.rsi.entities.Topic.prototype.PrimaryKeyword;
vlv.rsi.entities.Topic.prototype.SecondaryKeyword;
vlv.rsi.entities.Topic.prototype.MetaDescription;
vlv.rsi.entities.Topic.prototype.Sections = function() {
};
vlv.rsi.entities.Topic.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.Topic;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.TopicInfo = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Summary"] = "";
  this["Published"] = null;
  this["Updated"] = null;
  this["Author"] = ""
};
vlv.rsi.entities.TopicInfo.prototype = new vlv.entityBase;
vlv.rsi.entities.TopicInfo.constructor = vlv.rsi.entities.TopicInfo;
vlv.rsi.entities.TopicInfo.prototype._foreignProperties = {};
vlv.rsi.entities.TopicInfo.prototype.Id;
vlv.rsi.entities.TopicInfo.prototype.Title;
vlv.rsi.entities.TopicInfo.prototype.Summary;
vlv.rsi.entities.TopicInfo.prototype.Published;
vlv.rsi.entities.TopicInfo.prototype.Updated;
vlv.rsi.entities.TopicInfo.prototype.Author;
vlv.rsi.entities.TopicInfo.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.TopicInfo;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.TopicSection = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["TopicId"] = "";
  this["Title"] = "";
  this._foreignProperties = {"SubSections":{"type":vlv.rsi.entities.TopicSubSection, "isArray":true}}
};
vlv.rsi.entities.TopicSection.prototype = new vlv.entityBase;
vlv.rsi.entities.TopicSection.constructor = vlv.rsi.entities.TopicSection;
vlv.rsi.entities.TopicSection.prototype._foreignProperties = {};
vlv.rsi.entities.TopicSection.prototype.Id;
vlv.rsi.entities.TopicSection.prototype.TopicId;
vlv.rsi.entities.TopicSection.prototype.Title;
vlv.rsi.entities.TopicSection.prototype.SubSections = function() {
};
vlv.rsi.entities.TopicSection.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.TopicSection;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.TopicSubSection = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["SectionId"] = "";
  this["PathDocId"] = "";
  this._foreignProperties = {"Documents":{"type":vlv.rsi.entities.Document, "isArray":true}, "DocumentLites":{"type":vlv.rsi.entities.DocumentLite, "isArray":true}, "Path":{"type":vlv.rsi.entities.ContentTreeNode, "isArray":true}}
};
vlv.rsi.entities.TopicSubSection.prototype = new vlv.entityBase;
vlv.rsi.entities.TopicSubSection.constructor = vlv.rsi.entities.TopicSubSection;
vlv.rsi.entities.TopicSubSection.prototype._foreignProperties = {};
vlv.rsi.entities.TopicSubSection.prototype.Id;
vlv.rsi.entities.TopicSubSection.prototype.Title;
vlv.rsi.entities.TopicSubSection.prototype.SectionId;
vlv.rsi.entities.TopicSubSection.prototype.PathDocId;
vlv.rsi.entities.TopicSubSection.prototype.Documents = function() {
};
vlv.rsi.entities.TopicSubSection.prototype.DocumentLites = function() {
};
vlv.rsi.entities.TopicSubSection.prototype.Path = function() {
};
vlv.rsi.entities.TopicSubSection.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.TopicSubSection;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.Tracker = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["GroupTitle"] = "";
  this._foreignProperties = {"Topics":{"type":vlv.rsi.entities.TrackerTopic, "isArray":true}}
};
vlv.rsi.entities.Tracker.prototype = new vlv.entityBase;
vlv.rsi.entities.Tracker.constructor = vlv.rsi.entities.Tracker;
vlv.rsi.entities.Tracker.prototype._foreignProperties = {};
vlv.rsi.entities.Tracker.prototype.Id;
vlv.rsi.entities.Tracker.prototype.Title;
vlv.rsi.entities.Tracker.prototype.GroupTitle;
vlv.rsi.entities.Tracker.prototype.Topics = function() {
};
vlv.rsi.entities.Tracker.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.Tracker;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.TrackerTopic = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["TopicSetTitle"] = ""
};
vlv.rsi.entities.TrackerTopic.prototype = new vlv.entityBase;
vlv.rsi.entities.TrackerTopic.constructor = vlv.rsi.entities.TrackerTopic;
vlv.rsi.entities.TrackerTopic.prototype._foreignProperties = {};
vlv.rsi.entities.TrackerTopic.prototype.Id;
vlv.rsi.entities.TrackerTopic.prototype.Title;
vlv.rsi.entities.TrackerTopic.prototype.TopicSetTitle;
vlv.rsi.entities.TrackerTopic.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.TrackerTopic;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.UserConfiguration = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Name"] = "";
  this["Value"] = "";
  this._foreignProperties = {"Options":{"type":vlv.rsi.entities.OptionKeyValue, "isArray":true}}
};
vlv.rsi.entities.UserConfiguration.prototype = new vlv.entityBase;
vlv.rsi.entities.UserConfiguration.constructor = vlv.rsi.entities.UserConfiguration;
vlv.rsi.entities.UserConfiguration.prototype._foreignProperties = {};
vlv.rsi.entities.UserConfiguration.prototype.Id;
vlv.rsi.entities.UserConfiguration.prototype.Name;
vlv.rsi.entities.UserConfiguration.prototype.Value;
vlv.rsi.entities.UserConfiguration.prototype.Options = function() {
};
vlv.rsi.entities.UserConfiguration.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.UserConfiguration;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.UserTracker = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["TodayNewsCount"] = 0;
  this["TrackerId"] = "";
  this["HasAllContent"] = false;
  this._foreignProperties = {"TodayNews":{"type":vlv.rsi.entities.News, "isArray":true}, "News":{"type":vlv.rsi.entities.News, "isArray":true}, "Topics":{"type":vlv.rsi.entities.TrackerTopic, "isArray":true}, "Selection":{"type":vlv.rsi.entities.UserTrackerTopicSelection, "isArray":true}, "Options":{"type":vlv.rsi.entities.UserTrackerOptions, "isArray":false}, "Routes":{"type":vlv.rsi.entities.UserTrackerRoute, "isArray":true}}
};
vlv.rsi.entities.UserTracker.prototype = new vlv.entityBase;
vlv.rsi.entities.UserTracker.constructor = vlv.rsi.entities.UserTracker;
vlv.rsi.entities.UserTracker.prototype._foreignProperties = {};
vlv.rsi.entities.UserTracker.prototype.Id;
vlv.rsi.entities.UserTracker.prototype.Title;
vlv.rsi.entities.UserTracker.prototype.TodayNewsCount;
vlv.rsi.entities.UserTracker.prototype.TrackerId;
vlv.rsi.entities.UserTracker.prototype.TodayNews = function() {
};
vlv.rsi.entities.UserTracker.prototype.News = function() {
};
vlv.rsi.entities.UserTracker.prototype.Topics = function() {
};
vlv.rsi.entities.UserTracker.prototype.Selection = function() {
};
vlv.rsi.entities.UserTracker.prototype.Options = function() {
};
vlv.rsi.entities.UserTracker.prototype.Routes = function() {
};
vlv.rsi.entities.UserTracker.prototype.HasAllContent;
vlv.rsi.entities.UserTracker.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.UserTracker;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.UserTrackerOptions = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["SearchTerm"] = "";
  this["ThesaurusOn"] = false;
  this["Title"] = ""
};
vlv.rsi.entities.UserTrackerOptions.prototype = new vlv.entityBase;
vlv.rsi.entities.UserTrackerOptions.constructor = vlv.rsi.entities.UserTrackerOptions;
vlv.rsi.entities.UserTrackerOptions.prototype._foreignProperties = {};
vlv.rsi.entities.UserTrackerOptions.prototype.Id;
vlv.rsi.entities.UserTrackerOptions.prototype.SearchTerm;
vlv.rsi.entities.UserTrackerOptions.prototype.ThesaurusOn;
vlv.rsi.entities.UserTrackerOptions.prototype.Title;
vlv.rsi.entities.UserTrackerOptions.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.UserTrackerOptions;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.UserTrackerRoute = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["UserTrackerId"] = "";
  this["RouterId"] = "";
  this["Url"] = "";
  this._foreignProperties = {"UserTracker":{"type":vlv.rsi.entities.UserTracker, "isArray":false}, "Router":{"type":vlv.rsi.entities.Router, "isArray":false}}
};
vlv.rsi.entities.UserTrackerRoute.prototype = new vlv.entityBase;
vlv.rsi.entities.UserTrackerRoute.constructor = vlv.rsi.entities.UserTrackerRoute;
vlv.rsi.entities.UserTrackerRoute.prototype._foreignProperties = {};
vlv.rsi.entities.UserTrackerRoute.prototype.Id;
vlv.rsi.entities.UserTrackerRoute.prototype.UserTrackerId;
vlv.rsi.entities.UserTrackerRoute.prototype.RouterId;
vlv.rsi.entities.UserTrackerRoute.prototype.Url;
vlv.rsi.entities.UserTrackerRoute.prototype.UserTracker = function() {
};
vlv.rsi.entities.UserTrackerRoute.prototype.Router = function() {
};
vlv.rsi.entities.UserTrackerRoute.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.UserTrackerRoute;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.UserTrackerTopicSelection = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Selected"] = false;
  this._foreignProperties = {"Topic":{"type":vlv.rsi.entities.TrackerTopic, "isArray":false}}
};
vlv.rsi.entities.UserTrackerTopicSelection.prototype = new vlv.entityBase;
vlv.rsi.entities.UserTrackerTopicSelection.constructor = vlv.rsi.entities.UserTrackerTopicSelection;
vlv.rsi.entities.UserTrackerTopicSelection.prototype._foreignProperties = {};
vlv.rsi.entities.UserTrackerTopicSelection.prototype.Id;
vlv.rsi.entities.UserTrackerTopicSelection.prototype.Selected;
vlv.rsi.entities.UserTrackerTopicSelection.prototype.Topic = function() {
};
vlv.rsi.entities.UserTrackerTopicSelection.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.UserTrackerTopicSelection;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.WordWheel = function() {
  vlv.entityBase.call(this);
  this["Id"] = ""
};
vlv.rsi.entities.WordWheel.prototype = new vlv.entityBase;
vlv.rsi.entities.WordWheel.constructor = vlv.rsi.entities.WordWheel;
vlv.rsi.entities.WordWheel.prototype._foreignProperties = {};
vlv.rsi.entities.WordWheel.prototype.Id;
vlv.rsi.entities.WordWheel.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.WordWheel;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entities.Workspace = function() {
  vlv.entityBase.call(this);
  this["Id"] = "";
  this["Title"] = "";
  this["Order"] = 0;
  this["IsActive"] = false;
  this["Type"] = "";
  this["IsUserModifiable"] = false;
  this._foreignProperties = {"ContentNodes":{"type":vlv.rsi.entities.ContentTreeNode, "isArray":true}}
};
vlv.rsi.entities.Workspace.prototype = new vlv.entityBase;
vlv.rsi.entities.Workspace.constructor = vlv.rsi.entities.Workspace;
vlv.rsi.entities.Workspace.prototype._foreignProperties = {};
vlv.rsi.entities.Workspace.prototype.Id;
vlv.rsi.entities.Workspace.prototype.Title;
vlv.rsi.entities.Workspace.prototype.Order;
vlv.rsi.entities.Workspace.prototype.IsActive;
vlv.rsi.entities.Workspace.prototype.Type;
vlv.rsi.entities.Workspace.prototype.IsUserModifiable;
vlv.rsi.entities.Workspace.prototype.ContentNodes = function() {
};
vlv.rsi.entities.Workspace.fromJson = function($http, jsonItem) {
  var entity = new vlv.rsi.entities.Workspace;
  entity.populate(entity, $http, jsonItem);
  return entity
};
vlv.rsi.entitySets.AlertConfigurations = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "AlertConfigurations";
  this.$http = $http
};
vlv.rsi.entitySets.AlertConfigurations.prototype = new vlv.svcbase;
vlv.rsi.entitySets.AlertConfigurations.prototype.constructor = vlv.rsi.entitySets.AlertConfigurations;
vlv.rsi.entitySets.AlertConfigurations.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.AlertConfigurations.prototype.path;
vlv.rsi.entitySets.AlertConfigurations.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.AlertConfigurations.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.AlertConfigurations["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiAlertConfigurations", vlv.rsi.entitySets.AlertConfigurations);
vlv.rsi.entitySets.AlertProfiles = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "AlertProfiles";
  this.$http = $http
};
vlv.rsi.entitySets.AlertProfiles.prototype = new vlv.svcbase;
vlv.rsi.entitySets.AlertProfiles.prototype.constructor = vlv.rsi.entitySets.AlertProfiles;
vlv.rsi.entitySets.AlertProfiles.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.AlertProfiles.prototype.path;
vlv.rsi.entitySets.AlertProfiles.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.AlertProfiles.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.AlertProfiles["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiAlertProfiles", vlv.rsi.entitySets.AlertProfiles);
vlv.rsi.entitySets.Alerts = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "Alerts";
  this.$http = $http
};
vlv.rsi.entitySets.Alerts.prototype = new vlv.svcbase;
vlv.rsi.entitySets.Alerts.prototype.constructor = vlv.rsi.entitySets.Alerts;
vlv.rsi.entitySets.Alerts.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.Alerts.prototype.path;
vlv.rsi.entitySets.Alerts.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Alerts.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Alerts["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiAlerts", vlv.rsi.entitySets.Alerts);
vlv.rsi.entitySets.AlertSearchMetadatas = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "AlertSearchMetadatas";
  this.$http = $http
};
vlv.rsi.entitySets.AlertSearchMetadatas.prototype = new vlv.svcbase;
vlv.rsi.entitySets.AlertSearchMetadatas.prototype.constructor = vlv.rsi.entitySets.AlertSearchMetadatas;
vlv.rsi.entitySets.AlertSearchMetadatas.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.AlertSearchMetadatas.prototype.path;
vlv.rsi.entitySets.AlertSearchMetadatas.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.AlertSearchMetadatas.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.AlertSearchMetadatas["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiAlertSearchMetadatas", vlv.rsi.entitySets.AlertSearchMetadatas);
vlv.rsi.entitySets.ClusterSearchResultListItems = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ClusterSearchResultListItems";
  this.$http = $http
};
vlv.rsi.entitySets.ClusterSearchResultListItems.prototype = new vlv.svcbase;
vlv.rsi.entitySets.ClusterSearchResultListItems.prototype.constructor = vlv.rsi.entitySets.ClusterSearchResultListItems;
vlv.rsi.entitySets.ClusterSearchResultListItems.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.ClusterSearchResultListItems.prototype.path;
vlv.rsi.entitySets.ClusterSearchResultListItems.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ClusterSearchResultListItems.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ClusterSearchResultListItems["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiClusterSearchResultListItems", vlv.rsi.entitySets.ClusterSearchResultListItems);
vlv.rsi.entitySets.ClusterSearchResultLists = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ClusterSearchResultLists";
  this.$http = $http
};
vlv.rsi.entitySets.ClusterSearchResultLists.prototype = new vlv.svcbase;
vlv.rsi.entitySets.ClusterSearchResultLists.prototype.constructor = vlv.rsi.entitySets.ClusterSearchResultLists;
vlv.rsi.entitySets.ClusterSearchResultLists.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.ClusterSearchResultLists.prototype.path;
vlv.rsi.entitySets.ClusterSearchResultLists.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ClusterSearchResultLists.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ClusterSearchResultLists["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiClusterSearchResultLists", vlv.rsi.entitySets.ClusterSearchResultLists);
vlv.rsi.entitySets.ContentChannels = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ContentChannels";
  this.$http = $http
};
vlv.rsi.entitySets.ContentChannels.prototype = new vlv.svcbase;
vlv.rsi.entitySets.ContentChannels.prototype.constructor = vlv.rsi.entitySets.ContentChannels;
vlv.rsi.entitySets.ContentChannels.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.ContentChannels.prototype.path;
vlv.rsi.entitySets.ContentChannels.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ContentChannels.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ContentChannels["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiContentChannels", vlv.rsi.entitySets.ContentChannels);
vlv.rsi.entitySets.ContentModuleAuthorizations = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ContentModuleAuthorizations";
  this.$http = $http
};
vlv.rsi.entitySets.ContentModuleAuthorizations.prototype = new vlv.svcbase;
vlv.rsi.entitySets.ContentModuleAuthorizations.prototype.constructor = vlv.rsi.entitySets.ContentModuleAuthorizations;
vlv.rsi.entitySets.ContentModuleAuthorizations.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.ContentModuleAuthorizations.prototype.path;
vlv.rsi.entitySets.ContentModuleAuthorizations.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ContentModuleAuthorizations.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ContentModuleAuthorizations["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiContentModuleAuthorizations", vlv.rsi.entitySets.ContentModuleAuthorizations);
vlv.rsi.entitySets.ContentModules = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ContentModules";
  this.$http = $http
};
vlv.rsi.entitySets.ContentModules.prototype = new vlv.svcbase;
vlv.rsi.entitySets.ContentModules.prototype.constructor = vlv.rsi.entitySets.ContentModules;
vlv.rsi.entitySets.ContentModules.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.ContentModules.prototype.path;
vlv.rsi.entitySets.ContentModules.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ContentModules.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ContentModules["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiContentModules", vlv.rsi.entitySets.ContentModules);
vlv.rsi.entitySets.ContentTableItems = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ContentTableItems";
  this.$http = $http
};
vlv.rsi.entitySets.ContentTableItems.prototype = new vlv.svcbase;
vlv.rsi.entitySets.ContentTableItems.prototype.constructor = vlv.rsi.entitySets.ContentTableItems;
vlv.rsi.entitySets.ContentTableItems.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.ContentTableItems.prototype.path;
vlv.rsi.entitySets.ContentTableItems.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ContentTableItems.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ContentTableItems["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiContentTableItems", vlv.rsi.entitySets.ContentTableItems);
vlv.rsi.entitySets.ContentTables = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ContentTables";
  this.$http = $http
};
vlv.rsi.entitySets.ContentTables.prototype = new vlv.svcbase;
vlv.rsi.entitySets.ContentTables.prototype.constructor = vlv.rsi.entitySets.ContentTables;
vlv.rsi.entitySets.ContentTables.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.ContentTables.prototype.path;
vlv.rsi.entitySets.ContentTables.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ContentTables.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ContentTables["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiContentTables", vlv.rsi.entitySets.ContentTables);
vlv.rsi.entitySets.ContentTreeNodeAuthorizations = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ContentTreeNodeAuthorizations";
  this.$http = $http
};
vlv.rsi.entitySets.ContentTreeNodeAuthorizations.prototype = new vlv.svcbase;
vlv.rsi.entitySets.ContentTreeNodeAuthorizations.prototype.constructor = vlv.rsi.entitySets.ContentTreeNodeAuthorizations;
vlv.rsi.entitySets.ContentTreeNodeAuthorizations.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.ContentTreeNodeAuthorizations.prototype.path;
vlv.rsi.entitySets.ContentTreeNodeAuthorizations.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ContentTreeNodeAuthorizations.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ContentTreeNodeAuthorizations["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiContentTreeNodeAuthorizations", vlv.rsi.entitySets.ContentTreeNodeAuthorizations);
vlv.rsi.entitySets.ContentTreeNodeRoutes = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ContentTreeNodeRoutes";
  this.$http = $http
};
vlv.rsi.entitySets.ContentTreeNodeRoutes.prototype = new vlv.svcbase;
vlv.rsi.entitySets.ContentTreeNodeRoutes.prototype.constructor = vlv.rsi.entitySets.ContentTreeNodeRoutes;
vlv.rsi.entitySets.ContentTreeNodeRoutes.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.ContentTreeNodeRoutes.prototype.path;
vlv.rsi.entitySets.ContentTreeNodeRoutes.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ContentTreeNodeRoutes.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ContentTreeNodeRoutes["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiContentTreeNodeRoutes", vlv.rsi.entitySets.ContentTreeNodeRoutes);
vlv.rsi.entitySets.ContentTreeNodes = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ContentTreeNodes";
  this.$http = $http
};
vlv.rsi.entitySets.ContentTreeNodes.prototype = new vlv.svcbase;
vlv.rsi.entitySets.ContentTreeNodes.prototype.constructor = vlv.rsi.entitySets.ContentTreeNodes;
vlv.rsi.entitySets.ContentTreeNodes.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.ContentTreeNodes.prototype.path;
vlv.rsi.entitySets.ContentTreeNodes.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ContentTreeNodes.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ContentTreeNodes["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiContentTreeNodes", vlv.rsi.entitySets.ContentTreeNodes);
vlv.rsi.entitySets.ContentTrees = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ContentTrees";
  this.$http = $http
};
vlv.rsi.entitySets.ContentTrees.prototype = new vlv.svcbase;
vlv.rsi.entitySets.ContentTrees.prototype.constructor = vlv.rsi.entitySets.ContentTrees;
vlv.rsi.entitySets.ContentTrees.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.ContentTrees.prototype.path;
vlv.rsi.entitySets.ContentTrees.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ContentTrees.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ContentTrees["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiContentTrees", vlv.rsi.entitySets.ContentTrees);
vlv.rsi.entitySets.CustomBrowseInfos = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "CustomBrowseInfos";
  this.$http = $http
};
vlv.rsi.entitySets.CustomBrowseInfos.prototype = new vlv.svcbase;
vlv.rsi.entitySets.CustomBrowseInfos.prototype.constructor = vlv.rsi.entitySets.CustomBrowseInfos;
vlv.rsi.entitySets.CustomBrowseInfos.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.CustomBrowseInfos.prototype.path;
vlv.rsi.entitySets.CustomBrowseInfos.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.CustomBrowseInfos.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.CustomBrowseInfos["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiCustomBrowseInfos", vlv.rsi.entitySets.CustomBrowseInfos);
vlv.rsi.entitySets.CustomBrowses = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "CustomBrowses";
  this.$http = $http
};
vlv.rsi.entitySets.CustomBrowses.prototype = new vlv.svcbase;
vlv.rsi.entitySets.CustomBrowses.prototype.constructor = vlv.rsi.entitySets.CustomBrowses;
vlv.rsi.entitySets.CustomBrowses.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.CustomBrowses.prototype.path;
vlv.rsi.entitySets.CustomBrowses.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.CustomBrowses.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.CustomBrowses["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiCustomBrowses", vlv.rsi.entitySets.CustomBrowses);
vlv.rsi.entitySets.CustomBrowseSections = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "CustomBrowseSections";
  this.$http = $http
};
vlv.rsi.entitySets.CustomBrowseSections.prototype = new vlv.svcbase;
vlv.rsi.entitySets.CustomBrowseSections.prototype.constructor = vlv.rsi.entitySets.CustomBrowseSections;
vlv.rsi.entitySets.CustomBrowseSections.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.CustomBrowseSections.prototype.path;
vlv.rsi.entitySets.CustomBrowseSections.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.CustomBrowseSections.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.CustomBrowseSections["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiCustomBrowseSections", vlv.rsi.entitySets.CustomBrowseSections);
vlv.rsi.entitySets.CustomBrowseStreams = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "CustomBrowseStreams";
  this.$http = $http
};
vlv.rsi.entitySets.CustomBrowseStreams.prototype = new vlv.svcbase;
vlv.rsi.entitySets.CustomBrowseStreams.prototype.constructor = vlv.rsi.entitySets.CustomBrowseStreams;
vlv.rsi.entitySets.CustomBrowseStreams.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.CustomBrowseStreams.prototype.path;
vlv.rsi.entitySets.CustomBrowseStreams.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.CustomBrowseStreams.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.CustomBrowseStreams["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiCustomBrowseStreams", vlv.rsi.entitySets.CustomBrowseStreams);
vlv.rsi.entitySets.DocumentAnnotations = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "DocumentAnnotations";
  this.$http = $http
};
vlv.rsi.entitySets.DocumentAnnotations.prototype = new vlv.svcbase;
vlv.rsi.entitySets.DocumentAnnotations.prototype.constructor = vlv.rsi.entitySets.DocumentAnnotations;
vlv.rsi.entitySets.DocumentAnnotations.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.DocumentAnnotations.prototype.path;
vlv.rsi.entitySets.DocumentAnnotations.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentAnnotations.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentAnnotations["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiDocumentAnnotations", vlv.rsi.entitySets.DocumentAnnotations);
vlv.rsi.entitySets.DocumentAssemblyLinks = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "DocumentAssemblyLinks";
  this.$http = $http
};
vlv.rsi.entitySets.DocumentAssemblyLinks.prototype = new vlv.svcbase;
vlv.rsi.entitySets.DocumentAssemblyLinks.prototype.constructor = vlv.rsi.entitySets.DocumentAssemblyLinks;
vlv.rsi.entitySets.DocumentAssemblyLinks.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.DocumentAssemblyLinks.prototype.path;
vlv.rsi.entitySets.DocumentAssemblyLinks.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentAssemblyLinks.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentAssemblyLinks["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiDocumentAssemblyLinks", vlv.rsi.entitySets.DocumentAssemblyLinks);
vlv.rsi.entitySets.DocumentEmailFormats = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "DocumentEmailFormats";
  this.$http = $http
};
vlv.rsi.entitySets.DocumentEmailFormats.prototype = new vlv.svcbase;
vlv.rsi.entitySets.DocumentEmailFormats.prototype.constructor = vlv.rsi.entitySets.DocumentEmailFormats;
vlv.rsi.entitySets.DocumentEmailFormats.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.DocumentEmailFormats.prototype.path;
vlv.rsi.entitySets.DocumentEmailFormats.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentEmailFormats.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentEmailFormats["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiDocumentEmailFormats", vlv.rsi.entitySets.DocumentEmailFormats);
vlv.rsi.entitySets.DocumentEmails = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "DocumentEmails";
  this.$http = $http
};
vlv.rsi.entitySets.DocumentEmails.prototype = new vlv.svcbase;
vlv.rsi.entitySets.DocumentEmails.prototype.constructor = vlv.rsi.entitySets.DocumentEmails;
vlv.rsi.entitySets.DocumentEmails.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.DocumentEmails.prototype.path;
vlv.rsi.entitySets.DocumentEmails.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentEmails.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentEmails["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiDocumentEmails", vlv.rsi.entitySets.DocumentEmails);
vlv.rsi.entitySets.DocumentFileFormats = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "DocumentFileFormats";
  this.$http = $http
};
vlv.rsi.entitySets.DocumentFileFormats.prototype = new vlv.svcbase;
vlv.rsi.entitySets.DocumentFileFormats.prototype.constructor = vlv.rsi.entitySets.DocumentFileFormats;
vlv.rsi.entitySets.DocumentFileFormats.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.DocumentFileFormats.prototype.path;
vlv.rsi.entitySets.DocumentFileFormats.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentFileFormats.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentFileFormats["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiDocumentFileFormats", vlv.rsi.entitySets.DocumentFileFormats);
vlv.rsi.entitySets.DocumentHistory = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "DocumentHistory";
  this.$http = $http
};
vlv.rsi.entitySets.DocumentHistory.prototype = new vlv.svcbase;
vlv.rsi.entitySets.DocumentHistory.prototype.constructor = vlv.rsi.entitySets.DocumentHistory;
vlv.rsi.entitySets.DocumentHistory.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.DocumentHistory.prototype.path;
vlv.rsi.entitySets.DocumentHistory.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentHistory.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentHistory["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiDocumentHistory", vlv.rsi.entitySets.DocumentHistory);
vlv.rsi.entitySets.DocumentLites = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "DocumentLites";
  this.$http = $http
};
vlv.rsi.entitySets.DocumentLites.prototype = new vlv.svcbase;
vlv.rsi.entitySets.DocumentLites.prototype.constructor = vlv.rsi.entitySets.DocumentLites;
vlv.rsi.entitySets.DocumentLites.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.DocumentLites.prototype.path;
vlv.rsi.entitySets.DocumentLites.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentLites.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentLites["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiDocumentLites", vlv.rsi.entitySets.DocumentLites);
vlv.rsi.entitySets.DocumentMetadataItems = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "DocumentMetadataItems";
  this.$http = $http
};
vlv.rsi.entitySets.DocumentMetadataItems.prototype = new vlv.svcbase;
vlv.rsi.entitySets.DocumentMetadataItems.prototype.constructor = vlv.rsi.entitySets.DocumentMetadataItems;
vlv.rsi.entitySets.DocumentMetadataItems.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.DocumentMetadataItems.prototype.path;
vlv.rsi.entitySets.DocumentMetadataItems.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentMetadataItems.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentMetadataItems["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiDocumentMetadataItems", vlv.rsi.entitySets.DocumentMetadataItems);
vlv.rsi.entitySets.DocumentRelations = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "DocumentRelations";
  this.$http = $http
};
vlv.rsi.entitySets.DocumentRelations.prototype = new vlv.svcbase;
vlv.rsi.entitySets.DocumentRelations.prototype.constructor = vlv.rsi.entitySets.DocumentRelations;
vlv.rsi.entitySets.DocumentRelations.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.DocumentRelations.prototype.path;
vlv.rsi.entitySets.DocumentRelations.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentRelations.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentRelations["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiDocumentRelations", vlv.rsi.entitySets.DocumentRelations);
vlv.rsi.entitySets.DocumentRoutes = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "DocumentRoutes";
  this.$http = $http
};
vlv.rsi.entitySets.DocumentRoutes.prototype = new vlv.svcbase;
vlv.rsi.entitySets.DocumentRoutes.prototype.constructor = vlv.rsi.entitySets.DocumentRoutes;
vlv.rsi.entitySets.DocumentRoutes.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.DocumentRoutes.prototype.path;
vlv.rsi.entitySets.DocumentRoutes.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentRoutes.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentRoutes["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiDocumentRoutes", vlv.rsi.entitySets.DocumentRoutes);
vlv.rsi.entitySets.Documents = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "Documents";
  this.$http = $http
};
vlv.rsi.entitySets.Documents.prototype = new vlv.svcbase;
vlv.rsi.entitySets.Documents.prototype.constructor = vlv.rsi.entitySets.Documents;
vlv.rsi.entitySets.Documents.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.Documents.prototype.path;
vlv.rsi.entitySets.Documents.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Documents.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Documents["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiDocuments", vlv.rsi.entitySets.Documents);
vlv.rsi.entitySets.DocumentStreams = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "DocumentStreams";
  this.$http = $http
};
vlv.rsi.entitySets.DocumentStreams.prototype = new vlv.svcbase;
vlv.rsi.entitySets.DocumentStreams.prototype.constructor = vlv.rsi.entitySets.DocumentStreams;
vlv.rsi.entitySets.DocumentStreams.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.DocumentStreams.prototype.path;
vlv.rsi.entitySets.DocumentStreams.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentStreams.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentStreams["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiDocumentStreams", vlv.rsi.entitySets.DocumentStreams);
vlv.rsi.entitySets.DocumentVersions = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "DocumentVersions";
  this.$http = $http
};
vlv.rsi.entitySets.DocumentVersions.prototype = new vlv.svcbase;
vlv.rsi.entitySets.DocumentVersions.prototype.constructor = vlv.rsi.entitySets.DocumentVersions;
vlv.rsi.entitySets.DocumentVersions.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.DocumentVersions.prototype.path;
vlv.rsi.entitySets.DocumentVersions.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentVersions.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.DocumentVersions["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiDocumentVersions", vlv.rsi.entitySets.DocumentVersions);
vlv.rsi.entitySets.FavoriteItems = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "FavoriteItems";
  this.$http = $http
};
vlv.rsi.entitySets.FavoriteItems.prototype = new vlv.svcbase;
vlv.rsi.entitySets.FavoriteItems.prototype.constructor = vlv.rsi.entitySets.FavoriteItems;
vlv.rsi.entitySets.FavoriteItems.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.FavoriteItems.prototype.path;
vlv.rsi.entitySets.FavoriteItems.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.FavoriteItems.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.FavoriteItems["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiFavoriteItems", vlv.rsi.entitySets.FavoriteItems);
vlv.rsi.entitySets.FilterTreeNodes = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "FilterTreeNodes";
  this.$http = $http
};
vlv.rsi.entitySets.FilterTreeNodes.prototype = new vlv.svcbase;
vlv.rsi.entitySets.FilterTreeNodes.prototype.constructor = vlv.rsi.entitySets.FilterTreeNodes;
vlv.rsi.entitySets.FilterTreeNodes.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.FilterTreeNodes.prototype.path;
vlv.rsi.entitySets.FilterTreeNodes.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.FilterTreeNodes.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.FilterTreeNodes["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiFilterTreeNodes", vlv.rsi.entitySets.FilterTreeNodes);
vlv.rsi.entitySets.FilterTrees = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "FilterTrees";
  this.$http = $http
};
vlv.rsi.entitySets.FilterTrees.prototype = new vlv.svcbase;
vlv.rsi.entitySets.FilterTrees.prototype.constructor = vlv.rsi.entitySets.FilterTrees;
vlv.rsi.entitySets.FilterTrees.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.FilterTrees.prototype.path;
vlv.rsi.entitySets.FilterTrees.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.FilterTrees.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.FilterTrees["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiFilterTrees", vlv.rsi.entitySets.FilterTrees);
vlv.rsi.entitySets.FolderDocumentItems = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "FolderDocumentItems";
  this.$http = $http
};
vlv.rsi.entitySets.FolderDocumentItems.prototype = new vlv.svcbase;
vlv.rsi.entitySets.FolderDocumentItems.prototype.constructor = vlv.rsi.entitySets.FolderDocumentItems;
vlv.rsi.entitySets.FolderDocumentItems.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.FolderDocumentItems.prototype.path;
vlv.rsi.entitySets.FolderDocumentItems.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.FolderDocumentItems.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.FolderDocumentItems["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiFolderDocumentItems", vlv.rsi.entitySets.FolderDocumentItems);
vlv.rsi.entitySets.FolderItems = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "FolderItems";
  this.$http = $http
};
vlv.rsi.entitySets.FolderItems.prototype = new vlv.svcbase;
vlv.rsi.entitySets.FolderItems.prototype.constructor = vlv.rsi.entitySets.FolderItems;
vlv.rsi.entitySets.FolderItems.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.FolderItems.prototype.path;
vlv.rsi.entitySets.FolderItems.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.FolderItems.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.FolderItems["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiFolderItems", vlv.rsi.entitySets.FolderItems);
vlv.rsi.entitySets.FolderRoutes = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "FolderRoutes";
  this.$http = $http
};
vlv.rsi.entitySets.FolderRoutes.prototype = new vlv.svcbase;
vlv.rsi.entitySets.FolderRoutes.prototype.constructor = vlv.rsi.entitySets.FolderRoutes;
vlv.rsi.entitySets.FolderRoutes.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.FolderRoutes.prototype.path;
vlv.rsi.entitySets.FolderRoutes.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.FolderRoutes.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.FolderRoutes["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiFolderRoutes", vlv.rsi.entitySets.FolderRoutes);
vlv.rsi.entitySets.Folders = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "Folders";
  this.$http = $http
};
vlv.rsi.entitySets.Folders.prototype = new vlv.svcbase;
vlv.rsi.entitySets.Folders.prototype.constructor = vlv.rsi.entitySets.Folders;
vlv.rsi.entitySets.Folders.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.Folders.prototype.path;
vlv.rsi.entitySets.Folders.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Folders.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Folders["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiFolders", vlv.rsi.entitySets.Folders);
vlv.rsi.entitySets.HistoryItems = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "HistoryItems";
  this.$http = $http
};
vlv.rsi.entitySets.HistoryItems.prototype = new vlv.svcbase;
vlv.rsi.entitySets.HistoryItems.prototype.constructor = vlv.rsi.entitySets.HistoryItems;
vlv.rsi.entitySets.HistoryItems.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.HistoryItems.prototype.path;
vlv.rsi.entitySets.HistoryItems.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.HistoryItems.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.HistoryItems["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiHistoryItems", vlv.rsi.entitySets.HistoryItems);
vlv.rsi.entitySets.News = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "News";
  this.$http = $http
};
vlv.rsi.entitySets.News.prototype = new vlv.svcbase;
vlv.rsi.entitySets.News.prototype.constructor = vlv.rsi.entitySets.News;
vlv.rsi.entitySets.News.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.News.prototype.path;
vlv.rsi.entitySets.News.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.News.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.News["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiNews", vlv.rsi.entitySets.News);
vlv.rsi.entitySets.NewsRoutes = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "NewsRoutes";
  this.$http = $http
};
vlv.rsi.entitySets.NewsRoutes.prototype = new vlv.svcbase;
vlv.rsi.entitySets.NewsRoutes.prototype.constructor = vlv.rsi.entitySets.NewsRoutes;
vlv.rsi.entitySets.NewsRoutes.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.NewsRoutes.prototype.path;
vlv.rsi.entitySets.NewsRoutes.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.NewsRoutes.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.NewsRoutes["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiNewsRoutes", vlv.rsi.entitySets.NewsRoutes);
vlv.rsi.entitySets.OptionKeyValues = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "OptionKeyValues";
  this.$http = $http
};
vlv.rsi.entitySets.OptionKeyValues.prototype = new vlv.svcbase;
vlv.rsi.entitySets.OptionKeyValues.prototype.constructor = vlv.rsi.entitySets.OptionKeyValues;
vlv.rsi.entitySets.OptionKeyValues.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.OptionKeyValues.prototype.path;
vlv.rsi.entitySets.OptionKeyValues.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.OptionKeyValues.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.OptionKeyValues["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiOptionKeyValues", vlv.rsi.entitySets.OptionKeyValues);
vlv.rsi.entitySets.OsaRequests = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "OsaRequests";
  this.$http = $http
};
vlv.rsi.entitySets.OsaRequests.prototype = new vlv.svcbase;
vlv.rsi.entitySets.OsaRequests.prototype.constructor = vlv.rsi.entitySets.OsaRequests;
vlv.rsi.entitySets.OsaRequests.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.OsaRequests.prototype.path;
vlv.rsi.entitySets.OsaRequests.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.OsaRequests.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.OsaRequests["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiOsaRequests", vlv.rsi.entitySets.OsaRequests);
vlv.rsi.entitySets.PersonalItems = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "PersonalItems";
  this.$http = $http
};
vlv.rsi.entitySets.PersonalItems.prototype = new vlv.svcbase;
vlv.rsi.entitySets.PersonalItems.prototype.constructor = vlv.rsi.entitySets.PersonalItems;
vlv.rsi.entitySets.PersonalItems.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.PersonalItems.prototype.path;
vlv.rsi.entitySets.PersonalItems.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.PersonalItems.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.PersonalItems["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiPersonalItems", vlv.rsi.entitySets.PersonalItems);
vlv.rsi.entitySets.Preferences = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "Preferences";
  this.$http = $http
};
vlv.rsi.entitySets.Preferences.prototype = new vlv.svcbase;
vlv.rsi.entitySets.Preferences.prototype.constructor = vlv.rsi.entitySets.Preferences;
vlv.rsi.entitySets.Preferences.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.Preferences.prototype.path;
vlv.rsi.entitySets.Preferences.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Preferences.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Preferences["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiPreferences", vlv.rsi.entitySets.Preferences);
vlv.rsi.entitySets.Queries = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "Queries";
  this.$http = $http
};
vlv.rsi.entitySets.Queries.prototype = new vlv.svcbase;
vlv.rsi.entitySets.Queries.prototype.constructor = vlv.rsi.entitySets.Queries;
vlv.rsi.entitySets.Queries.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.Queries.prototype.path;
vlv.rsi.entitySets.Queries.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Queries.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Queries["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiQueries", vlv.rsi.entitySets.Queries);
vlv.rsi.entitySets.QueryRoutes = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "QueryRoutes";
  this.$http = $http
};
vlv.rsi.entitySets.QueryRoutes.prototype = new vlv.svcbase;
vlv.rsi.entitySets.QueryRoutes.prototype.constructor = vlv.rsi.entitySets.QueryRoutes;
vlv.rsi.entitySets.QueryRoutes.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.QueryRoutes.prototype.path;
vlv.rsi.entitySets.QueryRoutes.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.QueryRoutes.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.QueryRoutes["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiQueryRoutes", vlv.rsi.entitySets.QueryRoutes);
vlv.rsi.entitySets.Routers = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "Routers";
  this.$http = $http
};
vlv.rsi.entitySets.Routers.prototype = new vlv.svcbase;
vlv.rsi.entitySets.Routers.prototype.constructor = vlv.rsi.entitySets.Routers;
vlv.rsi.entitySets.Routers.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.Routers.prototype.path;
vlv.rsi.entitySets.Routers.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Routers.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Routers["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiRouters", vlv.rsi.entitySets.Routers);
vlv.rsi.entitySets.SavedSearches = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SavedSearches";
  this.$http = $http
};
vlv.rsi.entitySets.SavedSearches.prototype = new vlv.svcbase;
vlv.rsi.entitySets.SavedSearches.prototype.constructor = vlv.rsi.entitySets.SavedSearches;
vlv.rsi.entitySets.SavedSearches.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.SavedSearches.prototype.path;
vlv.rsi.entitySets.SavedSearches.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SavedSearches.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SavedSearches["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSavedSearches", vlv.rsi.entitySets.SavedSearches);
vlv.rsi.entitySets.SearchConfigurations = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchConfigurations";
  this.$http = $http
};
vlv.rsi.entitySets.SearchConfigurations.prototype = new vlv.svcbase;
vlv.rsi.entitySets.SearchConfigurations.prototype.constructor = vlv.rsi.entitySets.SearchConfigurations;
vlv.rsi.entitySets.SearchConfigurations.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.SearchConfigurations.prototype.path;
vlv.rsi.entitySets.SearchConfigurations.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchConfigurations.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchConfigurations["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchConfigurations", vlv.rsi.entitySets.SearchConfigurations);
vlv.rsi.entitySets.Searches = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "Searches";
  this.$http = $http
};
vlv.rsi.entitySets.Searches.prototype = new vlv.svcbase;
vlv.rsi.entitySets.Searches.prototype.constructor = vlv.rsi.entitySets.Searches;
vlv.rsi.entitySets.Searches.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.Searches.prototype.path;
vlv.rsi.entitySets.Searches.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Searches.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Searches["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearches", vlv.rsi.entitySets.Searches);
vlv.rsi.entitySets.SearchFilterTreeNodes = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchFilterTreeNodes";
  this.$http = $http
};
vlv.rsi.entitySets.SearchFilterTreeNodes.prototype = new vlv.svcbase;
vlv.rsi.entitySets.SearchFilterTreeNodes.prototype.constructor = vlv.rsi.entitySets.SearchFilterTreeNodes;
vlv.rsi.entitySets.SearchFilterTreeNodes.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.SearchFilterTreeNodes.prototype.path;
vlv.rsi.entitySets.SearchFilterTreeNodes.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchFilterTreeNodes.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchFilterTreeNodes["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchFilterTreeNodes", vlv.rsi.entitySets.SearchFilterTreeNodes);
vlv.rsi.entitySets.SearchFilterTrees = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchFilterTrees";
  this.$http = $http
};
vlv.rsi.entitySets.SearchFilterTrees.prototype = new vlv.svcbase;
vlv.rsi.entitySets.SearchFilterTrees.prototype.constructor = vlv.rsi.entitySets.SearchFilterTrees;
vlv.rsi.entitySets.SearchFilterTrees.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.SearchFilterTrees.prototype.path;
vlv.rsi.entitySets.SearchFilterTrees.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchFilterTrees.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchFilterTrees["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchFilterTrees", vlv.rsi.entitySets.SearchFilterTrees);
vlv.rsi.entitySets.SearchResultListItemRoutes = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchResultListItemRoutes";
  this.$http = $http
};
vlv.rsi.entitySets.SearchResultListItemRoutes.prototype = new vlv.svcbase;
vlv.rsi.entitySets.SearchResultListItemRoutes.prototype.constructor = vlv.rsi.entitySets.SearchResultListItemRoutes;
vlv.rsi.entitySets.SearchResultListItemRoutes.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.SearchResultListItemRoutes.prototype.path;
vlv.rsi.entitySets.SearchResultListItemRoutes.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchResultListItemRoutes.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchResultListItemRoutes["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchResultListItemRoutes", vlv.rsi.entitySets.SearchResultListItemRoutes);
vlv.rsi.entitySets.SearchResultListItems = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchResultListItems";
  this.$http = $http
};
vlv.rsi.entitySets.SearchResultListItems.prototype = new vlv.svcbase;
vlv.rsi.entitySets.SearchResultListItems.prototype.constructor = vlv.rsi.entitySets.SearchResultListItems;
vlv.rsi.entitySets.SearchResultListItems.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.SearchResultListItems.prototype.path;
vlv.rsi.entitySets.SearchResultListItems.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchResultListItems.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchResultListItems["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchResultListItems", vlv.rsi.entitySets.SearchResultListItems);
vlv.rsi.entitySets.SearchResultListItemStreams = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchResultListItemStreams";
  this.$http = $http
};
vlv.rsi.entitySets.SearchResultListItemStreams.prototype = new vlv.svcbase;
vlv.rsi.entitySets.SearchResultListItemStreams.prototype.constructor = vlv.rsi.entitySets.SearchResultListItemStreams;
vlv.rsi.entitySets.SearchResultListItemStreams.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.SearchResultListItemStreams.prototype.path;
vlv.rsi.entitySets.SearchResultListItemStreams.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchResultListItemStreams.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchResultListItemStreams["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchResultListItemStreams", vlv.rsi.entitySets.SearchResultListItemStreams);
vlv.rsi.entitySets.SearchResultLists = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchResultLists";
  this.$http = $http
};
vlv.rsi.entitySets.SearchResultLists.prototype = new vlv.svcbase;
vlv.rsi.entitySets.SearchResultLists.prototype.constructor = vlv.rsi.entitySets.SearchResultLists;
vlv.rsi.entitySets.SearchResultLists.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.SearchResultLists.prototype.path;
vlv.rsi.entitySets.SearchResultLists.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchResultLists.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchResultLists["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchResultLists", vlv.rsi.entitySets.SearchResultLists);
vlv.rsi.entitySets.SearchRoutes = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchRoutes";
  this.$http = $http
};
vlv.rsi.entitySets.SearchRoutes.prototype = new vlv.svcbase;
vlv.rsi.entitySets.SearchRoutes.prototype.constructor = vlv.rsi.entitySets.SearchRoutes;
vlv.rsi.entitySets.SearchRoutes.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.SearchRoutes.prototype.path;
vlv.rsi.entitySets.SearchRoutes.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchRoutes.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchRoutes["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchRoutes", vlv.rsi.entitySets.SearchRoutes);
vlv.rsi.entitySets.SearchTemplateComponents = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchTemplateComponents";
  this.$http = $http
};
vlv.rsi.entitySets.SearchTemplateComponents.prototype = new vlv.svcbase;
vlv.rsi.entitySets.SearchTemplateComponents.prototype.constructor = vlv.rsi.entitySets.SearchTemplateComponents;
vlv.rsi.entitySets.SearchTemplateComponents.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.SearchTemplateComponents.prototype.path;
vlv.rsi.entitySets.SearchTemplateComponents.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchTemplateComponents.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchTemplateComponents["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchTemplateComponents", vlv.rsi.entitySets.SearchTemplateComponents);
vlv.rsi.entitySets.SearchTemplateExamples = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchTemplateExamples";
  this.$http = $http
};
vlv.rsi.entitySets.SearchTemplateExamples.prototype = new vlv.svcbase;
vlv.rsi.entitySets.SearchTemplateExamples.prototype.constructor = vlv.rsi.entitySets.SearchTemplateExamples;
vlv.rsi.entitySets.SearchTemplateExamples.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.SearchTemplateExamples.prototype.path;
vlv.rsi.entitySets.SearchTemplateExamples.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchTemplateExamples.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchTemplateExamples["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchTemplateExamples", vlv.rsi.entitySets.SearchTemplateExamples);
vlv.rsi.entitySets.SearchTemplates = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchTemplates";
  this.$http = $http
};
vlv.rsi.entitySets.SearchTemplates.prototype = new vlv.svcbase;
vlv.rsi.entitySets.SearchTemplates.prototype.constructor = vlv.rsi.entitySets.SearchTemplates;
vlv.rsi.entitySets.SearchTemplates.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.SearchTemplates.prototype.path;
vlv.rsi.entitySets.SearchTemplates.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchTemplates.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchTemplates["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchTemplates", vlv.rsi.entitySets.SearchTemplates);
vlv.rsi.entitySets.SearchTemplateTreeNodes = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchTemplateTreeNodes";
  this.$http = $http
};
vlv.rsi.entitySets.SearchTemplateTreeNodes.prototype = new vlv.svcbase;
vlv.rsi.entitySets.SearchTemplateTreeNodes.prototype.constructor = vlv.rsi.entitySets.SearchTemplateTreeNodes;
vlv.rsi.entitySets.SearchTemplateTreeNodes.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.SearchTemplateTreeNodes.prototype.path;
vlv.rsi.entitySets.SearchTemplateTreeNodes.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchTemplateTreeNodes.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchTemplateTreeNodes["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchTemplateTreeNodes", vlv.rsi.entitySets.SearchTemplateTreeNodes);
vlv.rsi.entitySets.SearchTemplateTrees = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchTemplateTrees";
  this.$http = $http
};
vlv.rsi.entitySets.SearchTemplateTrees.prototype = new vlv.svcbase;
vlv.rsi.entitySets.SearchTemplateTrees.prototype.constructor = vlv.rsi.entitySets.SearchTemplateTrees;
vlv.rsi.entitySets.SearchTemplateTrees.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.SearchTemplateTrees.prototype.path;
vlv.rsi.entitySets.SearchTemplateTrees.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchTemplateTrees.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SearchTemplateTrees["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchTemplateTrees", vlv.rsi.entitySets.SearchTemplateTrees);
vlv.rsi.entitySets.ServiceRequests = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ServiceRequests";
  this.$http = $http
};
vlv.rsi.entitySets.ServiceRequests.prototype = new vlv.svcbase;
vlv.rsi.entitySets.ServiceRequests.prototype.constructor = vlv.rsi.entitySets.ServiceRequests;
vlv.rsi.entitySets.ServiceRequests.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.ServiceRequests.prototype.path;
vlv.rsi.entitySets.ServiceRequests.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ServiceRequests.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ServiceRequests["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiServiceRequests", vlv.rsi.entitySets.ServiceRequests);
vlv.rsi.entitySets.SharingGroups = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SharingGroups";
  this.$http = $http
};
vlv.rsi.entitySets.SharingGroups.prototype = new vlv.svcbase;
vlv.rsi.entitySets.SharingGroups.prototype.constructor = vlv.rsi.entitySets.SharingGroups;
vlv.rsi.entitySets.SharingGroups.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.SharingGroups.prototype.path;
vlv.rsi.entitySets.SharingGroups.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SharingGroups.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SharingGroups["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSharingGroups", vlv.rsi.entitySets.SharingGroups);
vlv.rsi.entitySets.SharingUsers = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SharingUsers";
  this.$http = $http
};
vlv.rsi.entitySets.SharingUsers.prototype = new vlv.svcbase;
vlv.rsi.entitySets.SharingUsers.prototype.constructor = vlv.rsi.entitySets.SharingUsers;
vlv.rsi.entitySets.SharingUsers.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.SharingUsers.prototype.path;
vlv.rsi.entitySets.SharingUsers.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SharingUsers.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.SharingUsers["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSharingUsers", vlv.rsi.entitySets.SharingUsers);
vlv.rsi.entitySets.Terms = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "Terms";
  this.$http = $http
};
vlv.rsi.entitySets.Terms.prototype = new vlv.svcbase;
vlv.rsi.entitySets.Terms.prototype.constructor = vlv.rsi.entitySets.Terms;
vlv.rsi.entitySets.Terms.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.Terms.prototype.path;
vlv.rsi.entitySets.Terms.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Terms.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Terms["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiTerms", vlv.rsi.entitySets.Terms);
vlv.rsi.entitySets.ToolRoutes = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ToolRoutes";
  this.$http = $http
};
vlv.rsi.entitySets.ToolRoutes.prototype = new vlv.svcbase;
vlv.rsi.entitySets.ToolRoutes.prototype.constructor = vlv.rsi.entitySets.ToolRoutes;
vlv.rsi.entitySets.ToolRoutes.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.ToolRoutes.prototype.path;
vlv.rsi.entitySets.ToolRoutes.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ToolRoutes.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.ToolRoutes["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiToolRoutes", vlv.rsi.entitySets.ToolRoutes);
vlv.rsi.entitySets.TopicInfos = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "TopicInfos";
  this.$http = $http
};
vlv.rsi.entitySets.TopicInfos.prototype = new vlv.svcbase;
vlv.rsi.entitySets.TopicInfos.prototype.constructor = vlv.rsi.entitySets.TopicInfos;
vlv.rsi.entitySets.TopicInfos.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.TopicInfos.prototype.path;
vlv.rsi.entitySets.TopicInfos.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.TopicInfos.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.TopicInfos["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiTopicInfos", vlv.rsi.entitySets.TopicInfos);
vlv.rsi.entitySets.Topics = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "Topics";
  this.$http = $http
};
vlv.rsi.entitySets.Topics.prototype = new vlv.svcbase;
vlv.rsi.entitySets.Topics.prototype.constructor = vlv.rsi.entitySets.Topics;
vlv.rsi.entitySets.Topics.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.Topics.prototype.path;
vlv.rsi.entitySets.Topics.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Topics.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Topics["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiTopics", vlv.rsi.entitySets.Topics);
vlv.rsi.entitySets.TopicSections = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "TopicSections";
  this.$http = $http
};
vlv.rsi.entitySets.TopicSections.prototype = new vlv.svcbase;
vlv.rsi.entitySets.TopicSections.prototype.constructor = vlv.rsi.entitySets.TopicSections;
vlv.rsi.entitySets.TopicSections.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.TopicSections.prototype.path;
vlv.rsi.entitySets.TopicSections.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.TopicSections.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.TopicSections["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiTopicSections", vlv.rsi.entitySets.TopicSections);
vlv.rsi.entitySets.TopicSubSections = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "TopicSubSections";
  this.$http = $http
};
vlv.rsi.entitySets.TopicSubSections.prototype = new vlv.svcbase;
vlv.rsi.entitySets.TopicSubSections.prototype.constructor = vlv.rsi.entitySets.TopicSubSections;
vlv.rsi.entitySets.TopicSubSections.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.TopicSubSections.prototype.path;
vlv.rsi.entitySets.TopicSubSections.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.TopicSubSections.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.TopicSubSections["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiTopicSubSections", vlv.rsi.entitySets.TopicSubSections);
vlv.rsi.entitySets.Trackers = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "Trackers";
  this.$http = $http
};
vlv.rsi.entitySets.Trackers.prototype = new vlv.svcbase;
vlv.rsi.entitySets.Trackers.prototype.constructor = vlv.rsi.entitySets.Trackers;
vlv.rsi.entitySets.Trackers.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.Trackers.prototype.path;
vlv.rsi.entitySets.Trackers.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Trackers.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Trackers["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiTrackers", vlv.rsi.entitySets.Trackers);
vlv.rsi.entitySets.TrackerTopics = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "TrackerTopics";
  this.$http = $http
};
vlv.rsi.entitySets.TrackerTopics.prototype = new vlv.svcbase;
vlv.rsi.entitySets.TrackerTopics.prototype.constructor = vlv.rsi.entitySets.TrackerTopics;
vlv.rsi.entitySets.TrackerTopics.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.TrackerTopics.prototype.path;
vlv.rsi.entitySets.TrackerTopics.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.TrackerTopics.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.TrackerTopics["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiTrackerTopics", vlv.rsi.entitySets.TrackerTopics);
vlv.rsi.entitySets.UserConfigurations = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "UserConfigurations";
  this.$http = $http
};
vlv.rsi.entitySets.UserConfigurations.prototype = new vlv.svcbase;
vlv.rsi.entitySets.UserConfigurations.prototype.constructor = vlv.rsi.entitySets.UserConfigurations;
vlv.rsi.entitySets.UserConfigurations.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.UserConfigurations.prototype.path;
vlv.rsi.entitySets.UserConfigurations.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.UserConfigurations.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.UserConfigurations["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiUserConfigurations", vlv.rsi.entitySets.UserConfigurations);
vlv.rsi.entitySets.UserTrackerOptions = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "UserTrackerOptions";
  this.$http = $http
};
vlv.rsi.entitySets.UserTrackerOptions.prototype = new vlv.svcbase;
vlv.rsi.entitySets.UserTrackerOptions.prototype.constructor = vlv.rsi.entitySets.UserTrackerOptions;
vlv.rsi.entitySets.UserTrackerOptions.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.UserTrackerOptions.prototype.path;
vlv.rsi.entitySets.UserTrackerOptions.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.UserTrackerOptions.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.UserTrackerOptions["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiUserTrackerOptions", vlv.rsi.entitySets.UserTrackerOptions);
vlv.rsi.entitySets.UserTrackerRoutes = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "UserTrackerRoutes";
  this.$http = $http
};
vlv.rsi.entitySets.UserTrackerRoutes.prototype = new vlv.svcbase;
vlv.rsi.entitySets.UserTrackerRoutes.prototype.constructor = vlv.rsi.entitySets.UserTrackerRoutes;
vlv.rsi.entitySets.UserTrackerRoutes.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.UserTrackerRoutes.prototype.path;
vlv.rsi.entitySets.UserTrackerRoutes.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.UserTrackerRoutes.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.UserTrackerRoutes["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiUserTrackerRoutes", vlv.rsi.entitySets.UserTrackerRoutes);
vlv.rsi.entitySets.UserTrackers = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "UserTrackers";
  this.$http = $http
};
vlv.rsi.entitySets.UserTrackers.prototype = new vlv.svcbase;
vlv.rsi.entitySets.UserTrackers.prototype.constructor = vlv.rsi.entitySets.UserTrackers;
vlv.rsi.entitySets.UserTrackers.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.UserTrackers.prototype.path;
vlv.rsi.entitySets.UserTrackers.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.UserTrackers.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.UserTrackers["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiUserTrackers", vlv.rsi.entitySets.UserTrackers);
vlv.rsi.entitySets.UserTrackerTopicSelections = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "UserTrackerTopicSelections";
  this.$http = $http
};
vlv.rsi.entitySets.UserTrackerTopicSelections.prototype = new vlv.svcbase;
vlv.rsi.entitySets.UserTrackerTopicSelections.prototype.constructor = vlv.rsi.entitySets.UserTrackerTopicSelections;
vlv.rsi.entitySets.UserTrackerTopicSelections.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.UserTrackerTopicSelections.prototype.path;
vlv.rsi.entitySets.UserTrackerTopicSelections.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.UserTrackerTopicSelections.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.UserTrackerTopicSelections["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiUserTrackerTopicSelections", vlv.rsi.entitySets.UserTrackerTopicSelections);
vlv.rsi.entitySets.WordWheels = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "WordWheels";
  this.$http = $http
};
vlv.rsi.entitySets.WordWheels.prototype = new vlv.svcbase;
vlv.rsi.entitySets.WordWheels.prototype.constructor = vlv.rsi.entitySets.WordWheels;
vlv.rsi.entitySets.WordWheels.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.WordWheels.prototype.path;
vlv.rsi.entitySets.WordWheels.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.WordWheels.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.WordWheels["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiWordWheels", vlv.rsi.entitySets.WordWheels);
vlv.rsi.entitySets.Workspaces = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "Workspaces";
  this.$http = $http
};
vlv.rsi.entitySets.Workspaces.prototype = new vlv.svcbase;
vlv.rsi.entitySets.Workspaces.prototype.constructor = vlv.rsi.entitySets.Workspaces;
vlv.rsi.entitySets.Workspaces.prototype.buildUrl = function(params) {
  var url = this.path;
  if(params != null) {
    url += "('" + params.id + "')/";
    if(params.expand) {
      url += "?$expand=" + params.expand
    }
  }else {
    url += "/"
  }
  return url
};
vlv.rsi.entitySets.Workspaces.prototype.path;
vlv.rsi.entitySets.Workspaces.prototype.getOne = function(query) {
  var self = this;
  var url = self.buildUrl(query);
  var promise = self.get(url).then(function(response) {
    var entity = vlv.rsi.entities.Folder.fromJson(self.$http, response["data"]["d"]);
    return entity
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Workspaces.prototype.getAll = function() {
  var self = this;
  var url = self.buildUrl();
  var promise = self.get(url).then(function(response) {
    var entities = [];
    angular.forEach(response["data"]["d"]["results"], function(item) {
      entities.push(vlv.rsi.entities.Folder.fromJson(self.$http, item))
    });
    return entities
  });
  return vlv.common.toHttpPromise(promise)
};
vlv.rsi.entitySets.Workspaces["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiWorkspaces", vlv.rsi.entitySets.Workspaces);
vlv.rsi.functions.AddConfigurationToAlert = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "AddConfigurationToAlert";
  this.$http = $http
};
vlv.rsi.functions.AddConfigurationToAlert.prototype = new vlv.svcbase;
vlv.rsi.functions.AddConfigurationToAlert.prototype.constructor = vlv.rsi.functions.AddConfigurationToAlert;
vlv.rsi.functions.AddConfigurationToAlert.prototype.call = function(params) {
  params = params || new vlv.rsi.params.AddConfigurationToAlertParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.AddConfigurationToAlert["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiAddConfigurationToAlertFunction", vlv.rsi.functions.AddConfigurationToAlert);
vlv.rsi.functions.AddFavoriteItems = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "AddFavoriteItems";
  this.$http = $http
};
vlv.rsi.functions.AddFavoriteItems.prototype = new vlv.svcbase;
vlv.rsi.functions.AddFavoriteItems.prototype.constructor = vlv.rsi.functions.AddFavoriteItems;
vlv.rsi.functions.AddFavoriteItems.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.AddFavoriteItems["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiAddFavoriteItemsFunction", vlv.rsi.functions.AddFavoriteItems);
vlv.rsi.functions.AddToContentTree = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "AddToContentTree";
  this.$http = $http
};
vlv.rsi.functions.AddToContentTree.prototype = new vlv.svcbase;
vlv.rsi.functions.AddToContentTree.prototype.constructor = vlv.rsi.functions.AddToContentTree;
vlv.rsi.functions.AddToContentTree.prototype.call = function(params) {
  params = params || new vlv.rsi.params.AddToContentTreeParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.AddToContentTree["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiAddToContentTreeFunction", vlv.rsi.functions.AddToContentTree);
vlv.rsi.functions.AddToFavorites = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "AddToFavorites";
  this.$http = $http
};
vlv.rsi.functions.AddToFavorites.prototype = new vlv.svcbase;
vlv.rsi.functions.AddToFavorites.prototype.constructor = vlv.rsi.functions.AddToFavorites;
vlv.rsi.functions.AddToFavorites.prototype.call = function(params) {
  params = params || new vlv.rsi.params.AddToFavoritesParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.AddToFavorites["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiAddToFavoritesFunction", vlv.rsi.functions.AddToFavorites);
vlv.rsi.functions.AddUsersToSharingGroup = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "AddUsersToSharingGroup";
  this.$http = $http
};
vlv.rsi.functions.AddUsersToSharingGroup.prototype = new vlv.svcbase;
vlv.rsi.functions.AddUsersToSharingGroup.prototype.constructor = vlv.rsi.functions.AddUsersToSharingGroup;
vlv.rsi.functions.AddUsersToSharingGroup.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.AddUsersToSharingGroup["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiAddUsersToSharingGroupFunction", vlv.rsi.functions.AddUsersToSharingGroup);
vlv.rsi.functions.ChangePersonalItemOwner = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ChangePersonalItemOwner";
  this.$http = $http
};
vlv.rsi.functions.ChangePersonalItemOwner.prototype = new vlv.svcbase;
vlv.rsi.functions.ChangePersonalItemOwner.prototype.constructor = vlv.rsi.functions.ChangePersonalItemOwner;
vlv.rsi.functions.ChangePersonalItemOwner.prototype.call = function(params) {
  params = params || new vlv.rsi.params.ChangePersonalItemOwnerParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.ChangePersonalItemOwner["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiChangePersonalItemOwnerFunction", vlv.rsi.functions.ChangePersonalItemOwner);
vlv.rsi.functions.ChangeWorkspaceOrder = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ChangeWorkspaceOrder";
  this.$http = $http
};
vlv.rsi.functions.ChangeWorkspaceOrder.prototype = new vlv.svcbase;
vlv.rsi.functions.ChangeWorkspaceOrder.prototype.constructor = vlv.rsi.functions.ChangeWorkspaceOrder;
vlv.rsi.functions.ChangeWorkspaceOrder.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.ChangeWorkspaceOrder["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiChangeWorkspaceOrderFunction", vlv.rsi.functions.ChangeWorkspaceOrder);
vlv.rsi.functions.ClearDefaultAlertConfiguration = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ClearDefaultAlertConfiguration";
  this.$http = $http
};
vlv.rsi.functions.ClearDefaultAlertConfiguration.prototype = new vlv.svcbase;
vlv.rsi.functions.ClearDefaultAlertConfiguration.prototype.constructor = vlv.rsi.functions.ClearDefaultAlertConfiguration;
vlv.rsi.functions.ClearDefaultAlertConfiguration.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.ClearDefaultAlertConfiguration["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiClearDefaultAlertConfigurationFunction", vlv.rsi.functions.ClearDefaultAlertConfiguration);
vlv.rsi.functions.ClearFolder = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ClearFolder";
  this.$http = $http
};
vlv.rsi.functions.ClearFolder.prototype = new vlv.svcbase;
vlv.rsi.functions.ClearFolder.prototype.constructor = vlv.rsi.functions.ClearFolder;
vlv.rsi.functions.ClearFolder.prototype.call = function(params) {
  params = params || new vlv.rsi.params.ClearFolderParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.ClearFolder["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiClearFolderFunction", vlv.rsi.functions.ClearFolder);
vlv.rsi.functions.ClearSelectedWorkspace = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ClearSelectedWorkspace";
  this.$http = $http
};
vlv.rsi.functions.ClearSelectedWorkspace.prototype = new vlv.svcbase;
vlv.rsi.functions.ClearSelectedWorkspace.prototype.constructor = vlv.rsi.functions.ClearSelectedWorkspace;
vlv.rsi.functions.ClearSelectedWorkspace.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.ClearSelectedWorkspace["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiClearSelectedWorkspaceFunction", vlv.rsi.functions.ClearSelectedWorkspace);
vlv.rsi.functions.ClearSharingGroup = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ClearSharingGroup";
  this.$http = $http
};
vlv.rsi.functions.ClearSharingGroup.prototype = new vlv.svcbase;
vlv.rsi.functions.ClearSharingGroup.prototype.constructor = vlv.rsi.functions.ClearSharingGroup;
vlv.rsi.functions.ClearSharingGroup.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.ClearSharingGroup["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiClearSharingGroupFunction", vlv.rsi.functions.ClearSharingGroup);
vlv.rsi.functions.CloneFolder = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "CloneFolder";
  this.$http = $http
};
vlv.rsi.functions.CloneFolder.prototype = new vlv.svcbase;
vlv.rsi.functions.CloneFolder.prototype.constructor = vlv.rsi.functions.CloneFolder;
vlv.rsi.functions.CloneFolder.prototype.call = function(params) {
  params = params || new vlv.rsi.params.CloneFolderParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.CloneFolder["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiCloneFolderFunction", vlv.rsi.functions.CloneFolder);
vlv.rsi.functions.ContentTreeNodeAuthorization = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ContentTreeNodeAuthorization";
  this.$http = $http
};
vlv.rsi.functions.ContentTreeNodeAuthorization.prototype = new vlv.svcbase;
vlv.rsi.functions.ContentTreeNodeAuthorization.prototype.constructor = vlv.rsi.functions.ContentTreeNodeAuthorization;
vlv.rsi.functions.ContentTreeNodeAuthorization.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.ContentTreeNodeAuthorization["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiContentTreeNodeAuthorizationFunction", vlv.rsi.functions.ContentTreeNodeAuthorization);
vlv.rsi.functions.CopyFolderItem = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "CopyFolderItem";
  this.$http = $http
};
vlv.rsi.functions.CopyFolderItem.prototype = new vlv.svcbase;
vlv.rsi.functions.CopyFolderItem.prototype.constructor = vlv.rsi.functions.CopyFolderItem;
vlv.rsi.functions.CopyFolderItem.prototype.call = function(params) {
  params = params || new vlv.rsi.params.CopyFolderItemParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.CopyFolderItem["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiCopyFolderItemFunction", vlv.rsi.functions.CopyFolderItem);
vlv.rsi.functions.DefaultAlertConfiguration = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "DefaultAlertConfiguration";
  this.$http = $http
};
vlv.rsi.functions.DefaultAlertConfiguration.prototype = new vlv.svcbase;
vlv.rsi.functions.DefaultAlertConfiguration.prototype.constructor = vlv.rsi.functions.DefaultAlertConfiguration;
vlv.rsi.functions.DefaultAlertConfiguration.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.DefaultAlertConfiguration["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiDefaultAlertConfigurationFunction", vlv.rsi.functions.DefaultAlertConfiguration);
vlv.rsi.functions.DeleteSearchHistory = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "DeleteSearchHistory";
  this.$http = $http
};
vlv.rsi.functions.DeleteSearchHistory.prototype = new vlv.svcbase;
vlv.rsi.functions.DeleteSearchHistory.prototype.constructor = vlv.rsi.functions.DeleteSearchHistory;
vlv.rsi.functions.DeleteSearchHistory.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.DeleteSearchHistory["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiDeleteSearchHistoryFunction", vlv.rsi.functions.DeleteSearchHistory);
vlv.rsi.functions.DeleteUserConfigurations = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "DeleteUserConfigurations";
  this.$http = $http
};
vlv.rsi.functions.DeleteUserConfigurations.prototype = new vlv.svcbase;
vlv.rsi.functions.DeleteUserConfigurations.prototype.constructor = vlv.rsi.functions.DeleteUserConfigurations;
vlv.rsi.functions.DeleteUserConfigurations.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.DeleteUserConfigurations["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiDeleteUserConfigurationsFunction", vlv.rsi.functions.DeleteUserConfigurations);
vlv.rsi.functions.DocumentStream = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "DocumentStream";
  this.$http = $http
};
vlv.rsi.functions.DocumentStream.prototype = new vlv.svcbase;
vlv.rsi.functions.DocumentStream.prototype.constructor = vlv.rsi.functions.DocumentStream;
vlv.rsi.functions.DocumentStream.prototype.call = function(params) {
  params = params || new vlv.rsi.params.DocumentStreamParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.DocumentStream["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiDocumentStreamFunction", vlv.rsi.functions.DocumentStream);
vlv.rsi.functions.EmailDocument = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "EmailDocument";
  this.$http = $http
};
vlv.rsi.functions.EmailDocument.prototype = new vlv.svcbase;
vlv.rsi.functions.EmailDocument.prototype.constructor = vlv.rsi.functions.EmailDocument;
vlv.rsi.functions.EmailDocument.prototype.call = function(params) {
  params = params || new vlv.rsi.params.EmailDocumentParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.EmailDocument["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiEmailDocumentFunction", vlv.rsi.functions.EmailDocument);
vlv.rsi.functions.FilterContentModules = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "FilterContentModules";
  this.$http = $http
};
vlv.rsi.functions.FilterContentModules.prototype = new vlv.svcbase;
vlv.rsi.functions.FilterContentModules.prototype.constructor = vlv.rsi.functions.FilterContentModules;
vlv.rsi.functions.FilterContentModules.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.FilterContentModules["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiFilterContentModulesFunction", vlv.rsi.functions.FilterContentModules);
vlv.rsi.functions.FolderByTitle = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "FolderByTitle";
  this.$http = $http
};
vlv.rsi.functions.FolderByTitle.prototype = new vlv.svcbase;
vlv.rsi.functions.FolderByTitle.prototype.constructor = vlv.rsi.functions.FolderByTitle;
vlv.rsi.functions.FolderByTitle.prototype.call = function(params) {
  params = params || new vlv.rsi.params.FolderByTitleParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.FolderByTitle["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiFolderByTitleFunction", vlv.rsi.functions.FolderByTitle);
vlv.rsi.functions.GetModuleAuthorization = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "GetModuleAuthorization";
  this.$http = $http
};
vlv.rsi.functions.GetModuleAuthorization.prototype = new vlv.svcbase;
vlv.rsi.functions.GetModuleAuthorization.prototype.constructor = vlv.rsi.functions.GetModuleAuthorization;
vlv.rsi.functions.GetModuleAuthorization.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.GetModuleAuthorization["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiGetModuleAuthorizationFunction", vlv.rsi.functions.GetModuleAuthorization);
vlv.rsi.functions.HidePersonalItems = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "HidePersonalItems";
  this.$http = $http
};
vlv.rsi.functions.HidePersonalItems.prototype = new vlv.svcbase;
vlv.rsi.functions.HidePersonalItems.prototype.constructor = vlv.rsi.functions.HidePersonalItems;
vlv.rsi.functions.HidePersonalItems.prototype.call = function(params) {
  params = params || new vlv.rsi.params.HidePersonalItemsParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.HidePersonalItems["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiHidePersonalItemsFunction", vlv.rsi.functions.HidePersonalItems);
vlv.rsi.functions.ModifyWorkspace = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ModifyWorkspace";
  this.$http = $http
};
vlv.rsi.functions.ModifyWorkspace.prototype = new vlv.svcbase;
vlv.rsi.functions.ModifyWorkspace.prototype.constructor = vlv.rsi.functions.ModifyWorkspace;
vlv.rsi.functions.ModifyWorkspace.prototype.call = function(params) {
  params = params || new vlv.rsi.params.ModifyWorkspaceParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.ModifyWorkspace["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiModifyWorkspaceFunction", vlv.rsi.functions.ModifyWorkspace);
vlv.rsi.functions.ModuleAuthorization = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ModuleAuthorization";
  this.$http = $http
};
vlv.rsi.functions.ModuleAuthorization.prototype = new vlv.svcbase;
vlv.rsi.functions.ModuleAuthorization.prototype.constructor = vlv.rsi.functions.ModuleAuthorization;
vlv.rsi.functions.ModuleAuthorization.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.ModuleAuthorization["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiModuleAuthorizationFunction", vlv.rsi.functions.ModuleAuthorization);
vlv.rsi.functions.MoveFolderItem = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "MoveFolderItem";
  this.$http = $http
};
vlv.rsi.functions.MoveFolderItem.prototype = new vlv.svcbase;
vlv.rsi.functions.MoveFolderItem.prototype.constructor = vlv.rsi.functions.MoveFolderItem;
vlv.rsi.functions.MoveFolderItem.prototype.call = function(params) {
  params = params || new vlv.rsi.params.MoveFolderItemParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.MoveFolderItem["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiMoveFolderItemFunction", vlv.rsi.functions.MoveFolderItem);
vlv.rsi.functions.OrderFavoriteItems = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "OrderFavoriteItems";
  this.$http = $http
};
vlv.rsi.functions.OrderFavoriteItems.prototype = new vlv.svcbase;
vlv.rsi.functions.OrderFavoriteItems.prototype.constructor = vlv.rsi.functions.OrderFavoriteItems;
vlv.rsi.functions.OrderFavoriteItems.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.OrderFavoriteItems["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiOrderFavoriteItemsFunction", vlv.rsi.functions.OrderFavoriteItems);
vlv.rsi.params.AddConfigurationToAlertParams = function() {
  vlv.common.odataParams.call(this);
  this["alertId"] = "";
  this["configurationId"] = ""
};
vlv.rsi.params.AddConfigurationToAlertParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.AddConfigurationToAlertParams.prototype.constructor = vlv.rsi.params.AddConfigurationToAlertParams;
vlv.rsi.params.AddConfigurationToAlertParams.prototype.alertId;
vlv.rsi.params.AddConfigurationToAlertParams.prototype.configurationId;
vlv.rsi.params.AddToContentTreeParams = function() {
  vlv.common.odataParams.call(this);
  this["contentTreeId"] = "";
  this["contentTreeNodeId"] = ""
};
vlv.rsi.params.AddToContentTreeParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.AddToContentTreeParams.prototype.constructor = vlv.rsi.params.AddToContentTreeParams;
vlv.rsi.params.AddToContentTreeParams.prototype.contentTreeId;
vlv.rsi.params.AddToContentTreeParams.prototype.contentTreeNodeId;
vlv.rsi.params.AddToFavoritesParams = function() {
  vlv.common.odataParams.call(this);
  this["contentTreeNodeId"] = ""
};
vlv.rsi.params.AddToFavoritesParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.AddToFavoritesParams.prototype.constructor = vlv.rsi.params.AddToFavoritesParams;
vlv.rsi.params.AddToFavoritesParams.prototype.contentTreeNodeId;
vlv.rsi.params.ChangePersonalItemOwnerParams = function() {
  vlv.common.odataParams.call(this);
  this["newOwnerId"] = "";
  this["oldOwnerId"] = "";
  this["notify"] = ""
};
vlv.rsi.params.ChangePersonalItemOwnerParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.ChangePersonalItemOwnerParams.prototype.constructor = vlv.rsi.params.ChangePersonalItemOwnerParams;
vlv.rsi.params.ChangePersonalItemOwnerParams.prototype.newOwnerId;
vlv.rsi.params.ChangePersonalItemOwnerParams.prototype.oldOwnerId;
vlv.rsi.params.ChangePersonalItemOwnerParams.prototype.notify;
vlv.rsi.params.ClearFolderParams = function() {
  vlv.common.odataParams.call(this);
  this["folderId"] = ""
};
vlv.rsi.params.ClearFolderParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.ClearFolderParams.prototype.constructor = vlv.rsi.params.ClearFolderParams;
vlv.rsi.params.ClearFolderParams.prototype.folderId;
vlv.rsi.params.CloneFolderParams = function() {
  vlv.common.odataParams.call(this);
  this["folderId"] = "";
  this["toFolderId"] = ""
};
vlv.rsi.params.CloneFolderParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.CloneFolderParams.prototype.constructor = vlv.rsi.params.CloneFolderParams;
vlv.rsi.params.CloneFolderParams.prototype.folderId;
vlv.rsi.params.CloneFolderParams.prototype.toFolderId;
vlv.rsi.params.CopyFolderItemParams = function() {
  vlv.common.odataParams.call(this);
  this["folderItemId"] = "";
  this["toFolderId"] = ""
};
vlv.rsi.params.CopyFolderItemParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.CopyFolderItemParams.prototype.constructor = vlv.rsi.params.CopyFolderItemParams;
vlv.rsi.params.CopyFolderItemParams.prototype.folderItemId;
vlv.rsi.params.CopyFolderItemParams.prototype.toFolderId;
vlv.rsi.params.DocumentStreamParams = function() {
  vlv.common.odataParams.call(this);
  this["channelId"] = ""
};
vlv.rsi.params.DocumentStreamParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.DocumentStreamParams.prototype.constructor = vlv.rsi.params.DocumentStreamParams;
vlv.rsi.params.DocumentStreamParams.prototype.channelId;
vlv.rsi.params.EmailDocumentParams = function() {
  vlv.common.odataParams.call(this);
  this["format"] = "";
  this["to"] = "";
  this["cc"] = "";
  this["bcc"] = "";
  this["subject"] = "";
  this["message"] = "";
  this["from"] = ""
};
vlv.rsi.params.EmailDocumentParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.EmailDocumentParams.prototype.constructor = vlv.rsi.params.EmailDocumentParams;
vlv.rsi.params.EmailDocumentParams.prototype.format;
vlv.rsi.params.EmailDocumentParams.prototype.to;
vlv.rsi.params.EmailDocumentParams.prototype.cc;
vlv.rsi.params.EmailDocumentParams.prototype.bcc;
vlv.rsi.params.EmailDocumentParams.prototype.subject;
vlv.rsi.params.EmailDocumentParams.prototype.message;
vlv.rsi.params.EmailDocumentParams.prototype.from;
vlv.rsi.params.FolderByTitleParams = function() {
  vlv.common.odataParams.call(this);
  this["title"] = ""
};
vlv.rsi.params.FolderByTitleParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.FolderByTitleParams.prototype.constructor = vlv.rsi.params.FolderByTitleParams;
vlv.rsi.params.FolderByTitleParams.prototype.title;
vlv.rsi.params.HidePersonalItemsParams = function() {
  vlv.common.odataParams.call(this);
  this["all"] = ""
};
vlv.rsi.params.HidePersonalItemsParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.HidePersonalItemsParams.prototype.constructor = vlv.rsi.params.HidePersonalItemsParams;
vlv.rsi.params.HidePersonalItemsParams.prototype.all;
vlv.rsi.params.ModifyWorkspaceParams = function() {
  vlv.common.odataParams.call(this);
  this["id"] = ""
};
vlv.rsi.params.ModifyWorkspaceParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.ModifyWorkspaceParams.prototype.constructor = vlv.rsi.params.ModifyWorkspaceParams;
vlv.rsi.params.ModifyWorkspaceParams.prototype.id;
vlv.rsi.params.MoveFolderItemParams = function() {
  vlv.common.odataParams.call(this);
  this["folderItemId"] = "";
  this["toFolderId"] = ""
};
vlv.rsi.params.MoveFolderItemParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.MoveFolderItemParams.prototype.constructor = vlv.rsi.params.MoveFolderItemParams;
vlv.rsi.params.MoveFolderItemParams.prototype.folderItemId;
vlv.rsi.params.MoveFolderItemParams.prototype.toFolderId;
vlv.rsi.params.RemoveConfigurationFromAlertParams = function() {
  vlv.common.odataParams.call(this);
  this["alertId"] = "";
  this["configurationId"] = ""
};
vlv.rsi.params.RemoveConfigurationFromAlertParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.RemoveConfigurationFromAlertParams.prototype.constructor = vlv.rsi.params.RemoveConfigurationFromAlertParams;
vlv.rsi.params.RemoveConfigurationFromAlertParams.prototype.alertId;
vlv.rsi.params.RemoveConfigurationFromAlertParams.prototype.configurationId;
vlv.rsi.params.RemoveFromContentTreeParams = function() {
  vlv.common.odataParams.call(this);
  this["contentTreeId"] = "";
  this["contentTreeNodeId"] = ""
};
vlv.rsi.params.RemoveFromContentTreeParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.RemoveFromContentTreeParams.prototype.constructor = vlv.rsi.params.RemoveFromContentTreeParams;
vlv.rsi.params.RemoveFromContentTreeParams.prototype.contentTreeId;
vlv.rsi.params.RemoveFromContentTreeParams.prototype.contentTreeNodeId;
vlv.rsi.params.RenderedDocumentUrlParams = function() {
  vlv.common.odataParams.call(this);
  this["channelId"] = ""
};
vlv.rsi.params.RenderedDocumentUrlParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.RenderedDocumentUrlParams.prototype.constructor = vlv.rsi.params.RenderedDocumentUrlParams;
vlv.rsi.params.RenderedDocumentUrlParams.prototype.channelId;
vlv.rsi.params.SaveDocumentParams = function() {
  vlv.common.odataParams.call(this);
  this["folderTitle"] = "";
  this["documentId"] = ""
};
vlv.rsi.params.SaveDocumentParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.SaveDocumentParams.prototype.constructor = vlv.rsi.params.SaveDocumentParams;
vlv.rsi.params.SaveDocumentParams.prototype.folderTitle;
vlv.rsi.params.SaveDocumentParams.prototype.documentId;
vlv.rsi.params.SearchContentModuleTitlesParams = function() {
  vlv.common.odataParams.call(this);
  this["query"] = ""
};
vlv.rsi.params.SearchContentModuleTitlesParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.SearchContentModuleTitlesParams.prototype.constructor = vlv.rsi.params.SearchContentModuleTitlesParams;
vlv.rsi.params.SearchContentModuleTitlesParams.prototype.query;
vlv.rsi.params.SearchDocumentAnnotationsParams = function() {
  vlv.common.odataParams.call(this);
  this["query"] = ""
};
vlv.rsi.params.SearchDocumentAnnotationsParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.SearchDocumentAnnotationsParams.prototype.constructor = vlv.rsi.params.SearchDocumentAnnotationsParams;
vlv.rsi.params.SearchDocumentAnnotationsParams.prototype.query;
vlv.rsi.params.SearchParams = function() {
  vlv.common.odataParams.call(this);
  this["query"] = "";
  this["configurationId"] = "";
  this["templateId"] = "";
  this["searchId"] = "";
  this["searchFilterTreeNodeId"] = "";
  this["contentTreeNodeId"] = "";
  this["contentModuleId"] = "";
  this["filterTreeId"] = "";
  this["filterTreeNodeId"] = "";
  this["dateFrom"] = "";
  this["dateTo"] = "";
  this["clustered"] = "";
  this["subscribedContent"] = "";
  this["citationCombo"] = "";
  this["saveToHistory"] = "";
  this["pageSkip"] = "";
  this["pageTop"] = "";
  this["pitDateFrom"] = "";
  this["pitDateTo"] = "";
  this["saveNarrowNodes"] = "";
  this["sort"] = "";
  this["sortOrder"] = "";
  this["sortDirection"] = "";
  this["fieldedSearch"] = "";
  this["fieldMap"] = ""
};
vlv.rsi.params.SearchParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.SearchParams.prototype.constructor = vlv.rsi.params.SearchParams;
vlv.rsi.params.SearchParams.prototype.query;
vlv.rsi.params.SearchParams.prototype.configurationId;
vlv.rsi.params.SearchParams.prototype.templateId;
vlv.rsi.params.SearchParams.prototype.searchId;
vlv.rsi.params.SearchParams.prototype.searchFilterTreeNodeId;
vlv.rsi.params.SearchParams.prototype.contentTreeNodeId;
vlv.rsi.params.SearchParams.prototype.contentModuleId;
vlv.rsi.params.SearchParams.prototype.filterTreeId;
vlv.rsi.params.SearchParams.prototype.filterTreeNodeId;
vlv.rsi.params.SearchParams.prototype.dateFrom;
vlv.rsi.params.SearchParams.prototype.dateTo;
vlv.rsi.params.SearchParams.prototype.clustered;
vlv.rsi.params.SearchParams.prototype.subscribedContent;
vlv.rsi.params.SearchParams.prototype.citationCombo;
vlv.rsi.params.SearchParams.prototype.saveToHistory;
vlv.rsi.params.SearchParams.prototype.pageSkip;
vlv.rsi.params.SearchParams.prototype.pageTop;
vlv.rsi.params.SearchParams.prototype.pitDateFrom;
vlv.rsi.params.SearchParams.prototype.pitDateTo;
vlv.rsi.params.SearchParams.prototype.saveNarrowNodes;
vlv.rsi.params.SearchParams.prototype.sort;
vlv.rsi.params.SearchParams.prototype.sortOrder;
vlv.rsi.params.SearchParams.prototype.sortDirection;
vlv.rsi.params.SearchParams.prototype.fieldedSearch;
vlv.rsi.params.SearchParams.prototype.fieldMap;
vlv.rsi.params.SearchResultListItemStreamParams = function() {
  vlv.common.odataParams.call(this);
  this["channelId"] = ""
};
vlv.rsi.params.SearchResultListItemStreamParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.SearchResultListItemStreamParams.prototype.constructor = vlv.rsi.params.SearchResultListItemStreamParams;
vlv.rsi.params.SearchResultListItemStreamParams.prototype.channelId;
vlv.rsi.params.SearchSuggestionsParams = function() {
  vlv.common.odataParams.call(this);
  this["seed"] = "";
  this["wordWheelId"] = ""
};
vlv.rsi.params.SearchSuggestionsParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.SearchSuggestionsParams.prototype.constructor = vlv.rsi.params.SearchSuggestionsParams;
vlv.rsi.params.SearchSuggestionsParams.prototype.seed;
vlv.rsi.params.SearchSuggestionsParams.prototype.wordWheelId;
vlv.rsi.params.SelectAllUserTrackerTopicsParams = function() {
  vlv.common.odataParams.call(this);
  this["userTrackerId"] = "";
  this["selectAll"] = ""
};
vlv.rsi.params.SelectAllUserTrackerTopicsParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.SelectAllUserTrackerTopicsParams.prototype.constructor = vlv.rsi.params.SelectAllUserTrackerTopicsParams;
vlv.rsi.params.SelectAllUserTrackerTopicsParams.prototype.userTrackerId;
vlv.rsi.params.SelectAllUserTrackerTopicsParams.prototype.selectAll;
vlv.rsi.params.SetSelectedWorkspaceParams = function() {
  vlv.common.odataParams.call(this);
  this["id"] = ""
};
vlv.rsi.params.SetSelectedWorkspaceParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.SetSelectedWorkspaceParams.prototype.constructor = vlv.rsi.params.SetSelectedWorkspaceParams;
vlv.rsi.params.SetSelectedWorkspaceParams.prototype.id;
vlv.rsi.params.SharePersonalItemParams = function() {
  vlv.common.odataParams.call(this);
  this["notify"] = ""
};
vlv.rsi.params.SharePersonalItemParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.SharePersonalItemParams.prototype.constructor = vlv.rsi.params.SharePersonalItemParams;
vlv.rsi.params.SharePersonalItemParams.prototype.notify;
vlv.rsi.params.SharePersonalItemWithAllParams = function() {
  vlv.common.odataParams.call(this);
  this["notify"] = ""
};
vlv.rsi.params.SharePersonalItemWithAllParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.SharePersonalItemWithAllParams.prototype.constructor = vlv.rsi.params.SharePersonalItemWithAllParams;
vlv.rsi.params.SharePersonalItemWithAllParams.prototype.notify;
vlv.rsi.params.UnhidePersonalItemsParams = function() {
  vlv.common.odataParams.call(this);
  this["all"] = ""
};
vlv.rsi.params.UnhidePersonalItemsParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.UnhidePersonalItemsParams.prototype.constructor = vlv.rsi.params.UnhidePersonalItemsParams;
vlv.rsi.params.UnhidePersonalItemsParams.prototype.all;
vlv.rsi.params.UnsharePersonalItemParams = function() {
  vlv.common.odataParams.call(this);
  this["notify"] = ""
};
vlv.rsi.params.UnsharePersonalItemParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.UnsharePersonalItemParams.prototype.constructor = vlv.rsi.params.UnsharePersonalItemParams;
vlv.rsi.params.UnsharePersonalItemParams.prototype.notify;
vlv.rsi.params.UnsharePersonalItemWithAllParams = function() {
  vlv.common.odataParams.call(this);
  this["notify"] = ""
};
vlv.rsi.params.UnsharePersonalItemWithAllParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.UnsharePersonalItemWithAllParams.prototype.constructor = vlv.rsi.params.UnsharePersonalItemWithAllParams;
vlv.rsi.params.UnsharePersonalItemWithAllParams.prototype.notify;
vlv.rsi.params.WorkspaceParams = function() {
  vlv.common.odataParams.call(this);
  this["title"] = ""
};
vlv.rsi.params.WorkspaceParams.prototype = new vlv.common.odataParams;
vlv.rsi.params.WorkspaceParams.prototype.constructor = vlv.rsi.params.WorkspaceParams;
vlv.rsi.params.WorkspaceParams.prototype.title;
vlv.rsi.functions.Ping = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "Ping";
  this.$http = $http
};
vlv.rsi.functions.Ping.prototype = new vlv.svcbase;
vlv.rsi.functions.Ping.prototype.constructor = vlv.rsi.functions.Ping;
vlv.rsi.functions.Ping.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.Ping["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiPingFunction", vlv.rsi.functions.Ping);
vlv.rsi.functions.PostSearch = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "PostSearch";
  this.$http = $http
};
vlv.rsi.functions.PostSearch.prototype = new vlv.svcbase;
vlv.rsi.functions.PostSearch.prototype.constructor = vlv.rsi.functions.PostSearch;
vlv.rsi.functions.PostSearch.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.PostSearch["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiPostSearchFunction", vlv.rsi.functions.PostSearch);
vlv.rsi.functions.PostSearchConfiguration = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "PostSearchConfiguration";
  this.$http = $http
};
vlv.rsi.functions.PostSearchConfiguration.prototype = new vlv.svcbase;
vlv.rsi.functions.PostSearchConfiguration.prototype.constructor = vlv.rsi.functions.PostSearchConfiguration;
vlv.rsi.functions.PostSearchConfiguration.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.PostSearchConfiguration["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiPostSearchConfigurationFunction", vlv.rsi.functions.PostSearchConfiguration);
vlv.rsi.functions.RemoveConfigurationFromAlert = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "RemoveConfigurationFromAlert";
  this.$http = $http
};
vlv.rsi.functions.RemoveConfigurationFromAlert.prototype = new vlv.svcbase;
vlv.rsi.functions.RemoveConfigurationFromAlert.prototype.constructor = vlv.rsi.functions.RemoveConfigurationFromAlert;
vlv.rsi.functions.RemoveConfigurationFromAlert.prototype.call = function(params) {
  params = params || new vlv.rsi.params.RemoveConfigurationFromAlertParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.RemoveConfigurationFromAlert["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiRemoveConfigurationFromAlertFunction", vlv.rsi.functions.RemoveConfigurationFromAlert);
vlv.rsi.functions.RemoveFavoriteItems = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "RemoveFavoriteItems";
  this.$http = $http
};
vlv.rsi.functions.RemoveFavoriteItems.prototype = new vlv.svcbase;
vlv.rsi.functions.RemoveFavoriteItems.prototype.constructor = vlv.rsi.functions.RemoveFavoriteItems;
vlv.rsi.functions.RemoveFavoriteItems.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.RemoveFavoriteItems["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiRemoveFavoriteItemsFunction", vlv.rsi.functions.RemoveFavoriteItems);
vlv.rsi.functions.RemoveFromContentTree = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "RemoveFromContentTree";
  this.$http = $http
};
vlv.rsi.functions.RemoveFromContentTree.prototype = new vlv.svcbase;
vlv.rsi.functions.RemoveFromContentTree.prototype.constructor = vlv.rsi.functions.RemoveFromContentTree;
vlv.rsi.functions.RemoveFromContentTree.prototype.call = function(params) {
  params = params || new vlv.rsi.params.RemoveFromContentTreeParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.RemoveFromContentTree["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiRemoveFromContentTreeFunction", vlv.rsi.functions.RemoveFromContentTree);
vlv.rsi.functions.RemoveSharingGroups = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "RemoveSharingGroups";
  this.$http = $http
};
vlv.rsi.functions.RemoveSharingGroups.prototype = new vlv.svcbase;
vlv.rsi.functions.RemoveSharingGroups.prototype.constructor = vlv.rsi.functions.RemoveSharingGroups;
vlv.rsi.functions.RemoveSharingGroups.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.RemoveSharingGroups["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiRemoveSharingGroupsFunction", vlv.rsi.functions.RemoveSharingGroups);
vlv.rsi.functions.RemoveUsersFromSharingGroup = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "RemoveUsersFromSharingGroup";
  this.$http = $http
};
vlv.rsi.functions.RemoveUsersFromSharingGroup.prototype = new vlv.svcbase;
vlv.rsi.functions.RemoveUsersFromSharingGroup.prototype.constructor = vlv.rsi.functions.RemoveUsersFromSharingGroup;
vlv.rsi.functions.RemoveUsersFromSharingGroup.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.RemoveUsersFromSharingGroup["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiRemoveUsersFromSharingGroupFunction", vlv.rsi.functions.RemoveUsersFromSharingGroup);
vlv.rsi.functions.RenderedDocumentUrl = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "RenderedDocumentUrl";
  this.$http = $http
};
vlv.rsi.functions.RenderedDocumentUrl.prototype = new vlv.svcbase;
vlv.rsi.functions.RenderedDocumentUrl.prototype.constructor = vlv.rsi.functions.RenderedDocumentUrl;
vlv.rsi.functions.RenderedDocumentUrl.prototype.call = function(params) {
  params = params || new vlv.rsi.params.RenderedDocumentUrlParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.RenderedDocumentUrl["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiRenderedDocumentUrlFunction", vlv.rsi.functions.RenderedDocumentUrl);
vlv.rsi.functions.ReplaceUsersInSharingGroup = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "ReplaceUsersInSharingGroup";
  this.$http = $http
};
vlv.rsi.functions.ReplaceUsersInSharingGroup.prototype = new vlv.svcbase;
vlv.rsi.functions.ReplaceUsersInSharingGroup.prototype.constructor = vlv.rsi.functions.ReplaceUsersInSharingGroup;
vlv.rsi.functions.ReplaceUsersInSharingGroup.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.ReplaceUsersInSharingGroup["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiReplaceUsersInSharingGroupFunction", vlv.rsi.functions.ReplaceUsersInSharingGroup);
vlv.rsi.functions.SaveDocument = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SaveDocument";
  this.$http = $http
};
vlv.rsi.functions.SaveDocument.prototype = new vlv.svcbase;
vlv.rsi.functions.SaveDocument.prototype.constructor = vlv.rsi.functions.SaveDocument;
vlv.rsi.functions.SaveDocument.prototype.call = function(params) {
  params = params || new vlv.rsi.params.SaveDocumentParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.SaveDocument["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSaveDocumentFunction", vlv.rsi.functions.SaveDocument);
vlv.rsi.functions.SaveUserConfiguration = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SaveUserConfiguration";
  this.$http = $http
};
vlv.rsi.functions.SaveUserConfiguration.prototype = new vlv.svcbase;
vlv.rsi.functions.SaveUserConfiguration.prototype.constructor = vlv.rsi.functions.SaveUserConfiguration;
vlv.rsi.functions.SaveUserConfiguration.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.SaveUserConfiguration["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSaveUserConfigurationFunction", vlv.rsi.functions.SaveUserConfiguration);
vlv.rsi.functions.Search = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "Search";
  this.$http = $http
};
vlv.rsi.functions.Search.prototype = new vlv.svcbase;
vlv.rsi.functions.Search.prototype.constructor = vlv.rsi.functions.Search;
vlv.rsi.functions.Search.prototype.call = function(params) {
  params = params || new vlv.rsi.params.SearchParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.Search["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchFunction", vlv.rsi.functions.Search);
vlv.rsi.functions.SearchConfiguration = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchConfiguration";
  this.$http = $http
};
vlv.rsi.functions.SearchConfiguration.prototype = new vlv.svcbase;
vlv.rsi.functions.SearchConfiguration.prototype.constructor = vlv.rsi.functions.SearchConfiguration;
vlv.rsi.functions.SearchConfiguration.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.SearchConfiguration["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchConfigurationFunction", vlv.rsi.functions.SearchConfiguration);
vlv.rsi.functions.SearchContentModuleTitles = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchContentModuleTitles";
  this.$http = $http
};
vlv.rsi.functions.SearchContentModuleTitles.prototype = new vlv.svcbase;
vlv.rsi.functions.SearchContentModuleTitles.prototype.constructor = vlv.rsi.functions.SearchContentModuleTitles;
vlv.rsi.functions.SearchContentModuleTitles.prototype.call = function(params) {
  params = params || new vlv.rsi.params.SearchContentModuleTitlesParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.SearchContentModuleTitles["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchContentModuleTitlesFunction", vlv.rsi.functions.SearchContentModuleTitles);
vlv.rsi.functions.SearchDocumentAnnotations = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchDocumentAnnotations";
  this.$http = $http
};
vlv.rsi.functions.SearchDocumentAnnotations.prototype = new vlv.svcbase;
vlv.rsi.functions.SearchDocumentAnnotations.prototype.constructor = vlv.rsi.functions.SearchDocumentAnnotations;
vlv.rsi.functions.SearchDocumentAnnotations.prototype.call = function(params) {
  params = params || new vlv.rsi.params.SearchDocumentAnnotationsParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.SearchDocumentAnnotations["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchDocumentAnnotationsFunction", vlv.rsi.functions.SearchDocumentAnnotations);
vlv.rsi.functions.SearchResultListItemStream = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchResultListItemStream";
  this.$http = $http
};
vlv.rsi.functions.SearchResultListItemStream.prototype = new vlv.svcbase;
vlv.rsi.functions.SearchResultListItemStream.prototype.constructor = vlv.rsi.functions.SearchResultListItemStream;
vlv.rsi.functions.SearchResultListItemStream.prototype.call = function(params) {
  params = params || new vlv.rsi.params.SearchResultListItemStreamParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.SearchResultListItemStream["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchResultListItemStreamFunction", vlv.rsi.functions.SearchResultListItemStream);
vlv.rsi.functions.SearchSharingGroups = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchSharingGroups";
  this.$http = $http
};
vlv.rsi.functions.SearchSharingGroups.prototype = new vlv.svcbase;
vlv.rsi.functions.SearchSharingGroups.prototype.constructor = vlv.rsi.functions.SearchSharingGroups;
vlv.rsi.functions.SearchSharingGroups.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.SearchSharingGroups["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchSharingGroupsFunction", vlv.rsi.functions.SearchSharingGroups);
vlv.rsi.functions.SearchSuggestions = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchSuggestions";
  this.$http = $http
};
vlv.rsi.functions.SearchSuggestions.prototype = new vlv.svcbase;
vlv.rsi.functions.SearchSuggestions.prototype.constructor = vlv.rsi.functions.SearchSuggestions;
vlv.rsi.functions.SearchSuggestions.prototype.call = function(params) {
  params = params || new vlv.rsi.params.SearchSuggestionsParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.SearchSuggestions["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchSuggestionsFunction", vlv.rsi.functions.SearchSuggestions);
vlv.rsi.functions.SearchUserConfiguration = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SearchUserConfiguration";
  this.$http = $http
};
vlv.rsi.functions.SearchUserConfiguration.prototype = new vlv.svcbase;
vlv.rsi.functions.SearchUserConfiguration.prototype.constructor = vlv.rsi.functions.SearchUserConfiguration;
vlv.rsi.functions.SearchUserConfiguration.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.SearchUserConfiguration["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSearchUserConfigurationFunction", vlv.rsi.functions.SearchUserConfiguration);
vlv.rsi.functions.SelectAllUserTrackerTopics = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SelectAllUserTrackerTopics";
  this.$http = $http
};
vlv.rsi.functions.SelectAllUserTrackerTopics.prototype = new vlv.svcbase;
vlv.rsi.functions.SelectAllUserTrackerTopics.prototype.constructor = vlv.rsi.functions.SelectAllUserTrackerTopics;
vlv.rsi.functions.SelectAllUserTrackerTopics.prototype.call = function(params) {
  params = params || new vlv.rsi.params.SelectAllUserTrackerTopicsParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.SelectAllUserTrackerTopics["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSelectAllUserTrackerTopicsFunction", vlv.rsi.functions.SelectAllUserTrackerTopics);
vlv.rsi.functions.SelectedWorkspace = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SelectedWorkspace";
  this.$http = $http
};
vlv.rsi.functions.SelectedWorkspace.prototype = new vlv.svcbase;
vlv.rsi.functions.SelectedWorkspace.prototype.constructor = vlv.rsi.functions.SelectedWorkspace;
vlv.rsi.functions.SelectedWorkspace.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.SelectedWorkspace["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSelectedWorkspaceFunction", vlv.rsi.functions.SelectedWorkspace);
vlv.rsi.functions.SelectUserTrackerTopics = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SelectUserTrackerTopics";
  this.$http = $http
};
vlv.rsi.functions.SelectUserTrackerTopics.prototype = new vlv.svcbase;
vlv.rsi.functions.SelectUserTrackerTopics.prototype.constructor = vlv.rsi.functions.SelectUserTrackerTopics;
vlv.rsi.functions.SelectUserTrackerTopics.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.SelectUserTrackerTopics["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSelectUserTrackerTopicsFunction", vlv.rsi.functions.SelectUserTrackerTopics);
vlv.rsi.functions.SetDefaultAlertConfiguration = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SetDefaultAlertConfiguration";
  this.$http = $http
};
vlv.rsi.functions.SetDefaultAlertConfiguration.prototype = new vlv.svcbase;
vlv.rsi.functions.SetDefaultAlertConfiguration.prototype.constructor = vlv.rsi.functions.SetDefaultAlertConfiguration;
vlv.rsi.functions.SetDefaultAlertConfiguration.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.SetDefaultAlertConfiguration["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSetDefaultAlertConfigurationFunction", vlv.rsi.functions.SetDefaultAlertConfiguration);
vlv.rsi.functions.SetDeliveryPreferences = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SetDeliveryPreferences";
  this.$http = $http
};
vlv.rsi.functions.SetDeliveryPreferences.prototype = new vlv.svcbase;
vlv.rsi.functions.SetDeliveryPreferences.prototype.constructor = vlv.rsi.functions.SetDeliveryPreferences;
vlv.rsi.functions.SetDeliveryPreferences.prototype.call = function(params) {
  params = params || new vlv.common.odataParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.SetDeliveryPreferences["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSetDeliveryPreferencesFunction", vlv.rsi.functions.SetDeliveryPreferences);
vlv.rsi.functions.SetSelectedWorkspace = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SetSelectedWorkspace";
  this.$http = $http
};
vlv.rsi.functions.SetSelectedWorkspace.prototype = new vlv.svcbase;
vlv.rsi.functions.SetSelectedWorkspace.prototype.constructor = vlv.rsi.functions.SetSelectedWorkspace;
vlv.rsi.functions.SetSelectedWorkspace.prototype.call = function(params) {
  params = params || new vlv.rsi.params.SetSelectedWorkspaceParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.SetSelectedWorkspace["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSetSelectedWorkspaceFunction", vlv.rsi.functions.SetSelectedWorkspace);
vlv.rsi.functions.SharePersonalItem = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SharePersonalItem";
  this.$http = $http
};
vlv.rsi.functions.SharePersonalItem.prototype = new vlv.svcbase;
vlv.rsi.functions.SharePersonalItem.prototype.constructor = vlv.rsi.functions.SharePersonalItem;
vlv.rsi.functions.SharePersonalItem.prototype.call = function(params) {
  params = params || new vlv.rsi.params.SharePersonalItemParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.SharePersonalItem["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSharePersonalItemFunction", vlv.rsi.functions.SharePersonalItem);
vlv.rsi.functions.SharePersonalItemWithAll = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "SharePersonalItemWithAll";
  this.$http = $http
};
vlv.rsi.functions.SharePersonalItemWithAll.prototype = new vlv.svcbase;
vlv.rsi.functions.SharePersonalItemWithAll.prototype.constructor = vlv.rsi.functions.SharePersonalItemWithAll;
vlv.rsi.functions.SharePersonalItemWithAll.prototype.call = function(params) {
  params = params || new vlv.rsi.params.SharePersonalItemWithAllParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.SharePersonalItemWithAll["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiSharePersonalItemWithAllFunction", vlv.rsi.functions.SharePersonalItemWithAll);
vlv.rsi.functions.UnhidePersonalItems = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "UnhidePersonalItems";
  this.$http = $http
};
vlv.rsi.functions.UnhidePersonalItems.prototype = new vlv.svcbase;
vlv.rsi.functions.UnhidePersonalItems.prototype.constructor = vlv.rsi.functions.UnhidePersonalItems;
vlv.rsi.functions.UnhidePersonalItems.prototype.call = function(params) {
  params = params || new vlv.rsi.params.UnhidePersonalItemsParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.UnhidePersonalItems["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiUnhidePersonalItemsFunction", vlv.rsi.functions.UnhidePersonalItems);
vlv.rsi.functions.UnsharePersonalItem = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "UnsharePersonalItem";
  this.$http = $http
};
vlv.rsi.functions.UnsharePersonalItem.prototype = new vlv.svcbase;
vlv.rsi.functions.UnsharePersonalItem.prototype.constructor = vlv.rsi.functions.UnsharePersonalItem;
vlv.rsi.functions.UnsharePersonalItem.prototype.call = function(params) {
  params = params || new vlv.rsi.params.UnsharePersonalItemParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.UnsharePersonalItem["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiUnsharePersonalItemFunction", vlv.rsi.functions.UnsharePersonalItem);
vlv.rsi.functions.UnsharePersonalItemWithAll = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "UnsharePersonalItemWithAll";
  this.$http = $http
};
vlv.rsi.functions.UnsharePersonalItemWithAll.prototype = new vlv.svcbase;
vlv.rsi.functions.UnsharePersonalItemWithAll.prototype.constructor = vlv.rsi.functions.UnsharePersonalItemWithAll;
vlv.rsi.functions.UnsharePersonalItemWithAll.prototype.call = function(params) {
  params = params || new vlv.rsi.params.UnsharePersonalItemWithAllParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.UnsharePersonalItemWithAll["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiUnsharePersonalItemWithAllFunction", vlv.rsi.functions.UnsharePersonalItemWithAll);
vlv.rsi.functions.Workspace = function($velvetConfig, $http) {
  vlv.svcbase.call(this, "rsi-v1", $velvetConfig, $http);
  this.path = "Workspace";
  this.$http = $http
};
vlv.rsi.functions.Workspace.prototype = new vlv.svcbase;
vlv.rsi.functions.Workspace.prototype.constructor = vlv.rsi.functions.Workspace;
vlv.rsi.functions.Workspace.prototype.call = function(params) {
  params = params || new vlv.rsi.params.WorkspaceParams;
  var res = "/" + this.path + params.asString();
  return this.get(res)
};
vlv.rsi.functions.Workspace["$inject"] = ["$velvetConfig", "$http"];
velvet.service("vlvRsiWorkspaceFunction", vlv.rsi.functions.Workspace);
vlv.rsi.functions.DocumentStream.prototype.$value = function(id, channelId) {
  var query = this.path + "/$value?documentId=" + id;
  if(channelId) {
    query += "&channelId='" + channelId + "'"
  }else {
    query += "&channelId='owl-embeded-v2'"
  }
  return this.get(query)
};
vlv.rsi.functions.Search.prototype.SearchExpand = "Result/FilterTrees/Root/Children";
vlv.rsi.functions.Search.prototype.SearchClusteredExpand = "ClusterResult/Clusters/Items";
vlv.rsi.functions.Search.prototype.searchByPhrase = function(phrase, isClustered) {
  var searchParams = new vlv.rsi.params.SearchParams;
  searchParams["clustered"] = isClustered;
  searchParams["query"] = phrase;
  searchParams["$expand"] = isClustered ? this.SearchClusteredExpand : this.SearchExpand;
  return this.call(searchParams)
};

})();