# Chatterus
Website for users to chat with each other.

## Demo
Click [here](https://chatterus.herokuapp.com/) to see demo.

Use test credentials:
* Username: guest123
* Password: guest123

## How To Run In Development
Run the development server with `yarn dev` or `npm run dev`. Make sure to run the [backend](https://github.com/DHua5922/chatterus-backend) too.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To test application in docker, modify `"start"` in `package.json` to `next start`. Then, run `npm run docker-start`. When deploying to staging or production, be sure to change `"start"` back to `next start -p $PORT`.

## Technologies
* Next.js (React framework)
* Material UI
* TypeScript
* HTML5
* CSS3
* Tailwind
* Styled Components
* Redux
* Docker

## Task Completion Process
1. Go to ClickUp and pick a task to complete.
2. Copy the task id without the `#` and create a branch with the name: `CU-[taskId]` where `[taskId]` is the task id in ClickUp.
3. Update the branch name in the stage workflow file to the name of the created branch.
4. See the pull request on GitHub and make sure the title matches the branch name.
4. Create a pull request and wait for the CI/CD process to complete.
5. Request reviews from appropriate members.
6. When all members approve of the pull request, merge the pull request using the `squash and merge` option.
7. Update your code in development environment with the latest code on GitHub by running `git checkout main && git pull`.