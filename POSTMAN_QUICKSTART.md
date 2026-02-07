# Postman Quick Reference Card

## 🚀 Quick Start

### 1. Import the Collection
1. Open Postman
2. Click **Import** button (top left)
3. Select `frenchify-api.postman_collection.json`
4. Click **Import**

### 2. Set Your Auth Token
1. Click **Environments** (left sidebar)
2. Create new environment: **"Local Dev"**
3. Add variable: `authToken` = (paste your Firebase ID token)
4. Select "Local Dev" from dropdown (top right)

### 3. Start Testing!
- Public endpoints work immediately
- Protected endpoints need auth token

---

## 📍 Base URL
```
http://127.0.0.1:5001/frechify/us-central1/api
```

---

## 🔑 Getting Firebase Auth Token

### From Browser Console (Easiest):
```javascript
firebase.auth().currentUser.getIdToken().then(token => console.log(token))
```

### Token Expires After: **1 hour**

---

## 🧪 Testing Workflow

### Public Endpoints (No Auth):
1. ✅ `GET /students/courses` - Browse courses
2. ✅ `GET /students/courses/:id` - Course details
3. ✅ `POST /users/sync` - Sync user

### Protected Endpoints (Need Token):
1. 🔐 Add Bearer Token in Authorization tab
2. 🔐 `GET /users/me` - Test auth works
3. 🔐 Test role-specific endpoints

---

## 🎯 Common Request Examples

### Create Course (Teacher)
```http
POST /courses
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
  "title": "French Grammar 101",
  "description": "Learn basic grammar",
  "category": "grammar",
  "isPaid": false
}
```

### Ask Question (Paid Student)
```http
POST /questions/course123
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
  "content": "How do I use subjunctive mood?"
}
```

### Filter Courses by Category
```http
GET /students/courses?category=conversation
```

---

## 🔍 Response Status Codes

| Code | Meaning | Common Cause |
|------|---------|--------------|
| 200 | Success | Request completed successfully |
| 201 | Created | Resource created (POST) |
| 400 | Bad Request | Missing/invalid data |
| 401 | Unauthorized | No token or expired token |
| 403 | Forbidden | Wrong role (e.g., student accessing teacher endpoint) |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend error |

---

## 🛠️ Troubleshooting

### "Cannot GET /api/..."
❌ **Wrong**: `http://127.0.0.1:5001/api/students/courses`  
✅ **Correct**: `http://127.0.0.1:5001/frechify/us-central1/api/students/courses`

### "Unauthorized: No token provided"
- Check Authorization tab has "Bearer Token" selected
- Verify token is not expired (get fresh token)
- Make sure environment is selected (top right)

### "Forbidden: Teachers only"
- You're using a student token on a teacher endpoint
- Get token from a user with correct role

### Connection Refused
- Firebase emulator not running
- Run: `firebase emulators:start --only functions`

---

## 📝 Testing Checklist

### User Routes
- [ ] POST /users/sync (public)
- [ ] GET /users/me (authenticated)

### Student Routes
- [ ] GET /students/courses (public)
- [ ] GET /students/courses?category=grammar (public)
- [ ] GET /students/courses/:id (public)
- [ ] GET /students/courses/:id/materials (authenticated)

### Course Routes (Teacher)
- [ ] POST /courses
- [ ] PATCH /courses/:courseId
- [ ] DELETE /courses/:courseId
- [ ] POST /courses/:courseId/materials
- [ ] PATCH /courses/:courseId/materials/:materialId
- [ ] DELETE /courses/:courseId/materials/:materialId
- [ ] PATCH /courses/:courseId/publish

### Question Routes
- [ ] POST /questions/:courseId (paid tier)
- [ ] GET /questions/:courseId (public)
- [ ] PATCH /questions/:courseId/:questionId/answer (teacher)
- [ ] GET /questions/teacher/unanswered (teacher)

### Admin Routes
- [ ] POST /admin/approve-teacher
- [ ] POST /admin/manage-subscription
- [ ] DELETE /admin/users/:uid
- [ ] POST /admin/create-admin

---

## 💡 Pro Tips

1. **Use Variables**: Store `courseId`, `materialId` as collection variables
2. **Add Tests**: Verify status codes automatically
3. **Save Responses**: Use "Save Response" to create examples
4. **Collection Runner**: Test all endpoints at once
5. **Export Collection**: Share with team (without tokens!)

---

## 📚 Resources

- Full Guide: `postman_testing_guide.md`
- Collection File: `frenchify-api.postman_collection.json`
- API Documentation: `.antigravityrules`

---

**Happy Testing! 🎉**
