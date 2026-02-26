from this playlist: https://www.youtube.com/watch?v=zPYfT9azdK8&list=PLxhvVyxYRviZd1oEA9nmnilY3PhVrt4nj&index=1&pp=iAQB

XSS and Authorization:
- There are 3 types of XSS: reflected, stored, and DOM
- Where does input go? Stored in a database? Placed directly into a tag?
- Any input can potentially be exploited
- Quick references to test for XSS potential
  - `"><h1>test</h1>`
  - `'+alert(1);+'`
  - `"onmouseover="alert(1)`
  - `http://"onmouseover="alert(1)`
- These quick tests are to check if there are any areas where user-given input are simply placed inside html without any escaping
- To see how special characters are handled, try `'<>:;"`
- If you can get `<>` through, then try to embed a script tag
- If you can't get `<>` through, then try to embed a DOM event like `onmouseover`

SQL Injection and Friends:
- SQL Injection, Command Injection, Directory Traversal
- Directory Traversal takes advantage of the two special directories `.` and `..`
- You can just walk up to the root file and then read something like `/etc/passwd`
- If this is possible, then it is also normally possible to upload a file with the special directories so you can overwrite files
- Command Injection is possible where user input is put directly into a subprocess and exec'ed commands
- If the input is not scrubbed, then you can potentially take over the system by being allowed to run commands
- SQL Injection is possible where user input is built directly into SQL queries
- Some quick checks for SQLi are:
  - `' OR 1='1 --`
  - `' AND 0='1 --`
- Blind SQLi is when the result of the query is not directly shown to you
- There are two types of blind SQLi:
  - Oracles where you get back a binary condition of the query's success (logins)
  - Truly blind where you do not get to see the query's results

Clickjacking:


