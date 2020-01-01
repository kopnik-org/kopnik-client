# kopnik-client

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Deployment
There are three shell files to deploy kopnik-client:
./build.sh - creates docker image that contains sources and compiled code.
./publish.sh - upload docker image to docker registry
./deploy.sh - interacts with hosted environment ()
