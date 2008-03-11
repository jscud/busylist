/*
 * Copyright (C) 2007 Jeffrey Scudder
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Namespace for BusyList JavaScript.
var busylist = {}

/**
 * Makes an HTTP request and sets a callback to be called on state 4.
 *
 * This method copied from the open source q12 library: 
 * http://code.google.com/p/q12/
 *
 * @param {String} httpVerb The HTTP action to perform, typical values
 *     are 'GET', 'POST', 'HEAD', 'PUT', 'DELETE'. 
 * @param {String} data The data to be sent with the request. Optional,
 *     should not be used in a GET, HEAD, or DELETE.
 * @param {String} url The URL to which the request will be made.
 * @param {Object} headers Key value pairs to include in the request as
 *     HTTP headers.
 * @param {Function} handler The funciton to be executed when the server's
 *     response has been fully received.
 */
busylist.httpRequest = function(httpVerb, data, url, headers, handler) {
  var http = null;
  if (window.XMLHttpRequest) {
    http = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    http = new ActiveXObject('Microsoft.XMLHTTP');
  }
  if (http) {
    http.onreadystatechange = function() {
      if (http.readyState == 4) {
        handler(http);
      }
    };
    var propery = null;
    for (property in headers) {
      http.setRequestHeader();
    }
    http.open(httpVerb, url, true);
    http.send(data);
  } else {
    throw new Error('Unable to create the HTTP request object.');
  }
};

/**
 * Asks the server to fetch a list of Google Spreadsheets titles and keys.
 *
 */
busylist.getSpreadsheets = function() {
  busylist.httpRequest('GET', null, '/bin/list', null, 
      busylist.displaySpreadsheets);
  // DEBUG:
  var display = document.getElementById('display');
  display.innerHTML = 'made request';
}

busylist.getTasks = function(spreadsheetId) {
  busylist.httpRequest('GET', null, '/bin/tasks/' + spreadsheetId, null, busylist.displayTasks);
  // DEBUG:
  var display = document.getElementById('display');
  display.innerHTML = 'asked for notes';
}

busylist.displaySpreadsheets = function(data) {
  var spreadsheets = JSON.parse(data.responseText);
  var display = document.getElementById('display');
  var html = [];
  for (var i = 0; i < spreadsheets.length; i++) {
    html.push('Title: <a onclick="busylist.getTasks(\'');
    html.push(spreadsheets[i].key);
    html.push('\');">');
    html.push(spreadsheets[i].title);
    //html.push(' Key: ');
    //html.push(spreadsheets[i].key);
    //html.push('<a onclick="">Get Notes</a>');
    html.push('</a>');
    html.push('<br/>');
  }
  display.innerHTML = html.join('');
  // DEBUG
  //var debug = document.getElementById('display');
  //debug.innerHTML = 'got it!';
  //alert(data);
  //alert(data.responseText);
}

busylist.displayTasks = function(data) {
  var collection = JSON.parse(data.responseText);
  var display = document.getElementById('display');
  var html = [];
  for (var i = 0; i < collection.tasks.length; i++) {
    html.push('Description: ');
    html.push(collection.tasks[i].description);
    html.push(', Due: ');
    html.push(collection.tasks[i].due);
    html.push('<br/>');
  }
  display.innerHTML = html.join('');
}
