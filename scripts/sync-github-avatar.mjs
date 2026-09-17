import { createHash } from 'node:crypto'
import { readFile, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const avatarUrl = 'https://github.com/choonhows.png?size=800'
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const avatarPath = resolve(projectRoot, 'public/profile.jpg')
const temporaryPath = `${avatarPath}.tmp`

const digest = (content) => createHash('sha256').update(content).digest('hex')

async function readCurrentAvatar() {
  try {
    return await readFile(avatarPath)
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

async function downloadAvatar() {
  const response = await fetch(avatarUrl, {
    headers: {
      Accept: 'image/*',
      'User-Agent': 'chrislyr-portfolio-avatar-sync',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(15_000),
  })

  if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}`)

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.startsWith('image/')) throw new Error(`GitHub returned ${contentType || 'an unknown content type'}`)

  const content = Buffer.from(await response.arrayBuffer())
  if (content.length === 0) throw new Error('GitHub returned an empty image')
  if (content.length > 10 * 1024 * 1024) throw new Error('GitHub avatar exceeds the 10 MB safety limit')

  return content
}

async function replaceAvatar(content) {
  await writeFile(temporaryPath, content)

  try {
    await rename(temporaryPath, avatarPath)
  } catch (error) {
    if (error.code !== 'EEXIST' && error.code !== 'EPERM') throw error

    await rm(avatarPath, { force: true })
    await rename(temporaryPath, avatarPath)
  }
}

async function main() {
  const currentAvatar = await readCurrentAvatar()

  try {
    const latestAvatar = await downloadAvatar()

    if (currentAvatar && digest(currentAvatar) === digest(latestAvatar)) {
      console.log('GitHub avatar is already current.')
      return
    }

    await replaceAvatar(latestAvatar)
    console.log(`Updated public/profile.jpg from ${avatarUrl}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    if (currentAvatar) {
      console.warn(`Could not refresh the GitHub avatar (${message}). Keeping the existing profile image.`)
      return
    }

    throw error
  } finally {
    await rm(temporaryPath, { force: true })
  }
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(`Avatar sync failed: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  },
)
