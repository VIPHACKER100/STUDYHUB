-- Notes & Assignment Sharing Platform - Database Schema
-- PostgreSQL Database Schema with Tables for Platform and Messaging Features

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE PLATFORM TABLES
-- =====================================================

-- Users table with role-based access
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
    full_name VARCHAR(100),
    avatar_url VARCHAR(500),
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Email verification tokens
CREATE TABLE verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Blocked Users
CREATE TABLE blocked_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocker_id UUID REFERENCES users(id) ON DELETE CASCADE,
    blocked_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(blocker_id, blocked_id)
);

-- Uploads (Notes & Assignments)
CREATE TABLE uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- pdf, doc, ppt, txt, image
    file_size BIGINT NOT NULL, -- in bytes
    subject VARCHAR(100),
    category VARCHAR(50) NOT NULL, -- notes, assignment, exam_prep, etc.
    tags TEXT[], -- Array of tags
    privacy VARCHAR(20) DEFAULT 'public' CHECK (privacy IN ('public', 'private', 'class')),
    class_id UUID, -- For class-specific uploads
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    is_approved BOOLEAN DEFAULT TRUE,
    upload_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments/Ratings for uploads
CREATE TABLE upload_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    upload_id UUID REFERENCES uploads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(upload_id, user_id) -- One rating per user per upload
);

-- Downloads tracking
CREATE TABLE downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    upload_id UUID REFERENCES uploads(id) ON DELETE CASCADE,
    downloaded_at TIMESTAMP DEFAULT NOW()
);

-- Bookmarks
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    upload_id UUID REFERENCES uploads(id) ON DELETE CASCADE,
    collection_name VARCHAR(100) DEFAULT 'default',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, upload_id)
);

-- Reports (for content moderation)
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content_type VARCHAR(50) NOT NULL, -- upload, message, user, room
    content_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    admin_notes TEXT,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- MESSAGING TABLES
-- =====================================================

-- Direct Conversations
CREATE TABLE direct_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
    last_message_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_conversation UNIQUE(user1_id, user2_id),
    CONSTRAINT different_users CHECK (user1_id != user2_id)
);

-- Direct Messages
CREATE TABLE direct_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES direct_conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachment_url VARCHAR(500),
    attachment_type VARCHAR(50),
    reply_to_id UUID REFERENCES direct_messages(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Anonymous Chat Rooms
CREATE TABLE anonymous_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    subject VARCHAR(100),
    tags TEXT[],
    room_type VARCHAR(50) DEFAULT 'study_group' CHECK (room_type IN ('study_group', 'assignment_help', 'exam_prep', 'general')),
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT TRUE,
    is_temporary BOOLEAN DEFAULT FALSE,
    max_participants INTEGER DEFAULT 50,
    participant_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Anonymous Messages
CREATE TABLE anonymous_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES anonymous_rooms(id) ON DELETE CASCADE,
    anonymous_id VARCHAR(50) NOT NULL, -- Random identifier like "Purple Panda"
    message TEXT NOT NULL,
    attachment_url VARCHAR(500),
    is_system_message BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Anonymous Sessions (track who's in which room)
CREATE TABLE anonymous_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES anonymous_rooms(id) ON DELETE CASCADE,
    anonymous_id VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT NOW(),
    left_at TIMESTAMP
);

-- Message Reactions (emoji reactions to messages)
CREATE TABLE message_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL, -- Can be direct_message or anonymous_message
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('direct', 'anonymous')),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(message_id, user_id, emoji)
);

-- =====================================================
-- NOTIFICATION TABLES
-- =====================================================

-- Unified Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- upload, message, announcement, deadline, rating, etc.
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    link_url VARCHAR(500),
    related_id UUID, -- ID of related content (upload, message, etc.)
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Notification Preferences
CREATE TABLE notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email_messages BOOLEAN DEFAULT TRUE,
    email_uploads BOOLEAN DEFAULT TRUE,
    email_announcements BOOLEAN DEFAULT TRUE,
    push_messages BOOLEAN DEFAULT TRUE,
    push_uploads BOOLEAN DEFAULT TRUE,
    push_announcements BOOLEAN DEFAULT TRUE,
    sound_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User Message Preferences
CREATE TABLE message_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    allow_direct_messages BOOLEAN DEFAULT TRUE,
    allow_group_invites BOOLEAN DEFAULT TRUE,
    show_online_status BOOLEAN DEFAULT TRUE,
    message_notifications BOOLEAN DEFAULT TRUE,
    email_message_notifications BOOLEAN DEFAULT FALSE,
    auto_archive_after_days INTEGER DEFAULT 30,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ADMIN TABLES
-- =====================================================

-- Admin Announcements
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'class', 'platform', 'maintenance')),
    target_audience VARCHAR(50) DEFAULT 'all', -- all, students, teachers, specific_class
    class_id UUID, -- For class-specific announcements
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_published BOOLEAN DEFAULT FALSE,
    scheduled_for TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- System Settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User Activity Log (for admin analytics)
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL, -- login, upload, download, message, etc.
    resource_type VARCHAR(50), -- upload, message, user, etc.
    resource_id UUID,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Upload indexes
CREATE INDEX idx_uploads_user_id ON uploads(user_id);
CREATE INDEX idx_uploads_category ON uploads(category);
CREATE INDEX idx_uploads_subject ON uploads(subject);
CREATE INDEX idx_uploads_tags ON uploads USING GIN(tags);
CREATE INDEX idx_uploads_upload_date ON uploads(upload_date DESC);
CREATE INDEX idx_uploads_average_rating ON uploads(average_rating DESC);

-- Message indexes
CREATE INDEX idx_direct_conversations_user1 ON direct_conversations(user1_id);
CREATE INDEX idx_direct_conversations_user2 ON direct_conversations(user2_id);
CREATE INDEX idx_direct_messages_conversation ON direct_messages(conversation_id);
CREATE INDEX idx_direct_messages_sender ON direct_messages(sender_id);
CREATE INDEX idx_direct_messages_created ON direct_messages(created_at DESC);

-- Anonymous room indexes
CREATE INDEX idx_anonymous_rooms_public ON anonymous_rooms(is_public) WHERE is_active = TRUE;
CREATE INDEX idx_anonymous_rooms_type ON anonymous_rooms(room_type);
CREATE INDEX idx_anonymous_messages_room ON anonymous_messages(room_id);

-- Notification indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Report indexes
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_content ON reports(content_type, content_id);

-- Activity log index
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_created ON activity_log(created_at DESC);

-- =====================================================
-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_uploads_updated_at BEFORE UPDATE ON uploads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_upload_ratings_updated_at BEFORE UPDATE ON upload_ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INITIAL DATA (Admin User & Settings)
-- =====================================================

-- Insert default admin user (password: admin123 - CHANGE IN PRODUCTION!)
-- Password hash for 'admin123' using bcryptjs with salt rounds 10
INSERT INTO users (username, email, password_hash, role, full_name, is_verified, is_active)
VALUES ('admin', 'admin@notesplatform.com', '$2a$10$YourHashedPasswordHere', 'admin', 'System Administrator', TRUE, TRUE);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('platform_name', 'StudyHub', 'Name of the platform'),
('max_upload_size', '52428800', 'Maximum file upload size in bytes (50MB)'),
('allow_anonymous_rooms', 'true', 'Allow users to create anonymous chat rooms'),
('require_email_verification', 'true', 'Require email verification for new users'),
('enable_file_compression', 'true', 'Enable automatic file compression for uploads');

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for trending uploads
CREATE VIEW trending_uploads AS
SELECT 
    u.*,
    us.username as uploader_username,
    us.full_name as uploader_name
FROM uploads u
JOIN users us ON u.user_id = us.id
WHERE u.is_approved = TRUE
  AND u.privacy = 'public'
ORDER BY (u.download_count + u.view_count * 0.1 + u.average_rating * 10) DESC;

-- View for active anonymous rooms
CREATE VIEW active_anonymous_rooms AS
SELECT 
    r.*,
    COUNT(DISTINCT s.user_id) as active_participants
FROM anonymous_rooms r
LEFT JOIN anonymous_sessions s ON r.id = s.room_id AND s.left_at IS NULL
WHERE r.is_active = TRUE
  AND (r.expires_at IS NULL OR r.expires_at > NOW())
GROUP BY r.id
ORDER BY active_participants DESC, r.created_at DESC;
