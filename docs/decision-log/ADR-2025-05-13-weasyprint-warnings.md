# Decision: Handling WeasyPrint Warnings

- **Issue**: WeasyPrint generates GLib-GIO warnings in logs about UWP apps, which are distracting but non-critical.

- **Solution**: Set `G_MESSAGES_DEBUG=none` in startup scripts to suppress these warnings.

- **Implementation**:
  ```powershell
  # Set environment variable before starting the backend
  $env:G_MESSAGES_DEBUG="none"
  python -m uvicorn main:app --reload
  ```

## References

- [GLib Message Logging](https://docs.gtk.org/glib/logging.html)
- [WeasyPrint Documentation](https://doc.courtbouillon.org/weasyprint/stable/)
- [GTK on Windows](https://www.gtk.org/docs/installations/windows/) 