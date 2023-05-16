# Client Extension Deep Dive Workshop Script

## Before Workshop

1. Download deep-dive-workspace.zip
   https://drive.google.com/file/d/1Ni5an-vf4tPBXM6nsgJjxTyz_Vs1DMYt/view
   and upzip

   OR

   Copy from our USB keys

   OR

   Clone repo:
   `git clone https://github.com/LiferayCloud/client-extensions-deep-dive-devcon-2023.git`
      TODO: add release tag
   Setup the bundle
      `./gradlew initBundle`


1. Change into workspace
   `cd client-extensions-deep-dive-devcon-2023`
1. Start DXP
   `./bundles/tomcat-9.0.73/bin/catalina.(cmd|sh) run`
1. Build all projects
   `./gradlew build`

## Workshop Exercise

### Raw steps

```bash
# intro
# screen capture of the working app, describe use case requirement for
# documentation referral and corporate style
# persistence
# fontend
# objectaction

# show existing pick lists (empty)

./gradlew :client-extensions:list-type-batch:deploy

# show the new pick list

# discuss object definitions

# without object action
./gradlew :client-extensions:ticket-batch:deploy

# show the new ticket object
# describe the ticket headless API

./gradlew :client-extensions:ticket-entry-batch:deploy

# Optional??

# show the ticket data

# describe that some CX are activated during deployment and others registered
# during deployment. These need to be configured before use...

# show unmodified page

./gradlew :client-extensions:current-tickets-custom-element:deploy

# place current-tickets-custom-element on the home page
# show the app, explain here it's using the ticket headless API
# add new ticket (also control panel menu)
# dig into the BYOF (bring your own frontend) aspect of the custom element
# client extension

# discuss style in general

./gradlew :client-extensions:tickets-theme-css:deploy

# optional???

# add tickets-theme-css to the home page
# discuss scope of configuration

# talk about the requirement for the document referral feature, adding business
# logic, summarize OAuth2

# in a separate terminal run (boiler plate logic)
(cd client-extensions/ticket-spring-boot/ && ../../gradlew deploy bootRun)

# show the route
# demonstrate API POST with curl, wget returns 401
# explain JWT/OAuth2

# show modification to the object definition (active: true)
./gradlew :client-extensions:ticket-batch:deploy
# deploy idempotency

# use the ticket app to add a new ticket
# show that the spring boot route is executed

# modify spring boot app with new custom ticket document referral logic
terminate the spring boot processs
(cd client-extensions/ticket-spring-boot/ && ../../gradlew deploy bootRun)

# create a new ticket
# demonstrate the ticket changes


```

### Part 1

### Part 2

### Part 3

## FAQ