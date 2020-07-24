# in order to run this service locally:

CASSANDRA_URL=localhost CASSANDRA_PORT=9042 CASSANDRA_USERNAME=cassandra CASSANDRA_PASSWORD=cassandra CASSANDRA_KEYSPACE=users CASSANDRA_DATA_CENTER=datacenter1 npm start

# in order to run Cassandra locally on windows (no Docker):

1. go to "C:\Program Files\apache-cassandra-3.11.6\bin>"
2. run `cassandra.bat -f`
