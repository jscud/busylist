Instructions for running the demo application in [revision 6](https://code.google.com/p/busylist/source/detail?r=6).

# Warning: [Revision 6](https://code.google.com/p/busylist/source/detail?r=6) is for testing purposes only. #

# Prerequisites #
You'll need to check out the source code for busylist and for gdata-python-client.
```
svn checkout http://busylist.googlecode.com/svn/trunk/ busylist-read-only
svn checkout http://gdata-python-client.googlecode.com/svn/trunk/ gdata-python-client-read-only
```
Once you've checked these out, you will need to make sure that the gdata packages are accessible from where you are running the busylist server. I recommend installing the gdata-python-client or copying the `gdata` and `atom` directories into the same location as `busy_server.py`.

You need to have some Google Spreadsheets and one of them should contain a worksheet named  "tasks" with the first row containing "description" and "due". This configuration is assumed by the test page.

# Starting the Server #
To start the busylist server, execute `busy_server.py` which is found under `src/server`. You will prompted for your Google account's email address and password. In future versions, your password will not be required. **Anyone who accesses your server will have access to your Google Spreadsheets**. Please run this only for testing purposes on your own machine.

The server will attempt to connect to Google Spreadsheets so an Internet connection is required.

Once the server is up and running it will print:
```
Serving HTTP on 0.0.0.0 port 2879
```

To view the demo test page, point your web browser at http://localhost:2879/api_test.html

# Using the Test Page #
Begin by clicking on "Choose a spreadsheet." and the Google Spreadsheets which belong to the server's account. Your account information was entered when you started the server. **Note: in this revision, all visitors will have access to your Google Spreadsheets.**

Select the spreadsheet which contains your "tasks" worksheet by clicking on the title.

The server will then read the contents of the tasks worksheet, read the "description" and "due" columns, and present this information.

After the list of tasks has been loaded, you can enter new tasks by filling in the "Description:" and "Due:" fields and clicking the "Create Task" button.