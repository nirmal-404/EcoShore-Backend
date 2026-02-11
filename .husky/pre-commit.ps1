try {
    & npm run prettier
    exit $LASTEXITCODE
} catch {
    Write-Error "pre-commit failed: $_"
    exit 1
}
