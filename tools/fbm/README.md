# Firebase Manager (fbm)

This is a cli tool which allows the user manage the data inside firebase. For
instance, if the user wants to backup the cloud data to local machine or want
to import data from local machine while maintaining the structure.

Currently, only two sub-commands are supported.
1) export
2) import

The tool is written in Python and following is the brief walk-through of the
tool.
**Note:** for easier session usage inside terminal, you may
`$ alias fbm='python fbm.py'` or write a bash function inside '~/.bashrc'.
```sh
$ python fbm.py -h
usage: fbm.py [-h] [-v] {export,import} ...

optional arguments:
  -h, --help       show this help message and exit
  -v, --version    print version information

subcommands:
  {export,import}
    export         exports the zip file of the firebase storage
    import         import the zip file to the firebase storage
```
Label: Running the '-h' or '--help'

### Export Subcommand
Following is the examples of 'export' subcommand.

```sh
$ python fbm.py export -h
usage: fbm.py export [-h] [-v] [-s] [-t TARGET] SOURCE

positional arguments:
  SOURCE                firebase storage gs://<bucket>

optional arguments:
  -h, --help            show this help message and exit
  -v, --version         print version information
  -s, --save            saves the content on the host machine (default:
                        deletes the content)
  -t TARGET, --target TARGET
                        target filename of the zip
```
Label: Runing '-h' or '--help' with export subcommand

```sh
$ python fbm.py export gs://<bucket>
...
...
Export completed sucessfully
```
Label: Running a default export function without any flag
* **Note:** By default, the zip file generated will be named
'boundless_MM_DD_YY_HH_MM_SS'
* **Note:** By default, only the zip file of the content is stored

Calling with the '-t' would only change the 'boundless' portion of the
filename and still keep date element.
```sh
$ python fbm.py export gs://<bucket> -t {TARGET}
...
...
Export completed sucessfully
```
Label: Running with '-t' and {TARGET} should be replaced with the name of the
file that the user wishes to be zipped in

```sh
$ python fbm.py export gs://<bucket> -t {TARGET} --save
# or
$ python fbm.py export gs://<bucket> -t {TARGET} -s
```
Label: Running with all flag for export function

### Import Subcommand
Following is the examples of 'import' subcommand.

```sh
$ python fbm.py import -h
usage: fbm.py import [-h] [-v] [-p] SOURCE TARGET

positional arguments:
  SOURCE         source zip filename
  TARGET         target gsBucket url. ie. gs://<bucket>

optional arguments:
  -h, --help     show this help message and exit
  -v, --version  print version information
  -p, --purge    deletes the storage first before inserting new
```
Label: Running '-h' or '--help' with import subcommand

```sh
$ python fbm.py import {SOURCE}.zip gs://<bucket>
...
...
Import completed sucessfully
```
Label: Running a default import function without any flag
**NOTE:** By default, the import function will update the existing files with
the old files.

Calling the '-p' allows the user to delete the old files then rewrite with
the source file.
```sh
$ python fbm.py import {SOURCE}.zip gs://<bucket> -p
...
...
Import completed sucessfully
```
Label: Running the import subcommand with '-p' or '--purge' option
