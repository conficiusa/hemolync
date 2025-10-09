# SSE Debug Mode Instructions

## Enable Debug Mode

To enable SSE debug logging, run this in your browser console:

```javascript
localStorage.setItem('DEBUG_SSE', 'true')
```

Then refresh the page to see detailed SSE connection logs.

## Disable Debug Mode

To disable debug logging:

```javascript
localStorage.setItem('DEBUG_SSE', 'false')
```

## Expected Debug Output

With debug mode enabled, you should see logs like:

```
[SSE Debug] [12:34:56.789] [CONNECT] Starting connection to /notifications/sse/stream
[SSE Debug] [12:34:56.890] [OPEN] SSE connection opened successfully
[SSE Debug] [12:34:56.891] [ERROR] SSE error event fired, ReadyState: 0, CurrentState: connected
[SSE Debug] [12:34:56.891] [INFO] Ignoring error event during CONNECTING state (normal behavior)
```

## Key Fix Applied

The main fix implemented is in the `handleError` method of the SSE client:

- **Before**: All error events triggered reconnection
- **After**: Only error events when connection is OPEN or CLOSED trigger reconnection
- **Result**: Error events during CONNECTING state (readyState 0) are ignored as they are normal behavior

This should eliminate the infinite reconnection loop you were experiencing.
