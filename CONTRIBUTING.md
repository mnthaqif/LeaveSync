# Contributing to LeaveSync

Thank you for considering contributing to LeaveSync! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Keep discussions professional

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report:
1. Check existing issues to avoid duplicates
2. Update to the latest version
3. Collect relevant information

Include in your bug report:
- **Description**: Clear description of the bug
- **Steps to Reproduce**: Numbered steps to reproduce
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, Node version, MySQL version
- **Screenshots**: If applicable
- **Logs**: Error messages or console output

### Suggesting Features

Before suggesting a feature:
1. Check if it's already planned (see roadmap in README)
2. Check existing feature requests
3. Consider if it fits the project scope

Include in your feature request:
- **Use Case**: Why is this feature needed?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other solutions you've considered
- **Additional Context**: Mockups, examples, references

### Pull Requests

#### Before Starting

1. **Discuss First**: For major changes, open an issue first
2. **Check Roadmap**: Ensure it aligns with project direction
3. **One Feature Per PR**: Keep PRs focused and manageable

#### Development Workflow

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/LeaveSync.git
cd LeaveSync

# 3. Add upstream remote
git remote add upstream https://github.com/mnthaqif/LeaveSync.git

# 4. Create a feature branch
git checkout -b feature/your-feature-name

# 5. Install dependencies
npm install

# 6. Make your changes
# Follow the coding standards below

# 7. Test your changes
npm run build:backend
cd frontend && npx tsc --noEmit

# 8. Commit with clear message
git add .
git commit -m "Add: Brief description of your changes"

# 9. Push to your fork
git push origin feature/your-feature-name

# 10. Create Pull Request on GitHub
```

#### Commit Message Guidelines

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: Add leave approval workflow
fix: Resolve connected leave detection bug
docs: Update API documentation
refactor: Simplify calendar rendering logic
```

#### Pull Request Guidelines

Your PR should:
1. **Have a clear title** describing the change
2. **Reference issues** using #issue-number
3. **Include description** of what and why
4. **Pass all checks** (if CI/CD is set up)
5. **Have minimal changes** - only what's necessary
6. **Update docs** if changing functionality
7. **Include tests** if applicable

PR Description Template:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123

## Testing
How was this tested?

## Screenshots
If applicable, add screenshots

## Checklist
- [ ] Code follows project style
- [ ] Self-reviewed the code
- [ ] Commented complex logic
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tested locally
```

## Coding Standards

### TypeScript

```typescript
// Use TypeScript for all new files
interface User {
  id: number;
  name: string;
  email: string;
}

// Use explicit types
function getUser(id: number): User {
  // implementation
}

// Use async/await over promises
async function fetchData(): Promise<User[]> {
  const response = await api.get('/users');
  return response.data;
}
```

### React/React Native

```typescript
// Use functional components with hooks
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // side effects
  }, [dependencies]);
  
  return <View>...</View>;
};

// Use TypeScript for props
interface Props {
  title: string;
  onPress: () => void;
}
```

### Backend

```typescript
// Use async/await for database operations
export const getLeaves = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM leave_record');
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Use parameterized queries to prevent SQL injection
const [rows] = await pool.query(
  'SELECT * FROM user WHERE id = ?',
  [userId]
);
```

### Styling

```typescript
// Use NativeWind classes
<View className="bg-white rounded-xl p-4 shadow-sm">
  <Text className="text-lg font-bold text-gray-800">Title</Text>
</View>

// For dynamic styles, use style prop
<View style={{ backgroundColor: dynamicColor }}>
```

### File Organization

```
src/
├── components/       # Reusable UI components
├── screens/         # Screen/page components
├── services/        # API and business logic
├── types/           # TypeScript type definitions
└── utils/           # Helper functions
```

### Naming Conventions

- **Files**: PascalCase for components (`CalendarView.tsx`)
- **Variables**: camelCase (`userName`, `isActive`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`, `MAX_ITEMS`)
- **Types/Interfaces**: PascalCase (`User`, `LeaveRecord`)
- **Functions**: camelCase (`getUserById`, `formatDate`)

## Documentation Standards

### Code Comments

```typescript
// Comment why, not what (code should be self-explanatory)

// Good
// Check if leave is adjacent to weekend or public holiday
const isConnected = await detectConnectedLeave(start, end, state);

// Bad
// Set isConnected to result of detectConnectedLeave function
const isConnected = await detectConnectedLeave(start, end, state);
```

### API Documentation

When adding endpoints, update `docs/API.md`:

```markdown
### New Endpoint

GET /api/new-endpoint

Description of what it does.

**Query Parameters:**
- `param1` (required): Description

**Response:**
\`\`\`json
{
  "key": "value"
}
\`\`\`
```

### README Updates

Update README.md if your changes affect:
- Installation steps
- Configuration
- Available commands
- Features list

## Testing

### Manual Testing

Before submitting:
1. Test all affected functionality
2. Test on multiple screen sizes (if UI change)
3. Check browser console for errors
4. Verify API responses
5. Test error cases

### Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors or warnings
- [ ] Existing features still work
- [ ] Backend compiles without errors
- [ ] Frontend compiles without errors
- [ ] Mobile-responsive (if UI change)
- [ ] Handles edge cases
- [ ] Error messages are user-friendly

## Review Process

1. **Automated Checks**: CI/CD runs (if configured)
2. **Code Review**: Maintainer reviews code
3. **Testing**: Reviewer tests functionality
4. **Feedback**: Address review comments
5. **Approval**: Maintainer approves
6. **Merge**: PR is merged to main branch

## Getting Help

- **Questions**: Open a discussion or issue
- **Bugs**: Report via GitHub issues
- **Features**: Suggest via feature requests
- **Code**: Ask in PR comments

## Recognition

Contributors will be:
- Listed in release notes
- Mentioned in README (for significant contributions)
- Added to contributors list

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to LeaveSync! 🎉
