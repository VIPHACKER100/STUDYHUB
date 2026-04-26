/**
 * Mock Database Layer
 * Provides an in-memory database for testing and demonstration
 */

const storage = {
    users: [
        {
            id: 'demo-uuid-1',
            username: 'demo_user',
            email: 'demo@example.com',
            password_hash: '$2a$10$d.bWG9b29KrODMduYaf3w.qksuKno2RGqVW2n0NgN5mHNIXkiA1fK', // "password123"
            role: 'student',
            full_name: 'Demo Student',
            is_verified: true,
            is_active: true,
            created_at: new Date()
        }
    ],
    messages: [],
    rooms: [
        { id: 'room-1', name: 'Mathematics', slug: 'mathematics', description: 'Advanced Calculus', created_by: 'demo-uuid-1' },
        { id: 'room-2', name: 'Physics', slug: 'physics', description: 'Quantum Mechanics', created_by: 'demo-uuid-1' }
    ],
    notes: [],
    notifications: []
};

export const mockQuery = async (text, params) => {
    const query = text.toLowerCase().trim();
    console.log('[MOCK DB] Executing:', query, params);

    // AUTH: Find by Email or Username
    if (query.includes('from users where email = $1 or username = $1')) {
        const user = storage.users.find(u => u.email === params[0] || u.username === params[0]);
        return { rows: user ? [user] : [] };
    }

    // AUTH: Find by Email
    if (query.includes('from users where email = $1')) {
        const user = storage.users.find(u => u.email === params[0]);
        return { rows: user ? [user] : [] };
    }

    // AUTH: Find by Username
    if (query.includes('from users where username = $1')) {
        const user = storage.users.find(u => u.username === params[0]);
        return { rows: user ? [user] : [] };
    }

    // AUTH: Create User
    if (query.includes('insert into users')) {
        const newUser = {
            id: `user-${Date.now()}`,
            username: params[0],
            email: params[1],
            password_hash: params[2],
            role: params[3],
            full_name: params[4],
            is_verified: false,
            is_active: true,
            created_at: new Date()
        };
        storage.users.push(newUser);
        return { rows: [newUser] };
    }

    // ROOMS: Get All
    if (query.includes('from rooms')) {
        return { rows: storage.rooms };
    }

    // Default empty result for unhandled queries
    return { rows: [], rowCount: 0 };
};

export default storage;
