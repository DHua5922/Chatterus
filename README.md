# Chatterus
Website for users to chat with each other.

## Technologies
* Next.js
* React
* Material UI
* TypeScript
* HTML5
* CSS3
* Tailwind
* Styled Components
* ClickUp

## Task Completion Process
1. Go to ClickUp and pick a task to complete.
2. Copy the task id without the `#` and create a branch with the name: `CU-[taskId]` where `[taskId]` is the task id in ClickUp.
3. Update the branch name in the stage workflow file to the name of the created branch.
4. See the pull request on GitHub and make sure the title matches the branch name.
4. Create a pull request and wait for the CI/CD process to complete.
5. Request reviews from appropriate members.
6. When all members approve of the pull request, merge the pull request using the `squash and merge` option.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

To test application in docker, modify `"start"` in `package.json` to `next start`. Then, run `npm run docker-start`. When deploying to staging or production, be sure to change `"start"` back to `next start -p $PORT`.