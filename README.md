# whereversim-map

This is a quick demo to show off how to map Lat & Long in Cloudant from a remote device sending it's location via the [whereverSIM](https://whatevermobile.com/iot/) Network.

## Setup

### Requirements
1. Node environment
2. whereverSIM & account, you can get one by signing up at https://whatevermobile.com/iot/
3. IBM Cloudant account

### Instructions

To start with you will need the `.env` to hold all the local variables. The fastest way to accomplish this is to duplicate the `.env.example` file.

```sh
cp .env.example .env
```

You'll also need to do the obligatory `npm i` at this point.

To allow the script to communicate with whereverSIM you'll need to add the following.
