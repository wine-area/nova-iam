# Demo Sub-Application

This is a demo micro-frontend sub-application that demonstrates the integration capabilities of the Nova IAM micro-frontend architecture using Qiankun.

## Features

- **Independent Development**: Can be developed and deployed independently
- **Token Sharing**: Receives authentication tokens from the main application
- **Style Isolation**: CSS styles are isolated from the main application
- **React-based**: Built with React and Ant Design for UI consistency

## Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3001`.

## Integration

This sub-application is designed to be loaded by the Nova IAM main application as a micro-frontend. It exposes the following lifecycle hooks:

- `bootstrap`: Called when the application is first loaded
- `mount`: Called when the application is mounted into the DOM
- `unmount`: Called when the application is unmounted from the DOM

## Props

The main application passes the following props to this sub-application:

- `token`: JWT authentication token
- `user`: Current user information
- `services`: Shared services from the main application

## Routes

- `/dashboard`: Main dashboard with authentication info and demo features
- `/profile`: User profile page displaying passed user information

## Configuration

The application is configured as a Qiankun slave application in `config/config.ts`:

```typescript
qiankun: {
  slave: {},
},
```

This enables the micro-frontend capabilities and proper integration with the main application.