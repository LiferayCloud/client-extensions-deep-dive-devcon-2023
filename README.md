# client-extensions-deep-dive-devcon-2023

Setup

1. Start Liferay and wait for it to be available

2. Deploy the list-type-batch extension

`blade gw clean :client-extensions:list-type-batch:deploy`

3. Deploy the ticket-batch extension

`blade gw clean :client-extensions:ticket-batch:deploy`

4. Deploy the ticket-entry-batch extension

`blade gw clean :client-extensions:ticket-entry-batch:deploy`

5. If everything went correctly, you should now see the Tickets application with one ticket created.