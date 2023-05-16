# Client Extension Deep Dive Workshop Script

## Before Workshop

1. Download deep-dive-workspace.zip
   https://drive.google.com/file/d/1Ni5an-vf4tPBXM6nsgJjxTyz_Vs1DMYt/view
   OR
2. Clone repo:
   `git clone https://github.com/LiferayCloud/client-extensions-deep-dive-devcon-2023.git`
3. Change into workspace and run command
   `cd client-extensions-deep-dive-devcon-2023`
4. Setup the bundle
   `./gradlew initBundle`
5. Start DXP
   `./bundles/tomcat-9.0.73/bin/catalina.sh run`
6. Finish setup wizard
7. Shutdown DXP (Ctrl+C previous command)
8. Build all projects
   `./gradlew build`

## Workshop Exercise

### Raw steps

```bash
./gradlew :client-extensions:list-type-batch:deploy
./gradlew :client-extensions:ticket-batch:deploy
./gradlew :client-extensions:current-tickets-custom-element:deploy
# create page /tickets, widget, single column
# place current-tickets-custom-element on /tickets page
./gradlew :client-extensions:tickets-theme-css:deploy
# add tickets-theme-css to /tickets page
./gradlew :client-extensions:ticket-spring-boot:deploy
# in a separate terminal run
(cd client-extensions/ticket-spring-boot/ && gw bootRun)
./gradlew :client-extensions:ticket-entry-batch:deploy
```

### Part 1

### Part 2

### Part 3

## FAQ