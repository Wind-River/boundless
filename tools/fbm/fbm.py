################################################################################
#                                NOTICES                                       #
################################################################################

## Copyright (c) 2020 Wind River Systems, Inc.
##
## Licensed under the Apache License, Version 2.0 (the "License");
## you may not use this file except in compliance with the License.
## You may obtain a copy of the License at:
##       http://www.apache.org/licenses/LICENSE-2.0
## Unless required by applicable law or agreed to in writing,
## software  distributed under the License is distributed on an "AS IS" BASIS,
## WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

################################################################################
#                              DEPENDENCIES                                    #
################################################################################
import argparse
import os
import traceback
import sys
import datetime
import zipfile
################################################################################
#                                   OBJ                                        #
################################################################################
def add_export_parser(subparsers, parent_parser):
  parser = subparsers.add_parser(
    "export", parents=[parent_parser],
    help="exports the zip file of the firebase storage"
  )

  parser.add_argument("SOURCE", type=str, help="firebase storage gs://<bucket>")

  parser.add_argument(
    "-s", "--save", action="store_true",
    help="saves the content on the host machine (default: deletes the content)"
  )
  
  parser.add_argument(
    "-t", "--target", type=str, help="target filename of the zip"
  )

def add_import_parser(subparsers, parent_parser):
  parser = subparsers.add_parser(
    "import", parents=[parent_parser],
    help="import the zip file to the firebase storage"
  )

  parser.add_argument("SOURCE", type=str, help="source zip filename")

  parser.add_argument(
    "TARGET", type=str, help="target gsBucket url. ie. gs://<bucket>"
  )

  parser.add_argument(
    "-p", "--purge", action="store_true",
    help="deletes the storage first before inserting new"
  )
################################################################################
#                              PARSER CREATE                                   #
################################################################################
def create_parent_parser(prog_name):
  parent_parser = argparse.ArgumentParser(prog=prog_name, add_help=False)

  parent_parser.add_argument(
    "-v", "--version",
    action="version",
    version='fbm version 0.0.0.1',
    help="print version information"
  )

  return parent_parser

def create_parser(prog_name):
  parent_parser = create_parent_parser(prog_name)

  parser = argparse.ArgumentParser(
    parents=[parent_parser],
    formatter_class=argparse.RawDescriptionHelpFormatter
  )

  subparsers = parser.add_subparsers(title="subcommands", dest="command")

  add_export_parser(subparsers, parent_parser)
  add_import_parser(subparsers, parent_parser)
  
  return parser
################################################################################
#                               FUNCTIONS                                      #
################################################################################
def do_export(args):
  source = args.SOURCE
  target = args.target if args.target != None else 'boundless'

  time = datetime.datetime.now()
  time = time.strftime("%m.%d.%Y_%H_%M_%S")

  target = "{}_{}".format(target, time)

  print("intiating export...")
  print("generating: {}".format(target))
  os.system(
    "mkdir {} && gsutil.cmd -m cp -R {} ./{}/".format(
      target, source, target
    )
  )

  print("starting the zipping process...")
  output_filename = "{}.{}".format(target, "zip")
  make_zipfile(output_filename, target)

  if not args.save:
    print("deleting the content...")
    os.system("rm -rf {}".format(target))

def do_import(args):
  source = args.SOURCE
  target = args.TARGET

  if ".zip" not in source:
    raise Exception("ERROR: Import file must be a .zip file!")

  print("unzipping the zip file...")
  unzip(source, "./tmpFile")

  # If you want to delete all objects in the bucket,
  # but not the bucket itself, this command will work:
  if args.purge:
    print("purging the storage...")
    os.system("gsutil.cmd -m rm -R {}/**".format(target))

  print("initiating import...")
  os.system(
    "cd {} && ".format("./tmpFile/{}/{}/.".format(source[:-4], target[5:])) +
    "gsutil.cmd -m cp -R . {} && ".format(target) +
    "cd .. && cd .. && cd .. && rm -rf tmpFile/"
  )
################################################################################
#                             HELPER FUNCTIONS                                 #
################################################################################
# https://stackoverflow.com/a/17080988
def make_zipfile(output_filename, source_dir):
  relroot = os.path.abspath(os.path.join(source_dir, os.pardir))
  with zipfile.ZipFile(output_filename, "w", zipfile.ZIP_DEFLATED) as zip:
    for root, dirs, files in os.walk(source_dir):
      # add directory (needed for empty dirs)
      zip.write(root, os.path.relpath(root, relroot))
      for file in files:
        filename = os.path.join(root, file)
        if os.path.isfile(filename): # regular files only
          arcname = os.path.join(os.path.relpath(root, relroot), file)
          zip.write(filename, arcname)

# https://stackoverflow.com/a/19484046
def unzip(source_filename, dest_dir):
  with zipfile.ZipFile(source_filename) as zf:
    zf.extractall(dest_dir)
################################################################################
#                                   MAIN                                       #
################################################################################
def main(prog_name=os.path.basename(sys.argv[0]), args=None):
  if args is None:
    args = sys.argv[1:]
  parser = create_parser(prog_name)
  args = parser.parse_args(args)

  if args.command == "export":
    do_export(args)
    print("\nExport completed sucessfully")
  elif args.command == "import":
    do_import(args)
    print("\nImport completed sucessfully")
  else:
    raise Exception('ERROR: Subcommand does not exist!')
  

def main_wrapper():
  try:
    main()
  except Exception as err:
    print(err)
    sys.exit(1)
  except KeyboardInterrupt:
    pass
  except SystemExit as err:
    raise err
  except BaseException as err:
    traceback.print_exc(file=sys.stderr)
    sys.exit(1)

if __name__ == "__main__":
  main_wrapper()
################################################################################
#                                   END                                        #
################################################################################
