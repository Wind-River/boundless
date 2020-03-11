# Installing gCloud (gsUtil)
[Installation Guide](https://cloud.google.com/storage/docs/gsutil_install)

Once the user has finished with the installation, follow the following cmd
to export out the storage:

```sh
# gs://<bucket_name> can be retrieved from firebase storage or
# google cloud platform
$ gsutil -m cp -R gs://<bucket_name> .

# in gitbash for windows run the following:
$ gsutil.cmd -m cp -R gs://<bucket_name> .
```

Working on naive import testing...
