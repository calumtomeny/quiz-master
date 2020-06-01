[![Build Status](https://tomeny.visualstudio.com/QuizMaster/_apis/build/status/calumtomeny.quiz-master?branchName=master)](https://tomeny.visualstudio.com/QuizMaster/_build/latest?definitionId=12&branchName=master)
# Quick Quiz

A quiz hosting app with the aim to streamline your remote quizzes over video conferencing apps.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them

* [.NET Core 3.1](https://dotnet.microsoft.com/download) - follow the installation instructions for .NET Core 3.1
* [Node.js 12.17](https://nodejs.org/en/) - we recommended you install the LTS version of Node.js

### Installing

After cloning the project and installing the prerequisites follow the step below to get the app up and running locally.

Navigate to the following directory.

```
\quizmaster-client-app
```

Install the dependencies.

```
npm install
```

Run the API and App.

```
npm start
```

Local APP URL: http://localhost:3000/

Local API URL: http://localhost:5000/ 

## Deployment

The latest changes in the master branch are deployed here: http://quick-quiz.azurewebsites.net

## Built With

* [React](https://reactjs.org) - The web framework used
* [Material UI](https://material-ui.com) - Component library
* [.NET Core](https://dotnet.microsoft.com/download) - Used to power the API

## Contributing

We use [Semantic Commit Messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716) to make it easier to track changes. To contribute please make sure there is an associated issue, create a branch from master with your change and submit a pull request associating it with the issue.

