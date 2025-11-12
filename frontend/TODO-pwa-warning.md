# TODO: Resolve PWA generateSW glob pattern warning

- [ ] Analyze the warning and requirements
- [ ] Check contents of frontend/dev-dist for expected files
- [ ] Review PWA/Workbox configuration (vite.config.ts or related)
- [x] Identify root cause (missing build step, misconfiguration, etc.)
- [x] Implement fix (adjust build, glob pattern, or config)
- [ ] Test to confirm warning is resolved

**Status:**  
devOptions.enabled is now set to false in VitePWA config. Warning should be suppressed in development.  
Next: Run the dev server and/or production build to confirm the warning is resolved and PWA works as expected.

---

## Analysis & Solution

**Root Cause:**  
In development mode, Vite serves assets from memory and does not output .js, .css, .html, etc. files to dev-dist. The PWA plugin's devOptions.enabled: true causes generateSW to run in dev-dist, but only the service worker and workbox files are present. The warning is expected and does not affect production builds.

**Recommended Action:**  
- Ignore the warning in development mode.
- For production, ensure the build output is in dist/ and the PWA plugin is correctly configured.
