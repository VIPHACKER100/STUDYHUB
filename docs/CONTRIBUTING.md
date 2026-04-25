# Contributing to StudyHub

Thank you for your interest in contributing to StudyHub! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:
- Experience level
- Gender identity and expression
- Sexual orientation
- Disability
- Personal appearance
- Body size
- Race
- Ethnicity
- Age
- Religion
- Nationality

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other contributors

### Unacceptable Behavior

- Harassment, trolling, or discriminatory comments
- Personal attacks or insults
- Publishing others' private information
- Other conduct that could be considered inappropriate

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14.x
- Git
- A code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/studyhub.git
cd studyhub
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/studyhub.git
```

### Setup Development Environment

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env
# Edit .env with your local configuration
```

3. Setup database:
```bash
cd server
npm run db:setup
```

4. Start development servers:
```bash
cd ..
npm run dev
```

## 💻 Development Workflow

### Branch Naming Convention

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/what-changed` - Documentation updates
- `refactor/what-changed` - Code refactoring
- `test/what-added` - Test additions

Example: `feature/video-calling`, `fix/message-deletion-bug`

### Making Changes

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes following our [coding standards](#coding-standards)

3. Test your changes thoroughly

4. Commit your changes following our [commit guidelines](#commit-guidelines)

5. Push to your fork:
```bash
git push origin feature/your-feature-name
```

## 📝 Coding Standards

### JavaScript/React

- Use ES6+ features
- Use functional components with hooks (React)
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

#### Example:
```javascript
/**
 * Fetches user profile by username
 * @param {string} username - The username to fetch
 * @returns {Promise<Object>} User profile data
 */
async function getUserProfile(username) {
    const response = await api.get(`/users/${username}`);
    return response.data;
}
```

### File Organization

```
component/
├── ComponentName.jsx       # Component file
├── ComponentName.test.js   # Tests
└── index.js                # Export
```

### CSS/Styling

- Use TailwindCSS utility classes
- Follow mobile-first approach
- Use semantic color names from theme
- Avoid inline styles when possible

### Backend

- Use async/await for asynchronous operations
- Handle errors properly with try-catch
- Validate all inputs
- Use parameterized queries (prevent SQL injection)
- Follow RESTful API conventions

## 📦 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(messaging): add file attachment support

- Added multer middleware for file uploads
- Updated MessageInput component
- Added file preview in chat

Closes #123
```

```
fix(auth): resolve token expiration issue

Fixed bug where JWT tokens were expiring prematurely
due to incorrect time calculation.

Fixes #456
```

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No console errors or warnings

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] Added tests
- [ ] Tests passing
```

### Review Process

1. Submit PR with clear description
2. Wait for automated checks to pass
3. Address reviewer feedback
4. Maintainer will merge when approved

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests (when available)
cd client
npm test
```

### Writing Tests

- Write tests for new features
- Update tests for bug fixes
- Aim for meaningful test coverage
- Use descriptive test names

#### Example:
```javascript
describe('User Authentication', () => {
    it('should register a new user successfully', async () => {
        const userData = {
            username: 'testuser',
            email: 'viphacker.100.org@gmail.com',
            password: 'password123'
        };
        
        const response = await request(app)
            .post('/api/auth/register')
            .send(userData);
        
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('token');
    });
});
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for functions
- Document complex algorithms
- Explain non-obvious code decisions
- Keep comments up-to-date

### README Updates

- Update README.md for new features
- Add usage examples
- Update setup instructions if needed

### API Documentation

- Document new endpoints in API_DOCUMENTATION.md
- Include request/response examples
- Note authentication requirements

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 96]
- Version: [e.g., 1.0.0]

**Additional context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of desired solution

**Describe alternatives you've considered**
Alternative solutions or features

**Additional context**
Mockups, examples, or references
```

## 🏆 Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

## 📞 Getting Help

- **Documentation**: Check README.md, SETUP.md, and other docs
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact maintainers for sensitive issues

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to StudyHub! 🎓✨


