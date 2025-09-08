# GitHub Copilot Instructions for daikin-controller-cloud

## Project Overview

This is a TypeScript library for interacting with Daikin Cloud devices through the Daikin Onecta API. The library provides an abstraction layer over OpenID Connect (OIDC) authentication flows and facilitates device control via the cloud.

## Architecture & Design Patterns

### Core Components
- **DaikinCloudController**: Main entry point for cloud interactions, extends EventEmitter
- **DaikinCloudDevice**: Represents individual devices, also extends EventEmitter  
- **OnectaClient**: Handles OIDC authentication and API communication
- **Rate Limiting**: Critical - API has 200 requests/day limit, must be respected

### Key Patterns
- **Event-Driven Architecture**: All major components extend EventEmitter and emit typed events
- **Promise-based API**: All async operations return Promises, no callback patterns
- **Type Safety**: Comprehensive TypeScript types with strict mode enabled
- **Error Handling**: Custom error classes like `RateLimitedError` with retry information

## Code Style & Standards

### TypeScript Configuration
- Target: `esnext` with CommonJS modules
- Strict mode enabled with full type checking
- Node.js 18.2+ minimum requirement
- Output to `./dist` directory

### ESLint Rules (must follow)
- **Indentation**: 4 spaces (no tabs)
- **Quotes**: Single quotes preferred, template literals allowed
- **Semicolons**: Required at end of statements
- **No trailing spaces**
- **Prefer const over let/var**

### File Structure
```
src/
├── index.ts          # Main exports
├── device.ts         # Device management
├── example.ts        # Usage examples
└── onecta/          # OIDC implementation
    ├── oidc-client.ts
    ├── oidc-callback-server.ts
    └── oidc-utils.ts
```

## API Design Guidelines

### Rate Limiting (CRITICAL)
- Respect 200 requests/day API limit
- Use `retryAfter` property from `RateLimitedError` 
- Emit `rate_limit_status` events for monitoring
- Batch operations when possible to conserve requests

### Event Patterns
```typescript
// Emit typed events with proper interfaces
interface ComponentEvents {
    "event_name": [param1: Type, param2: Type];
}

class Component extends EventEmitter<ComponentEvents> {
    // Implementation
}
```

### Error Handling
- Extend base Error class for custom errors
- Include contextual information (e.g., `retryAfter` for rate limits)
- Use descriptive error messages
- Don't catch errors unless you can handle them meaningfully

### Authentication Flow
- Use OIDC Authorization Code flow
- Store tokens securely (file-based by default)
- Handle token refresh automatically  
- Emit events for authorization requests

## Documentation Standards

### JSDoc Requirements
- Document all public methods and classes
- Include `@param` for all parameters with types
- Include `@returns` for return values
- Add `@throws` for possible exceptions
- Use `@example` for complex APIs

Example:
```typescript
/**
 * Get array of DaikinCloudDevice objects to interact with the device and get data
 * @returns {Promise<DaikinCloudDevice[]>} Array of devices
 * @throws {RateLimitedError} When API rate limit is exceeded
 */
```

### README Patterns
- Include rate limiting warnings prominently
- Provide complete setup instructions with prerequisites
- Show practical examples
- Document environment variables and configuration

## Testing Guidelines

### Current State
- No formal test suite currently exists
- Manual testing via example scripts
- Build validation through TypeScript compilation

### When Adding Tests
- Use Jest or Mocha for consistency with ecosystem
- Mock external API calls to avoid rate limits
- Test error conditions, especially rate limiting
- Include integration tests for OIDC flow

## Security Considerations

### Token Management
- Never log tokens or credentials
- Store tokens in secure, user-controlled locations
- Implement token rotation
- Clear sensitive data from memory when possible

### API Communication
- Use HTTPS only
- Validate SSL certificates
- Handle network timeouts gracefully
- Sanitize user inputs before API calls

## Common Patterns to Follow

### Class Structure
```typescript
export class ComponentName extends EventEmitter<ComponentEvents> {
    #privateField: Type;  // Use private fields syntax
    
    constructor(config: ConfigType) {
        super();
        // Initialize
    }
    
    // Public methods with JSDoc
    async publicMethod(): Promise<ReturnType> {
        // Implementation
    }
}
```

### Configuration Objects
- Use interfaces for configuration
- Provide sensible defaults
- Validate required fields
- Support both file and environment-based config

### Async/Await
- Prefer async/await over .then() chains
- Handle rejections appropriately
- Use Promise.all() for concurrent operations when safe
- Be mindful of rate limits when making concurrent requests

## Dependencies & Imports

### Preferred Libraries
- `openid-client`: For OIDC functionality
- `ip`: For network utilities
- Node.js built-ins: Prefer `node:` prefix (e.g., `node:fs/promises`)

### Import Style
```typescript
// External dependencies
import { TokenSet } from 'openid-client';

// Node.js built-ins with node: prefix
import { readFile } from 'node:fs/promises';
import { EventEmitter } from 'node:events';

// Local imports with .js extension (for proper ESM compatibility)
import { DaikinCloudDevice } from './device.js';
```

## Performance Considerations

- **Rate Limit Awareness**: Always consider API quota in design decisions
- **Caching**: Cache device data when appropriate to reduce API calls
- **Batching**: Group operations to minimize requests
- **Event Efficiency**: Avoid excessive event emissions in loops

## Debugging & Development

### Logging
- Use structured logging with context
- Log rate limit status changes
- Include request/response correlation IDs
- Don't log sensitive authentication data

### Development Workflow
1. `npm run build` - Compile TypeScript
2. Test with example scripts in controlled manner
3. Monitor rate limit usage during development
4. Use TypeScript strict mode to catch issues early

## Anti-Patterns to Avoid

- ❌ Ignoring rate limits or retry-after headers
- ❌ Using callbacks instead of Promises
- ❌ Logging sensitive tokens or credentials  
- ❌ Synchronous file operations in Node.js
- ❌ Catching errors without proper handling
- ❌ Hard-coding configuration values
- ❌ Using `any` type without justification

## When Contributing

1. Respect the existing code style (ESLint will help)
2. Add proper TypeScript types for new functionality  
3. Update JSDoc documentation for public APIs
4. Consider rate limiting impact of new features
5. Test authentication flows with development credentials
6. Update README.md if adding new public APIs

Remember: This library is used by home automation systems where reliability and proper error handling are critical. Always consider the end-user experience and device control reliability.