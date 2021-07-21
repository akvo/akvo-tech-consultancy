git clone git@github.com:akvo/akvo-flow-server-config.git
echo 'bucket,service,instances' > ./data/flow-survey-amazon-aws.csv
list=$(find ./akvo-flow-server-config -type f -name appengine-web.xml \
    -maxdepth 2 -mindepth 2 \
    -exec echo {} \; 2>/dev/null)
for word in ${list};
do
    service=$(cat ${word} \
        | grep "<application>" \
        | sed 's/<.*>\(.*\)<.*>/\1/' \
        | sed 's/\ //g')
    bucket=$(cat ${word} | grep s3bucket \
        | sed 's/.*value="\([^"]*\).*/\1/')
    instance=$(cat ${word} | grep alias \
        | sed 's/.*value="\([^"]*\).*/\1/' \
        | cut -d '.' -f 1)
    echo "${bucket},${service},${instance}" | sed 's/\ //g' >> ./data/flow-survey-amazon-aws.csv;
done;

rm -rf akvo-flow-server-config
