## DynamoDB Notes

- High Availability, Performance, Durability
- Consists of Tables, Items and Attributes
- Query v Scan - for searching. Scan scans through the entire table, last resort. Query lets you run searches based on a primary or secondary index.
- Primary Keys - Partition key is a simple primary key composed of one unique attribute, e.g. user id. Composite Primary Key (partition / sort key) is composed of the partition key and the sort key. E.g. a unique id and a timestamp for filtering. Primary keys must be unique.
- Secondary Index - more querying flexability. Can specify keys other than the primary key, from 1 - 20. Global Secondary Index can be specified on keys different to the primary keys, either just a partition key or a partition key and a sort key.

  - E.g. could have;
  - id - partition key (primary)
  - phone - partition key (GSI #1)
  - ssn - partition key (GSI #2)
  - dateOfBirth - sort key (GSI #2)

- Local Secondary Index - an index that has the same partition key as the table, but a different sort key.
- Read Consistency - when reading there's two types
  - Eventually Consistent Reads, response might not reflect the results of a recently completed write operation. Might not get the most up-to-date data.
  - Strongly Consistent Reads - response will reflect the most up-to-date data. Disadvantages such as unavailability due to network delay or outage, higher latency, not supported on GSI, use more throughput capacity (money).
- Read/Write Capacity Modes - Two modes
  - On-Demand Mode - Flexible, capable of serving thousands of requests per second, no need to plan capacity ahead of time, pay per request basis, elastically adapts to workload, delivery time in single digit millisecond latency.
  - Provisioned Mode - Read and write capacity per second needs to be specified, can specify auto-scaling rules to automatically adjust the capacity, lets you reserve capacity in advance, reducing costs significantly (if you know expected load), capacity specified as Read Capacity Units (RCU) and Write Capacity Units (WCU)
    - Single RCU represents one strongly consistent read per second, or two eventually consistent reads per second, for up to 4KB in size.
    - Single WCU represents one write per second, for an item up to 1 KB in size.
- DynamoDB Streams - Optional feature that allows you to react on new item creation, update or deletion. E.g. when new user is created send a welcome email with SES.
