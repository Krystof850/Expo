# EAS Build Setup Guide

## Prerequisites

### 1. Account Verification
Check which account you're logged in with:
```bash
expo whoami
eas whoami
```

### 2. Project Owner Verification
The project should be owned by: **pepahruby08**  
If you're logged in as different user, run:
```bash
eas login
```

## Project Linking

### 1. Get Project ID from Expo Dev
1. Go to [expo.dev](https://expo.dev)
2. Navigate to your **Unoop** project under **pepahruby08** account
3. Copy the Project ID (UUID format) from project settings

### 2. Set Environment Variable
Create `.env` file in project root:
```bash
EAS_PROJECT_ID=your-project-id-here
```

### 3. Re-initialize EAS Project (if needed)
If you get "Entity not authorized" errors:
```bash
# Clear any existing project links
rm -rf .eas/

# Re-initialize
eas init
```

## Building

### Development Build for iOS
```bash
eas build -p ios --profile development
```

### Production Build
```bash
eas build -p ios --profile production
eas build -p android --profile production
```

## Troubleshooting

### "Entity not authorized" Error
This means the local project is linked to wrong owner/project:
1. Verify correct account: `eas whoami`
2. Check project ID matches expo.dev
3. Re-run `eas init` if needed

### Missing Project ID
If build fails with missing projectId:
1. Ensure `EAS_PROJECT_ID` is set in `.env`
2. Verify the UUID format is correct
3. Check the project exists on expo.dev

### Bundle Identifier Issues
Bundle IDs are fixed and should not be changed:
- iOS: `com.unoop.app`
- Android: `com.unoop.app`