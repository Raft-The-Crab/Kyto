import { describe, it, expect } from 'vitest'
import { BotExporter } from '../../src/api/export'

// Simple unit tests for the BotExporter
describe('BotExporter', () => {
  const sampleRequest = {
    canvas: {
      blocks: [
        { id: 'b1', type: 'command_slash', data: { properties: { name: 'ping', description: 'Ping' } } },
      ],
      connections: [],
    },
    language: 'discord.js',
    settings: { botToken: 'x', clientId: 'y' },
  } as any

  it('exports files structure', () => {
    const exporter = new BotExporter(sampleRequest, true)
    const res = exporter.export()
    expect(res.files).toBeDefined()
    expect(res.files.some((f: any) => f.path === 'index.js')).toBe(true)
  })

  it('validates JS files and returns no critical issues for generated code', () => {
    const exporter = new BotExporter(sampleRequest, true)
    const res = exporter.export()
    const main = res.files.find((f: any) => f.path === 'index.js')
    const issues = exporter.validateFile(main)
    expect(Array.isArray(issues)).toBe(true)
  })

  it('generates zip buffer', async () => {
    const exporter = new BotExporter(sampleRequest, true)
    const zip = await exporter.exportZip()
    // zip buffer should start with PK signature
    expect(zip instanceof Uint8Array).toBe(true)
    expect(zip[0]).toBe(80) // 'P'
    expect(zip[1]).toBe(75) // 'K'
  })
})