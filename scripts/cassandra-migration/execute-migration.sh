#!/bin/bash
echo "execute-migration.sh script"
echo "Prepare Cassandra migration config file"

cd scripts/cassandra-migration
if [ ! -d 'node_modules' ];then npm install;fi
cd ../..

sed "s/<CASSANDRA_URL>/$CASSANDRA_URL/g; \
            s/<CASSANDRA_KEYSPACE>/$CASSANDRA_KEYSPACE/g; \
            s/<CASSANDRA_USERNAME>/$CASSANDRA_USERNAME/g; \
            s,<CASSANDRA_PASSWORD>,$CASSANDRA_PASSWORD,g" \
            < ./scripts/cassandra-migration/cassandra_migration_template.json > ./scripts/cassandra-migration/cassandra_migration_config.json

echo "Starting migration - create KEYSPACE if needed"
node ./scripts/cassandra-migration/createKeySpace.js

if [ $? -eq 0 ] ;then
    echo "Keyspace should exist now"
else
    echo "Keyspace doesn't exist. Cannot proceed"
    exit 1
fi

echo "Trying to run cassandra-migration package with the config file created"
cd scripts/cassandra-migration

./node_modules/.bin/cassandra-migration ./cassandra_migration_config.json
if [ $? -eq 0 ]
then
    echo "Successfully migrated"
    code=0
else
    echo "Could not migrate"
    code=1
fi
echo "End of cassandra-migration"
echo $code
exit $code
