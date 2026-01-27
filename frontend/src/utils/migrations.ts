// Safe migration utilities for Kyto v2.0.1
// Purpose: copy old 'botify_*' localStorage keys to 'kyto_*' equivalents

export function runMigrations() {
  try {
    const migratedFlag = 'kyto_migration_v2_0_1_done'
    if (localStorage.getItem(migratedFlag)) return

    const mappings: Array<[string, string]> = [
      ['botify_user_id', 'kyto_user_id'],
      ['botify_tutorial_completed', 'kyto_tutorial_completed'],
      ['botify-onboarding-done', 'kyto-onboarding-done'],
      ['botify_ui_theme', 'kyto_ui_theme'],
      ['botify-theme', 'kyto-theme'],
      ['botify_ui_theme', 'kyto-ui-theme'],
      ['botify-onboarding-done', 'kyto-onboarding-done'],
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

    // Also copy theme storage if present (ThemeProvider keys may vary)
    const themeKeys = ['botify-ui-theme', 'botify-theme']
    for (const k of themeKeys) {
      const v = localStorage.getItem(k)
      if (v && !localStorage.getItem('kyto-ui-theme')) {
        localStorage.setItem('kyto-ui-theme', v)
        migrated = true
        console.log(`[MIGRATION] Copied ${k} -> kyto-ui-theme`)
      }
      if (v && !localStorage.getItem('kyto-theme')) {
        localStorage.setItem('kyto-theme', v)
        migrated = true
        console.log(`[MIGRATION] Copied ${k} -> kyto-theme`)
      }
    }

    if (migrated) {
      localStorage.setItem(migratedFlag, '1')
      console.log('[MIGRATION] Kyto v2.0.1 migration completed')
    } else {
      // Still set flag so we don't repeatedly scan
      localStorage.setItem(migratedFlag, '1')
      console.log('[MIGRATION] Kyto v2.0.1 migration: nothing to migrate')
    }
  } catch (err) {
    console.error('[MIGRATION] Failed to run migrations', err)
  }
}
