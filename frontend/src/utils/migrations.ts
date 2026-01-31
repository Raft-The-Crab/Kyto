// Safe migration utilities for Kyto v2.0.3
// Purpose: copy old 'botify_*' localStorage keys to 'kyto_*' equivalents

export function runMigrations() {
  try {
    const migratedFlag = 'kyto_migration_v2_0_3_done'
    if (localStorage.getItem(migratedFlag)) return

    const mappings: Array<[string, string]> = [
      ['botify_user_id', 'kyto_user_id'],
      ['Botify_user_id', 'kyto_user_id'],
      ['botify_tutorial_completed', 'kyto_tutorial_completed'],
      ['Botify_tutorial_completed', 'kyto_tutorial_completed'],
      ['botify-onboarding-done', 'kyto-onboarding-done'],
      ['Botify-onboarding-done', 'kyto-onboarding-done'],
      ['botify_ui_theme', 'kyto-theme'],
      ['Botify_ui_theme', 'kyto-theme'],
      ['botify-theme', 'kyto-theme'],
      ['Botify-theme', 'kyto-theme'],
      ['Botify_snap', 'kyto_snap'],
      ['Botify_grid', 'kyto_grid'],
      ['Botify_monaco_theme', 'kyto_monaco_theme'],
    ]

    let migrated = false

    mappings.forEach(([oldKey, newKey]) => {
      const oldVal = localStorage.getItem(oldKey)
      const newVal = localStorage.getItem(newKey)

      if (oldVal != null && newVal == null) {
        localStorage.setItem(newKey, oldVal)
        migrated = true
        console.log(`[MIGRATION] Copied ${oldKey} -> ${newKey}`)
      }
    })

    // Migrate workspace storage
    const oldStorage = localStorage.getItem('Botify-workspace-storage-v1')
    const newStorage = localStorage.getItem('kyto-workspace-storage-v2')
    if (oldStorage && !newStorage) {
      localStorage.setItem('kyto-workspace-storage-v2', oldStorage)
      migrated = true
      console.log('[MIGRATION] Copied workspace storage to kyto-workspace-storage-v2')
    }

    if (migrated) {
      localStorage.setItem(migratedFlag, '1')
      console.log('[MIGRATION] Kyto v2.0.3 migration completed')
    } else {
      localStorage.setItem(migratedFlag, '1')
      console.log('[MIGRATION] Kyto v2.0.3 migration: nothing to migrate')
    }
  } catch (err) {
    console.error('[MIGRATION] Failed to run migrations', err)
  }
}
