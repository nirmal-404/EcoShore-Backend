try {
    npx --no -- commitlint --edit $args[0]
    exit $LASTEXITCODE
} catch {
    Write-Error "commit-msg failed: $_"
    exit 1
}
