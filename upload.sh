# copy _next and static folders, and make the files immutable
S3_BUCKET="undicat-web"
aws s3 cp ./out/_next s3://$S3_BUCKET/_next \
  --cache-control immutable,max-age=100000000,public \
  --recursive \
  --profile undicat

aws s3 cp ./static/ s3://$S3_BUCKET/static/ \
  --cache-control immutable,max-age=100000000,public \
  --recursive \
  --profile undicat

# copy the out folder, and make the files never cached.
# NOTE: there is a bug in AWS. If you copy a file that has been
# uploaded as immutable using aws cp and try to modify its cache-control
# metadata, it will retain its old metadata. Hence, we can't just do
# aws s3 cp ./out s3://$S3_BUCKET
aws s3 cp ./out s3://$S3_BUCKET \
  --cache-control max-age=0,no-cache \
  --recursive \
  --profile undicat
  
# Now, we've uploaded out/$GITHASH/about/index.html to
# builds/$GITHASH/about/index.html
# But, s3 is stupid. When you request /about (without the terminal slash),
# it will only look for /about (no extension). So, we need a separate step
# to upload the html files redundantly. :)
(cd out &&
  find . -type f -name '*.html' | while read HTMLFILE; do
    HTMLFILESHORT=${HTMLFILE:2}
    echo $HTMLFILESHORT
    HTMLFILE_WITHOUT_INDEX=${HTMLFILESHORT::${#HTMLFILESHORT}-5}

    # cp /about/index.html to /about
    aws s3 cp s3://$S3_BUCKET/${HTMLFILESHORT} \
      s3://$S3_BUCKET/$HTMLFILE_WITHOUT_INDEX \
      --profile undicat

    if [ $? -ne 0 ]; then
      echo "***** Failed renaming build to $S3_BUCKET (html)"
      exit 1
    fi
  done)

# locally, we can't have a file named about and a folder named about/ in the
# same directory. Hence, we have to do a lot of individual copies.
# This step takes up a lot of time, but there's not much else we can do.
#
# These files need Content-Type: text/html metadata, which they inherit from
# the original files.