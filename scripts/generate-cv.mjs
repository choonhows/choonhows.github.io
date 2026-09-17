import { copyFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(projectRoot, 'resume', 'Tan_Chrislyr_CurriculumVitae.tex')
const output = join(projectRoot, 'public', 'Chrislyr-John-Tan-CV.pdf')
const buildDirectory = mkdtempSync(join(tmpdir(), 'chrislyr-cv-'))
const jobName = 'Chrislyr-John-Tan-CV'

try {
  for (let pass = 0; pass < 2; pass += 1) {
    const result = spawnSync(
      'pdflatex',
      [
        '-interaction=nonstopmode',
        '-halt-on-error',
        '-file-line-error',
        `-jobname=${jobName}`,
        `-output-directory=${buildDirectory}`,
        source,
      ],
      { cwd: dirname(source), stdio: 'inherit' },
    )

    if (result.error) throw result.error
    if (result.status !== 0) throw new Error(`pdflatex exited with status ${result.status}`)
  }

  copyFileSync(join(buildDirectory, `${jobName}.pdf`), output)
  console.log(`Generated ${output}`)
} finally {
  rmSync(buildDirectory, { recursive: true, force: true })
}
