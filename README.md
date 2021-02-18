# chatterus-backend
Node.js microservice for chatterus application.

## Technologies Used
* Node.js
* Express
* TypeScript
* Docker
* ClickUp
* AWS ECS, EC2, and ECR

## Deployment Process
1. See this [blog](https://www.freecodecamp.org/news/how-to-deploy-a-node-js-application-to-amazon-web-services-using-docker-81c2a2d7225b/)
2. When deploying to Heroku (stage):
    * Always check that the branch name in `stage.yml` matches the auto-generated branch name for the task in ClickUp.
3. When done with deploying to AWS (production):
    * Make sure to delete AWS ECS and then EC2 to avoid being billed for extra running hours of ECS and EC2.