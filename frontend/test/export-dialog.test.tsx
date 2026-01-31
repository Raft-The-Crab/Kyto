import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { ExportDialog } from '@/components/export/ExportDialog'
import { apiClient } from '@/services/api'

vi.mock('@/services/api', () => ({
  apiClient: {
    exportBot: vi.fn().mockResolvedValue({ data: { files: [{ path: 'index.js', content: 'console.log(1)' }], instructions: 'ok' } }),
    exportPreview: vi.fn().mockResolvedValue({ data: { files: [{ path: 'index.js', size: 10, preview: 'console.log(1)', issues: [] }] } }),
    exportZip: vi.fn().mockResolvedValue({ blob: new Blob(['PK']) }),
  },
}))

describe('ExportDialog', () => {
  it('shows preview when clicking preview', async () => {
    render(<ExportDialog open={true} onClose={() => {}} canvas={{}} settings={{}} />)

    const previewBtn = screen.getByRole('button', { name: /Preview/i })
    fireEvent.click(previewBtn)

    await waitFor(() => expect(screen.getByText(/Export Preview/i)).toBeInTheDocument())
  })

  it('generates and shows files on generate', async () => {
    render(<ExportDialog open={true} onClose={() => {}} canvas={{}} settings={{}} />)
    const genBtn = screen.getByRole('button', { name: /Generate Code/i })
    fireEvent.click(genBtn)

    await waitFor(() => expect(screen.getByText(/Generated Files/i)).toBeInTheDocument())
    expect(screen.getByText(/index.js/)).toBeInTheDocument()
  })
})