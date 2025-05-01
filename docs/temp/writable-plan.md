## TODO :

- remove comments in config.ts

## Rough Plan

- if any write command issued,

  - provide a button to create a session for that user (single click in UI),(through modal popup)
  - better have unassigned sessionId data already created, so user session can be mapped to that unassigned sessionId, if not exists then create new sessionId data
  - Backend generate sessionId, also store sessionId in browser local storage
    - copy all the existing db data & indexes from `pg:` prefix to `sessionId:pg:` prefix
    - Have a last accessed time for that sessionId, if no access from X days then delete that sessionId data

- in GUI any query can have same `pg:` prefix, but backend will prefix it with `sessionId:pg:`, so user view experience is same

- Allow specific write commands only

- they can share new sessionId queries also with others via share link (but now sessionId in queryParams exists)

---

- (p1) DBIndex In UI => they can see all `database indexes` from drop dropdown of that code editor, + icon to create new index with prefix pgSession: only in popup

-(P2) DataSource In UI => they can see all `data sources` from drop dropdown of that code editor, + icon to create upload new data source with prefix pgSession: only

## Redis Key Prefix

- `pg:` : readable datasets
- `pgWritable:` : user session writable datasets
  - `pgWritable:savedQuery:XXX` - move all saved custom queries to this prefix (with or without session)
  - `pgWritable:users:XXX` - new data for users
  - `pgWritable:users:XXX:status` -
    ```json
    {
      "userStatus": "ACTIVE", //UNUSED,ACTIVE, INACTIVE, TO_BE_DELETED
      "lastAccessedDateTime": "2021-01-01 12:00:00" //have ISO 8601 format
    }
    ```

## APIs

- `POST /api/generateNewUserWithData` : Create a new userId, copy all the existing db data & indexes from `pg:` prefix to `pgWritable:users:XXX:pg:` prefix

- `POST /api/getNewUserId` :

  - get UNUSED userId from `pgWritable:users:` (check status) + `generateNewUserWithData` in async for extra UNUSED data + `updateExpiryForUserData`
  - else `generateNewUserWithData` in SYNC + `updateExpiryForUserData`

### Internal methods

- `updateExpiryForUserData` : update TTL for `pgWritable:users:XXX` data
- update `pgRunQuery()` to add proper `pgWritable:users:XXX` key prefix for all queries (if userId is passed in API request)
- update constants to allow specific write commands only
- update share query functionality : they can share new user queries with others via share link (but now userId (u) in queryParams exists for shared URL)

### Note

- Check expiry settings with cody for shared custom query
- Change the redis key prefix of shared custom query
- reduce fashion ds from 10k products to 1k products
- Have a architecture doc for this project which CEO and other tech team can understand

## UI

- Have pop up if any write command issued for first time, which shows some info and button to create new user with data
