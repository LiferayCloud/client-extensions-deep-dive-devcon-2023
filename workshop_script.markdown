# Client Extension Deep Dive Workshop Script

## Before Workshop

1. Download deep-dive-workspace.zip
   https://drive.google.com/file/d/1Ni5an-vf4tPBXM6nsgJjxTyz_Vs1DMYt/view
   and upzip

   **OR**

   Copy workspace from our USB keys

   **OR**

   Clone repo: `git clone https://github.com/LiferayCloud/client-extensions-deep-dive-devcon-2023.git`

   Setup the bundle `./gradlew initBundle`

   **TODO:** add release tag

1. Change into workspace
   `cd client-extensions-deep-dive-devcon-2023`
1. Start DXP
   1. Lin/Mac:

      `./bundles/tomcat-9.0.73/bin/catalina.sh run`
   1. Win:

      `.\bundles\tomcat-9.0.73\bin\catalina.bat run`
1. Login to Liferay

   *Note license activation screen may show but after the license deploys it will disappear*

   After home page shows you will have to refresh the screen once before logging in
1. Build all projects
   `./gradlew build`

## Workshop Exercise

### Introduction

- describe use case requirements:
  - ticket management
  - corporate style
  - algorythmic documentation referral (reduce workload and speedup resolution)

(screen capture of the working app)

### Sections

- Declarative Persistence
- Front-end
- Business Logic

## Declarative Persistence

- show existing pick lists (empty)

```bash
./gradlew :client-extensions:list-type-batch:deploy
```

- show new pick lists

### discuss object definitions

- deploy object definition with object action `"active": false`

```bash
./gradlew :client-extensions:ticket-batch:deploy
```

- show the new ticket object
- describe the ticket headless API

### discuss object entries (tickets)

- deploy some pre-existing tickets

```bash
./gradlew :client-extensions:ticket-entry-batch:deploy
```

- show the ticket entries

## Front-end

- describe that some CX are activated during deployment and others registered during deployment. These need to be configured before use.
- show unmodified page

```bash
./gradlew :client-extensions:current-tickets-custom-element:deploy
```

- place current-tickets-custom-element on the home page
- remove main Grid section and add custom element in place of it
  ![Edit Home Page to Add Custom Element](./edit-home-page.gif)
- show the app, explain here it's using the ticket headless API
- add new ticket (also control panel menu)
- dig into the BYOF (bring your own frontend) aspect of the custom element client extension

### discuss styling in general

```bash
./gradlew :client-extensions:tickets-theme-css:deploy
```

- add tickets-theme-css to the home page
- discuss scope of configuration
  ![Apply Theme to All Pages](./apply-theme.gif)

## Business Logic

- talk about the requirement for the document referral feature
- add business logic
- summarize OAuth2

- in a separate terminal run (boiler plate logic)

```bash
(cd client-extensions/ticket-spring-boot/ && ../../gradlew deploy bootRun)
```

- show the route
- demonstrate API POST with curl, wget returns 401
- explain JWT/OAuth2

- show modification to the object definition (active: true)
- deploy idempotency

```bash
./gradlew :client-extensions:ticket-batch:deploy
```

- use the ticket app to add a new ticket
- show that the spring boot route is executed

- modify spring boot app with new custom ticket document referral logic

- terminate the spring boot process

```bash
<ctrl-c>
(cd client-extensions/ticket-spring-boot/ && ../../gradlew deploy bootRun)
```

- create a new ticket
- demonstrate the ticket changes

## FAQ
