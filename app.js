const fs = require("fs");
const path = require("path");
const inquirer = require('inquirer');

const prompt = inquirer.createPromptModule();

const questions = [
  {
    type: 'input',
    name: 'appName',
    message: "Name of The Application?",
  },
  {
    type: 'input',
    name: 'folderPath',
    message: "Where would you like to create project Folder?",
  },
];

// Function to create directories and files
const createStructure = (base, structure) => {
  Object.keys(structure).forEach((key) => {
    const fullPath = path.join(base, key);

    if (typeof structure[key] === "object") {
      // Create directory and its substructure
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Created directory: ${fullPath}`);
      }
      createStructure(fullPath, structure[key]);
    } else {
      // Create file
      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, structure[key]);
        console.log(`Created file: ${fullPath}`);
      }
    }
  });
};

prompt(questions).then(answers => {
  console.log(`Hi ${JSON.stringify(answers, null, 2)}!`);

  if (answers && answers?.appName) {
    // Define the folder structure
    const structure = {
      [answers.appName]: {
        "src": {
          "config": {
            "default.json": {}
          },
          "controllers": {
            "BaseController.js": `export const BaseController = (req, res) => res.send('Base Controller');`,
          },
          "middlewares": {
            "authMiddleware.js": `export const authMiddleware = (req, res, next) => { console.log('Auth Middleware'); next(); };`,
            "errorHandler.js": `export const errorHandler = (err, req, res, next) => { res.status(500).send('Error!'); };`,
          },
          "models": {
            "BaseModel.js": "// Base model schema",
          },
          "routes": {
            "BaseRoutes.js": `import { Router } from 'express';\nimport { BaseController } from '../controllers/BaseController.js';\nconst router = Router();\nrouter.get('/base', BaseController);\nexport default router;`,
            "index.js": `import BaseRoutes from './BaseRoutes.js'\nexport default [BaseRoutes];`,
          },
          "services": {
            "BaseService.js": "// Base service logic",
          },
          "database": {
            "db.js": "// Base service logic",
          },
          "utils": {
            "hashPassword.js": "// Hash password utility",
            "generateToken.js": "// Token generation utility",
          },
          "validators": {
            "BaseValidator.js": "// User validation logic",
          },
          "tests": {
            "authController.test.js": "// Test cases for auth controller",
            "userService.test.js": "// Test cases for user service",
          },
          "views": {
          },
          "app.js": `import express from 'express';\nimport routes from './routes/index.js';\n\nconst app = express();\napp.use(express.json());\n\nroutes.forEach((route) => app.use(route));\n\napp.listen(3000, () => console.log('Server running on port 3000'));`,
        "logs": {},
        "public": {
          "styles.css": "/* Public styles */",
        },
        "scripts": {
          "seedDatabase.js": "// Script to seed database",
        },
        ".env": "PORT=3000\nDB_URL=mongodb://localhost:27017/user-service",
        "Dockerfile": `# Dockerfile
          FROM node:16
          WORKDIR /app
          COPY package*.json ./
          RUN npm install
          COPY . .
          CMD ["npm", "start"]`,
                ".babelrc": `{
            "presets": ["@babel/preset-env"]
          }`,
          "package.json": `{
            "name": "user-service",
            "version": "1.0.0",
            "main": "app.js",
            "type": "module",
            "scripts": {
              "start": "node dist/app.js",
              "start:dev": "nodemon --exec babel-node app.js",
              "build": "babel src -d dist"
            },
            "dependencies": {
              "express": "^4.18.2",
              "config": "3.3.12"
            },
            "devDependencies": {
              "@babel/cli": "^7.21.0",
              "@babel/core": "^7.21.0",
              "@babel/node": "^7.21.0",
              "@babel/preset-env": "^7.21.0",
              "nodemon": "^2.0.22"
            }
          }`,
            "README.md": "# User Service",
          },
          "deployment": {
            "docker-compose.yml": `version: '3.8'
          services:
            user-service:
              build:
                context: ./user-service
                dockerfile: Dockerfile
              ports:
                - "3000:3000"
              env_file:
                - ./user-service/.env`,
                "kubernetes": {
                  "user-service-deployment.yaml": `apiVersion: apps/v1
          kind: Deployment
          metadata:
            name: user-service
            labels:
              app: user-service
          spec:
            replicas: 3
            selector:
              matchLabels:
                app: user-service
            template:
              metadata:
                labels:
                  app: user-service
              spec:
                containers:
                - name: user-service
                  image: user-service:latest
                  ports:
                  - containerPort: 3000
                  envFrom:
                  - secretRef:
                      name: user-service-secrets`,
                  "ingress.yaml": `apiVersion: networking.k8s.io/v1
            kind: Ingress
            metadata:
              name: user-service-ingress
            spec:
              rules:
              - host: user-service.local
                http:
                  paths:
                  - path: /
                    pathType: Prefix
                    backend:
                      service:
                        name: user-service
                        port:
                          number: 3000`,
                  },
                  "CI-CD": {
                    "jenkinsfile": `pipeline {
              agent any
              stages {
                stage('Build') {
                  steps {
                    sh 'npm run build'
                  }
                }
                stage('Test') {
                  steps {
                    sh 'npm test'
                  }
                }
                stage('Deploy') {
                  steps {
                    sh 'kubectl apply -f deployment/kubernetes/user-service-deployment.yaml'
                  }
                }
              }
            }`,
          },
        },
        ".gitignore": "node_modules/\nlogs/\n.env\ndist/",
        "README.md": "# Microservice Architecture",
      },
    };
    if (fs.existsSync(answers?.folderPath)) {
      createStructure(answers.folderPath, structure);
    } else {
      console.log("Enter Valid Path");
    }
  }
});