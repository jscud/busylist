#!/usr/bin/python
#
# Copyright (C) 2007 Jeffrey Scudder
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Imports for HTTP connection.
import socket
from SocketServer import BaseServer
from BaseHTTPServer import HTTPServer
from SimpleHTTPServer import SimpleHTTPRequestHandler

import urlparse

# Imports to talk to Google Spreadsheets.
import gdata.spreadsheet.text_db
import gdata.docs.service
import gdata.service
import getpass


# Module variables, used initially for ClientLogin, remove
# when we switch to AuthSub.
username = ''
password = ''


class BusyHttpServer(HTTPServer):
  pass


class BusyRequestHandler(SimpleHTTPRequestHandler):
  
  def setup(self):
    self.connection = self.request
    self.rfile = socket._fileobject(self.request, "rb", self.rbufsize)
    self.wfile = socket._fileobject(self.request, "wb", self.wbufsize)
    # Create client for Google Spreadsheets
    self.db = gdata.spreadsheet.text_db.DatabaseClient(username, password)

  def GetAllSpreadsheets(self):
    q = gdata.docs.service.DocumentQuery(categories=['spreadsheet'])
    feed = self.db._GetDocsClient().Query(q.ToUri())
    spreadsheets = []
    for entry in feed.entry:
      id_parts = entry.id.text.split('/')
      spreadsheet_key = id_parts[-1].replace('spreadsheet%3A', '')
      spreadsheets.append((entry.title.text, spreadsheet_key))
    return spreadsheets

  def SendSpreadsheetsList(self):
    item_string = '{title:"%s",key:"%s"}'
    list_string = []
    spreadsheets = self.GetAllSpreadsheets()
    for item in spreadsheets:
      list_string.append(item_string % (item[0], item[1]))
    self.wfile.write('[%s]' % ','.join(list_string))
    
  def do_GET(self):
    # JavaScript calls will be made to URLs which start with bin.
    if self.path.startswith('/bin/list'): 
      self.SendSpreadsheetsList()
      return
    # HTML and JavaScript files will be served out of the docs directory.
    elif self.path == '/':
      index_file = open('docs/index.html')
      self.wfile.write(index_file.read())
      return
    else:
      # Open the file pointed to by the path.
      file_name = 'docs%s' % self.path
      self.wfile.write(open(file_name).read())
    # TODO: the login page need to be completed to work with AuthSub.
    if self.path.startswith('/login'):
      token_present = False
      # Get the AuthSub token
      parameters = urlparse.urlparse(self.path)[4].split('&')
      for parameter in parameters:
        if parameter.startswith('token'):
          token = parameter.split('=')[1]
          print 'token value', token
          token_present = True
      if not token_present:
        print 'No token there'
      self.wfile.write('You are being logged in')

   
def StartServer(handler_class=BusyRequestHandler, 
    server_class=BusyHttpServer):
  server_address = ('', 2879)
  httpd = server_class(server_address, handler_class)
  sa = httpd.socket.getsockname()
  print 'Serving HTTP on', sa[0], 'port', sa[1]
  httpd.serve_forever()


if __name__ == '__main__':
  # Eventually we will use AuthSub authentication, but for
  # now use ClientLogin. Only one Gooogle account will be
  # used on the server when using ClientLogin.
  username = raw_input('Enter Google login email address: ')
  password = getpass.getpass()
  StartServer()
