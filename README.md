# chatterus-backend
Node.js web service for chat application.

## Technologies Used
* Node.js
* Express
* TypeScript
* MongoDB
* Docker
* AWS ECS, EC2, and ECR

## How To Run
Run `npm run dev`

## Deployment Process
1. See this [blog](https://www.freecodecamp.org/news/how-to-deploy-a-node-js-application-to-amazon-web-services-using-docker-81c2a2d7225b/)
2. When configuring AWS:
    * Make sure to set minimum healthy percent to 0 to avoid issue with not having enough memory for container instance. This issue happens when AWS is trying to create another EC2 instance, which requires more memory. Doing this will result in temporary downtime.
3. When deploying to Heroku (stage):
    * Always check that the branch name in `stage.yml` matches the auto-generated branch name for the task in ClickUp.
4. When done with deploying to AWS (production):
    * Make sure to delete AWS ECS and then EC2 to avoid being billed for extra running hours of ECS and EC2.
