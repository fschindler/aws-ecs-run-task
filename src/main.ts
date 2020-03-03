import * as core from '@actions/core'
import path from 'path'
import fs from 'fs'
import aws from 'aws-sdk'

async function run(): Promise<void> {
  try {
    const ecs = new aws.ECS({
      customUserAgent: 'aws-ecs-run-task-for-github-actions'
    })

    // Get inputs
    const taskFile = core.getInput('task', {required: true})

    // Run the task
    core.debug('Run the task')
    const taskPath = path.isAbsolute(taskFile)
      ? taskFile
      : path.join(process.env.GITHUB_WORKSPACE || '', taskFile)
    const fileContents = fs.readFileSync(taskPath, 'utf8')
    const taskContents = JSON.parse(fileContents)
    await ecs.runTask(taskContents).promise()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
